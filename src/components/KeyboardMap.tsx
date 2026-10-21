import type { CSSProperties } from "react";

/** How far each row starts to the right of the one above, in key widths, like on a real keyboard. */
const ROW_OFFSETS = [0, 0.5, 0.75, 1.25];

/**
 * A small picture of the real keyboard (not something to press), with
 * `highlight` lit up so children can find that key on their own keyboard.
 */
export function KeyboardMap({ rows, highlight, visible }: { rows: string[]; highlight?: string; visible: boolean }) {
  return (
    <div
      className={`keyboard-map${visible ? " shown" : ""}`}
      style={{ "--keys": Math.max(...rows.map((r) => r.length)) } as CSSProperties}
      aria-hidden
    >
      {rows.map((row, r) => (
        <div key={r} className="keyboard-map-row" style={{ "--offset": ROW_OFFSETS[r] ?? 0 } as CSSProperties}>
          {Array.from(row).map((key) => (
            <span key={key} className={`keyboard-map-key${key === highlight ? " lit" : ""}`}>
              {key}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
