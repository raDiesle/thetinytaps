# Gefühle

A book of its own on the shelf (category `gefuehle` in `games.ts`, world „gefuehle“ in `Worlds.tsx`, cover
`cover-gefuehle.webp`; user decision, November 2026) with two games; their names are in `names.ts`:
- **„Wie geht's dir?“** (`/wie-gehts-dir/`, `MoodGame.tsx`, `MoodPlay.tsx`, `mood.ts`) plays at once: four weather
  cards (`wetter-sonne`, `-wolke`, `-regen`, `-gewitter`) show the bear under that weather, feeling the same. The child
  picks the one that fits; it shows big while the bear says „Das kenne ich auch!“, then a pass of the matching group
  plays (`Weather.group`: sun → Freude & Stolz, cloud → Müde & zu viel, rain → Traurig, storm → Wütend), without
  touching the place „Alltagssituationen“ goes on from (`remember={false}`). „Nochmal“ asks for the weather again.
  Keys 1–4 pick a weather, any other key one at random. This game is meant to grow (ideas C-29 to C-36): more
  feelings to show, faces, „Was hilft dir jetzt?“.
- **„Alltagssituationen“** (`/gefuehle/`, `FeelingsGame.tsx`, `FeelingsPlay.tsx`): one card per group of feelings
  (`groups.ts`: Traurig, Wütend, Angst, Freude & Stolz, Müde & zu viel, Streit im Kindergarten, Freunde & Familie,
  Igitt & Hoppla – every story in exactly one, checked in `feelings.test.ts`). The group played last comes first and
  goes on with the scene where the child stopped (`settings.group`, `settings.scene`); the others follow in their
  fixed order. The old addresses `/gefuehle/zuhause/` and `/gefuehle/kindergarten/` lead back to `/gefuehle/`.

