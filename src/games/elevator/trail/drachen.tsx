import type { ReactNode } from "react";
import { Cloud, INK } from "@/games/scenes/shared";
import { Apple, Ball, Carrot, Lantern, Plank } from "./items";
import type { SceneryProps } from "./types";

// "Der Drachen": from the garden over the meadow, past the dog, the horse and the apple tree,
// over the stream, through the dark tunnel in the hill and up the stairs to the big tree on the
// hilltop, where a squirrel holds the kite. World points: the ground is at y = 740, the hilltop
// at y = 380; the stairs climb from x 4450 to 5050.

export const GROUND_Y = 740;
export const TOP_Y = 380;

/** The tread middles of the six steps up the hill. */
export const STAIRS: [number, number][] = Array.from({ length: 6 }, (_, i) => [4500 + i * 100, 680 - i * 60]);

const GRASS = "#69db7c";
const EARTH = "#b08155";
const PATH = "#e9c891";
const WOOD = "#c08552";
const WOOD_DARK = "#8d5a3b";

/** A wobble when a wrong thing is tried; keyed so every try starts it anew. */
function Nope({ id, nope, children }: { id: string; nope: SceneryProps["nope"]; children: ReactNode }) {
  const on = nope?.id === id;
  return (
    <g key={on ? nope.n : 0} className={on ? "tl-nope" : undefined}>
      {children}
    </g>
  );
}

function Flower({ x, colour }: { x: number; colour: string }) {
  return (
    <g transform={`translate(${x} ${GROUND_Y})`}>
      <path d="M0 0 V-34" stroke="#2f9e44" strokeWidth="4" />
      {[0, 72, 144, 216, 288].map((a) => (
        <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 9} cy={-40 + Math.sin((a * Math.PI) / 180) * 9} r="7" fill={colour} />
      ))}
      <circle cx="0" cy="-40" r="5" fill="#ffd43b" />
    </g>
  );
}

function House() {
  return (
    <g>
      <rect x="40" y="440" width="360" height="300" fill="#ffe8cc" stroke={INK} strokeWidth="5" />
      <path d="M10 450 L220 290 L430 450 Z" fill="#e8590c" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <rect x="320" y="320" width="40" height="70" fill="#adb5bd" stroke={INK} strokeWidth="4" />
      {[90, 170].map((x) => (
        <g key={x}>
          <rect x={x} y="490" width="60" height="60" rx="6" fill="#a5d8ff" stroke={INK} strokeWidth="4" />
          <path d={`M${x + 30} 490 V550 M${x} 520 H${x + 60}`} stroke={INK} strokeWidth="3" />
        </g>
      ))}
      <rect x="250" y="610" width="80" height="130" rx="8" fill="#4dabf7" stroke={INK} strokeWidth="5" />
      <circle cx="312" cy="678" r="6" fill="#ffd43b" stroke={INK} strokeWidth="2" />
      <rect x="236" y="736" width="108" height="10" rx="4" fill="#adb5bd" />
    </g>
  );
}

function GardenFence() {
  const pickets = [];
  for (let x = -760; x <= 1170; x += 42) if (x < 30 || x > 410) pickets.push(x);
  return (
    <g fill="#fff" stroke="#adb5bd" strokeWidth="3">
      {[676, 706].map((y) => (
        <g key={y}>
          <rect x="-760" y={y} width="790" height="10" />
          <rect x="400" y={y} width="790" height="10" />
        </g>
      ))}
      {pickets.map((x) => (
        <path key={x} d={`M${x} 740 V666 L${x + 13} 652 L${x + 26} 666 V740 Z`} />
      ))}
      {/* The open gate, swung back */}
      <path d="M1200 740 V660 L1250 630 V716 Z" />
    </g>
  );
}

