// utils/tokenizer.js

/**
 * Approximate token counter
 * This is a fallback — not 100% accurate to GPT tokenization,
 * but works for chunk size control without API calls.
 * 
 * @param {string} text
 * @returns {number} estimated token count
 */
function countTokens(text) {
  // Simple approximation: split on whitespace & punctuation
  if (!text || typeof text !== 'string') return 0;
  return text.trim().split(/\s+/).filter(s => s).length;
}

module.exports = { countTokens };
