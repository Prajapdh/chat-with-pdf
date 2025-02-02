import { supabase } from './client';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

function getStorage(){
    const {storage} = supabase;
    return storage;
}

type UploadProps = {
    file: File;
    userId: string;
    onProgress: (progress: number) => void;
}

export async function uploadToSupabase({file, userId, onProgress}:UploadProps){
    const fileName = file.name;
    const fileExt = fileName.slice(fileName.lastIndexOf('.')+1);
    const path = `${userId}/${uuidv4()}.${fileExt}`;

    const storage = getStorage();

    // Get the upload URL from Supabase
    const { data, error: urlError } = await storage
        .from('chatpdfsaas')
        .createSignedUploadUrl(path);
    const { signedUrl } = data || {};
    if (urlError || !signedUrl) {
    return { fileName: null, fileKey: null, error: "Error getting upload URL" };
    }

    // Use Axios to upload the file with progress tracking
    try {
    await axios.put(signedUrl, file, {
        headers: {
        'Content-Type': file.type,
        },
        onUploadProgress: (progressEvent) => {
        const total = progressEvent.total || 1; // default to 1 if total is undefined
        const progress = Math.round((progressEvent.loaded * 100) / total);
        onProgress(progress);
        },
    });

    return { fileName, fileKey: path, error: null };
    } catch (error) {
    console.error('Upload error:', error);
    return { fileName: null, fileKey: null, error: "Error uploading file" };
    }
}

// Function to delete a file from Supabase storage
export async function deleteFromSupabase(fileKey:string){
    const storage = getStorage();
    const {error} = await storage
        .from('chatpdfsaas')
        .remove([fileKey]);
    
    if(error){
        return {error: "Error deleting file"};
    }
    console.log(`Deleted file: ${fileKey}`);
    return {error: null};
}

export function getSupabaseUrl(fileKey: string){
    const filePath = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/chatpdfsaas/${fileKey}`;
    return filePath;
}


