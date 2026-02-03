# Context Letter: Markov Web App

**Date:** 2026-02-02
**Working Directory:** `/Users/wiggins/gd/local/Science/Talks/2026-02-04-CSS/src/1/markov-web`

---

## Project Overview

A browser-based first-order Markov chain text generator. Users input URLs, the app fetches text content, builds a Markov model, and generates procedural text. Built as a demo for the "Mapping AI Hype" talk at Columbia CSS.

---

## Live URLs

| Resource | URL |
|----------|-----|
| Live app | https://markov-web-coral.vercel.app |
| GitHub repo | https://github.com/chrishwiggins/markov-web |
| Vercel dashboard | https://vercel.com/chrishwiggins-projects/markov-web |

---

## Git Status

**Branch:** main
**Status:** Clean, up to date with origin

**Recent commits:**
```
53a8386 Refactor: extract markov.js, add 1945 classified manuscript history to README
ff6a307 Add scholarly README discussing Shannon's information-theoretic foundations
3030f6b Fix GitHub link in footer
38ab714 Initial commit: Markov text generator web app
```

---

## File Structure

```
markov-web/
├── api/
│   └── fetch.js       # Vercel serverless function - fetches URLs, strips HTML
├── index.html         # UI - loads markov.js, handles user interaction
├── markov.js          # Core Markov logic - buildModel(), generateText(), getVocab()
├── README.md          # Scholarly docs - Shannon 1945/1948 history
├── package.json       # Minimal npm config for Vercel
├── .vercel/           # Vercel project config (linked to chrishwiggins-projects)
└── CONTEXT_LETTER.md  # This file
```

---

## Technical Details

### Markov Model (markov.js)
- `buildModel(text)` - Tokenizes text, builds word transition map, filters to degree >= 2
- `generateText(numWords, startWord)` - Generates text via random walk
- `getVocab()` - Returns Set of words in filtered vocabulary
- `getStats()` - Returns vocab size, corpus size, avg branching factor

### Serverless API (api/fetch.js)
- `GET /api/fetch?url=<encoded-url>` - Fetches URL, strips HTML, returns `{ text, url }`
- Handles CORS headers for browser access
- Basic HTML entity decoding

### Deployment
- Vercel auto-detects static + serverless function structure
- Git author must be `chris.wiggins@gmail.com` for Vercel deploys
- Deploy command: `vercel --prod --yes`

---

## Parent Project Context

This app is part of a larger talk prep folder:
- **Parent:** `/Users/wiggins/gd/local/Science/Talks/2026-02-04-CSS`
- **Event:** "Mapping AI Hype" - Feb 4, 2026 at Columbia CSS
- **Related file:** `../markov.py` - CLI version of the same Markov generator

---

## Completed Tasks

- [x] Created web app with URL input, Markov generation, regenerate button
- [x] Deployed to Vercel with serverless URL fetcher
- [x] Pushed to GitHub (public repo)
- [x] Extracted markov.js as standalone module
- [x] Added scholarly README with Shannon 1945 classified manuscript history
- [x] Fixed git author email for Vercel deployments

---

## No Pending Issues

App is complete and deployed. No known bugs.

---

## Next Steps if Restarting

1. Test the live app: https://markov-web-coral.vercel.app
2. View source: https://github.com/chrishwiggins/markov-web
3. To redeploy after changes: `vercel --prod --yes`
4. Parent talk context: `/Users/wiggins/gd/local/Science/Talks/2026-02-04-CSS/CONTEXT_LETTER.md`
