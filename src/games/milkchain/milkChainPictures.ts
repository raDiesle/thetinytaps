import type { QueuedPicture } from "@/content/pictureQueue";
import { type Cast, type ChainPage, goneOn, type Light, MILK_CHAIN_PAGES, type MilkTime, type Place } from "./milkChain";

// The pictures of „Tapsis Milchkette“ (`milkChain.ts`), as the picture queue takes them until they are made
// (`/bild-erzeugen`, user request, 9 November 2026). Each place is drawn once from the fox family's picture (its first
// picture, `FIRST`), and every other page there from that first picture as its only `--ref`, so the room stays the same
// and only what the characters do and the light change. Plain data, no picture imports. A made picture goes on `MADE`, so it
// leaves the queue; the prompts stay here, so a picture can be drawn again.

const DIR = "src/games/milkchain/bilder";

/** The picture of a page. */
export const pictureFile = (id: string) => `${DIR}/kette-${id}.webp`;

/** The fox family as the app draws it: Papa with glasses in green, Mama with a flower in yellow, the child in light blue. */
const FAMILY = "src/components/bilder/buch-fuechse.webp";

/** Each place's first picture, drawn from the family's picture; every other page there is drawn from it. */
export const FIRST: Record<Place, string> = {
  wohnzimmer: "fragen-nicht",
  kinderzimmer: "kette",
  kueche: "essen",
  garten: "tag-raus",
  weg: "tag-mittag",
};

/** What each place looks like, said in its first picture. */
const PLACES: Record<Place, string> = {
  wohnzimmer:
    "A cosy living room seen from the front: on the left a big mustard-yellow armchair with a soft cushion, on the right a green sofa, between them a round rug with a few wooden blocks, a window at the back with a view into a green garden, a low shelf with toys and a plant.",
  kinderzimmer:
    "A small cosy child's bedroom seen from the front: a wooden child's bed against the back wall with a blue blanket, above the bed a string hung across the wall like a garland, a window beside the bed, a night table with a small lamp and a small closed wooden box, a low shelf, a round rug.",
  kueche:
    "A bright kitchen seen from the front: a wooden table by a window, a child's chair with a booster seat and two grown-up chairs, a fruit bowl, a kitchen counter at the back.",
  garten:
    "A sunny garden: a green lawn, a big tree, a small wooden sandpit with a little shovel and a bucket, a small garden table with two chairs, a wooden fence with flowers, a part of the house wall at one side.",
  weg: "A sunny path through a park, trees and a meadow on both sides.",
};

/**
 * Where the foxes are in each place's first picture. A page drawn from it keeps them there too unless told otherwise:
 * of 20 pages first drawn, six had a second Tapsi or Mama, or Tapsi's tail left lying on the rug, where the first
 * picture had them (November 2026) – so every page says those places are empty now.
 */
const WAS_THERE: Record<Place, string> = {
  wohnzimmer: "Tapsi plays on the rug and Mama sits on the green sofa",
  kinderzimmer: "Tapsi stands on the bed and Mama stands beside it",
  kueche: "Papa sits at the table and Tapsi in the child's chair",
  garten: "Tapsi kicks a ball on the lawn and Mama runs behind",
  weg: "Papa pushes a pram along the path with Tapsi asleep in it",
};

/**
 * Pages drawn from another page of their place where the foxes already are as they should be, with where they are
 * there. Drawn from the place's first picture, Tapsi stayed on the rug while drinking on Mama's lap too, twice in a row
 * (`/bild-erzeugen`: what stays put comes from a picture where it already is).
 */
const FROM: Record<string, { page: string; was: string }> = {
  "fragen-tapsi": { page: "noch", was: "Tapsi sits on Mama's lap on the green sofa and drinks at her breast, and the rug is empty" },
  "gleich-lied": { page: "noch", was: "Tapsi sits on Mama's lap on the green sofa and drinks at her breast, and the rug is empty" },
  "abend-frueher": { page: "noch", was: "Tapsi sits on Mama's lap on the green sofa and drinks at her breast, and the rug is empty" },
  langsam: { page: "babys", was: "Tapsi sits on Mama's lap on the edge of the bed" },
  "nacht-schlaeft": { page: "tag-ab", was: "Mama stands by the bed and holds Tapsi up in her arms" },
};

/** The light of a page, said in every prompt: the place's first picture is drawn in daylight. */
const LIGHT: Record<Light, string> = {
  tag: "It is daytime, friendly daylight.",
  abend: "It is evening: dusk outside the window, a lamp gives warm soft light.",
  nacht: "It is night: the room lies in dark blue moonlight, the moon in the window, everything still clearly seen.",
  morgen: "It is early morning: warm sunlight shines in through the window.",
};

/** The chain's four places, left to right, with the drop's sign and what hangs there once its milk time is gone. */
const CHAIN: { time: MilkTime; drop: string; instead: string }[] = [
  { time: "morgen", drop: "a white milk drop with a tiny rising sun on it", instead: "a tiny cup" },
  { time: "tag", drop: "a white milk drop with a tiny full sun on it", instead: "a small red ball" },
  { time: "abend", drop: "a white milk drop with a tiny lamp on it", instead: "a tiny picture book" },
  { time: "nacht", drop: "a white milk drop with a tiny moon on it", instead: "a yellow star" },
];

