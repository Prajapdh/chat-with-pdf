"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { ZoomIn, ZoomOut } from "lucide-react"

export function PDFViewer({ chatId }: { chatId: string }) {
  const [zoom, setZoom] = useState(100)

  // Mock PDF URL - replace with actual PDF fetching based on chatId
  const pdfUrl = `/sample.pdf`

  return (
    <div className="flex-1 p-4 overflow-hidden">
      <div className="mb-4 flex justify-end space-x-2">
        <Button variant="outline" size="icon" onClick={() => setZoom(zoom - 10)}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => setZoom(zoom + 10)}>
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>
      <div className="h-[calc(100vh-8rem)] overflow-auto">
        <iframe src={`${pdfUrl}#zoom=${zoom}`} className="w-full h-full border-0" title="PDF Viewer" />
      </div>
    </div>
  )
}

