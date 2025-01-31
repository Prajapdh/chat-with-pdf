"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUser, UserButton } from "@clerk/nextjs"
import { Button } from "@/app/components/ui/button"

const Header = () => {
  const pathname = usePathname();
  const {isSignedIn} = useUser();

  return (
    <header className="w-full border-b">
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
              href="/features"
              className={`text-sm ${pathname === "/features" ? "text-primary" : "text-muted-foreground"}`}
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className={`text-sm ${pathname === "/pricing" ? "text-primary" : "text-muted-foreground"}`}
            >
              Pricing
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            {!isSignedIn && (
                <>
                  <Link href='/sign-in'>
                    <Button variant="ghost" size="sm">
                      Log in
                    </Button>
                  </Link>
                  <Link href='/sign-up'>
                    <Button size="sm">Sign up</Button>
                  </Link>
                </>
              )}
            {isSignedIn && <UserButton/>}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

