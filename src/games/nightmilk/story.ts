import { recordedVoice } from "@/lib/voice";
import pictureFiles from "./bilder/*.webp?glob";
import voiceFiles from "./stimme/**/*.mp3?glob";

// What the book „Abstillen“ (`WeaningBook` in src/games/milkchain/MilkChainGame.tsx) needs to read this story: its
// pictures and Tapsi's voice. Kept here, since a `?glob` finds its files only relative to the importing file.

/** Tapsi's voice reading the pages, from `stimme/en/` (English first) and `stimme/<language>/`; a page not recorded yet stays silent. */
export const NIGHT_VOICE = recordedVoice(voiceFiles);

/** Each page's picture by its file name without extension (`nacht-<page id>`). */
const PICTURES = new Map(Object.entries(pictureFiles).map(([file, url]) => [file.replace(/\.webp$/, ""), url]));

/** A page's picture by its id, or nothing while it isn't made yet. */
export const nightPictureOf = (id: string) => PICTURES.get(`nacht-${id}`);
