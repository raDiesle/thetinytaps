import type { QueuedPicture } from "@/content/pictureQueue";
import { CHILDMINDER_PAGES, type Cast, type ChildminderPage, type Light, type Place } from "./childminder";

// The pictures of „Tapsi Goes to Lotta's“ (`childminder.ts`), as the picture queue takes them until they are made
// (`/bild-erzeugen`, made in a Claude cloud session: Zscaler blocks Gemini on the Mac). Tapsi's home is the one of the
// other chapter books: the living room and Tapsi's room are drawn from the same pictures as „Tapsi geht in die Kita“'s.
// Lotta's places – the street in front of her apartment house, her hallway, her living room made into a play room, her
// kitchen, the playground nearby and her nap room – are each drawn once (`first`, from the fox and the bear family) and
// every other page there from that picture; the queue holds those pages back until it is made. Lotta and Emil keep
// their look from the page they first came in (`PEOPLE`), added as a further reference where the place's picture doesn't
// show them. Plain data, no picture imports. A made picture goes on `MADE`, so it leaves the queue; the prompts stay here.
// The lessons of Kita-Start's pictures (`src/games/kitastory/CLAUDE.md`) are built in: who of the reference is not there
// (`absent`), a moved character says where it is not, things named by their colour, bears with a tiny round tail.

const DIR = "src/games/childminder/bilder";

/** The picture of a page. */
export const pictureFile = (id: string) => `${DIR}/tm-${id}.webp`;

/** The fox family as the app draws it: Papa with glasses in green, Mama with a flower in yellow, the child in light blue. */
const FAMILY = "src/components/bilder/buch-fuechse.webp";

/** The bear family as the app draws it, for the look of the bears' faces and fur in the first pictures at Lotta's. */
const BEARS = "src/components/bilder/buch-baeren.webp";

/**
 * The picture every page of a place is drawn from, and who was where in it: a page drawn from it keeps them there unless
 * told that those places are empty now. A place with `first` is drawn on that page from the families' pictures, as
 * `looks` describes it.
 */
export const PLACES: Record<Place, { ref: string; was: string; first?: string; looks?: string }> = {
  wohnzimmer: {
    ref: "src/games/milkchain/bilder/kette-fragen-nicht.webp",
    was: "Tapsi plays with blocks on the rug and Mama sits on the green sofa with a cup – the blocks and the cup are gone now",
  },
  kinderzimmer: {
    ref: "src/games/pacifierstory/bilder/fee-drei.webp",
    was: "Tapsi sits on the bed holding up three pacifiers – the pacifiers are gone now, there is no pacifier anywhere",
  },
  strasse: {
    ref: pictureFile("heim"),
    was: "Mama and Tapsi walk along the pavement",
    first: "heim",
    looks:
      "A quiet street in a German town, seen from across the road at a child's eye height: a friendly old four-storey apartment house with cream walls, white window frames and small balconies with flowers; its green front door with three steps up in the middle; on the ground floor left of the door a big kitchen window with a white frame, a plant on its sill; a wide pavement in front with a small tree in a round patch of earth and a bicycle on a stand; nothing of a daycare centre – no playground, no fence, no signs.",
  },
  flur: {
    ref: pictureFile("besuch"),
    was: "Papa and Tapsi stand hand in hand on the doormat and Lotta kneels in front of them",
    first: "besuch",
    looks:
      "The small hallway of a childminder's ground-floor flat in an old apartment house, seen from inside at a child's eye height: on the left the flat's wooden front door standing wide open onto a bright stairwell, a doormat with a big flower in front of it; along the right wall a low row of five coat hooks at a child's height, above each a small round picture sign (a red ladybug, a sun, a fish, a flower, a car), a low shoe rack with small shoes and a little wooden bench under them; higher up a coat stand with two grown-up coats, a framed family photo and a plant; at the back an open doorway into a bright living room with toys. Homely, plainly a family's flat and not a daycare centre.",
  },
  spielzimmer: {
    ref: pictureFile("sofa"),
    was: "Mama sits on the blue sofa with Tapsi on her lap, Lotta sits on the play rug, Emil plays with the train, the baby sits with a block and the bigger girl looks at a book",
    first: "sofa",
    looks:
      "The living room of a childminder's flat, made into a cosy play room for a few small children, seen from the front: on the left a big soft blue sofa with cushions; in the middle a round play rug with a wooden toy train track and a few wooden blocks; on the right a low open shelf with toy boxes, picture books and a doll; a small wooden play kitchen in the corner; a big window with plants and light curtains at the back. Homely, a family's living room, not a daycare centre.",
  },
  kueche: {
    ref: pictureFile("essen"),
    was: "Tapsi, Emil and the bigger girl sit at the table with apple, the baby in the high chair, Lotta beside Tapsi and Mama at the far end",
    first: "essen",
    looks:
      "The big family kitchen of a childminder's ground-floor flat, seen from the front: in the middle one long wooden kitchen table with four small children's chairs and a grown-up's chair, and a wooden high chair at its end; on the left behind it a big low window with a white frame looking out onto a quiet pavement and street; on the right the kitchen counter with a stove and a pot, a fridge with children's drawings stuck on it, colourful plastic plates and cups on an open shelf.",
  },
  spielplatz: {
    ref: pictureFile("wagen"),
    was: "Lotta pulls the red handcart with the baby in it, Tapsi and Emil walk beside it and the bigger girl holds Lotta's hand",
    first: "wagen",
    looks:
      "A small public playground near the flat, on a sunny day: a path in front, a sandpit with a wooden edge and buckets and shovels in it, a small slide, a swing, a bench, a big tree and bushes, a low fence round it, apartment houses with balconies behind it; on the path a red wooden handcart (a pull wagon) with high sides and a long black handle.",
  },
  schlafzimmer: {
    ref: pictureFile("schlafen"),
    was: "Tapsi lies in the nearest bed and Lotta sits on the chair beside it",
    first: "schlafen",
    looks:
      "A small quiet bedroom in the childminder's flat, made into the children's nap room: three low wooden children's beds with soft blankets side by side, a small wooden chair beside the nearest bed, a window with thick curtains drawn, a little night light shaped like a moon on a shelf.",
  },
};

