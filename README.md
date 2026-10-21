# The Tiny Taps

Simple keyboard and touch games for toddlers (2–3 years), German first.

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm run build      # static site in out/
```

Pushing to `main` deploys to GitHub Pages via `.github/workflows/deploy.yml`
(repo settings → Pages → Source: **GitHub Actions**).

## Structure

| Path | What |
| --- | --- |
| `src/app/` | Pages (Next.js App Router, static export) |
| `src/components/GameShell.tsx` | Shared shell: parent start screen, fullscreen + keyboard lock, hold-to-exit |
| `src/components/Bursts.tsx` | Colourful shapes for "any other key" and taps |
| `src/content/de.ts` | German words, pictures, number words – edit here to change content |
| `src/games/letters/` | Game "Buchstaben & Zahlen" |
| `src/games/scenes/` | Game "Lebendige Bilder": scene engine (explore / find mode, tap or hover / swipe) and the scenes, e.g. `baustelle/` |
| `src/lib/` | Speech (Web Speech API), synthesized sounds, settings storage |

To add a scene to "Lebendige Bilder", create a folder like `src/games/scenes/baustelle/`
with the drawing (SVG in React, one component per tappable item), its texts and a
CSS file for the tap animations, then add it to `SCENES` in `src/games/scenes/index.ts`.

To add a picture that has no emoji, put an SVG in `public/images/` and set
`image` on the word (see Xylophon).

## Leaving the game

Hold **Esc** or the ✕ button (top right) for 1 second. In Chrome/Edge the
keyboard is locked in fullscreen, so shortcuts like Cmd+W are captured;
Cmd+Q / Cmd+Tab can't be blocked by any website.

## Roadmap

1. ~~Buchstaben & Zahlen (MVP)~~
2. ~~Options: themes (Tiere, Fahrzeuge, Essen), announcement style, calm mode, uninterrupted counting~~
3. Own illustrations and recorded voice (incl. letter sounds „b“ instead of „Be“), offline (PWA)
4. Wörter tippen
5. ~~Lebendige Bilder: Wimmelbild Baustelle~~ – next: Bauernhof, Zoo, Stadt
