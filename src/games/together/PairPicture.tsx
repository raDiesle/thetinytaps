import type { CSSProperties } from "react";
import type { Pair, Partner } from "./pairs";
import { BOX_H, BOX_W } from "./scene";

/** The partner as it lies on its plate: its emoji or its drawing, filling its box. */
export function PartnerIcon({ partner }: { partner: Partner }) {
  return partner.emoji ? (
    <span className="tg-icon tg-emoji" aria-hidden>
      {partner.emoji}
    </span>
  ) : (
    <svg className="tg-icon" viewBox="0 0 100 100" aria-hidden>
      {partner.draw}
    </svg>
  );
}

/** Per cent of the box's width or height. */
const px = (n: number) => `${(n / BOX_W) * 100}%`;
const py = (n: number) => `${(n / BOX_H) * 100}%`;

/**
 * The one above in its wide box, every layer of it a small HTML layer of its own; `working` shows its partner there and
 * sets the two off doing what they are for (together.css). Without it only the one above shows, as over a wrong plate.
 */
export function PairPicture({ pair, working = false, label }: { pair: Pair; working?: boolean; label?: string }) {
  const style = pair.start === undefined ? undefined : ({ "--t": `${pair.start}ms` } as CSSProperties);
  return (
    <span
      className={`tg-box pair-${pair.id}${pair.act ? ` scene act-${pair.act}` : ""}${working ? " working" : ""}`}
      style={style}
      role="img"
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {pair.layers.map(({ at: [x, y, w, h], cls, draw, html, emoji, flip, props, tool, style: own }) => {
        const place = { left: px(x), top: py(y), width: px(w), height: py(h), ...own } as CSSProperties;
        if (tool) {
          // The partner is only there once it flew up into the picture; inside it, the act's motion.
          return working ? (
            <span key={cls} className={`tg-layer ${cls}`} style={place}>
              <span className="tg-act">
                <PartnerIcon partner={pair.partner} />
              </span>
            </span>
          ) : null;
        }
        if (emoji)
          return (
            <span key={cls} className={`tg-layer ${cls}`} style={place} aria-hidden>
              <span className={`tg-icon tg-emoji${flip ? " tg-flip" : ""}`}>{emoji}</span>
            </span>
          );
        if (props)
          return (
            <span key={cls} className={`tg-layer ${cls}`} style={place} aria-hidden>
              {props.map(([e, cx, cy, size], i) => (
                <span
                  key={`${e}-${i}`}
                  className="tg-prop"
                  style={{ left: px(cx - size / 2), top: py(cy - size / 2), width: px(size), height: py(size), "--s": size / BOX_H } as CSSProperties}
                >
                  {e}
                </span>
              ))}
            </span>
          );
        if (html)
          return (
            <span key={cls} className={`tg-layer ${cls}`} style={place} aria-hidden>
              {html}
            </span>
          );
        return (
          <svg key={cls} className={`tg-layer ${cls}`} style={place} viewBox={`${x} ${y} ${w} ${h}`} preserveAspectRatio="none" aria-hidden>
            {draw}
          </svg>
        );
      })}
    </span>
  );
}
