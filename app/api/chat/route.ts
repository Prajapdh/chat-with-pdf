// ./api/chat/route.ts

import { openai } from '@ai-sdk/openai';
import { Message, streamText } from "ai";
import { getContext } from "../../../lib/context";
import { db } from "../../../lib/db";
import { chats, messages as _messages } from "../../../lib/db/schema";
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
    console.log(`Context: ${context}`);

    const prompt = {
      role: "system",
      content: `You are an AI assistant designed to help users interact with and extract information from uploaded PDF documents. 
      You specialize in document comprehension, summarization, and information retrieval using embeddings.
    
      **Key Behaviors and Instructions:**
      - If the user has already uploaded a file and asks, **"What is this file about?"**, you must retrieve the embeddings and generate a **concise and informative summary** of the document.
      - If the user asks a question related to the document, retrieve the most relevant information from the embeddings and provide a direct answer.
      - If the user has not uploaded a file, request them to do so before proceeding.
      - If the document content does not contain the requested information, respond with: **"I'm sorry, but I couldn't find that information in the document."**
      - Never ask the user to re-upload the document once embeddings have been created; assume you always have access to it.
      - For long documents, summarize key sections instead of attempting to include all details at once.
    
      **Contextual Data Block:**
      START CONTEXT BLOCK
      ${context}
      END CONTEXT BLOCK
    
      The AI assistant will always use the CONTEXT BLOCK to retrieve embeddings and provide accurate answers. It will not request re-uploading once a file has been successfully processed.
      `,
    };
    
    const systemPrompt = prompt.content;
    console.log(`System Prompt: ${systemPrompt}`);

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