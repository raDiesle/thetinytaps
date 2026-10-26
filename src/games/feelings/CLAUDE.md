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
Choosing takes two taps: the first grows the card into the big picture's place
(yellow ring, the card lifted), so the child sees once more what it picked; the
second – on that card or the big picture – chooses it. Tapping the other card shows
that one instead. Keys do the same: the first press shows, the second chooses.
Only then comes the answer, seen and heard (`cheer`/`oops` in `shared.tsx`): the
good idea gets a green frame that hops, stars and a laugh („Juhu!“ when speech is
on), then the bear does it; the not-so-good one a red frame that shakes and what it
leads to, heard (`instead.sound`): „Aua!“ when someone gets hurt (`"aua"`: pushing,
hitting, biting …), a crash when something breaks (`"crash"`), otherwise crying –
never an error sound – with 💢, 💥 or 💧 floating up, while the answer says why; its
card stays crossed out. Ticks and crosses sit on the corner, half outside, so the
picture stays to be seen. Crying, the crash and the laugh are CC0 recordings
(`cry.mp3`, `crash.mp3`, `laugh.mp3` in `src/lib/sounds/`, loaded when a story starts,
`RECORDED_SOUNDS` in `story.ts`); „Aua!“ is synthesized (`playAua`) until an
`aua.mp3` is found. Good moments sound like the real thing too (`SOUNDS` in
`story.ts`, CC0 recordings, each falling back to a synthesized sound): children
cheer when a story ends well (`cheer`), a slide whistle glides down the slide,
a ball bounces, stomping stomps, the lullaby is a music box, streamers get a party
horn, blowing is a real breath out, the light clicks on before it chimes. Every
`recorded(…)` sound is loaded when a story starts (`RECORDED_SOUNDS`), and
`feelings.test.ts` fails when its file is missing. In the kindergarten
the left arrow picks the not-so-good idea; every other key the good thing.

The big picture of the story is a framed photo – white mat, soft shadow – and turns
pale a moment after the child has to choose, so it never looks like one of the
cards (which have the yellow ring and stand out like buttons).

Every picture is a Gemini illustration from `bilder/`, shown big in the middle.
`images.ts` finds them by name (`storyImages`, `bearImages`: `push-passiert`,
`push-1`, `push-nein`, `push-nein-2`, `push-ende`, `baer-sad`, `trost-hug`,
`baer-sad-nein`, `baer-sad-gut`); a second frame `-b` (or `-c`) fades in and out
for a little movement. Choices are picture cards (`ChoiceCard` in `shared.tsx`)
with a green tick or red cross, so children can choose without reading; „Menü“ (four cards like the start screen),
„Nochmal“ and „Weiter“ are round picture buttons. Timing of a story's beats and its sounds in
`story.ts`.

The big picture and the cards keep one size for the whole story – nothing grows or
shrinks when the child has to choose, and a new picture only fades in where the last
one was (things changing size confuse small children). `feelings.css` works the room
for the cards out from the screen alone (cq units of `.story-play`), the picture takes
all that is left. Upright: the picture as wide as the screen on top, the cards below –
in the kindergarten side by side, on tall phones one above the other; at home two by
two. Wide screens: the picture left, the cards right – in the kindergarten one above
the other, on low phones side by side; at home two by two. The small cards of the happy
end and the round buttons fit into the same room.

Under every picture, big or card, a short caption says what it shows – for
grown-ups, to tell the story and give feedback on the pictures; the child chooses
by the picture. Every picture has one (`caption`, `endCaption`, `instead.caption`,
`Feeling.title`). Choices say what to do, as short as a button: „Hand halten“,
„Licht anmachen“, „Zurückschubsen“, „„Stopp!“ sagen“ – no subject („Kind hält
Bärs Pfote“ is wrong), no full stop.

New or changed pictures: `/bild-erzeugen` (`yarn image`); file names and prompts
are listed in `bilder/README.md`. Grown-ups are only in a picture once a step fetched
them; a second frame only moves a little and is drawn from the first (`--ref`),
never as a grid pair – `yarn frames` lists pairs that jump. Within a story only what
the characters do changes: every picture is drawn from the story's first one
(`…-passiert`, `baer-…`) as the only `--ref`, with the same cast and background –
`yarn frames --scenes` lists pictures whose background drifted. `feelings.test.ts` fails when a story or the
bear asks for a picture that is not in `bilder/`.

## Russian

The game speaks the app language (German or Russian, chosen on the home page,
`src/lib/language.ts`): start screen, captions and everything read aloud. The German
data (`bear.ts`, `kita.ts`) holds pictures, sounds and order; `bear.ru.ts` and
`kita.ru.ts` hold only the Russian words, by id, step for step and beat for beat,
and `localized.ts` lays them over the German (`feelingIn`, `situationIn`,
`comfortsIn`, `storyIn`). Small texts (the questions, praise, weather captions,
start screen notes) are `Localized` inline: `t({ de, ru })`. Speech always uses the
app language's voice (`useVoice`). Rules:
- New stories, feelings and kind things come in German only; their Russian is written
  only when the user asks (a missing entry in `bear.ru.ts`/`kita.ru.ts` is told in German).
  But a story that has a translation must match the German step for step and beat for
  beat (a sound-only beat is `{}`): when you add or remove a step or beat in a translated
  story, change `kita.ru.ts` too, or delete that story's entry. `feelings.test.ts` fails
  when they don't match.
- Russian names: the bear is „Мишка“ (at home and in the kindergarten), the fox
  „Лисёнок“, the hare „Зайчик“, the hedgehog „Ёжик“, the kindergarten teacher
  „воспитательница“, the one who brings Мишка „большой медведь“.
- Nothing said to or about the child depends on boy or girl: feelings as
  „Мишке грустно“, captions as adverbs („Дождь, грустно“), praise „Молодец!“.
  The not-so-good answers start with „Хм,“ like the German „Hmm,“.
