# DevNagariTyping — हिंदी टाइपिंग ट्यूटर

A browser-first Hindi typing tutor prototype with a keyboard-layout picker, structured touch-typing lessons, timed typing tests, quick-fire practice games, and local progress/error tracking.

> **Prototype status:** This is an early web prototype, not yet a production exam-preparation product. Verify Mangal/Inscript and Kruti Dev mappings against the exact official keyboard chart used by your exam before relying on them. Remington Gail is not implemented yet. Do not assume a layout is officially verified based only on this prototype.

## Run locally

Requirements: Node.js 18+ (for tests) and a modern browser.

```bash
npm install
npm test
npm run serve
```

Then open <http://localhost:8000>. You can also open `index.html` directly, but serving over HTTP is more representative of deployment.

## Current features

- **Layout selection:** Mangal (Inscript), Kruti Dev and a placeholder for Remington Gail where source data is not yet available.
- **Learn:** lessons organized by physical finger and keyboard row, progressing from keys to drills, common words, and original paragraphs.
- **Test:** timed typing practice, WPM and accuracy feedback, with word-locked backspace behavior.
- **Games:** quick-fire practice for vowels, consonants, matras, digits, and mixed characters.
- **Progress:** local lesson completion, test history, and frequently missed keys; a focused drill can be generated from errors.
- **Unicode-aware display:** grapheme-cluster handling helps keep Devanagari matras and conjuncts together while highlighting typed text.
- **Offline-friendly:** no backend or account is required in this prototype; progress is stored in the current browser's local storage.

## Project files

| File | Purpose |
| --- | --- |
| `index.html` | App screens and navigation |
| `styles.css` | Responsive visual styles |
| `layouts.js` | Keyboard mapping and finger/row metadata |
| `content.js` | Original practice content and game character groups |
| `app.js` | Lessons, typing input, tests, games, and progress logic |
| `smoke_test.js` | jsdom smoke tests for core user flows |

## Scope and roadmap

1. Establish the working desktop/browser prototype and regression tests.
2. Validate keyboard mappings against official sources and add clear layout provenance/licensing notes.
3. Improve accessibility, responsive behavior, onboarding, and lesson coverage.
4. Extract a reusable typing/course engine before building Android/iOS clients.
5. Add optional cloud sync and monetization only after the core practice experience is validated.

## Content, trademarks, and attribution

This repository should contain original app code, visual design, lessons, and sounds. Keyboard layouts are functional data, but their correctness and any third-party source/licensing implications must be checked before redistribution or commercial release. The prototype does not claim affiliation with any government exam body, keyboard-layout publisher, or commercial typing-tutor product.

## Test suite

`npm test` runs a DOM smoke test that covers initial onboarding, lesson navigation and typing, test setup, game flow, progress rendering, Devanagari grapheme grouping, and word-locked backspace. Passing smoke tests does not prove official layout correctness or full cross-browser accessibility.
