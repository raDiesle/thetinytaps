// The little bear's face drawn big (`BigFace`): the eight feelings' faces kept from the removed „Gefühle nachmachen“
// (C-35), to use again. „Wie geht's dir?“ showed a drawn bear standing beside its slider too; since 6 November 2026 it
// shows three Gemini pictures for how strong a feeling is instead (user wish), and „Tief pusten“ is a picture card.

import { MascotHead } from "@/components/Mascot";
import type { MoodFace } from "./mood";

/**
 * The little bear's face, big, making a feeling's face (`Mood.face`; drawn for the removed „Gefühle nachmachen“, C-35,
 * and kept to use again).
 */
export function BigFace({ face }: { face: MoodFace }) {
  return (
    <span className="mood-art mood-face" aria-hidden>
      <svg viewBox="0 4 100 92">
        <g transform={`rotate(${face.tilt ?? 0} 50 56)`}>
          <MascotHead kind="bear" child eyes={face.eyes} mouth={face.mouth} brows={face.brows} />
        </g>
      </svg>
    </span>
  );
}
