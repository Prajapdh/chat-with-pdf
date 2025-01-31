"use client"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { ScrollArea } from "@/app/components/ui/scroll-area"
import { useChat } from "ai/react"

export function ChatComponent({ chatId }: { chatId: string }) {
  const { messages, input, handleInputChange, handleSubmit } = useChat()

  return (
    <div className="flex flex-col w-1/3 p-4 border-l">
      <ScrollArea className="flex-1 mb-4">
        {messages.map((message, i) => (
          <div key={i} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
            <div
              className={`inline-block p-2 rounded-lg ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </ScrollArea>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input value={input} onChange={handleInputChange} placeholder="Type your message..." />
        <Button type="submit">Send</Button>
      </form>
    </div>
  )
}