function VegPatch({ carrot }: { carrot: boolean }) {
  return (
    <g>
      <ellipse cx="830" cy="742" rx="90" ry="22" fill="#8d5a3b" />
      {[770, 890].map((x) => (
        <g key={x}>
          <circle cx={x} cy="722" r="22" fill="#8ce99a" stroke="#2b8a3e" strokeWidth="3" />
          <circle cx={x} cy="722" r="11" fill="#b2f2bb" />
        </g>
      ))}
      {carrot ? (
        <g clipPath="url(#tl-soil)">
          <clipPath id="tl-soil">
            <rect x="760" y="560" width="140" height="180" />
          </clipPath>
          <g transform="translate(830 790)">
            <Carrot />
          </g>
        </g>
      ) : (
        <ellipse cx="830" cy="734" rx="16" ry="6" fill="#5c3b1e" />
      )}
      {/* Soil in front hides the carrot's root */}
      <path d="M760 742 Q830 726 900 742 Q830 760 760 742 Z" fill="#8d5a3b" />
    </g>
  );
}

function Shed({ plank }: { plank: boolean }) {
  return (
    <g>
      <rect x="960" y="560" width="180" height="180" fill={WOOD} stroke={INK} strokeWidth="5" />
      {[990, 1020, 1050, 1080, 1110].map((x) => (
        <path key={x} d={`M${x} 566 V736`} stroke={WOOD_DARK} strokeWidth="3" />
      ))}
      <path d="M940 570 L1050 500 L1160 570 Z" fill="#495057" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <rect x="1020" y="620" width="70" height="120" fill="#a0673a" stroke={INK} strokeWidth="4" />
      {plank && (
        <g transform="translate(902 740) rotate(-72)">
          <g transform="translate(110 0)">
            <Plank />
          </g>
        </g>
      )}
    </g>
  );
}

function Dog({ done, here, nope }: SceneryProps) {
  const solved = done.includes("dog");
  return (
    <g transform="translate(1600 740) scale(1.25)">
      <g className={`tl-dog${solved ? " done" : ""}`}>
        <Nope id="dog" nope={nope}>
          <g className={here === "dog" && !solved ? "tl-meet" : undefined}>
            <path className="tl-dog-tail" d="M66 -36 Q96 -50 92 -84" stroke="#a0673a" strokeWidth="12" strokeLinecap="round" fill="none" />
            <ellipse cx="20" cy="-34" rx="58" ry="30" fill="#d9a066" stroke={INK} strokeWidth="4" />
            <ellipse cx="34" cy="-30" rx="22" ry="16" fill="#f1d3a8" />
            {[-26, -6, 46, 64].map((x) => (
              <ellipse key={x} cx={x} cy="-6" rx="14" ry="8" fill="#d9a066" stroke={INK} strokeWidth="3.5" />
            ))}
            <g className="tl-dog-head" style={{ transformOrigin: "-40px -50px" }}>
              <circle cx="-50" cy="-66" r="32" fill="#d9a066" stroke={INK} strokeWidth="4" />
              <ellipse cx="-80" cy="-56" rx="20" ry="14" fill="#f1d3a8" stroke={INK} strokeWidth="3.5" />
              <circle cx="-96" cy="-60" r="7" fill={INK} />
              <circle cx="-56" cy="-74" r="5" fill={INK} />
              <path d="M-36 -94 Q-14 -86 -22 -52 Q-36 -60 -36 -94 Z" fill="#8d5a3b" stroke={INK} strokeWidth="3" />
              <path d="M-30 -40 Q-50 -34 -66 -42" stroke="#e03131" strokeWidth="8" strokeLinecap="round" fill="none" />
              {solved ? (
                <g transform="translate(-96 -18) scale(0.7)">
                  <Ball />
                </g>
              ) : (
                <path d="M-84 -44 Q-78 -36 -70 -42" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
              )}
            </g>
          </g>
        </Nope>
      </g>
    </g>
  );
}

