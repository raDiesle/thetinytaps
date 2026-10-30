import { useEffect, useState, type ReactNode } from "react";
import { useT } from "@/lib/language";
import { useHold } from "@/lib/hold";

/** How long ⚙️ has to be held while playing before the options open: as long as ✕, so a child's tap does nothing. */
const HOLD_MS = 500;

/**
 * A game's options while it plays, for grown-ups: ⚙️ in the top left corner, held like ✕ (the ring fills), opens
 * `children` in a panel over the game; „Weiter spielen“ or a tap beside it closes it. While it is open, keys don't
 * reach the game (holding Esc still leaves it). Changes apply at once, the game keeps playing behind.
 */
export function PlayOptions({ children }: { children: ReactNode }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const { holding, props } = useHold(() => setOpen(true), HOLD_MS);
  const label = t({ de: "Einstellungen", ru: "Настройки", en: "Settings", zh: "设置", hi: "सेटिंग्स", es: "Ajustes", ar: "الإعدادات" });
  const hold = t({ de: "halten", ru: "удерживать", en: "hold", zh: "按住", hi: "दबाए रखें", es: "mantener pulsado", ar: "ضغط مطوّل" });

  // Keys typed into the options must not play: stop them before the game's own handlers on window (GameShell's, added
  // earlier, still run first and keep holding Esc working).
  useEffect(() => {
    if (!open) return;
    const stop = (e: KeyboardEvent) => {
      if (e.key !== "Escape") e.stopImmediatePropagation();
    };
    window.addEventListener("keydown", stop, { capture: true });
    return () => window.removeEventListener("keydown", stop, { capture: true });
  }, [open]);

  return (
    <>
      <div className={`play-options-corner${holding ? " hinted" : ""}`} data-tap-keep>
        <button type="button" className={`hold-exit play-options-button${holding ? " holding" : ""}`} aria-label={`${label} (${hold})`} {...props}>
          ⚙️
        </button>
        <span className="play-options-hint" aria-hidden>
          {label} · {hold}
        </span>
      </div>
      {open && (
        <div
          className="play-options-panel"
          data-tap-root
          onPointerDown={(e) => {
            e.stopPropagation();
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <section className="settings">{children}</section>
          <button type="button" className="play-options-close" onClick={() => setOpen(false)}>
            ▶ {t({ de: "Weiter spielen" })}
          </button>
        </div>
      )}
    </>
  );
}
