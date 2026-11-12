import type { QueuedPicture } from "@/content/pictureQueue";
import { ALLTAG_SITUATIONS } from "./alltag";
import type { SituationId } from "./kita";

// The pictures of the everyday scenes in alltag.ts (ideas C-37 to C-72), as the picture queue takes them until they are
// made (`/bild-erzeugen`, never made on your own). Each story has eight pictures, one frame each, drawn as the stories of
// selbst.ts were (`bilder/README.md`, „So bleibt die Szene gleich“): its first picture (`…-passiert`) with only its own
// cast described and `bye-ende` as the only `--ref` for the look of the characters and the style, a completely new
// place; every later picture redrawn from that first picture as its only `--ref`, the place kept and only what the
// characters do changed. In every picture the little bear acts himself, so no hands come in from the edges. Plain data,
// with no picture imports, so the management page that lists the queue doesn't load the game's pictures. The short
// form of every prompt stands in `bilder/README.md` under „Geplant“ until the picture is made.

const DIR = "src/games/feelings/bilder";

/**
 * The characters these stories draw, described as in `bilder/README.md` („Figuren“), so every picture names them alike.
 * Say what an animal is where the model may take it for another: Grandma bear's „grey tips“ in a dark room came out a
 * grey mouse (November 2026).
 */
export const FIGURES = {
  bear: "the little bear: a small bear child, warm brown fur, light beige muzzle, round ears with beige inside, light-blue t-shirt, dark blue-purple trousers",
  fox: "the fox: a small fox child, orange fur, white muzzle, pointed ears, mint-green t-shirt, coral-red trousers",
  bunny: "the bunny: a small bunny child, white fur, long ears pink inside, yellow t-shirt, light-blue trousers",
  hedgehog: "the little hedgehog: a small hedgehog child, light-brown face, round dark-brown spikes, red t-shirt, yellow trousers",
  raccoon:
    "the raccoon: a small raccoon child, grey fur, a black mask round the eyes, a bushy tail with dark rings, orange-and-white striped t-shirt, brown trousers",
  teacher:
    "the teacher: a grown-up grey mouse, taller than the children, big round ears pink inside, round glasses, purple shirt with a white apron, kind face",
  bigBear: "the big bear: the little bear's grown-up, much taller, same warm brown fur and beige muzzle, green knitted sweater, kind face",
  baby: "the bear baby: a tiny bear baby, same warm brown fur, beige muzzle, in a pale-yellow romper, round and sleepy",
  grandma:
    "Grandma bear: an old BEAR, the same warm brown fur, round bear ears and beige muzzle as the little bear, only a little grey at the tips of her head fur, round glasses, a lilac cardigan – never a mouse, never grey all over",
} as const;

/** A character of `FIGURES`, or one only this story has, described in English like them („the hairdresser: a grown-up fox …“). */
export type Figure = keyof typeof FIGURES | (string & {});

/** One picture after the first: what happens in it, and who is in it when that differs from the story's cast (a grown-up fetched). */
export type Shot = string | { shows: string; cast: Figure[] };

/** How one story of alltag.ts is drawn: its first picture, then the seven that are redrawn from it. */
export interface StoryDrawing {
  /** The story's id (`Situation.id`), which names its pictures (`puzzle-passiert`, `puzzle-1` …). */
  id: SituationId;
  /** The place and what is in it, in German, for grown-ups reading `bilder/README.md`. */
  place: string;
  /** Who is in the first picture (and so in every later one, unless a `Shot` says otherwise). */
  cast: Figure[];
  /** The first picture, what happened (`…-passiert`): the place, everyone in it, every thing a card uses, and the feeling. English. */
  first: string;
  /**
   * What every later picture keeps beyond the place: things that must stay one and the same, clothes that differ from the
   * usual (pyjamas), and what the first picture shows happened (the fallen tower). English.
   */
  keep: string;
  /** The good ideas' pictures, step by step (`…-1` … `…-3`). */
  steps: [Shot, Shot, Shot];
  /** The not-so-good ideas' pictures next to them (`…-nein`, `…-nein-2`, `…-nein-3`). */
  instead: [Shot, Shot, Shot];
  /** Everyone happy at the end (`…-ende`). */
  end: Shot;
  /** Which of its pictures are made and in `bilder/`, so the queue leaves them out: only the first („first“), or all. */
  made?: "first" | true;
  /**
   * Pictures of a story already made that are drawn again (`envy-3`), until they are right: only they go back to the
   * queue. A picture that failed the look at the story's sheet (a second bear, a throw towards someone) is deleted and
   * named here, its prompt sharpened.
   */
  redo?: string[];
}

