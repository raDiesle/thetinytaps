import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { GoodNightSky } from "@/components/GoodNight";
import { PlaytimeOptions } from "@/components/PlaytimeOptions";
import { useHold } from "@/lib/hold";
import { useT } from "@/lib/language";
import { usePlaytimeState } from "@/lib/playtime";
import { routineReturn } from "@/lib/routine";

/** How long a grown-up holds ⏳ to open the play time; far longer than a toddler's tap. */
const UNLOCK_HOLD_MS = 3000;

/**
 * When the play time is over, a night sky covers every menu – home page, categories and
 * start screens – so no game can be started; the child stays on it. Only holding ⏳ for
 * three seconds opens the play time options, where a grown-up gives more time or starts
 * the day afresh; then the lock goes away by itself. A game on screen shows its own good
 * night instead (GameShell), and the management page for grown-ups, the Belohnungstafel and the Tagesplan stay open,
 * as does a game the Tagesplan opened for one of its steps (brushing teeth is part of the evening, not play).
 */
export function PlaytimeLock() {
  const { over, inGame } = usePlaytimeState();
  const { pathname, state } = useLocation();
  // The Belohnungstafel, the Tagesplan and the Timer are tools for the day, not games: the evening routine still works.
  const tool = ["/management", "/ideen", "/belohnungstafel", "/tagesplan", "/wie-lange-warten", "/timer"].some((path) => pathname.startsWith(path));
  const locked = over && !inGame && !tool && !routineReturn(state);
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
      aria-label={t({
        de: "Die Spielzeit ist vorbei",
        ru: "Время игры закончилось",
        en: "Play time is over",
        zh: "游戏时间结束了",
        hi: "खेलने का समय ख़त्म हो गया",
        es: "Se acabó el tiempo de juego",
        ar: "انتهى وقت اللعب",
      })}
      tabIndex={-1}
    >
      <GoodNightSky still>{!open && <HoldToUnlock onUnlock={() => setOpen(true)} />}</GoodNightSky>
      {open && (
        <div className="playtime-lock-panel">
          <PlaytimeOptions />
          <button type="button" className="playtime-lock-close" onClick={() => setOpen(false)}>
            {t({ de: "Schließen", ru: "Закрыть", en: "Close", zh: "关闭", hi: "बंद करें", es: "Cerrar", ar: "إغلاق" })}
          </button>
        </div>
      )}
    </div>
  );
}

/** The grown-ups' way in: ⏳ held for three seconds while its ring fills; letting go earlier does nothing. */
function HoldToUnlock({ onUnlock }: { onUnlock: () => void }) {
  const t = useT();
  const { holding, props } = useHold(onUnlock, UNLOCK_HOLD_MS);

  return (
    <div className="playtime-lock-unlock">
      <button
        type="button"
        className={`playtime-lock-hold${holding ? " holding" : ""}`}
        aria-label={t({
          de: "Für Erwachsene: Spielzeit (3 Sekunden gedrückt halten)",
          ru: "Для взрослых: время игры (удерживать 3 секунды)",
          en: "For grown-ups: play time (hold for 3 seconds)",
          zh: "家长专用：游戏时间（按住 3 秒）",
          hi: "बड़ों के लिए: खेलने का समय (3 सेकंड दबाए रखें)",
          es: "Para adultos: tiempo de juego (mantener pulsado 3 segundos)",
          ar: "للكبار: وقت اللعب (ضغط مطوّل 3 ثوانٍ)",
        })}
        {...props}
      >
        ⏳
      </button>
      <span className="playtime-lock-hint">
        {t({
          de: "Für Erwachsene: ⏳ drei Sekunden gedrückt halten",
          ru: "Для взрослых: удерживайте ⏳ три секунды",
          en: "For grown-ups: hold ⏳ for three seconds",
          zh: "家长专用：按住 ⏳ 三秒",
          hi: "बड़ों के लिए: ⏳ को तीन सेकंड दबाए रखें",
          es: "Para adultos: mantenga pulsado ⏳ tres segundos",
          ar: "للكبار: اضغطوا على ⏳ مطولًا ثلاث ثوانٍ",
        })}
      </span>
    </div>
  );
}
