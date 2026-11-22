import { byLanguage } from "@/content/texts";
import { recordedVoice } from "@/lib/voice";
import pictureFiles from "./bilder/*.webp?glob";
import voiceFiles from "./stimme/**/*.mp3?glob";

// What the book „Abstillen“ (`WeaningBook` in src/games/milkchain/MilkChainGame.tsx) needs to read this story: its
// pictures, its translations and Tapsi's voice. Kept here, since a `?glob` finds its files only relative to the importing file.

/** Tapsi's voice reading the pages, from `stimme/en/` (English first) and `stimme/<language>/`; a page not recorded yet stays silent. */
export const GOODBYE_VOICE = recordedVoice(voiceFiles);

/** Each page's picture by its file name without extension (`fest-<page id>`). */
const PICTURES = new Map(Object.entries(pictureFiles).map(([file, url]) => [file.replace(/\.webp$/, ""), url]));

/** A page's picture by its id, or nothing while it isn't made yet. */
export const goodbyePictureOf = (id: string) => PICTURES.get(`fest-${id}`);

/** The story in the other languages, German too, by language, as each language's texts load (`texts-<id>.ts`). */
export const GOODBYE_TRANSLATIONS = byLanguage((texts) => texts.goodbyeMilk);
