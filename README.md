# The Tiny Taps

Simple keyboard and touch games for toddlers (2–3 years), German first.

## Development

```bash
npm install
npm run dev        # http://localhost:3000 (Rsbuild dev server)
npm run typecheck
npm run build      # static site in out/
npm run preview    # serve the built site
```

Pushing to `main` deploys to GitHub Pages via `.github/workflows/deploy.yml`
(repo settings → Pages → Source: **GitHub Actions**).

## Structure

| Path | What |
| --- | --- |
| `rsbuild.config.ts`, `index.html` | Build setup (Rsbuild, single-page app; `404.html` fallback for GitHub Pages deep links) |
| `src/App.tsx` | Routes (React Router) |
| `src/pages/` | One component per page |
| `src/components/GameShell.tsx` | Shared shell: parent start screen, fullscreen + keyboard lock, hold-to-exit |
| `src/components/Bursts.tsx` | Colourful shapes for "any other key" and taps |
| `src/content/de.ts` | German words, pictures, number words – edit here to change content |
| `src/games/letters/` | Game "Buchstaben & Zahlen" |
| `src/games/scenes/` | Game "Lebendige Bilder": scene engine (explore / find mode, tap, hover / swipe or keys) and the scenes `baustelle/`, `stadt/`; shared depth helpers, drawing helpers and sky in `layout.ts`, `shared.tsx`, `sky.tsx` |
| `src/games/words/` | Game "Wörter tippen" (words come from `de.ts`, filtered by length and theme) |
| `src/lib/` | Speech (Web Speech API), synthesized sounds, settings storage |

To add a scene to "Lebendige Bilder", create a folder like `src/games/scenes/baustelle/`
with the drawing (SVG in React, one component per tappable item), its texts and a
CSS file for the tap animations, then add it to `SCENES` in `src/games/scenes/index.ts`.
The full guide (depth, keys, drawing style, checks) is the Claude Code skill
[`.claude/skills/neue-szene/SKILL.md`](.claude/skills/neue-szene/SKILL.md) – run it with `/neue-szene`.

Defaults: speech is off and the picture only moves when someone taps, hovers or
presses a key. Parents can turn on speech, idle movement and the keys mode
("Jedes Ding hat eine Taste") on the start screen.

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
