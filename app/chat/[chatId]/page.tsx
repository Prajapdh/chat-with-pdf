// ./app/chat/[chatId/page.tsx

import ChatComponent from "@/app/components/ChatComponent"
import ChatSideBar from "@/app/components/ChatSideBar"
import PDFViewer from "@/app/components/PDFViewer"
import { db } from "@/lib/db"
import { chats } from "@/lib/db/schema"
import { checkSubscription } from "@/lib/subscription"
import { auth } from "@clerk/nextjs/server"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"

type Props = {
  params: {
    chatId: string
  }
}

const ChatPage = async ({ params }: Props) => {
  const { chatId } = await params
  const { userId } = await auth()
  if (!userId) {
    return redirect("/sign-in")
  }
  const _chats = await db.select().from(chats).where(eq(chats.userId, userId))
  if (!_chats) {
    return redirect("/")
  }
  if (!_chats.find((chat) => chat.id === Number.parseInt(chatId))) {
    return redirect("/")
  }

  const currentChat = _chats.find((chat) => chat.id === Number.parseInt(chatId))
  const isPro = await checkSubscription(userId)

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-3.5rem)]">
      <div className="w-full md:w-64 p-4 bg-muted">
        <ChatSideBar chats={_chats} chatId={Number.parseInt(chatId)} isPro={isPro} />
      </div>
      <div className="flex-1 flex flex-col md:flex-row">
        <div className="h-1/2 md:h-full md:w-1/2 p-4 overflow-auto">
          <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
        </div>
        <div className="h-1/2 md:h-full md:w-1/2 border-t md:border-t-0 md:border-l border-border">
          <ChatComponent chatId={Number.parseInt(chatId)} />
        </div>
      </div>
    </div>
  )
}

export default ChatPage

