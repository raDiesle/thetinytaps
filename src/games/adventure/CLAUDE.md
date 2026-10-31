# Bewegungsabenteuer

Route `/abenteuer/`.

A 3D movement story (three.js, loaded only on this page). The fox Tapsi shows each movement, the child does it along in front of the screen, and the world answers on its own time – there is no camera and no text, Tapsi says everything. The movement library (`library/`: categories, 105 movements, worlds, scenarios, sequences, quality notes in `library/README.md`) is kept apart from the 3D story (`stories/treasureIsland/`, „Die Schatzinsel“, about 6 minutes: `build()` and the moving in `index.ts`, the steps and their timing in `script.ts`, the props in `scenery.ts`, put together in `world.ts`, positions along the path in `layout.ts`): it opens with a red dotted trail drawing the way to the chest like on a treasure map, and at every station Tapsi first shows the movement alone, then the child joins in. Tapsi always faces the island and the camera looks from behind, so the child sees what Tapsi sees and left is left; where arms in front of the body would be hidden (rope, key) it moves round to the side and up; it films the stone jumps from the side like a jump-and-run, and goes centered and low behind Tapsi when things roll at it; for the swinging log it sits right behind and just over Tapsi's head, looking the way Tapsi looks, and for the apples the same but lower, looking up into the tree. The camera keeps the fox big in every shot, and on phones the route bar is hidden (the ⏮ ⏭ buttons still jump). After the trail the camera swings round in front of Tapsi, so the child sees its face first, then goes behind. Tapsi starts standing on Ole: it waves to Kiki, casts a fishing rod over the right shoulder (the paws go where the rod is, beside the head), then sits down and later stands up again as steps of their own, so the child does it too – only the movement itself, done together with no showing first and no waiting after (`PRAISE` is short there), through a squat like a child (`sitDown` in `three/player.ts`); it paddles sitting. Every movement does something to a thing in front of Tapsi: fish leaping over the float, waving to Kiki, the paddle, scorpions, a star box over every jump to bump with the head (Ole walks fast enough that each jump has its own), the log, two hanging drums whose every beat scares a bird off the path, the crank, coconuts the monkeys throw down (they land on a raised bank in front of Ole, `ROLL_BANK`, and hop over Ole's head so the turtle never hides them; passing right where Tapsi stood: a big step aside, then from the left under the lifted left leg, then through the straddled legs), the riddle door (twice round), cobwebs, the rope (pulled in hand over hand: the raft moves only while a paw pulls, `pulledIn` in `motion.ts`, and the rope runs from the paws past the body's side onto the ground), and at the end, in this order: the key opens the chest in its lock, the crabs carry it up the beach, Tapsi hops down off Ole, reaches deep into it and throws the coins up high with both arms (a rain of gold instead of a dance; `CARRY`, `tossAt` in `script.ts`), then turns round to us and cheers, and waves goodbye at sunset. Every step's clip is a whole number of goes and each go has its target (`CYCLES` in `script.ts`, checked by `treasureIsland.test.ts`), so nothing is left over at the end of a movement. Paws hold what they turn (`guide.hold` for paddle, rod, crank bar, key ring), and Ole walks from the cobwebs through the gorge into the bay – no cut, no flash. The fox is a posable rig (`three/guide.ts`) with one motion clip per movement (`three/clips/`: one file per body part, which decides what glows; building blocks and timings in `motion.ts`); `three/player.ts` plays a story on a clock (arrow keys skip, Space pauses), `three/stage.ts` has renderer, sky, light and water. The fox has a thin ink outline, and only the body part a movement is about (e.g. the arms at the crank) gets a wide glowing one while it moves (`three/contour.ts`, inverted hulls). A dark child figure with a glowing rim like in "Just Dance" (`three/silhouette.ts`) shows every movement too, seen from the same side as the camera sees the fox. In development `__adventure.seek(seconds)` in the console jumps to a moment.

The start screen picks the story (`settings.story`, the modes are the sequences' titles). At the end of a story the shared `GameEnd` offers „Menü“, „Nochmal“ and „Weiter“ (the next story in `STORIES` order, after the last the first). The second story is
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
lines in the same order (`StoryTranslation`, listed in `src/content/texts/texts-<lang>.ts` (`stories`), which fills the story's `translations.ts`; `storyIn()` swaps them in).
Tapsi speaks the app language (🌐 on the home page), like the menus; a story without a translation into it
is said in English, then German. The other recorded languages wait until the
whole app speaks them and they join 🌐. Translations say
nothing that changes for a boy or a girl (no "you did", no "brave boy"): commands, "we" and "your turn".
Each line can have a recording in `stories/<story>/stimme/<hash>.mp3` (German) or
`stimme/<language>/<language>-<hash>.mp3`, made with ElevenLabs as a warm children's coach voice, the same voice
in every language (`bun run voice`, see `scripts/elevenlabs-voice.mjs`; the voice and model are in `stimme.json`,
the key in `ELEVENLABS_API_KEY`). The file name is a hash of the text (`src/lib/voiceName.ts`), so a changed line has no
recording until `bun run voice make` records it again; `voice.ts` plays recordings always, without a switch, like a sound
(root `CLAUDE.md`); a line without one is said by the browser's voice until it is recorded (Tapsi's lines are the game). `voice.test.ts` checks the translations against the German steps and that a
language with recordings has one for every line and no extra ones. Recordings in other languages than German
are not kept offline by every phone, only once the story has started in that language (`tools/build.ts`, `src/sw.js`).
- A new story or changed lines come in German only: translate (`lines.<language>.ts`) and record (`bun run voice make`)
  only when the user asks for it, and keep the story's row in `src/content/ideas/languageStatus.ts` true
  (`content.test.ts` checks it against the files).
- ElevenLabs always with the turbo model (`eleven_v4_turbo`, in `stimme.json`): it costs half the credits, and
  the 10,000 credits a month have to reach for every language. `bun run voice make --dry [--lang en]` shows what
  would be recorded and how many credits it costs; the German lines were recorded with `eleven_v4` and audio
  tags before, the other languages with turbo and `--no-tags`. The service says turbo costs 0.5 credits per character,
  but in October 2026 10,399 characters cost 995 credits, 6,398 (with tags) 498 and 34,408 3,506, so the script estimates
  and checks with a measured 0.1 per character (`CREDITS_PER_CHARACTER`); check `bun run voice credits` after a run.
  Audio tags are not spoken in any language (Whisper heard none in 140 lines of seven languages), so other games are
  recorded with them in every language.

The game has no settings of its own: its own music and the language follow the shared options on the home page (`useCommonSettings`, `useAppLanguage`), the glow and the child figure are always on. Only the story played last is stored (`settings.ts`). The start screen has only the story cards: no „Über das Spiel“ (removed October 2026, like in every game).

## Grown-ups' texts in the app language

- The start screen, buttons, tooltips and notes follow the app language of the home page (`src/lib/language.ts`), as
  Tapsi does. A text that has a translation is written as `t({ de: "…", en: "…", zh: "…", hi: "…", es: "…", ar: "…", ru: "…" })` (`useT()`); new texts
  come in German only, like Tapsi's lines, until the user asks for a language.
- A story's title and its step names on the route come from its translations (`title`, `name` per step in
  `lines.<language>.ts`), shown in the app language (`storyTitle`, `stepName` in `AdventurePlay.tsx`), German where a
  translation has none; the movement library itself stays German (notes for building stories, shown only as a fallback name).
- Names: Wolle is Woolly / 棉棉 / रुई / Pelusa / قطنة / „Пушинка“; Tapsi is Tapsi / 塔普西 / टैप्सी / تابسي / „Тапси“;
  Kiki is Kiki / 琪琪 / कीकी / كيكي / „Кики“; Ole is Ole / 奥乐 / ओले / أولي / „Оле“. Both stories have a title and every step name in
  all six languages (`voice.test.ts` checks it, and that Russian, Chinese, Hindi and Arabic ones have no Latin letters).

## Keeping the scene cheap

three.js visits every object in every frame – world matrices, culling, shadows, the glow's depth – drawn or not, and
each mesh is a draw call or more; that, not the drawing, kept an old phone's main thread busy (`bun run perf abenteuer`,
October 2026: 2,186 objects, 79 % busy, budget 60 %). So:
- Bake what does not move: a prop builder ends with `mergeParts(group, keep)` (`three/props.ts`), which turns all parts
  that never move against the group into one mesh per material; what moves on its own (a lid, a pivot, a head that
  pecks, legs that wiggle) goes into `keep` and stays as it is, and parts shown or hidden together go into a group of
  their own, baked by itself and kept (the star box's face stars). Parts bake together only when they share one
  material, so make a prop's materials once, never `mat(…)` inside a loop (two eyes, two materials). Code that looks for
  a part (the palm's top) runs before the bake. Scenery that never moves at all goes through `mergeStatic`. The fox's
  rigid parts are baked per joint with `outlined`, so the ink line keeps its width.
- Parts that move against each other but look alike are skinned: the fox's arms and legs with fingers and toes are one
  skinned mesh per look (`skinRigid`, `three/skin.ts`), each vertex following its joint, so a limb is a handful of draws
  in every pass instead of sixty. Skin after the ink line, the glow's mask and the see-through materials are made, and
  hand the result to `contour.adopt`. Shaders of the fox's own (`contour.ts`) include three's skinning chunks, and code
  that needs a skinned part's bounds asks `RigidSkin.reach`, never its geometry, which lies in its joints' spaces. Body
  and head stay plain meshes: their see-through copies blend in the order three.js sorts them per mesh.
- Many copies of one moving thing (the birds) are one `InstancedMesh` per part (`makeFlock` in
  `stories/treasureIsland/scenery.ts`): the builders keep their groups to move, `update()` copies their matrices into
  the instances, hides a hidden copy by scaling it to nothing and keeps the mesh's `boundingSphere` around all copies,
  which culling and the glow's depth pass read.
- The stage leaves out the shadow of anything whose shadow can't fall into the picture (`sun.shadow.getFrustum` in
  `three/stage.ts`: a caster's sphere drawn out along the sunlight down to the lowest thing receiving shadows); nothing
  to do for a new prop.
- The stage's scene has `matrixWorldAutoUpdate = false`: `updateMoved()` (`three/matrices.ts`) brings up to date only
  what moved. Use it, not `updateMatrixWorld(true)`, on anything big (the fox, Ole, a raft with things on it).
- What draws nothing at the moment is hidden (`visible = false`), not left to draw nothing: the glow masks, the fox's
  see-through copies while no limb marks. The glow's depth pass draws only what comes nearer than the fox.
- An extra picture of the scene (the glow's depth pass) sees the same lights as the main one, also when its camera
  looks at other layers: when the lights change from one picture to the next, three.js works out the program of every
  lit material again – it did so every frame while a part glowed, a phone's whole frame.
- `three/sceneSize.test.ts` keeps the fox and both worlds under an object count; `bun run perf abenteuer` measures the
  opening and the drums (glowing). Check a new prop or station with both, and the look with a pixel diff in the preview
  (`__adventure.seek`, then `readPixels`): baking must not change a pixel. Compare shots taken in one run over the same
  times in the same order – seeking about differently changes the state, and two such runs differ by thousands of
  pixels with the same code. Measure perf with the preview on an idle page (a story playing there costs the measured
  browser a fifth of its time) and compare two versions back to back, as other programs change the numbers too.
  After swapping the game's files under a running dev server (`git checkout` of another version), a story may fail to
  build („Dieses Gerät kann die 3D-Bilder leider nicht zeigen“, the error is swallowed in `AdventurePlay.tsx`) and a
  reload doesn't help: change a file the page imports, or restart the server, before checking or measuring.
- Never drop to 30 fps on slow devices (user decision, October 2026): the motions must stay smooth. A part that holds a
  steady 60 fps (p95 17 ms) may stay over the busy budget, but only as a per-part `budget` in `tools/perfScenarios.ts`
  with the decision written next to it – never by loosening the scenario's limits.
- Where it stands (October 2026): the opening about 47 % busy, the glowing drums 85–90 % (accepted, its own limit
  95 %; both hold 60 fps); about a quarter of that is the headless browser's GL work on the CPU (SwiftShader), which a
  phone's graphics chip does.

## Working on levels

- Read `LEVEL-REGELN.md` in this folder first and check the work against it. Every piece of feedback
  on a level goes into it as a general rule (German), in the same commit as the fix.
- The movement library has its own notes in `library/README.md`; `library/library.test.ts` checks that
  scenarios and sequences only use movements that exist.
- `__adventure.seek(seconds)` in the console jumps to a moment; arrow keys skip, Space pauses.
- three.js is only imported below this folder, so the rest of the app stays small.
