import { STAR_PATH } from "@/components/Bursts";
import { INK } from "./mouth";

/**
 * The gold medal at the end, with a shining tooth on it: it swings down on its ribbon next to „Geschafft!“, so a
 * child who can't read sees that the brushing is done and well done.
 */
export function Medal({ label }: { label: string }) {
  return (
    <svg className="teeth-medal" viewBox="0 0 100 130" role="img" aria-label={label}>
      <g stroke={INK} strokeWidth={4} strokeLinejoin="round">
        {/* The ribbon round the neck, blue and red. */}
        <path d="M22 0 L44 0 L58 62 L40 66 Z" fill="#4cc9f0" />
        <path d="M78 0 L56 0 L42 62 L60 66 Z" fill="#ff5d73" />
        <circle cx={50} cy={86} r={40} fill="#ffd23f" />
        <circle cx={50} cy={86} r={31} fill="#ffe680" strokeWidth={3} />
        {/* A clean tooth, smiling. */}
        <path
          d="M37 70 C30 70 29 80 31 90 C33 100 36 108 40 108 C44 108 45 98 50 98 C55 98 56 108 60 108 C64 108 67 100 69 90 C71 80 70 70 63 70 C57 70 55 74 50 74 C45 74 43 70 37 70 Z"
          fill="#fff"
          strokeWidth={3}
        />
        <path d="M42 86 Q50 92 58 86" fill="none" strokeWidth={2.5} strokeLinecap="round" />
        <circle cx={43} cy={80} r={2.5} fill={INK} stroke="none" />
        <circle cx={57} cy={80} r={2.5} fill={INK} stroke="none" />
      </g>
      <path d="M24 72 C28 62 36 56 44 54" fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round" opacity={0.8} />
      <g transform="translate(64 60) scale(0.22)">
        <path className="teeth-medal-shine" d={STAR_PATH} fill="#fff" stroke={INK} strokeWidth={8} />
      </g>
    </svg>
  );
}