/** What hangs on the chain on a page, left to right. */
function chainOn(page: ChainPage): string {
  const gone = goneOn(page.id);
  const things = CHAIN.map((c) => (gone.includes(c.time) ? c.instead : c.drop));
  return `On the string over the bed hang exactly four things, evenly spaced, left to right: ${things.join(", ")}.`;
}

/** Everyone in a page's picture, each described with what they wear there. */
function castOf(page: ChainPage): string {
  const pyjamas = (who: string) => new RegExp(`${who}[^.;]*pyjamas`).test(page.picture);
  const who: Record<Cast, string> = {
    baby: "baby Tapsi, a tiny baby fox in a light-blue romper",
    tapsi: `Tapsi, a small fox toddler with orange fur and a white muzzle, in ${pyjamas("Tapsi") ? "light-blue pyjamas with small yellow stars" : "a light-blue T-shirt and light-blue trousers"}`,
    mama: "Mama, a grown-up fox woman with a small red flower behind one ear, in a yellow sweater and brown trousers",
    papa: `Papa, a grown-up fox man with round glasses, in ${pyjamas("Papa") ? "green striped pyjamas" : "a green sweater and brown trousers"}`,
  };
  const n = page.cast.length;
  return `Exactly ${n === 1 ? "one character" : `${n} characters, each once`}: ${page.cast.map((c) => who[c]).join("; ")}. Nobody else: only ONE of each in the whole picture, nobody more in a doorway, on the furniture or peeking in from an edge.`;
}

/**
 * How a page with Tapsi drinking shows it (user feedback, November 2026: the child understands the story only when it
 * plainly sees it is about Mama's breast), tender as in a picture book about breastfeeding.
 */
export const NURSING =
  "Tapsi drinks at Mama's breast, shown as in a gentle picture book about breastfeeding: Mama's sweater is lifted at one side, her breast is a soft round shape of her fur with Tapsi's cheek and mouth against it, so it is plain that Tapsi drinks at the breast; Tapsi's face hides the nipple, nothing more bare than that. Tender and calm.";

/** A teddy is a toy, never a living bear. */
const TEDDY = "The teddy bear is a small brown plush toy, not a living bear.";

/** Two first pictures came back with a white rounded margin round them (November 2026): every page is full bleed. */
const END =
  "Everyone's face shows plainly what they feel. The illustration fills the whole picture edge to edge (full bleed): no border, no frame, no white margin, no rounded corners, no vignette. No speech bubbles. No text, no letters, no numbers.";

/** The prompt of a page's picture, without the style block. */
function promptOf(page: ChainPage): string {
  const first = FIRST[page.place] === page.id;
  const parts = first
    ? [PLACES[page.place], "Draw the foxes like the fox family in the reference picture: the same fur, faces and clothes."]
    : [
        "Redraw this exact place from the reference picture: keep it exactly as it is – the same walls, window, furniture and objects at the same places, the same camera framing (no zoom, no shift), the same colours and line style. Only the characters, their poses and the light change, and who is there.",
        `In the reference picture ${FROM[page.id]?.was ?? WAS_THERE[page.place]}: that was another moment. Draw each fox only where this page says, and leave every other place empty – no fox, no second fox, no fox tail left lying on the rug or the furniture.`,
      ];
  parts.push(LIGHT[page.light]);
  if (page.place === "kinderzimmer") parts.push(chainOn(page));
  parts.push(castOf(page));
  if (/teddy/.test(page.picture)) parts.push(TEDDY);
  if (page.nursing) parts.push(NURSING);
  parts.push(`Now this happens: ${page.picture}`, END);
  return parts.join(" ");
}

/** The queue entry of a page's picture. */
export function chainPicture(page: ChainPage): QueuedPicture {
  const first = FIRST[page.place] === page.id;
  return {
    id: `kette-${page.id}`,
    file: pictureFile(page.id),
    use: `Abstillen, „Tapsis Milchkette“: ${page.text}`,
    prompt: promptOf(page),
    aspect: "4:3",
    size: "1200x900",
    quality: 70,
    ref: [first ? FAMILY : pictureFile(FROM[page.id]?.page ?? FIRST[page.place])],
    alone: "story picture",
    date: "2026-11-09",
  };
}

/** The pages whose pictures are made (`bilder/kette-<id>.webp`); the others wait in the queue. */
const MADE = new Set<string>([
  "satt",
  "wachsen",
  "kette",
  "essen",
  "fragen-nicht",
  "fragen-spielen",
  "gleich",
  "gleich-sessel",
  "tag-will",
  "tag-raus",
  "tag-mittag",
  "tag-halten",
  "tag-leichter",
  "vermissen-traurig",
  "vermissen-mama",
  "baby",
  "noch",
  "schoss",
  "babys",
  "muede",
  "schwer",
  "auch",
  "tag-ab",
  "tag-dose",
  "tag-nicht",
  "abend-buch",
  "abend-schlaf",
  "abend-ab",
  "nacht-ab",
  "nacht-wach",
  "nacht-papa",
  "nacht-lied",
  "nacht-sonne",
  "nacht-stolz",
  "abschied-letzter",
  "abschied-sagen",
  "abschied-trinken",
  "abschied-danke",
  "abschied-traenen",
  "abschied-dose",
  "abschied-fest",
  "vermissen-herz",
  "vermissen-immer",
  "bleibt-kette",
  "bleibt-lieb",
]);

/** Every picture of the story still to make. */
export const MILK_CHAIN_PICTURE_QUEUE: QueuedPicture[] = MILK_CHAIN_PAGES.filter((p) => !MADE.has(p.id)).map(chainPicture);
