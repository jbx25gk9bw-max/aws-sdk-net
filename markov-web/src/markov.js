/**
 * First-order Markov chain text generator
 *
 * Implements Shannon's (1948) approach: model language as a stochastic
 * process where each word depends only on its immediate predecessor.
 */

let markovModel = null
let allWords = []
let vocab = new Set()

/**
 * Build a first-order Markov model from text.
 *
 * @param {string} text - Input corpus
 * @returns {{ model: Object, allWords: string[], vocab: Set<string> }}
 *
 * The model maps each word to an array of observed successors.
 * Only words with 2+ distinct successors are retained (degree filtering).
 */
export function buildModel(text) {
  const words = text
    .toLowerCase()
    .split(/\s+/)
    .map(word => word.replace(/^[^a-z0-9]+|[^a-z0-9]+$/gi, ''))
    .filter(word => word.length > 0)

  allWords = words

  const transitions = {}
  for (let i = 0; i < words.length - 1; i += 1) {
    const current = words[i]
    const next = words[i + 1]
    if (!transitions[current]) {
      transitions[current] = []
    }
    transitions[current].push(next)
  }

  markovModel = {}
  for (const [word, followers] of Object.entries(transitions)) {
    const uniqueFollowers = new Set(followers)
    if (uniqueFollowers.size >= 2) {
      markovModel[word] = followers
    }
  }

  vocab = new Set(Object.keys(markovModel))

  return { model: markovModel, allWords, vocab }
}

/**
 * Generate text using the Markov model.
 *
 * @param {number} numWords - Number of words to generate
 * @param {string|null} startWord - Starting word (null for random)
 * @returns {{ text: string|null, error: string|null }}
 */
export function generateText(numWords, startWord = null) {
  if (!markovModel || vocab.size === 0) {
    return { text: null, error: 'Model not built. Load URLs first.' }
  }

  let current

  if (startWord) {
    const normalized = startWord.toLowerCase()
    if (!vocab.has(normalized)) {
      return {
        text: null,
        error: `"${startWord}" not in vocabulary. Available: ${Array.from(vocab).slice(0, 10).join(', ')}...`
      }
    }
    current = normalized
  } else {
    const candidates = allWords.filter(word => vocab.has(word))
    current = candidates[Math.floor(Math.random() * candidates.length)]
  }

  const result = [current]

  for (let i = 0; i < numWords - 1; i += 1) {
    if (markovModel[current]) {
      const followers = markovModel[current]
      current = followers[Math.floor(Math.random() * followers.length)]
      result.push(current)
    } else {
      const candidates = allWords.filter(word => vocab.has(word))
      if (candidates.length === 0) break
      current = candidates[Math.floor(Math.random() * candidates.length)]
      result.push(current)
    }
  }

  return { text: result.join(' '), error: null }
}

/**
 * Get current vocabulary.
 * @returns {Set<string>} - Set of words in the model
 */
export function getVocab() {
  return vocab
}

/**
 * Get model statistics.
 * @returns {{ vocabSize: number, corpusSize: number, avgBranching: string }|null}
 */
export function getStats() {
  if (!markovModel) return null

  const branchingFactors = Object.values(markovModel).map(followers => new Set(followers).size)
  const avgBranching = branchingFactors.reduce((total, value) => total + value, 0) / branchingFactors.length

  return {
    vocabSize: vocab.size,
    corpusSize: allWords.length,
    avgBranching: avgBranching.toFixed(2)
  }
}
