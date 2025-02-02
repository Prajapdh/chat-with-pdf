import { Pinecone } from "@pinecone-database/pinecone"; // Import Pinecone client
import { convertToAscii } from "./utils"; // Import utility function to convert strings to ASCII
import { getEmbeddings } from "./embeddings"; // Import function to get embeddings for a query

// Function to get matches from embeddings using Pinecone
export async function getMatchesFromEmbeddings(
  embeddings: number[], // Embeddings to query
  fileKey: string // File key to identify the namespace
) {
  try {
    // Initialize Pinecone client with API key
    const client = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });

    // Get the Pinecone index and namespace
    const pineconeIndex = await client.index("chatpdfsaas");
    const namespace = pineconeIndex.namespace(convertToAscii(fileKey));

    // Query the namespace with the embeddings
    const queryResult = await namespace.query({
      topK: 5, // Number of top matches to return
      vector: embeddings, // Embeddings to query
      includeMetadata: true, // Include metadata in the results
    });

    // Return the matches or an empty array if no matches found
    return queryResult.matches || [];
  } catch (error) {
    console.log("error querying embeddings", error);
    throw error; // Throw the error to be handled by the caller
  }
}

// Function to get context for a query
export async function getContext(query: string, fileKey: string) {
  // Get embeddings for the query
  const queryEmbeddings = await getEmbeddings(query);

  // Get matches from embeddings using Pinecone
  const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);

  // Filter matches with a score greater than 0.7
  const qualifyingDocs = matches.filter(
    (match) => match.score && match.score > 0.7
  );
  // Extract the relevant text from the metadata of each qualifying document
  const contextText = qualifyingDocs
    .map((doc) => doc.metadata?.text) // Adjust 'text' to the appropriate field in your metadata
    .filter((text) => text) // Ensure the text exists
    .join("\n\n"); // Join the texts with double newline for separation

  console.log("Context Text:", contextText);
  // Return the context text
  return contextText;
}