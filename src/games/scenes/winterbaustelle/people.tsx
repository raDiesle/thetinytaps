import type { ReactNode } from "react";
import { Lids } from "../baustelle/figures";
import { CHEEK, Eye, Face, INK, Inside, SKIN, nth } from "../shared";
import { Cap, Flake, SNOW, SNOW_SHADE, glint } from "./parts";

// The snowman and the people of the winter site. Each drawing stands with its foot point on (0, 0).

/** A snowman with a carrot nose, a top hat and a red scarf; he wobbles, lifts his hat and waves. */
export function Schneemann() {
  return (
    <>
      <g className="wb-sm-flakes">
        {[
          [-70, -250],
          [74, -236],
          [-92, -150],
          [100, -120],
        ].map(([x, y], i) => (
          <g key={x} style={nth(i)}>
            <Flake x={x} y={y} r={8} colour="#9fc4e4" />
          </g>
        ))}
      </g>
      <g className="wb-sm-body" style={{ transformOrigin: "0px 0px" }}>
        <circle cx="0" cy="-56" r="58" fill={SNOW_SHADE} />
        <circle cx="-6" cy="-62" r="51" fill={SNOW} />
        <g className="wb-sm-arm-l" style={{ transformOrigin: "-34px -154px" }}>
          <path d="M-34 -154 L-88 -186 M-72 -177 L-80 -200 M-72 -177 L-96 -176" stroke="#6f4520" strokeWidth="5" strokeLinecap="round" fill="none" />
        </g>
        <g className="wb-sm-arm" style={{ transformOrigin: "34px -154px" }}>
          <path d="M34 -154 L88 -190 M74 -181 L82 -204 M74 -181 L100 -182" stroke="#6f4520" strokeWidth="5" strokeLinecap="round" fill="none" />
        </g>
        <circle cx="0" cy="-146" r="42" fill={SNOW_SHADE} />
        <circle cx="-4" cy="-150" r="36" fill={SNOW} />
        {[-164, -144, -124].map((cy) => (
          <circle key={cy} cx="2" cy={cy} r="5" fill="#2b2d42" />
        ))}
        <path d="M-30 -186 Q0 -176 30 -186 L30 -175 Q0 -165 -30 -175 Z" fill="#e63946" />
        <path d="M-20 -182 V-171 M-8 -180 V-169 M4 -180 V-169 M16 -182 V-171" stroke="#ff8fa3" strokeWidth="3" />
        <path className="wb-sm-scarf" d="M12 -178 L22 -140 L34 -144 L26 -180 Z" fill="#e63946" style={{ transformOrigin: "19px -179px" }} />
        <g className="wb-sm-head" style={{ transformOrigin: "0px -184px" }}>
          <circle cx="0" cy="-212" r="30" fill={SNOW_SHADE} />
          <circle cx="-3" cy="-215" r="26" fill={SNOW} />
          <circle cx="-16" cy="-206" r="5" fill={CHEEK} opacity="0.5" />
          <circle cx="16" cy="-206" r="5" fill={CHEEK} opacity="0.5" />
          <Eye cx={-10} cy={-220} r={4} />
          <Eye cx={10} cy={-220} r={4} />
          <Lids
            eyes={[
              [-10, -220],
              [10, -220],
            ]}
            r={5}
            fill={SNOW}
          />
          {[
            [-10, -200],
            [-5, -196],
            [0, -195],
            [5, -196],
            [10, -200],
          ].map(([cx, cy]) => (
            <circle key={cx} cx={cx} cy={cy} r="2.2" fill="#2b2d42" />
          ))}
          <g className="wb-sm-nose" style={{ transformOrigin: "0px -210px" }}>
            <path d="M0 -215 L32 -208 L0 -204 Z" fill="#ff8c42" />
            <path d="M10 -212 l-2 4 M19 -210 l-2 3" stroke="#e76f51" strokeWidth="1.5" />
          </g>
          <g className="wb-sm-hat" style={{ transformOrigin: "0px -240px" }}>
            <rect x="-32" y="-244" width="64" height="8" rx="4" fill="#2b2d42" />
            <rect x="-22" y="-284" width="44" height="44" rx="4" fill="#2b2d42" />
            <rect x="-22" y="-254" width="44" height="8" fill="#e63946" />
            <rect x="-16" y="-280" width="6" height="22" rx="3" fill="#fff" opacity="0.15" />
            <Cap x={-22} y={-284} w={44} h={7} />
          </g>
        </g>
      </g>
    </>
  );
}

