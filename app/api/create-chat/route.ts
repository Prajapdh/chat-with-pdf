import { db } from "@/lib/db"; // Import the database instance
import { chats } from "@/lib/db/schema"; // Import the chats schema
import { loadSupabaseIntoPinecone } from "@/lib/pinecone"; // Import the function to load data into Pinecone
import { getSupabaseUrl } from "@/lib/supabase/supabaseStorage"; // Import the function to get the Supabase URL
import { auth } from '@clerk/nextjs/server'; // Import the authentication function from Clerk
import { NextResponse } from "next/server"; // Import Next.js response helper

// /api/create-chat
export async function POST(req: Request, res: Response) {
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