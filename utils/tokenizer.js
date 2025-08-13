// utils/tokenizer.js

/**
 * Tokenize on whitespace (simple, fast approximation).
 * You can swap this with a tiktoken-based tokenizer later.
 */
function tokenize(text) {
  if (!text || typeof text !== 'string') return [];
  return text.trim().split(/\s+/).filter(Boolean);
}

/** Count tokens using the tokenizer above. */
function countTokens(text) {
  return tokenize(text).length;
}

module.exports = { tokenize, countTokens };
