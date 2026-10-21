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
      <g className="wolke-body">
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
    </g>
  );
}
