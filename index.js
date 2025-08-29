#!/usr/bin/env node
import "dotenv/config";
import inquirer from "inquirer";
import chalk from "chalk";
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "./prompts.js";
import { loadDocument } from "./utils/fileLoader.js";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { buildVectorStore, queryVectorStore } from "./rag.js";

async function main() {
  console.log(chalk.green("🧑‍⚖️ Legal Policy Query Assistant\n"));

  // Load document (sample: hostel_rules.pdf)
  const docs = await loadDocument("./docs/hostel_rules.pdf");
  
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
    const relevant = await queryVectorStore(store, question);

    const context = relevant.map((r) => r.pageContent).join("\n");

    // Call Gemini API
    const model = new ChatGoogleGenerativeAI({
      model: "gemini-1.5-flash",
      apiKey: process.env.GEMINI_API_KEY,
      temperature: 0.2 // more factual
    });

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
}

main();
