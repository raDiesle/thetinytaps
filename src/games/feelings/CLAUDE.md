# Gefühle

A book of its own on the shelf (category `gefuehle` in `games.ts`, world „gefuehle“ in `Worlds.tsx`, cover
`cover-gefuehle.webp`; user decision, November 2026) with two games; their names are in `names.ts`. Ideas for more
games in the book are area J on `/management/` (`src/content/ideas/j-feelings-games.ts`), new scenes area C:
- **„Wie geht's dir?“** (`/wie-gehts-dir/`, `MoodGame.tsx`, `MoodPlay.tsx`, `mood.ts`, `moodArt.tsx`) plays at once,
  one step after the other (ideas C-29 to C-36):
  1. Eight cards of feelings (`MOODS`: fröhlich, stolz, aufgeregt, ruhig, müde, traurig, wütend, ängstlich – C-29), each
     a fox or bear child showing it in its face with Mama or Papa beside it (`gesicht-…`, C-30), four of each, so both
     mascots are there. Picked, its grown-up takes the little one in its arms (`gesicht-…-arm`) while „Das kenne ich
     auch!“ is said. Until all sixteen pictures are made, the built site shows the four old weather cards instead
     (`wetter-…`, `Mood.weather`, `SHOWS_FACES`), the dev server their placeholders.
     **Morning and evening** (C-33): the feeling picked is kept per time of day (`MoodDay` under
     `tinytaps.mood.day.v2`, `daytimeOf` from Zähne putzen: before 14:00 is morning); in the evening, where the child
     picked one this morning, both cards stand side by side instead of the hug, a little longer (`COMPARE_MS`) –
     „Heute früh: …“ paler, „Jetzt: …“ – so the grown-up can talk about how the day changed it. Only today's morning
     counts (`morningMood`), nothing older is kept. The Tagesplan's „Wie geht's dir?“ card (a ritual, `rituals.ts` in
     `rewards/`) opens the game with `{ returnTo }`, and the pick calls `finishRoutineStep()`, so back on the plan the
     card is ticked. The comparison is the answer: still pictures, nothing floats up.
  2. The little one makes the feeling's face big for the child to copy, for a mirror or the grown-up (C-35, `BigFace`):
     the shared `MascotHead` with the feeling's brows, eyes and mouth (`Mood.face`) – drawn, so it is there at once.
     „Kannst du auch so gucken?“ and ▶; it waits for a tap, since copying takes the child its time.
  3. „Wie doll ist es?“ (C-36): the feeling's weather (`Mood.sky`: sun, rainbow, wind, snowflake, cloud, rain, storm,
     dark forest – C-29's weathers live on here) drawn small, middling and big on three cards, no numbers. A hard
     feeling (`Mood.hard`) „ganz doll“ first gets two slow breaths blown together: the little one blows with closed
     eyes while a soft circle grows and shrinks round it (`.mood-breath`, its own layer, `BREATH_MS`), then
     „Schon besser.“
  4. „Was hilft dir jetzt?“ (C-31): three cards of the little bear doing what helps (`Mood.helps` from `HELPS`:
     kuscheln, toben, etwas trinken, ein bisschen allein sein, ein Lied – the three that fit that feeling, none of them
     wrong, so the grown-up sees what the child needs); the picked one shows big with its line („Kuscheln tut gut.“).
     The built site asks it only once all five `hilft-…` pictures are made (`ASKS_HELP`).
  5. A pass of the feeling's group plays (`Mood.group`), without touching the place „Alltagssituationen“ goes on from
     (`remember={false}`). „Nochmal“ asks for the feeling again.
     Keys: digits pick that card, any other key one at random (or goes on from the face). The face and the weather signs
     are SVG drawings, not Gemini pictures: a face to copy and a size to compare must be plain and the same each time,
     and they need no picture to wait for. A new feeling gets its face, sky, helps and group in `MOODS` and its two
     pictures in `bilder/README.md` and the queue (`feelings.test.ts` checks).
- **„Alltagssituationen“** (`/gefuehle/`, `FeelingsGame.tsx`, `FeelingsPlay.tsx`): by default one card per **day** of
  the little bear, „Tag 1“, „Tag 2“ … (`days.ts`, `DayPlay.tsx`, idea C-68, see „Tagesgeschichten“ below); the level row
  „Geschichten: 📅 Tage / 😊 Nach Gefühlen“ (`settings.order`) switches to one card per group of feelings
  (`groups.ts`: Traurig, Wütend, Angst, Freude & Stolz, Müde & zu viel, Streit im Kindergarten, Freunde & Familie,
  Igitt & Hoppla – every story in exactly one, checked in `feelings.test.ts`), played without the days' pages. The cards
  always stand in their fixed order; the day or group played last keeps its place, marked „zuletzt“, and goes on with
  the scene where the child stopped (`settings.day`/`dayScene`, `settings.group`/`scene`). The old addresses
  `/gefuehle/zuhause/` and `/gefuehle/kindergarten/` lead back to `/gefuehle/`.