/** A child in winter clothes, standing; `children` are the arms. */
function Kid({ coat, hat, trim, children }: { coat: string; hat: string; trim: string; children?: ReactNode }) {
  return (
    <>
      <rect x="-14" y="-48" width="11" height="42" rx="5" fill="#1d3557" />
      <rect x="3" y="-48" width="11" height="42" rx="5" fill="#1d3557" />
      <rect x="-17" y="-10" width="15" height="10" rx="4" fill={INK} />
      <rect x="2" y="-10" width="15" height="10" rx="4" fill={INK} />
      <path d="M-22 -100 Q-30 -66 -27 -40 H27 Q30 -66 22 -100 Q0 -108 -22 -100 Z" fill={coat} />
      <path d="M0 -100 V-42" stroke={trim} strokeWidth="3" />
      {children}
      <circle cx="0" cy="-120" r="18" fill={SKIN} />
      <Face cx={0} cy={-121} size={0.62} />
      <Lids
        eyes={[
          [-4.34, -121],
          [4.34, -121],
        ]}
        r={2.6}
        fill={SKIN}
      />
      <path d="M-19 -124 Q-20 -144 0 -144 Q20 -144 19 -124 Z" fill={hat} />
      <rect x="-20" y="-128" width="40" height="7" rx="3.5" fill={trim} />
      <circle className="wb-bobble" cx="0" cy="-148" r="6" fill="#fff" />
      <rect x="-15" y="-104" width="30" height="7" rx="3.5" fill={trim} />
    </>
  );
}

/** A child on a wooden sled, facing left; the sled scoots forward, the child waves. */
export function Schlitten() {
  return (
    <>
      <g className="wb-schlitten-spray" fill={SNOW} stroke={SNOW_SHADE} strokeWidth="2">
        {[
          [104, -10],
          [120, -20],
          [134, -8],
        ].map(([cx, cy], i) => (
          <circle key={cx} cx={cx} cy={cy} r="9" style={nth(i)} />
        ))}
      </g>
      <g className="wb-schlitten-ride" style={{ transformOrigin: "0px 0px" }}>
        <path d="M100 -2 H-88 Q-114 -2 -114 -24 Q-114 -36 -102 -36" stroke="#6f4520" strokeWidth="7" strokeLinecap="round" fill="none" />
        <path d="M-60 -2 V-32 M0 -2 V-32 M60 -2 V-32" stroke="#8d5a2b" strokeWidth="6" />
        <rect x="-96" y="-42" width="188" height="12" rx="4" fill="#c68b59" />
        <rect x="-92" y="-42" width="180" height="4" rx="2" fill="#e0a96d" />
        <g className="wb-schlitten-bell" style={{ transformOrigin: "-102px -36px" }}>
          <path d="M-102 -36 V-30" stroke="#a0522d" strokeWidth="2" />
          <circle cx="-102" cy="-25" r="6" fill="#ffd60a" />
          <circle cx="-104" cy="-27" r="2" fill="#fff" opacity="0.7" />
        </g>
        {/* The child sits on the sled, legs to the front */}
        <path d="M-6 -50 H-60" stroke="#1d3557" strokeWidth="15" strokeLinecap="round" />
        <rect x="-78" y="-62" width="16" height="22" rx="6" fill={INK} />
        <path d="M-28 -42 Q-32 -82 -16 -104 Q4 -112 22 -100 Q32 -72 28 -42 Z" fill="#4895ef" />
        <path d="M-102 -36 Q-80 -52 -50 -66" stroke="#a0522d" strokeWidth="2.5" fill="none" />
        <path d="M-10 -88 L-44 -68" stroke="#4895ef" strokeWidth="11" strokeLinecap="round" />
        <circle cx="-48" cy="-66" r="7" fill="#ff5d73" />
        <g className="wb-schlitten-arm" style={{ transformOrigin: "16px -92px" }}>
          <path d="M16 -92 L40 -122" stroke="#4895ef" strokeWidth="11" strokeLinecap="round" />
          <circle cx="42" cy="-127" r="7" fill="#ff5d73" />
        </g>
        <rect x="-16" y="-108" width="34" height="8" rx="4" fill="#ffd60a" />
        <path className="wb-schlitten-scarf" d="M12 -104 L34 -98 L32 -88 L8 -98 Z" fill="#ffd60a" style={{ transformOrigin: "10px -102px" }} />
        <circle cx="0" cy="-124" r="19" fill={SKIN} />
        <Face cx={0} cy={-124} size={0.66} />
        <Lids
          eyes={[
            [-4.62, -124],
            [4.62, -124],
          ]}
          r={2.8}
          fill={SKIN}
        />
        <path d="M-20 -128 Q-21 -149 0 -149 Q21 -149 20 -128 Z" fill="#ff7bd0" />
        <rect x="-21" y="-132" width="42" height="7" rx="3.5" fill="#ffb3e6" />
        <circle className="wb-bobble" cx="0" cy="-153" r="6.5" fill="#fff" />
      </g>
    </>
  );
}

