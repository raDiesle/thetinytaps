import type { QueuedPicture } from "@/content/pictureQueue";
import { BED_PAGES, type BedPage, type Cast, type Light, type Place } from "./bedStory";

// The pictures of „Tapsi's Big Bed“ (`bedStory.ts`), as the picture queue takes them until they are made
// (`/bild-erzeugen`). Tapsi's home is the one of „Abstillen“, „Schnullerfee“, „Kita-Start“ and „Hair Washing“: the
// living room is drawn from Abstillen's first picture, and Tapsi's room from the Schnullerfee's (`fee-drei`) – the big
// bed of this story is the very bed Tapsi has in the other books, so they all show one home. Before it comes, the room
// holds a cot instead (`gitterzimmer`, drawn once from `fee-drei` with the bed swapped for the cot), and once it is made
// with its rail and moon night light (`kinderzimmer`, drawn once from `fee-drei`) every later page there is drawn from
// that picture. Bruno's home is new: his parents' bedroom and his room are each drawn once from the bear family and from
// Bruno as Kita-Start drew him. Plain data, no picture imports. A made picture goes on `MADE`, so it leaves the queue;
// the prompts stay here, so a picture can be drawn again.

const DIR = "src/games/bedstory/bilder";

/** The picture of a page. */
export const pictureFile = (id: string) => `${DIR}/bett-${id}.webp`;

/** The bear family as the app draws it, for the look of the bears' faces and fur. */
const BEARS = "src/components/bilder/buch-baeren.webp";

/** Bruno, Tapsi's bear friend, as Kita-Start drew him (in the play room, building with Mia). */
const BRUNO = "src/games/kitastory/bilder/kita-stuhl.webp";

/** Tapsi's room in the other books: the wooden bed with the blue blanket, the window with plants, the lamp and the toy shelf. */
const TAPSI_ROOM = "src/games/pacifierstory/bilder/fee-drei.webp";

/** What Tapsi's room of the other books shows that belongs to another moment: said in every prompt drawn from it. */
const TAPSI_ROOM_WAS = "Tapsi sits on the bed holding up three pacifiers – the pacifiers are gone now, there is no pacifier anywhere";

/** A place's reference picture, who stands in it and what of it belongs to another moment. */
interface Reference {
  /** The pictures passed as `ref`. */
  ref: string[];
  /** What the reference shows that was another moment, said so the page leaves it out; none for the families' pictures. */
  was?: string;
  /** Who of the cast is in the reference (`absent` names those the page leaves out). */
  shows: Cast[];
}

/**
 * The picture every page of a place is drawn from. A place with `first` is drawn on that page from `from` (another
 * book's picture or the families'), with `looks` saying what the place looks like; every other page there from that
 * first picture.
 */
