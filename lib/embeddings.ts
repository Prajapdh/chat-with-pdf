import { OpenAIApi, Configuration } from "openai-edge"; // Import OpenAI API and Configuration classes

// Create a configuration object for OpenAI API with the API key from environment variables
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize the OpenAI API client with the configuration
const openai = new OpenAIApi(config);

// Function to get embeddings for a given text using OpenAI API
export async function getEmbeddings(text: string) {
  try {
    // Call the OpenAI API to create embeddings for the input text
    const response = await openai.createEmbedding({
      model: "text-embedding-ada-002", // Specify the model to use for embeddings
      input: text.replace(/\n/g, " "), // Replace newline characters with spaces in the input text
    });

    // Parse the response to get the embeddings
    const result = await response.json();
    return result.data[0].embedding as number[]; // Return the embeddings as an array of numbers
  } catch (error) {
    console.log("error calling openai embeddings api", error); // Log any errors that occur
    throw error; // Throw the error to be handled by the caller
  }
}