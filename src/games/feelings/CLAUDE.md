# Gefühle

Route `/gefuehle/`: one start screen (`FeelingsGame`) with „Alle“ first, then
„Wie geht's dir?“, then one card per story (`stories.ts`, `settings.story`): the
bear's feelings at home, then the kindergarten stories. There are no sub-menus per place; the old addresses
`/gefuehle/zuhause/` and `/gefuehle/kindergarten/` lead back to `/gefuehle/`.
`FeelingsPlay` plays one story after another, always in the start screen's order (user feedback, never
shuffled): „Alle“ starts with the first story, a picked one with itself, and „Weiter“ brings the next one
there, after the last the first (`storyAfter` in `stories.ts`, checked in `feelings.test.ts`).

„Wie geht's dir?“ (`mood.ts`, `MoodPlay.tsx`, `settings.story` = `"mood"`, not in
„Alle“): four weather cards (`wetter-sonne`, `-wolke`, `-regen`, `-gewitter`) show
the bear under that weather, feeling the same. The child picks the one that fits;
it shows big while the bear says „Das kenne ich auch!“, then the bear's story with
that feeling plays (sun → birthday, cloud → tired, rain → sad, storm → angry) and
„Weiter“ goes on in list order. Keys 1–4 pick a weather, any other key one at random.

Zu Hause (`bear.ts`, `BearPlay.tsx`): the bear is sad, angry, tired or scared, and
three comforts (hug, teddy, blowing …) make it happy again, one per round; on his birthday he is
happy already and the three kind things celebrate with him (dance, streamers,
hug), asked with its own `Feeling.question`. And kindergarten stories – pushed,
kicked, toy taken, slide full, wanting a toy, angry yourself, goodbye at the door,
a newcomer, fallen down, someone who doesn't stop (`kita.ts`, `KitaPlay.tsx`): what happened, then the child picks the good next
step, one after another.

**One starting picture, exactly two cards.** Before every choice the big picture shows the story's
starting picture again (`baer-…` at home, `…-passiert` in the kindergarten) – the same one round after
round is fine – and next to it are exactly two cards: one not-so-good idea and one good one. Never more
cards, never the picture of the last step while choosing; a step's own picture shows only while it is
looked at, chosen or done. At home every kind thing has its own not-so-good idea (`Feeling.instead[i]`
next to `Feeling.comforts[i]`, `bearImages.instead(id, i)`), as every kindergarten step has.

The bear stands for the child, and at home whoever comforts it is anyone there –
usually a parent – so texts never say „Kind“. A feeling's title names the scene in
a few words („Angst bei Gewitter“, „Müde am Abend“) and is the caption of its
first picture while the story is told.

Every choice is asked with a question that says who acts (`Feeling.questions`, one per round;
`KitaStep.question`): first what is the matter, then „Was machst du?“ when the child helps the bear
(at home, mostly), „Was kann der kleine Bär tun?“ / „Was kann er machen?“ when he does it himself
(the kindergarten, and the angry bear at home stomping and blowing). It is read aloud before the
round and stands as the big picture's caption while the child chooses, so grown-ups can tell too.
`feelings.test.ts` fails when a question doesn't end by naming who acts. A Russian story without its
own questions asks the old general ones (`HELP_QUESTION`, `QUESTION`) until they are translated.

**Who acts must be plain (user feedback):** a grown-up must never wonder whether a card means
the one from the first picture does it himself (the bear says „Stopp!“, goes away), someone
else does it for him (the child comforts the bear), or the one with the feeling goes to someone
to be comforted. For every new situation and its pictures:
- Decide for each card who does it, and write it into the step: the narration names that one
  („Du nimmst den Bären in den Arm.“ when the child helps, „Der Bär sagt laut: Stopp!“ when he acts,
  „Der Bär läuft zur Erzieherin.“ when he fetches comfort), and the card's prompt says it in its
  first sentence.
- In the picture the one who acts is in front, big and clearly doing it; the others look at or
  react to it. When the child helps, only its hands or arms come in from the edge (as at home);
  when the bear acts, no hands from the edge. When the one with the feeling goes to someone, he is
  seen moving towards them, not already in their arms.

A card only takes, throws or breaks what the story's first picture already shows (a teddy the
bear doesn't hold can't be taken from him): pick another idea rather than redraw the first picture.
A card may bring something new (the teddy from the toy box, the light). `bilder/README.md` lists what
each first picture shows.

