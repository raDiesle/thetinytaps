import { useHold } from "@/lib/hold";
import { useT } from "@/lib/language";

/** How long the switch has to be held: as long as ⚙️ while playing, so a child's tap changes nothing. */
const HOLD_MS = 500;

/**
 * „Alltagssituationen“ only (user decision, November 2026): a wooden loudspeaker with a speech bubble in the top left
 * corner, below the ✕, drawn like the shelf's loudspeaker for the music. Held, it switches the voice that tells the
 * scene, asks the question and names the choices off or on, for grown-ups who would rather tell the story to the child
 * in their own words; the sounds (crying, laughing, a crash) stay. Off, the bubble gives way to a red cross.
 */
export function VoiceSwitch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  const t = useT();
  const { holding, props } = useHold(onToggle, HOLD_MS);
  const label = on ? t({ de: "Stimme ausschalten" }) : t({ de: "Stimme einschalten" });
  const hold = t({ de: "halten", ru: "удерживать", en: "hold", zh: "按住", hi: "दबाए रखें", es: "mantener pulsado", ar: "ضغط مطوّل" });

  return (
    <button
      type="button"
      className={`story-voice${holding ? " holding" : ""}`}
      aria-pressed={on}
      aria-label={`${label} (${hold})`}
      title={label}
      data-tap-keep
      {...props}
    >
      <svg viewBox="0 0 80 84" aria-hidden>
        {/* The box, its side and feet, one big cone: the shelf's loudspeaker, smaller. */}
        <path className="story-voice-side" d="M44 26 L49 29 V76 L44 80 Z" />
        <path className="story-voice-foot" d="M8 79 h7 v4 h-7 Z M35 79 h7 v4 h-7 Z" />
        <rect className="story-voice-box" x="4" y="24" width="40" height="56" rx="5" />
        <circle className="story-voice-ring" cx="24" cy="36" r="5" />
        <circle className="story-voice-ring" cx="24" cy="61" r="13" />
        <circle className="story-voice-cone" cx="24" cy="61" r="8.5" />
        <circle className="story-voice-cap" cx="24" cy="61" r="3.4" />
        {on ? (
          // A speech bubble coming out: someone is talking. Printed still, it doesn't move by itself.
          <g className="story-voice-bubble">
            <path d="M44 3 H74 Q78 3 78 7 V23 Q78 27 74 27 H54 L46 35 L48 27 H44 Q40 27 40 23 V7 Q40 3 44 3 Z" />
            <circle cx="50" cy="15" r="2.6" />
            <circle cx="59" cy="15" r="2.6" />
            <circle cx="68" cy="15" r="2.6" />
          </g>
        ) : (
          <path className="story-voice-off" d="M50 5 L70 25 M70 5 L50 25" />
        )}
      </svg>
      <small>{hold}</small>
    </button>
  );
}
