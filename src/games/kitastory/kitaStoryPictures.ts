import type { QueuedPicture } from "@/content/pictureQueue";
import { type Cast, KITA_PAGES, type KitaPage, type Light, type Place } from "./kitaStory";

// The pictures of „Tapsi geht in die Kita“ (`kitaStory.ts`), as the picture queue takes them until they are made
// (`/bild-erzeugen`). Tapsi's home is the one of the books „Abstillen“ and „Schnullerfee“ (their first pictures are the
// reference, so all three books show one home and one family); the Kita's places – the house from the street, the
// cloakroom, the play room and the garden – are each drawn once (`first`), and every other page there from that
// picture. Mia, the Kita teacher, and Bruno, Tapsi's friend, are bears in roles: a page with one of them in a place
// whose reference doesn't show them is drawn from the page where they first came too (`PEOPLE`), so they stay the same.
// Plain data, no picture imports. A made picture goes on `MADE`, so it leaves the queue; the prompts stay here, so a
// picture can be drawn again.

const DIR = "src/games/kitastory/bilder";

/** The picture of a page. */
export const pictureFile = (id: string) => `${DIR}/kita-${id}.webp`;

/** The fox family as the app draws it: Papa with glasses in green, Mama with a flower in yellow, the child in light blue. */
const FAMILY = "src/components/bilder/buch-fuechse.webp";

/** The bear family as the app draws it, for the look of the bears' faces and fur in the Kita's first pictures. */
const BEARS = "src/components/bilder/buch-baeren.webp";

/**
 * The picture every page of a place is drawn from, and where the characters stand in it: a page drawn from it keeps them
 * there unless told that those places are empty now (Tapsis Milchkette, November 2026: six of twenty pages kept a
 * second fox or a stray tail without it). A place with `first` is drawn on that page from the families' pictures.
 */
const PLACES: Record<Place, { ref: string; was: string; first?: string; looks?: string }> = {
  wohnzimmer: {
    ref: "src/games/milkchain/bilder/kette-fragen-nicht.webp",
    was: "Tapsi plays with blocks on the rug and Mama sits on the green sofa with a cup",
  },
  kinderzimmer: {
    ref: "src/games/pacifierstory/bilder/fee-drei.webp",
    was: "Tapsi sits on the bed holding up three pacifiers",
  },
  weg: {
    ref: "src/games/milkchain/bilder/kette-tag-mittag.webp",
    was: "Papa pushes a pram with baby Tapsi along the path – that pram is gone now, no pram, pram frame or wheels anywhere",
  },
  kita: {
    ref: pictureFile("anschauen"),
    was: "Papa and Tapsi stand on the pavement and look at the house",
    first: "anschauen",
    looks:
      "A quiet little street in front of a daycare centre (a German Kita for toddlers), seen from across the pavement, so plainly a Kita and not a family's house: a wide, friendly one-storey building with a red roof and warm yellow walls, a colourful rainbow painted along its wall under the roof, a big green front door on the right standing wide open, showing a bright hall with small coats on hooks inside, and on the left a big low window with a white frame, children's paintings of suns and flowers stuck inside the glass at its edges so the middle of the window stays clear; in front of the house a low wooden fence with a big wide entrance gate, both its wings swung wide open, and a path from it to the open door. Beside the house, behind the fence, a garden with a playground full of toys: a sandpit with a wooden edge and buckets and shovels in it, a small slide, a swing on a wooden frame, a little climbing frame, a tricycle and a big red ball on the lawn; a big tree beside the house, a pavement in front.",
  },
  garderobe: {
    ref: pictureFile("ankommen"),
    was: "Mama and Tapsi come in through the front door and Mia kneels in front of them",
    first: "ankommen",
    looks:
      "The cloakroom of a daycare centre for toddlers, seen from the front: along the back wall a row of low wooden cubbies with coat hooks, above every hook a small round picture sign (a yellow star, a sun, a fish, a flower, a car), small shoes under a long low wooden bench in front of them; on the left the green front door with a round window, on the right an open doorway into a bright play room.",
  },
  gruppenraum: {
    ref: pictureFile("stuhl"),
    was: "Mama sits on a small chair at the wall with Tapsi on her lap, and Mia and Bruno build with blocks on the rug",
    first: "stuhl",
    looks:
      "A bright play room of a daycare centre for toddlers, seen from the front: on the left a big low window with a white frame looking out onto the street, a low round wooden table with four small chairs in front of it; on the right a soft round play rug with wooden blocks, a low toy shelf with a toy truck, a doll and picture books; a small wooden chair at the back wall between them; a few children's paintings on the wall.",
  },
  garten: {
    ref: pictureFile("draussen"),
    was: "Tapsi and Bruno dig in the sandpit and Mia sits on its edge",
    first: "draussen",
    looks:
      "The garden of the daycare centre behind the house: a green lawn inside a low wooden fence, a sandpit with a wooden edge and a few sand toys in the front, a small slide on the right, a bush and a big tree on the left, the house's yellow back wall with a door in the background.",
  },
};

