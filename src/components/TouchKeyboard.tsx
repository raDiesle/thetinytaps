import type { CSSProperties, PointerEvent } from "react";
import { useDevice } from "@/lib/device";
import { BRIGHT_COLORS } from "./Bursts";
import { Choice, SettingsGroup } from "./SettingControls";

/** Show big keys on the screen: only on touch devices without mouse or trackpad ("auto"), always, or never. */
export type TouchKeysMode = "auto" | "on" | "off";

const KEYS_PER_ROW = 10;

/**
 * On a computer without a touch screen the option is hidden and the keys stay off: real keys are easier than clicking.
 * `anyTouch`: "auto" shows the keys on every touch screen, also on a touch laptop or an iPad with keyboard.
 */
export function useTouchKeys(mode: TouchKeysMode, anyTouch = false) {
  const device = useDevice();
  return device.hasTouch && (mode === "on" || (mode === "auto" && (anyTouch || device.touchOnly)));
}

/** Splits keys into rows of ten, like a keyboard. */
export function keyRows(keys: string[]): string[][] {
  const rows: string[][] = [];
  for (let i = 0; i < keys.length; i += KEYS_PER_ROW) rows.push(keys.slice(i, i + KEYS_PER_ROW));
  return rows;
}

/**
 * Big on-screen keys for tablets. Pressing one counts like pressing the real
 * key; `highlight` marks the key that is wanted next.
 */
export function TouchKeyboard({
  rows,
  onKey,
  label = (key) => key,
  highlight,
}: {
  rows: string[][];
  onKey: (key: string) => void;
  label?: (key: string) => string;
  highlight?: string;
}) {
  const press = (key: string, e: PointerEvent) => {
    // The play area underneath would otherwise treat this as a tap next to the keys.
    e.stopPropagation();
    onKey(key);
  };

  let index = 0;
  return (
    <div className="touch-keyboard" role="group" aria-label="Tasten">
      {rows.map((row, r) => (
        <div key={r} className="touch-row">
          {row.map((key) => {
            const color = BRIGHT_COLORS[index++ % BRIGHT_COLORS.length];
            return (
              <button
                key={key}
                type="button"
                className={`touch-key${key === highlight ? " wanted" : ""}`}
                style={{ "--key": color } as CSSProperties}
                onPointerDown={(e) => press(key, e)}
              >
                {label(key)}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/** The parents' option for the on-screen keys; not shown on computers without a touch screen. */
export function TouchKeysSetting({
  value,
  onChange,
  anyTouch = false,
}: {
  value: TouchKeysMode;
  onChange: (mode: TouchKeysMode) => void;
  anyTouch?: boolean;
}) {
  const device = useDevice();
  if (!device.hasTouch) return null;
  return (
    <SettingsGroup title="Tablet">
      <Choice<TouchKeysMode>
        label="Tasten auf dem Bildschirm"
        value={value}
        onChange={onChange}
        options={[
          { value: "auto", label: anyTouch ? "📱 Auf Touch-Bildschirmen" : "📱 Nur auf Tablets" },
          { value: "on", label: "Immer" },
          { value: "off", label: "Nie (mit angeschlossener Tastatur)" },
        ]}
      />
    </SettingsGroup>
  );
}
