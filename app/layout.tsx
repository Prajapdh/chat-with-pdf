import "./globals.css"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "@/app/components/theme-provider"
import Header from "@/app/components/header"
import Footer from "@/app/components/footer"
import Providers from "@/app/components/Providers"
import { Toaster } from "react-hot-toast"

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
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider>
          <Providers>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <Header />
              <main>{children}</main>
              <Footer />
              <Toaster />
            </ThemeProvider>
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  )
}
