import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

/**
 * Load a document (PDF or TXT) into LangChain-compatible format.
 * @param {string} filePath - Path to the file
 * @returns {Promise<Document[]>} - Array of LangChain Documents
 */
export async function loadDocument(filePath) {
  let loader;

  if (filePath.endsWith(".pdf")) {
    loader = new PDFLoader(filePath, {
      splitPages: false // true = each page becomes its own doc
    });
  } else {
    throw new Error("Unsupported file type. Use PDF.");
  }

  const docs = await loader.load();
  return docs;
}
