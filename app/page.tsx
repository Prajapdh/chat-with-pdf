import Link from "next/link"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { MessageSquare, FileText, Zap, Shield, FileUp } from "lucide-react"
import FileUpload from "@/app/components/file-upload"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <h1 className="text-4xl font-bold mb-4">Chat with Your PDFs</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Unlock the power of your documents with AI-driven conversations. Get instant answers and insights from your
          PDFs.
        </p>
        <Button size="lg" asChild>
          <Link href="/chat">Get Started</Link>
        </Button>
      </section>

      <FileUpload />

      {/* Features Section */}
      <section className="py-20 bg-muted w-full">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <MessageSquare className="w-10 h-10 mb-2 text-primary" />
                <CardTitle>Interactive Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Engage in natural conversations with your PDFs, asking questions and receiving instant responses.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <FileText className="w-10 h-10 mb-2 text-primary" />
                <CardTitle>Multiple PDFs</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Upload and analyze multiple PDFs simultaneously, cross-referencing information effortlessly.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Zap className="w-10 h-10 mb-2 text-primary" />
                <CardTitle>Fast Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Experience lightning-fast document processing and response times powered by advanced AI.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Shield className="w-10 h-10 mb-2 text-primary" />
                <CardTitle>Secure & Private</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Your documents are encrypted and processed securely, ensuring your data remains private.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose ChatPDF?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Save Time</h3>
              <p>Quickly extract information from lengthy documents without manual searching.</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Enhance Productivity</h3>
              <p>Focus on analysis and decision-making instead of reading through pages of text.</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Gain Insights</h3>
              <p>Uncover hidden connections and insights across multiple documents effortlessly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section
      <section className="py-20 bg-muted w-full">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <p className="italic mb-4">
                  "ChatPDF has revolutionized the way I work with research papers. It's like having a research assistant
                  available 24/7!"
                </p>
                <p className="font-semibold">- Dr. Emily Chen, Research Scientist</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="italic mb-4">
                  "As a lawyer, I deal with numerous lengthy documents daily. ChatPDF has significantly reduced my
                  workload and improved my efficiency."
                </p>
                <p className="font-semibold">- Michael Johnson, Attorney</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="italic mb-4">
                  "ChatPDF is a game-changer for students. It helps me quickly understand complex textbooks and research
                  papers."
                </p>
                <p className="font-semibold">- Sarah Thompson, Graduate Student</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section> */}

      {/* Final CTA Section */}
      <section className="py-20 w-full text-center bg-muted">
        <h2 className="text-3xl font-bold mb-4">Ready to Chat with Your PDFs?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of professionals and students who are already benefiting from AI-powered document interactions.
        </p>
        <Button size="lg" asChild>
          <Link href="/signup">Start Your Free Trial</Link>
        </Button>
      </section>
    </div>
  )
}

