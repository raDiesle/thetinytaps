import type { Localized } from "@/lib/language";
import type { Slot } from "./catalog";
import { ItemPic } from "./pictures";

// The signs of the times of day on a chart in parts (morning, midday, evening): the Tagesplan's pictures by default
// (user request, 27 November 2026, replacing „none unless chosen“), changed right on the sheet – 🗑️ hides them, the
// rows then told apart by their tints alone, and ⇄ „Bild austauschen“ picks another set, a picture or an own photo for
// one part. Never a choice in the band.

/** How many parts a day has on a chart: the whole day in one, morning and evening, or morning, midday and evening. */
export type DayParts = 1 | 2 | 3;

/** The parts of a day in each layout, in the day's order; one part means none at all. */
export const PARTS_OF: Record<DayParts, (Slot | undefined)[]> = {
  1: [undefined],
  2: ["morning", "evening"],
  3: ["morning", "noon", "evening"],
};

/** The choices of „Tageszeiten“, in the order of their switch. */
export const DAY_PARTS_CHOICES: { id: DayParts; label: Localized }[] = [
  { id: 1, label: { de: "Ganzer Tag", en: "Whole day", zh: "整天", hi: "पूरा दिन", es: "Todo el día", ar: "اليوم كله", ru: "Весь день" } },
  {
    id: 2,
    label: { de: "Früh & Abend", en: "Morning & evening", zh: "早上和晚上", hi: "सुबह और शाम", es: "Mañana y noche", ar: "صباحًا ومساءً", ru: "Утро и вечер" },
  },
  {
    id: 3,
    label: {
      de: "Früh, Mittag & Abend",
      en: "Morning, midday & evening",
      zh: "早上、中午和晚上",
      hi: "सुबह, दोपहर और शाम",
      es: "Mañana, mediodía y noche",
      ar: "صباحًا وظهرًا ومساءً",
      ru: "Утро, день и вечер",
    },
  },
];

/** A set of signs for the times of day. */
export type DaySignSet = "sky" | "sun" | "landscape" | "routine" | "pictures";

/** The signs as a chart keeps them: a set, or `"none"` where 🗑️ hid them; missing: `DEFAULT_SIGN_SET`. */
export type ChartSigns = DaySignSet | "none";

/** The set a chart shows where none was picked: the Tagesplan's pictures of the fox child. */
export const DEFAULT_SIGN_SET: DaySignSet = "pictures";

/** The set a chart's signs are drawn from, or `undefined` where they are hidden. */
export const signSetOf = (signs: ChartSigns | undefined): DaySignSet | undefined => (signs === "none" ? undefined : (signs ?? DEFAULT_SIGN_SET));

/** One part's own sign, picked on the sheet: a picture of the catalogue, or an own photo (its key in `photoStore`). */
export interface PartSign {
  emoji: string;
  catalog?: string;
  photo?: string;
}

/** What a chart carries of its signs. */
export interface WithSigns {
  /** The set (`DAY_SIGN_SETS`), or `"none"`; missing: `DEFAULT_SIGN_SET`. */
  signs?: ChartSigns;
  /** A part's own sign in place of the set's, where one was swapped on the sheet. */
  partSigns?: Partial<Record<Slot, PartSign>>;
}

/** The chart with its signs hidden (🗑️), or shown again in the set they had. */
export const withSignsShown = <T extends WithSigns>(chart: T, shown: boolean): T =>
  shown ? { ...chart, signs: chart.signs === "none" ? undefined : chart.signs } : { ...chart, signs: "none" };

/** A set picked for one part: every part follows it (a set's signs belong together), own signs given up. */
export const withSignSet = <T extends WithSigns>(chart: T, set: DaySignSet): T => ({ ...chart, signs: set, partSigns: undefined });

/** One part's own sign (a picture or photo), the others keeping theirs; `undefined` gives the part back to the set. */
export function withPartSign<T extends WithSigns>(chart: T, part: Slot, sign: PartSign | undefined): T {
  const { [part]: _old, ...rest } = chart.partSigns ?? {};
  const partSigns = sign ? { ...rest, [part]: sign } : rest;
  return { ...chart, signs: chart.signs === "none" ? undefined : chart.signs, partSigns: Object.keys(partSigns).length ? partSigns : undefined };
}

/** A chart's sign for a part: its own where swapped, else the set's; nothing where the signs are hidden. */
export function PartSignPic({ chart, part, lines = false }: { chart: WithSigns; part: Slot; lines?: boolean }) {
  const set = signSetOf(chart.signs);
  if (!set) return null;
  const own = chart.partSigns?.[part];
  return own ? <ItemPic item={own} lines={lines} /> : <DaySign set={set} part={part} lines={lines} />;
}

/** The emoji of a set drawn by emoji, morning, midday, evening. */
const EMOJI: Partial<Record<DaySignSet, Record<Slot, string>>> = {
  sun: { morning: "☀️", noon: "🌤️", evening: "🌙" },
  landscape: { morning: "🌅", noon: "🏞️", evening: "🌃" },
  routine: { morning: "🐓", noon: "🍽️", evening: "🛏️" },
};

/** The Tagesplan's own pictures of the fox child for each time of day: getting up, lunch, going to sleep. */
const PICTURE_STEPS: Record<Slot, { emoji: string; catalog: string }> = {
  morning: { emoji: "🌅", catalog: "aufstehen" },
  noon: { emoji: "🍲", catalog: "mittagessen" },
  evening: { emoji: "😴", catalog: "schlafen" },
};

