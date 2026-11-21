import { pictureFolder } from "@/lib/pictureFolder";
import symbolFiles from "./bilder/symbole/*.webp?glob";

// The small pictures on the strip at the bottom (user request, November 2026: the strip should look nicer): a sweet at
// the start of the bar, where the story of the sweets comes first, the toothbrush riding along it to show how far the
// brushing is, and a shining clean tooth at its end, the goal. Painted with Gemini as one set with Aufs Töpfchen's
// (`src/games/potty/symbolPictures.ts`). The strip never shows an emoji instead (`CLAUDE.md`): until a picture is made,
// its place stays empty.

const symbols = pictureFolder(symbolFiles);

/** The url of one of the strip's pictures, or undefined while it is not made yet. */
export const teethSymbol = (name: "bonbon" | "zahnbuerste" | "zahn") => symbols.image(name);
