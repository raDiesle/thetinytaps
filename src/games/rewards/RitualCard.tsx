import { type CSSProperties, useEffect, useRef } from "react";
import { useT } from "@/lib/language";
import type { Theme } from "./catalog";
import { ItemPic } from "./pictures";
import { A4 } from "./PrintPanel";
import type { Ritual } from "./rituals";

// A ritual's card (H-58): its picture, when it belongs and the words for the grown-up – what to ask, what to say, what
// the child says after them – and in a sentence or two how it goes best. The same card opens on screen when the child
// taps the ritual on the plan, and is printed on a page of its own, to keep at the mirror or by the bed.

/** The card itself, for screen and paper alike; `color` false: the picture's line-art twin, for a grey print. */
export function RitualWords({ ritual, color = true }: { ritual: Ritual; color?: boolean }) {
  const t = useT();
  return (
    <article className="pl-ritual">
      <header className="pl-ritual-head">
        <span className="pl-ritual-pic" aria-hidden>
          <ItemPic item={{ emoji: ritual.emoji, catalog: ritual.id }} lines={!color} />
        </span>
        <span>
          <span className="pl-ritual-name">{t(ritual.label)}</span>
          <span className="pl-ritual-when">{t(ritual.when)}</span>
        </span>
      </header>
      {ritual.parts.map((part) => (
        <section key={t(part.who)} className="pl-ritual-part">
          <p className="pl-ritual-who">{t(part.who)}</p>
          <ul>
            {part.lines.map((line) => (
              <li key={t(line.text)}>
                <span className="pl-ritual-sign" aria-hidden>
                  {line.emoji}
                </span>
                „{t(line.text)}“
              </li>
            ))}
          </ul>
        </section>
      ))}
      <p className="pl-ritual-how">{t(ritual.how)}</p>
    </article>
  );
}

/**
 * The ritual tapped on the plan: its card over the plan for the grown-up to read from, „✓ Gemacht“ ticking it like a
 * tap on any other card; ✕, Esc or a tap beside it close it without a tick.
 */
export function RitualDialog({ ritual, onDone, onClose }: { ritual: Ritual; onDone: () => void; onClose: () => void }) {
  const t = useT();
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: a tap beside the card closes it; Esc does the same
    <dialog
      ref={ref}
      className="pl-ritual-dialog"
      data-tap-root
      onClose={onClose}
      onClick={(event) => event.target === event.currentTarget && ref.current?.close()}
    >
      <button
        type="button"
        className="pl-ritual-close"
        aria-label={t({ de: "Schließen", ru: "Закрыть", en: "Close", zh: "关闭", hi: "बंद करें", es: "Cerrar", ar: "إغلاق" })}
        onClick={() => ref.current?.close()}
      >
        ✕
      </button>
      <RitualWords ritual={ritual} />
      <button
        type="button"
        className="pl-ritual-done"
        onClick={() => {
          onDone();
          ref.current?.close();
        }}
      >
        ✓ {t({ de: "Gemacht" })}
      </button>
    </dialog>
  );
}

/** Ritual cards on one A4 page: up to four – two by two standing, in a row lying – with lines to cut along. */
const RITUALS_PER_PAGE = 4;

/** The plan's rituals as cards on A4 pages after the plan, to cut apart and keep where each is done. */
export function RitualPages({
  rituals,
  orientation,
  color,
  theme,
}: {
  rituals: Ritual[];
  orientation: "landscape" | "portrait";
  color: boolean;
  theme: Theme;
}) {
  const landscape = orientation === "landscape";
  const pages = Array.from({ length: Math.ceil(rituals.length / RITUALS_PER_PAGE) }, (_, i) => rituals.slice(i * RITUALS_PER_PAGE, (i + 1) * RITUALS_PER_PAGE));
  return pages.map((page, i) => (
    <div
      key={i}
      className={`rw-page pl-ritual-page${landscape ? " pl-ritual-lying" : ""}${color ? "" : " rw-grey"}`}
      style={
        {
          width: `${landscape ? A4.long : A4.short}mm`,
          height: `${landscape ? A4.short : A4.long}mm`,
          ...(color ? { "--rw-main": theme.main, "--rw-paper": theme.paper } : {}),
        } as CSSProperties
      }
    >
      {page.map((ritual) => (
        <RitualWords key={ritual.id} ritual={ritual} color={color} />
      ))}
    </div>
  ));
}
