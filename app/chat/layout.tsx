import { useUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { Sidebar } from "@/app/components/chat/sidebar"
import type React from "react" // Added import for React

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isSignedIn } = useUser()

  if (!isSignedIn) {
    redirect("/sign-in")
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  )
}