/** Two children having a snowball fight; the left one throws, the right one ducks behind a snow wall. */
export function Schneeballkinder() {
  return (
    <>
      {/* Spare snowballs */}
      <g fill={SNOW} stroke={SNOW_SHADE} strokeWidth="2">
        <circle cx="-122" cy="-8" r="9" />
        <circle cx="-104" cy="-8" r="9" />
        <circle cx="-113" cy="-22" r="9" />
      </g>
      <g transform="translate(-68 0)">
        <g className="wb-kinder-a" style={{ transformOrigin: "0px 0px" }}>
          <Kid coat="#3ec300" hat="#ffd60a" trim="#ffb703">
            <path d="M-20 -94 L-30 -62" stroke="#3ec300" strokeWidth="10" strokeLinecap="round" />
            <circle cx="-31" cy="-58" r="6" fill="#ffb703" />
            <g className="wb-kinder-throw" style={{ transformOrigin: "18px -94px" }}>
              <path d="M18 -94 L30 -128" stroke="#3ec300" strokeWidth="10" strokeLinecap="round" />
              <circle cx="31" cy="-132" r="6" fill="#ffb703" />
              <circle className="wb-kinder-handball" cx="34" cy="-142" r="9" fill={SNOW} stroke={SNOW_SHADE} strokeWidth="2" />
            </g>
          </Kid>
        </g>
      </g>
      <g transform="translate(70 0)">
        {/* Clipped at the ground, so the child disappears behind the wall when ducking. */}
        <Inside d="M-90 -260 H90 V0 H-90 Z">
          <g className="wb-kinder-b" style={{ transformOrigin: "0px 0px" }}>
            <Kid coat="#8e7dff" hat="#e63946" trim="#ff8fa3">
              <path d="M-20 -94 L-36 -120" stroke="#8e7dff" strokeWidth="10" strokeLinecap="round" />
              <circle cx="-38" cy="-124" r="6" fill="#ff8fa3" />
              <path d="M20 -94 L36 -120" stroke="#8e7dff" strokeWidth="10" strokeLinecap="round" />
              <circle cx="38" cy="-124" r="6" fill="#ff8fa3" />
            </Kid>
          </g>
        </Inside>
      </g>
      {/* The snow wall the right child hides behind */}
      <path d="M22 0 V-46 Q70 -60 120 -46 V0 Z" fill={SNOW} />
      <path d="M22 -24 H120 M46 -48 V-24 M96 -50 V-24 M70 -24 V0" stroke={SNOW_SHADE} strokeWidth="3" />
      <circle className="wb-kinder-ball" cx="-34" cy="-142" r="9" fill={SNOW} stroke={SNOW_SHADE} strokeWidth="2" />
      <g className="wb-kinder-splat" fill={SNOW} stroke={SNOW_SHADE} strokeWidth="2">
        {[
          [50, -60],
          [62, -70],
          [74, -62],
          [60, -54],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="7" style={nth(i)} />
        ))}
      </g>
    </>
  );
}

