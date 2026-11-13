// Every picture of the app on one page for grown-ups (/management/bilder/, user request, November 2026): to look
// through them all at once without playing each game to its scene. The pictures are found by their folders, and what
// belongs together is read from their names – the conventions the games and `/bild-erzeugen` already follow:
// `x-b.webp` is the second frame fading over `x.webp`, `x-linie.webp` the Belohnungstafel's line drawing of `x`,
// `x-grund` / `x-anders` what happened and what didn't in „Was ist passiert?“, `x-1` / `x-2` before and after in the
// games that paint two numbered frames, and `teile/x.webp` the painted partner of pair `x` in „Was gehört zusammen?“.

import componentPictures from "../components/bilder/*.webp?glob";
import componentPreviews from "../components/vorschau/*.webp?glob";
import gamePictures from "../games/*/bilder/**/*.webp?glob";
import gamePreviews from "../games/*/vorschau/*.webp?glob";

/** One picture file. */
export interface GalleryPicture {
  /** Where it lies, from the repository's root: „src/games/feelings/bilder/angry-1.webp“. */
  path: string;
  /** Its bundled address. */
  url: string;
  /** The folder of `src/games/` it belongs to, or „components“ for the menus' and the shelf's own pictures. */
  source: string;
  /** Painted for the game itself, a menu's preview cut, or a part laid onto a picture. */
  kind: PictureKind;
  /** The file's name without folder and „.webp“. */
  stem: string;
}

/** What a picture is for, by its folder. */
export type PictureKind = "bilder" | "vorschau" | "teile";

/** One picture of a set with what it is there: „2. Frame“, „Linie“. */
export interface SetMember {
  picture: GalleryPicture;
  role: string;
  /** A frame that fades over the set's first picture while the game shows it. */
  frame: boolean;
}

/** Pictures that belong together: one picture with its frames and variants. */
export interface PictureSet {
  /** The shared part of the names: „angry-1“. */
  base: string;
  members: SetMember[];
}

/** The sets of one story or topic, by the first word their names share. */
export interface PictureStory {
  /** „angry“, or „“ for the pictures standing on their own. */
  key: string;
  sets: PictureSet[];
}

/** All pictures of one source and kind. */
export interface PictureShelf {
  source: string;
  kind: PictureKind;
  stories: PictureStory[];
  count: number;
}

/** A source's name on the page and the games that show its pictures. */
export interface PictureSource {
  title: string;
  /** The games' addresses, so a picture can be checked where it is used. */
  hrefs: string[];
  /** The source's own numbered frames: `x-1` and `x-2` are before and after of one scene, not two steps of a story. */
  numberedFrames?: boolean;
}

/**
 * The folders with pictures, in the order the shelf shows their books. A new folder with pictures gets its line here
 * (`pictureGallery.test.ts` checks).
 */
export const PICTURE_SOURCES: Record<string, PictureSource> = {
  components: { title: "Regal, Buchdeckel und Menüs", hrefs: ["/"] },
  timer: { title: "Timer", hrefs: ["/timer/"] },
  milkchain: { title: "Abstillen", hrefs: ["/abstillen/"] },
  pacifierstory: { title: "Schnullerfee", hrefs: ["/schnullerfee/"] },
  kitastory: { title: "Kita-Start", hrefs: ["/kita/"] },
  hairstory: { title: "Haare waschen", hrefs: ["/haare-waschen/"] },
  teeth: { title: "Zähne putzen", hrefs: ["/zaehne/"] },
  potty: { title: "Aufs Töpfchen", hrefs: ["/toepfchen/"] },
  rewards: { title: "Belohnungstafel, Zeitplan und Wie lange warten?", hrefs: ["/belohnungstafel/", "/tagesplan/", "/wie-lange-warten/"] },
  scenes: { title: "Lebendige Bilder", hrefs: ["/bilder/"] },
  marbles: { title: "Kettenreaktion", hrefs: ["/kettenreaktion/"] },
  elevator: { title: "Kleine Abenteuer", hrefs: ["/kleine-abenteuer/"] },
  adventure: { title: "Bewegungsabenteuer", hrefs: ["/abenteuer/"] },
  feelings: { title: "Gefühle", hrefs: ["/gefuehle/"] },
  cause: { title: "Was ist passiert?", hrefs: ["/was-ist-passiert/"] },
  animals: { title: "Was gehört zum Tier?", hrefs: ["/tiere/"] },
  together: { title: "Was gehört zusammen?", hrefs: ["/zusammen/"], numberedFrames: true },
  shadows: { title: "Schatten finden", hrefs: ["/schatten/"] },
  socks: { title: "Socken-Paare", hrefs: ["/socken/"] },
  letters: { title: "Buchstaben & Zahlen, Mitmachen", hrefs: ["/buchstaben/", "/mitmachen/"], numberedFrames: true },
};

