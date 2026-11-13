import type { QueuedPicture } from "@/content/pictureQueue";
import { type Cast, HAIR_PAGES, type HairPage, type Light, type Place } from "./hairStory";

// The pictures of „Tapsi and the Foam Crown“ (`hairStory.ts`), as the picture queue takes them until they are made
// (`/bild-erzeugen`). Tapsi's home is the one of the books „Abstillen“, „Schnullerfee“ and „Kita-Start“: the living room
// and Tapsi's room are drawn from their first pictures, so all four books show one home and one family; the bathroom is
// new, drawn once from the fox family (`first`), and every other page there from that picture. Plain data, no picture
// imports. A made picture goes on `MADE`, so it leaves the queue; the prompts stay here, so a picture can be drawn again.

const DIR = "src/games/hairstory/bilder";

/** The picture of a page. */
export const pictureFile = (id: string) => `${DIR}/haare-${id}.webp`;

/** The fox family as the app draws it: Papa with glasses in green, Mama with a flower in yellow, the child in light blue. */
const FAMILY = "src/components/bilder/buch-fuechse.webp";

/**
 * The picture every page of a place is drawn from, and who was where in it: a page drawn from it keeps them there unless
 * told that those places are empty now (Tapsis Milchkette, Kita-Start). A place with `first` is drawn on that page from
 * the fox family's picture.
 */
const PLACES: Record<Place, { ref: string; was: string; first?: string; looks?: string }> = {
  wohnzimmer: {
    ref: "src/games/milkchain/bilder/kette-fragen-nicht.webp",
    was: "Tapsi plays with blocks on the rug and Mama sits on the green sofa with a cup – the blocks and the cup are gone now",
  },
  kinderzimmer: {
    ref: "src/games/pacifierstory/bilder/fee-drei.webp",
    was: "Tapsi sits on the bed holding up three pacifiers – the pacifiers are gone now, there is no pacifier anywhere",
  },
  bad: {
    ref: pictureFile("becher"),
    was: "Tapsi stands at the shelf holding up the red cup and the shampoo, and Mama kneels beside Tapsi",
    first: "becher",
    looks:
      "A warm, friendly family bathroom in the same cosy home, seen from the front: a white bathtub along the back wall, with a yellow rubber duck sitting on its edge; light-blue tiles up to half the wall and warm cream walls above them; a soft round blue bath mat in front of the tub and a low wooden step at its left end; a low wooden shelf at the right end of the tub with a blue and a yellow plastic cup on it; a fluffy yellow hooded towel on a hook on the right wall; a small window with a green plant on the left. The ceiling is seen at the very top of the picture, and on it, right above the tub, a big round yellow sun sticker with a smiling face.",
  },
};

/** The light of a page, said in every prompt. */
const LIGHT: Record<Light, string> = {
  tag: "It is daytime, friendly daylight.",
  abend: "It is evening: dusk outside the window, a lamp gives warm soft light.",
};

/**
 * What Tapsi wears, chosen by the words of the page's picture text: in the bath the foam covers Tapsi up to the
 * shoulders (the app's foxes wear clothes in every picture, root CLAUDE.md – a bath is the one place where bubbles take
 * their place), wrapped in the towel, in pyjamas, else T-shirt and trousers.
 */
function tapsiWears(page: HairPage): string {
  if (/pyjamas/.test(page.picture)) return "light-blue pyjamas with small yellow stars";
  if (/Tapsi in the towel|wraps Tapsi in the towel/.test(page.picture))
    return "the fluffy yellow hooded towel wrapped all round, the hood over the head, only the face and paws peeking out";
  if (/Tapsi in the bath/.test(page.picture))
    return "nothing but the bath: Tapsi sits in shallow warm water that reaches only Tapsi's tummy, under a thick layer of white bubbles that covers Tapsi up to the shoulders, so only head, shoulders and paws are seen";
  return "a light-blue T-shirt and light-blue trousers";
}

/** Everyone in a page's picture, each described with what they wear there. */
function castOf(page: HairPage): string {
  const who: Record<Cast, string> = {
    tapsi: `Tapsi, a small fox toddler with orange fur and a white muzzle, in ${tapsiWears(page)}`,
    mama: `Mama, a grown-up fox woman with a small red flower behind one ear, in a yellow sweater${page.place === "bad" ? " with the sleeves pushed up" : ""} and brown trousers`,
    papa: "Papa, a grown-up fox man with round glasses, in a green sweater and brown trousers",
  };
  const n = page.cast.length;
  return `Exactly ${n === 1 ? "one character" : `${n} characters, each once`}: ${page.cast.map((c) => who[c]).join("; ")}. Nobody else: only ONE of each in the whole picture, nobody more in a doorway, on the furniture${page.place === "bad" ? ", in the tub" : ""} or peeking in from an edge.`;
}

