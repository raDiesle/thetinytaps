import { INK } from "@/components/drawing";

// Small drawings several films share. They stand here, not in one film's module, so a film that borrows one never
// loads the other film's code with it: each film is a chunk of its own (`../catalog.ts`).

/** A wheel with its tread and a yellow rim, centred on (0, 0); it turns while `spin`. */
export function Wheel({ r, spin }: { r: number; spin: boolean }) {
  return (
    <g className={spin ? "fm-wheel spin" : "fm-wheel"}>
      <circle r={r} fill="#343a40" stroke={INK} strokeWidth="4" />
      <circle r={r - 6} fill="none" stroke="#212529" strokeWidth="10" strokeDasharray="10 12" />
      <circle r={r * 0.56} fill="#fab005" stroke={INK} strokeWidth="4" />
      <path d={`M${-r * 0.4} 0 H${r * 0.4} M0 ${-r * 0.4} V${r * 0.4}`} stroke="#e8a317" strokeWidth="5" />
      <circle r={r * 0.16} fill="#495057" stroke={INK} strokeWidth="3" />
    </g>
  );
}

/** The grey-white rain cloud, centred on (0, 0); while it rains (`raining`) drops fall from it down to the bed. */
export function RainCloud({ raining }: { raining: boolean }) {
  return (
    <g>
      {raining && (
        <g stroke="#4dabf7" strokeWidth="7" strokeLinecap="round">
          {[0, 1, 2].map((n) => (
            <g key={n} className="fm-gt-rain" style={{ animationDelay: `calc(${2 + n * 0.35}s * var(--fm-pace))` }}>
              {[-110, -60, -10, 40, 90].map((x, i) => (
                <path key={x} d={`M${x + n * 16} ${50 + ((i + n) % 3) * 30} l-6 26`} />
              ))}
            </g>
          ))}
        </g>
      )}
      <g transform="scale(1.4)">
        <path
          d="M-90 20 Q-112 20 -110 0 Q-108 -22 -80 -20 Q-74 -54 -36 -52 Q-14 -80 22 -66 Q52 -78 66 -44 Q104 -46 106 -12 Q110 20 82 20 Z"
          fill="#e9ecef"
          stroke="#868e96"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path d="M-70 4 Q-20 14 60 4" stroke="#f8f9fa" strokeWidth="10" strokeLinecap="round" fill="none" />
      </g>
    </g>
  );
}
