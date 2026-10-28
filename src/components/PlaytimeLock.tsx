import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useLocation } from "react-router";
import { PlaytimeOptions } from "@/components/PlaytimeOptions";
import { useT } from "@/lib/language";
import { usePlaytimeState } from "@/lib/playtime";

/** How long a grown-up holds ⏳ to open the play time; far longer than a toddler's tap. */
const UNLOCK_HOLD_MS = 3000;

/**
 * When the play time is over, a night sky covers every menu – home page, categories and
 * start screens – so no game can be started; the child stays on it. Only holding ⏳ for
 * three seconds opens the play time options, where a grown-up gives more time or starts
 * the day afresh; then the lock goes away by itself. A game on screen shows its own good
 * night instead (GameShell), and the management page for grown-ups and the Belohnungstafel stay open.
 */
export function PlaytimeLock() {
  const { over, inGame } = usePlaytimeState();
  const { pathname } = useLocation();
  // The Belohnungstafel is a tool for the day, not a game: a star after the evening brushing still comes.
  const locked = over && !inGame && !pathname.startsWith("/management") && !pathname.startsWith("/ideen") && !pathname.startsWith("/belohnungstafel");
  return locked ? <Lock /> : null;
}

function Lock() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  // Keys reach nothing underneath: no Enter on a focused game card, no Tab to a link.
  useEffect(() => {
    root.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      // A key sent to the window itself has no node as its target.
      if (e.target instanceof Node && root.current?.contains(e.target)) return;
      e.preventDefault();
      e.stopPropagation();
      root.current?.focus();
    };
    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () => window.removeEventListener("keydown", onKeyDown, { capture: true });
  }, []);

  return (
    <div
      ref={root}
      className="playtime-lock"
      role="dialog"
      aria-modal
      aria-label={t({ de: "Die Spielzeit ist vorbei", ru: "Время игры закончилось" })}
      tabIndex={-1}
    >
      <div className="good-night">
        {STARS.map(([x, y], i) => (
          <span key={i} className="good-night-star" style={{ left: `${x}%`, top: `${y}%` }} aria-hidden>
            ✦
          </span>
        ))}
        <span className="good-night-moon" aria-hidden>
          🌙
        </span>
        <span className="good-night-sleeper" aria-hidden>
          🧸<span className="good-night-zzz">💤</span>
        </span>
        <p className="good-night-text">{t({ de: "Gute Nacht!", ru: "Спокойной ночи!" })}</p>
        {!open && <HoldToUnlock onUnlock={() => setOpen(true)} />}
      </div>
      {open && (
        <div className="playtime-lock-panel">
          <PlaytimeOptions />
          <button type="button" className="playtime-lock-close" onClick={() => setOpen(false)}>
            {t({ de: "Schließen", ru: "Закрыть" })}
          </button>
        </div>
      )}
    </div>
  );
}

/** The grown-ups' way in: ⏳ held for three seconds while its ring fills; letting go earlier does nothing. */
function HoldToUnlock({ onUnlock }: { onUnlock: () => void }) {
  const t = useT();
  const [holding, setHolding] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const press = () => {
    if (timer.current) return;
    setHolding(true);
    timer.current = setTimeout(onUnlock, UNLOCK_HOLD_MS);
  };
  const release = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setHolding(false);
  };
  const isPressKey = (key: string) => key === "Enter" || key === " ";

  return (
    <div className="playtime-lock-unlock">
      <button
        type="button"
        className={`playtime-lock-hold${holding ? " holding" : ""}`}
        style={{ "--hold-ms": `${UNLOCK_HOLD_MS}ms` } as CSSProperties}
        aria-label={t({ de: "Für Erwachsene: Spielzeit (3 Sekunden gedrückt halten)", ru: "Для взрослых: время игры (удерживать 3 секунды)" })}
        onPointerDown={(e) => {
          // A finger that slides a little still counts as holding.
          e.currentTarget.setPointerCapture(e.pointerId);
          press();
        }}
        onPointerUp={release}
        onPointerCancel={release}
        onContextMenu={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          if (!isPressKey(e.key)) return;
          e.preventDefault();
          if (!e.repeat) press();
        }}
        onKeyUp={(e) => isPressKey(e.key) && release()}
        onBlur={release}
      >
        ⏳
      </button>
      <span className="playtime-lock-hint">
        {t({ de: "Für Erwachsene: ⏳ drei Sekunden gedrückt halten", ru: "Для взрослых: удерживайте ⏳ три секунды" })}
      </span>
    </div>
  );
}

/** Star positions in percent of the screen; still, unlike the game's twinkling good night. */
const STARS: [number, number][] = [
  [8, 12],
  [22, 30],
  [35, 8],
  [52, 22],
  [68, 10],
  [84, 26],
  [92, 8],
  [14, 52],
  [78, 48],
  [44, 40],
];
