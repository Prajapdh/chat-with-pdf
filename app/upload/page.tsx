import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { chats } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import FileUpload from "@/app/components/FileUpload"
import Link from "next/link"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card"
import { checkAndUpdateUploadLimit, checkSubscription } from "@/lib/subscription"
import { MessageCircle, Upload, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/app/components/ui/tooltip"
import { ScrollArea } from "@/app/components/ui/scroll-area"

export default async function UploadPage() {
  const { userId } = await auth()
  if (!userId) {
    return redirect("/sign-in")
  }

  const userChats = await db.select().from(chats).where(eq(chats.userId, userId)).orderBy(desc(chats.createdAt))
  const canUpload = await checkAndUpdateUploadLimit(userId)
  const isPro = await checkSubscription(userId)

  return (
    <div className="container mx-auto p-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Upload PDF & Chat</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Upload className="mr-2 h-6 w-6" />
                Upload New PDF
              </CardTitle>
              <CardDescription>Upload a new PDF to start a chat. Max file size: 10MB.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <FileUpload />
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Tips for best results:</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  <li>Ensure your PDF is text-searchable</li>
                  <li>Use clear, well-formatted documents</li>
                  <li>Break large documents into smaller sections</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <MessageCircle className="mr-2 h-6 w-6" />
                Your Chats
              </CardTitle>
              <CardDescription>Select a chat to continue or upload a new PDF</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {userChats.length > 0 ? (
                <>
                  <ScrollArea className="h-[200px] pr-4">
                    <ul className="space-y-2">
                      {userChats.slice(0, 5).map((chat) => (
                        <li key={chat.id}>
                          <Button variant="outline" asChild className="w-full justify-start text-left">
                            <Link href={`/chat/${chat.id}`} className="truncate">
                              {chat.pdfName}
                            </Link>
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                  {userChats.length > 5 && (
                    <div className="mt-4">
                      <Button variant="outline" asChild className="w-full">
                        <Link href="/chats">View All Chats</Link>
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground">No chats yet. Upload a PDF to get started!</p>
              )}
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Chat Features:</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  <li>Ask questions about your PDF content</li>
                  <li>Get summaries and key points</li>
                  <li>Extract specific information quickly</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {!isPro && (
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-2">
            {canUpload
              ? `You have ${5 - userChats.length} uploads remaining this month.`
              : "You have reached your monthly upload limit."}
          </p>
          <Button asChild>
            <Link href="/pricing">Upgrade to Pro for unlimited uploads</Link>
          </Button>
        </div>
      )}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" className="fixed bottom-4 right-4">
              <HelpCircle className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Help</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Need help? Contact our support team!</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