**Tagesgeschichten (user idea, November 2026):** every scene stands in exactly one of eight days (`DAYS`, checked in
`feelings.test.ts`), in the order of a day from getting up to going to sleep, and before each scene a **page of the
story** (`DayPage.tsx`) tells in one or two sentences how the day goes on to it; after the last scene the night
(`tag-nacht`) ends the day with „Nochmal“ and „Weiter“ (the next day, named under it). Rules:
- A page of the story only tells, and **must never look like a scene to choose in**: a picture-book page – the picture
  printed on the paper with its edge fading into it, no white mat, no cards, no question, no ✓ or ✗; the text beside it
  (below it on an upright screen) in the book's serif letters with a big first letter. The whole page is one tap (or any
  key) to the scene, with ▶ in the screen's bottom right corner as in the scenes (see „▶ has one place“); never a timer.
  The dots on top are the day's scenes. The grown-ups' notes (the text to read out, the loudspeaker) are not on a page:
  there they change nothing and only lay over ▶ (user feedback, November 2026).
- A page never says how the scene before it ended: a scene asks another of its steps each time it is played
  (`settings.steps`, shared with the groups), so „Der Turm steht wieder“ would be wrong two times out of three. It says
  what comes next, and nothing in it may contradict the next scene's first picture (who is there, the place, the
  weather): a day keeps its weather (the snow day stays indoors after the snow, the rainy day ends in the storm) and a
  scene that needs something (the jacket) is not put where the scene before already did it.
- A page's picture is the next scene's place a moment _earlier_, nothing has happened yet: drawn from that scene's first
  picture (`firstImage`) as its only `--ref`, made with `dayPage` of `dayPictures.ts`, and queued there
  (`DAY_PICTURE_QUEUE`, `bilder/README.md` „Tagesgeschichten“; `feelings.test.ts` checks both).
- A new scene gets its place in a day (or a new day) in the same commit, with its page. The built site shows a day only
  once all its pages' pictures and scenes are made (`playableDays`); with none, it shows no row and only the groups. When
  the days go live in the built site, the search texts (`seo.ts`, `seo.en.ts`, which say „nach Gefühlen geordnet“) are
  changed to tell of the days in the same commit.
- Wide screens put the picture left and the words right like a book's spread; at a day's end „Weiter“ stands above
  „Nochmal“ in the narrow column of words, never past the page's edge. Look at 844×390, 1024×768 and 1280×720.

**The voice can be switched off in „Alltagssituationen“ (user decision, November 2026):** a grown-up may want to
tell the scenes to the child in their own words. So while a scene plays (never on a page of a day's story), a wooden
loudspeaker with a speech bubble stands at the screen's bottom, left of ▶, beside the book of the text to read out (`VoiceSwitch.tsx`, drawn like the shelf's
loudspeaker for the music). One tap on it (never held: held, it was too slow for grown-ups, user feedback, November
2026) switches off everything said – the scene,
the question, the answers, „Juhu!“ – and the bubble gives way to a red cross; tapped again, it speaks again. The sounds
(crying, laughing, a crash) stay. It is kept in `settings.voice` and checked when a line is due (`useVoice`), so lines
already waiting stay silent too, and the beats keep the length of their recordings, giving the grown-up the same time
to tell them. „Wie geht's dir?“ always speaks (`MoodGame` sets `voice: true`) and has no such switch; no other game gets
one (`feelings.test.ts`).

**The text to read out (user wish and feedback, November 2026):** for grown-ups who tell the scenes themselves, a
paper note with an open book stands in the screen's bottom right corner, left of the loudspeaker (`ReadAlong.tsx`,
`.story-corner`; upright, where the cards fill the bottom, on the picture's top right corner below the dots). One tap
opens it and one tap closes it – never held (held, it was too slow for grown-ups). It opens a paper sheet right above
the two notes, in the corner where it covers least of the pictures: on wide screens below the good card, as wide as the
room right of the picture and only as far over the picture as a readable line needs. It holds everything the voice says
in this round (`readAlong` in `rounds.ts`): the scene and its question, the not-so-good idea (red cross, its caption,
its answer), the good one (tick, caption, what is told), the happy end. While the voice tells the scene, the part told
now is marked with the highlighter and scrolled into view; **with the voice off everything shows alike, nothing marked,
since the grown-up reads it all** – and switching the voice off opens the sheet by itself. It stays open from scene to
scene and visit to visit (`settings.text`), but steps aside at a pass's end, where „Weiter“ stands. Only in
„Alltagssituationen“, never in „Wie geht's dir?“; `feelings.test.ts` checks that the sheet holds every line a round says
– a new kind of line said in a round goes into `readAlong` too – and that both notes are tapped, never held (`tapProps`).

