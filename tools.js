import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { lookup_policy, cite_source, summarize_document } from "./functions.js";

// lookup_policy
const lookupPolicyTool = tool(
  async ({ section }) => lookup_policy(section),
  {
    name: "lookup_policy",
    description: "Lookup a specific section of the policy document",
    schema: z.object({
      section: z.string().describe("Section number or title to lookup"),
    }),
  }
);

// cite_source
const citeSourceTool = tool(
  async ({ doc, section }) => cite_source(doc, section),
  {
    name: "cite_source",
    description: "Cite the source of a document and section",
    schema: z.object({
      doc: z.string().describe("Document name"),
      section: z.string().describe("Section number"),
    }),
  }
);

// summarize_document
const summarizeDocumentTool = tool(
  async ({ doc }) => summarize_document(doc),
  {
    name: "summarize_document",
    description: "Summarize the document",
    schema: z.object({
      doc: z.string().describe("Document name"),
    }),
  }
);

const tools = [lookupPolicyTool, citeSourceTool, summarizeDocumentTool];
export default tools;