function Hut({ lantern }: { lantern: boolean }) {
  return (
    <g>
      <rect x="1870" y="580" width="200" height="160" fill="#e0a96d" stroke={INK} strokeWidth="5" />
      <path d="M1850 590 L1970 510 L2090 590 Z" fill="#c92a2a" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <rect x="1990" y="640" width="54" height="100" fill="#a0673a" stroke={INK} strokeWidth="4" />
      <rect x="1900" y="620" width="56" height="46" rx="5" fill="#a5d8ff" stroke={INK} strokeWidth="4" />
      {/* The hook the lantern hangs on */}
      <path d="M1870 600 H1834 V612" stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round" />
      {lantern && (
        <g transform="translate(1834 728)">
          <Lantern />
        </g>
      )}
    </g>
  );
}

function Paddock() {
  return (
    <g stroke={WOOD_DARK} strokeWidth="4" fill={WOOD}>
      <rect x="2150" y="640" width="680" height="12" />
      <rect x="2150" y="676" width="680" height="12" />
      {[2150, 2320, 2490, 2660, 2830].map((x) => (
        <rect key={x} x={x - 9} y="620" width="18" height="110" rx="4" />
      ))}
    </g>
  );
}

function Horse({ done, here, nope }: SceneryProps) {
  const solved = done.includes("horse");
  return (
    <g transform="translate(2480 740)">
      <g className={`tl-horse${solved ? " done" : ""}`}>
        <Nope id="horse" nope={nope}>
          <g className={here === "horse" && !solved ? "tl-meet" : undefined}>
            <path d="M92 -168 Q130 -150 116 -84" stroke="#5c3b1e" strokeWidth="18" strokeLinecap="round" fill="none" />
            {[-66, -38, 44, 72].map((x) => (
              <g key={x}>
                <rect x={x - 9} y="-130" width="18" height="122" rx="7" fill="#a0673a" stroke={INK} strokeWidth="3.5" />
                <rect x={x - 11} y="-18" width="22" height="18" rx="4" fill="#495057" />
              </g>
            ))}
            <ellipse cx="4" cy="-152" rx="104" ry="52" fill="#a0673a" stroke={INK} strokeWidth="4" />
            <g className="tl-horse-head" style={{ transformOrigin: "-70px -180px" }}>
              <path d="M-60 -190 L-104 -268 L-60 -282 L-30 -176 Z" fill="#a0673a" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
              <path d="M-62 -280 Q-40 -240 -32 -186" stroke="#5c3b1e" strokeWidth="14" strokeLinecap="round" fill="none" />
              <path
                d="M-108 -276 Q-150 -256 -176 -210 Q-180 -190 -160 -186 Q-120 -204 -86 -240 Z"
                fill="#a0673a"
                stroke={INK}
                strokeWidth="4"
                strokeLinejoin="round"
              />
              <ellipse cx="-164" cy="-202" rx="20" ry="16" fill="#d9a066" stroke={INK} strokeWidth="3" />
              <circle cx="-170" cy="-208" r="3.5" fill={INK} />
              <circle cx="-118" cy="-250" r="6" fill={INK} />
              <path d="M-92 -276 L-84 -300 L-76 -274 Z" fill="#a0673a" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
              {solved && (
                <g transform="translate(-178 -184) rotate(-70) scale(0.5)">
                  <g className="tl-chew">
                    <Carrot />
                  </g>
                </g>
              )}
            </g>
          </g>
        </Nope>
      </g>
    </g>
  );
}

function AppleTree({ apple }: { apple: boolean }) {
  return (
    <g>
      <path d="M2840 740 L2848 540 H2872 L2880 740 Z" fill={WOOD_DARK} stroke={INK} strokeWidth="4" />
      {[
        [2860, 440, 110],
        [2770, 500, 80],
        [2950, 500, 84],
        [2860, 530, 80],
      ].map(([x, y, r]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={r} fill="#40c057" stroke="#2b8a3e" strokeWidth="4" />
      ))}
      {[
        [2800, 450],
        [2900, 410],
        [2780, 540],
        [2960, 470],
      ].map(([x, y]) => (
        <g key={`${x}${y}`} transform={`translate(${x} ${y}) scale(0.6)`}>
          <Apple />
        </g>
      ))}
      {apple && (
        <g transform="translate(2930 612) scale(0.8)">
          <Apple />
        </g>
      )}
    </g>
  );
}

