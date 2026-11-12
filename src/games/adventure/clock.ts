/** Seconds as „3:07“, rounded up, so the last second shows „0:01“ and the end „0:00“. */
export function clock(seconds: number) {
  const s = Math.max(0, Math.ceil(seconds - 1e-6));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
