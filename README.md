# DevNagariTyping

Exam-focused Hindi and English typing practice website built with plain HTML, CSS and JavaScript.

## Run locally
Requires Node.js 18+ and a modern browser.

```bash
npm install
npm test
npm run serve
```

Open http://localhost:8000.

## Repository structure

- `index.html` — dashboard and app screens
- `styles.css` — responsive design system and page styling
- `dashboard.js` — dashboard navigation, layout selection, theme toggle and hero image loading
- `app.js` — lesson, typing test, game and progress logic
- `layouts.js` — prototype keyboard mapping data
- `content.js` — Hindi practice passages and game character groups
- `assets/isha-hero.png` — compressed supplied hero character image, loaded by `dashboard.js`
- `smoke_test.js` — DOM smoke tests
- `.github/workflows/` — CI and GitHub Pages deployment workflows

## Dashboard

The landing page presents an exam-oriented dashboard with the supplied hero character, exam categories, layout selector, course overview, timed tests, practice games, progress summary and 30-day practice plan. Existing lesson, test, game and progress screens remain available through the dashboard navigation.

## Important limitations

Keyboard mappings and exam-specific timing/scoring are prototypes. Verify each layout and exam requirement against the relevant official notification and keyboard chart. This project is not affiliated with a government exam body.
