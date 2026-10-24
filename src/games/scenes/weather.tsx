import type { CSSProperties } from "react";
import { depthScale, HORIZON } from "./layout";
import { nth } from "./shared";
import "./weather.css";

// Leaves and snow for the autumn and winter pictures: fallen leaves or snow
// patches on the ground (drawn with the background) and leaves or flakes in
// the air (the scene's Overlay), which only fall with "Bild bewegt sich auch von allein".

export const LEAF_COLOURS = ["#e76f51", "#f4a261", "#e9c46a", "#d62828", "#bc6c25"];
const LEAF = "M0 -9 C6 -6 7 3 0 9 C-7 3 -6 -6 0 -9 Z";

export function Leaf({ x, y, angle, scale, colour }: { x: number; y: number; angle: number; scale: number; colour: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`}>
      <path d={LEAF} fill={colour} />
      <path d="M0 -7 V8" stroke="#000" strokeOpacity="0.18" strokeWidth="1.2" strokeLinecap="round" />
    </g>
  );
}

/** Always the same "random" numbers for a seed, so the leaves don't jump around between visits. */
function random(seed: string) {
  let a = [...seed].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 2654435761), 1779033703);
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Somewhere on the ground: lower down is nearer, so there are more spots there. */
function onGround(rnd: () => number): [number, number] {
  return [rnd() * 1600, HORIZON + 20 + Math.sqrt(rnd()) * (1000 - HORIZON - 20)];
}

/**
 * With "Bild bewegt sich auch von allein", leaves and flakes in the air fall
 * through the whole picture; the delay puts each one where it is drawn at the start.
 */
function fall(y: number, seconds: number): CSSProperties {
  return {
    "--from": `${-y - 40}px`,
    "--to": `${1040 - y}px`,
    "--fall": `${seconds}s`,
    "--delay": `${(-seconds * (y + 40)) / 1080}s`,
  } as CSSProperties;
}

export function FallenLeaves({ seed }: { seed: string }) {
  const rnd = random(`${seed}-leaves`);
  const leaves = Array.from({ length: 70 }, () => {
    const [x, y] = onGround(rnd);
    return { x, y, angle: rnd() * 360, scale: depthScale(y) * (1.4 + rnd()), colour: LEAF_COLOURS[Math.floor(rnd() * 5)] };
  });
  return (
    <g className="weather-ground">
      {leaves.map((leaf, i) => (
        <Leaf key={i} {...leaf} />
      ))}
    </g>
  );
}

export function Snow({ seed }: { seed: string }) {
  const rnd = random(`${seed}-snow`);
  const patches = Array.from({ length: 34 }, () => {
    const [x, y] = onGround(rnd);
    return { x, y, rx: depthScale(y) * (60 + rnd() * 90) };
  });
  const drift = Array.from({ length: 17 }, (_, i) => `Q${i * 100 + 50} ${955 - rnd() * 30} ${(i + 1) * 100} 975`).join(" ");
  return (
    <g className="weather-ground">
      <rect x="0" y={HORIZON - 6} width="1600" height={1006 - HORIZON} fill="#fff" opacity="0.28" />
      {patches.map(({ x, y, rx }, i) => (
        <g key={i}>
          <ellipse cx={x} cy={y} rx={rx} ry={rx * 0.28} fill="#fff" opacity="0.9" />
          <ellipse cx={x + rx * 0.15} cy={y + rx * 0.08} rx={rx * 0.7} ry={rx * 0.14} fill="#dbe9fb" opacity="0.7" />
        </g>
      ))}
      <path d={`M-10 1010 L-10 975 L0 975 ${drift} L1610 975 L1610 1010 Z`} fill="#fff" />
    </g>
  );
}

export function FallingLeaves({ seed }: { seed: string }) {
  const rnd = random(`${seed}-falling`);
  return (
    <>
      {Array.from({ length: 12 }, (_, i) => {
        const x = rnd() * 1600;
        const y = 60 + rnd() * 760;
        return (
          <g key={i} className="weather-fall weather-leaf" style={fall(y, 14 + rnd() * 8)}>
            <g className="weather-sway" style={nth(i)}>
              <Leaf x={x} y={y} angle={rnd() * 360} scale={1.6 + rnd() * 0.6} colour={LEAF_COLOURS[i % 5]} />
            </g>
          </g>
        );
      })}
    </>
  );
}

export function FallingSnow({ seed }: { seed: string }) {
  const rnd = random(`${seed}-flakes`);
  return (
    <>
      {Array.from({ length: 50 }, (_, i) => {
        const y = rnd() * 1000;
        return (
          <g key={i} className="weather-fall weather-flake" style={fall(y, 10 + rnd() * 8)}>
            <circle cx={rnd() * 1600} cy={y} r={3 + rnd() * 4} fill="#fff" opacity={0.75 + rnd() * 0.25} />
          </g>
        );
      })}
    </>
  );
}
