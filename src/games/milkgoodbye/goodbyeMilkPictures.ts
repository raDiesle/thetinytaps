import type { QueuedPicture } from "@/content/pictureQueue";
import { NURSING } from "@/games/milkchain/milkChainPictures";
import { type Cast, GOODBYE_PAGES, type GoodbyePage, type Light, type Place } from "./goodbyeMilk";

// The pictures of „Three More Sleeps“ (`goodbyeMilk.ts`), as the picture queue takes them until they are made
// (`/bild-erzeugen`, made in a Claude cloud session: Zscaler blocks Gemini on the Mac). Tapsi's home is the one of the
// other chapter books: the living room and the kitchen are drawn from „Abstillen“'s first pictures of them and Tapsi's
// room from „Schnullerfee“'s – never from „Abstillen“'s room, whose chain of milk drops over the bed belongs to that
// story and would come back on every page (as „The Milk Sleeps at Night“). So every page is drawn from a picture already
// made, and the queue makes them all at once. Plain data, no picture imports. A made picture goes on `MADE`, so it
// leaves the queue; the prompts stay here.

const DIR = "src/games/milkgoodbye/bilder";

/** The picture of a page. */
export const pictureFile = (id: string) => `${DIR}/fest-${id}.webp`;

/**
 * The picture every page of a place is drawn from, and who was where in it: a page drawn from it keeps them there unless
 * told that those places are empty now (Tapsis Milchkette, Kita-Start).
 */
const PLACES: Record<Place, { ref: string; was: string; shows: Cast[] }> = {
  wohnzimmer: {
    ref: "src/games/milkchain/bilder/kette-fragen-nicht.webp",
    was: "Tapsi plays with blocks on the rug and Mama sits on the green sofa with a cup – the blocks and the cup are gone now",
    shows: ["tapsi", "mama"],
  },
  kinderzimmer: {
    ref: "src/games/pacifierstory/bilder/fee-drei.webp",
    was: "Tapsi sits on the bed holding up pacifiers – the pacifiers are gone now, there is no pacifier anywhere",
    shows: ["tapsi"],
  },
  kueche: {
    ref: "src/games/milkchain/bilder/kette-essen.webp",
    was: "Tapsi sits in the high chair biting an apple and Papa sits at the table – the apple, the plates of noodles and bread are gone now",
    shows: ["tapsi", "papa"],
  },
};

/** The light of a page, said in every prompt: the reference pictures are drawn in daylight. */
const LIGHT: Record<Light, string> = {
  tag: "It is daytime, friendly daylight.",
  abend: "It is evening: dusk outside the window, the small lamp on the night table gives warm soft light.",
  morgen: "It is early morning: the sun has just come up, its warm golden light shines in through the window.",
};

/** Whether Tapsi wears pyjamas: in Tapsi's room in the morning and the evening, as the page's words say. */
const inPyjamas = (page: GoodbyePage) => /Tapsi in pyjamas/.test(page.picture);

/** Everyone in a page's picture, each described with what they wear there. */
function castOf(page: GoodbyePage): string {
  const who: Record<Cast, string> = {
    tapsi: `Tapsi, a small fox toddler with orange fur and a white muzzle, in ${inPyjamas(page) ? "light-blue pyjamas with small yellow stars" : "a light-blue T-shirt and light-blue trousers"}`,
    mama: "Mama, a grown-up fox woman with a small red flower behind one ear, in a yellow sweater and brown trousers",
    papa: "Papa, a grown-up fox man with round glasses, in a green sweater and brown trousers",
  };
  const n = page.cast.length;
  return `Exactly ${n === 1 ? "one character" : `${n} characters, each once`}: ${page.cast.map((c) => who[c]).join("; ")}. Nobody else: only ONE of each in the whole picture, nobody more in a doorway, on the furniture or peeking in from an edge.`;
}

/** What the things that come back look like, so they stay the same from page to page – each at one place only. */
function thingsOf(page: GoodbyePage): string[] {
  const things: string[] = [];
  if (/paper hearts?/.test(page.picture))
    things.push(
      "The paper hearts are simple flat hearts cut from red paper, each the size of a child's paw; draw exactly as many as the page says, and nowhere else.",
    );
  if (/new cup/.test(page.picture)) things.push("The new cup is a small orange cup with a white heart on it; there is only one.");
  if (/cake/.test(page.picture) && !/dough/.test(page.picture))
    things.push("The cake is one round home-made cake without candles; there is only one, and nothing written on it.");
  if (/dough/.test(page.picture)) things.push("There is only one bowl, with one wooden spoon in it, and no cake yet.");
  if (/teddy/.test(page.picture))
    things.push("The teddy is Tapsi's small brown plush toy, not a living bear; there is only one, sitting on the low shelf as in the reference.");
  return things;
}

