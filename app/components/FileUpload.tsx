"use client"

import { useState, useCallback, useEffect } from "react"
import { Upload, Loader2, AlertCircle, CheckCircle, Info } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { useUser } from "@clerk/nextjs"
import { uploadToSupabase } from "../../lib/supabase/supabaseStorage"
import axios from "axios"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { Progress } from "../components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"
import { Button } from "../components/ui/button"

export default function FileUpload() {
  const { user } = useUser()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [canUpload, setCanUpload] = useState(true)
  const [uploadsCount, setUploadsCount] = useState(0)
  const [maxUploads, setMaxUploads] = useState(5)
  const router = useRouter()

  const { data: uploadLimitData, refetch: refetchUploadLimit } = useQuery({
    queryKey: ["uploadLimit"],
    queryFn: async () => {
      const response = await axios.get("/api/check-upload-limit")
      return response.data
    },
  })

  useEffect(() => {
    if (uploadLimitData) {
      setCanUpload(uploadLimitData.canUpload)
      setUploadsCount(uploadLimitData.uploadsCount)
      setMaxUploads(uploadLimitData.maxUploads)
    }
  }, [uploadLimitData])

  const { mutate, isPending: isProcessing } = useMutation({
    mutationFn: async ({ fileKey, fileName }: { fileKey: string; fileName: string }) => {
      const response = await axios.post("/api/create-chat", { fileKey, fileName })
      return response.data
    },
    onSuccess: async (data) => {
      const chat_id = data.chat_id
      toast.success("Chat created successfully")
      await axios.post("/api/increment-upload-count")
      await refetchUploadLimit()
      router.push(`/chat/${chat_id}`)
    },
    onError: (error) => {
      toast.error("Something went wrong while creating the chat. Please try again later.")
      console.error(error)
    },
  })

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!canUpload) {
        toast.error("You have reached your monthly upload limit. Please upgrade to Pro for unlimited uploads.")
        return
      }

      const file = acceptedFiles[0]
      if (!file) {
        toast.error("Please select a file to upload.")
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size should be less than 10MB")
        return
      }

      setIsUploading(true)
      setUploadProgress(0)
      try {
        const { fileName, fileKey, error } = await uploadToSupabase({
          file: file,
          userId: user?.id as string,
          onProgress: (progress) => {
            setUploadProgress(progress)
          },
        })

        if (!fileName || !fileKey) {
          throw new Error(error || "Failed to upload file")
        }

        mutate({ fileKey: fileKey, fileName: fileName })
      } catch (error) {
        console.error("Upload failed:", error)
        toast.error("Failed to upload file. Please try again.")
      } finally {
        setIsUploading(false)
        setUploadProgress(0)
      }
    },
    [user, mutate, canUpload],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    maxSize: 10000000, // 10MB
    onDrop,
    disabled: !canUpload,
  })

  const isLoading = isUploading || isProcessing

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground hover:bg-muted/50"
        } ${!canUpload ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <input {...getInputProps()} />
        {isLoading ? (
          <div className="space-y-4">
            <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground">
              {isUploading ? "Uploading..." : "Processing your PDF... This may take a few minutes."}
            </p>
            {isUploading && (
              <div className="w-full max-w-xs mx-auto">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-xs text-muted-foreground mt-2">{Math.round(uploadProgress)}% complete</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">
              {canUpload
                ? "Drag and drop your PDF here, or click to select"
                : "You have reached your monthly upload limit"}
            </p>
            {canUpload && (
              <Button variant="outline" size="sm">
                Select PDF
              </Button>
            )}
          </div>
        )}
      </div>
      {!canUpload ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Upload limit reached</AlertTitle>
          <AlertDescription>
            You have reached your monthly upload limit. Please upgrade to Pro for unlimited uploads.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Tip</AlertTitle>
          <AlertDescription>For best results, ensure your PDF is text-searchable and well-formatted.</AlertDescription>
        </Alert>
      )}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          Uploads this month: {uploadsCount} / {maxUploads}
        </p>
        <p className="flex items-center">
          <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
          Max file size: 10MB
        </p>
      </div>
    </div>
  )
}

