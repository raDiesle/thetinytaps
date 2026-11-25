import { createContext, useContext } from "react";
import pictureFiles from "./bilder/*.webp?glob";
import { type CatalogMark, type NightLook, REWARD_BY_ID, STEP_BY_ID, TASK_BY_ID, type Theme } from "./catalog";
import { usePhotoUrl } from "./ChildPhoto";

// The pictures of bilder/ (made with Gemini, prompts in bilder/prompts.ts) in place of the catalogue's emoji: a task,
// a plan's step, a reward and a mark show their picture, a grey print the line-art twin to colour in. What grown-ups
// made themselves – their own task, or another emoji picked for a catalogue one – keeps its emoji, and their own photo
// of a task or card (T-13) stands before both.

const PICTURES = new Map(Object.entries(pictureFiles).map(([file, url]) => [file.replace(/\.webp$/, ""), url]));

/** A file of bilder/ by its name („fest“), if there is one. */
export const picture = (name: string) => PICTURES.get(name);

/** A board's task or reward, or a plan's step: an emoji, the catalogue entry it came from, and an own photo's key. */
interface Item {
  emoji: string;
  catalog?: string;
  photo?: string;
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

/**
 * True where pictures load only once they come near the screen: the small pictures of the Vorlagen (`Thumb`,
 * `PlanThumb`) and the picture chips under the folded „Weitere Einstellungen“ (`ChartEditor`), which alone fetched 45
 * files on every first visit while folded (user request, November 2026: load only what is seen). A chart itself, and
 * every print, loads its pictures at once, so a print never misses one.
 */
export const LazyPictures = createContext(false);

/** A picture where there is one, else the emoji; as big as the emoji was (1em of where it sits, a little more). */
export function Pic({ src, emoji }: { src: string | undefined; emoji: string }) {
  const thumb = useContext(LazyPictures);
  return src ? (
    <img className="rw-pic" src={src} alt="" draggable={false} loading={thumb ? "lazy" : undefined} decoding={thumb ? "async" : undefined} />
  ) : (
    emoji
  );
}

/**
 * A task's, step's or reward's picture, or its emoji – or the grown-up's own photo of it (T-13), read from this
 * device's photo store: a square cut of its middle, grey on a grey print. While it is read its place stays empty (no
 * emoji flashing up first); where it is no longer on this device the picture or emoji stands in for it.
 */
export function ItemPic({ item, kind = "task", lines = false }: { item: Item; kind?: "task" | "reward"; lines?: boolean }) {
  const photo = usePhotoUrl(item.photo);
  if (photo) return <img className="rw-pic rw-item-photo" src={photo} alt="" draggable={false} />;
  if (photo === undefined) return <span className="rw-pic rw-item-photo" />;
  return <Pic src={itemPicture(item, kind, lines)} emoji={item.emoji} />;
}

/** A colour print's strip of pictures along the top, in the board's or plan's theme. */
export function SheetStrip({ theme }: { theme: Theme }) {
  const src = PICTURES.get(`streifen-${theme.id}`);
  const thumb = useContext(LazyPictures);
  return src ? <img className="rw-strip" src={src} alt="" loading={thumb ? "lazy" : undefined} /> : null;
}

/** A mark's sticker, or its emoji. */
export function MarkPic({ mark }: { mark: CatalogMark }) {
  return <Pic src={markPicture(mark)} emoji={mark.emoji} />;
}

/**
 * A Countdown's night (`NIGHT_LOOKS`): the fox child's is the Tagesplan's „Schlafen“, the others `nacht-<id>`; `lines`
 * its twin to colour in. Its emoji until the picture is made.
 */
export function NightPic({ look, lines = false }: { look: NightLook; lines?: boolean }) {
  const name = look.id === "fuchs" ? "schritt-schlafen" : `nacht-${look.id}`;
  return <Pic src={PICTURES.get(`${name}${lines ? "-linie" : ""}`)} emoji={look.emoji} />;
}
