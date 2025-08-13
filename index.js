#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Ingest parsers
const parsePDF = require('./src/ingest/pdfParser');
const parseMarkdown = require('./src/ingest/mdParser');
const parseText = require('./src/ingest/txtParser');

// Chunking util
const { splitIntoChunks } = require('./utils/splitter');

// CLI args
const command = process.argv[2];
const filePath = process.argv[3];

if (!command || !filePath) {
  console.log('Usage: node index.js <command> <file-path>');
  console.log('Commands:');
  console.log('  ingest <file>  - Parse and store raw text from PDF, MD, or TXT');
  console.log('  chunk <file>   - Split raw text into token-limited chunks');
  process.exit(1);
}

if (command === 'ingest') {
  const ext = path.extname(filePath).toLowerCase();
  const outputDir = path.join(__dirname, 'data', 'raw');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  if (ext === '.pdf') {
    parsePDF(filePath, outputDir);
  } else if (ext === '.md') {
    parseMarkdown(filePath, outputDir);
  } else if (ext === '.txt') {
    parseText(filePath, outputDir);
  } else {
    console.error('❌ Unsupported file format. Use PDF, MD, or TXT.');
    process.exit(1);
  }
}
else if (command === 'chunk') {
  const absPath = path.resolve(filePath);
  if (!fs.existsSync(absPath)) {
    console.error(`❌ File not found: ${absPath}`);
    process.exit(1);
  }

  const text = fs.readFileSync(absPath, 'utf8');
  const chunks = splitIntoChunks(text, 200); // token limit example

  const outDir = path.resolve('./data/chunks');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  chunks.forEach((chunk, index) => {
    const outPath = path.join(outDir, `chunk_${index + 1}.json`);
    fs.writeFileSync(outPath, JSON.stringify(chunk, null, 2), 'utf8');
  });

  console.log(`✅ Created ${chunks.length} chunks in ${outDir}`);
}
else {
  console.error(`❌ Unknown command: ${command}`);
  process.exit(1);
}
