import { useEffect, useState } from "react";
import { Choice } from "@/components/SettingControls";
import { useT } from "@/lib/language";
import { markUnit, marksLeft, percentMarks } from "./pieces";
import type { TimeShown } from "./settings";
import { digits } from "./time";

// „Zeit im Bild“ (user requests, November 2026): the time left stands in the picture's bottom right corner, by default
// as minutes and seconds. Behind ⚙️ grown-ups may switch to tally marks that go one by one – a full row of them, each a
// share of the run, or each a stretch of time – or off. A small paper note of its own outside the stage, ticking once
// a second, so the big drawing is never painted again.

/** The choice behind ⚙️ while a timer runs: the time left in the picture or not, and how. */
export function TimeShownChoice({ value, onChange }: { value: TimeShown; onChange: (shown: TimeShown) => void }) {
  const t = useT();
  return (
    <Choice
      label={t({ de: "Zeit im Bild" })}
      value={value}
      onChange={(v) => onChange(v as TimeShown)}
      options={[
        { value: "digits", label: t({ de: "Zahlen" }) },
        { value: "percent", label: t({ de: "Striche in %" }) },
        { value: "marks", label: t({ de: "Striche in Zeit" }) },
        { value: "off", label: t({ de: "Aus" }) },
      ]}
    />
  );
}

/** The marks in bundles of five, as tallies are written: four upright, the fifth across them. */
function Tally({ count }: { count: number }) {
  const bundles = Array.from({ length: Math.ceil(count / 5) }, (_, i) => Math.min(5, count - i * 5));
  return (
    <span className="tm-tally">
      {bundles.map((n, i) => (
        <svg key={i} viewBox="0 0 48 40" aria-hidden>
          {Array.from({ length: Math.min(n, 4) }, (_, k) => (
            <path key={k} d={`M${8 + k * 10} 4 V36`} />
          ))}
          {n === 5 && <path d="M2 30 L46 10" />}
        </svg>
      ))}
    </span>
  );
}

/**
 * The time left to `endsAt`, shown as `shown` says (nothing when off or once the time is up); `total` is the whole
 * run, which sets what a tally mark stands for: a share of it (`percentMarks`), or a stretch of time (`markUnit`).
 */
export function TimeShownNote({ shown, endsAt, total }: { shown: TimeShown; endsAt: number; total: number }) {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    if (shown === "off") return;
    const tick = () => setNow(Date.now());
    tick();
    const timer = setInterval(tick, 250);
    return () => clearInterval(timer);
  }, [shown]);
  const left = endsAt - now;
  if (shown === "off" || left <= 0) return null;
  return (
    <div className={`tm-shown tm-shown-${shown === "percent" ? "marks" : shown}`} aria-hidden>
      {shown === "digits" ? <b>{digits(left)}</b> : <Tally count={marksLeft(left, shown === "percent" ? total / percentMarks(total) : markUnit(total))} />}
    </div>
  );
}