Every choice has a not-so-good idea next to it, so the child always really
chooses: at home one per round (`Feeling.instead`), in the
kindergarten one before each step (`KitaStep.instead`). The order is fixed: the
not-so-good idea always first (left or on top), then the good one; the rounds bring the most fitting
first (`Feeling.comforts` is in that order).
Choosing takes two taps: the first grows the card into the big picture's place
(yellow ring, the card lifted), so the child sees once more what it picked; the
second – on that card or the big picture – chooses it. Tapping the other card shows
that one instead. Keys do the same: the first press shows, the second chooses.
That a second tap is needed must be seen without words (grown-ups found it unclear
with the ring alone): while a card is shown big, a big hand 👆 taps the picture
again and again with a white ring where the finger lands (`.fg-tap-hint`), and the
other cards stop calling and fade a little, still to be tapped. Any step that waits
for one more tap shows such a hand, never only a glow.
A card looked at big can always be left without choosing it (user feedback): the first picture
sits small on the big picture's top left corner with ↩ on it (`BackButton`, `StoryPicture`'s `back`),
and tapping it – or Backspace – shows the first picture with the question again. Like the tick and the
cross it sits half outside the frame and stays small (about a sixth of the picture's width), so it never
covers much of the card shown big (grown-ups found a quarter of the width too much).
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
`feelings.test.ts` fails when its file is missing. At home and in the kindergarten
the left arrow picks the not-so-good idea; every other key the good thing. Tapping the bear's big
picture only makes him giggle (hearts, a pop); it never counts as a choice.

The big picture of the story is a framed photo – white mat, soft shadow – and turns
pale a moment after the child has to choose, so it never looks like one of the
cards (which have the yellow ring and stand out like buttons).

Every picture is a Gemini illustration from `bilder/`, shown big in the middle.
`images.ts` finds them by name (`storyImages`, `bearImages`: `push-passiert`,
`push-1`, `push-nein`, `push-nein-2`, `push-ende`, `baer-sad`, `trost-hug`,
`baer-sad-nein`, `baer-sad-nein-2`, `baer-sad-gut`); a second frame `-b` (or `-c`) fades in and out
for a little movement – in the big picture and on every card that can be chosen (`useFrame` in
`shared.tsx`), so the child sees what happens before it taps; a card that is done or waits stands still. A picture the game asks for that is not made yet shows a placeholder with its
file name (`Placeholder` in `shared.tsx`): new pictures are never generated on your own – list each one
with its prompt in `bilder/README.md` under „Geplant“, so the user can look at the idea first and then
make it with `/bild-erzeugen`. `feelings.test.ts` allows a missing picture only while it is listed there,
and fails when a listed one has been made (move its row into its table). Choices are picture cards (`ChoiceCard` in `shared.tsx`)
with a green tick or red cross, so children can choose without reading; „Menü“ (four cards like the start screen),
„Nochmal“ and „Weiter“ are round picture buttons. Timing of a story's beats and its sounds in
`story.ts`.

The big picture and the cards keep one size for the whole story – nothing grows or
shrinks when the child has to choose, and a new picture only fades in where the last
one was (things changing size confuse small children). `feelings.css` works the room
for the cards out from the screen alone (cq units of `.story-play`), the picture takes
all that is left; home and kindergarten share one layout. Upright: the picture as wide as
the screen on top, the two cards below side by side, on tall phones one above the other.
Wide screens: the picture left, the cards right one above the other, about a third of the
width. The small cards of the happy end and the round buttons fit into the same room.
Nothing keeps room free for the ✕ (and the fullscreen button) or the step dots: they lie on
top of the pictures. On low screens (phones on their side, ≤ 560 px high) the captions sit on
the pictures' lower edge instead of below them. Look at 844×390 and 1024×768 after a change.

Under every picture, big or card (on low screens on it), a short caption says what it shows – for
grown-ups, to tell the story and give feedback on the pictures; the child chooses
by the picture. Every picture has one (`caption`, `endCaption`, `instead.caption`,
`Feeling.title`). Choices say what to do, as short as a button: „Hand halten“,
„Licht anmachen“, „Zurückschubsen“, „„Stopp!“ sagen“ – no subject („Kind hält
Bärs Pfote“ is wrong), no full stop.

New or changed pictures: `/bild-erzeugen` (`bun run image`); file names and prompts
are listed in `bilder/README.md`. Grown-ups are only in a picture once a step fetched
them; a second frame only moves a little and is drawn from the first (`--ref`),
never as a grid pair – `bun run frames` lists pairs that jump. Within a story only what
the characters do changes: every picture is drawn from the story's first one
(`…-passiert`, `baer-…`) as the only `--ref`, with the same cast and background –
`bun run frames --scenes` lists pictures whose background drifted. `feelings.test.ts` fails when a story or the
bear asks for a picture that is not in `bilder/`.

## Russian

The game speaks the app language (German or Russian, chosen on the home page,
`src/lib/language.ts`): start screen, captions and everything read aloud. The German
data (`bear.ts`, `kita.ts`) holds pictures, sounds and order; `bear.ru.ts` and
`kita.ru.ts` hold only the Russian words, by id, step for step and beat for beat,
and `localized.ts` lays them over the German (`feelingIn`, `situationIn`,
`comfortsIn`, `storyIn`). Small texts (the questions, praise, weather captions,
start screen notes) are `Localized` inline: `t({ de, ru })`. Speech uses the app
language's voice, a line still in German the German one (`useVoice`). Rules:
- New stories, feelings and kind things come in German only; their Russian is written
  only when the user asks (a missing entry in `bear.ru.ts`/`kita.ru.ts` is told in German).
  A not-so-good idea at home without Russian is `null` in `bear.ru.ts` and told in German;
  `useVoice` speaks a line that is still German with the German voice (`voiceFor`).
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
