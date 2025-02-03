// ./app/components/MessageList.tsx

import { cn } from "@/lib/utils"
import type { Message } from "ai/react"
import { Loader2 } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

type Props = {
  isLoading: boolean
  messages: Message[]
}

const MessageList = ({ messages, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }
  if (!messages) return <></>
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn("flex", {
            "justify-end": message.role === "user",
            "justify-start": message.role === "assistant",
          })}
        >
          <div
            className={cn("rounded-lg px-3 py-2 max-w-[80%] shadow-md", {
              "bg-primary text-primary-foreground": message.role === "user",
              "bg-muted": message.role === "assistant",
            })}
          >
            {/* Render markdown properly */}
            <ReactMarkdown
              className="text-sm"
              remarkPlugins={[remarkGfm]}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MessageList

