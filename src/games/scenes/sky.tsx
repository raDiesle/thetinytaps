import { Cloud, Face, nth } from "./shared";
import "./sky.css";

// Sun and rain cloud, the same in every scene. Each scene places them with `float`.

export function Wolke() {
  return (
    <>
      <g className="wolke-rain" stroke="#4dabf7" strokeWidth="5" strokeLinecap="round">
        {[176, 206, 236, 266, 296].map((x, i) => (
          <path key={x} d={`M${x} 196 l-4 16`} style={nth(i)} />
        ))}
      </g>
      {/* After the rain a little rainbow peeks out below the cloud. */}
      <g className="wolke-rainbow" fill="none" strokeWidth="8" strokeLinecap="round" style={{ transformOrigin: "240px 250px" }}>
        {["#ff6b6b", "#ffd60a", "#69db7c", "#4dabf7"].map((colour, i) => (
          <path key={colour} d={`M${170 + i * 9} 250 A${70 - i * 9} ${70 - i * 9} 0 0 1 ${310 - i * 9} 250`} stroke={colour} />
        ))}
      </g>
      <g className="wolke-body" style={{ transformOrigin: "240px 190px" }}>
        <Cloud x={190} y={150} />
      </g>
    </>
  );
}

export function Sonne() {
  return (
    <g className="sonne-body" style={{ transformOrigin: "1460px 120px" }}>
      <g className="sonne-rays" style={{ transformOrigin: "1460px 120px" }} stroke="#ffb703" strokeWidth="10" strokeLinecap="round">
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1="1460" y1="22" x2="1460" y2={i % 2 ? 36 : 44} transform={`rotate(${i * 30} 1460 120)`} />
        ))}
      </g>
      <circle cx="1460" cy="120" r="62" fill="#ffd60a" />
      <circle cx="1466" cy="126" r="56" fill="#ffc300" opacity="0.5" />
      <circle cx="1440" cy="94" r="16" fill="#fff" opacity="0.35" />
      <Face cx={1460} cy={112} size={2.4} />
      {/* The sun winks: a lid over its right eye. */}
      <g className="sonne-wink">
        <circle cx="1476.8" cy="112" r="10" fill="#ffcd05" />
        <path d="M1468 112 Q1477 119 1486 112" stroke="#2b2d42" strokeWidth="4" strokeLinecap="round" fill="none" />
      </g>
      <g className="sonne-sparkle" fill="#fff">
        {[
          [1372, 52],
          [1552, 58],
          [1378, 196],
          [1548, 190],
        ].map(([x, y], i) => (
          <path
            key={i}
            d={`M${x} ${y - 14} Q${x} ${y} ${x + 14} ${y} Q${x} ${y} ${x} ${y + 14} Q${x} ${y} ${x - 14} ${y} Q${x} ${y} ${x} ${y - 14} Z`}
            style={nth(i)}
          />
        ))}
      </g>
    </g>
  );
}