/** Whether a character is one of the bears at Lotta's. */
const isBear = (c: Cast) => c === "lotta" || c === "emil" || c === "kinder";

/** Where Lotta and Emil are first drawn, so a later page with them in another place keeps their look. */
export const PEOPLE: Partial<Record<Cast, string>> = { lotta: "besuch", emil: "sofa" };

/** The light of a page, said in every prompt. */
const LIGHT: Record<Light, string> = {
  morgen: "It is morning: fresh friendly daylight.",
  tag: "It is daytime, friendly daylight.",
  mittag: "It is midday: soft light; in the nap room the curtains are drawn and it lies in soft dim light, everything still clearly seen.",
  abend: "It is evening: dusk outside the window, a lamp gives warm soft light.",
};

/** How many characters a cast name stands for, where it is more than one. */
const GROUP_SIZE: Partial<Record<Cast, number>> = { kinder: 2 };

/** Everyone in a page's picture, each described with what they wear there. */
function castOf(page: ChildminderPage): string {
  const who: Record<Cast, string> = {
    tapsi: `Tapsi, a small fox toddler with orange fur and a white muzzle, in ${page.picture.includes("pyjamas") ? "light-blue pyjamas with small yellow stars" : /Tapsi in a jacket/.test(page.picture) ? "a yellow rain jacket over a light-blue T-shirt and light-blue trousers" : "a light-blue T-shirt and light-blue trousers"}`,
    // Kneeling where Lotta knelt in the hall's reference, Mama came back as a bear (tm-haken).
    mama: `Mama, a grown-up fox woman with orange fur and a white muzzle like Tapsi's (a fox, never a bear, never brown fur), with a small red flower behind one ear, in ${page.picture.includes("coat") ? "a red coat over a yellow sweater, and brown trousers" : "a yellow sweater and brown trousers"}`,
    papa: "Papa, a grown-up fox man with round glasses, in a green sweater and brown trousers",
    lotta:
      "Lotta, the childminder, a grown-up bear woman with warm chestnut-brown fur and round ears, in a mustard-yellow knitted cardigan over a white-and-red striped shirt and dark-green trousers, a red scarf tied in her hair-tuft, with only a tiny round bear tail, never a long bushy one; she wears this cardigan and scarf on every page, never a plain shirt or dress (tm-hand lost them once)",
    emil: "Emil, Tapsi's friend, a small bear toddler as tall as Tapsi with sandy-blond fur, in a teal T-shirt and red dungarees, with only a tiny round bear tail",
    kinder:
      "two more small children Lotta looks after, each with only a tiny round bear tail: a bear baby with cream-coloured fur in a pale-green romper, smaller than Tapsi, and a bigger bear girl a head taller than Tapsi with dark-brown fur in a lilac dress",
  };
  const n = page.cast.reduce((sum, c) => sum + (GROUP_SIZE[c] ?? 1), 0);
  return `Exactly ${n === 1 ? "one character" : `${n} characters, each once`}: ${page.cast.map((c) => who[c]).join("; ")}. Nobody else: only ONE of each in the whole picture, nobody more in a doorway, on the furniture, behind the window or peeking in from an edge.`;
}

