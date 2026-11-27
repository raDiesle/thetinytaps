import { pictureFolder } from "@/lib/pictureFolder";
import symbolFiles from "./bilder/symbole/*.webp?glob";

// The small pictures on the strip (user request, November 2026: the strip should look nicer), each marking a phase of
// the routine (user feedback, November 2026: a sweet at the start and a tooth at the end said nothing of what each part
// is): a sweet on eating sweets (a honey bread in the morning, when the story eats breakfast, X-19), a toothpaste tube on getting the brush ready, the toothbrush riding along the brushing's
// frame to a shining clean tooth, and the brush back in its cup on putting it away. Painted with Gemini as one set with
// Aufs Töpfchen's (`src/games/potty/symbolPictures.ts`; all five made by 23 November 2026). The strip never shows an
// emoji instead (`CLAUDE.md`): a picture not made yet leaves its place empty, or shows a drawn stand-in (`BarSymbol`).

const symbols = pictureFolder(symbolFiles);

/** The names of the strip's pictures, their files in `bilder/symbole/`. */
export type TeethSymbol = "bonbon" | "fruehstueck" | "zahnpasta" | "zahnbuerste" | "zahn" | "becher";

/** Every picture the strip shows, so a check can find each one's file or its place in the queue. */
export const TEETH_SYMBOLS: TeethSymbol[] = ["bonbon", "fruehstueck", "zahnpasta", "zahnbuerste", "zahn", "becher"];

/** The url of one of the strip's pictures, or undefined while it is not made yet. */
export const teethSymbol = (name: TeethSymbol) => symbols.image(name);
