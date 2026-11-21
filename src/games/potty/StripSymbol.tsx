import { pictureFolder } from "@/lib/pictureFolder";
import symbolFiles from "./bilder/symbole/*.webp?glob";

// The small pictures of the grown-ups' strip at the bottom – the row of steps and the buttons of the two choices –
// painted with Gemini as one set (`bilder/symbole/`, `symbolPictures.ts`): the emoji there looked poor (user request,
// November 2026). Each symbol keeps an emoji only for as long as its picture is not made yet.

const symbols = pictureFolder(symbolFiles);

/** The symbols there are, with the emoji shown while a picture is still missing. */
export const SYMBOL_EMOJI = {
  essen: "🍝",
  pipi: "💧",
  kaka: "💩",
  rufen: "📣",
  bad: "🚪",
  hose: "👖",
  toepfchen: "🚽",
  klopapier: "🧻",
  klo: "🚽",
  seife: "🧼",
  party: "🎈",
  stern: "⭐",
  spielen: "🧱",
} as const;

/** The name of one of the strip's symbols, its file in `bilder/symbole/`. */
export type SymbolName = keyof typeof SYMBOL_EMOJI;

/** One symbol: its picture, or its emoji until the picture is made. Decorative: its button carries the name. */
export function StripSymbol({ name, className = "pt-symbol" }: { name: SymbolName; className?: string }) {
  const src = symbols.image(name);
  if (!src) {
    return (
      <span className={`${className} pt-symbol-emoji`} aria-hidden>
        {SYMBOL_EMOJI[name]}
      </span>
    );
  }
  return <img className={className} src={src} alt="" draggable={false} aria-hidden />;
}

/** The drawn arrow on the trousers' symbol: down for taking them off, up for pulling them on. */
export function StepArrow({ way }: { way: "down" | "up" }) {
  return (
    <svg className="pt-arrow" viewBox="0 0 20 20" aria-hidden>
      <circle cx="10" cy="10" r="9" fill="#3f88c5" stroke="#3d3045" strokeWidth="2" />
      <path
        d={way === "down" ? "M10 4.5v9M6 10l4 4 4-4" : "M10 15.5v-9M6 10l4-4 4 4"}
        fill="none"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
