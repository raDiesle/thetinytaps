# Die Schnullerfee

Route `/schnullerfee-spiel/` · idea H-11 (Alltagshelfer). Since 10 November 2026 the shelf's book „Schnullerfee“ at
`/schnullerfee/` is the story in chapters (`src/games/pacifierstory`); this played story moved here and stays unfinished. While it is being built (`unfinished` in `games.ts`, user decision, November 2026) it is not on the shelf, only linked from `/management/`, and its way back leads there.

A story without words for the evening before the pacifiers go, played by the child with a grown-up beside it. It
plays at once (`startMode`), with no start screen; ✕ goes back to the page before it. One room, Tapsi's bedroom, from
evening to morning (`PacifierPlay.tsx`), one thing to tap per step, glowing, with a still pointing hand before its first
tap (`goalSpot`); every key does what the step waits for (`act`), a tap on anything else sparkles with a soft note:
1. `collect` – three pacifiers lie on the bed, the floor and the windowsill; each tapped one flies into the box beside
   Tapsi (or is tied to the balloon's string). With the third the box shuts with a bow.
2. `send` – the box goes onto the windowsill, or the balloon flies out of the window, small into the evening sky.
3. `sleep` – the lamp: the room goes dark, the window shows the night, Tapsi lies asleep in his bed, a kiss flies from
   Mama to his pillow and Mama goes out.
4. `fairy` – a star in the window; tapped, the fairy flies in out of it (a little bear with wings, crown and star wand,
   holding the balloon in the balloon story). Tapped three times (`GLITTERS`) she glitters, the box (or the balloon she
   holds) goes in a puff, a present stands on the windowsill, and she flies out of the window again.
5. `wake` – sleeping Tapsi: morning comes, he gets up, Mama is back.
6. `gift` – the present: the lid flies off, the gift jumps out big into the room, hearts, stars and notes rise slowly, Tapsi and Mama cheer
   (`party`), then `GameEnd` small in the corners („Nochmal“ bottom right; one story, so no „Weiter“; the way back is the corner).

Behind ⚙️ while playing (`PlayOptions`, `PacifierGame.tsx`) grown-ups choose what they really do at home: „Abschied der
Schnuller“ (`FAREWELLS`: the box on the windowsill or the balloon) and „Geschenk der Fee“ (`GIFTS`, eight pictures).
Both apply at once, also in the middle of the story.

Files: `content.ts` (choices, places of everything in the 1600 × 900 picture, `SPOTS`, `PACIFIERS`), `drawings.tsx`
(all drawings, each a small svg), `pacifier.css` (`sf-` classes and keyframes).

## Rules

- The picture is drawn 1600 × 900 and covers the screen (`.sf-stage`): what matters stays within x 200–1400 and
  y 80–820, since a phone on its side cuts the top and bottom and a tablet the sides.
- The room (`Room`) is drawn once and never changes; everything that moves or changes is a layer of its own
  (`Piece`), placed by its spot and moved by `--dx` / `--dy` / `--s` in CSS – never a moved group inside the room's svg.
- Nothing moves or sounds before the first tap: the glow and the hand are still (`document.getAnimations()` is empty).
- No words in the picture and no voice: the grown-up tells the story. Things only carry their name as `aria-label`.
- The fairy only ever gives: no sad ending, nothing taken away that doesn't come back as a present. The fox family
  (Tapsi and Mama Fuchs) is the app's mascot pair; the fairy is a bear in a role and comes alone.
- What still waits: the child's name and the fairy's letter to print (H-02).
