/**
 * First-order Markov chain text generator
 *
 * Implements Shannon's (1948) approach: model language as a stochastic
 * process where each word depends only on its immediate predecessor.
 */

let markovModel = null;
let allWords = [];
let vocab = new Set();

/**
 * Build a first-order Markov model from text.
 *
 * @param {string} text - Input corpus
 * @returns {Object} - { model, allWords, vocab }
 *
 * The model maps each word to an array of observed successors.
 * Only words with 2+ distinct successors are retained (degree filtering).
 */
function buildModel(text) {
  // Tokenize: lowercase, split on whitespace, strip punctuation
  const words = text.toLowerCase()
    .split(/\s+/)
    .map(w => w.replace(/^[^a-z0-9]+|[^a-z0-9]+$/gi, ''))
    .filter(w => w.length > 0);

  allWords = words;

  // Count transitions: word -> [list of successors]
  const transitions = {};
  for (let i = 0; i < words.length - 1; i++) {
    const current = words[i];
    const next = words[i + 1];
    if (!transitions[current]) {
      transitions[current] = [];
    }
    transitions[current].push(next);
  }

  // Degree filtering: keep only words with 2+ distinct successors
  // This ensures every word in vocab can branch, preventing deterministic loops
  markovModel = {};
  for (const [word, followers] of Object.entries(transitions)) {
    const uniqueFollowers = new Set(followers);
    if (uniqueFollowers.size >= 2) {
      markovModel[word] = followers;
    }
  }

  vocab = new Set(Object.keys(markovModel));

  return { model: markovModel, allWords, vocab };
}

/**
 * Generate text using the Markov model.
 *
 * @param {number} numWords - Number of words to generate
 * @param {string|null} startWord - Starting word (null for random)
 * @returns {Object} - { text, error }
 */
function generateText(numWords, startWord = null) {
  if (!markovModel || vocab.size === 0) {
    return { text: null, error: 'Model not built. Load URLs first.' };
  }

  let current;

  if (startWord) {
    const normalized = startWord.toLowerCase();
    if (!vocab.has(normalized)) {
      return {
        text: null,
        error: `"${startWord}" not in vocabulary. Available: ${Array.from(vocab).slice(0, 10).join(', ')}...`
      };
    }
    current = normalized;
  } else {
    // Sample from empirical distribution of vocab words in corpus
    const candidates = allWords.filter(w => vocab.has(w));
    current = candidates[Math.floor(Math.random() * candidates.length)];
  }

  const result = [current];

  for (let i = 0; i < numWords - 1; i++) {
    if (markovModel[current]) {
      // Sample uniformly from observed successors
      const followers = markovModel[current];
      current = followers[Math.floor(Math.random() * followers.length)];
      result.push(current);
    } else {
      // Dead end: restart from a random vocab word
      const candidates = allWords.filter(w => vocab.has(w));
      if (candidates.length === 0) break;
      current = candidates[Math.floor(Math.random() * candidates.length)];
      result.push(current);
    }
  }

  return { text: result.join(' '), error: null };
}

/**
 * Get current vocabulary.
 * @returns {Set} - Set of words in the model
 */
function getVocab() {
  return vocab;
}

/**
 * Get model statistics.
 * @returns {Object} - { vocabSize, corpusSize, avgBranching }
 */
function getStats() {
  if (!markovModel) return null;

  const branchingFactors = Object.values(markovModel).map(f => new Set(f).size);
  const avgBranching = branchingFactors.reduce((a, b) => a + b, 0) / branchingFactors.length;

  return {
    vocabSize: vocab.size,
    corpusSize: allWords.length,
    avgBranching: avgBranching.toFixed(2)
  };
}
