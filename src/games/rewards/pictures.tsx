import pictureFiles from "./bilder/*.webp?glob";
import { type CatalogMark, REWARD_BY_ID, STEP_BY_ID, TASK_BY_ID, type Theme } from "./catalog";

// The pictures of bilder/ (made with Gemini, prompts in bilder/prompts.ts) in place of the catalogue's emoji: a task,
// a plan's step, a reward and a mark show their picture, a grey print the line-art twin to colour in. What grown-ups
// made themselves – their own task, or another emoji picked for a catalogue one – keeps its emoji.

const PICTURES = new Map(Object.entries(pictureFiles).map(([file, url]) => [file.replace(/\.webp$/, ""), url]));

/** A file of bilder/ by its name („fest“), if there is one. */
export const picture = (name: string) => PICTURES.get(name);

/** A board's task or reward, or a plan's step: an emoji, and the catalogue entry it came from. */
interface Item {
  emoji: string;
  catalog?: string;
}

/**
 * The picture of a task or plan step (`"task"`) or a reward, while its emoji is still the catalogue's; `lines`: its
 * twin to colour in, for grey prints.
 */
export function itemPicture(item: Item, kind: "task" | "reward", lines = false): string | undefined {
  if (!item.catalog) return undefined;
  const entry = kind === "reward" ? REWARD_BY_ID.get(item.catalog) : STEP_BY_ID.get(item.catalog);
  if (entry?.emoji !== item.emoji) return undefined;
  const prefix = kind === "reward" ? "belohnung" : TASK_BY_ID.has(item.catalog) ? "aufgabe" : "schritt";
  return PICTURES.get(`${prefix}-${item.catalog}${lines ? "-linie" : ""}`);
}

/** The sticker of a mark (star, heart …). */
export const markPicture = (mark: CatalogMark) => PICTURES.get(`zeichen-${mark.id}`);

/** A picture where there is one, else the emoji; as big as the emoji was (1em of where it sits, a little more). */
export function Pic({ src, emoji }: { src: string | undefined; emoji: string }) {
  return src ? <img className="rw-pic" src={src} alt="" draggable={false} /> : emoji;
}

/** A task's, step's or reward's picture, or its emoji. */
export function ItemPic({ item, kind = "task", lines = false }: { item: Item; kind?: "task" | "reward"; lines?: boolean }) {
  return <Pic src={itemPicture(item, kind, lines)} emoji={item.emoji} />;
}

/** A colour print's strip of pictures along the top, in the board's or plan's theme. */
export function SheetStrip({ theme }: { theme: Theme }) {
  const src = PICTURES.get(`streifen-${theme.id}`);
  return src ? <img className="rw-strip" src={src} alt="" /> : null;
}

/** A mark's sticker, or its emoji. */
export function MarkPic({ mark }: { mark: CatalogMark }) {
  return <Pic src={markPicture(mark)} emoji={mark.emoji} />;
}