/** What the things that come back look like, so they stay the same from page to page – each at one place only. */
function thingsOf(page: HairPage): string[] {
  const things: string[] = [];
  if (/plush bunny/.test(page.picture))
    things.push("The plush bunny is Tapsi's light-grey soft toy with long floppy ears, not a living rabbit; there is only one.");
  if (/red cup/.test(page.picture)) things.push("Tapsi's cup is a small red plastic cup; there is only one red cup in the picture, at the one place said.");
  if (/washcloth/.test(page.picture)) things.push("The washcloth is small, soft and green; there is only one.");
  if (/shampoo/.test(page.picture)) things.push("The children's shampoo is a small green bottle with a red apple on it, no letters; there is only one.");
  if (/towel/.test(page.picture) && page.place === "bad") things.push("There is only one yellow towel: where it is used, its hook on the wall is empty.");
  if (/mirror/.test(page.picture)) things.push("The hand mirror is small and round with a wooden handle; it shows only Tapsi's foam crown.");
  return things;
}

/** Every page is full bleed (two first pictures of Tapsis Milchkette came back with a white rounded margin). */
const END =
  "Everyone's face shows plainly what they feel. The illustration fills the whole picture edge to edge (full bleed): no border, no frame, no white margin, no rounded corners, no vignette. No speech bubbles. No text, no letters, no numbers, also not on bottles or signs.";

/** How the characters are named where a prompt says who is not there. */
const NAMED: Record<Cast, string> = { tapsi: "Tapsi", mama: "Mama (the grown-up fox woman)", papa: "Papa (the grown-up fox man)" };

/** Who of a page's reference picture this page leaves out, said plainly (Kita-Start: Mama stayed on the chair without it). */
function absent(page: HairPage): string {
  const shown = shownIn(page);
  const gone = shown.filter((who) => !page.cast.includes(who));
  if (!gone.length) return "";
  const names = gone.map((who) => NAMED[who]);
  const list = names.length === 1 ? names[0] : `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;
  return `${list} ${names.length === 1 ? "is" : "are"} not in this picture at all: leave their places in the reference empty, and give nobody else their place or clothes.`;
}

/** Who the reference picture of a page shows: Tapsi and Mama in the other books' living room, Tapsi alone in Tapsi's room. */
function shownIn(page: HairPage): Cast[] {
  const place = PLACES[page.place];
  if (place.first === page.id) return [];
  if (place.first) return HAIR_PAGES.find((p) => p.id === place.first)?.cast ?? [];
  return page.place === "wohnzimmer" ? ["tapsi", "mama"] : ["tapsi"];
}

/** The prompt of a page's picture, without the style block. */
function promptOf(page: HairPage): string {
  const place = PLACES[page.place];
  const parts =
    place.first === page.id
      ? [place.looks ?? "", "Draw the foxes like the fox family in the reference picture: the same fur and faces, in the clothes said here."]
      : [
          "Redraw this exact place from the reference picture: keep it exactly as it is – the same walls, windows, furniture and objects at the same places, the same camera framing (no zoom, no shift), the same colours and line style. Only the characters, their poses, the things they hold and the light change, and who is there.",
          `In that reference picture ${place.was}: that was another moment. Draw each character only where this page says, and leave every other place empty – no second fox, no fox tail left lying on the floor or the furniture.`,
          absent(page),
        ];
  parts.push(LIGHT[page.light], castOf(page), ...thingsOf(page), `Now this happens: ${page.picture}`, END);
  return parts.filter(Boolean).join(" ");
}

/** The queue entry of a page's picture. */
export function hairPicture(page: HairPage): QueuedPicture {
  const place = PLACES[page.place];
  return {
    id: `haare-${page.id}`,
    file: pictureFile(page.id),
    use: `Haare waschen, „Tapsi and the Foam Crown“: ${page.text}`,
    prompt: promptOf(page),
    aspect: "4:3",
    size: "1200x900",
    quality: 70,
    ref: [place.first === page.id ? FAMILY : place.ref],
    alone: "story picture",
    date: "2026-11-13",
  };
}

/** The pages whose pictures are made (`bilder/haare-<id>.webp`); the others wait in the queue. */
const MADE = new Set<string>(["klebrig", "sagen", "reihenfolge", "augen", "hase", "hase-augen", "becher", "trocknen", "stolz", "hase-krone", "lieb"]);

/** Every picture of the story still to make. */
export const HAIR_PICTURE_QUEUE: QueuedPicture[] = HAIR_PAGES.filter((p) => !MADE.has(p.id)).map(hairPicture);
