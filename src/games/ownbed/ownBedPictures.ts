import type { QueuedPicture } from "@/content/pictureQueue";
import { type Cast, type Light, OWN_BED_PAGES, type OwnBedPage, type Place } from "./ownBed";

// The pictures of „Tapsi's Own Bed“ (`ownBed.ts`), as the picture queue takes them until they are made (`/bild-erzeugen`,
// made in a Claude cloud session: Zscaler blocks Gemini on the Mac). Tapsi's home is the one of the other chapter books:
// the living room is drawn from Abstillen's first picture, Tapsi's room from „Tapsi's Big Bed“'s made bed („bett-machen“,
// with its rail and its moon night light), so both stories of the book „Bed“ show one room and one bed. Mama and Papa's
// bedroom is new: drawn once from the fox family on the story's first page (`FIRST`), and every other page there from
// that one, so the room stays the same – the queue holds those pages back until it is made. Plain data, no picture
// imports. A made picture goes on `MADE`, so it leaves the queue; the prompts stay here, so a picture can be drawn again.

const DIR = "src/games/ownbed/bilder";

/** The picture of a page. */
export const pictureFile = (id: string) => `${DIR}/eigen-${id}.webp`;

/** The fox family as the app draws it: Papa with glasses in green, Mama with a flower in yellow, the child in light blue. */
const FAMILY = "src/components/bilder/buch-fuechse.webp";

/** Mama and Papa's bedroom's first page, drawn from the family's picture; every other page there is drawn from it. */
export const FIRST = "dritt";

/** What Mama and Papa's bedroom looks like, said on its first page, which has no picture of it to be drawn from. */
const PARENTS_ROOM =
  "Mama and Papa Fox's cosy bedroom in the same warm home, seen from the foot of the bed at a child's eye height: a big wooden double bed in the middle against the back wall, a warm wood headboard, a soft cream-coloured blanket with a pattern of small orange leaves and two big white pillows; on the left a small bedside table with a little lamp and a small vase with a red flower, on the right a small bedside table with a little lamp and a book; a window with green curtains on the back wall to the right of the bed; a soft round green rug in front of the bed. Draw the foxes like the fox family in the reference picture – the same faces, fur, ears and line style – and nothing of the reference's own place.";

/**
 * The picture every page of a place is drawn from, who was where in it and what of it belongs to another moment: a page
 * drawn from it keeps them there unless told that those places are empty now (Tapsis Milchkette, Kita-Start).
 */
const PLACES: Record<Place, { ref: string; was: string; shows: Cast[] }> = {
  elternzimmer: {
    ref: pictureFile(FIRST),
    was: "Tapsi sleeps between Mama and Papa in the big bed",
    shows: ["tapsi", "mama", "papa"],
  },
  wohnzimmer: {
    ref: "src/games/milkchain/bilder/kette-fragen-nicht.webp",
    was: "Tapsi plays with blocks on the rug and Mama sits on the green sofa with a cup – the blocks and the cup are gone now",
    shows: ["tapsi", "mama"],
  },
  kinderzimmer: {
    ref: "src/games/bedstory/bilder/bett-machen.webp",
    was: "Mama smooths the blanket over the bed, Tapsi sets the plush bunny on the pillow, and a small yellow blanket lies folded at the foot of the bed – that yellow blanket is not there now",
    shows: ["tapsi", "mama"],
  },
};

/** The light of a page, said in every prompt. */
const LIGHT: Record<Light, string> = {
  morgen: "It is morning: fresh friendly daylight comes in through the window.",
  tag: "It is daytime, friendly daylight.",
  mittag: "It is the midday nap: the room lies in soft dim daylight, everything still clearly seen.",
  abend: "It is evening: dusk outside the window, the lamp gives warm soft light.",
  nacht: "It is night: the room lies in dark blue moonlight, the moon in the window, everything still clearly seen.",
};

/** Whether a page's picture text dresses someone for the night: „<Name> in pyjamas“ or „<Name> in her nightgown“. */
const dressedForNight = (page: OwnBedPage, name: string) => new RegExp(`${name} in (her )?(pyjamas|nightgown)`).test(page.picture);

/** Everyone in a page's picture, each described with what they wear there. */
function castOf(page: OwnBedPage): string {
  const who: Record<Cast, string> = {
    tapsi: `Tapsi, a small fox toddler with orange fur and a white muzzle, in ${dressedForNight(page, "Tapsi") ? "light-blue pyjamas with small yellow stars" : "a light-blue T-shirt and light-blue trousers"}`,
    mama: `Mama, a grown-up fox woman with a small red flower behind one ear and no glasses, in ${dressedForNight(page, "Mama") ? "a long yellow nightgown" : "a yellow sweater and brown trousers"}`,
    papa: `Papa, a grown-up fox man with round glasses and no flower, in ${dressedForNight(page, "Papa") ? "green striped pyjamas" : "a green sweater and brown trousers"}`,
  };
  const n = page.cast.length;
  // Haare waschen and Abstillen: with both grown-ups in one picture Gemini once drew one fox with the flower and the glasses.
  const two = page.cast.includes("mama") && page.cast.includes("papa") ? " Mama and Papa are two separate foxes." : "";
  return `Exactly ${n === 1 ? "one character" : `${n} characters, each once`}: ${page.cast.map((c) => who[c]).join("; ")}.${two} Nobody else: only ONE of each in the whole picture, nobody more in a doorway, on the furniture or peeking in from an edge.`;
}

