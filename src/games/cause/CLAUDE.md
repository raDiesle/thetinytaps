# Was ist passiert?

Route `/was-ist-passiert/`, idea **J-03** (area J on `/management/`, `src/content/ideas/j-feelings-games.ts`), the fourth
game of the book „Gefühle“ (after „Alltagssituationen“, „Wie geht's dir?“ and „Was brauche ich?“). A child (fox or bear,
with its grown-up beside it) shows a feeling in its face; two pictures show what happened. The right one lets the face
change (crying → smiling, the grown-up claps), then the next round comes. A wrong one only makes the child shake its head
gently. **Still being built** (`unfinished` in `games.ts`, user feedback, November 2026: trying it, the user didn't
understand it): it stands neither in the book nor in search results, only under „🚧 In Arbeit“ on `/management/`. Before publishing it, it must explain itself by
playing: a feeling plain beyond the mouth (sad and angry are both `frown` now), causes shown as pictures made with
Gemini (`/bild-erzeugen`) from each round's text instead of emojis, many more rounds than four, and the cause played out – then drop the mark and name the game again in the book's
search texts (`/spiele/gefuehle/`, all seven languages). Four rounds, then the shared end (`GameEnd`, „Nochmal“). Plays at once, no start screen, no settings, silent:
no voice, only the sounds of a tap (`playTwinkle`, `playPlop`).
- `CauseGame.tsx` – the start screen (`GameShell startMode="play"`).
- `CausePlay.tsx` – the rounds, taps, keys (digits pick, any other key one at random), the timer to the next round.
- `rounds.ts` – the rounds and their pictures (still emojis, to be replaced), each with its question (`label`).
- `names.ts` – the name and line in every app language (translated 10 November 2026), and `rounds.ts` the question and each picture's question for grown-ups the same.
- `cause.css` – classes prefixed `cause-`.

Rules of this game:
- Exactly one picture per round fits the feeling (`cause.test.ts`).
- **No emojis as the pictures of what happened** (user feedback, November 2026: „die Verwendung von Emoticons ist einfach
  schlecht“). Each cause is a picture made with Gemini from the round's text (`label`, `/bild-erzeugen`, through the
  picture queue), showing the scene – the balloon flying off from the child's paw, the dog barking at it – never an
  emoji or two side by side (`✋🪏`). The emojis there now are placeholders until those pictures are made; a new round
  comes with its picture's prompt, never with an emoji. No text in the pictures.
- **Under each picture stands its question for grown-ups** (`label`, user feedback, November 2026: „nur
  Beschreibungstext unter die Bilder, die der Erwachsene für jedes Bild lesen kann als Frage“): small and quiet, present
  tense, ending in „?“ („Fliegt der Luftballon weg?“, `cause.test.ts`), so a grown-up asks it the child picture by
  picture. That is the game's only help: no help text on the management page or elsewhere.
- Many rounds, not four (user plan, November 2026): the game gets many more scenes, written first as text, then drawn.
- The head shake is on the HTML layer round the child's svg (`.cause-no`), never inside the svg.
