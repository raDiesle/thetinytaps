import type { QueuedPicture } from "@/content/pictureQueue";
import { type Cast, type Light, type Place, TREE_PAGES, type TreePage } from "./pacifierTree";

// The pictures of „Tapsi and the Pacifier Tree“ (`pacifierTree.ts`), as the picture queue takes them until they are made
// (`/bild-erzeugen`, made in a Claude cloud session: Zscaler blocks Gemini on the Mac). Tapsi's home is the one of the
// other chapter books: the living room is drawn from „Abstillen“'s first picture of it and Tapsi's room from the
// Schnullerfee's („fee-drei“, where Tapsi holds up the same three pacifiers). The park is new: drawn once from the fox
// family on the page where the family walks there (`FIRST`), and every other page there from that one, so the tree
// stays the same tree – the queue then holds the park's other pages back until it is made. Plain data, no picture
// imports. A made picture goes on `MADE`, so it leaves the queue; the prompts stay here.

const DIR = "src/games/pacifiertree/bilder";

/** The picture of a page. */
export const pictureFile = (id: string) => `${DIR}/baum-${id}.webp`;

/** The fox family as the app draws it: Papa with glasses in green, Mama with a flower in yellow, the child in light blue. */
const FAMILY = "src/components/bilder/buch-fuechse.webp";

/** The park's first page, drawn from the family's picture; every other park page is drawn from it. */
const FIRST = "los";

/**
 * The picture every page of a place is drawn from, and who was where in it: a page drawn from it keeps them there unless
 * told that those places are empty now (Tapsis Milchkette, Kita-Start).
 */
const PLACES: Record<Place, { ref: string; was: string; shows: Cast[] }> = {
  wohnzimmer: {
    ref: "src/games/milkchain/bilder/kette-fragen-nicht.webp",
    was: "Tapsi plays with blocks on the rug and Mama sits on the green sofa with a cup – the cup is gone now",
    shows: ["tapsi", "mama"],
  },
  kinderzimmer: {
    ref: "src/games/pacifierstory/bilder/fee-drei.webp",
    was: "Tapsi sits on the bed holding up three pacifiers",
    shows: ["tapsi"],
  },
  park: {
    ref: pictureFile(FIRST),
    was: "Tapsi walks on the path between Mama and Papa",
    shows: ["tapsi", "mama", "papa"],
  },
};

/** What the park looks like, said on its first page, which has no picture of it to be drawn from. */
const PARK =
  "A small friendly town park in spring, seen from the side at a child's eye height: a sandy path winding across a green meadow, a wooden bench, a few bushes, and on the right a big old broad tree with a thick trunk and low spreading branches. From its low branches hang many small pacifiers of other children in all colours, each on its own little ribbon, gently swaying – a pacifier tree. No other people or animals in the park.";

/** The light of a page, said in every prompt: the reference pictures are drawn in daylight. */
const LIGHT: Record<Light, string> = {
  tag: "It is daytime, friendly daylight.",
  abend: "It is evening: dusk outside the window, the small lamp gives warm soft light.",
  morgen: "It is early morning: the sun has just come up, its warm golden light shines in through the window.",
};

/** Everyone in a page's picture, each described with what they wear there. */
function castOf(page: TreePage): string {
  const pyjamas = page.picture.includes("pyjamas");
  const who: Record<Cast, string> = {
    tapsi: `Tapsi, a small fox toddler with orange fur and a white muzzle, in ${pyjamas ? "light-blue pyjamas with small yellow stars" : "a light-blue T-shirt and light-blue trousers"}`,
    mama: "Mama, a grown-up fox woman with a small red flower behind one ear, in a yellow sweater and brown trousers",
    // Gemini once drew Papa's sweater navy (Meine Schnuller).
    papa: "Papa, a grown-up fox man with round glasses, in a green sweater (fir-tree green, never navy, blue or grey) and brown trousers",
  };
  const n = page.cast.length;
  // With both grown-ups at one table Gemini once drew one fox with Mama's flower and Papa's glasses (Three More Sleeps).
  const both =
    page.cast.includes("mama") && page.cast.includes("papa")
      ? " Mama and Papa are two separate grown-ups: Mama has the flower and no glasses, Papa has the glasses and no flower."
      : "";
  return `Exactly ${n === 1 ? "one character" : `${n} characters, each once`}: ${page.cast.map((c) => who[c]).join("; ")}. Nobody else: only ONE of each in the whole picture, nobody more in a doorway, on the furniture, on the path or peeking in from an edge.${both}`;
}

/** Whether a page's picture shows Tapsi's own pacifiers (not only the many in the tree). */
const ownPacifiers = (page: TreePage) => /(red|blue|yellow|three own) pacifier/.test(page.picture);

