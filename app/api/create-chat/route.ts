// ./api/create-chat/route.ts

import { db } from "../../../lib/db"; 
import { chats } from "../../../lib/db/schema";
import { loadSupabaseIntoPinecone } from "../../../lib/pinecone"; 
import { getSupabaseUrl } from "../../../lib/supabase/supabaseStorage"; 
import { auth } from '@clerk/nextjs/server'; 
import { NextResponse } from "next/server"; 

// /api/create-chat
export async function POST(req: Request) {
  // Authenticate the user
  const { userId } = await auth();
  if (!userId) {
    // If the user is not authenticated, return a 401 Unauthorized response
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    // Parse the request body
    const body = await req.json();
    const { fileKey, fileName } = body;
    console.log(`File Name: ${body.fileName}, File Key: ${body.fileKey}`);

    // Load the PDF from Supabase into Pinecone
    await loadSupabaseIntoPinecone(fileKey);

    // Insert a new chat record into the database
    const chat_id = await db
      .insert(chats)
      .values({
        fileKey: fileKey,
        pdfName: fileName,
        pdfUrl: getSupabaseUrl(fileKey),
        userId,
      })
      .returning({
        insertedId: chats.id,
      });

    // Return the inserted chat ID in the response
    return NextResponse.json(
      {
        chat_id: chat_id[0].insertedId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    // If an error occurs, return a 500 Internal Server Error response
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}