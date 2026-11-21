import type { QueuedPicture } from "@/content/pictureQueue";
import { NURSING } from "@/games/milkchain/milkChainPictures";
import { type Cast, type Light, NIGHT_PAGES, type NightPage, type Place } from "./nightMilk";

// The pictures of „The Milk Sleeps at Night“ (`nightMilk.ts`), as the picture queue takes them until they are made
// (`/bild-erzeugen`, made in a Claude cloud session: Zscaler blocks Gemini on the Mac). Tapsi's home is the one of the
// other chapter books: the living room is drawn from „Abstillen“'s first picture of it and Tapsi's room from
// „Schnullerfee“'s – never from „Abstillen“'s room, whose chain of milk drops over the bed belongs to that story and
// would come back on every page. So every page is drawn from a picture already made, and the queue makes them all at
// once. Plain data, no picture imports. A made picture goes on `MADE`, so it leaves the queue; the prompts stay here.

const DIR = "src/games/nightmilk/bilder";

/** The picture of a page. */
export const pictureFile = (id: string) => `${DIR}/nacht-${id}.webp`;

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
    was: "Tapsi sits on the bed holding up three pacifiers – the pacifiers are gone now, there is no pacifier anywhere",
    shows: ["tapsi"],
  },
};

/** The light of a page, said in every prompt: both reference pictures are drawn in daylight. */
const LIGHT: Record<Light, string> = {
  tag: "It is daytime, friendly daylight.",
  abend: "It is evening: dusk outside the window, the small lamp on the night table gives warm soft light.",
  nacht: "It is night: the room lies in dark blue moonlight, a crescent moon and a few stars in the window, everything still clearly seen. The lamp is off.",
  morgen: "It is early morning: the sun has just come up, its warm golden light shines in through the window.",
};

/** What the moon in the window looks like, so it is the same on every page that shows it. */
const MOON = "The moon in the window is a pale yellow crescent with a gentle sleeping face; there is only one moon.";

/** Whether Tapsi wears pyjamas: in Tapsi's room from the evening to the morning, as the page's words say. */
const inPyjamas = (page: NightPage) => /Tapsi in pyjamas/.test(page.picture);

/** Everyone in a page's picture, each described with what they wear there. */
function castOf(page: NightPage): string {
  const night = page.light === "nacht";
  const who: Record<Cast, string> = {
    tapsi: `Tapsi, a small fox toddler with orange fur and a white muzzle, in ${inPyjamas(page) ? "light-blue pyjamas with small yellow stars" : "a light-blue T-shirt and light-blue trousers"}`,
    mama: "Mama, a grown-up fox woman with a small red flower behind one ear, in a yellow sweater and brown trousers",
    papa: `Papa, a grown-up fox man with round glasses, in ${night ? "green striped pyjamas" : "a green sweater and brown trousers"}`,
  };
  const n = page.cast.length;
  return `Exactly ${n === 1 ? "one character" : `${n} characters, each once`}: ${page.cast.map((c) => who[c]).join("; ")}. Nobody else: only ONE of each in the whole picture, nobody more in a doorway, on the furniture or peeking in from an edge.`;
}

/** What the things that come back look like, so they stay the same from page to page – each at one place only. */
function thingsOf(page: NightPage): string[] {
  const things: string[] = [];
  if (/moon/.test(page.picture) && page.place === "kinderzimmer") things.push(MOON);
  if (/picture book/.test(page.picture) && page.place === "wohnzimmer")
    things.push("The little picture book has a moon on one page and a sun on the other and no letters; there is only one.");
  if (/picture book/.test(page.picture) && page.place === "kinderzimmer")
    things.push("Papa's picture book is a plain bedtime book with a sleeping bunny on its open pages and no letters; there is only one book.");
  if (/blue cup/.test(page.picture)) things.push("The cup of water is a small blue plastic cup; there is only one blue cup, at the one place said.");
  if (/teddy/.test(page.picture))
    things.push(
      "The teddy is Tapsi's small brown plush toy, not a living bear; there is only one: it is in Tapsi's arms now, and the shelf where it sat in the reference has no teddy.",
    );
  return things;
}

/** How the characters are named where a prompt says who is not there. */
const NAMED: Record<Cast, string> = { tapsi: "Tapsi", mama: "Mama (the grown-up fox woman)", papa: "Papa (the grown-up fox man)" };

/** Who of a page's reference picture this page leaves out, said plainly (Kita-Start: Mama stayed on the chair without it). */
function absent(page: NightPage): string {
  const gone = PLACES[page.place].shows.filter((who) => !page.cast.includes(who));
  if (!gone.length) return "";
  const names = gone.map((who) => NAMED[who]);
  return `${names.join(" and ")} ${names.length === 1 ? "is" : "are"} not in this picture at all: leave their places in the reference empty, and give nobody else their place or clothes.`;
}

/** Every page is full bleed (two first pictures of Tapsis Milchkette came back with a white rounded margin). */
const END =
  "Everyone's face shows plainly what they feel. The illustration fills the whole picture edge to edge (full bleed): no border, no frame, no white margin, no rounded corners, no vignette. No speech bubbles. No text, no letters, no numbers.";

/** The prompt of a page's picture, without the style block. */
export function promptOf(page: NightPage): string {
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

/** The queue entry of a page's picture. */
export function nightPicture(page: NightPage): QueuedPicture {
  return {
    id: `nacht-${page.id}`,
    file: pictureFile(page.id),
    use: `Abstillen, „The Milk Sleeps at Night“ (/abstillen/nachts/): ${page.text}`,
    prompt: promptOf(page),
    aspect: "4:3",
    size: "1200x900",
    quality: 70,
    ref: [PLACES[page.place].ref],
    alone: "story picture",
    date: "2026-11-21",
    after: AFTER,
  };
}

/**
 * What is left once the pictures are made: the story then plays for players too (`ChapterBook` leaves out pages without
 * a picture only until then), so its volume is published and gets its spine.
 */
const AFTER =
  "Count the foxes on every picture (only the page's cast, each once, no stray tail) and look at every face; Tapsi's room must show no chain of milk drops over the bed. Once all twelve pages are made: add each id to MADE in src/games/nightmilk/nightMilkPictures.ts, cut the spine picture src/components/bilder/spine-abstillennachts.webp (bookIdOf drops the slashes, so not spine-abstillen-nachts) from nacht-weiter.webp (the moon and Tapsi asleep, cut like spine-abstillen.webp), drop `unfinished` from the volume /abstillen/nachts/ in src/content/games.ts (Abstillen then stands as two books tied together), mark the language row's note in languageStatus.ts and the root shelf test in content.test.ts, run bun run previews /abstillen/nachts/ and look at it.";

/** The pages whose pictures are made (`bilder/nacht-<id>.webp`); the others wait in the queue. */
const MADE = new Set<string>([
  "abendmilch",
  "einschlafen",
  "lieb",
  "morgenmilch",
  "papa",
  "sagen",
  "tags",
  "trinken",
  "wach",
  "wasser",
  "weinen",
  "weiter",
  "wieder",
  "winken",
]);

/** Every picture of the story still to make. */
export const NIGHT_PICTURE_QUEUE: QueuedPicture[] = NIGHT_PAGES.filter((p) => !MADE.has(p.id)).map(nightPicture);
