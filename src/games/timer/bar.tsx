import { useEffect, useState, type CSSProperties } from "react";
import { Choice } from "@/components/SettingControls";
import { useT } from "@/lib/language";
import { afterPageMotion } from "@/lib/pageMotion";
import { useRunClock } from "./pause";
import { LeftGlow } from "./scenes";

// The bar along the bottom (user request, 22 November 2026: „ganz unten über die fast gesamte Breite eine
// Progressbar zur zusätzlichen Unterstützung“): under every picture a wide paper track runs from a start at the left
// to a little flag at the right, filling in the picture's own colour as the time goes, a round marker at the fill's
// front. It is a second, plainer way to see the time beside the picture, the same for every picture, so a child who
// knows one timer reads them all. Outside the stage, so it always lies along the screen's bottom edge whatever the
// picture cuts off. The fill, the marker and the part still to go each move by one CSS animation of `transform` as long
// as the run – small layers, never React drawing per frame.

/** How long before the end the last moments begin (H-49's „gleich“ is earlier): at most this, less on a short run. */
export const FINAL_MS = 10_000;

/** The last moments of a run of `total` ms: ten seconds, but never more than a quarter of a short run. */
export function finalMs(total: number) {
  return Math.min(FINAL_MS, Math.round(total / 4));
}

/** How many of the last seconds a rising note marks, one a second up to the end. */
export const FINAL_NOTES = 5;

/**
 * The bar. `startedAt` and `total` give the run (a turn, in Abwechseln); `soon` warms the way still to go once „gleich
 * ist es so weit“ (H-49); `final` sets the marker and the flag beating once a second for the last moments; `glow` keys
 * the light on the way still to go at a tap (H-51); `done` lets it fade away for the end. `tone` names its colour where
 * it is not the picture's (whose turn it is, in Abwechseln).
 */
export function TimeBar({
  startedAt,
  total,
  soon = false,
  final = false,
  glow = 0,
  done = false,
  tone,
}: {
  startedAt: number;
  total: number;
  soon?: boolean;
  final?: boolean;
  glow?: number;
  done?: boolean;
  tone?: string;
}) {
  // The animations start where the clock is: from the run's start (later than now while a turn is still about to begin), and
  // again when the page comes back or has finished turning, since animations stand still while a page turns.
  // On the run's clock, so a pause holds it where it is and it goes on from there.
  const { now } = useRunClock();
  const [delay, setDelay] = useState(() => startedAt - now());
  useEffect(() => {
    const resync = () => setDelay(startedAt - now());
    resync();
    const stop = afterPageMotion(resync);
    document.addEventListener("visibilitychange", resync);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", resync);
    };
  }, [startedAt, now]);
  const timing = { "--tm-bar-ms": `${total}ms`, "--tm-bar-delay": `${delay}ms` } as CSSProperties;
  const state = `${soon ? " tm-bar-soon" : ""}${final ? " tm-bar-final" : ""}${done ? " tm-bar-done" : ""}`;
  return (
    <div className={`tm-bar${state}`} data-tone={tone} style={timing} aria-hidden>
      <div className="tm-bar-track">
        <div key={delay} className="tm-bar-left tm-move">
          <div className="tm-bar-warm" />
          <LeftGlow n={glow} />
        </div>
        <div key={`fill${delay}`} className="tm-bar-fill tm-move" />
      </div>
      <div className="tm-bar-start" />
      <div className="tm-bar-goal">
        <div className="tm-bar-goal-light" />
        <svg viewBox="0 0 60 80">
          <path d="M10 78 V6" stroke="#3b2a20" strokeWidth="6" strokeLinecap="round" />
          <path
            d="M12 8 C26 2 34 14 54 8 V34 C34 40 26 28 12 34 Z"
            fill="var(--tm-bar-flag, #ff6b6b)"
            stroke="#3b2a20"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <circle cx="10" cy="6" r="5" fill="#ffd43b" stroke="#3b2a20" strokeWidth="3" />
        </svg>
      </div>
      {/* The marker rides along the bar's width (`cqw` of the bar) as a small layer of its own. */}
      <div key={`run${delay}`} className="tm-bar-knob tm-move">
        <svg viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="16" fill="#fffdf3" stroke="#3b2a20" strokeWidth="4" />
          <circle cx="20" cy="20" r="9" fill="var(--tm-bar-b)" />
          <circle cx="16.5" cy="16.5" r="3" fill="#fff" opacity="0.8" />
        </svg>
      </div>
    </div>
  );
}

/**
 * The last moments over the whole picture: a warm light gathering from the screen's edges until the end, where the
 * picture's own warm end light takes over (`.tm-done-light`). One layer fading in by `opacity`, mounted only then.
 */
export function FinalLight({ endsAt }: { endsAt: number }) {
  // Read once as it comes: a duration changed on a running animation would move it.
  const { now } = useRunClock();
  const [ms] = useState(() => Math.max(0, endsAt - now()));
  return <div className="tm-final-light" style={{ "--tm-final-ms": `${ms}ms` } as CSSProperties} />;
}

/**
 * The time is up, seen from across the room (user request, 25 November 2026): the whole picture turns golden – every
 * colour changes at once, so even a glance from afar tells running from over – and a thick golden frame lights up round
 * the screen and breathes slowly while the end is shown. Still layers – the tint by its blends, the frame breathing by
 * `opacity` –, never a flash; the picture's own end runs on beneath them.
 */
export function TimeUp() {
  return (
    <>
      <div className="tm-up-tint" />
      <div className="tm-up-warm" />
      <div className="tm-up-frame" />
    </>
  );
}

/** The choice behind ⚙️ while a timer runs: the bar along the bottom, or not. */
export function TimeBarChoice({ value, onChange }: { value: boolean; onChange: (bar: boolean) => void }) {
  const t = useT();
  return (
    <Choice
      label={t({
        en: "Bar at the bottom",
        de: "Leiste unten",
        zh: "底部进度条",
        hi: "नीचे की पट्टी",
        es: "Barra abajo",
        ar: "الشريط في الأسفل",
        ru: "Полоска внизу",
      })}
      value={value ? "on" : "off"}
      onChange={(v) => onChange(v === "on")}
      options={[
        { value: "on", label: t({ en: "On", de: "An", zh: "开", hi: "चालू", es: "Sí", ar: "تشغيل", ru: "Вкл." }) },
        { value: "off", label: t({ en: "Off", de: "Aus", zh: "关", hi: "बंद", es: "No", ar: "إيقاف", ru: "Выкл." }) },
      ]}
    />
  );
}
