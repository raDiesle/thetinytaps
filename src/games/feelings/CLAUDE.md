# Gefühle

Route `/gefuehle/`: one start screen (`FeelingsGame`) with „Alle“ first, then
„Wie geht's dir?“, then one card per story (`stories.ts`, `settings.story`): the
bear's feelings at home, then the kindergarten stories. There are no sub-menus per place; the old addresses
`/gefuehle/zuhause/` and `/gefuehle/kindergarten/` lead back to `/gefuehle/`.
`FeelingsPlay` plays one story after another: a picked one comes first, then
„Weiter“ goes on with the next ones in list order, so it never repeats the same;
„Alle“ plays every story in random order.

„Wie geht's dir?“ (`mood.ts`, `MoodPlay.tsx`, `settings.story` = `"mood"`, not in
„Alle“): four weather cards (`wetter-sonne`, `-wolke`, `-regen`, `-gewitter`) show
the bear under that weather, feeling the same. The child picks the one that fits;
it shows big while the bear says „Das kenne ich auch!“, then the bear's story with
that feeling plays (sun → birthday, cloud → tired, rain → sad, storm → angry) and
„Weiter“ goes on in list order. Keys 1–4 pick a weather, any other key one at random.

Zu Hause (`bear.ts`, `BearPlay.tsx`): the bear is sad, angry, tired or scared, and
three comforts (hug, teddy, blowing …) make it happy again; on his birthday he is
happy already and the three kind things celebrate with him (dance, streamers,
hug), asked with its own `Feeling.question`. And kindergarten stories – pushed,
kicked, toy taken, slide full, wanting a toy, angry yourself, goodbye at the door,
a newcomer, fallen down, someone who doesn't stop (`kita.ts`, `KitaPlay.tsx`): what happened, then the child picks the good next
step, one after another.

The bear stands for the child, and at home whoever comforts it is anyone there –
usually a parent – so texts never say „Kind“. A feeling's title names the scene in
a few words („Angst bei Gewitter“, „Müde am Abend“) and is also the caption of its
first picture.

Every choice has a not-so-good idea next to it, so the child always really
chooses: at home one card before the three comforts (`Feeling.instead`), in the
kindergarten one before each step (`KitaStep.instead`). The order is fixed: the
not-so-good idea always first (left), then the good ones, the most fitting first
(`Feeling.comforts` is in that order; a key press does them in that order too).
Tapped, the not-so-good idea shows big with a red cross while the answer says why,
and stays crossed out. In the kindergarten the left arrow picks it; every other
key does the good thing.

Every picture is a Gemini illustration from `bilder/`, shown big in the middle.
`images.ts` finds them by name (`storyImages`, `bearImages`: `push-passiert`,
`push-1`, `push-nein`, `push-nein-2`, `push-ende`, `baer-sad`, `trost-hug`,
`baer-sad-nein`, `baer-sad-gut`); a second frame `-b` (or `-c`) fades in and out
for a little movement. Choices are picture cards (`ChoiceCard` in `shared.tsx`)
with a green tick or red cross, so children can choose without reading; „Nochmal“
and „Weiter“ are round picture buttons. Timing of a story's beats and its sounds in
`story.ts`.

Under every picture, big or card, a short caption says what it shows – for
grown-ups, to tell the story and give feedback on the pictures; the child chooses
by the picture. Every picture has one (`caption`, `endCaption`, `instead.caption`,
`Feeling.title`). Choices say what to do, as short as a button: „Hand halten“,
„Licht anmachen“, „Zurückschubsen“, „„Stopp!“ sagen“ – no subject („Kind hält
Bärs Pfote“ is wrong), no full stop.

New or changed pictures: `/bild-erzeugen` (`yarn image`); file names and prompts
are listed in `bilder/README.md`. `feelings.test.ts` fails when a story or the
bear asks for a picture that is not in `bilder/`.
