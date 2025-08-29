import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

// 2. Setup Gemini embeddings
const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY,
  model: "text-embedding-004"
});

export async function buildVectorStore(docs) {
  // 1. Split documents
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 200,
    chunkOverlap: 100
  });
  const splitDocs = await splitter.splitDocuments([docs]);

  // 3. Connect to Pinecone
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
  });

  const index = pinecone.Index(process.env.PINECONE_INDEX);
  const namespace =index.namespace("pdfs");

  // 4. Store docs in Pinecone
  await PineconeStore.fromDocuments(splitDocs, embeddings, {
    pineconeIndex: index,
    namespace: "pdfs"
  });

  return namespace;
}

export async function queryVectorStore(store, query, path) {
  const vector = await embeddings.embedQuery(query);
  return await store.query({
    topK: 100,
    vector,
    filter: { source: path },
    includeMetadata: true
  });
}