/** Whether a character is one of the Kita's bears. */
const isBear = (c: Cast) => c !== "tapsi" && c !== "mama" && c !== "papa";

/** Where Mia and Bruno are first drawn, so a later page with them in another place keeps their look. */
const PEOPLE: Partial<Record<Cast, string>> = { mia: "ankommen", bruno: "stuhl" };

/** The light of a page, said in every prompt. */
const LIGHT: Record<Light, string> = {
  morgen: "It is morning: fresh friendly daylight.",
  tag: "It is daytime, friendly daylight.",
  mittag: "It is the midday nap: the curtains are drawn and the room lies in soft dim light, everything still clearly seen.",
  abend: "It is evening: dusk outside the window, a lamp gives warm soft light.",
};

/** How many characters a cast name stands for, where it is more than one. */
const GROUP_SIZE: Partial<Record<Cast, number>> = { kinder: 2, gruppe: 4 };

/** Everyone in a page's picture, each described with what they wear there. */
function castOf(page: KitaPage): string {
  const who: Record<Cast, string> = {
    tapsi: `Tapsi, a small fox toddler with orange fur and a white muzzle, in ${page.picture.includes("pyjamas") ? "light-blue pyjamas with small yellow stars" : /Tapsi in a jacket/.test(page.picture) ? "a yellow rain jacket over a light-blue T-shirt and light-blue trousers" : "a light-blue T-shirt and light-blue trousers"}`,
    mama: `Mama, a grown-up fox woman with a small red flower behind one ear, in ${page.picture.includes("coat") ? "a red coat over a yellow sweater, and brown trousers" : "a yellow sweater and brown trousers"}`,
    papa: "Papa, a grown-up fox man with round glasses, in a green sweater and brown trousers",
    mia: "Mia, the daycare teacher, a grown-up bear woman with honey-brown fur and round ears, in a teal cardigan over a white shirt and dark-blue trousers, her hair-tuft held by a small yellow clip, with only a tiny round bear tail, never a long bushy one",
    bruno:
      "Bruno, Tapsi's friend, a small bear toddler as tall as Tapsi with dark-brown fur, in a red T-shirt and blue dungarees, with only a tiny round bear tail",
    kinder:
      "two more small toddlers of the daycare group, as tall as Tapsi: a little bear girl with light-brown fur in a green dress, and a little bear boy with grey-brown fur in an orange T-shirt",
    gruppe:
      "four more small toddlers of the daycare group, as tall as Tapsi, each with only a tiny round bear tail: a little bear girl with dark-brown fur in a pink dress, a little bear boy with honey-blond fur in a yellow T-shirt and green trousers, a little bear girl with reddish-brown fur in a purple dress, and a little bear boy with cream-coloured fur in a blue striped sweater",
  };
  const n = page.cast.reduce((sum, c) => sum + (GROUP_SIZE[c] ?? 1), 0);
  return `Exactly ${n === 1 ? "one character" : `${n} characters, each once`}: ${page.cast.map((c) => who[c]).join("; ")}. Nobody else: only ONE of each in the whole picture, nobody more in a doorway, on the furniture, behind the window or peeking in from an edge.`;
}

/** What the things that come back look like, so they stay the same from page to page. */
function thingsOf(page: KitaPage): string[] {
  const things: string[] = [];
  if (/plush bunny/.test(page.picture))
    things.push("The plush bunny is Tapsi's light-grey soft toy with long floppy ears, not a living rabbit; there is only one.");
  // On the first day's arrival Tapsi wore one backpack on the back and a second on the front (user feedback, 12
  // November 2026): say where a worn backpack sits.
  if (/backpack/.test(page.picture))
    things.push(
      "Tapsi's backpack is a small green toddler backpack with a fox face on its front pocket; there is only one. When Tapsi wears it, it sits on Tapsi's back with only its two straps over the shoulders – nothing on Tapsi's chest or tummy.",
    );
  if (/star sign/.test(page.picture)) things.push("Tapsi's hook is marked with a small round sign showing a yellow star.");
  return things;
}

/** Every page is full bleed (two first pictures of Tapsis Milchkette came back with a white rounded margin). */
const END =
  "Everyone's face shows plainly what they feel. The illustration fills the whole picture edge to edge (full bleed): no border, no frame, no white margin, no rounded corners, no vignette. No speech bubbles. No text, no letters, no numbers, also not on signs.";

/** Whether the picture a page is drawn from already shows a character – never for a place's first picture, drawn from the families. */
const refShows = (page: KitaPage, who: Cast) => {
  const first = PLACES[page.place].first;
  return !!first && first !== page.id && !!KITA_PAGES.find((p) => p.id === first)?.cast.includes(who);
};

/** The characters whose look comes from another page's picture than the place's (`PEOPLE`). */
const borrowed = (page: KitaPage) =>
  (Object.keys(PEOPLE) as Cast[]).filter((who) => page.cast.includes(who) && PEOPLE[who] !== page.id && !refShows(page, who));