function Stream({ done }: { done: string[] }) {
  const bridged = done.includes("stream");
  return (
    <g>
      <path d="M3040 740 Q3060 820 3110 826 H3190 Q3240 820 3260 740 Z" fill="#4dabf7" />
      <path className="tl-water" d="M3060 770 q20 -8 40 0 t40 0 t40 0 t40 0 t20 0" stroke="#d0ebff" strokeWidth="5" fill="none" />
      <g transform="translate(3110 800)">
        <g className={`tl-fish${bridged ? " jump" : ""}`}>
          <ellipse cx="0" cy="0" rx="22" ry="12" fill="#ff922b" stroke={INK} strokeWidth="3" />
          <path d="M18 0 L36 -12 V12 Z" fill="#ff922b" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <circle cx="-10" cy="-3" r="3" fill={INK} />
        </g>
      </g>
      {bridged && (
        <g transform="translate(3150 752)">
          <g className="tl-plank-laid">
            <Plank />
          </g>
        </g>
      )}
    </g>
  );
}

const TUNNEL = "M3420 740 V630 Q3420 570 3490 570 H4170 Q4240 570 4240 630 V740 Z";

function Hill({ done }: { done: string[] }) {
  const lit = done.includes("cave");
  return (
    <g>
      <path d="M3300 740 Q3420 320 3830 290 Q4250 320 4370 740 Z" fill="#51cf66" stroke="#2b8a3e" strokeWidth="5" />
      {[
        [3560, 430],
        [3900, 380],
        [4120, 470],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="14" fill="#ffd43b" opacity="0.8" />
      ))}
      <path d={TUNNEL} fill="#6b4f3a" stroke={INK} strokeWidth="5" />
      {/* Inside the tunnel: glow worms, a sleeping bat and drops */}
      {[3600, 3700, 3820, 3960, 4080].map((x, i) => (
        <circle key={x} className="tl-glow" cx={x} cy={584 + (i % 2) * 10} r="5" fill="#d8f5a2" />
      ))}
      <g transform="translate(3880 572)">
        <path d="M0 0 V10" stroke={INK} strokeWidth="3" />
        <ellipse cx="0" cy="26" rx="14" ry="18" fill="#5f3dc4" />
        <path d="M-14 18 Q-34 30 -24 44 Q-16 36 -12 40 Z M14 18 Q34 30 24 44 Q16 36 12 40 Z" fill="#7048e8" />
        <path d="M-6 34 q3 3 6 0 M2 34 q3 3 6 0" stroke="#fff" strokeWidth="2" fill="none" />
      </g>
      {lit && (
        <g transform="translate(3520 700)">
          <Lantern lit />
        </g>
      )}
      <path d="M3520 570 V584" stroke={INK} strokeWidth="4" />
      <path className={`tl-dark${lit ? " lit" : ""}`} d={TUNNEL} fill="#101028" />
    </g>
  );
}

function Stairs() {
  return (
    <g>
      <path d={`M4330 740 C4420 520 4700 ${TOP_Y} 5000 ${TOP_Y} H9600 V2600 H4330 Z`} fill="#51cf66" stroke="#2b8a3e" strokeWidth="5" />
      {STAIRS.map(([x, y], i) => (
        <rect key={i} x={x - 50} y={y} width="104" height={GROUND_Y - y} fill="#ced4da" stroke="#868e96" strokeWidth="4" />
      ))}
    </g>
  );
}

