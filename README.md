# The Tiny Taps

Simple keyboard and touch games for toddlers (2–3 years), German first.

## Development

```bash
bun install
bun run dev        # http://localhost:3000 (Bun's dev server with hot reload, tools/dev.ts)
bun run verify     # lint + format check (Biome), typecheck, unit tests (bun test)
bun run format     # format and apply safe lint fixes
bun test           # unit tests only
bun run build      # static site in out/ (tools/build.ts; `bun build` is Bun's bare bundler, not this)
bun run preview    # serve the built site like GitHub Pages (tools/preview.ts)
```

Pushing to `main` deploys to GitHub Pages via `.github/workflows/deploy.yml`
(repo settings → Pages → Source: **GitHub Actions**, Custom domain: **toddlerfox.com**, Enforce HTTPS).
The domain is registered at Cloudflare; its DNS records are `tools/toddlerfox.com.zone` (import it under
DNS → Records → Import, without „Proxy imported DNS records“, so GitHub can issue the HTTPS certificate).

Use **Bun** (not npm or yarn) for everything: installing, scripts, tests, bundling, dev server; dependencies are locked in `bun.lock`.
`bunfig.toml` keeps installs safe: only the public npm registry, only versions at least 3 days old, no install scripts.

Working with Claude Code: [`CLAUDE.md`](CLAUDE.md) has the rules and the map of
the code; each game folder has its own `CLAUDE.md` with what the game does and
where its parts are. Skills in `.claude/skills/`: `/neues-spiel`, `/neue-szene`,
`/bild-erzeugen`.

## Structure

