import { memo, useMemo } from "react";
import { encode } from "uqr";

/** The white margin round the code, in modules: four, as the standard asks, so every phone camera finds it. */
const QUIET = 4;

/**
 * A QR code for `text`, drawn as one svg path of its dark modules on white (`uqr`, error correction M: a little
 * blur or a far-off television still scans). Dark on white and never tilted, so a phone held up to a television reads it.
 */
export const QrCode = memo(function QrCode({ text, size }: { text: string; size: number }) {
  const { path, modules } = useMemo(() => {
    const { data, size: count } = encode(text, { ecc: "M", border: 0 });
    let d = "";
    data.forEach((row, y) => {
      row.forEach((dark, x) => {
        if (dark) d += `M${x + QUIET} ${y + QUIET}h1v1h-1z`;
      });
    });
    return { path: d, modules: count + 2 * QUIET };
  }, [text]);
  return (
    <svg className="vo-qr" width={size} height={size} viewBox={`0 0 ${modules} ${modules}`} shapeRendering="crispEdges" role="img" aria-label={text}>
      <rect width={modules} height={modules} fill="#fff" />
      <path d={path} fill="#1f1a24" />
    </svg>
  );
});
