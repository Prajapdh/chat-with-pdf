import { ChatComponent } from "@/app/components/chat/chat-completion"
import { PDFViewer } from "@/app/components/chat/pdf-viewer"

export default function ChatPage({ params }: { params: { chatId: string } }) {
  return (
    <div className="flex h-full">
      <PDFViewer chatId={params.chatId} />
      <ChatComponent chatId={params.chatId} />
    </div>
  )
}

