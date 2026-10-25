# Gefühle

Route `/gefuehle/`: a first menu picks the place (`places.ts`, `src/pages/FeelingsMenu.tsx`),
then `/gefuehle/zuhause/` or `/gefuehle/kindergarten/` is the start screen of that place
(`FeelingsGame`), with „Alle“ first and then one card per feeling or story
(`settings.feeling`, `settings.situation`). A picked one comes first, then
„Weiter“ goes on with the next ones in list order, so it never repeats the same.

Zu Hause (`bear.ts`, `BearPlay.tsx`): the bear is sad, angry, tired or scared, and
three comforts (hug, teddy, blowing …) make it happy again. And kindergarten
stories – pushed, kicked, toy taken, slide full, wanting a toy, angry yourself
(`kita.ts`, `KitaPlay.tsx`): what happened, then the child picks the good next
step, one after another.

Every choice has a not-so-good idea next to it, so the child always really
chooses: at home one card among the three comforts (`Feeling.instead`), in the
kindergarten one next to each step (`KitaStep.instead`), on a random side. Tapped,
it shows big with a red cross while the answer says why, and stays crossed out.
Arrow keys pick the left or right card; every other key does the good thing.

Every picture is a Gemini illustration from `bilder/`, shown big in the middle.
`images.ts` finds them by name (`storyImages`, `bearImages`: `push-passiert`,
`push-1`, `push-nein`, `push-nein-2`, `push-ende`, `baer-sad`, `trost-hug`,
`baer-sad-nein`, `baer-sad-gut`); a second frame `-b` (or `-c`) fades in and out
for a little movement. Choices are picture cards (`ChoiceCard` in `shared.tsx`)
with a green tick or red cross, so children can choose without reading; „Nochmal“
and „Weiter“ are round picture buttons. Timing of a story's beats and its sounds in
`story.ts`.

Under every picture, big or card, a short caption says what it shows („Bär
schubst zurück.“) – for grown-ups, to tell the story and give feedback on the
pictures; the child chooses by the picture. Every picture has one (`caption`,
`endCaption`, `instead.caption`); keep them subject + verb, a few words.

New or changed pictures: `/bild-erzeugen` (`yarn image`); file names and prompts
are listed in `bilder/README.md`. `feelings.test.ts` fails when a story or the
bear asks for a picture that is not in `bilder/`.
