# DevNagariTyping — हिंदी टाइपिंग ट्यूटर

A browser-first Hindi typing tutor prototype with a layout picker, finger-guided lessons, timed typing practice, character games, and local progress/error tracking.

> **Prototype status:** This repository is an early prototype. Keyboard mappings are practice data and must be verified against the exact official chart required by your exam before exam use. Kruti Dev compatibility and the distinction between layout key positions and legacy font encoding require further validation. Remington Gail is not implemented.

## Run locally

Requirements: Node.js 18+ and a modern browser.

```bash
npm install
npm test
npm run serve
```

Open <http://localhost:8000>. You can also open `index.html` directly, but serving over HTTP is recommended.

## Features in this prototype

- Layout selection: Mangal/Inscript and a prototype Kruti Dev mapping; Remington Gail is labelled as not yet available.
- Lessons ordered by keyboard row and finger, progressing from keys to mixed-key drills, common words, and original Hindi paragraphs.
- Timed typing tests with live elapsed time, WPM, accuracy, and result history.
- Quick-fire character games for vowels, consonants, matras, digits, and mixed practice.
- Progress screen with completed lesson count and weak-key error counts.
- Unicode-aware grapheme grouping for displaying Devanagari text without naively splitting combining marks.
- Browser-local storage; no account or backend is required.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | App screens |
| `styles.css` | Responsive styling |
| `layouts.js` | Physical key-to-character mappings and finger metadata |
| `content.js` | Original Hindi paragraphs and game character sets |
| `app.js` | Lessons, typing input, test/game flows, and progress |
| `smoke_test.js` | DOM smoke tests |

## Known gaps before exam or commercial use

1. Validate every supported keyboard mapping against the exact official chart for each target exam. Mappings here must not be treated as officially certified.
2. Kruti Dev is historically associated with a legacy font/encoding workflow. This prototype represents characters internally as Unicode for practice; it does not promise file-level compatibility with legacy Kruti Dev documents or exam software.
3. Remington Gail is not implemented yet.
4. The test/game rules and measurement metrics are prototype-level and need user testing against target exam requirements.
5. Check provenance and licensing of all layout/reference material, fonts, and future sound/icon assets before redistribution or commercial release.

## Roadmap

1. Validate mapping data and core typing correctness.
2. Improve the test engine (exam-specific duration, scoring, word-lock rules and configurable passage sets).
3. Improve accessibility, mobile browser behavior, and lesson progression.
4. Extract a shared typing/course engine before expanding to Android and iOS.
5. Consider cloud sync and monetization only after the learning experience is validated.

The project is not affiliated with a government exam body, keyboard-layout publisher, or commercial typing tutor.
