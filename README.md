# Common Pages

Static prototype for a public writing shelf.

## Games

The smaller practice games use `practice-data.js` plus `practice-expansions.js`. Add new typing passages, Spanish prompts, writing prompts, Micro-Fiction Tycoon content, and Rogue-lite Archivist items there without changing the main game loop in `app.js`.

The Common Republic is available at `civic-engine.html` and is the flagship U.S. political career strategy game. Players start in a small race, campaign through party and general-election pressures, govern after victory, manage staff, pass policies, balance budgets, and build toward higher office. Its content is split under `games/civic/data/`:

- `regions.js`, `voters.js`, `issues.js`, `actions.js`, `events.js`, `opponents.js`, `endorsements.js`, `focuses.js`, `traits.js`, `parties.js`, and `scenarios.js` power campaign play.
- `career.js` adds career backgrounds, the office ladder, extra regions and voter groups, administration staff, legislative factions, governing policies, governing events, and the interactive tutorial.
- `civic-game.js` owns the campaign, election night, career, governing, staff, budget, legislative, policy, and local-save logic.

Run `node tools/validate-common-pages.mjs` from this folder after adding content. It checks data references and reports current library counts.

## Publish

Upload this folder to a static host such as Netlify, Vercel, GitHub Pages, or Cloudflare Pages.

After publishing, the **Text Link** button will share the public URL from a phone share sheet or SMS fallback.
