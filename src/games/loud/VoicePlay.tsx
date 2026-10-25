import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { BurstLayer, useBursts } from "@/components/Bursts";
import { playRoar, playSqueak } from "@/lib/sfx";
import { speak } from "@/lib/speech";
import { Acacia, Lion, Mouse, Tuft } from "./animals";
import type { LevelProps } from "./LoudPlay";
import { createEar, meterAt } from "./mic";

type Who = "lion" | "mouse";

/** How long each animal reacts; the microphone is deaf meanwhile, so the lion doesn't hear his own roar. */
const REACT_MS: Record<Who, number> = { lion: 2000, mouse: 1200 };
/** Nobody has made a sound for this long: one of the animals waves for attention. */
const NUDGE_MS = 9000;
const SPEECH_DELAY_MS = 900;
/** A rough speaking time per letter, to stay deaf while the animals talk; speechSynthesis.speaking can stay stuck on true. */
const SPEECH_MS_PER_CHAR = 80;
const BARS = 10;
/** When another level follows: this many sounds, then a party and on to it. */
const ROUND_SOUNDS = 10;

const SAYS: Record<Who, string[]> = {
  lion: ["Roaaar! Ich bin der Löwe!", "So laut! Roaaar!", "Roaaar! Noch mal!"],
  mouse: ["Piep! Ich bin die kleine Maus.", "Pssst. Piep, piep.", "Piep! Ganz leise."],
};

const NUDGES: Record<Who, { mic: string; tap: string }> = {
  lion: { mic: "Ruf mal ganz laut: Hallo, Löwe!", tap: "Tipp mal den Löwen an!" },
  mouse: { mic: "Und jetzt ganz leise flüstern: Hallo, Maus.", tap: "Tipp mal die kleine Maus an!" },
};

const pick = <T,>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];

/**
 * Level "Löwe und Maus" (idea N-29): the microphone measures how loud the
 * child is. Shouting makes the lion roar and jump, a quiet voice makes the
 * little mouse squeak. Tapping an animal works too, e.g. without a microphone.
 */
