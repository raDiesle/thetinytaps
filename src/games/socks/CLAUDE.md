# Socken-Paare

Route `/socken/` · idea N-45.

A full washing machine waits, still and silent; the first tap or key starts it (`playWash`, the drum turns for `WASH_MS`), then the door opens, the machine moves into the corner and the socks tumble out onto the floor. Tapping a sock lifts it and plays its pair's note (`playCountNote(pair)`, so both socks of a pair sound the same); tapping its partner makes both hop onto the clothesline, where they hang with pegs in the order they were found. A different sock is never "wrong": the first one goes back down and the new one is lifted instead. When all pairs hang they jump for joy, then „Menü“, „Nochmal“ or „Weiter“ (one pair more, up to `MAX_PAIRS` = 6, then the number it began with again). Modes: „Farben“ (plain socks, every pair its own colour) and „Muster“ (a pattern per pair in only three colours, so the pattern makes the difference); the start screen picks 2–4 pairs to begin with.

`SocksPlay.tsx` holds the phases (ready → washing → sorting → done) and the flight: the floor sock gets a `translate`/`scale` to its empty place on the line (measured from its grid cell, since the lifted sock's own box is shifted) while `.sock.flying` adds the hop as a `transform` animation; after `FLY_MS` the floor sock hides and the line one shows. The floor grid is sized by `fitPile` to the room left beside (landscape) or above (portrait) the small machine. Drawings (sock with SVG pattern tiles, peg, washing machine) in `drawings.tsx`; colours, patterns, `dealPairs` and spoken texts in `content.ts`, checked by `socks.test.ts`.

Keys: any key starts the machine; arrows (and any other key) move a frame over the socks still on the floor and play their note, Space/Enter takes the framed one, 1–9 take a sock directly.

## Languages

The game speaks the app language (German, English, Chinese, Hindi, Spanish, Arabic, Russian; `useAppLanguage()`): start screen and „Über das Spiel“ texts inline with `t({ de, en, zh, hi, es, ar, ru })`, spoken texts and the pair counts through `SOCK_TEXTS` (`SockTexts` in `content.ts`, the others in `content.<language>.ts`: sock / calcetín / 袜子 (pairs 双) / मोज़ा (pair जोड़ा) / جورب), speech in `language.speechLang`. Arabic talks to the child with "let's" (هيّا نبحث), Hindi with commands, Spanish with tú: nothing that changes for a boy or a girl.
- Translations come only when the user asks. A new or changed German line comes German-only; add the Russian only on request. Gaps are marked in `src/content/ideas/languageStatus.ts`.
- When a German line changes its meaning, delete its Russian in the same change (a stale translation is worse than German).
- The translated texts are `Partial<SockTexts>`: a sentence they lack is said in German, and `say` gives a sentence without the language's own letters to the German voice (`voiceFor`).
- Numbers with a word ("3 Paare", „5 пар“, „3 أزواج“) go through `texts.pairs(n)`, which picks the form per language (Russian and Arabic with `Intl.PluralRules`; Arabic says „زوج واحد“ and „زوجان“ for 1 and 2); `socks.test.ts` checks the forms, that no sentence is empty and that Chinese, Hindi and Arabic have no Latin letters.