/** How the characters are named where a prompt says who is not there. */
const NAMED: Record<Cast, string> = {
  tapsi: "Tapsi",
  mama: "Mama (the grown-up fox woman)",
  papa: "Papa (the grown-up fox man)",
  mia: "Mia (the grown-up bear)",
  bruno: "Bruno",
  kinder: "the other bear children",
  gruppe: "the rest of the bear group",
};

/**
 * Who the place's picture shows and this page leaves out, said plainly: told only that the reference's places are empty
 * now, Gemini still kept Mama on the play room's chair in four of fifteen pages (once as a second Tapsi on her lap,
 * once in Mia's clothes in Mia's place), and Bruno in Mia's arms where she comforts Tapsi alone.
 */
function absent(page: KitaPage): string {
  const first = PLACES[page.place].first;
  const shown = first && first !== page.id ? KITA_PAGES.find((p) => p.id === first)?.cast : undefined;
  const gone = (shown ?? []).filter((who) => !page.cast.includes(who));
  if (!gone.length) return "";
  const names = gone.map((who) => NAMED[who]);
  const list = names.length === 1 ? names[0] : `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;
  return `${list} ${names.length === 1 && !GROUP_SIZE[gone[0]] ? "is" : "are"} not in this picture at all: leave their places in the reference empty, and give nobody else their place or clothes.`;
}

/** The prompt of a page's picture, without the style block. */
function promptOf(page: KitaPage): string {
  const place = PLACES[page.place];
  const bears = page.cast.some(isBear);
  const parts =
    place.first === page.id
      ? [
          place.looks ?? "",
          `Draw the foxes like the fox family in the first reference picture: the same fur, faces and clothes.${bears ? " Draw the bears with faces and fur like the bear family in the second reference picture, but in the clothes said here." : ""}`,
        ]
      : [
          "Redraw this exact place from the first reference picture: keep it exactly as it is – the same walls, windows, furniture and objects at the same places, the same camera framing (no zoom, no shift), the same colours and line style. Only the characters, their poses, the things they hold and the light change, and who is there.",
          `In that reference picture ${place.was}: that was another moment. Draw each character only where this page says, and leave every other place empty – no second fox or bear, no fox tail left lying on the floor or the furniture.`,
          absent(page),
        ];
  const ORDINAL = ["first", "second", "third", "fourth"];
  const own = ownRefs(page).length;
  borrowed(page).forEach((who, i) => {
    parts.push(
      `Draw ${who === "mia" ? "Mia" : "Bruno"} exactly like in the ${ORDINAL[own + i]} reference picture: the same fur, face and clothes – take only ${who === "mia" ? "her" : "him"} from there, not that picture's place.`,
    );
  });
  parts.push(LIGHT[page.light], castOf(page), ...thingsOf(page), `Now this happens: ${page.picture}`, END);
  return parts.filter(Boolean).join(" ");
}

/** The place's own reference of a page: its place's first picture, or the families' pictures for that first picture. */
function ownRefs(page: KitaPage): string[] {
  const place = PLACES[page.place];
  if (place.first !== page.id) return [place.ref];
  return page.cast.some(isBear) ? [FAMILY, BEARS] : [FAMILY];
}

/** The pictures a page is drawn from: its place's own, then the pictures Mia and Bruno first came in (`PEOPLE`). */
const refsOf = (page: KitaPage) => [...ownRefs(page), ...borrowed(page).map((who) => pictureFile(PEOPLE[who] as string))];

/** The queue entry of a page's picture. */
export function kitaPicture(page: KitaPage): QueuedPicture {
  return {
    id: `kita-${page.id}`,
    file: pictureFile(page.id),
    use: `Kita-Start, „Tapsi geht in die Kita“: ${page.text}`,
    prompt: promptOf(page),
    aspect: "4:3",
    size: "1200x900",
    quality: 70,
    ref: refsOf(page),
    alone: "story picture",
    date: "2026-11-11",
  };
}

/** The pages whose pictures are made (`bilder/kita-<id>.webp`); the others wait in the queue. */
const MADE = new Set<string>([
  "erzaehlen",
  "anschauen",
  "packen",
  "ankommen",
  "haken",
  "stuhl",
  "entdecken",
  "ball",
  "heim",
  "sagen",
  "weinen",
  "wieder",
  "essen",
  "traurig",
  "zuhause",
  "pusten",
  "laenger",
  "toben",
  "weg",
  "schuhe",
  "kuss",
  "wann",
  "hand",
  "winken",
  "kreis",
  "spielen",
  "draussen",
  "mittag",
  "schlafen",
  "aufwachen",
  "da",
  "erzaehlt",
  "lieb",
]);

/** Every picture of the story still to make. */
export const KITA_PICTURE_QUEUE: QueuedPicture[] = KITA_PAGES.filter((p) => !MADE.has(p.id)).map(kitaPicture);
