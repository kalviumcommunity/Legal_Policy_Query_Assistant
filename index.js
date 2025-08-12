#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const parsePDF = require('./src/ingest/pdfParser');
const parseMarkdown = require('./src/ingest/mdParser');
const parseText = require('./src/ingest/txtParser');

const args = process.argv.slice(2);

if (args[0] === 'ingest' && args[1]) {
    const filePath = args[1];
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
        console.error('Unsupported file format. Use PDF, MD, or TXT.');
    }
} else {
    console.log('Usage: node index.js ingest <file-path>');
}