/** What the things that come back look like, so they stay the same from page to page – each at one place only. */
function thingsOf(page: ChildminderPage): string[] {
  const things: string[] = [];
  if (/plush bunny/.test(page.picture))
    things.push("The plush bunny is Tapsi's light-grey soft toy with long floppy ears, not a living rabbit; there is only one.");
  if (/backpack/.test(page.picture))
    things.push(
      "Tapsi's backpack is a small green toddler backpack with a fox face on its front pocket; there is only one. When Tapsi wears it, it sits on Tapsi's back with only its two straps over the shoulders – nothing on Tapsi's chest or tummy.",
    );
  if (/ladybug sign/.test(page.picture)) things.push("Tapsi's hook is marked with a small round sign showing a red ladybug.");
  if (/rain jacket/.test(page.picture) && !/Tapsi in a jacket/.test(page.picture))
    things.push("There is only one yellow rain jacket, on its hook: Tapsi wears none.");
  if (/handcart/.test(page.picture)) things.push("The handcart is one red wooden pull wagon with high sides and a long black handle; there is only one.");
  if (/high chair/.test(page.picture)) things.push("There is one wooden high chair, at the end of the table.");
  return things;
}

/** Every page is full bleed (two first pictures of Tapsis Milchkette came back with a white rounded margin). */
const END =
  "Everyone's face shows plainly what they feel, friendly and warm. The illustration fills the whole picture edge to edge (full bleed): no border, no frame, no white margin, no rounded corners, no vignette. No speech bubbles. No text, no letters, no numbers, also not on signs or doors.";

/**
 * Pages drawn from another page of their place than its first, and who was where in that one: drawn from „besuch“, where
 * Papa stands on the doormat and Lotta kneels, the slipper page came back with Mama as a bear, then with Papa, then
 * with two Mamas – „kuss“ already has Mama kneeling with Tapsi in the hall.
 */
const DRAWN_FROM: Partial<Record<string, { page: string; was: string }>> = {
  haken: { page: "kuss", was: "Mama in her coat kneels on the floor of the hall and hugs Tapsi" },
};

/** The page a place's reference picture is, if it is one of this story's. */
const refPage = (page: ChildminderPage) => {
  const first = DRAWN_FROM[page.id]?.page ?? PLACES[page.place].first;
  return first && first !== page.id ? CHILDMINDER_PAGES.find((p) => p.id === first) : undefined;
};

/** The characters whose look comes from another page's picture than the place's (`PEOPLE`). */
const borrowed = (page: ChildminderPage) =>
  (Object.keys(PEOPLE) as Cast[]).filter((who) => page.cast.includes(who) && PEOPLE[who] !== page.id && !refPage(page)?.cast.includes(who));

/** How the characters are named where a prompt says who is not there. */
const NAMED: Record<Cast, string> = {
  tapsi: "Tapsi",
  // Named only as „the grown-up fox woman“, Mama's legs and tail stayed at the kitchen table's end (tm-mittag).
  mama: "Mama (the grown-up fox woman with a red flower behind one ear, in a yellow sweater and brown trousers)",
  // Named only as „the grown-up fox man“, Papa stayed standing on the hall's doormat of the reference (tm-haken).
  papa: "Papa (the grown-up fox man with round glasses and a green sweater)",
  lotta: "Lotta (the grown-up bear)",
  emil: "Emil",
  kinder: "the bear baby and the bigger bear girl",
};

/**
 * Who the place's story picture shows and this page leaves out, said plainly (Kita-Start: told only that the
 * reference's places are empty, Gemini kept Mama on the play room's chair in four of fifteen pages).
 */