**One scene, one choice (user feedback, November 2026).** A round (`rounds.ts`, `RoundPlay.tsx`) is one scene and one
step of its story: the starting picture, one question, exactly two cards – the not-so-good idea and the good one. After
the good one comes its picture (and, on the story's last step, its happy end), then straight on to the _next scene_ of
the group (`PassPlay.tsx`) – never back to the same starting picture for another choice. A pass plays each scene of its
group once; each story remembers its next step (`settings.steps`), so the next pass shows the same scenes with their
other choices. After the last scene of a pass come „Menü“, „Nochmal“ (the group again) and „Weiter“ (the next group).
The dots at the top are the pass's scenes.

**One tap chooses** (user feedback, November 2026): no first tap that only shows a card big, no ring waiting for a
second tap, no hand tapping, no way back from a card. The not-so-good card shows big with a still red frame, a cross on
the corner and what it leads to, heard, while the answer says why; then the starting picture with that card crossed
out and the good one left. The good card gets a still green frame with a tick and a laugh („Juhu!“), then its picture.
Keys: the left arrow picks the not-so-good idea, every other key the good one. Tapping the big picture does nothing.

**Calm (user feedback, November 2026):** nothing floats up (no hearts, stars, 💢, 💥, 💧, 💤, 🎉), nothing hops,
shakes, pulses, glows, stamps or grows – not after a choice, not while waiting. The cards stand still (only their
first frame); only the big picture's two frames fade slowly into each other (`FRAME_MS`, 1.5 s). The picture of the
choice – the relieved, happy bear – is the answer. `GameEnd`'s pop and „Weiter“'s breathing are switched off here too.
`feelings.test.ts` fails on a `float(`, the old keyframes, or a second `infinite` animation.

A step's question and caption stand on their own: a step is played in its own pass, from the story's first picture,
never right after the step before it. So a new question never says „noch“ or „wieder“ as if an earlier step had just
happened. The questions written before (November 2026: „Der Bär ist noch traurig“, „Der Fuchs ist noch da“, about 15
in `bear.ts`, `kita.ts`, `selbst.ts`) still do; rewriting them means new recordings and translations, so it waits
until the user asks.

**Whose view a scene takes is said first (user feedback, November 2026):** every round starts with a line that tells
grown-ups and child whether the child _is_ the little bear or _helps_ its friend the bear (`ROLE_LINES`: „Stell dir
vor: Du bist der kleine Bär.“ / „Der kleine Bär ist dein Freund. Du hilfst ihm.“), shown as the starting picture's
caption while the scene begins. At home the role follows who does the good thing (`Comfort.actor`: the child comforts
→ friend; the bear stomps, blows, lies down → self), in the kindergarten and the stories of more feelings the child is
the bear. A new story or kind thing sets this; the test checks every round starts with it.

**Layout (user's choice, November 2026):** wide screens (from 6:5) put the picture in the middle, as big as the
height allows unless the cards would get less than a quarter of the width (`--card-min`, 30 % on tablets), the
not-so-good card at the bottom left and the good one at the top right, each lying a fifth of its width over a corner
of the picture; the picture's tick or cross sits on its top left corner. No margins beyond 8 px. At the end „Menü“ and
„Nochmal“ stand left of the picture, „Weiter“ right of it. Upright screens keep the picture on top and the two cards
below. Captions lie on the pictures' lower edge on wide or low screens. Look at 844×390, 1024×768 and 1280×720 after
a change.

The stories. Zu Hause (`bear.ts`): the bear is sad, angry, tired or scared, and
three comforts (hug, teddy, blowing …) make it happy again, one per step; on his birthday he is
happy already and the three kind things celebrate with him (dance, streamers,
hug), asked with its own `Feeling.question`. And kindergarten stories – pushed,
kicked, toy taken, slide full, wanting a toy, angry yourself, goodbye at the door,
a newcomer, fallen down, someone who doesn't stop (`kita.ts`): what happened, then the good next step.
After them come stories of more feelings (`selbst.ts`, built into rounds like the kindergarten's, ids `selbst-…`):
disappointed (the cookie breaks), jealous (the bear baby is cuddled), disgust (broccoli), embarrassed (wet trousers in
the kindergarten), excited (the first snow) – ideas C-05, C-12, C-16, C-17, C-18 – and a second round of 19
(pictures made November 2026): leaving the playground, a show that ends, no lolly at the checkout, a
jacket that won't go on, waiting for pancakes, the vacuum cleaner, a big dog, the doctor, washing hair, waking at night,
the lost cuddly toy, not allowed to join in, a party too loud, proud on the climbing frame, missing grandma, shy with a
visitor, bored on a rainy day, caring when the fox cries, startled by a bang (C-01 to C-15, C-23 to C-28). The little
bear has the feeling and
helps himself (a body trick, saying how he feels, doing something else); the feeling itself is never the not-so-good
idea, only what hurts someone or breaks something is (hiding when embarrassed is the feeling, so its not-so-good idea is
playing on in wet trousers).
Saying how one feels is a good idea only where saying it changes something (it brings comfort, stops someone, asks for
help). Where the feeling asks for something to do – bored on a rainy day – the good idea is the doing itself, best
something creative played together with what the picture shows (cooking a rain soup with the pots, a blanket cave, a
box car), never only naming the feeling („Mir ist langweilig“ sagen was too little a way out, user feedback, November
2026).

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

**Whose view a story takes is the child's own (user feedback, November 2026):** where the child itself is the one
with the feeling at that moment – tired at bedtime – the child is the bear, and the whole story is the bear acting
himself („Was kann er machen?“, „Hinlegen und zudecken“, no hands from the edge); its not-so-good ideas are what a
child in that moment does itself (hops on the bed, gets up to play, cries), never what a second child does to the
bear (pulling his blanket away, drumming next to his bed), which brings in someone who isn't there.

A card only takes, throws or breaks what the story's first picture already shows (a teddy the
bear doesn't hold can't be taken from him, nor a present the birthday picture doesn't show – „Geschenk wegnehmen“
became „Partyhut wegnehmen“): pick another idea rather than redraw the first picture. A good idea, too, uses only what
the first picture shows (the teddy from the toy box, the lamp, the cake on the table, the fox sitting there) and never
something that could break, burst or startle (user feedback, November 2026: the balloon story's „Kleinen Ballon
quietschen lassen“ used a small balloon the first picture hardly showed, and a balloon can burst – right after a bang;
it became „Mit dem Fuchs Kuchen essen“). Only a not-so-good idea may bring a small new thing (the pin, the monster
puppet). `bilder/README.md` lists what each first picture shows.

**Every card tells one thing without its caption (user feedback, November 2026):** the angry bear's thrown toy car
wasn't seen as thrown, his deep breath blew towards the fallen tower so he seemed to blow it over, his stomp with both
feet couldn't be told, and he still blew with a red angry face. For every new story or level, before its pictures are
made and again when they are there, look at each card alone, as a grown-up without its caption would, and ask what it
shows (`bilder/README.md`, „Jede Karte versteht man ohne Worte“, has the wording for the prompts):
- The action is the biggest thing in the picture, caught at its plainest moment: a throw with the arm stretched out
  and the thing just leaving the paw, close to it; a stomp with him seen down to both feet, both soles hitting the
  floor together, both lifted in the second frame.
- Nothing lies where the action goes: a breath, throw, kick or stomp goes into empty space (a breath rises upwards),
  or it reads as blowing over, hitting or breaking that thing. A breath never goes towards a cake or any food: he
  turns away from the table and blows upwards (user feedback, November 2026: beside the birthday cake his „Tief
  pusten“ looked like blowing out the candles or spitting on the cake). So pick a story's cause that no card seems to act on
  (the home's angry bear: a shoe that won't go on, no longer a fallen tower).
- A good idea shows in the face that it helps: after blowing, breathing or a hug he looks relieved and happy (soft
  closed eyes, a smile, no red face); only the first picture and the not-so-good ideas keep the angry face.
- When he acts himself, the prompt says „No hands, no arms come in from the edges“ (the home's room prompt allows a
  child's hands, and Gemini drew one pointing at the bear throwing alone).

Every choice has a not-so-good idea next to it, so the child always really chooses: at home one per round
(`Feeling.instead`), in the kindergarten one per step (`KitaStep.instead`). Its answer starts softly with „Hmm,“ and
says what is better; what it leads to is heard (`instead.sound`): „Aua!“ when someone gets hurt, a crash when something
breaks, otherwise crying – never an error sound. Crying, the crash, the laugh and the good moments' sounds are CC0
recordings (`SOUNDS`, `RECORDED_SOUNDS` in `story.ts`, loaded when a round starts; `feelings.test.ts` fails when a file
is missing); „Aua!“ is synthesized (`playAua`) until an `aua.mp3` is found.

The big picture of the story is a framed photo – white mat, soft shadow – and turns
pale a moment after the child has to choose, so it never looks like one of the
cards (which have the yellow ring and stand out like buttons).

Every picture is a Gemini illustration from `bilder/`, shown big in the middle.
`images.ts` finds them by name (`storyImages`, `bearImages`: `push-passiert`,
`push-1`, `push-nein`, `push-nein-2`, `push-ende`, `baer-sad`, `trost-hug`,
`baer-sad-nein`, `baer-sad-nein-2`, `baer-sad-gut`); a second frame `-b` (or `-c`) fades slowly in and out
for a little movement in the big picture (`useFrame` in `shared.tsx`); the cards show only their first frame. A picture the game asks for that is not made yet shows a placeholder with its
file name (`Placeholder` in `shared.tsx`): new pictures are never generated on your own – list each one
with its prompt in `bilder/README.md` under „Geplant“, so the user can look at the idea first and then
make it with `/bild-erzeugen`. A new story (`selbst.ts`) whose pictures are still planned would show players placeholders:
the built site leaves it off the start screen until all its pictures are made (`stories.ts`, `PROD`, `situationImages`) –
with only the first one made, seven of eight cards were still placeholders – and the dev server shows it to look at. `feelings.test.ts` allows a missing picture only while it is listed there,
and fails when a listed one has been made (move its row into its table). Choices are picture cards (`ChoiceCard` in `shared.tsx`)
with a green tick or red cross, so children can choose without reading; „Menü“, „Nochmal“ and „Weiter“ at a pass's
end are the shared `GameEnd` (`inline`), words only like in every game. Timing of a story's beats and its sounds in
`story.ts`.

The big picture and the cards keep one size for the whole round – nothing grows or shrinks, and a new picture only
fades in where the last one was (`feelings.css` works the room out from the screen alone, cq units of `.story-play`).

Under every picture, big or card (on wide and low screens on it), a short caption says what it shows – for
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
(`…-passiert`, `baer-…`) as the only `--ref`, with the same cast and background, and what the first picture shows
happened stays seen in every later one (the burst balloon's scraps lie on the floor, the bear keeps his party hat –
pictures that lost them were redrawn, user feedback, November 2026; name them in the prompt) –
`bun run frames --scenes` lists pictures whose background drifted. `feelings.test.ts` fails when a story or the
bear asks for a picture that is not in `bilder/`.

## Languages

The game speaks the app language (German, English, Chinese, Hindi, Spanish, Arabic or Russian, chosen on the home
page, `src/lib/language.ts`): start screen, captions and everything read aloud. The German data (`bear.ts`,
`kita.ts`, `selbst.ts`) holds pictures, sounds and order; `bear.<lang>.ts` and `kita.<lang>.ts` (en, zh, hi, es, ar, ru;
the stories of `selbst.ts` are in `kita.<lang>.ts` too, after the kindergarten's) hold only the words, by id, step for step and beat for beat, and `localized.ts` lays them over the German (`feelingIn`,
`situationIn`, `comfortsIn`, `storyIn`; `COMFORT_TEXTS`, `FEELING_TEXTS`, `SITUATION_TEXTS` by language). Small texts
(the questions, praise, weather captions, start screen notes) are `Localized` inline: `t({ de, en, zh, hi, es, ar, ru })`.
Everything said is played from its ElevenLabs recording (`useVoice` in `shared.tsx`, files in `stimme/`), recorded in
German only so far (November 2026): a line in another language stays silent until the user asks for its recordings,
a line still in German plays its German one. A beat with a recording stays long enough to be heard (`beatMs`), and a
story loads its recordings when it starts (`preload`). A new or changed line is listed by `src/content/recordedLines.ts`
(`gefuehle`) and recorded with `bun run voice make --only gefuehle`, only when the user asks. Rules:
- New stories, feelings and kind things come in German only; their translations are written only when the user
  asks (a missing entry in `bear.<lang>.ts`/`kita.<lang>.ts` is told in German). A not-so-good idea at home
  without its translation is `null` and told in German; `useVoice` plays a line that is still German from its German
  recording. But a story that has a translation must match the German step for step and beat for
  beat (a sound-only beat is `{}`): when you add or remove a step or beat in a translated story, change every
  `kita.<lang>.ts` too, or delete that story's entry there. `feelings.test.ts` fails when they don't match, when a
  language translated so far misses a story, feeling or kind thing, and when Russian, Chinese, Hindi or Arabic has
  a Latin letter.
- Names: the bear is „Little Bear“ / „小熊“ / „भालू“ (kindergarten „छोटा भालू“) / „Osito“ / „الدبدوب“ / „Мишка“ (at home and in the
  kindergarten); the fox „Little Fox“ / „小狐狸“ / „लोमड़ी“ / „Zorrito“ / „الثعلب الصغير“ / „Лисёнок“; the hare „Bunny“ /
  „小兔子“ / „खरगोश“ / „Conejito“ / „الأرنب“ / „Зайчик“; the hedgehog „Hedgehog“ / „小刺猬“ / „साही“ / „Erizo“ / „القنفذ“ /
  „Ёжик“; the teacher „the teacher“ / „老师“ / „टीचर“ / „la maestra“ / „المعلمة“ / „воспитательница“; the one who brings
  the bear „Big Bear“ / „大熊“ / „बड़ा भालू“ / „el oso grande“ / „الدب الكبير“ / „большой медведь“. Spanish is Latin American
  („¡Alto!“, „enojado“), Hindi's kindergarten the „प्ले स्कूल“.
- Nothing said to or about the child depends on boy or girl: Russian feelings as „Мишке грустно“, captions as
  adverbs („Дождь, грустно“), praise „Молодец!“; Spanish „tú“ without adjectives about the child; Hindi requests
  (सहलाओ) or the bear as subject; Arabic „we“ (نعانق، ماذا نفعل؟) or what the bear can do, never a command.
  The not-so-good answers start with „Hmm,“ / „嗯，“ / „Хм,“ like the German „Hmm,“.
