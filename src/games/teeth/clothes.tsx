import type { Figure } from "@/lib/common";
import type { Daytime } from "@/lib/days";

// What the child wears in the story and at the sink follows „Junge / Mädchen“ from the home page (`useFigure()`), like
// the face's pigtails: the boy in a violet T-shirt and blue pyjamas with yellow dots, the girl in a pink T-shirt and
// berry pyjamas with little hearts, and pink bands in her pigtails. Only colours and the pyjama's pattern differ, never
// the shapes, so every pose of the arm and the shoulders fits both.

/** The colours of what the child wears, for the boy or the girl. */
export interface Clothes {
  /** The T-shirt worn in the morning. */
  shirt: string;
  /** The pyjama's ground in the evening. */
  pyjama: string;
  /** The pyjama's big spots (the boy's dots, the girl's hearts). */
  spot: string;
  /** The pyjama's small white dots between them. */
  dot: string;
  /** The bands in the girl's pigtails (the boy has none). */
  band: string;
}

const BOY: Clothes = { shirt: "#8e7dff", pyjama: "#3a4a9e", spot: "#ffe680", dot: "#fff", band: "#ffd43b" };
const GIRL: Clothes = { shirt: "#ff8cc6", pyjama: "#9b3f86", spot: "#ffb3dc", dot: "#fff", band: "#ff5fa2" };

/** What the boy or the girl wears. */
export const clothesOf = (figure: Figure): Clothes => (figure === "girl" ? GIRL : BOY);

/** A little heart of the girl's pyjama, its middle at the origin, about 10 wide. */
const HEART = "M0 4 C-7 -1 -5 -7 0 -3.5 C5 -7 7 -1 0 4 Z";

/** The pyjama's pattern as `id`, for a fill of `url(#id)`: dots for the boy, hearts for the girl. */
export function PyjamaPattern({ id, figure }: { id: string; figure: Figure }) {
  const c = clothesOf(figure);
  return (
    <pattern id={id} width={36} height={36} patternUnits="userSpaceOnUse">
      <rect width={36} height={36} fill={c.pyjama} />
      {figure === "girl" ? <path transform="translate(9 9) scale(1.1)" d={HEART} fill={c.spot} /> : <circle cx={9} cy={9} r={4} fill={c.spot} />}
      <circle cx={27} cy={27} r={3} fill={c.dot} />
    </pattern>
  );
}

/** The fill of the child's top: the T-shirt in the morning, the pyjama pattern `pyjamaId` in the evening. */
export const topFill = (figure: Figure, daytime: Daytime, pyjamaId: string): string => (daytime === "evening" ? `url(#${pyjamaId})` : clothesOf(figure).shirt);
