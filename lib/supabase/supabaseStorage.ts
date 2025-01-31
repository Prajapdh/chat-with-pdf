import { supabase } from './client';
import { v4 as uuidv4 } from 'uuid';

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
    let fileName = file.name;
    const fileExt = fileName.slice(fileName.lastIndexOf('.')+1);
    fileName = uuidv4();
    const path = `${userId}/${fileName}.${fileExt}`;

    const storage = getStorage();

    // const {data, error} = await storage
    //     .from('chatpdfsaas')
    //     .upload(path, file,{
    //         onUploadProgress: (progressEvent) =>{
    //             const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    //             onProgress(progress);
    //         }
    //     });

    const {data, error} = await storage
    .from('chatpdfsaas')
    .upload(path, file);
        
    console.log('inside uploadToSupabase');
    
    if(error){
        return {fileName: null, fileKey: null, error:"Error uploading file"};
    }
    
    const fileKey = data?.path;
    
    return {fileName, fileKey, error: null};
}

// Function to delete a file from Supabase storage
export async function deleteFromSupabase(fileKey:string){
    const storage = getStorage();
    const {data, error} = await storage
        .from('chatpdfsaas')
        .remove([fileKey]);
    
    if(error){
        return {error: "Error deleting file"};
    }

    return {error: null};
}

export function getSupabaseUrl(fileKey: string){
    const filePath = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/chatpdfsaas/${fileKey}`;
    return filePath;
}


