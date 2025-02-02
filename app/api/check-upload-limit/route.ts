import { NextResponse } from "next/server";
import { checkAndUpdateUploadLimit } from "@/lib/subscription";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const MAX_FREE_UPLOADS = 5; //
  const result = await checkAndUpdateUploadLimit(userId);
  console.log()
//   return NextResponse.json(result);
  return NextResponse.json({
    canUpload: result.canUpload,
    uploadsCount: result.uploadsCount,
    maxUploads: result.maxUploads===MAX_FREE_UPLOADS ? MAX_FREE_UPLOADS : 'Unlimited',
  });
  
}
