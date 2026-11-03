import type { CSSProperties } from "react";
import type { Pair, Partner } from "./pairs";

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

/**
 * The one above in its box, every layer of it a small HTML layer of its own; `working` shows its partner there and
 * sets the two off doing what they are for (together.css). Without it only the one above shows, as over a wrong plate.
 */
export function PairPicture({ pair, working = false, label }: { pair: Pair; working?: boolean; label?: string }) {
  return (
    <span className={`tg-box pair-${pair.id}${working ? " working" : ""}`} role="img" aria-label={label} aria-hidden={label ? undefined : true}>
      {pair.layers.map(({ at: [x, y, w, h], cls, draw, tool }) => {
        const place = { left: `${x / 2}%`, top: `${y / 2}%`, width: `${w / 2}%`, height: `${h / 2}%` } as CSSProperties;
        if (tool) {
          // The partner is only there once it flew up into the picture.
          return working ? (
            <span key={cls} className={`tg-layer ${cls}`} style={place}>
              <PartnerIcon partner={pair.partner} />
            </span>
          ) : null;
        }
        return (
          <svg key={cls} className={`tg-layer ${cls}`} style={place} viewBox={`${x} ${y} ${w} ${h}`} aria-hidden>
            {draw}
          </svg>
        );
      })}
    </span>
  );
}
