"use client"
import { useState, useCallback } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Upload, Loader2 } from "lucide-react"
import { Progress } from "@/app/components/ui/progress"
import {useDropzone} from 'react-dropzone'
import { useUser } from "@clerk/nextjs"
import { uploadToSupabase } from "@/lib/supabase/supabaseStorage"
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation"


export default function UploadButton() {
  const { user } = useUser();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();

  const { mutate, isLoading } = useMutation({
    mutationFn: async ({fileKey, fileName}:{fileKey: string, fileName: string}) => {
      const response = await axios.post('/api/create-chat', {fileKey, fileName});
      return response.data;
    }      
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    console.log(acceptedFiles);
    const file = acceptedFiles[0];
    if(file.size > 10*1024*1024){
      toast.error("File size should be less than 10MB");
      return
    }

    setIsUploading(true);
    setUploadProgress(0);
    try {
      const { fileName, fileKey, error } = await uploadToSupabase({
        file: file,
        userId: user?.id as string,
        onProgress: (progress) => {
          setUploadProgress(progress);
        },
      });
      setIsUploading(false);
      console.log('uploaded file: ', fileKey);

      if(!fileName || !fileKey) {
        toast.error("Something went wrong while uploading the file. Please try again later.");
        return;
      }

      console.log(`calling mutation, File Name: ${fileName}, File Key: ${fileKey}`);
      mutate({fileKey: fileKey, fileName: fileName},{
        onSuccess: (data) => {
          const chat_id = Array.isArray(data) ? data[0].chat_id : data.chat_id; 
          toast.success('Chat created successfully');
          console.log('chat_id: ', chat_id);
          router.push(`/chat/${chat_id}`);
        },
        onError: (error) => {
          toast.error("Something went wrong while creating the chat. Please try again later.");
          console.error(error);}
      });

      if (error) {
        console.error(error);
      }

    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  }, [user]);
  

  const {getRootProps, getInputProps} = useDropzone({
    accept: {"application/pdf": ['.pdf']},
    maxFiles: 1,
    maxSize: 10000000, // 10MB
    onDrop
  });
  

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Upload PDF</CardTitle>
        </CardHeader>
        <CardContent>
         
          {isUploading || isLoading ? (
          <>
            {/* loading state */}
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            <p className="mt-2 text-sm text-slate-400">
              Spilling Tea to GPT...
            </p>
          </>
        ) : (
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-muted-foreground rounded-lg p-12 text-center cursor-pointer hover:bg-muted/50 transition-colors">
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Drag and drop your PDF here, or click to select</p>
          </div>
        )}

          {/* {isUploading && (
            <div className="mt-4">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-center mt-2">{uploadProgress.toFixed(2)}% uploaded</p>
            </div>
          )} */}

        </CardContent>
        <CardFooter className="flex flex-col items-start">
          <h3 className="font-semibold mb-2">Accepted file types:</h3>
          <ul className="list-disc list-inside text-sm text-muted-foreground">
            <li>PDF documents (.pdf)</li>
          </ul>
          <p className="text-sm text-muted-foreground mt-2">Maximum file size: 10MB</p>
        </CardFooter>
      </Card>
    </div>
  )
}