export function VoicePlay({ speechLang, settings, mic, listen, celebrate, onDone }: LevelProps) {
  const [active, setActive] = useState<Who | null>(null);
  const [count, setCount] = useState<Record<Who, number>>({ lion: 0, mouse: 0 });
  const [nudge, setNudge] = useState<Who | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const lionRef = useRef<SVGGElement>(null);
  /** Until then an animal is still reacting and taps are ignored, so mashing doesn't stack sounds. */
  const busyUntil = useRef(0);
  /** Until then the microphone hears nothing: the animals are making sounds or talking. */
  const deafUntil = useRef(0);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const lastAct = useRef(performance.now());
  const sounds = useRef(0);
  const ear = useMemo(createEar, []);
  const { bursts, spawn } = useBursts();

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const say = useCallback(
    (text: string) => {
      const rate = 0.85;
      deafUntil.current = Math.max(deafUntil.current, performance.now() + (text.length * SPEECH_MS_PER_CHAR) / rate + 600);
      speak(text, speechLang, { rate });
    },
    [speechLang],
  );

  const later = useCallback((ms: number, run: () => void) => {
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      run();
    }, ms);
    timers.current.add(timer);
  }, []);

  const react = useCallback(
    (who: Who) => {
      const now = performance.now();
      if (now < busyUntil.current) return;
      busyUntil.current = now + REACT_MS[who];
      deafUntil.current = Math.max(deafUntil.current, busyUntil.current);
      lastAct.current = now;
      setNudge(null);
      setActive(who);
      setCount((c) => ({ ...c, [who]: c[who] + 1 }));
      if (who === "lion") {
        playRoar();
        const box = lionRef.current?.getBoundingClientRect();
        if (box) {
          // On both sides of the lion, so his open mouth stays in sight.
          for (let i = 0; i < 6; i++) {
            const x = i % 2 ? box.right + Math.random() * box.width * 0.2 : box.left - Math.random() * box.width * 0.2;
            spawn(x, box.top + Math.random() * box.height * 0.6);
          }
        }
      } else {
        playSqueak();
        later(260, playSqueak);
      }
      later(REACT_MS[who], () => setActive((a) => (a === who ? null : a)));
      if (onDone && ++sounds.current >= ROUND_SOUNDS) {
        // Busy and deaf for good: the party and the next level follow.
        busyUntil.current = deafUntil.current = Infinity;
        later(REACT_MS[who], () => celebrate(onDone));
      } else if (settings.speech) {
        later(SPEECH_DELAY_MS, () => say(pick(SAYS[who])));
      }
    },
    [celebrate, later, onDone, say, spawn, settings.speech],
  );

  listen.current = (db, ms) => {
    const heard = ear.hear(db, ms, performance.now() < deafUntil.current, settings.sensitivity);
    rootRef.current?.style.setProperty("--level", ear.meter.toFixed(3));
    if (heard) react(heard === "loud" ? "lion" : "mouse");
  };

  // After a quiet while the lion and the mouse take turns asking for a sound.
  useEffect(() => {
    let next: Who = "lion";
    const tick = setInterval(() => {
      if (performance.now() - lastAct.current < NUDGE_MS) return;
      lastAct.current = performance.now();
      setNudge(next);
      if (settings.speech) say(NUDGES[next][mic === "on" ? "mic" : "tap"]);
      next = next === "lion" ? "mouse" : "lion";
    }, 1000);
    return () => clearInterval(tick);
  }, [mic, say, settings.speech]);

  const threshold = meterAt(ear.loudDb(settings.sensitivity));

  return (
    <div
      ref={rootRef}
      className={["loud-play", active === "lion" && "roaring", active === "mouse" && "squeaking", nudge && `nudge-${nudge}`].filter(Boolean).join(" ")}
    >
      <svg className="loud-scene" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMax meet" role="img" aria-label="Löwe und Maus">
        <circle cx="120" cy="110" r="56" fill="#ffd166" />
        {/* The ground reaches far past the sides, for screens wider than the picture. */}
        <path d="M-1000 500 H0 Q250 470 500 500 T1000 490 H2000 V600 H-1000 Z" fill="#a7c957" />
        <path d="M-1000 540 H0 Q300 520 600 545 T1000 535 H2000 V600 H-1000 Z" fill="#94b84a" />
        <g transform="translate(905 505)">
          <Acacia />
        </g>
        {[80, 330, 600, 960].map((x) => (
          <Tuft key={x} x={x} y={515} />
        ))}

        <Meter threshold={threshold} />

        <g className="ll-mouse" transform="translate(215 508) scale(1.5)" data-tap onPointerDown={() => react("mouse")}>
          <ellipse cx="0" cy="2" rx="58" ry="9" fill="#00000018" />
          <g key={count.mouse} className="ll-mouse-jump">
            <Mouse />
          </g>
        </g>

        <g className="ll-lion" ref={lionRef} transform="translate(720 512)" data-tap onPointerDown={() => react("lion")}>
          <ellipse cx="0" cy="4" rx="150" ry="16" fill="#00000018" />
          <g key={count.lion} className="ll-lion-jump">
            <Lion />
          </g>
        </g>

        {active === "lion" && (
          <g key={`roar-${count.lion}`} transform="translate(720 70)">
            <g className="ll-bubble ll-bubble-lion">
              <rect x="-150" y="-46" width="300" height="84" rx="42" fill="#fff" stroke="var(--ink)" strokeWidth="5" />
              <text y="14" textAnchor="middle" fontSize="54" fontWeight="700" fill="#d62828">
                ROAAAR!
              </text>
            </g>
          </g>
        )}
        {active === "mouse" && (
          <g key={`squeak-${count.mouse}`} transform="translate(215 210)">
            <g className="ll-bubble">
              <rect x="-62" y="-26" width="124" height="48" rx="24" fill="#fff" stroke="var(--ink)" strokeWidth="4" />
              <text y="9" textAnchor="middle" fontSize="28" fontWeight="600" fill="#5a4fcf">
                piep!
              </text>
            </g>
          </g>
        )}

        <text className="ll-label ll-label-mouse" x="215" y="580" textAnchor="middle" fontSize="34">
          🤫 leise
        </text>
        <text className="ll-label ll-label-lion" x="720" y="580" textAnchor="middle" fontSize="34">
          📣 laut
        </text>
      </svg>

      <BurstLayer bursts={bursts} />
    </div>
  );
}

/** A loudness ladder between the two: small green bars for the mouse, big red ones for the lion. Lit from --level. */
function Meter({ threshold }: { threshold: number }) {
  return (
    <g className="ll-meter" transform="translate(440 470)">
      {Array.from({ length: BARS }, (_, i) => {
        const at = i / BARS;
        const width = 34 + i * 9;
        const lion = at >= threshold;
        return (
          <rect
            key={i}
            className="ll-bar"
            x={-width / 2}
            y={-i * 34 - 26}
            width={width}
            height="26"
            rx="13"
            fill={lion ? (i === BARS - 1 ? "#d62828" : "#f77f00") : i < 2 ? "#80ed99" : "#57cc99"}
            style={{ "--at": at } as CSSProperties}
          />
        );
      })}
      <text x="92" y="-8" fontSize="40" textAnchor="middle">
        🐭
      </text>
      <text x="110" y={-Math.ceil(threshold * BARS) * 34 - 4} fontSize="48" textAnchor="middle">
        🦁
      </text>
    </g>
  );
}
