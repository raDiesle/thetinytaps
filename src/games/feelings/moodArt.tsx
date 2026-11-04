// The drawings of „Wie geht's dir?“: the weather signs of „Wie doll ist es?“ (C-36) and the big face the little fox
// or bear makes to copy (C-35). Drawn once per screen, still; the only thing that moves is the breath's circle, an HTML
// layer of its own.

import { MASCOT_INK, MascotHead } from "@/components/Mascot";
import type { Mood, SkyId } from "./mood";

const CLOUD = "M25 68 Q12 68 14 55 Q16 44 28 46 Q30 30 46 31 Q58 24 68 36 Q84 34 86 50 Q90 66 74 68 Z";
const line = { stroke: MASCOT_INK, strokeWidth: 3, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

/** The weather of each feeling in a 100 × 100 box, its middle at 50, 50. */
function Sky({ sky }: { sky: SkyId }) {
  switch (sky) {
    case "sonne":
      return (
        <g>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <path key={a} d="M50 18 L50 6" transform={`rotate(${a} 50 50)`} stroke="#f2a516" strokeWidth="6" strokeLinecap="round" />
          ))}
          <circle cx="50" cy="50" r="22" fill="#ffd23f" {...line} />
        </g>
      );
    case "regenbogen":
      return (
        <g fill="none" strokeWidth="7">
          {["#ef5350", "#ffa726", "#ffd23f", "#66bb6a", "#42a5f5"].map((color, i) => {
            const r = 42 - i * 7;
            return <path key={color} d={`M${50 - r} 74 A${r} ${r} 0 0 1 ${50 + r} 74`} stroke={color} />;
          })}
          <ellipse cx="14" cy="76" rx="13" ry="8" fill="#fff" {...line} />
          <ellipse cx="86" cy="76" rx="13" ry="8" fill="#fff" {...line} />
        </g>
      );
    case "wind":
      return (
        <g fill="none" stroke="#5d9cc9" strokeWidth="6" strokeLinecap="round">
          <path d="M10 34 H58 Q72 34 72 23 Q72 13 62 14" />
          <path d="M6 52 H74 Q90 52 90 64 Q90 76 77 74" />
          <path d="M16 70 H48 Q60 70 60 80 Q60 88 52 87" />
          <path d="M80 30 Q86 22 94 26 Q88 34 80 30 Z" fill="#8bc34a" stroke={MASCOT_INK} strokeWidth="2" />
        </g>
      );
    case "schnee":
      return (
        <g stroke="#5d9cc9" strokeWidth="5" strokeLinecap="round" fill="none">
          {[0, 60, 120].map((a) => (
            <g key={a} transform={`rotate(${a} 50 50)`}>
              <path d="M50 14 L50 86" />
              <path d="M42 22 L50 30 L58 22 M42 78 L50 70 L58 78" />
            </g>
          ))}
          <circle cx="50" cy="50" r="4" fill="#5d9cc9" />
        </g>
      );
    case "wolke":
      return <path d={CLOUD} fill="#d5dbe1" {...line} />;
    case "regen":
      return (
        <g>
          <path d={CLOUD} transform="translate(0 -14)" fill="#a9b7c4" {...line} />
          <g stroke="#42a5f5" strokeWidth="5" strokeLinecap="round">
            <path d="M32 64 L28 76" />
            <path d="M50 64 L46 80" />
            <path d="M68 64 L64 76" />
            <path d="M41 80 L38 90" />
            <path d="M59 80 L56 90" />
          </g>
        </g>
      );
    case "gewitter":
      return (
        <g>
          <path d={CLOUD} transform="translate(0 -14)" fill="#5b6573" {...line} />
          <path d="M52 52 L40 72 L49 72 L42 92 L64 66 L54 66 L60 52 Z" fill="#ffd23f" {...line} />
        </g>
      );
    case "wald":
      return (
        <g>
          <path d="M80 14 A10 10 0 1 0 88 30 A8 8 0 1 1 80 14 Z" fill="#fff3b0" {...line} strokeWidth="2" />
          {[
            [24, 0.7],
            [76, 0.75],
            [50, 1],
          ].map(([x, s]) => (
            <g key={x} transform={`translate(${x} 92) scale(${s})`}>
              <path d="M-3 0 L-3 -10 L3 -10 L3 0 Z" fill="#4a2c33" />
              <path
                d="M0 -76 L-16 -50 L-8 -50 L-22 -30 L-12 -30 L-26 -10 L26 -10 L12 -30 L22 -30 L8 -50 L16 -50 Z"
                fill="#2f4a3a"
                {...line}
                strokeWidth="2.5"
              />
            </g>
          ))}
        </g>
      );
  }
}

/** A feeling's weather, drawn `scale` big in its box (1 filling it): the three sizes of „Wie doll ist es?“. */
export function SkySign({ sky, scale }: { sky: SkyId; scale: number }) {
  return (
    <span className="mood-art mood-sky" aria-hidden>
      <svg viewBox="0 0 100 100">
        <g transform={`translate(50 50) scale(${scale}) translate(-50 -50)`}>
          <Sky sky={sky} />
        </g>
      </svg>
    </span>
  );
}

/**
 * The little fox's or bear's face, big, making the feeling's face for the child to copy (C-35); `blowing` shows it
 * blowing out slowly instead, with a soft circle that grows and shrinks behind it for each breath.
 */
export function BigFace({ mood, blowing = false }: { mood: Mood; blowing?: boolean }) {
  const face = blowing ? { eyes: "shut" as const, mouth: "o" as const, brows: "soft" as const } : mood.face;
  return (
    <span className={`mood-art mood-face mood-face-${mood.kind}`} aria-hidden>
      {blowing && <span className="mood-breath" />}
      <svg viewBox="0 4 100 92">
        <g transform={`rotate(${blowing ? 0 : (mood.face.tilt ?? 0)} 50 56)`}>
          <MascotHead kind={mood.kind} child eyes={face.eyes} mouth={face.mouth} brows={face.brows} />
        </g>
      </svg>
    </span>
  );
}