function absent(page: ChildminderPage): string {
  const gone = (refPage(page)?.cast ?? []).filter((who) => !page.cast.includes(who));
  if (!gone.length) return "";
  const names = gone.map((who) => NAMED[who]);
  const list = names.length === 1 ? names[0] : `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;
  return `${list} ${names.length === 1 && !GROUP_SIZE[gone[0]] ? "is" : "are"} not in this picture at all: leave their places in the reference empty, and give nobody else their place or clothes.`;
}

/** The place's own reference of a page: its place's first picture, or the families' pictures for that first picture. */
function ownRefs(page: ChildminderPage): string[] {
  const place = PLACES[page.place];
  const from = DRAWN_FROM[page.id];
  if (from) return [pictureFile(from.page)];
  if (place.first !== page.id) return [place.ref];
  return page.cast.some(isBear) ? [FAMILY, BEARS] : [FAMILY];
}

/** The pictures a page is drawn from: its place's own, then the pictures Lotta and Emil first came in (`PEOPLE`). */
const refsOf = (page: ChildminderPage) => [...ownRefs(page), ...borrowed(page).map((who) => pictureFile(PEOPLE[who] as string))];

/** The prompt of a page's picture, without the style block. */
export function promptOf(page: ChildminderPage): string {
  const place = PLACES[page.place];
  const bears = page.cast.some(isBear);
  const parts =
    place.first === page.id
      ? [
          place.looks ?? "",
          `Draw the foxes like the fox family in the first reference picture: the same fur and faces, in the clothes said here.${bears ? " Draw the bears with faces and fur like the bear family in the second reference picture, but in the clothes said here." : ""}`,
        ]
      : [
          "Redraw this exact place from the first reference picture: keep it exactly as it is – the same walls, windows, furniture and objects at the same places, the same camera framing (no zoom, no shift), the same colours and line style. Only the characters, their poses, the things they hold and the light change, and who is there.",
          `In that reference picture ${DRAWN_FROM[page.id]?.was ?? place.was}: that was another moment. Draw each character only where this page says, and leave every other place empty – where someone was in the reference and this page puts them elsewhere, that spot is empty now (Lotta once came back twice, kneeling as in the reference and in the doorway): no second fox or bear, no fox tail left lying on the floor or the furniture.`,
          absent(page),
        ];
  const ORDINAL = ["first", "second", "third", "fourth"];
  const own = ownRefs(page).length;
  borrowed(page).forEach((who, i) => {
    parts.push(
      `Draw ${who === "lotta" ? "Lotta" : "Emil"} exactly like in the ${ORDINAL[own + i]} reference picture: the same fur, face and clothes – take only ${who === "lotta" ? "her" : "him"} from there, not that picture's place.`,
    );
  });
  parts.push(LIGHT[page.light], castOf(page), ...thingsOf(page), `Now this happens: ${page.picture}`, END);
  return parts.filter(Boolean).join(" ");
}

/**
 * What is left once the pictures are made: the story then plays for players too (`ChapterBook` leaves out pages without
 * a picture, and the book's choice a story without one, only until then).
 */
const AFTER =
  "Look at every picture: count the characters (only the page's cast, each once, „kinder“ are two: the baby and the bigger girl; no stray tail, bears with a tiny round tail) and look at every face; Lotta's flat is plainly a family's flat, never a daycare centre; one handcart, one high chair, one backpack, one yellow jacket; each place the same on every page drawn from it; the waving page is seen from inside with Mama small outside. Once all twenty-eight pages are made: add each id to MADE in src/games/childminder/childminderPictures.ts; take /kita/tagesmutter/ and /kita/tagesmutter/kurz/ out of WAITING_PATHS in src/content/seo.ts; name the second story in the search texts of /kita/ (seo.ts and its six seo.<language>.ts) and in KITA_STORY_BLURB of src/games/kitastory/names.ts, in all seven languages; mark it published in the language row's note (languageStatus.ts) and in src/games/childminder/CLAUDE.md; look at the book's choice of stories in the built site at 844×390 and 1024×768.";

/** The queue entry of a page's picture. */
export function childminderPicture(page: ChildminderPage): QueuedPicture {
  return {
    id: `tm-${page.id}`,
    file: pictureFile(page.id),
    use: `Kita-Start, „Tapsi Goes to Lotta's“ (/kita/tagesmutter/): ${page.text}`,
    prompt: promptOf(page),
    aspect: "4:3",
    size: "1200x900",
    quality: 70,
    ref: refsOf(page),
    alone: "story picture",
    date: "2026-11-23",
    after: AFTER,
  };
}

/** The pages whose pictures are made (`bilder/tm-<id>.webp`); the others wait in the queue. */
const MADE = new Set<string>([
  "ankommen",
  "aufwachen",
  "besuch",
  "da",
  "erzaehlen",
  "erzaehlt",
  "essen",
  "hand",
  "heim",
  "kuss",
  "laenger",
  "lieb",
  "packen",
  "sagen",
  "sand",
  "schlafen",
  "sofa",
  "traurig",
  "wagen",
  "wann",
  "weg",
  "weinen",
  "wieder",
  "winken",
  "zug",
  "zuhause",
]);

/** Every picture of the story still to make. */
export const CHILDMINDER_PICTURE_QUEUE: QueuedPicture[] = CHILDMINDER_PAGES.filter((p) => !MADE.has(p.id)).map(childminderPicture);
