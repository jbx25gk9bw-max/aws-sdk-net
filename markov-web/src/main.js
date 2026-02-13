import './style.css'
import { buildModel, generateText, getStats, getVocab } from './markov.js'

const app = document.querySelector('#app')

app.innerHTML = `
  <h1>Markov Text Generator</h1>
  <p class="subtitle">Feed it URLs, get procedurally generated nonsense back</p>

  <label for="urls">URLs (one per line):</label>
  <textarea id="urls" rows="4" placeholder="https://example.com/article1
https://example.com/article2"></textarea>

  <div class="controls">
    <button id="loadBtn" type="button">Load URLs</button>
    <button id="clearBtn" class="secondary" type="button">Clear</button>
  </div>

  <div id="status" class="status" style="display: none;"></div>

  <div id="generatorSection" style="display: none;">
    <hr style="margin: 2rem 0;">

    <div class="controls">
      <label style="display: inline; margin: 0;">
        Words: <input type="number" id="numWords" value="50" min="1" max="500">
      </label>
      <label style="display: inline; margin: 0;">
        Start with: <input type="text" id="startWord" placeholder="(random)">
      </label>
      <button id="generateBtn" type="button">Generate</button>
      <button id="regenBtn" class="secondary" type="button">Regenerate</button>
    </div>

    <div id="output" class="output"></div>

    <div id="stats" class="stats"></div>
    <div id="vocabPreview" class="vocab-preview"></div>
  </div>

  <footer>
    <p>
      Built for <a href="https://scienceandsociety.columbia.edu/news/mapping-ai-hype">Mapping AI Hype</a>
      | <a href="https://github.com/chrishwiggins/markov-web">View Source</a>
    </p>
    <p>
      A 1st-order Markov chain links each word to its possible successors.
      Only words with 2+ distinct followers are kept, ensuring variety.
    </p>
  </footer>
`

document.getElementById('loadBtn').addEventListener('click', loadUrls)
document.getElementById('clearBtn').addEventListener('click', clearAll)
document.getElementById('generateBtn').addEventListener('click', runGenerate)
document.getElementById('regenBtn').addEventListener('click', runGenerate)

async function loadUrls() {
  const urlsText = document.getElementById('urls').value.trim()
  if (!urlsText) {
    showStatus('Please enter at least one URL', 'error')
    return
  }

  const urls = urlsText.split('\n').map(url => url.trim()).filter(Boolean)
  if (urls.length === 0) {
    showStatus('Please enter at least one URL', 'error')
    return
  }

  showStatus(`Loading ${urls.length} URL(s)...`, 'loading')
  document.getElementById('loadBtn').disabled = true

  let combinedText = ''
  let successCount = 0

  for (const url of urls) {
    try {
      const response = await fetch(`/api/fetch?url=${encodeURIComponent(url)}`)
      const data = await response.json()

      if (data.error) {
        console.error(`Error fetching ${url}: ${data.error}`)
      } else {
        combinedText += ` ${data.text}`
        successCount++
      }
    } catch (error) {
      console.error(`Error fetching ${url}: ${error.message}`)
    }
  }

  document.getElementById('loadBtn').disabled = false

  if (successCount === 0) {
    showStatus('Failed to load any URLs. Check the console for details.', 'error')
    return
  }

  buildModel(combinedText)

  const vocab = getVocab()
  showStatus(`Loaded ${successCount}/${urls.length} URLs. ${vocab.size} words in vocabulary.`, 'success')
  document.getElementById('generatorSection').style.display = 'block'

  const stats = getStats()
  if (stats) {
    document.getElementById('stats').textContent =
      `Vocab: ${stats.vocabSize} | Corpus: ${stats.corpusSize} | Avg branching: ${stats.avgBranching}`
  }

  const vocabArray = Array.from(vocab).sort()
  document.getElementById('vocabPreview').textContent = `Vocabulary: ${vocabArray.join(', ')}`
}

function runGenerate() {
  const numWords = parseInt(document.getElementById('numWords').value, 10) || 50
  const startWordInput = document.getElementById('startWord').value.trim() || null

  const result = generateText(numWords, startWordInput)

  if (result.error) {
    showStatus(result.error, 'error')
    return
  }

  document.getElementById('output').textContent = result.text
  const words = result.text.split(' ')
  document.getElementById('stats').textContent =
    `Generated ${words.length} words starting with "${words[0]}"`
}

function clearAll() {
  document.getElementById('urls').value = ''
  document.getElementById('output').textContent = ''
  document.getElementById('stats').textContent = ''
  document.getElementById('vocabPreview').textContent = ''
  document.getElementById('status').style.display = 'none'
  document.getElementById('generatorSection').style.display = 'none'
}

function showStatus(message, type) {
  const el = document.getElementById('status')
  el.textContent = message
  el.className = `status ${type}`
  el.style.display = 'block'
}
