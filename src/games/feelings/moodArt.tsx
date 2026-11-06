// The little bear's face drawn big (`BigFace`): „Tief pusten“ in „Was brauche ich?“, and the eight feelings' faces kept
// from the removed „Gefühle nachmachen“ (C-35), to use again. „Wie geht's dir?“ showed a drawn bear standing beside
// its slider too; since 6 November 2026 it shows three Gemini pictures for how strong a feeling is instead (user wish).
// Only the breath's circle moves, an HTML layer of its own.

import { MascotHead } from "@/components/Mascot";
import type { MoodFace } from "./mood";

/**
 * The little bear's face, big, making a feeling's face (`Mood.face`; drawn for the removed „Gefühle nachmachen“, C-35,
 * and kept to use again); `blowing` shows him blowing out
 * slowly instead, with a soft circle that grows and shrinks behind him for each breath („Tief pusten“).
 */
export function BigFace({ face, blowing = false }: { face: MoodFace; blowing?: boolean }) {
  const shown = blowing ? { eyes: "shut" as const, mouth: "o" as const, brows: "soft" as const } : face;
  return (
    <span className="mood-art mood-face" aria-hidden>
      {blowing && <span className="mood-breath" />}
      <svg viewBox="0 4 100 92">
        <g transform={`rotate(${blowing ? 0 : (face.tilt ?? 0)} 50 56)`}>
          <MascotHead kind="bear" child eyes={shown.eyes} mouth={shown.mouth} brows={shown.brows} />
        </g>
      </svg>
    </span>
  );
}
