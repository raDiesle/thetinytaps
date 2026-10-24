# Laut und leise

Route `/laut-leise/` · idea N-29.

The microphone only measures how loud it is (`mic.ts`, nothing is recorded) – shouting makes the lion roar and jump, a quiet voice makes the mouse squeak (`animals.tsx`); a ladder in the middle shows the loudness. The room's own noise is learned as it plays; the microphone is deaf while the animals make sounds or talk, so they don't answer themselves. Parents allow the microphone and try it out on the start screen and choose how loud the lion needs it; tapping the animals works too. Second level "Pusten" (idea X-06, `BlowPlay.tsx`, pictures in `stations.tsx`): blowing (or a loud voice) is turned into a wind of 0–1 that blows out birthday candles, sends dandelion seeds flying, turns a pinwheel until the rainbow is complete and sails the mouse's boat to the lion; a tap is a gust, holding the finger keeps blowing. `LoudPlay.tsx` plays the levels in turn (after each one „Nochmal“ or „Weiter“) and keeps the microphone on between them.