| Path | What |
| --- | --- |
| `tools/`, `index.html` | Build setup (Bun, single-page app): `build.ts` bundles and adds a page per search engine entry, `404.html` fallback for GitHub Pages deep links and `sw.js` with the list of all built files; `dev.ts` and `preview.ts` serve; `appPlugin.ts` for `?glob` imports, build facts and CSS per chunk |
| `src/sw.js`, `src/lib/pwa.ts`, `public/manifest.webmanifest` | Offline and installable (PWA): the service worker keeps every file in the browser and starts the app from there; registration, the install button and the offline note on the home page (`src/components/InstallHint.tsx`) |
| `public/icons/` | App icon: `icon.svg` (rounded) and `icon-maskable.svg` (full bleed, for home screens); the PNGs are made from them, see [App icon](#app-icon) |
| `src/App.tsx` | Routes (React Router) |
| `src/pages/` | One component per page |
| `src/content/games.ts` | The home menu: four categories (Lebendige Welten, Zuordnen, Buchstaben & Zahlen, Weitere), each with its games on `/spiele/<id>/` (`src/pages/CategoryPage.tsx`); a game's back link leads to its category. New games go here |
| `src/components/GameShell.tsx` | Shared shell: parent start screen with a big card per way to play (mode or level; a tap picks it and starts) and the game's own options folded away, fullscreen + keyboard lock, the ✕ in the corner (a click leaves after half a second, „Zurück zum Menü“ shows next to it for a moment; Esc has to be held) |
| `src/components/GameEnd.tsx` | End of a level: „Nochmal“ and „Weiter“ with the next level's picture, so a child plays on without the menu („Lebendige Bilder“ goes on to the next picture, „Kettenreaktion“ and „Laut und leise“ to the next level; „Gefühle“ has the same two buttons under its stories) |
| `src/components/HomeOptions.tsx`, `src/lib/common.ts`, `src/lib/playtime.ts` | On the home page, for all games: the play time per day (every minute in any game counts, kept in localStorage per day; the last minute winds down, then „Gute Nacht“), and folded away language, read aloud, sounds and calm mode. Games read their own settings through `useGameSettings`, which fills in the shared ones |
| `src/components/Bursts.tsx` | Colourful shapes for "any other key" and taps |
| `src/components/TouchKeyboard.tsx` | Big on-screen letter keys for tablets (letters and words games) |
| `src/components/Sky.tsx`, `Logo.tsx` | Menu look: sky backdrop and the bouncy logo; colours and buttons in `src/styles/` (all loaded in order by `src/globals.css`) |
| `src/content/de.ts` | German words, pictures, number words – edit here to change content |
| `src/content/en.ts`, `tr.ts`, `pl.ts` | English, Turkish and Polish for the letters and words games, chosen under „Sprache“ on the home page (`src/content/languages.ts`, `src/components/LanguageSetting.tsx`). An optional second language shows and says every word in it too („Bär – bear“); words are matched by their emoji (`src/content/translate.ts`), and `moreWords` names pictures that only other languages have. The other games are German only |
| `src/games/letters/` | Game „Buchstaben & Zahlen“: free typing, „Zählen“, „Wo ist das B?“ and „Wörter tippen“ (whole words or first letters; picture, colour and doing words). Details in its [`CLAUDE.md`](src/games/letters/CLAUDE.md) |
| `src/games/scenes/` | Game „Lebendige Bilder“: the Wimmelbild engine and all its pictures. Details in its [`CLAUDE.md`](src/games/scenes/CLAUDE.md) |
| `src/games/animals/` | Game „Was gehört zum Tier?“: feed the animal, bring it home, „Wer schaut da raus?“. Details in its [`CLAUDE.md`](src/games/animals/CLAUDE.md) |
| `src/games/shadows/` | Game „Schatten finden“: find the shadow of a picture; also hosts „Wer schaut da raus?“. Details in its [`CLAUDE.md`](src/games/shadows/CLAUDE.md) |
| `src/games/socks/` | Game „Socken-Paare“: socks tumble out of the washing machine, two same ones hop onto the line. Details in its [`CLAUDE.md`](src/games/socks/CLAUDE.md) |
| `src/games/potty/` | Game „Aufs Töpfchen“: an animal goes to the potty, one tap per step; „Hat geklappt!“ gives a star. Details in its [`CLAUDE.md`](src/games/potty/CLAUDE.md) |
| `src/games/rewards/` | „Belohnungstafel & Tagesplan“: one page for the Belohnungstafel (a reward chart grown-ups design freely, stars on screen, printable as A4) and the Tagesplan (`/tagesplan/`, the day and week in picture cards to tick off and print), both made with one wizard that shows every choice as a picture. Details in its [`CLAUDE.md`](src/games/rewards/CLAUDE.md) |
| `src/games/teeth/` | Game „Zähne putzen“: brushing timer with a 3D mouth and brush. Details in its [`CLAUDE.md`](src/games/teeth/CLAUDE.md) |
| `src/games/loud/` | Game „Laut und leise“: the microphone's loudness moves lion and mouse; „Pusten“. Details in its [`CLAUDE.md`](src/games/loud/CLAUDE.md) |
| `src/games/feelings/` | Game „Gefühle“: comfort the bear, kindergarten stories with picture choices. Details in its [`CLAUDE.md`](src/games/feelings/CLAUDE.md) |
| `src/games/marbles/` | Game „Kettenreaktion“: the Klingende Kugelbahn (a long marble run with parts to swap), „Alles fällt um“, eight Rube Goldberg machines, and Nagelbrett, Hatschi-Kette and Wasserbahn to join in. Details in its [`CLAUDE.md`](src/games/marbles/CLAUDE.md) |
| `src/games/elevator/` | Game „Kleine Abenteuer“ (was „Spaß im Aufzug“): picture stories in a house with a lift, and trail adventures through a scrolling world with a bag of things. Details in its [`CLAUDE.md`](src/games/elevator/CLAUDE.md) |
| `src/games/adventure/` | Game „Bewegungsabenteuer“: 3D movement story with the fox Tapsi (three.js, lazy-loaded). Details in its [`CLAUDE.md`](src/games/adventure/CLAUDE.md) |
| `src/lib/` | Speech (Web Speech API), synthesized sounds, settings storage, PWA |
| `src/lib/sounds/` | Real recordings (CC0, from Freesound; sources in its `README.md`) for animals, bells, water, horn …, one MP3 per sound name. So far only "Lebendige Bilder", "Buchstaben & Zahlen" and "Kleine Abenteuer" use them (`playRecorded` / `recorded` in `src/lib/sfx/core.ts`); until a file is loaded, and in all other games, the synthesized sound plays |
| `scripts/gemini-image.mjs` | `bun run image <out.webp> "<prompt>"`: makes a picture with Gemini (needs `GEMINI_API_KEY` in your shell), optionally cut out (`--transparent`), sized and saved as WebP; the raw result stays in `.image-raw/`. Guide: the Claude Code skill [`.claude/skills/bild-erzeugen/SKILL.md`](.claude/skills/bild-erzeugen/SKILL.md) (`/bild-erzeugen`) |
| `src/content/ideas/` | Idea collection, one file per area (`n-new-games.ts` …) with fixed IDs (e.g. `N-03`), shown on the hidden page `/management/` – hold the „p“ in the home page title for 2 seconds |
| `src/content/seo.ts` | Title, description and text for search engines per game, category and scene; the build writes a page of its own for each, plus `sitemap.xml` and `robots.txt` |
| `src/content/research.ts` | Research for grown-ups (e.g. what parents search on Google), with date, method, findings and the ideas it led to, also shown on `/management/` |

To add a scene to "Lebendige Bilder", create a folder like `src/games/scenes/baustelle/`
with the drawing (SVG in React, one component per tappable item), its texts and a
CSS file for the tap animations, then add it to `SCENES` in `src/games/scenes/index.ts`.
The full guide (depth, keys, drawing style, checks) is the Claude Code skill
[`.claude/skills/neue-szene/SKILL.md`](.claude/skills/neue-szene/SKILL.md) – run it with `/neue-szene`.

Defaults: speech is off ("Zähne putzen" has its song sing the steps instead, always) and the picture only moves when someone taps, hovers or
presses a key. Parents turn on speech for all games on the home page, and idle movement and the keys mode
("Jedes Ding hat eine Taste") on the start screen of "Lebendige Bilder".

## Tablets

All games work by touch. The letters and words games show big letter keys on
the screen on touch-only devices (tablets, phones); "Frei tippen" in
Buchstaben & Zahlen shows them on every touch screen, also on a touch laptop or
an iPad with keyboard. Parents can switch them to "Immer" or "Nie" on the start
screen.

The start screens only offer what fits the device (`src/lib/device.ts`): on
tablets and phones (every pointer is a finger) the keys mode of "Lebendige
Bilder" and the keyboard hints (Esc, arrow keys) are hidden, and a saved keys
mode falls back to tapping; on computers without a touch screen the on-screen
keys option is hidden and the keys stay off. On a phone held upright the
pictures show a "Quer halten" note, since the wide picture gets tiny. On iPad the games go fullscreen, and the
app stays in fullscreen after a game, menus included (the ⛶ button on the home page
switches it on or off, and the other menus show it in the top right corner while in fullscreen); on iPhone (no fullscreen in Safari) add the page to the home screen to hide the
browser bars.

## Offline and as an app

After the first visit every file of the site is kept in the browser (service
worker, `src/sw.js`), so the games start without network – in the plane or
without WLAN – and straight away. The home page shows „Funktioniert auch ohne
Internet“ once that is done, and an „Als App installieren“ button in Chrome /
Edge / Android (on iPhone and iPad: Safari → Teilen → „Zum Home-Bildschirm“).

A new version is downloaded in the background: the browser looks for it when
the site is opened, and an open page or installed app (which often only comes
back from the background, for days) asks every hour and each time it comes back.
The new version takes over between games – when a menu page is opened or the app
goes to the background while showing one – never in a running game, and not in
fullscreen (it would end); otherwise at the next start. The home page shows
small in the bottom left corner when the running version was built („Stand …“). Speech offline uses only the
voices on the device (the online „Google“ voices need network). The service
worker only runs in the built site; to try it locally use the `preview-pages`
launch config (port 3200) – `bun run dev` removes
it again.

### App icon

Edit `public/icons/icon.svg` / `icon-maskable.svg` (same picture; the maskable
one is full bleed with the art inside the middle circle), then:

```bash
cd public/icons
rsvg-convert -w 192 icon.svg -o icon-192.png
rsvg-convert -w 512 icon.svg -o icon-512.png
rsvg-convert -w 512 icon-maskable.svg -o maskable-512.png
rsvg-convert -w 180 icon-maskable.svg -o apple-touch-icon.png
```

To add a picture that has no emoji, put an SVG in `public/images/` and set
`image` on the word (see Xylophon).

## Leaving the game

Hold **Esc** or the ✕ button (top right) for 1 second; the start screen of
every game explains this before it starts. In Chrome/Edge the
keyboard is locked while a game runs, so shortcuts like Cmd+W are captured
(in the menus a single Esc leaves fullscreen);
Cmd+Q / Cmd+Tab can't be blocked by any website.

## Roadmap

1. ~~Buchstaben & Zahlen (MVP)~~
2. ~~Options: themes (Tiere, Fahrzeuge, Essen), announcement style, calm mode, uninterrupted counting~~
3. Own illustrations and recorded voice (incl. letter sounds „b“ instead of „Be“), ~~offline (PWA)~~
4. ~~Wörter tippen~~
5. ~~Lebendige Bilder: Wimmelbild Baustelle, Stadt, Bauernhof, Hof am Teich, Zoo, Unterwasser, Badezimmer, Wald, Feuerwache, Weltall, Spielplatz, Küche, Supermarkt, Flughafen & Bahnhof, Winter-Baustelle, Kita, Kinderarzt, Strand, Dinotal, Gute-Nacht-Zimmer, Winter, Herbst, Ostern; hidden surprises behind doors, lids and in the sand; silent until tapped~~
6. ~~Was gehört zum Tier? (Tiere füttern, Wer wohnt wo?)~~
7. ~~Gefühle: Bär trösten, Kindergarten-Geschichten~~
8. ~~Schatten finden~~
9. ~~Laut und leise (Mikrofon): Löwe und Maus, Pusten~~
10. ~~Kugelbahn: Kugelbahn und „Alles fällt um“~~; ~~Kugelbahn als eigenes Spiel mit langer Bahn~~
11. ~~Aufzug~~
12. ~~Socken-Paare~~
13. ~~Aufs Töpfchen~~
14. ~~Belohnungstafel (gestalten und drucken)~~
