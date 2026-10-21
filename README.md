# The Tiny Taps

Simple keyboard and touch games for toddlers (2–3 years), German first.

## Development

```bash
yarn install
yarn dev           # http://localhost:3000 (Rsbuild dev server)
yarn typecheck
yarn build         # static site in out/
yarn preview       # serve the built site
```

Pushing to `main` deploys to GitHub Pages via `.github/workflows/deploy.yml`
(repo settings → Pages → Source: **GitHub Actions**).

Use **yarn** (not npm); dependencies are locked in `yarn.lock`.

## Structure

| Path | What |
| --- | --- |
| `rsbuild.config.ts`, `index.html` | Build setup (Rsbuild, single-page app; `404.html` fallback for GitHub Pages deep links) |
| `src/App.tsx` | Routes (React Router) |
| `src/pages/` | One component per page |
| `src/components/GameShell.tsx` | Shared shell: parent start screen, fullscreen + keyboard lock, hold-to-exit |
| `src/components/Bursts.tsx` | Colourful shapes for "any other key" and taps |
| `src/components/TouchKeyboard.tsx` | Big on-screen letter keys for tablets (letters and words games) |
| `src/components/Sky.tsx`, `Logo.tsx` | Menu look: sky backdrop and the bouncy logo; colours and buttons in `src/globals.css` |
| `src/content/de.ts` | German words, pictures, number words – edit here to change content |
| `src/games/letters/` | Game "Buchstaben & Zahlen": free typing (numbers optionally counted by tapping each thing), "Wo ist das B?" (find the key for a shown letter, `FindPlay.tsx`) or the Buchstaben-Zug (keys become wagons, `TrainPlay.tsx`) |
| `src/games/scenes/` | Game "Lebendige Bilder": scene engine (explore with chain reactions and "alles entdeckt" party, find, sound riddle, trait questions in `quests.ts`, colouring in; tap, hover / swipe or keys with arrow-key frame in `focus.ts`) and the scenes `baustelle/`, `stadt/`; shared depth helpers, drawing helpers and sky in `layout.ts`, `shared.tsx`, `sky.tsx` |
| `src/games/words/` | Game "Wörter tippen": whole word, first letter only, colour words, doing words (all from `de.ts`) |
| `src/games/teeth/` | Game "Zähne putzen": brushing timer (1–3 minutes, one corner of the mouth per quarter) where sugar monsters vanish from the teeth, with music and spoken hints; no tapping needed, keeps the screen on |
| `src/lib/` | Speech (Web Speech API), synthesized sounds, settings storage |
| `src/content/ideas.ts` | Idea collection with fixed IDs (e.g. `N-03`), shown on the hidden page `/ideen/` – hold the „p“ in the home page title for 2 seconds |

To add a scene to "Lebendige Bilder", create a folder like `src/games/scenes/baustelle/`
with the drawing (SVG in React, one component per tappable item), its texts and a
CSS file for the tap animations, then add it to `SCENES` in `src/games/scenes/index.ts`.
The full guide (depth, keys, drawing style, checks) is the Claude Code skill
[`.claude/skills/neue-szene/SKILL.md`](.claude/skills/neue-szene/SKILL.md) – run it with `/neue-szene`.

Defaults: speech is off (except in "Zähne putzen", where the spoken hints are the point) and the picture only moves when someone taps, hovers or
presses a key. Parents can turn on speech, idle movement and the keys mode
("Jedes Ding hat eine Taste") on the start screen.

## Tablets

All games work by touch. The letters and words games show big letter keys on
the screen on touch-only devices (tablets, phones); parents can switch them to
"Immer" or "Nie" on the start screen. On iPad the games go fullscreen; on
iPhone (no fullscreen in Safari) add the page to the home screen to hide the
browser bars.

To add a picture that has no emoji, put an SVG in `public/images/` and set
`image` on the word (see Xylophon).

## Leaving the game

Hold **Esc** or the ✕ button (top right) for 1 second; the start screen of
every game explains this before it starts. In Chrome/Edge the
keyboard is locked in fullscreen, so shortcuts like Cmd+W are captured;
Cmd+Q / Cmd+Tab can't be blocked by any website.

## Roadmap

1. ~~Buchstaben & Zahlen (MVP)~~
2. ~~Options: themes (Tiere, Fahrzeuge, Essen), announcement style, calm mode, uninterrupted counting~~
3. Own illustrations and recorded voice (incl. letter sounds „b“ instead of „Be“), offline (PWA)
4. ~~Wörter tippen~~
5. ~~Lebendige Bilder: Wimmelbild Baustelle, Stadt~~ – next: Bauernhof, Zoo
