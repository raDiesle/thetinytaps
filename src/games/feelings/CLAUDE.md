# Gefühle

Route `/gefuehle/`.

Comfort the bear (`bear.ts`, `BearPlay.tsx`): the bear is sad, angry, tired or
scared, and three comforts (hug, teddy, blowing …) make it happy again. And
kindergarten stories – pushed, kicked, toy taken, slide full, wanting a toy,
angry yourself (`kita.ts`, `KitaPlay.tsx`): what happened, then the child picks
the good next steps and sees the not-so-good idea too. Above the mode cards the
grown-up picks one feeling of the bear or all in turn (`settings.feeling`), and one
kindergarten story or all (`settings.situation`).

Every picture is a Gemini illustration from `bilder/`, shown big in the middle.
`images.ts` finds them by name (`storyImages`, `bearImages`: `push-passiert`,
`push-1`, `push-nein`, `push-ende`, `baer-sad`, `trost-hug`, `baer-sad-gut`); a
second frame `-b` (or `-c`) fades in and out for a little movement. Choices are
picture cards only (`ChoiceCard` in `shared.tsx`) with a green tick or red cross,
so children can choose without reading; „Nochmal“ and „Weiter“ are round picture
buttons. Timing of a story's beats and its sounds in `story.ts`.

New or changed pictures: `/bild-erzeugen` (`yarn image`); file names and prompts
are listed in `bilder/README.md`. `feelings.test.ts` fails when a story or the
bear asks for a picture that is not in `bilder/`.
