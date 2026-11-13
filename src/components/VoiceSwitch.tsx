import type { KeyboardEvent, PointerEvent } from "react";
import { useT } from "@/lib/language";
import "./voiceSwitch.css";

/**
 * One tap on a grown-ups' note in the corner acts at once, as the finger lands (or Enter / Space): the loudspeaker and
 * the book of the text to read out are tapped, never held (user feedback, November 2026: held, they were too slow).
 */
export const tapProps = (onTap: () => void) => ({
  onPointerDown: (e: PointerEvent) => {
    e.stopPropagation();
    onTap();
  },
  onKeyDown: (e: KeyboardEvent) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    e.stopPropagation();
    onTap();
  },
});

/**
 * A wooden loudspeaker with a speech bubble in the bottom right corner, drawn like the shelf's loudspeaker for the
 * music, for grown-ups who would rather tell the story to the child in their own words. Only in Gefühle's
 * „Alltagssituationen“ and the chapter books read aloud (`ChapterBook`: Abstillen, Schnullerfee, Kita-Start; user
 * decisions, November 2026) – no other game gets one. One tap switches the voice that tells the story off or on; the
 * sounds stay. Off, the bubble gives way to a red cross.
 */
export function VoiceSwitch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  const t = useT();
  const label = on
    ? t({
        de: "Stimme ausschalten",
        en: "Turn the voice off",
        zh: "关闭语音",
        hi: "आवाज़ बंद करें",
        es: "Apagar la voz",
        ar: "إيقاف صوت الراوي",
        ru: "Выключить голос",
      })
    : t({
        de: "Stimme einschalten",
        en: "Turn the voice on",
        zh: "打开语音",
        hi: "आवाज़ चालू करें",
        es: "Encender la voz",
        ar: "تشغيل صوت الراوي",
        ru: "Включить голос",
      });

  return (
    <button type="button" className="story-voice" aria-pressed={on} aria-label={label} title={label} data-tap-keep {...tapProps(onToggle)}>
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
    </button>
  );
}