/** How each kind is named on the page. */
export const KIND_TITLES: Record<PictureKind, string> = {
  bilder: "Bilder im Spiel",
  vorschau: "Vorschau in den Menüs",
  teile: "Teile, die auf ein Bild gelegt werden",
};

/** Endings that make a picture part of another one's set, with the part's name, when that other picture exists. */
const VARIANTS: { suffix: string; role: string; frame?: boolean }[] = [
  { suffix: "-b", role: "2. Frame", frame: true },
  { suffix: "-c", role: "3. Frame", frame: true },
  { suffix: "-linie", role: "Linie zum Ausmalen" },
  { suffix: "-grund", role: "Was passiert ist" },
  { suffix: "-anders", role: "Was nicht passiert ist" },
];

/** Every picture file of the app, found by its folder. */
export function allPictures(): GalleryPicture[] {
  const found: GalleryPicture[] = [];
  const add = (files: Readonly<Record<string, string>>, folder: string) => {
    for (const [below, url] of Object.entries(files)) {
      const path = `${folder}/${below}`;
      const parts = path.split("/");
      const source = parts[1] === "components" ? "components" : parts[2];
      const kind: PictureKind = parts.includes("teile") ? "teile" : parts.includes("vorschau") ? "vorschau" : "bilder";
      found.push({ path, url, source, kind, stem: (parts.at(-1) as string).replace(/\.webp$/, "") });
    }
  };
  add(componentPictures, "src/components/bilder");
  add(componentPreviews, "src/components/vorschau");
  add(gamePictures, "src/games");
  add(gamePreviews, "src/games");
  return found.sort((a, b) => a.path.localeCompare(b.path));
}

/** Joins pictures whose names say they belong together into sets, first picture first. */
export function setsOf(pictures: GalleryPicture[], numberedFrames = false): PictureSet[] {
  const byStem = new Map(pictures.map((p) => [p.stem, p]));
  const sets = new Map<string, PictureSet>();
  const setFor = (base: string) => {
    const set = sets.get(base) ?? { base, members: [] };
    sets.set(base, set);
    return set;
  };
  for (const picture of pictures) {
    const variant = VARIANTS.find(({ suffix }) => picture.stem.endsWith(suffix) && byStem.has(picture.stem.slice(0, -suffix.length)));
    const numbered = numberedFrames && picture.stem.match(/^(.+)-([12])$/);
    if (variant) {
      setFor(picture.stem.slice(0, -variant.suffix.length)).members.push({ picture, role: variant.role, frame: !!variant.frame });
    } else if (numbered && byStem.has(`${numbered[1]}-${numbered[2] === "1" ? "2" : "1"}`)) {
      setFor(numbered[1]).members.push({ picture, role: numbered[2] === "1" ? "Vorher" : "Nachher", frame: numbered[2] === "2" });
    } else {
      setFor(picture.stem).members.push({ picture, role: "", frame: false });
    }
  }
  const rank = (m: SetMember) => (m.role === "" || m.role === "Vorher" ? 0 : m.frame ? 1 : 2);
  return [...sets.values()].map((set) => ({ ...set, members: set.members.sort((a, b) => rank(a) - rank(b) || a.picture.stem.localeCompare(b.picture.stem)) }));
}

/**
 * Sets grouped by the first word of their names (the story „angry“, the steps „schritt“), leaving out a word all of
 * them share („kette-“, „fee-“, „fox-“); a word only one set has goes with the pictures standing on their own, last.
 */
export function storiesOf(sets: PictureSet[]): PictureStory[] {
  const words = sets.map((set) => set.base.split("-"));
  let skip = 0;
  while (words.length > 1 && words.every((w) => w.length > skip + 1 && w[skip] === words[0][skip])) skip++;
  const groups = new Map<string, PictureSet[]>();
  sets.forEach((set, i) => {
    const key = words[i][skip] ?? set.base;
    groups.set(key, [...(groups.get(key) ?? []), set]);
  });
  const stories: PictureStory[] = [];
  const alone: PictureSet[] = [];
  for (const [key, group] of groups) {
    if (group.length > 1) stories.push({ key, sets: group });
    else alone.push(...group);
  }
  if (alone.length > 0) stories.push({ key: "", sets: alone });
  return stories;
}

/** A source's parts in the source's order, the game's own pictures before its previews and parts. */
export function shelvesOf(pictures: GalleryPicture[]): PictureShelf[] {
  const order = Object.keys(PICTURE_SOURCES);
  const kinds: PictureKind[] = ["bilder", "teile", "vorschau"];
  const shelves: PictureShelf[] = [];
  for (const source of [...new Set(pictures.map((p) => p.source))].sort((a, b) => order.indexOf(a) - order.indexOf(b))) {
    for (const kind of kinds) {
      const these = pictures.filter((p) => p.source === source && p.kind === kind);
      if (these.length === 0) continue;
      shelves.push({ source, kind, count: these.length, stories: storiesOf(setsOf(these, PICTURE_SOURCES[source]?.numberedFrames)) });
    }
  }
  return shelves;
}
