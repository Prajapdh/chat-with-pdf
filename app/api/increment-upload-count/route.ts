import { NextResponse } from "next/server";
import { incrementUploadCount } from "@/lib/subscription";
import { auth } from "@clerk/nextjs/server";

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await incrementUploadCount(userId);
  return NextResponse.json(result);
}