const figure = (f: Figure) => (f in FIGURES ? FIGURES[f as keyof typeof FIGURES] : f);
const castOf = (cast: Figure[]) => cast.map(figure).join("; ");
const file = (name: string) => `${DIR}/${name}.webp`;

/** The look of the characters and the style come from a picture where the little bear, the big bear and the fox are seen whole. */
const LOOK_REF = file("bye-ende");

/** The first picture of a story: a new place, its own cast only (with every character described, Gemini drew others in). */
export const firstPrompt = (d: StoryDrawing) =>
  `Use the reference picture only for how the characters look and for the style: draw a completely new place, and nobody else from the reference. In the picture, each exactly once: ${castOf(d.cast)}. ${d.first} Each exactly once; nobody else. The place fills the whole picture edge to edge, never an empty white background. Feelings show only in faces and poses: no question marks, exclamation marks, hearts or other signs floating in the air. Gentle, no injuries, no blood. No speech bubbles, no sound words, no text, no letters.`;

/** A later picture of a story, redrawn from its first one. */
export function laterPrompt(d: StoryDrawing, shot: Shot, notSoGood: boolean) {
  const { shows, cast } = typeof shot === "string" ? { shows: shot, cast: d.cast } : shot;
  return [
    "Redraw this exact picture as a later moment of the same story. Keep the place exactly as it is: the same background, walls, ground, furniture and objects at the same places, the same camera framing (no zoom, no shift), the same colours and line style.",
    d.keep,
    `Only the characters' poses, faces and places change. In the picture, each exactly once: ${castOf(cast)}. Nobody else: only ONE of each in the whole picture.`,
    `Now this happens: ${shows}`,
    notSoGood ? "This is the not-so-good idea: the action must be clearly visible, but gentle – no injuries, no blood." : "Gentle, no injuries, no blood.",
    "No hands, no arms come in from the edges. No speech bubbles, no sound words, no text, no letters.",
  ]
    .filter(Boolean)
    .join(" ");
}

/** The eight pictures of a story with their prompts, in the order `situationImages` names them. */
export function storyShots(d: StoryDrawing): { name: string; prompt: string; first: boolean }[] {
  return [
    { name: `${d.id}-passiert`, prompt: firstPrompt(d), first: true },
    ...d.steps.map((shot, i) => ({ name: `${d.id}-${i + 1}`, prompt: laterPrompt(d, shot, false), first: false })),
    ...d.instead.map((shot, i) => ({ name: i === 0 ? `${d.id}-nein` : `${d.id}-nein-${i + 1}`, prompt: laterPrompt(d, shot, true), first: false })),
    { name: `${d.id}-ende`, prompt: laterPrompt(d, d.end, false), first: false },
  ];
}

/** The story's pictures still to make, as the queue takes them: the first one alone, the others drawn from it once it is made. */
export function storyPictures(d: StoryDrawing): QueuedPicture[] {
  const title = ALLTAG_SITUATIONS.find((s) => s.id === d.id)?.title ?? d.id;
  const shots = storyShots(d).filter(({ name, first }) => (d.made === true ? d.redo?.includes(name) : !(first && d.made === "first")));
  return shots.map(({ name, prompt, first }) => ({
    id: name,
    file: file(name),
    use: `Gefühle, „Alltagssituationen“, „${title}“: ${first ? "das erste Bild" : "ein Bild der Geschichte"}`,
    prompt,
    aspect: "4:3",
    size: "1200x900",
    quality: 65,
    ref: [first ? LOOK_REF : file(`${d.id}-passiert`)],
    ...(first ? {} : { alone: "story picture" as const }),
    date: "2026-11-11",
  }));
}
