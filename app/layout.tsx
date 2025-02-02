// ./app/layout.tsx

import "./globals.css"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "@/app/components/ThemeProvider"
import Header from "@/app/components/Header"
import Footer from "@/app/components/Footer"
import Providers from "@/app/components/Providers"
import { Toaster } from "react-hot-toast"
import type React from "react" // Added import for React

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Chat with PDF",
  description: "Interact with your PDFs using AI",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
        <ClerkProvider>
          <Providers>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">{children}</main>
                <Footer />
              </div>
              <Toaster />
            </ThemeProvider>
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  )
}

