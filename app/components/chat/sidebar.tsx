"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton } from "@clerk/nextjs"
import { Button } from "@/app/components/ui/button"
import { ScrollArea } from "@/app/components/ui/scroll-area"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  // Mock chat data - replace with actual data fetching
  const chats = [
    { id: "1", title: "Chat 1" },
    { id: "2", title: "Chat 2" },
    { id: "3", title: "Chat 3" },
  ]

  return (
    <div className={`border-r bg-muted transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}>
      <div className="flex h-16 items-center justify-between px-4">
        {!isCollapsed && <h2 className="text-lg font-semibold">Chats</h2>}
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      <div className="px-4 py-2">
        <Button className="w-full justify-start" onClick={() => console.log("New chat")}>
          <Plus className="mr-2 h-4 w-4" />
          {!isCollapsed && "New Chat"}
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="px-4 py-2">
          {chats.map((chat) => (
            <Link key={chat.id} href={`/chat/${chat.id}`}>
              <div
                className={`mb-2 rounded-lg p-2 ${pathname === `/chat/${chat.id}` ? "bg-accent" : "hover:bg-accent/50"}`}
              >
                {isCollapsed ? chat.title.charAt(0) : chat.title}
              </div>
            </Link>
          ))}
        </div>
      </ScrollArea>
      <div className="absolute bottom-4 left-4">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  )
}

