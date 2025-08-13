// utils/splitter.js
const { tokenize, countTokens } = require('./tokenizer');

/**
 * Split text into chunks that respect tokenLimit.
 * - Prefers sentence boundaries.
 * - If a single sentence exceeds tokenLimit, splits by words.
 * - Never emits empty chunks.
 *
 * @param {string} text
 * @param {number} tokenLimit - max tokens per chunk
 * @param {object} [opts]
 * @param {number} [opts.overlapTokens=0] - optional token overlap between consecutive chunks
 * @returns {Array<{chunkId:number, text:string, tokenCount:number}>}
 */
function splitIntoChunks(text, tokenLimit = 200, opts = {}) {
  const overlapTokens = Math.max(0, opts.overlapTokens || 0);

  // Split into sentences; include last run even without terminal punctuation
  const sentences = (text.match(/[^.!?]+(?:[.!?]+|\s*$)/g) || [text]).map(s => s.trim());

  const chunks = [];
  let bufferTokens = []; // current chunk tokens

  const flush = () => {
    if (bufferTokens.length === 0) return; // prevent empty chunks
    const chunkText = bufferTokens.join(' ').trim();
    chunks.push({
      chunkId: chunks.length + 1,
      text: chunkText,
      tokenCount: bufferTokens.length,
    });

    if (overlapTokens > 0) {
      // keep last N tokens as the start of the next chunk
      bufferTokens = bufferTokens.slice(-overlapTokens);
    } else {
      bufferTokens = [];
    }
  };

  const appendTokens = (tokens) => {
    for (const tok of tokens) {
      if (bufferTokens.length + 1 > tokenLimit) {
        flush();
      }
      bufferTokens.push(tok);
    }
  };

  for (const sentence of sentences) {
    const sTokens = tokenize(sentence);
    if (sTokens.length === 0) continue; // skip blank lines / empty sentences

    // If whole sentence fits with current buffer, just append
    if (bufferTokens.length + sTokens.length <= tokenLimit) {
      appendTokens(sTokens);
      continue;
    }

    // If current buffer has stuff but adding the sentence would overflow, flush
    if (bufferTokens.length > 0) {
      flush();
    }

    // Now, the buffer is empty. If the sentence still exceeds the limit, split by words.
    if (sTokens.length > tokenLimit) {
      let idx = 0;
      while (idx < sTokens.length) {
        // If buffer is full, flush and continue
        if (bufferTokens.length === tokenLimit) flush();

        const remaining = tokenLimit - bufferTokens.length;
        // Safety: remaining can be 0 if tokenLimit is 0 (not expected), guard anyway
        if (remaining <= 0) {
          flush();
          continue;
        }

        const slice = sTokens.slice(idx, idx + remaining);
        appendTokens(slice);
        idx += slice.length;

        // If we've exactly filled the buffer, flush immediately to keep invariant
        if (bufferTokens.length === tokenLimit) {
          flush();
        }
      }
    } else {
      // Sentence fits in an empty buffer
      appendTokens(sTokens);
    }
  }

  // Final flush (if any tokens remain)
  flush();

  return chunks;
}

module.exports = { splitIntoChunks };
