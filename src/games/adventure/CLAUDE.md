# Bewegungsabenteuer

Route `/abenteuer/`.

A 3D movement story (three.js, loaded only on this page). The fox Tapsi shows each movement, the child does it along in front of the screen, and the world answers on its own time – there is no camera and no text, Tapsi says everything. The movement library (`library/`: categories, 105 movements, worlds, scenarios, sequences, quality notes in `library/README.md`) is kept apart from the 3D story (`stories/treasureIsland/`, „Die Schatzinsel“, about 6 minutes: `build()` and the moving in `index.ts`, the steps and their timing in `script.ts`, the props in `scenery.ts`, put together in `world.ts`, positions along the path in `layout.ts`): it opens with a red dotted trail drawing the way to the chest like on a treasure map, and at every station Tapsi first shows the movement alone, then the child joins in. Tapsi always faces the island and the camera looks from behind, so the child sees what Tapsi sees and left is left; where arms in front of the body would be hidden (rope, key) it moves round to the side and up; it films the stone jumps from the side like a jump-and-run, and goes centered and low behind Tapsi when things roll at it; for the swinging log it sits right behind and just over Tapsi's head, looking the way Tapsi looks, and for the apples the same but lower, looking up into the tree. The camera keeps the fox big in every shot, and on phones the route bar is hidden (the ⏮ ⏭ buttons still jump). After the trail the camera swings round in front of Tapsi, so the child sees its face first, then goes behind. Tapsi starts standing on Ole: it waves to Kiki, casts a fishing rod over the right shoulder (the paws go where the rod is, beside the head), then sits down and later stands up again as steps of their own, so the child does it too – only the movement itself, done together with no showing first and no waiting after (`PRAISE` is short there), through a squat like a child (`sitDown` in `three/player.ts`); it paddles sitting. Every movement does something to a thing in front of Tapsi: fish leaping over the float, waving to Kiki, the paddle, scorpions, a star box over every jump to bump with the head (Ole walks fast enough that each jump has its own), the log, two hanging drums whose every beat scares a bird off the path, the crank, coconuts the monkeys throw down (they land on a raised bank in front of Ole, `ROLL_BANK`, and hop over Ole's head so the turtle never hides them; passing right where Tapsi stood: a big step aside, then from the left under the lifted left leg, then through the straddled legs), the riddle door (twice round), cobwebs, the rope (pulled in hand over hand: the raft moves only while a paw pulls, `pulledIn` in `motion.ts`, and the rope runs from the paws past the body's side onto the ground), and at the end, in this order: the key opens the chest in its lock, the crabs carry it up the beach, Tapsi hops down off Ole, reaches deep into it and throws the coins up high with both arms (a rain of gold instead of a dance; `CARRY`, `tossAt` in `script.ts`), then turns round to us and cheers, and waves goodbye at sunset. Every step's clip is a whole number of goes and each go has its target (`CYCLES` in `script.ts`, checked by `treasureIsland.test.ts`), so nothing is left over at the end of a movement. Paws hold what they turn (`guide.hold` for paddle, rod, crank bar, key ring), and Ole walks from the cobwebs through the gorge into the bay – no cut, no flash. The fox is a posable rig (`three/guide.ts`) with one motion clip per movement (`three/clips/`: one file per body part, which decides what glows; building blocks and timings in `motion.ts`); `three/player.ts` plays a story on a clock (arrow keys skip, Space pauses), `three/stage.ts` has renderer, sky, light and water. The fox has a thin ink outline, and only the body part a movement is about (e.g. the arms at the crank) gets a wide glowing one while it moves (`three/contour.ts`, inverted hulls). A dark child figure with a glowing rim like in "Just Dance" (`three/silhouette.ts`) shows every movement too, seen from the same side as the camera sees the fox. In development `__adventure.seek(seconds)` in the console jumps to a moment.

The start screen picks the story (`settings.story`, the modes are the sequences' titles). The second story is
`stories/cloudTrip/`, „Die Wolkenreise“ (about 3 minutes, same files as the treasure island): it opens at a
dark rain cloud that hides the sun, then flies back over the land to Tapsi standing on the little cloud Wolle
on a meadow by a village. Tapsi waves Kiki over, flaps its arms so Wolle rises (only on the downstrokes),
ducks under small planes (camera right behind and just over the head), taps balloons that float to the paws
until they pop, sits down for the fast part, leans left and right through the curves for the stars beside the
cloud towers (Wolle slaloms and banks, the camera leans with it), stands up under the rain cloud, pushes its
grey puffs up and away until the sun comes out, paints a rainbow band by band with big arm arcs, turns round
to us and cheers on Wolle (it bounces under every landing), and waves goodbye while Kiki flies off into the
sun. Kiki changes to Tapsi's left once, ahead of it, at the balloons (`KIKI` in `index.ts`), because the
camera often looks from the right from then on. The timing helpers (`passTime`, `tapTime`, `starTime`,
`pushTime`, `curveZ`) are in `script.ts`; `cloudTrip.test.ts` checks whole goes and lengths.

## Tapsi's voice

What Tapsi says is in `stories/<story>/lines.ts` (no three.js there, so Node can read it), and in the other
languages of the app (`src/content/targetLanguages.ts`) in `lines.<language>.ts` next to it: the same steps and
lines in the same order (`StoryTranslation`, listed in the story's `translations.ts`; `storyIn()` swaps them in).
Grown-ups choose the language on the start screen („Tapsi spricht“, the setting `language`); a story without
a translation into it is said in German (and the start screen says so). Translations say
nothing that changes for a boy or a girl (no "you did", no "brave boy"): commands, "we" and "your turn".
Each line can have a recording in `stories/<story>/stimme/<hash>.mp3` (German) or
`stimme/<language>/<language>-<hash>.mp3`, made with ElevenLabs as a warm children's coach voice, the same voice
in every language (`yarn voice`, see `scripts/elevenlabs-voice.mjs`; the voice and model are in `stimme.json`,
the key in `ELEVENLABS_API_KEY`). The file name is a hash of the text (`voiceId.ts`), so a changed line has no
recording until `yarn voice make` records it again; `voice.ts` plays recordings and falls back to the browser's
voice for lines without one. `voice.test.ts` checks the translations against the German steps and that a
language with recordings has one for every line and no extra ones. Recordings in other languages than German
are not kept offline by every phone, only once the story has started in that language (`rsbuild.config.ts`, `src/sw.js`).
- A new story or changed lines come in German only: translate (`lines.<language>.ts`) and record (`yarn voice make`)
  only when the user asks for it, and keep the story's row in `src/content/ideas/languageStatus.ts` true
  (`content.test.ts` checks it against the files).
- ElevenLabs always with the turbo model (`eleven_v4_turbo`, in `stimme.json`): it costs half the credits, and
  the 10,000 credits a month have to reach for every language. `yarn voice make --dry [--lang en]` shows what
  would be recorded and how many credits it costs; the German lines were recorded with `eleven_v4` and audio
  tags before, the other languages with turbo and `--no-tags`.

## Working on levels

- Read `LEVEL-REGELN.md` in this folder first and check the work against it. Every piece of feedback
  on a level goes into it as a general rule (German), in the same commit as the fix.
- The movement library has its own notes in `library/README.md`; `library/library.test.ts` checks that
  scenarios and sequences only use movements that exist.
- `__adventure.seek(seconds)` in the console jumps to a moment; arrow keys skip, Space pauses.
- three.js is only imported below this folder, so the rest of the app stays small.
