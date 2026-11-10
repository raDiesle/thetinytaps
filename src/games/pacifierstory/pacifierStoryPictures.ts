import type { QueuedPicture } from "@/content/pictureQueue";
import { type Cast, type FairyPage, type Light, PACIFIER_PAGES, type Place } from "./pacifierStory";

// The pictures of „Tapsi und die Schnullerfee“ (`pacifierStory.ts`), as the picture queue takes them until they are
// made (`/bild-erzeugen`). The living room and the garden are Tapsi's from the book „Abstillen“ (its first pictures
// there are the reference, so both books show one home); Tapsi's room is drawn once anew with a wide windowsill for the
// box, the stars and the fairy (`FIRST`), and every other page there from it. The night sky is drawn from the page where
// the fairy first comes, so she looks the same. Plain data, no picture imports. A made picture goes on `MADE`, so it
// leaves the queue; the prompts stay here, so a picture can be drawn again.

const DIR = "src/games/pacifierstory/bilder";

/** The picture of a page. */
export const pictureFile = (id: string) => `${DIR}/fee-${id}.webp`;

/** The fox family as the app draws it: Papa with glasses in green, Mama with a flower in yellow, the child in light blue. */
const FAMILY = "src/components/bilder/buch-fuechse.webp";

/**
 * The picture every page of a place is drawn from, and where the foxes stand in it: a page drawn from it keeps them
 * there unless told that those places are empty now (Tapsis Milchkette, November 2026: six of twenty pages kept a
 * second fox or a stray tail without it). A place with `first` is drawn on that page from the family's picture.
 */
const PLACES: Record<Place, { ref: string; was: string; first?: string; looks?: string }> = {
  wohnzimmer: {
    ref: "src/games/milkchain/bilder/kette-fragen-nicht.webp",
    was: "Tapsi plays with blocks on the rug and Mama sits on the green sofa with a cup",
  },
  garten: {
    ref: "src/games/milkchain/bilder/kette-tag-raus.webp",
    was: "Tapsi kicks a ball on the lawn and Mama runs behind",
  },
  kinderzimmer: {
    ref: pictureFile("drei"),
    was: "Tapsi sits on the bed holding up three pacifiers",
    first: "drei",
    looks:
      "A small cosy child's bedroom seen from the front: on the left a big window with a wide white windowsill, the window's two wings can open; on the right a wooden child's bed against the wall with a blue blanket and a pillow; a night table with a small lamp between window and bed, a low shelf with a few toys, a round rug on the floor. The wall above the bed is bare.",
  },
  himmel: {
    ref: pictureFile("kommt"),
    was: "Tapsi sleeps in the bed and the fairy flies in through the window",
    first: "fort",
    looks: "Outside at night, high above a small sleeping town: moonlit roofs and chimneys below, the moon and many stars in the deep blue sky.",
  },
};

/** The light of a page, said in every prompt. */
const LIGHT: Record<Light, string> = {
  tag: "It is daytime, friendly daylight.",
  abend: "It is evening: dusk outside the window, a lamp gives warm soft light.",
  nacht: "It is night: the room lies in dark blue moonlight, the moon in the window, everything still clearly seen.",
  morgen: "It is early morning: warm sunlight shines in through the window.",
};

/** Everyone in a page's picture, each described with what they wear there. */
function castOf(page: FairyPage): string {
  const pyjamas = page.picture.includes("pyjamas");
  const who: Record<Cast, string> = {
    baby: "baby Tapsi, a tiny baby fox in a light-blue romper",
    tapsi: `Tapsi, a small fox toddler with orange fur and a white muzzle, in ${pyjamas ? "light-blue pyjamas with small yellow stars" : "a light-blue T-shirt and light-blue trousers"}`,
    mama: "Mama, a grown-up fox woman with a small red flower behind one ear, in a yellow sweater and brown trousers",
    papa: "Papa, a grown-up fox man with round glasses, in a green sweater and brown trousers",
    fee: "the pacifier fairy, a small bear girl about half as tall as Tapsi, with honey-brown fur and round ears, in a pale-pink dress, a tiny golden crown, delicate shimmering translucent wings on her back and a little star wand",
  };
  const n = page.cast.length;
  return `Exactly ${n === 1 ? "one character" : `${n} characters, each once`}: ${page.cast.map((c) => who[c]).join("; ")}. Nobody else: only ONE of each in the whole picture, nobody more in a doorway, on the furniture or peeking in from an edge.`;
}

/** What the pacifiers and the toys look like, so they stay the same from page to page. */
function thingsOf(page: FairyPage): string[] {
  const things: string[] = [];
  if (/pacifier/.test(page.picture.replace(/pacifier (fairy|box)/g, ""))) {
    things.push(
      "A pacifier is a toddler's dummy: a small soft teat on a round shield with a ring handle. There are exactly three in the story, a red, a blue and a yellow one; draw only the ones this page names.",
    );
  }
  if (/pacifier box/.test(page.picture))
    things.push(
      "The pacifier box is a small round box with a dark-blue lid with little yellow stars on it – never a wrapped present; where it is closed, a thin red ribbon is tied round it in a bow. There is only one such box.",
    );
  if (/teddy/.test(page.picture)) things.push("The teddy bear is a small brown plush toy, not a living bear.");
  if (/plush bunny/.test(page.picture)) things.push("The plush bunny is a soft toy with long floppy ears, not a living rabbit.");
  return things;
}

/** Every page is full bleed (two first pictures of Tapsis Milchkette came back with a white rounded margin). */
const END =
  "Everyone's face shows plainly what they feel. The illustration fills the whole picture edge to edge (full bleed): no border, no frame, no white margin, no rounded corners, no vignette. No speech bubbles. No text, no letters, no numbers.";

/** The prompt of a page's picture, without the style block. */
function promptOf(page: FairyPage): string {
  const place = PLACES[page.place];
  const parts =
    place.first === page.id
      ? [place.looks ?? "", page.cast.includes("fee") ? "" : "Draw the foxes like the fox family in the reference picture: the same fur, faces and clothes."]
      : [
          "Redraw this exact place from the reference picture: keep it exactly as it is – the same walls, window, furniture and objects at the same places, the same camera framing (no zoom, no shift), the same colours and line style. Only the characters, their poses, the things they hold and the light change, and who is there.",
          `In the reference picture ${place.was}: that was another moment. Draw each character only where this page says, and leave every other place empty – no fox, no second fox, no fox tail left lying on the rug or the furniture.`,
        ];
  if (place.first === page.id && page.cast.includes("fee")) {
    parts.push("Draw the fairy exactly like the fairy in the reference picture: the same fur, dress, crown and wings. Only the place is new.");
  }
  parts.push(LIGHT[page.light], castOf(page), ...thingsOf(page), `Now this happens: ${page.picture}`, END);
  return parts.filter(Boolean).join(" ");
}

/** The picture a page is drawn from: the place's reference, or for the place's first picture the family (or the fairy's page). */
function refOf(page: FairyPage): string {
  const place = PLACES[page.place];
  if (place.first !== page.id) return place.ref;
  return page.place === "himmel" ? place.ref : FAMILY;
}

/** The queue entry of a page's picture. */
export function fairyPicture(page: FairyPage): QueuedPicture {
  return {
    id: `fee-${page.id}`,
    file: pictureFile(page.id),
    use: `Schnullerfee, „Tapsi und die Schnullerfee“: ${page.text}`,
    prompt: promptOf(page),
    aspect: "4:3",
    size: "1200x900",
    quality: 70,
    ref: [refOf(page)],
    alone: "story picture",
    date: "2026-11-10",
  };
}

/** The pages whose pictures are made (`bilder/fee-<id>.webp`); the others wait in the queue. */
const MADE = new Set<string>([
  "baby",
  "drei",
  "gross",
  "mmm",
  "sofa",
  "zaehne",
  "fee",
  "babys",
  "meiner",
  "kissen",
  "bauen",
  "pusten",
  "einschlafen",
  "bereit",
  "sterne",
  "malen",
  "heute",
  "rot",
  "blau",
  "gelb",
  "schachtel",
  "kuss",
  "fensterbrett",
  "zudecken",
  "weinen",
  "traurig",
  "lied",
  "kommt",
  "nimmt",
  "geschenk",
  "fort",
  "aufwachen",
  "weg",
  "hase",
  "freuen",
  "wo",
  "vermisst",
  "leichter",
  "erzaehlen",
  "lieb",
]);

/** Every picture of the story still to make. */
export const PACIFIER_PICTURE_QUEUE: QueuedPicture[] = PACIFIER_PAGES.filter((p) => !MADE.has(p.id)).map(fairyPicture);
