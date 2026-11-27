import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useT } from "@/lib/language";
import { useHold } from "@/lib/hold";

/** How long ⚙️ has to be held while playing before the options open: as long as ✕, so a child's tap does nothing. */
const HOLD_MS = 500;

/**
 * How long the `intro` note stays as play starts, fade included (`play-options-intro` in playing.css): a short glance
 * for grown-ups, then the picture is the child's again – 9 s lingered far too long (user feedback, November 2026).
 */
export const INTRO_MS = 4000;

/**
 * A gear drawn in the same pencil line as the fullscreen note's corners beside it, eight teeth round a ring: the ⚙️
 * emoji on its own big note looked like another thing than its neighbour (user feedback, November 2026).
 */
const GEAR_PATH = (() => {
  const teeth = 8;
  const [outer, inner] = [10, 7.2];
  const at = (r: number, a: number) => `${(12 + r * Math.sin(a)).toFixed(2)} ${(12 - r * Math.cos(a)).toFixed(2)}`;
  let d = "";
  for (let i = 0; i < teeth; i++) {
    const a = (i * 2 * Math.PI) / teeth;
    d += `${i === 0 ? "M" : "L"}${at(inner, a - 0.3)} L${at(outer, a - 0.17)} L${at(outer, a + 0.17)} L${at(inner, a + 0.3)} `;
    d += `A${inner} ${inner} 0 0 1 ${at(inner, a + (2 * Math.PI) / teeth - 0.3)} `;
  }
  return `${d.trim()}Z`;
})();

/**
 * A game's options while it plays, for grown-ups: ⚙️ in the top corner as a drawn gear only, on a note just like the
 * fullscreen one beside it (its name just read out), always held
 * (the ring fills), opens `children` in a panel over the game; „Weiter spielen“ or a tap beside it closes it. While it
 * is open, keys don't reach the game (holding Esc still leaves it). Changes apply at once, the game keeps playing behind.
 * `intro` (a game with many ways to play) is a note under it as play starts, telling grown-ups what they can choose
 * there; it fades by itself and goes when the options are opened.
 *
 * `inline` puts the gear into a game's own strip of controls instead of the corner (Zähne putzen's ⚙️ beside its
 * progress bar, whose phases it chooses; user request, November 2026): the button takes the strip's classes, is held
 * just the same, and its panel still covers the whole game (`.play-area`), never only the strip.
 */
/** The drawn gear, on the corner's note or on a game's own button. */
const Gear = ({ className }: { className: string }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden>
    <path d={GEAR_PATH} />
    <circle cx="12" cy="12" r="3.2" />
  </svg>
);

export function PlayOptions({ children, intro, inline }: { children: ReactNode; intro?: ReactNode; inline?: { button: string; icon: string } }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [introShown, setIntroShown] = useState(intro !== undefined);
  const button = useRef<HTMLButtonElement>(null);
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

  const panel = open && (
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
  );

  if (inline) {
    // The strip is a positioned box of its own: the panel goes to the play area, so it covers the game as the corner's does.
    const host = button.current?.closest(".play-area");
    return (
      <>
        <button
          ref={button}
          type="button"
          className={`hold-exit ${inline.button}${holding ? " holding" : ""}`}
          aria-label={`${label} (${hold})`}
          data-tap-keep
          {...props}
        >
          <Gear className={inline.icon} />
        </button>
        {panel && host ? createPortal(panel, host) : panel}
      </>
    );
  }

  return (
    <>
      <div className="play-options-corner" data-tap-keep>
        <button type="button" className={`hold-exit play-options-button${holding ? " holding" : ""}`} aria-label={`${label} (${hold})`} {...props}>
          <Gear className="play-options-icon" />
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
      {panel}
    </>
  );
}
