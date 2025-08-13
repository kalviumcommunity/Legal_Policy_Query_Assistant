// tests/chunking.test.js
const { splitIntoChunks } = require('../utils/splitter');
const { countTokens } = require('../utils/tokenizer');

describe('Chunking & Tokenization', () => {
  const sampleText = "This is sentence one. This is sentence two. This is sentence three which is a bit longer. And here is another one.";

  test('Splits text into chunks respecting token limit', () => {
    const chunks = splitIntoChunks(sampleText, 5);
    expect(chunks.length).toBeGreaterThan(1);
    chunks.forEach(chunk => {
      expect(chunk.tokenCount).toBeLessThanOrEqual(5);
    });
  });

  test('Does not cut sentences in half', () => {
    const chunks = splitIntoChunks(sampleText, 10);
    chunks.forEach(chunk => {
      expect(chunk.text.endsWith('.') || chunk.text.endsWith('!') || chunk.text.endsWith('?')).toBe(true);
    });
  });

  test('Token counter works', () => {
    expect(countTokens("Hello world")).toBe(2);
  });
});
