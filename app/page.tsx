// ./app/page.tsx

import Link from "next/link"
import { Button } from "@//components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@//components/ui/card"
import { MessageSquare, FileText, Zap, Shield, ArrowRight, Upload } from "lucide-react"
import { auth } from "@clerk/nextjs/server"
import { checkSubscription } from "@/lib/subscription"
import SubscriptionButton from "@//components/SubscriptionButton"
import { db } from "@/lib/db"
import { chats } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export default async function Home() {
  const { userId } = await auth()
  const isPro = userId ? await checkSubscription(userId) : false

  let firstChat
  if (userId) {
    firstChat = await db.select().from(chats).where(eq(chats.userId, userId))
    if (firstChat) {
      firstChat = firstChat[0]
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <section className="text-center py-20">
        <h1 className="text-4xl font-bold mb-4">Chat with Your PDFs</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Unlock the power of your documents with AI-driven conversations. Get instant answers and insights from your
          PDFs.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button size="lg" asChild>
            <Link href="/upload">
              Upload PDF <Upload className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          {firstChat && (
            <Button size="lg" variant="outline" asChild>
              <Link href={`/chat/${firstChat.id}`}>
                Continue Chat <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
          {userId && (
            <SubscriptionButton isPro={isPro} />
          )}
          
        </div>
      </section>

      <section className="py-20 w-full">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: MessageSquare,
                title: "Interactive Chat",
                description:
                  "Engage in natural conversations with your PDFs, asking questions and receiving instant responses.",
              },
              {
                icon: FileText,
                title: "Multiple PDFs",
                description:
                  "Upload and analyze multiple PDFs simultaneously, cross-referencing information effortlessly.",
              },
              {
                icon: Zap,
                title: "Fast Processing",
                description: "Experience lightning-fast document processing and response times powered by advanced AI.",
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description: "Your documents are encrypted and processed securely, ensuring your data remains private.",
              },
            ].map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <feature.icon className="w-10 h-10 mb-2 text-primary" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 w-full text-center bg-muted">
        <h2 className="text-3xl font-bold mb-4">Ready to Chat with Your PDFs?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of professionals and students who are already benefiting from AI-powered document interactions.
        </p>
        <Button size="lg" asChild>
          <Link href="/upload">Start Now</Link>
        </Button>
      </section>
    </div>
  )
}

