import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { downloadPDFFromSupabase } from "./supabase/supabase-server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import md5 from "md5";
import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import { getEmbeddings } from "./embeddings";
import { convertToAscii } from "./utils";

export const getPineconeClient = () => {
  return new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });
};

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};

export async function loadSupabaseIntoPinecone(fileKey: string) {
  // 1. obtain the pdf -> downlaod and read from pdf
  console.log("downloading supabase into file system, fileKey: ", fileKey);
  const fileName = await downloadPDFFromSupabase(fileKey);
  if (!fileName) {
    throw new Error("could not download from supabase");
  }
  console.log("loading pdf into memory: " + fileName);
  const loader = new PDFLoader(fileName);
  const pages = (await loader.load()) as PDFPage[];

  // 2. split and segment the pdf
  const documents = await Promise.all(pages.map(prepareDocument));
  // console.log("splitting pdf into documents: ", documents);
  
  // 3. vectorise and embed individual documents
  const vectors = await Promise.all(documents.flat().map(embedDocument));

  // 4. upload to pinecone
  const client = await getPineconeClient();
  const pineconeIndex = await client.index("chatpdfsaas");
  const namespace = pineconeIndex.namespace(convertToAscii(fileKey));

  console.log("inserting vectors into pinecone");
  const maxBatchSize = 4000000; // 4MB in bytes
  let batchSize = 50;
  const batches = splitIntoBatches(vectors, batchSize);

  for (const batch of batches) {
    let currentBatch = batch;
    while (estimateBatchSize(currentBatch) > maxBatchSize) {
      batchSize = Math.floor(batchSize / 2);
      currentBatch = splitIntoBatches(currentBatch, batchSize)[0];
    }
    await namespace.upsert(currentBatch);
  }


  return documents[0];
}

function splitIntoBatches(vectors: PineconeRecord[], batchSize: number = 50) {
  const batches = [];
  for (let i = 0; i < vectors.length; i += batchSize) {
    batches.push(vectors.slice(i, i + batchSize));
  }
  return batches;
}

function estimateBatchSize(batch: PineconeRecord[]): number {
  return JSON.stringify(batch).length;
}


async function embedDocument(doc: Document) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);

    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    } as PineconeRecord;
  } catch (error) {
    console.log("error embedding document", error);
    throw error;
  }
}

export const truncateStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};

async function prepareDocument(page: PDFPage) {
  let pageContent = page.pageContent;
  const metadata = page.metadata;
  pageContent = pageContent.replace(/\n/g, "");
  // split the docs
  const splitter = new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 3000),
      },
    }),
  ]);
  return docs;
}