/** What the things that come back look like, so they stay the same from page to page – each at one place only. */
function thingsOf(page: OwnBedPage): string[] {
  const things: string[] = [];
  if (/plush bunny/.test(page.picture))
    things.push("The plush bunny is Tapsi's light-grey soft toy with long floppy ears, not a living rabbit; there is only one.");
  if (/night light/.test(page.picture))
    things.push("The night light is small and shaped like a crescent moon, plugged in at the wall low down beside the bedside table; there is only one.");
  if (/picture book/.test(page.picture)) things.push("There is only one picture book, the one held; its pages show pictures only, no letters.");
  if (/cushion/.test(page.picture)) things.push("There is only one cushion on the rug, under the grown-up's head.");
  if (/big white pillow/.test(page.picture)) things.push("There is only one pillow in the picture, the one Tapsi carries.");
  return things;
}

/**
 * What every picture of someone in bed keeps, as the guides ask for a safe bed: whoever lies in it lies inside it, never
 * on the rail or half over the edge, and nothing like a pillow mountain or loose toys piles up round a child.
 */
export const SAFE_BED =
  "The bed is safe and calm: whoever lies in it lies fully inside it, never over the rail or the edge; besides the pillows, the blanket and the cuddly toy said, nothing lies in the bed.";

/** Every page is full bleed (two first pictures of Tapsis Milchkette came back with a white rounded margin). */
const END =
  "Everyone's face shows plainly what they feel, friendly and warm. The illustration fills the whole picture edge to edge (full bleed): no border, no frame, no white margin, no rounded corners, no vignette. No speech bubbles. No text, no letters, no numbers, also not in books or on signs.";

/** How the characters are named where a prompt says who is not there. */
const NAMED: Record<Cast, string> = {
  tapsi: "Tapsi",
  mama: "Mama (the grown-up fox woman)",
  papa: "Papa (the grown-up fox man)",
};

/** Who of a page's reference picture this page leaves out, said plainly (Kita-Start: Mama stayed on the chair without it). */
function absent(page: OwnBedPage): string {
  if (page.id === FIRST) return "";
  const gone = PLACES[page.place].shows.filter((who) => !page.cast.includes(who));
  if (!gone.length) return "";
  const names = gone.map((who) => NAMED[who]);
  const list = names.length === 1 ? names[0] : `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;
  return `${list} ${names.length === 1 ? "is" : "are"} not in this picture at all: leave their places in the reference empty, and give nobody else their place or clothes.`;
}

/** The reference a page is drawn from: the family's picture for the bedroom's first page, else its place's. */
const refOf = (page: OwnBedPage) => [page.id === FIRST ? FAMILY : PLACES[page.place].ref];

/** The prompt of a page's picture, without the style block. */
export function promptOf(page: OwnBedPage): string {
  const place = PLACES[page.place];
  const first = page.id === FIRST;
  const parts = [
    first
      ? PARENTS_ROOM
      : "Redraw this exact place from the reference picture: keep it exactly as it is – the same walls, windows, furniture and objects at the same places, the same camera framing (no zoom, no shift), the same colours and line style. Only the characters, their poses, the things they hold and the light change, and who is there.",
    first
      ? ""
      : `In that reference picture ${place.was}: that was another moment. Draw each character only where this page says, and leave every other place empty – no second character, no tail left lying on the floor or the furniture.`,
    absent(page),
    LIGHT[page.light],
    castOf(page),
    ...thingsOf(page),
    `Now this happens: ${page.picture}`,
  ];
  if (/\bbed\b/.test(page.picture)) parts.push(SAFE_BED);
  parts.push(END);
  return parts.filter(Boolean).join(" ");
}

/** What is left once the story's last picture is made: it stays out of the built site until then. */
const AFTER =
  "Wenn damit das letzte Bild der Geschichte gemacht ist (OWN_BED_PICTURE_QUEUE leer): /grosses-bett/eigenes-bett/ aus WAITING_PATHS in src/content/seo.ts streichen, den Suchtext von /grosses-bett/ in allen sieben Sprachen um die zweite Geschichte ergänzen (seo.ts, seo.<Sprache>.ts), BED_STORY_BLURB in src/games/bedstory/names.ts um das Elternbett erweitern, in src/games/ownbed/CLAUDE.md „veröffentlicht“ vermerken und den perf-Ablauf „grosses-bett“ einmal laufen lassen.";

/** The queue entry of a page's picture. */
export function ownBedPicture(page: OwnBedPage): QueuedPicture {
  return {
    id: `eigen-${page.id}`,
    file: pictureFile(page.id),
    use: `Bett, „Tapsi's Own Bed“: ${page.text}`,
    prompt: promptOf(page),
    aspect: "4:3",
    size: "1200x900",
    quality: 70,
    ref: refOf(page),
    alone: "story picture",
    after: AFTER,
    date: "2026-11-24",
  };
}

/** The pages whose pictures are made (`bilder/eigen-<id>.webp`); the others wait in the queue. */
const MADE = new Set<string>([]);

/** Every picture of the story still to make. */
export const OWN_BED_PICTURE_QUEUE: QueuedPicture[] = OWN_BED_PAGES.filter((p) => !MADE.has(p.id)).map(ownBedPicture);
