# Was ist passiert?

Route `/was-ist-passiert/`, idea **J-03** (area J on `/management/`, `src/content/ideas/j-feelings-games.ts`), a game of
the book „Gefühle“. The little bear of „Alltagssituationen“ shows a feeling; two pictures show what may have happened a
moment before, and the child taps the one that led to it. **Still being built** (`unfinished` in `games.ts`): it stands
neither in the book nor in search results, only under „🚧 In Arbeit“ on `/management/`, until the user has tried the
new version. Publishing it means dropping the mark and naming the game again in the book's search texts
(`/spiele/gefuehle/`, all seven languages).

Rebuilt on 10 November 2026 (user request: „erweitere um sehr viel deutlich mehr Szenen, dann erstelle die Gemini
Bilder und schreibe den Text darunter (mit Zurück-Button), UI angeordnet wie bei Alltagssituationen“):
- `scenes.ts` – the 30 scenes, in five passes of six (`CAUSE_PASSES`), each mixing the feelings (traurig, wütend, Angst,
  froh, stolz, igitt): what the picture shows (`shows`), the two questions under the cards (`cause`, `other`), why
  (`told`), and what Gemini draws (`draw`). German only; translations would come as `scenes.<lang>.ts` keyed by id.
- `causePictures.ts` – the scenes' pictures as the picture queue takes them; `FEELING_WAITING` and `CAUSE_WAITING` list the scenes whose feeling or earlier moments are still to make (all made 10 November 2026).
- `images.ts` – the pictures in `bilder/`: `<id>` (the feeling), `<id>-grund` (what happened), `<id>-anders` (what didn't).
- `CausePlay.tsx` – the passes (kept in `tinytaps.cause.v1`, so the next visit goes on) and one scene's three phases.
- `CauseGame.tsx` – `GameShell startMode="play"`; it imports `../feelings/feelings.css`.
- `names.ts` – the name and line in every app language.

How a scene plays, laid out exactly like „Alltagssituationen“ (`RoundPlay`), with Gefühle's own components
(`StoryPicture`, `ChoiceCard`, `StoryWords`, `GoOn`, `StepBack`, `StepDots` in `../feelings/shared.tsx`, given this
game's pictures by `sources`) – a change of that layout reaches both games:
1. The feeling's picture big, under it „Der kleine Bär weint. Was ist passiert?“; ▶ bottom right, or a tap anywhere.
2. The two pictures A and B side by side, the feeling small above them, each with its question for grown-ups under it
   („Fliegt sein Luftballon weg?“). ◀ (or a tap on the small picture) goes back to the feeling.
3. The other picture: crossed out, a soft plop, the choice stays. The cause: its picture big with the green tick, and
   under it why („Sein Luftballon fliegt weg. Darum ist er traurig.“); ▶ goes to the next scene, on the pass's last one
   `GameEnd` („Nochmal“, „Weiter“ – the next pass).
   The dots at the top are the pass's scenes, a done one tapped plays it again; ◀ on a scene goes to the one before. Keys:
   ←/1 the left card, →/2 the right one, every other key the cause. Silent but for the tap's sounds (`playTwinkle`,
   `playPlop`): no voice, the words are for a grown-up to read out. `DevTag` names the scene („T03 · ballon“).

Rules of this game:
- **Exactly one picture fits**, and the other leads plainly to another feeling (a happy moment beside a sad feeling, a
  mishap beside a happy one) – never something that could rightly have caused it too.
- **The same place in all three pictures**: the cause and the other are drawn together on one sheet from the feeling's
  picture as the only `--ref` (`causePictures`), so no background tells the right one. The bear's face in each shows
  the feeling that moment brings.
- **No emojis as pictures** (user feedback, November 2026: „die Verwendung von Emoticons ist einfach schlecht“): every
  picture is made with Gemini; a new scene comes with its `draw` texts and into both waiting lists. No text in the pictures.
- **Under each picture stands its question for grown-ups** (user feedback, November 2026): present tense, ending in „?“,
  so a grown-up asks it the child picture by picture; that is the game's only help, no help text elsewhere.
- **Look at every scene's three pictures side by side before keeping them** (a contact sheet of feeling, `-grund`,
  `-anders`), and make a bad sheet again alone with its prompt sharpened. The first batch (10 November 2026) had five
  bad ones of 30: told „without a jacket“ in the rain, Gemini drew the bear with no clothes at all (say what he still
  wears); the raccoon's tail came back under the swing in the panel where he swings alone (say „no raccoon, no tail“);
  one panel got a drawn frame round it; a „determined face“ read as angry beside a proud feeling (name the face that
  fits the feeling); and a found toy car came twice (say „only this ONE“).
- **Things of the moment may be in the air** (a balloon flying off, soap bubbles, a kite): the prompts forbid hearts,
  stars, symbols and words anywhere, never „nothing floats“, which would keep the cause out of its own picture.
- **The little bear is the child of every scene**, as in Gefühle's pictures; whoever takes, knocks over or scribbles is
  the raccoon, never a fox or a bear (`cause.test.ts`). Grown-up bears come only where they do the cause.