/** The sets of signs, in the order a part's window offers them. */
export const DAY_SIGN_SETS: { id: DaySignSet; label: Localized }[] = [
  { id: "sky", label: { de: "Himmel", en: "Sky", zh: "天空", hi: "आसमान", es: "Cielo", ar: "السماء", ru: "Небо" } },
  { id: "pictures", label: { de: "Bilder", en: "Pictures", zh: "图片", hi: "तस्वीरें", es: "Imágenes", ar: "صور", ru: "Картинки" } },
  { id: "sun", label: { de: "Sonne & Mond", en: "Sun & moon", zh: "太阳和月亮", hi: "सूरज और चाँद", es: "Sol y luna", ar: "الشمس والقمر", ru: "Солнце и луна" } },
  { id: "landscape", label: { de: "Landschaft", en: "Landscape", zh: "风景", hi: "दृश्य", es: "Paisaje", ar: "منظر طبيعي", ru: "Пейзаж" } },
  {
    id: "routine",
    label: {
      de: "Hahn, Teller, Bett",
      en: "Rooster, plate, bed",
      zh: "公鸡、盘子、床",
      hi: "मुर्गा, थाली, बिस्तर",
      es: "Gallo, plato, cama",
      ar: "ديك وصحن وسرير",
      ru: "Петух, тарелка, кровать",
    },
  },
];

/** The classic emoji of a time of day, where a sign is needed whatever set was chosen (the editor's own switches). */
export const SLOT_EMOJI: Record<Slot, string> = { morning: "☀️", noon: "🌤️", evening: "🌙" };

/**
 * The sign of a time of day in a set: a drawn sky (the sun rising over a hill, the sun high with a cloud, the moon and
 * stars over a dark hill), the child's pictures of the Tagesplan, or emoji. `lines` gives a picture's twin to colour in.
 */
export function DaySign({ set, part, lines = false }: { set: DaySignSet; part: Slot; lines?: boolean }) {
  if (set === "sky") return <SkySign part={part} />;
  if (set === "pictures") return <ItemPic item={PICTURE_STEPS[part]} lines={lines} />;
  return <>{EMOJI[set]?.[part] ?? SLOT_EMOJI[part]}</>;
}

/** A small window onto the sky at a time of day, drawn: plainer than an emoji and the same on every device. */
function SkySign({ part }: { part: Slot }) {
  const rays = (cx: number, cy: number, r: number, from: number, to: number) =>
    Array.from({ length: 9 }, (_, i) => {
      const a = ((from + ((to - from) * i) / 8) * Math.PI) / 180;
      return (
        <line
          key={i}
          x1={cx + Math.cos(a) * r}
          y1={cy - Math.sin(a) * r}
          x2={cx + Math.cos(a) * (r + 4)}
          y2={cy - Math.sin(a) * (r + 4)}
          stroke="#f59f00"
          strokeWidth={1.8}
          strokeLinecap="round"
        />
      );
    });
  return (
    <svg className="rw-sky-sign" viewBox="0 0 40 40" aria-hidden>
      <clipPath id={`rw-sky-${part}`}>
        <rect x={1} y={1} width={38} height={38} rx={9} />
      </clipPath>
      <g clipPath={`url(#rw-sky-${part})`}>
        {part === "morning" && (
          <>
            <rect width={40} height={40} fill="#ffe3b3" />
            <rect y={18} width={40} height={22} fill="#ffc9a3" />
            {rays(20, 29, 10, 15, 165)}
            <circle cx={20} cy={29} r={8} fill="#ffb300" />
            <path d="M-2 31 Q 10 24 22 30 T 42 29 V 42 H -2 Z" fill="#7cb342" />
          </>
        )}
        {part === "noon" && (
          <>
            <rect width={40} height={40} fill="#9fd4ff" />
            {rays(20, 15, 8, 0, 360)}
            <circle cx={20} cy={15} r={6.5} fill="#ffcc33" />
            <path d="M23 26 a4 4 0 0 1 7 -2 a3.5 3.5 0 0 1 6 2.5 a3 3 0 0 1 -1 5.5 h-11 a3 3 0 0 1 -1 -6 Z" fill="#fff" />
            <path d="M-2 34 Q 14 30 26 34 T 42 33 V 42 H -2 Z" fill="#8bc34a" />
          </>
        )}
        {part === "evening" && (
          <>
            <rect width={40} height={40} fill="#2f3570" />
            <path d="M24 7 a10 10 0 1 0 6 17 a8 8 0 1 1 -6 -17 Z" fill="#ffe680" />
            {[
              [9, 9],
              [14, 18],
              [33, 10],
              [7, 25],
            ].map(([x, y]) => (
              <path
                key={`${x}-${y}`}
                d={`M${x} ${y - 2} L${x + 0.6} ${y - 0.6} L${x + 2} ${y} L${x + 0.6} ${y + 0.6} L${x} ${y + 2} L${x - 0.6} ${y + 0.6} L${x - 2} ${y} L${x - 0.6} ${y - 0.6} Z`}
                fill="#fff6c2"
              />
            ))}
            <path d="M-2 33 Q 12 28 24 32 T 42 31 V 42 H -2 Z" fill="#26473a" />
          </>
        )}
      </g>
      <rect x={1} y={1} width={38} height={38} rx={9} fill="none" stroke="currentColor" strokeWidth={1.5} opacity={0.45} />
    </svg>
  );
}
