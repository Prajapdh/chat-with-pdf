import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { chats } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle } from "lucide-react"

export default async function ChatsPage() {
  const { userId } = await auth()
  if (!userId) {
    return redirect("/sign-in")
  }

  const userChats = await db.select().from(chats).where(eq(chats.userId, userId)).orderBy(desc(chats.createdAt))

  return (
    <div className="container mx-auto p-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Your Chats</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <MessageCircle className="mr-2 h-6 w-6" />
            All Chats
          </CardTitle>
          <CardDescription>View and access all your PDF chats</CardDescription>
        </CardHeader>
        <CardContent>
          {userChats.length > 0 ? (
            <ul className="space-y-2">
              {userChats.map((chat) => (
                <li key={chat.id}>
                  <Button variant="outline" asChild className="w-full justify-start text-left">
                    <Link href={`/chat/${chat.id}`} className="truncate">
                      {chat.pdfName}
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No chats yet. Upload a PDF to get started!</p>
          )}
        </CardContent>
      </Card>
      <div className="mt-8 text-center">
        <Button asChild>
          <Link href="/upload">Upload New PDF</Link>
        </Button>
      </div>
    </div>
  )
}

