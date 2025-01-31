import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import os from 'os';

// Initialize Supabase client with environment variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Helper function to get the storage object from Supabase client
function getStorage() {
  const { storage } = supabase;
  return storage;
}

// Function to download a PDF file from Supabase storage
export async function downloadPDFFromSupabase(fileKey: string): Promise<string | null> {
  try {
    // Download file from Supabase storage
    console.log(`Downloading file from Supabase, fileKey: ${fileKey}`);
    const storage = getStorage();
    const { data, error } = await storage
      .from('chatpdfsaas')
      .download(fileKey);

    if (error) {
      console.error('Error downloading file:', error);
      return null;
    }

    // Create a temporary file path
    // For Windows
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `pdf-${Date.now()}.pdf`);
    // For unix
    // const tempFilePath = path.join(`/tmp/pdf-${Date.now()}.pdf`);

    // Write the file to the temporary location
    const buffer = Buffer.from(await data.arrayBuffer());
    await fs.promises.writeFile(tempFilePath, buffer);

    console.log(`File downloaded to: ${tempFilePath}`);
    return tempFilePath;
  } catch (error) {
    console.error('Error in downloadPDFFromSupabase:', error);
    return null;
  }
}