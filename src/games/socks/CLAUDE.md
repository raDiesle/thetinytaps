# Socken-Paare

Route `/socken/` · idea N-45.

Its card plays at once (`startMode`): there is nothing to choose, the game finds the difficulty itself. First only the full washing machine fills the screen; after `INTRO_MS` it washes on its own (`playWash`, the drum turns for `WASH_MS`), then the door opens, the machine moves into the corner, the clothesline comes down and the socks tumble out onto the floor. Tapping a sock lifts it and plays its pair's note (`playCountNote(pair)`, so both socks of a pair sound the same); tapping its partner makes both hop onto the clothesline, where they hang with pegs in the order they were found. A different sock is never "wrong": the first one goes back down and the new one is lifted instead. When all pairs hang they jump for joy, then the line is pulled out of the picture to the right (a little tug back first, the socks trailing behind), the empty line stays and the next wash tumbles straight out of the open machine. It goes on like that until ✕; every wash after the first counts as a game for the play-time limit (`gameEnded`, `countGame`).

**Difficulty** (`SOCK_LEVELS`, `nextLevel` in `content.ts`): it begins with 2 plain pairs in different colours, then more pairs, then a pattern per pair (each in its own colour), then patterns sharing a colour (`sameColor`, only the pattern tells), last `mixed` (two colours × few patterns, so every pair has a twin in pattern and others in colour), up to `MAX_PAIRS` = 6. Within each kind, laundry baskets (`covered`) come over first one sock, then more, up to all twelve: like memory, the child sees for a moment what lies there, then has to remember or look. After each wash, misses (another sock tapped while one is lifted) and seconds per pair, counted from when the last basket stands, decide: no miss and ≤ 3 s per pair → two steps up, ≤ ½ miss and ≤ 10 s per pair → one up, ≥ 1½ misses or ≥ 20 s per pair → one down, else stay. Every visit begins on the first step; `?level=N` starts on step N while developing.

**Baskets**: they drop (`sock-basket-drop`, with a knock) once all socks lie; a covered sock lies straight, so the basket covers it. Tapping a basket taps the sock under it (the basket has no pointer events): it lifts and tips aside while that sock is in hand, and comes back down when another sock is taken; when the pair is found it fades. The keyboard frame on a covered sock knocks instead of playing its note, which would give it away.

**Pairs in a row**: pairs found one after the other without a miss in between, also across washes, hang with a note one step higher up the scale each, and from the third in a row stars and a twinkle come at the line. A miss ends it silently. Nothing gets faster with it.

`SocksPlay.tsx` holds the phases (intro → washing → sorting → cheer → pull → sorting …) and the flight: the floor sock gets a `translate`/`scale` to its empty place on the line (measured from its grid cell, since the lifted sock's own box is shifted) while `.sock.flying` adds the hop as a `transform` animation; when the hop ends the floor sock hides and the line one shows. All timed steps go through `later`, so they are cleared when the game closes (and React's second mount while developing doesn't wash twice). The floor grid is sized by `fitPile` to the room left beside (landscape) or above (portrait) the small machine. Drawings (sock with SVG pattern tiles, peg, washing machine) in `drawings.tsx`; colours, patterns, levels, `dealPairs` and spoken texts in `content.ts`, checked by `socks.test.ts`.

Keys: arrows (and any other key) move a frame over the socks still on the floor and play their note, Space/Enter takes the framed one, 1–9 take a sock directly; while the machine washes or the line moves, a key makes stars.

## Rules

- The game runs on by itself: no start screen before it, no tap to start the machine, no `GameEnd` between washes – the user asked for one flowing game. Leaving is only by ✕ (or Esc held).
- Harder means harder to match (more pairs, more alike, more under baskets), never quicker: no clock, nothing that speeds up (the hops and the tumbling once got quicker with the child's runs – the user didn't want that). Time only lets a quick, sure wash skip a step; a slow, sure child still climbs.
- A miss never shows or sounds as one; it only feeds `nextLevel` and ends the run of rising notes.
- Every wash's pairs look different from each other, and its step's kind says what tells them apart (`socks.test.ts`); a new kind gets its check there.

## Languages

The game speaks the app language (German, English, Chinese, Hindi, Spanish, Arabic, Russian; `useAppLanguage()`): start screen texts inline with `t({ de, en, zh, hi, es, ar, ru })`, spoken texts through `SOCK_TEXTS` (`SockTexts` in `content.ts`, the others in `content.<language>.ts`: sock / calcetín / 袜子 / मोज़ा / جورب), speech in `language.speechLang`. Arabic talks to the child with "let's" (هيّا نبحث), Hindi with commands, Spanish with tú: nothing that changes for a boy or a girl.
- Translations come only when the user asks. A new or changed German line comes German-only; add the Russian only on request. Gaps are marked in `src/content/ideas/languageStatus.ts`.
- When a German line changes its meaning, delete its Russian in the same change (a stale translation is worse than German).
- The translated texts are `Partial<SockTexts>`: a sentence they lack is said in German, and `say` gives a sentence without the language's own letters to the German voice (`voiceFor`).
- A number with a word („3 Paare“) needs its form per language (Russian and Arabic with `Intl.PluralRules`) and a check in `socks.test.ts`; none is shown at the moment. The tests check that no sentence is empty and that Chinese, Hindi and Arabic have no Latin letters.
