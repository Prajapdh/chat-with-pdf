// ./app/components/ChatComponent.tsx

"use client"

import React from "react"
import { Input } from "./ui/input"
import { useChat } from "ai/react"
import { Button } from "./ui/button"
import { Send, Loader2 } from "lucide-react"
import MessageList from "@/app/components/MessageList"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import type { Message } from "ai"

type Props = { chatId: number }

const ChatComponent = ({ chatId }: Props) => {
  const { data, isLoading: isLoadingMessages } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>("/api/get-messages", {
        chatId,
      })
      return response.data
    },
  })

  const { input, handleInputChange, handleSubmit, messages, isLoading } = useChat({
    api: "/api/chat",
    body: {
      chatId,
    },
    initialMessages: data || [],
  })

  React.useEffect(() => {
    const messageContainer = document.getElementById("message-container")
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [])

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4" id="message-container">
        <MessageList messages={messages} isLoading={isLoadingMessages} />
        {isLoading && (
          <div className="flex justify-center items-center mt-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2 text-sm text-muted-foreground">Assistant is thinking...</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <Input value={input} onChange={handleInputChange} placeholder="Ask any question..." className="flex-1" />
          <Button type="submit" disabled={isLoading}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ChatComponent