/** What the things that come back look like, so they stay the same from page to page – each at one place only. */
function thingsOf(page: TreePage): string[] {
  const things: string[] = [];
  if (ownPacifiers(page))
    things.push(
      // Gemini drew a fourth (a second blue one) in a paw, and three more on a windowsill beside the one in Tapsi's mouth.
      "A pacifier is a toddler's dummy: a small soft teat on a round shield with a ring handle. Tapsi has exactly three, a red, a blue and a yellow one; draw each of them once, only where this page says. Count them: never a fourth, never two of one colour, and where this page names only some of them the others are not in the picture at all – no pacifier on a windowsill, shelf, floor or sofa unless this page puts it there.",
    );
  if (/ribbon/.test(page.picture) && ownPacifiers(page))
    things.push("Each of Tapsi's pacifiers hangs on a short satin ribbon of its own colour, tied to its ring.");
  // On the walk to the park Gemini put more pacifiers into Tapsi's paws and some into Papa's as well.
  if (/Tapsi .*carries/.test(page.picture) && ownPacifiers(page))
    things.push(
      "Only Tapsi holds pacifiers, just these three ribbons bunched in the paws; Mama and Papa hold no pacifier and no ribbon, their paws are empty or hold Tapsi's.",
    );
  // Drawn from the walk, where Tapsi carries them, Tapsi still held them while they already hung in the tree (baum-alle).
  if (ownPacifiers(page) && /hang/.test(page.picture) && !/carries|holds|in both paws/.test(page.picture))
    things.push("Tapsi's paws are empty: the three pacifiers hang in the tree now, nobody holds a pacifier or a ribbon.");
  if (/tree/.test(page.picture) && page.place === "park")
    things.push(
      "The pacifier tree is the big old tree of the reference with the many small pacifiers of other children hanging from its low branches on little ribbons; keep it exactly as it is.",
    );
  if (/picture book/.test(page.picture)) things.push("There is only one book, open on Papa's knees; its drawing has no letters.");
  if (/teddy/.test(page.picture))
    things.push("The teddy is Tapsi's small brown plush toy, not a living bear; there is only one, and only where this page says.");
  if (/blocks/.test(page.picture)) things.push("The wooden blocks are on the rug, in one tower.");
  return things;
}

/** How the characters are named where a prompt says who is not there. */
const NAMED: Record<Cast, string> = { tapsi: "Tapsi", mama: "Mama (the grown-up fox woman)", papa: "Papa (the grown-up fox man)" };

/** Who of a page's reference picture this page leaves out, said plainly (Kita-Start: Mama stayed on the chair without it). */
function absent(page: TreePage): string {
  const gone = PLACES[page.place].shows.filter((who) => !page.cast.includes(who));
  if (!gone.length) return "";
  const names = gone.map((who) => NAMED[who]);
  return `${names.join(" and ")} ${names.length === 1 ? "is" : "are"} not in this picture at all: leave their places in the reference empty, and give nobody else their place or clothes.`;
}

/** Every page is full bleed (two first pictures of Tapsis Milchkette came back with a white rounded margin). */
const END =
  "Everyone's face shows plainly what they feel. The illustration fills the whole picture edge to edge (full bleed): no border, no frame, no white margin, no rounded corners, no vignette. No speech bubbles. No text, no letters, no numbers.";

/** The prompt of a page's picture, without the style block. */
export function promptOf(page: TreePage): string {
  const place = PLACES[page.place];
  const parts =
    page.id === FIRST
      ? [PARK, "Draw the foxes like the fox family in the reference picture: the same fur, faces and clothes."]
      : [
          "Redraw this exact place from the reference picture: keep it exactly as it is – the same walls, window, furniture, trees and objects at the same places, the same camera framing (no zoom, no shift), the same colours and line style. Only the characters, their poses, the things they hold and the light change, and who is there.",
          // Tapsi once stayed on the rug of the reference and sat on Papa's lap as well.
          `In that reference picture ${place.was}: that was another moment. Draw each character only where this page says, and leave every other place empty – where someone was in the reference and this page puts them elsewhere, that spot is empty now: no second fox, no fox tail left lying on the floor, the furniture or the path.`,
          absent(page),
        ];
  // Tapsi's room is drawn from a picture with the three pacifiers: where this page names none, none of Tapsi's is there.
  if (page.place === "kinderzimmer" && !ownPacifiers(page)) parts.push("The three pacifiers of the reference are gone now: there is no pacifier anywhere.");
  parts.push(LIGHT[page.light], castOf(page), ...thingsOf(page), `Now this happens: ${page.picture}`, END);
  return parts.filter(Boolean).join(" ");
}

/**
 * What is left once the pictures are made: the story then plays for players too (`ChapterBook` leaves out pages without
 * a picture, and the book's choice a story without one, only until then).
 */
const AFTER =
  "Count the foxes on every picture (only the page's cast, each once, no stray tail) and look at every face; count Tapsi's own pacifiers (red, blue, yellow, each once, where the page names them – after „tschuess“ only in the tree, never in a paw, in the room or on the sofa) and check the park's tree is the same on every park page. Once all twenty pages are made: add each id to MADE in src/games/pacifiertree/pacifierTreePictures.ts; take /schnullerfee/baum/ and /schnullerfee/baum/kurz/ out of WAITING_PATHS in src/content/seo.ts; name the second story in the search texts of /schnullerfee/ (seo.ts and its six seo.<language>.ts) and in PACIFIER_STORY_BLURB of src/games/pacifierstory/names.ts, in all seven languages; mark it published in the language row's note (languageStatus.ts) and in src/games/pacifiertree/CLAUDE.md; look at the book's choice of stories in the built site at 844×390 and 1024×768.";

/** The queue entry of a page's picture. */
export function treePicture(page: TreePage): QueuedPicture {
  return {
    id: `baum-${page.id}`,
    file: pictureFile(page.id),
    use: `Schnullerfee, „Tapsi and the Pacifier Tree“ (/schnullerfee/baum/): ${page.text}`,
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

/** The pages whose pictures are made (`bilder/baum-<id>.webp`); the others wait in the queue. */
const MADE = new Set<string>([
  "abend",
  "alle",
  "baender",
  "baum",
  "besuch",
  "buch",
  "kinder",
  "kissen",
  "lieb",
  "lied",
  "los",
  "meine",
  "rot",
  "schnuller",
  "spielen",
  "stolz",
  "troesten",
  "tschuess",
  "vermisst",
  "wann",
]);

/** Every picture of the story still to make. */
export const TREE_PICTURE_QUEUE: QueuedPicture[] = TREE_PAGES.filter((p) => !MADE.has(p.id)).map(treePicture);
