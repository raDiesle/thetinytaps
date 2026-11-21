import type { CSSProperties, PointerEvent } from "react";
import { BRIGHT_COLORS } from "@/components/TapFeedback";
import { useT } from "@/lib/language";
import { noPointerClick } from "@/lib/press";
import { tapState } from "@/lib/tapTargets";
import "./bigKeys.css";

/**
 * Wörter tippen's few big keys on a touch screen (W-02): the right letter and a few others, as big as the room beside the
 * picture (a wide screen) or under it (an upright one) allows. Pressing one counts like pressing the real key.
 * `wanted` is the right one, which wins a tap between two keys (`data-tap="goal"`); `hint` marks it after a few wrong
 * taps, still; `lit` presses it down and lights it once found.
 */
export function BigKeys({
  keys,
  wanted,
  onKey,
  label = (key) => key,
  hint = false,
  lit = false,
}: {
  keys: string[];
  wanted?: string;
  onKey: (key: string) => void;
  label?: (key: string) => string;
  hint?: boolean;
  lit?: boolean;
}) {
  const t = useT();
  const press = (key: string, e: PointerEvent) => {
    // The play area underneath would otherwise treat this as a tap beside the keys.
    e.stopPropagation();
    onKey(key);
  };
  // Beside the picture: one column for up to three keys, two for more. Under it: one row.
  const columns = keys.length <= 3 ? 1 : 2;
  return (
    <div
      className="wb-keys"
      role="group"
      aria-label={t({ de: "Tasten", ru: "Клавиши", en: "Keys", zh: "按键", hi: "बटन", es: "Teclas", ar: "أزرار" })}
      style={{ "--count": keys.length, "--columns": columns, "--rows": Math.ceil(keys.length / columns) } as CSSProperties}
    >
      {keys.map((key, i) => {
        const right = key === wanted;
        return (
          <button
            key={key}
            type="button"
            className={`wb-key${right && hint && !lit ? " hint" : ""}${right && lit ? " lit" : ""}`}
            style={{ "--key": BRIGHT_COLORS[i % BRIGHT_COLORS.length] } as CSSProperties}
            data-tap={tapState({ goal: right })}
            aria-label={label(key)}
            onPointerDown={(e) => press(key, e)}
            // A screen reader's activation or a keyboard sends no pointer.
            onClick={noPointerClick(() => onKey(key))}
          >
            {label(key)}
          </button>
        );
      })}
    </div>
  );
}
