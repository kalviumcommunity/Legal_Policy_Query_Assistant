// utils/splitter.js
const { countTokens } = require('./tokenizer');

/**
 * Split text into chunks without breaking sentences
 * @param {string} text - The input text
 * @param {number} tokenLimit - Max tokens per chunk
 * @returns {Array<{chunkId: number, text: string, tokenCount: number}>}
 */
function splitIntoChunks(text, tokenLimit = 200) {
  const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.trim());
  const chunks = [];
  let currentChunk = '';
  let chunkId = 1;

  for (let sentence of sentences) {
    const tentativeChunk = currentChunk ? currentChunk + ' ' + sentence.trim() : sentence.trim();
    const tokenCount = countTokens(tentativeChunk);

    if (tokenCount <= tokenLimit) {
      currentChunk = tentativeChunk;
    } else {
      chunks.push({
        chunkId: chunkId++,
        text: currentChunk,
        tokenCount: countTokens(currentChunk)
      });
      currentChunk = sentence.trim();
    }
  }

  if (currentChunk) {
    chunks.push({
      chunkId: chunkId++,
      text: currentChunk,
      tokenCount: countTokens(currentChunk)
    });
  }

  return chunks;
}

module.exports = { splitIntoChunks };
