const fs = require('fs');
const parseText = require('../src/ingest/txtParser');
const parseMarkdown = require('../src/ingest/mdParser');

describe('Document Ingestion', () => {
    const outputDir = './data/raw';
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    test('Text parser works', () => {
        parseText('./data/sample/hostel_rules.txt', outputDir);
        expect(fs.existsSync(`${outputDir}/hostel_rules.txt`)).toBe(true);
    });

    test('Markdown parser works', () => {
        parseMarkdown('./data/sample/hostel_rules.md', outputDir);
        expect(fs.existsSync(`${outputDir}/hostel_rules.txt`)).toBe(true);
    });
});
