import { type CSSProperties, type ReactNode, useEffect, useState } from "react";
import { useT } from "@/lib/language";
import { useHold } from "@/lib/hold";

/** How long ⚙️ has to be held while playing before the options open: as long as ✕, so a child's tap does nothing. */
const HOLD_MS = 500;

/** How long the `intro` note stays as play starts, before it fades (`play-options-intro` in playing.css). */
const INTRO_MS = 9000;

/**
 * A game's options while it plays, for grown-ups: ⚙️ in the top corner with its name in words beside it, always held
 * (the ring fills), opens `children` in a panel over the game; „Weiter spielen“ or a tap beside it closes it. While it
 * is open, keys don't reach the game (holding Esc still leaves it). Changes apply at once, the game keeps playing behind.
 * `intro` (a game with many ways to play) is a note under it as play starts, telling grown-ups what they can choose
 * there; it fades by itself and goes when the options are opened.
 */
export function PlayOptions({ children, intro, iconOnly = false }: { children: ReactNode; intro?: ReactNode; iconOnly?: boolean }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [introShown, setIntroShown] = useState(intro !== undefined);
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

  // Once the options were opened, grown-ups know where they are: the intro goes for good. It also goes after its time
  // (its fade ends then), so nothing is left animating while the child plays.
  useEffect(() => {
    if (open) setIntroShown(false);
  }, [open]);

  return (
    <>
      <div className="play-options-corner" data-tap-keep>
        <button type="button" className={`hold-exit play-options-button${holding ? " holding" : ""}`} aria-label={`${label} (${hold})`} {...props}>
          <span className="play-options-gear" aria-hidden>
            ⚙️
          </span>
          {/* `iconOnly`: just the gear, its name only read out (a game whose corner has room for nothing more). */}
          {!iconOnly && (
            <span className="play-options-label" aria-hidden>
              <b>{label}</b>
              <small>{hold}</small>
            </span>
          )}
        </button>
        {introShown && (
          <div
            className="play-options-intro"
            style={{ "--intro-ms": `${INTRO_MS}ms` } as CSSProperties}
            onAnimationEnd={(e) => {
              if (e.animationName === "play-options-intro") setIntroShown(false);
            }}
          >
            {intro}
          </div>
        )}
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
            ▶ {t({ de: "Weiter spielen", en: "Keep playing", zh: "继续玩", hi: "खेलते रहें", es: "Seguir jugando", ar: "متابعة اللعب", ru: "Играть дальше" })}
          </button>
        </div>
      )}
    </>
  );
}