**One scene, one choice (user feedback, November 2026).** A round (`rounds.ts`, `RoundPlay.tsx`) is one scene and one
step of its story: the starting picture, one question, exactly two cards – the not-so-good idea and the good one. After
the good one comes its picture (and, on the story's last step, its happy end), then the _next scene_ of the group
(`PassPlay.tsx`) – never back to the same starting picture for another choice. A pass plays each scene of its
group once; each story remembers its next step (`settings.steps`), so the next pass shows the same scenes with their
other choices. After the last scene of a pass come „Nochmal“ (the group again) and „Weiter“ (the next group), which
writes the next group's name under it (`GameEnd showNext`): where „Weiter“ changes the feeling, grown-ups see which one
comes before they tap (user feedback, November 2026).
The dots at the top are the pass's scenes, tapped to play one again (see „The dots go back“).

**One tap chooses** (user feedback, November 2026): no first tap that only shows a card big, no ring waiting for a
second tap, no hand tapping, no way back from a card. The not-so-good card shows big with a still red frame, a cross on
the corner and what it leads to, heard, while the answer says why; then the starting picture with that card crossed
out and the good one left. The good card gets a still green frame with a tick and a laugh („Juhu!“), then its picture.
Keys: the left arrow picks the not-so-good idea, every other key the good one.

**▶ has one place, and the whole screen goes on (user feedback, November 2026):** wherever the game waits for a tap
to go on – a scene told, a chosen idea's last picture, a page of a day's story, „Wie geht's dir?“'s face to copy – ▶
stands at the same spot, the screen's bottom right corner, and a tap anywhere on the screen goes on (`GoOn` in
`shared.tsx`), except within reach of anything else that can be tapped (the dots, the grown-ups' notes, ✕), whose taps
stay theirs. Nothing else ever stands in that corner: the grown-ups' notes stand left of it (`feelings.test.ts`). ▶ on
the picture's corner and ▶ under a page's text moved from screen to screen and lay under the notes.

**The dots go back (user wish, November 2026):** the dots at the top are tapped – a ✓ plays that scene again with the
choice it played this visit, the yellow one starts the scene now from its beginning; the dots still to come are not
tapped. All of them are plain targets (`data-tap=""`), never `"done"`, so a tap just next to one finds the nearest, not
the next one to come.

**A scene goes on with a tap, never by a timer (user feedback, November 2026):** the starting picture is told and
then waits, with ▶; one tap anywhere (or any key) brings the two cards. The
narration goes on meanwhile. Once the cards are there, tapping the big picture does nothing. After the good choice the
story goes on by itself only within the scene (the good idea's picture, the happy end); then that picture waits with ▶
again, and only a tap (or any key) brings the next scene (`onDone`; user feedback, November 2026: it went on by
itself before one could look). The last scene of a pass waits with its end buttons instead.

**Calm (user feedback, November 2026):** nothing floats up (no hearts, stars, 💢, 💥, 💧, 💤, 🎉), nothing hops,
shakes, pulses, glows, stamps or grows – not after a choice, not while waiting. Only one thing moves at a time, its
two frames fading slowly into each other (`FRAME_MS`, 1.5 s, `Frames` in `shared.tsx`): the big picture while the scene
is shown and while a chosen idea plays, the two cards while the child chooses – then the big picture stands on its
first frame (user feedback, November 2026). The picture of the
choice – the relieved, happy bear – is the answer. `GameEnd`'s pop and „Weiter“'s breathing are switched off here too.
`feelings.test.ts` fails on a `float(`, the old keyframes, or a second `infinite` animation.

A step's question and caption stand on their own: a step is played in its own pass, from the story's first picture,
never right after the step before it. So a new question never says „noch“ or „wieder“ as if an earlier step had just
happened. The questions written before (November 2026: „Der Bär ist noch traurig“, „Der Fuchs ist noch da“, about 15
in `bear.ts`, `kita.ts`, `selbst.ts`) still do; rewriting them means new recordings and translations, so it waits
until the user asks.

**The whole text at once, and it says whose view the scene takes (user feedback, November 2026):** the big picture's
caption is the round's question from the moment the scene shows, never one sentence after another: what is the matter
and who chooses, in one compact line – „Der Bär hat Angst. Was machst du?“ when the child helps him, „Der kleine Bär
ist ganz oben. Was kann er tun?“ when the bear acts himself. A separate role sentence before it („Stell dir vor: Du
bist der kleine Bär.“, `ROLE_LINES`) was tried and taken out again: two sentences in turn said less than one question.
A caption, big or on a card, always shows whole: it takes a second line, never „…“ (`feelings.test.ts` checks).

**Layout (user's choice, November 2026):** wide screens (from 6:5) put the picture in the middle, as big as the
height allows unless the cards would get less than a quarter of the width (`--card-min`, 30 % on tablets), the
not-so-good card at the bottom left and the good one at the top right, each lying a fifth of its width over a corner
of the picture; the picture's tick or cross sits on its top left corner. No margins beyond 8 px – not even a phone's safe-area
inset, which left an empty strip beside the card. Cards are never see-through, waiting or crossed out (pale by filter,
not opacity): the big picture showed through and seemed to lie on top of them. At the end „Nochmal“
stands left of the picture, „Weiter“ right of it. Upright screens keep the picture on top and the two cards
below. Captions lie on the pictures' lower edge on wide or low screens. Look at 844×390, 1024×768 and 1280×720 after
a change.

**Who hurts is a raccoon, never fox or bear (user decision, November 2026):** in a new story the other child who
pushes, kicks, takes something away or knocks it over is the raccoon (`bilder/README.md`, „Figuren“); fox and bear,
the app's mascots, help and comfort. The kindergarten stories made before (`kita.ts` and about 56 pictures) keep their
fox for now: redrawing them costs money, so neither their pictures nor their lines (with translations and recordings)
are changed until the user asks (the task stays open in `mascotStatus.ts`).

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
A good idea does something that helps – comforts, calms, mends, shares – never only looks at what happened in another
way: „Zwei Hälften zeigen“ („Jetzt hab ich zwei Kekse!“) made no sense to grown-ups and was taken out; the broken cookie
is shared with the fox instead (user feedback, November 2026). Pictures are named by a step's place (`cookie-2`,
`cookie-nein-2`), so a step taken out renames the pictures of the steps after it, in `bilder/` and `bilder/README.md`.
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

**What a story is about is named so it can't be mixed up with anything in the picture (user feedback, November 2026):**
in „Traurig, Kuschelhase weg“ the text said only „das Kuscheltier ist weg“ while the fox sat there holding his own plush
dog, and with „Dem Fuchs seins wegnehmen“ a grown-up couldn't tell whether the fox had the bear's lost toy. Where
another one in the picture has something of the same kind, every line names each by what it is (the bear's
„Kuschelhase“, the fox's „Kuschelhund“), never by the kind alone („Kuscheltier“, „Spielzeug“, „seins“), and a card that
takes the other one's thing says whose it is.

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
  closed eyes, a smile, no red face); only the first picture and the not-so-good ideas keep the angry face. The others
  in a good idea's picture are glad too: the fox the bear calls up or helps smiles, never looks worried (user feedback,
  November 2026: on the climbing frame the fox looked sad on the good cards).
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

Every picture is a Gemini illustration from `bilder/`, shown big in the middle (only „Wie geht's dir?“'s face to copy
and weather signs are drawn, see above).
`images.ts` finds them by name (`storyImages`, `bearImages`: `push-passiert`,
`push-1`, `push-nein`, `push-nein-2`, `push-ende`, `baer-sad`, `trost-hug`,
`baer-sad-nein`, `baer-sad-nein-2`, `baer-sad-gut`); a second frame `-b` (or `-c`) fades slowly in and out
for a little movement (`Frames` in `shared.tsx`): in the big picture while the scene is shown, on the cards while the
child chooses. A picture the game asks for that is not made yet shows a placeholder with its
file name (`Placeholder` in `shared.tsx`): new pictures are never generated on your own – list each one
with its prompt in `bilder/README.md` under „Geplant“, so the user can look at the idea first, and into the
picture queue (`src/content/pictureQueue.ts`), where it waits to be made together with other sessions' pictures in one
batch when the user asks (`/bild-erzeugen`) – never `--make` it yourself, not even when its sheet is full (user
feedback, November 2026). A new story (`selbst.ts`) whose pictures are still planned would show players placeholders:
the built site leaves it off the start screen until all its pictures are made (`stories.ts`, `PROD`, `situationImages`) –
with only the first one made, seven of eight cards were still placeholders – and the dev server shows it to look at. `feelings.test.ts` allows a missing picture only while it is listed there,
and fails when a listed one has been made (move its row into its table). Choices are picture cards (`ChoiceCard` in `shared.tsx`)
with a green tick or red cross, so children can choose without reading; „Nochmal“ and „Weiter“ at a pass's
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
`situationIn`, `comfortsIn`, `storyIn`; `COMFORT_TEXTS`, `FEELING_TEXTS`, `SITUATION_TEXTS` by language). The days' pages of the story are in `days.<lang>.ts` (by day id, one page per scene in the German order, and the
day's end), laid over by `dayIn`; a scene added to or moved within a day changes every `days.<lang>.ts` too, or that
day's entry there is deleted (it is then told in German; `feelings.test.ts` checks the pages match). Small texts
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
