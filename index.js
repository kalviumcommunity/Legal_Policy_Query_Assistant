#!/usr/bin/env node
import "dotenv/config";
import inquirer from "inquirer";
import chalk from "chalk";
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "./prompts.js";
import { loadDocument } from "./utils/fileLoader.js";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { buildVectorStore, queryVectorStore } from "./rag.js";
import tools from "./tools.js";

async function main() {
  console.log(chalk.green("🧑‍⚖️ Legal Policy Query Assistant\n"));
  const path = "./docs/sample_legal_policy.pdf";

  // Load document
  const docs = await loadDocument(path);

  // Build RAG index
  const store = await buildVectorStore(docs[0]);

  // CLI prompt loop
  while (true) {
    const { question } = await inquirer.prompt([
      {
        type: "input",
        name: "question",
        message: "Ask a policy question (or type 'exit'):"
      }
    ]);

    if (question.toLowerCase() === "exit") break;

    // Retrieve context
    const relevant = await queryVectorStore(store, question, path);

    const context = relevant.matches.map((m) => m.metadata.text).join("\n");

    // Call Gemini API
    const model = new ChatGoogleGenerativeAI({
      model: "gemini-1.5-flash",
      apiKey: process.env.GEMINI_API_KEY,
      temperature: 0.9 // more factual
    }).bindTools(tools);

    // Combine system prompt, context, and user question
    const input = [
      ["system", SYSTEM_PROMPT],
      ["human", `Question: ${question}\n\nContext:\n${context}.`]
    ];

    // Call Gemini via LangChain
    const response = await model.invoke(input);

    console.log(chalk.yellow("\nAnswer:"));
    console.log(response.content);
    console.log(chalk.gray("\n---\n"));
  }
  const { matches } = await store.query({
    topK: 10000,
    vector: Array(768).fill(0),
    filter: { source: path },
    includeMetadata: true
    // namespace: "pdfs"
  });
  const matchedIds = matches.map((match) => match.id);

  if (matchedIds.length) {
    await store.deleteMany(matchedIds);
    console.log("Pinecone data deleted.");
  }
}

main();
