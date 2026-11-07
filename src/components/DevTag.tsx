import { DEV } from "@/lib/buildInfo";

/**
 * Developer-only label in the bottom right corner naming the scene on screen with a short code ("C07") and its full
 * id, so feedback can say exactly which scene is meant. Renders nothing outside the dev server (`DEV`), so players
 * never see it; it lets taps through and stays tiny. Every game with many scenes or rounds mounts one.
 */
export function DevTag({ code, id }: { code: string; id?: string }) {
  if (!DEV) return null;
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        right: 6,
        bottom: 6,
        zIndex: 9999,
        padding: "2px 6px",
        borderRadius: 4,
        background: "rgba(0,0,0,.55)",
        color: "#fff",
        font: "600 11px/1.3 ui-monospace, monospace",
        pointerEvents: "none",
        userSelect: "text",
      }}
    >
      {code}
      {id ? ` · ${id}` : ""}
    </div>
  );
}

/** A letter for the `index`-th group (0 = A, 26 = AA …), the first half of a code like "C07". */
export function letterCode(index: number): string {
  return index < 26 ? String.fromCharCode(65 + index) : letterCode(Math.floor(index / 26) - 1) + String.fromCharCode(65 + (index % 26));
}