/** A worker in a woolly hat warming one hand at the fire and drinking hot tea. */
export function Teearbeiter() {
  return (
    <g className="wb-tee-body" style={{ transformOrigin: "0px 0px" }}>
      <rect x="-20" y="-64" width="16" height="58" rx="6" fill="#1d3557" />
      <rect x="4" y="-64" width="16" height="58" rx="6" fill="#1d3557" />
      <rect x="-25" y="-10" width="23" height="10" rx="4" fill={INK} />
      <rect x="2" y="-10" width="23" height="10" rx="4" fill={INK} />
      <g className="wb-tee-warm" style={{ transformOrigin: "-22px -126px" }}>
        <path d="M-22 -126 L-52 -102" stroke="#ff8c42" strokeWidth="14" strokeLinecap="round" />
        <circle cx="-57" cy="-98" r="8" fill="#264653" />
      </g>
      <rect x="-30" y="-142" width="60" height="88" rx="18" fill="#ff8c42" />
      <path d="M-30 -96 H30 M-30 -76 H30" stroke="#ffd60a" strokeWidth="6" />
      <path d="M0 -140 V-56" stroke="#e76f51" strokeWidth="3" opacity="0.6" />
      <circle cx="0" cy="-162" r="24" fill={SKIN} />
      <circle cx="-24" cy="-160" r="5" fill={SKIN} />
      <circle cx="24" cy="-160" r="5" fill={SKIN} />
      <Face cx={0} cy={-162} size={1.05} />
      <Lids
        eyes={[
          [-7.35, -162],
          [7.35, -162],
        ]}
        r={4.4}
        fill={SKIN}
      />
      <circle cx="0" cy="-156" r="3.5" fill="#ff8fa3" />
      <g className="wb-tee-hat" style={{ transformOrigin: "0px -176px" }}>
        <path d="M-25 -168 Q-26 -198 0 -198 Q26 -198 25 -168 Z" fill="#e63946" />
        <path d="M-12 -192 V-176 M0 -196 V-176 M12 -192 V-176" stroke="#c1121f" strokeWidth="2.5" />
        <rect x="-27" y="-174" width="54" height="10" rx="5" fill="#ff5d73" />
        <circle className="wb-tee-bobble" cx="0" cy="-202" r="9" fill="#fff" />
      </g>
      <rect x="-22" y="-142" width="44" height="9" rx="4" fill="#2a9d8f" />
      <path d="M8 -136 L14 -110 L24 -112 L18 -138 Z" fill="#2a9d8f" />
      <g className="wb-tee-breath" fill="#fff">
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={-30 - i * 8} cy={-150 - i * 4} r={5 + i} style={nth(i)} />
        ))}
      </g>
      <g className="wb-tee-mug" style={{ transformOrigin: "22px -124px" }}>
        <path d="M24 -128 Q30 -102 12 -102" stroke="#ff8c42" strokeWidth="13" strokeLinecap="round" fill="none" />
        <rect x="-2" y="-120" width="18" height="22" rx="4" fill="#ffd60a" />
        <path d="M16 -114 q7 0 7 6 q0 6 -7 6" stroke="#ffd60a" strokeWidth="3" fill="none" />
        <ellipse cx="7" cy="-119" rx="8" ry="2" fill="#a0522d" />
        <circle cx="10" cy="-102" r="7" fill="#264653" />
        <g className="wb-tee-steam" fill="#fff">
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={2 + i * 5} cy="-126" r="4" style={nth(i)} />
          ))}
        </g>
      </g>
      <g className="wb-tee-glints" fill="#ffd60a">
        <path d={glint(-70, -120, 7)} style={nth(0)} />
      </g>
    </g>
  );
}
