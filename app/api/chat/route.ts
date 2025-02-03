// ./api/chat/route.ts

import { openai } from '@ai-sdk/openai';
import { Message, streamText } from "ai";
import { getContext } from "@/lib/context";
import { db } from "@/lib/db";
import { chats, messages as _messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages, chatId } = await req.json();
    const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
    if (_chats.length != 1) {
      return NextResponse.json({ error: "chat not found" }, { status: 404 });
    }
    const fileKey = _chats[0].fileKey;
    const lastMessage = messages[messages.length - 1];
    console.log(`Last Message: ${lastMessage.content}`);
    const contextObject = await getContext(lastMessage.content, fileKey);
    const context = JSON.stringify(contextObject, null, 2); // Converts the object to a pretty-printed JSON string
    // console.log(`Context: ${context}`);

    // const prompt = {
    //   role: "system",
    //   content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
    //   The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
    //   AI is a well-behaved and well-mannered individual.
    //   AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
    //   AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
    //   AI assistant is a big fan of Pinecone and Vercel.
    //   START CONTEXT BLOCK
    //   ${context}
    //   END OF CONTEXT BLOCK
    //   AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
    //   If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
    //   AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
    //   AI assistant will not invent anything that is not drawn directly from the context.
    //   `,
    // };
    const prompt = {
      role: "system",
      content: `You are an intelligent AI assistant designed to help users analyze and extract insights from PDF documents. 
      Your primary role is to provide relevant and accurate responses based on the content of the uploaded document. 
      If a user's question relates to information found in the PDF, retrieve and summarize the relevant details.
    
      If the document does not contain enough information to fully answer the question:
      - Acknowledge the limitation.
      - Provide general guidance based on your broader knowledge.
      - Suggest what additional information the user might need or where they could find it.
    
      Maintain a conversational and engaging tone, adapting to the user's queries naturally. Be concise, yet insightful.
    
      START CONTEXT BLOCK
      ${context}
      END OF CONTEXT BLOCK
    
      When responding:
      - If the CONTEXT BLOCK provides the answer, refer to it directly.
      - If the answer requires additional context beyond the document, say: 
        "Based on the provided document, here’s what I found: [answer]. For a more complete response, consider [additional insights, external references, or general guidance]."
      - If the question cannot be answered from the document but is general, use your broader knowledge to provide useful advice.
    
      Never fabricate information that isn’t present in the document. Always clarify the source of your answer.
      `
    };
    
    const systemPrompt = prompt.content;
    // console.log(`System Prompt: ${systemPrompt}`);

    let isFirstChunk = true;
    const result = await streamText({
      model: openai('gpt-3.5-turbo'),
      system: systemPrompt,
      messages: messages.filter((message:Message) => message.role === 'user'),
      onChunk: async () => {
        if (isFirstChunk) {
          isFirstChunk = false;
          // Save user message into the database
          await db.insert(_messages).values({
            chatId: chatId,
            content: lastMessage.content,
            role: 'user',
          });
        }
        // Process each chunk as it arrives
        // For example, you can stream the chunk to the client here
      },
      onFinish: async (completion) => {
        // Save AI message into the database
        await db.insert(_messages).values({
          chatId: chatId,
          content: completion.text,
          role: 'system',
        });
      },
    });

    return result.toDataStreamResponse();

    } catch (error) {
      console.error('Error:', error);
      return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}