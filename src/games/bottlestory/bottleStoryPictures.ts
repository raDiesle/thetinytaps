import type { QueuedPicture } from "@/content/pictureQueue";
import { BOTTLE_PAGES, type BottlePage, type Cast, type Light, type Place } from "./bottleStory";

// The pictures of „Bye-Bye, Bottle!“ (`bottleStory.ts`), as the picture queue takes them until they are made
// (`/bild-erzeugen`; Zscaler blocks Gemini on the Mac, so a Claude cloud session makes them, root CLAUDE.md). Tapsi's
// home is the one of the books „Abstillen“, „Schnullerfee“, „Kita-Start“ and „Haare waschen“: every place is drawn from
// a picture of those books, so all of them show one home and one family. Plain data, no picture imports. A made
// picture goes on `MADE`, so it leaves the queue; the prompts stay here, so a picture can be drawn again.

const DIR = "src/games/bottlestory/bilder";

/** The picture of a page. */
export const pictureFile = (id: string) => `${DIR}/flasche-${id}.webp`;

/**
 * The picture every page of a place is drawn from, who was where in it (a page drawn from it keeps them there unless
 * told that those places are empty now – Tapsis Milchkette, Kita-Start), and who it shows.
 */
const PLACES: Record<Place, { ref: string; was: string; shows: Cast[] }> = {
  wohnzimmer: {
    ref: "src/games/milkchain/bilder/kette-fragen-nicht.webp",
    was: "Tapsi plays with blocks on the rug and Mama sits on the green sofa with a cup – the blocks and Mama's cup are gone now",
    shows: ["tapsi", "mama"],
  },
  kueche: {
    ref: "src/games/milkchain/bilder/kette-essen.webp",
    was: "Papa sits at the table and Tapsi sits in the child's chair eating an apple, with a plate of spaghetti and a plate of toast on the table – the apple, the spaghetti and the toast are gone now",
    shows: ["tapsi", "papa"],
  },
  kinderzimmer: {
    ref: "src/games/pacifierstory/bilder/fee-drei.webp",
    was: "Tapsi sits on the bed holding up pacifiers – the pacifiers are gone now, there is no pacifier anywhere",
    shows: ["tapsi"],
  },
  garten: {
    ref: "src/games/milkchain/bilder/kette-tag-raus.webp",
    was: "Tapsi kicks the red ball and Mama runs behind, and a cup and an apple stand on the garden table – the cup and the apple are gone now",
    shows: ["tapsi", "mama"],
  },
};

/** The light of a page, said in every prompt. */
const LIGHT: Record<Light, string> = {
  tag: "It is daytime, friendly daylight.",
  morgen: "It is early morning: warm sunlight shines in through the window.",
  abend: "It is evening: dusk outside the window, a lamp gives warm soft light.",
  nacht: "It is night: the room lies in dark blue moonlight, the moon in the window, everything still clearly seen.",
};

/** What Tapsi wears, chosen by the words of the page's picture text: pyjamas where it says so, else T-shirt and trousers. */
const tapsiWears = (page: BottlePage) =>
  /Tapsi in pyjamas/.test(page.picture) ? "light-blue pyjamas with small yellow stars" : "a light-blue T-shirt and light-blue trousers";

/** Everyone in a page's picture, each described with what they wear there. */
function castOf(page: BottlePage): string {
  const who: Record<Cast, string> = {
    baby: "baby Tapsi, a tiny fox baby with orange fur and a white muzzle, in a light-blue romper, small enough to lie in a grown-up's arms",
    tapsi: `Tapsi, a small fox toddler with orange fur and a white muzzle, in ${tapsiWears(page)}`,
    mama: `Mama, a grown-up fox woman with a small red flower behind one ear, in ${/dressing gown/.test(page.picture) ? "a soft yellow dressing gown" : "a yellow sweater and brown trousers"}`,
    papa: `Papa, a grown-up fox man with round glasses, in ${/pyjama trousers/.test(page.picture) ? "a green T-shirt and striped pyjama trousers" : "a green sweater and brown trousers"}`,
  };
  const n = page.cast.length;
  const baby = page.cast.includes("baby") ? " There is no toddler fox in this picture: Tapsi is only the baby." : "";
  return `Exactly ${n === 1 ? "one character" : `${n} characters, each once`}: ${page.cast.map((c) => who[c]).join("; ")}. Nobody else: only ONE of each in the whole picture, nobody more in a doorway, on the furniture or peeking in from an edge.${baby}`;
}

/** The bottle as it looks on every page that shows it. */
export const BOTTLE =
  "Tapsi's baby bottle is a small clear plastic bottle with a light-blue cap and teat and a small yellow star printed on its side, no letters; white milk is inside only where someone drinks from it, else it is empty. There is only one bottle in the whole picture, at the one place said.";