/** How the characters are named where a prompt says who is not there. */
const NAMED: Record<Cast, string> = { tapsi: "Tapsi", mama: "Mama (the grown-up fox woman)", papa: "Papa (the grown-up fox man)" };

/** Who of a page's reference picture this page leaves out, said plainly (Kita-Start: Mama stayed on the chair without it). */
function absent(page: GoodbyePage): string {
  const gone = PLACES[page.place].shows.filter((who) => !page.cast.includes(who));
  if (!gone.length) return "";
  const names = gone.map((who) => NAMED[who]);
  return `${names.join(" and ")} ${names.length === 1 ? "is" : "are"} not in this picture at all: leave their places in the reference empty, and give nobody else their place or clothes.`;
}

/** Every page is full bleed (two first pictures of Tapsis Milchkette came back with a white rounded margin). */
const END =
  "Everyone's face shows plainly what they feel. The illustration fills the whole picture edge to edge (full bleed): no border, no frame, no white margin, no rounded corners, no vignette. No speech bubbles. No text, no letters, no numbers.";

/** The prompt of a page's picture, without the style block. */
export function promptOf(page: GoodbyePage): string {
  const place = PLACES[page.place];
  const parts = [
    "Redraw this exact place from the reference picture: keep it exactly as it is – the same walls, window, furniture and objects at the same places, the same camera framing (no zoom, no shift), the same colours and line style. Only the characters, their poses, the things they hold and the light change, and who is there.",
    `In that reference picture ${place.was}: that was another moment. Draw each character only where this page says, and leave every other place empty – no second fox, no fox tail left lying on the floor or the furniture.`,
    absent(page),
    LIGHT[page.light],
    castOf(page),
    ...thingsOf(page),
  ];
  if (page.nursing) parts.push(NURSING);
  parts.push(`Now this happens: ${page.picture}`, END);
  return parts.filter(Boolean).join(" ");
}

/**
 * What is left once the pictures are made: the story then plays for players too (`ChapterBook` leaves out pages without
 * a picture, and the book's choice a story without one, only until then).
 */
const AFTER =
  "Count the foxes on every picture (only the page's cast, each once, no stray tail), look at every face, and count the paper hearts (three on „herzen“, two on the shelf and one in Tapsi's paw on „morgen“, none on „letzte“); Tapsi's room must show no chain of milk drops over the bed, and no pacifier. Once all twelve pages are made: add each id to MADE in src/games/milkgoodbye/goodbyeMilkPictures.ts; take /abstillen/abschied/ out of WAITING_PATHS in src/content/seo.ts; name the story in the search texts of /abstillen/ (seo.ts and its six seo.<language>.ts, the sentence on the book's choice) and in MILK_CHAIN_BLURB of src/games/milkchain/names.ts, in all seven languages; mark it published in the language row's note (languageStatus.ts) and in src/games/milkgoodbye/CLAUDE.md; run bun run previews /abstillen/ and look at the choice at 844×390 and 1024×768.";

/** The queue entry of a page's picture. */
export function goodbyePicture(page: GoodbyePage): QueuedPicture {
  return {
    id: `fest-${page.id}`,
    file: pictureFile(page.id),
    use: `Abstillen, „Three More Sleeps“ (/abstillen/abschied/): ${page.text}`,
    prompt: promptOf(page),
    aspect: "4:3",
    size: "1200x900",
    quality: 70,
    ref: [PLACES[page.place].ref],
    alone: "story picture",
    date: "2026-11-22",
    after: AFTER,
  };
}

/** The pages whose pictures are made (`bilder/fest-<id>.webp`); the others wait in the queue. */
const MADE = new Set<string>([]);

/** Every picture of the story still to make. */
export const GOODBYE_PICTURE_QUEUE: QueuedPicture[] = GOODBYE_PAGES.filter((p) => !MADE.has(p.id)).map(goodbyePicture);
