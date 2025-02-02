// ./app/components/ChatSideBar.tsx
"use client"

import type { DrizzleChat } from "../../lib/db/schema"
import Link from "next/link"
import { Button } from "./ui/button"
import { MessageCircle, PlusCircle } from "lucide-react"
import { cn } from "../../lib/utils"
import SubscriptionButton from "@/app/components/SubscriptionButton"

type Props = {
  chats: DrizzleChat[]
  chatId: number
  isPro: boolean
}

const ChatSideBar = ({ chats, chatId, isPro }: Props) => {
  return (
    <div className="flex flex-col h-full">
      <Link href="/upload">
        <Button className="w-full mb-4">
          <PlusCircle className="mr-2 w-4 h-4" />
          New Chat
        </Button>
      </Link>

      <div className="flex-1 overflow-auto">
        {chats.map((chat) => (
          <Link key={chat.id} href={`/chat/${chat.id}`}>
            <div
              className={cn("flex items-center rounded-lg p-3 text-sm transition-colors hover:bg-muted", {
                "bg-muted": chat.id === chatId,
              })}
            >
              <MessageCircle className="mr-2 w-4 h-4" />
              <p className="line-clamp-1">{chat.pdfName}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-auto pt-4">
        <SubscriptionButton isPro={isPro} />
      </div>
    </div>
  )
}

export default ChatSideBar

