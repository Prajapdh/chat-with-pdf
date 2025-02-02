// ./app/components/Header.tsx

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUser, UserButton } from "@clerk/nextjs"
import { Button } from "@/app/components/ui/button"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

const Header = () => {
  const pathname = usePathname()
  const { isSignedIn } = useUser()
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              ChatPDF
            </Link>
          </div>
          <nav className="hidden md:flex space-x-4">
            <Link href="/" className={`text-sm ${pathname === "/" ? "text-primary" : "text-muted-foreground"}`}>
              Home
            </Link>
            <Link
              href="/chats"
              className={`text-sm ${pathname === "/chats" ? "text-primary" : "text-muted-foreground"}`}
            >
              Chats
            </Link>
            <Link
              href="/pricing"
              className={`text-sm ${pathname === "/pricing" ? "text-primary" : "text-muted-foreground"}`}
            >
              Pricing
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            {!isSignedIn && (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm">Sign up</Button>
                </Link>
              </>
            )}
            {isSignedIn && <UserButton afterSignOutUrl="/" />}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

