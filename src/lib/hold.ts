import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";

const isPressKey = (key: string) => key === "Enter" || key === " ";

/**
 * A button that has to be held for `ms` before it acts (✕ while playing, ⚙️ of a game's options): letting go earlier
 * does nothing, so a child's tap can't set it off. Spread `props` on the button; `holding` is true while the ring fills
 * (the class `hold-exit holding` animates it over `--hold-ms`, set in `props.style`).
 */
export function useHold(onDone: () => void, ms: number) {
  const [holding, setHolding] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const press = () => {
    if (timer.current) return;
    setHolding(true);
    timer.current = setTimeout(() => {
      timer.current = null;
      setHolding(false);
      done.current();
    }, ms);
  };

  const release = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setHolding(false);
  };

  const props = {
    style: { "--hold-ms": `${ms}ms` } as CSSProperties,
    onPointerDown: (e: PointerEvent<HTMLButtonElement>) => {
      // Keep the game from reacting to the tap on the button.
      e.stopPropagation();
      // A finger that slides a little still counts as holding.
      e.currentTarget.setPointerCapture(e.pointerId);
      press();
    },
    onPointerUp: release,
    onPointerCancel: release,
    onContextMenu: (e: { preventDefault: () => void }) => e.preventDefault(),
    onKeyDown: (e: KeyboardEvent) => {
      if (!isPressKey(e.key)) return;
      e.preventDefault();
      if (!e.repeat) press();
    },
    onKeyUp: (e: KeyboardEvent) => {
      if (isPressKey(e.key)) release();
    },
    onBlur: release,
  };

  return { holding, props };
}