/** What the things that come back look like, so they stay the same from page to page – each at one place only. */
function thingsOf(page: BottlePage): string[] {
  const things: string[] = [];
  if (/bottle/.test(page.picture)) things.push(BOTTLE);
  if (/green cup/.test(page.picture))
    things.push(
      "The green cup is Tapsi's small open drinking cup: light green, without a lid, spout or straw, with two little handles and a tiny leaf on its side; there is only one green cup, at the one place said.",
    );
  if (/three small open cups/.test(page.picture)) things.push("Only these three small cups stand on the table, nothing else to drink from.");
  if (/plush bunny/.test(page.picture))
    things.push("The plush bunny is Tapsi's light-grey soft toy with long floppy ears, not a living rabbit; there is only one.");
  if (/box/.test(page.picture))
    things.push("The box is a small cardboard box with a light-blue ribbon; there is only one box and only one lid, at the place said.");
  if (/red ball/.test(page.picture)) things.push("There is only one red ball.");
  return things;
}

/** Every page is full bleed (two first pictures of Tapsis Milchkette came back with a white rounded margin). */
const END =
  "Everyone's face shows plainly what they feel, friendly and warm. The illustration fills the whole picture edge to edge (full bleed): no border, no frame, no white margin, no rounded corners, no vignette. No speech bubbles. No text, no letters, no numbers, also not on the bottle, cups or box.";

/** How the characters are named where a prompt says who is not there. */
const NAMED: Record<Cast, string> = {
  baby: "baby Tapsi",
  tapsi: "Tapsi (the fox toddler)",
  mama: "Mama (the grown-up fox woman)",
  papa: "Papa (the grown-up fox man)",
};

/** Who of a page's reference picture this page leaves out, said plainly (Kita-Start: Mama stayed on the chair without it). */
export function absent(page: BottlePage): string {
  const gone = PLACES[page.place].shows.filter((who) => !page.cast.includes(who));
  if (!gone.length) return "";
  const names = gone.map((who) => NAMED[who]);
  const list = names.length === 1 ? names[0] : `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;
  return `${list} ${names.length === 1 ? "is" : "are"} not in this picture at all: nobody else wears their clothes or looks like them, and where nobody is said to be, their place stays empty – no head, face or part of them left behind there, floating or peeking over the table.`;
}

/** The prompt of a page's picture, without the style block. */
function promptOf(page: BottlePage): string {
  const place = PLACES[page.place];
  return [
    "Redraw this exact place from the reference picture: keep it exactly as it is – the same walls, windows, furniture and objects at the same places, the same camera framing (no zoom, no shift), the same colours and line style. Only the characters, their poses, the things they hold and the light change, and who is there.",
    `In that reference picture ${place.was}: that was another moment. Draw each character only where this page says, and leave every other place empty – no second fox, no fox tail left lying on the floor or the furniture.`,
    absent(page),
    LIGHT[page.light],
    castOf(page),
    ...thingsOf(page),
    `Now this happens: ${page.picture}`,
    END,
  ]
    .filter(Boolean)
    .join(" ");
}

/**
 * What is left once a picture is made (`QueuedPicture.after`): the page plays as soon as its file is there in the dev
 * server, but the book stays off the shelf (`unfinished`) until every page has its picture – so the last one publishes it.
 */
export const AFTER =
  "Add the page's id to MADE in src/games/bottlestory/bottleStoryPictures.ts. Once every page of the story has its picture (BOTTLE_PICTURE_QUEUE empty): crop a 480×480 webp of the green cup in Tapsi's paws from flasche-schluck.webp to src/components/bilder/spine-flaeschchen.webp (like spine-haare-waschen.webp), drop `unfinished: true` from /flaeschchen/ in src/content/games.ts so the book stands on the shelf right of „Abstillen“ (and add it to the Alltagshelfer order in content.test.ts), add a perf scenario „flaeschchen“ in tools/perfScenarios.ts like „haare-waschen“, name the bottle story in the home page's search text („/“ in seo.ts and seo.<lang>.ts, like „fürs Haarewaschen“), and follow src/games/bottlestory/CLAUDE.md („Publishing“).";

/** The queue entry of a page's picture. */
export function bottlePicture(page: BottlePage): QueuedPicture {
  return {
    id: `flasche-${page.id}`,
    file: pictureFile(page.id),
    use: `Fläschchen, „Bye-Bye, Bottle!“: ${page.text}`,
    prompt: promptOf(page),
    aspect: "4:3",
    size: "1200x900",
    quality: 70,
    ref: [PLACES[page.place].ref],
    alone: "story picture",
    after: AFTER,
    date: "2026-11-21",
  };
}

/** The pages whose pictures are made (`bilder/flasche-<id>.webp`); the others wait in the queue. */
const MADE = new Set<string>([
  "abendmilch",
  "aussuchen",
  "baby",
  "bett",
  "einschlafen",
  "gross",
  "hase",
  "kiste",
  "kleckern",
  "kuscheln",
  "lieb",
  "mittag",
  "morgenmilch",
  "regal",
  "sagen",
  "schluck",
  "schrank",
  "sonne",
  "spielen",
  "traurig",
  "ueberall",
  "vermissen",
  "wach",
  "waschen",
  "wasser",
  "will",
  "zusammen",
]);

/** Every picture of the story still to make. */
export const BOTTLE_PICTURE_QUEUE: QueuedPicture[] = BOTTLE_PAGES.filter((p) => !MADE.has(p.id)).map(bottlePicture);
