"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

// This is a mock function. Replace with actual subscription check.
const checkSubscription = async () => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return { tier: "free", uploadsRemaining: 0 }
}

export default function UploadButton({ children }: { children: React.ReactNode }) {
  const [isChecking, setIsChecking] = useState(false)
  const router = useRouter()

  const handleUpload = async () => {
    setIsChecking(true)
    const subscription = await checkSubscription()
    setIsChecking(false)

    if (subscription.tier === "free" && subscription.uploadsRemaining === 0) {
      router.push("/pricing")
    } else {
      router.push("/upload")
    }
  }

  if (isChecking) {
    return <Button disabled>Checking subscription...</Button>
  }

  return (
    <div onClick={handleUpload} className="cursor-pointer">
      {children}
    </div>
  )
}

