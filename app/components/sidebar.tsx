"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MessageSquare, Settings, Upload } from "lucide-react"

const Sidebar = () => {
  const pathname = usePathname()

  const links = [
    { href: "/chat", label: "Chat", icon: MessageSquare },
    { href: "/upload", label: "Upload", icon: Upload },
    { href: "/settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="flex flex-col h-full w-64 bg-muted p-4 border-r">
      <nav className="flex-1">
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`flex items-center p-2 rounded-lg hover:bg-muted-foreground/10 ${
                  pathname === link.href ? "bg-muted-foreground/10" : ""
                }`}
              >
                <link.icon className="w-5 h-5 mr-3" />
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar

