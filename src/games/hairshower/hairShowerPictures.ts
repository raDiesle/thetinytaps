import type { QueuedPicture } from "@/content/pictureQueue";
import { type Cast, type Light, type Place, SHOWER_PAGES, type ShowerPage } from "./hairShower";

// The pictures of „Tapsi and the Warm Rain“ (`hairShower.ts`), as the picture queue takes them until they are made
// (`/bild-erzeugen`, made in a Claude cloud session: Zscaler blocks Gemini on the Mac). Tapsi's home is the one of the
// other chapter books: the living room and Tapsi's room are drawn from the same pictures as „Tapsi and the Foam Crown“'s.
// The shower room is new – a bathroom with a shower and no tub, for the families this story is for: drawn once from the
// fox family on the first page there (`FIRST`), and every other shower page from that one, so the shower stays the same
// – the queue holds those pages back until it is made. Plain data, no picture imports. A made picture goes on `MADE`,
// so it leaves the queue; the prompts stay here.

const DIR = "src/games/hairshower/bilder";

/** The picture of a page. */
export const pictureFile = (id: string) => `${DIR}/dusche-${id}.webp`;

/** The fox family as the app draws it: Papa with glasses in green, Mama with a flower in yellow, the child in light blue. */
const FAMILY = "src/components/bilder/buch-fuechse.webp";

/** The shower room's first page, drawn from the family's picture; every other shower page is drawn from it. */
export const FIRST = "papa-fuesse";

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
  dusche: {
    ref: pictureFile(FIRST),
    was: "Papa sits on the shower's edge with his feet in the shower and Tapsi stands outside holding the shower head",
    shows: ["tapsi", "papa"],
  },
};

/** What the shower room looks like, said on its first page, which has no picture of it to be drawn from. */
const SHOWER_ROOM =
  "A warm, friendly family bathroom in the same cosy home, seen from the front at a child's eye height, with a shower and NO bathtub anywhere: on the left a walk-in shower corner with light-blue tiles, its floor only a low step above the room's, open towards the room, a light-blue shower curtain pushed back to its far side; a hand shower on a long silver hose, resting low in a holder on the wall at the height of a small child's shoulder; on the shower floor a soft blue non-slip mat with small white fish on it; high on the light-blue tiles of the shower's back wall a single little orange fish sticker. Warm cream walls above the tiles; a soft round blue bath mat in front of the shower; a low wooden shelf on the right with a green shampoo bottle with a red apple on it and a small red cup; a fluffy yellow hooded towel on a hook on the right wall; a small window with a green plant.";

/** The light of a page, said in every prompt. */
const LIGHT: Record<Light, string> = {
  tag: "It is daytime, friendly daylight.",
  abend: "It is evening: dusk outside the window, a lamp gives warm soft light.",
};

/**
 * What Tapsi wears, chosen by the words of the page's picture text. In the shower there is no foam to cover Tapsi as in
 * the bath, and the app's foxes wear clothes in every picture (root CLAUDE.md): so Tapsi wears small swim shorts there,
 * as at the swimming pool's shower.
 */
function tapsiWears(page: ShowerPage): string {
  if (/pyjamas/.test(page.picture)) return "light-blue pyjamas with small yellow stars";
  if (/Tapsi in the towel|wraps Tapsi in the towel/.test(page.picture))
    return "the fluffy yellow hooded towel wrapped all round, the hood over the head, only the face and paws peeking out";
  if (/Tapsi in the shower/.test(page.picture)) return "small light-blue swim shorts, as at the swimming pool";
  return "a light-blue T-shirt and light-blue trousers";
}

/** Everyone in a page's picture, each described with what they wear there. */
function castOf(page: ShowerPage): string {
  const who: Record<Cast, string> = {
    tapsi: `Tapsi, a small fox toddler with orange fur and a white muzzle, in ${tapsiWears(page)}`,
    mama: `Mama, a grown-up fox woman with a small red flower behind one ear, in a yellow sweater${page.place === "dusche" ? " with the sleeves pushed up" : ""} and brown trousers`,
    papa: `Papa, a grown-up fox man with round glasses, in a green sweater${page.place === "dusche" ? " with the sleeves pushed up" : ""} (green like a fir tree, never orange: Gemini once made it orange in the shower) and brown trousers`,
  };
  const n = page.cast.length;
  const both =
    page.cast.includes("mama") && page.cast.includes("papa")
      ? " Mama and Papa are two separate grown-ups: Mama has the flower and no glasses, Papa has the glasses and no flower."
      : "";
  return `Exactly ${n === 1 ? "one character" : `${n} characters, each once`}: ${page.cast.map((c) => who[c]).join("; ")}. Nobody else: only ONE of each in the whole picture, nobody more in a doorway, on the furniture${page.place === "dusche" ? ", in the shower" : ""} or peeking in from an edge.${both}`;
}

/** What the things that come back look like, so they stay the same from page to page – each at one place only. */
function thingsOf(page: ShowerPage): string[] {
  const things: string[] = [];
  if (/plush bunny/.test(page.picture))
    things.push("The plush bunny is Tapsi's light-grey soft toy with long floppy ears, not a living rabbit; there is only one.");
  if (/watering can/.test(page.picture)) things.push("The toy watering can is small, yellow and empty: no water comes out of it.");
  if (/shower head/.test(page.picture))
    things.push(
      "There is one hand shower on its silver hose; where someone holds it, its holder on the wall is empty. It is held low, never above Tapsi's head, and gives a soft gentle spray.",
    );
  if (/red cup/.test(page.picture)) things.push("The cup is a small red plastic cup; there is only one, in Papa's hand, and its place on the shelf is empty.");
  if (/washcloth/.test(page.picture)) things.push("The washcloth is small, soft and green; there is only one.");
  if (/shampoo/.test(page.picture)) things.push("The children's shampoo is a small green bottle with a red apple on it, no letters; there is only one.");
  if (/towel/.test(page.picture) && page.place === "dusche") things.push("There is only one yellow towel: where it is used, its hook on the wall is empty.");
  if (/fish sticker/.test(page.picture))
    things.push("The fish sticker is the one little orange fish high on the shower's tiles, at the same place as in the reference.");
  return things;
}

/**
 * What every picture of Tapsi in the shower keeps (research „haare-waschen“, the shower: sit with the toddler on the
 * shower's floor; the bath story's first takes poured water over Tapsi's face): Tapsi sits, never stands, on the mat; a
 * grown-up kneels right beside, outside the shower; the water comes low, never from above and never over the face.
 */
export const IN_THE_SHOWER =
  "Tapsi sits on the soft non-slip mat on the shower's floor, never standing. The grown-up kneels right beside Tapsi on the bath mat outside the open shower, within arm's reach, and stays dry. The water never comes from above: the shower head is held low in a paw or hangs in its holder, and its soft spray falls only on Tapsi's feet, body or the back of Tapsi's head and runs down the back, never over Tapsi's face. No bathtub anywhere.";

/** Every page is full bleed (two first pictures of Tapsis Milchkette came back with a white rounded margin). */
const END =
  "Everyone's face shows plainly what they feel. The illustration fills the whole picture edge to edge (full bleed): no border, no frame, no white margin, no rounded corners, no vignette. No speech bubbles. No text, no letters, no numbers, also not on bottles or signs.";

/** How the characters are named where a prompt says who is not there. */
const NAMED: Record<Cast, string> = { tapsi: "Tapsi", mama: "Mama (the grown-up fox woman)", papa: "Papa (the grown-up fox man)" };

/** Who of a page's reference picture this page leaves out, said plainly (Kita-Start: Mama stayed on the chair without it). */
function absent(page: ShowerPage): string {
  const gone = PLACES[page.place].shows.filter((who) => !page.cast.includes(who));
  if (!gone.length) return "";
  const names = gone.map((who) => NAMED[who]);
  return `${names.join(" and ")} ${names.length === 1 ? "is" : "are"} not in this picture at all: leave their places in the reference empty, and give nobody else their place or clothes.`;
}

/** The prompt of a page's picture, without the style block. */
export function promptOf(page: ShowerPage): string {
  const place = PLACES[page.place];
  const parts =
    page.id === FIRST
      ? [SHOWER_ROOM, "Draw the foxes like the fox family in the reference picture: the same fur and faces, in the clothes said here."]
      : [
          "Redraw this exact place from the reference picture: keep it exactly as it is – the same walls, tiles, window, furniture and objects at the same places, the same camera framing (no zoom, no shift), the same colours and line style. Only the characters, their poses, the things they hold and the light change, and who is there.",
          `In that reference picture ${place.was}: that was another moment. Draw each character only where this page says, and leave every other place empty – no second fox, no fox tail left lying on the floor or the furniture.`,
          absent(page),
        ];
  parts.push(LIGHT[page.light], castOf(page), ...thingsOf(page), `Now this happens: ${page.picture}`);
  if (/Tapsi in the shower/.test(page.picture)) parts.push(IN_THE_SHOWER);
  parts.push(END);
  return parts.filter(Boolean).join(" ");
}

/**
 * What is left once the pictures are made: the story then plays for players too (`ChapterBook` leaves out pages without
 * a picture, and the book's choice a story without one, only until then).
 */
const AFTER =
  "Look at every picture: count the foxes (only the page's cast, each once, no stray tail) and look at every face; no bathtub anywhere; Tapsi in the shower sits on the mat in swim shorts, never stands; the water never comes from above or over Tapsi's face; one shower head, one washcloth, one shampoo; the shower room the same on every shower page. Once all twenty pages are made: add each id to MADE in src/games/hairshower/hairShowerPictures.ts; take /haare-waschen/dusche/ and /haare-waschen/dusche/kurz/ out of WAITING_PATHS in src/content/seo.ts; name the second story in the search texts of /haare-waschen/ (seo.ts and its six seo.<language>.ts) and in HAIR_STORY_BLURB of src/games/hairstory/names.ts, in all seven languages; mark it published in the language row's note (languageStatus.ts) and in src/games/hairshower/CLAUDE.md; run bun run previews /haare-waschen/ and look at the choice at 844×390 and 1024×768.";

/** The queue entry of a page's picture. */
export function showerPicture(page: ShowerPage): QueuedPicture {
  return {
    id: `dusche-${page.id}`,
    file: pictureFile(page.id),
    use: `Haare waschen, „Tapsi and the Warm Rain“ (/haare-waschen/dusche/): ${page.text}`,
    prompt: promptOf(page),
    aspect: "4:3",
    size: "1200x900",
    quality: 70,
    ref: [page.id === FIRST ? FAMILY : PLACES[page.place].ref],
    alone: "story picture",
    date: "2026-11-23",
    after: AFTER,
  };
}

/** The pages whose pictures are made (`bilder/dusche-<id>.webp`); the others wait in the queue. */
const MADE = new Set<string>(["hase", "laut", "leise", "lieb", "papa-fuesse", "sagen", "sand", "stolz", "trocknen"]);

/** Every picture of the story still to make. */
export const SHOWER_PICTURE_QUEUE: QueuedPicture[] = SHOWER_PAGES.filter((p) => !MADE.has(p.id)).map(showerPicture);