function BigTree({ done, here, nope }: SceneryProps) {
  const solved = done.includes("squirrel");
  return (
    <g>
      <path d={`M5570 ${TOP_Y} L5580 120 H5624 L5634 ${TOP_Y} Z`} fill={WOOD_DARK} stroke={INK} strokeWidth="5" />
      <path d="M5584 230 Q5530 200 5450 196" stroke={WOOD_DARK} strokeWidth="18" strokeLinecap="round" fill="none" />
      {[
        [5600, 30, 170],
        [5450, 80, 110],
        [5770, 80, 124],
        [5620, 130, 110],
      ].map(([x, y, r]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={r} fill="#2f9e44" stroke="#2b8a3e" strokeWidth="5" />
      ))}
      <g transform="translate(5500 196)">
        <Nope id="squirrel" nope={nope}>
          <g className={`tl-squirrel${here === "squirrel" && !solved ? " tl-meet" : ""}${solved ? " done" : ""}`}>
            <path className="tl-squirrel-tail" d="M24 -6 Q66 -20 56 -70 Q46 -96 24 -80 Q40 -50 14 -22 Z" fill="#e8590c" stroke={INK} strokeWidth="3.5" />
            <ellipse cx="4" cy="-22" rx="20" ry="24" fill="#f76707" stroke={INK} strokeWidth="3.5" />
            <circle cx="-12" cy="-52" r="17" fill="#f76707" stroke={INK} strokeWidth="3.5" />
            <path d="M-8 -66 L-2 -80 L4 -64 Z" fill="#f76707" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
            <circle cx="-18" cy="-56" r="3.5" fill={INK} />
            <circle cx="-28" cy="-48" r="3" fill={INK} />
            {solved && (
              <g transform="translate(-30 -14) scale(0.55)">
                <g className="tl-chew">
                  <Apple />
                </g>
              </g>
            )}
          </g>
        </Nope>
      </g>
    </g>
  );
}

/** The world of "Der Drachen", drawn as far as the child has come. */
export function DrachenScenery(props: SceneryProps) {
  const { done } = props;
  return (
    <g>
      <rect x="-1200" y={GROUND_Y} width="5600" height="2000" fill={EARTH} />
      <rect x="-1200" y={GROUND_Y - 4} width="5600" height="22" fill={GRASS} />
      <rect x="-1200" y={GROUND_Y + 10} width="5600" height="20" fill={PATH} />
      <House />
      <GardenFence />
      <VegPatch carrot={!done.includes("carrot")} />
      <Shed plank={!done.includes("plank")} />
      {!done.includes("ball") && (
        <g transform="translate(620 744)">
          <Ball />
        </g>
      )}
      {[1300, 1700, 2100, 2650, 2980, 4400].map((x, i) => (
        <Flower key={x} x={x} colour={["#ff8fa3", "#ffd43b", "#cc5de8", "#fff"][i % 4]} />
      ))}
      <Hut lantern={!done.includes("lantern")} />
      <Paddock />
      <Horse {...props} />
      <AppleTree apple={!done.includes("apple")} />
      <Dog {...props} />
      <Stream done={done} />
      <Hill done={done} />
      <Stairs />
      {[5150, 5900, 6100].map((x, i) => (
        <g key={x} transform={`translate(0 ${TOP_Y - GROUND_Y})`}>
          <Flower x={x} colour={["#ff8fa3", "#cc5de8", "#ffd43b"][i]} />
        </g>
      ))}
      <BigTree {...props} />
    </g>
  );
}

/** Far hills, clouds and the sun; drawn at a third of the world's speed. */
export function DrachenBackdrop() {
  return (
    <g>
      <circle cx="1400" cy="130" r="70" fill="#ffe066" />
      <Cloud x={200} y={120} scale={1.2} />
      <Cloud x={900} y={210} />
      <Cloud x={1900} y={100} scale={1.4} />
      <Cloud x={2700} y={190} />
      <path d="M-1200 640 Q-700 480 -200 620 Q300 470 900 600 Q1500 450 2100 610 Q2700 470 3300 600 Q3800 500 4400 620 V1600 H-1200 Z" fill="#b2f2bb" />
      <path d="M-1200 690 Q-500 600 200 680 Q900 590 1600 680 Q2300 600 3000 680 Q3700 610 4400 680 V1600 H-1200 Z" fill="#8ce99a" />
    </g>
  );
}