const PLACES: Record<Place, Reference & { first?: { id: string; from: Reference; looks: string } }> = {
  wohnzimmer: {
    ref: ["src/games/milkchain/bilder/kette-fragen-nicht.webp"],
    was: "Tapsi plays with blocks on the rug and Mama sits on the green sofa with a cup – the blocks and the cup are gone now",
    shows: ["tapsi", "mama"],
  },
  gitterzimmer: {
    ref: [pictureFile("eng")],
    was: "Tapsi lies in the cot",
    shows: ["tapsi"],
    first: {
      id: "eng",
      from: { ref: [TAPSI_ROOM], was: TAPSI_ROOM_WAS, shows: ["tapsi"] },
      looks:
        "This is Tapsi's room from the reference picture, before the big bed came: keep the room exactly as it is – the open window with the plants on the sill, the bedside table with its lamp, the shelf with the toys and the teddy, the blue rug, the walls, the same camera framing (no zoom, no shift), the same colours and line style. Only one thing is different: where the wooden bed stands there is no wooden bed at all, but a white wooden cot of the same length, with upright bars on all four sides and a top rail, a small white mattress and pillow inside it and a small soft yellow blanket.",
    },
  },
  bau: {
    ref: [TAPSI_ROOM],
    was: `${TAPSI_ROOM_WAS}, and the bed is not built yet – this page says how far it is; the blue bedding is not there yet`,
    shows: ["tapsi"],
  },
  kinderzimmer: {
    ref: [pictureFile("machen")],
    was: "Mama smooths the blanket over the bed and Tapsi sets the plush bunny on the pillow",
    shows: ["tapsi", "mama"],
    first: {
      id: "machen",
      from: { ref: [TAPSI_ROOM], was: TAPSI_ROOM_WAS, shows: ["tapsi"] },
      looks:
        "This is Tapsi's room from the reference picture with Tapsi's big bed: keep the room and the wooden bed exactly as they are – the same bed at the same place with the blue blanket, the open window with the plants, the bedside table with its lamp, the shelf with the toys and the teddy, the blue rug, the same camera framing (no zoom, no shift), the same colours and line style. Add only two things, both kept in every picture from now on: a low wooden guard rail along the bed's open long side, from the head end to the middle of the bed, in the same wood as the bed; and a small moon-shaped night light, switched off, plugged in at the wall low down beside the bedside table.",
    },
  },
  baerenschlafzimmer: {
    ref: [pictureFile("bruno-familienbett")],
    was: "Bruno sleeps between Mama Bear and Papa Bear in the big bed",
    shows: ["bruno", "mamaBaer", "papaBaer"],
    first: {
      id: "bruno-familienbett",
      from: { ref: [BEARS, BRUNO], shows: [] },
      looks:
        "A cosy bedroom of a bear family in their home, seen from the foot of the bed: a big wooden double bed with a thick cream-coloured blanket and three pillows against the back wall, a small bedside table with a little lamp on each side, a window with dark-blue curtains on the left wall, a soft brown rug in front of the bed. Draw the bears like the bear family in the first reference picture – the same faces, round ears and line style – and Bruno exactly like the small dark-brown bear toddler in the red T-shirt and blue dungarees in the second reference picture, only that picture's Bruno: nobody else of it, and nothing of its room.",
    },
  },
  brunozimmer: {
    ref: [pictureFile("bruno-bett")],
    was: "Bruno stands beside the bed hugging the boat pillow and Papa Bear kneels beside it",
    shows: ["bruno", "papaBaer"],
    first: {
      id: "bruno-bett",
      from: { ref: [BEARS, BRUNO], shows: [] },
      looks:
        "Bruno's own small room in the bear family's home, seen from the front: a new low light-wood bed against the back wall, close to the floor, with a green blanket and a pillow with little blue boats on it; a small bedside table with a little lamp at its head; a window with yellow curtains on the left wall; a low shelf on the right with a wooden toy boat and building blocks; a round red rug in front of the bed. Draw the bears like the bear family in the first reference picture – the same faces, round ears and line style – and Bruno exactly like the small dark-brown bear toddler in the red T-shirt and blue dungarees in the second reference picture, only that picture's Bruno: nobody else of it, and nothing of its room.",
    },
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
const dressedForNight = (page: BedPage, name: string) => new RegExp(`${name} in (her )?(pyjamas|nightgown)`).test(page.picture);

/** A bear's tail, said for every bear: Kita-Start's Mia once came with a fox's bushy tail. */
const BEAR_TAIL = "with only a tiny round bear tail, never a long bushy one";

/** Everyone in a page's picture, each described with what they wear there. */
function castOf(page: BedPage): string {
  const who: Record<Cast, string> = {
    tapsi: `Tapsi, a small fox toddler with orange fur and a white muzzle, in ${dressedForNight(page, "Tapsi") ? "light-blue pyjamas with small yellow stars" : "a light-blue T-shirt and light-blue trousers"}`,
    mama: `Mama, a grown-up fox woman with a small red flower behind one ear, in ${dressedForNight(page, "Mama") ? "a long yellow nightgown" : "a yellow sweater and brown trousers"}`,
    papa: `Papa, a grown-up fox man with round glasses, in ${dressedForNight(page, "Papa") ? "green striped pyjamas" : "a green sweater and brown trousers"}`,
    bruno: `Bruno, Tapsi's friend, a small bear toddler with dark-brown fur, as small as a toddler, in ${dressedForNight(page, "Bruno") ? "red pyjamas with small white dots" : "a red T-shirt and blue dungarees"}, ${BEAR_TAIL}`,
    mamaBaer: `Mama Bear, a grown-up bear woman with dark-brown fur like Bruno's, in ${dressedForNight(page, "Mama Bear") ? "a long pink nightgown" : "a pink cardigan over a light-pink shirt and dark-blue trousers"}, ${BEAR_TAIL}`,
    papaBaer: `Papa Bear, a grown-up bear man with dark-brown fur like Bruno's, in ${dressedForNight(page, "Papa Bear") ? "grey-blue striped pyjamas" : "a mustard-yellow sweater and grey trousers"}, ${BEAR_TAIL}`,
  };
  const n = page.cast.length;
  return `Exactly ${n === 1 ? "one character" : `${n} characters, each once`}: ${page.cast.map((c) => who[c]).join("; ")}. Nobody else: only ONE of each in the whole picture, nobody more in a doorway, on the furniture or peeking in from an edge.`;
}

/** What the things that come back look like, so they stay the same from page to page – each at one place only. */
function thingsOf(page: BedPage): string[] {
  const things: string[] = [];
  if (/plush bunny/.test(page.picture))
    things.push("The plush bunny is Tapsi's light-grey soft toy with long floppy ears, not a living rabbit; there is only one.");
  if (/yellow blanket/.test(page.picture)) things.push("The small yellow blanket is Tapsi's soft cuddle blanket from the cot; there is only one.");
  if (/chair/.test(page.picture)) things.push("There is only one small wooden chair in the room, at the one place said.");
  if (/night light/.test(page.picture))
    things.push("The night light is small and shaped like a crescent moon, plugged in at the wall low down beside the bedside table; there is only one.");
  if (/picture book/.test(page.picture)) things.push("There is only one picture book, the one held; its pages show pictures only, no letters.");
  if (/boat/.test(page.picture)) things.push("Bruno's pillow is white with little blue boats on it; there is only one.");
  if (/cot/.test(page.picture) && page.place !== "bau")
    things.push("There is only one cot, at the place of the bed in the reference; there is no other bed in the room.");
  return things;
}

/**
 * What every picture of a child in bed keeps, as the guides ask for a safe bed: the child lies inside it, never on the
 * rail or half over the edge, and nothing like a pillow mountain or loose toys piles up round it.
 */
export const SAFE_BED =
  "The bed is safe and calm: whoever lies in it lies fully inside it, never over the rail or the edge; besides the pillow, the blanket and the cuddly toy said, nothing lies in the bed.";

/** Every page is full bleed (two first pictures of Tapsis Milchkette came back with a white rounded margin). */
const END =
  "Everyone's face shows plainly what they feel, friendly and warm. The illustration fills the whole picture edge to edge (full bleed): no border, no frame, no white margin, no rounded corners, no vignette. No speech bubbles. No text, no letters, no numbers, also not in books or on signs.";

/** How the characters are named where a prompt says who is not there. */
const NAMED: Record<Cast, string> = {
  tapsi: "Tapsi",
  mama: "Mama (the grown-up fox woman)",
  papa: "Papa (the grown-up fox man)",
  bruno: "Bruno",
  mamaBaer: "Mama Bear",
  papaBaer: "Papa Bear",
};

/** The reference a page is drawn from: its place's first picture's own, or the place's. */
const referenceOf = (page: BedPage): Reference => {
  const place = PLACES[page.place];
  return place.first?.id === page.id ? place.first.from : place;
};

/** Who of a page's reference picture this page leaves out, said plainly (Kita-Start: Mama stayed on the chair without it). */
function absent(page: BedPage): string {
  const gone = referenceOf(page).shows.filter((who) => !page.cast.includes(who));
  if (!gone.length) return "";
  const names = gone.map((who) => NAMED[who]);
  const list = names.length === 1 ? names[0] : `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;
  return `${list} ${names.length === 1 ? "is" : "are"} not in this picture at all: leave their places in the reference empty, and give nobody else their place or clothes.`;
}

/** The prompt of a page's picture, without the style block. */
function promptOf(page: BedPage): string {
  const place = PLACES[page.place];
  const reference = referenceOf(page);
  const first = place.first?.id === page.id ? place.first : undefined;
  const parts = [
    first?.looks ??
      "Redraw this exact place from the reference picture: keep it exactly as it is – the same walls, windows, furniture and objects at the same places, the same camera framing (no zoom, no shift), the same colours and line style. Only the characters, their poses, the things they hold and the light change, and who is there.",
    reference.was
      ? `In that reference picture ${reference.was}: that was another moment. Draw each character only where this page says, and leave every other place empty – no second character, no tail left lying on the floor or the furniture.`
      : "",
    absent(page),
    LIGHT[page.light],
    castOf(page),
    ...thingsOf(page),
    `Now this happens: ${page.picture}`,
  ];
  if (/\bbed\b/.test(page.picture) && page.place !== "bau") parts.push(SAFE_BED);
  parts.push(END);
  return parts.filter(Boolean).join(" ");
}

/** The pictures a page waits for: its reference, and any of them still in the queue holds it back until made. */
const refOf = (page: BedPage) => referenceOf(page).ref;

/** What is left once the book's last picture is made: it stays out of the shelf until then (`unfinished` in `games.ts`). */
const AFTER =
  "Wenn damit das letzte Bild des Buchs gemacht ist (BED_PICTURE_QUEUE leer): src/components/bilder/spine-grosses-bett.webp schneiden (160×160 aus bett-machen.webp, wie spine-haare-waschen.webp), einen perf-Ablauf „grosses-bett“ in tools/perfScenarios.ts wie „haare-waschen“ eintragen, und der Nutzerin sagen, dass das Buch veröffentlicht werden kann (unfinished in games.ts streichen, das Buch in den Suchtexten der Startseite nennen) – nicht selbst veröffentlichen.";

/** The queue entry of a page's picture. */
export function bedPicture(page: BedPage): QueuedPicture {
  return {
    id: `bett-${page.id}`,
    file: pictureFile(page.id),
    use: `Großes Bett, „Tapsi's Big Bed“: ${page.text}`,
    prompt: promptOf(page),
    aspect: "4:3",
    size: "1200x900",
    quality: 70,
    ref: refOf(page),
    alone: "story picture",
    after: AFTER,
    date: "2026-11-21",
  };
}

/** The pages whose pictures are made (`bilder/bett-<id>.webp`); the others wait in the queue. */
const MADE = new Set<string>([
  "abschied",
  "aufwachen",
  "aussuchen",
  "bauen",
  "bleiben",
  "bruno-bett",
  "bruno-familienbett",
  "bruno-mittag",
  "bruno-nacht",
  "bruno-rufen",
  "buch",
  "eng",
  "gelaender",
  "geschichte",
  "gutenacht",
  "klettern",
  "licht",
  "lieb",
  "lied",
  "machen",
  "mit",
  "mittag",
  "nachschauen",
  "raus",
  "stolz",
  "stuhl",
  "traum",
  "tuer",
  "wachsen",
  "weiter",
  "wo",
  "zudecken",
  "zuhoeren",
  "zurueck",
]);

/** Every picture of the story still to make. */
export const BED_PICTURE_QUEUE: QueuedPicture[] = BED_PAGES.filter((p) => !MADE.has(p.id)).map(bedPicture);
