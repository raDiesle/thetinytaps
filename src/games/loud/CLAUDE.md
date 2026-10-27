# Laut und leise

Route `/laut-leise/` · idea N-29.

The microphone only measures how loud it is (`mic.ts`, nothing is recorded) – shouting makes the lion roar and jump, a quiet voice makes the mouse squeak (`animals.tsx`); a ladder in the middle shows the loudness. The room's own noise is learned as it plays; the microphone is deaf while the animals make sounds or talk, so they don't answer themselves. Parents allow the microphone and try it out on the start screen and choose how loud the lion needs it; tapping the animals works too. Second level "Pusten" (idea X-06, `BlowPlay.tsx`, pictures in `stations.tsx`): blowing (or a loud voice) is turned into a wind of 0–1 that blows out birthday candles, sends dandelion seeds flying, turns a pinwheel until the rainbow is complete and sails the mouse's boat to the lion; a tap is a gust, holding the finger keeps blowing. `LoudPlay.tsx` plays the levels in turn, beginning with the picked one (after each one „Menü“, „Nochmal“ or „Weiter“; there is no „all in turn“ card, „Weiter“ does that) and keeps the microphone on between them.

Languages: everything follows the app language (German or Russian, `useT`/`useAppLanguage` from `@/lib/language`), the start screen, „Über das Spiel“ and what the animals and pictures say and show; the voice speaks in `language.speechLang`. What the lion, the mouse and the blowing pictures say, the bubble words and the level names are in `texts.ts`, German and Russian side by side; the grown-ups' texts are inline `t({ de, ru })`. A text without Russian is said and shown in German with the German voice. `texts.test.ts` checks that the Russian that is there is Cyrillic.

## Rules

- Translations are made only when the user asks (root `CLAUDE.md`): a new text comes in German only (`{ de: "…" }`), a German text whose meaning changes loses its Russian line instead of keeping a stale one; the gap goes into `src/content/ideas/languageStatus.ts`. When Russian is asked for: Russian sound words, not German ones (лев: „Р-р-р!“, мышка: „Пи!“), present tense, nothing that changes for boy or girl.
