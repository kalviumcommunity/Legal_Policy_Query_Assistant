import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export async function buildVectorStore(docs) {
    // 1. Split documents
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 80,
    chunkOverlap: 10,
  });
  const splitDocs = await splitter.splitDocuments([docs]);


  // 2. Setup Gemini embeddings
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: "text-embedding-004",
  });

  // 3. Connect to Pinecone
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });

  const index = pinecone.Index(process.env.PINECONE_INDEX);

  // 4. Store docs in Pinecone
  const vectorStore = await PineconeStore.fromDocuments(splitDocs, embeddings, {
    pineconeIndex: index,
  });

  return vectorStore;
}

export async function queryVectorStore(store, query) {
  return await store.similaritySearch(query, 3); // top 3 matches
}
