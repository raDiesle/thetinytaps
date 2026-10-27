/** Where the clock hangs in the bathroom pictures (1376 × 768): on the wall above the bathtub, between the shower and Mama. */
const AT = { x: 610, y: 230, r: 62 };

/**
 * A wall clock drawn into the bathroom while Tapsi sits, so everybody plainly waits: the red second hand ticks,
 * the long hand goes round and round. It lies in a layer cut like the picture (`.pt-scene`), so it stays at its
 * place on the wall on every screen.
 */
export function WaitClock() {
  const ticks = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <svg className="pt-scene pt-clock" viewBox="0 0 1376 768" aria-hidden>
      <g transform={`translate(${AT.x} ${AT.y})`}>
        <circle r={AT.r} fill="#fff" stroke="#2a1e5c" strokeWidth="9" />
        <circle r={AT.r - 9} fill="none" stroke="#ffd23f" strokeWidth="5" />
        {ticks.map((deg) => (
          <line
            key={deg}
            y1={-(AT.r - 15)}
            y2={deg % 90 ? -(AT.r - 22) : -(AT.r - 27)}
            stroke="#2a1e5c"
            strokeWidth={deg % 90 ? 4 : 6}
            strokeLinecap="round"
            transform={`rotate(${deg})`}
          />
        ))}
        <line className="pt-clock-hour" y1="6" y2="-26" stroke="#2a1e5c" strokeWidth="9" strokeLinecap="round" />
        <line className="pt-clock-minute" y1="8" y2="-42" stroke="#2a1e5c" strokeWidth="6" strokeLinecap="round" />
        <line className="pt-clock-second" y1="12" y2="-46" stroke="#e63946" strokeWidth="3" strokeLinecap="round" />
        <circle r="6" fill="#e63946" stroke="#2a1e5c" strokeWidth="2" />
      </g>
    </svg>
  );
}
