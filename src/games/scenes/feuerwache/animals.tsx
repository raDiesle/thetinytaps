import { CHEEK, Eye, INK, nth } from "../shared";
import { DARK_RED, FIRE_RED, STRIPE } from "./parts";

// Animals. Most share the placement of what they sit on (tree, flag, roof, boot);
// their coordinates are those of that drawing.

/** Music notes or "sound lines" next to a singing animal. */
function Notes({ x, y, className, colour = "#7b2cbf" }: { x: number; y: number; className: string; colour?: string }) {
  return (
    <g className={className} fill={colour}>
      {[0, 1].map((i) => (
        <g key={i} style={nth(i)}>
          <circle cx={x + i * 18} cy={y - i * 14} r="5" />
          <path d={`M${x + i * 18 + 4} ${y - i * 14} v-18 l8 4`} stroke={colour} strokeWidth="2.5" fill="none" />
        </g>
      ))}
    </g>
  );
}

/** The fire station's dog (a Dalmatian with a little helmet): barks, wags and hops. Foot point at (0, 0). */
export function Hund() {
  const spots: [number, number, number][] = [
    [-30, -62, 8],
    [-8, -48, 6],
    [14, -66, 7],
    [34, -50, 5],
    [-44, -46, 5],
  ];
  return (
    <g className="fw-hund-body" style={{ transformOrigin: "0px 0px" }}>
      <path
        className="fw-hund-tail"
        d="M-56 -62 Q-82 -76 -78 -100"
        stroke="#f8f9fa"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
        style={{ transformOrigin: "-56px -62px" }}
      />
      {[-46, -24, 24, 44].map((x) => (
        <g key={x}>
          <rect x={x - 7} y="-44" width="14" height="40" rx="6" fill={x < 0 ? "#e9ecef" : "#f8f9fa"} />
          <ellipse cx={x} cy="-5" rx="9" ry="5" fill="#dee2e6" />
        </g>
      ))}
      <ellipse cx="0" cy="-56" rx="60" ry="28" fill="#f8f9fa" />
      {spots.map(([x, y, r]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={r} fill={INK} />
      ))}
      <path d="M42 -76 L50 -50" stroke={FIRE_RED} strokeWidth="8" strokeLinecap="round" />
      <circle cx="48" cy="-46" r="5" fill={STRIPE} />
      <g className="fw-hund-head" style={{ transformOrigin: "52px -72px" }}>
        <circle cx="62" cy="-92" r="26" fill="#f8f9fa" />
        <ellipse cx="84" cy="-82" rx="17" ry="12" fill="#f1f3f5" />
        <ellipse cx="99" cy="-87" rx="6" ry="5" fill={INK} />
        <circle cx="97" cy="-89" r="1.6" fill="#fff" />
        <circle cx="54" cy="-100" r="4" fill={INK} />
        <circle cx="74" cy="-78" r="3" fill={INK} />
        <path className="fw-hund-ear" d="M44 -110 Q30 -98 40 -72 Q52 -82 54 -104 Z" fill={INK} style={{ transformOrigin: "49px -107px" }} />
        <Eye cx={68} cy={-98} r={3.6} />
        <circle cx="76" cy="-86" r="4.5" fill={CHEEK} opacity="0.5" />
        <path d="M94 -78 Q88 -72 80 -75" stroke="#2b2d42" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <ellipse className="fw-hund-tongue" cx="86" cy="-70" rx="5" ry="7" fill="#ff5d73" style={{ transformOrigin: "86px -76px" }} />
        {/* A little fire helmet */}
        <g className="fw-hund-helmet" style={{ transformOrigin: "62px -114px" }}>
          <path d="M42 -112 Q42 -136 62 -136 Q82 -136 82 -112 Z" fill={FIRE_RED} />
          <rect x="38" y="-116" width="48" height="7" rx="3" fill={DARK_RED} />
          <path d="M50 -130 q8 -4 14 -3" stroke="#fff" strokeOpacity="0.6" strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
        <g className="fw-hund-bark" fill="none" stroke="#868e96" strokeWidth="4" strokeLinecap="round">
          <path d="M112 -100 l10 -6 M114 -88 h12 M112 -76 l10 6" />
        </g>
      </g>
    </g>
  );
}

/** The cat sitting on the tree's branch (tree coordinates): it meows, waves a paw and licks it. */
export function Katze() {
  return (
    <g className="fw-katze-body" style={{ transformOrigin: "-117px -185px" }}>
      <path
        className="fw-katze-tail"
        d="M-100 -192 Q-80 -186 -86 -158"
        stroke="#f4a261"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
        style={{ transformOrigin: "-100px -192px" }}
      />
      <ellipse cx="-117" cy="-206" rx="19" ry="22" fill="#f4a261" />
      <path d="M-130 -214 q6 4 12 0 M-128 -202 q6 4 12 0" stroke="#e76f51" strokeWidth="3" fill="none" />
      <ellipse cx="-117" cy="-200" rx="9" ry="12" fill="#fff4e6" />
      <ellipse cx="-125" cy="-187" rx="6" ry="4" fill="#fff4e6" />
      <g className="fw-katze-paw" style={{ transformOrigin: "-108px -196px" }}>
        <ellipse cx="-108" cy="-187" rx="6" ry="4" fill="#fff4e6" />
      </g>
      <g className="fw-katze-head" style={{ transformOrigin: "-117px -222px" }}>
        <path d="M-133 -234 L-131 -256 L-120 -242 Z M-101 -234 L-103 -256 L-114 -242 Z" fill="#f4a261" />
        <path d="M-130 -239 L-129 -249 L-123 -242 Z M-104 -239 L-105 -249 L-111 -242 Z" fill="#ffb3c1" />
        <circle cx="-117" cy="-232" r="17" fill="#f4a261" />
        <path d="M-121 -248 l1 6 M-117 -249 v6 M-113 -248 l-1 6" stroke="#e76f51" strokeWidth="2.4" strokeLinecap="round" />
        <ellipse cx="-117" cy="-225" rx="9" ry="6" fill="#fff4e6" />
        <Eye cx={-124} cy={-234} r={3} />
        <Eye cx={-110} cy={-234} r={3} />
        <g className="fw-katze-lids" fill="#f4a261">
          <circle cx="-124" cy="-234" r="3.8" />
          <circle cx="-110" cy="-234" r="3.8" />
        </g>
        <path d="M-120 -228 H-114 L-117 -225 Z" fill="#ff8fa3" />
        <ellipse className="fw-katze-mouth" cx="-117" cy="-220" rx="3" ry="2" fill="#9d0208" style={{ transformOrigin: "-117px -221px" }} />
        <path d="M-138 -226 H-127 M-107 -226 H-96" stroke="#6c757d" strokeWidth="1.4" />
      </g>
      <g className="fw-katze-meow" fill="none" stroke="#f4a261" strokeWidth="3.5" strokeLinecap="round">
        <path d="M-146 -244 l-10 -6 M-148 -232 h-12 M-146 -220 l-10 6" />
      </g>
    </g>
  );
}

/** The squirrel at the tree trunk (tree coordinates): it peeks out further and nibbles a nut. */
export function Eichhoernchen() {
  return (
    <g className="fw-hoernchen-body" style={{ transformOrigin: "14px -60px" }}>
      <path className="fw-hoernchen-tail" d="M24 -62 Q50 -80 34 -112 Q24 -96 18 -76 Z" fill="#bc6c25" style={{ transformOrigin: "24px -66px" }} />
      <ellipse cx="18" cy="-70" rx="11" ry="14" fill="#d68c45" />
      <circle cx="16" cy="-90" r="10" fill="#d68c45" />
      <path d="M12 -98 l-1 -8 l6 4 Z M20 -98 l2 -8 l3 6 Z" fill="#d68c45" />
      <Eye cx={12} cy={-91} r={2} />
      <circle cx="6" cy="-87" r="2" fill={INK} />
      <g className="fw-hoernchen-nut">
        <ellipse cx="8" cy="-76" rx="5" ry="6" fill="#8d5a2b" />
        <path d="M5 -82 h6" stroke="#6b4423" strokeWidth="3" />
      </g>
    </g>
  );
}

/** The blue bird on top of the flag pole (flag coordinates): it sings and flaps. */
export function Vogel() {
  return (
    <g className="fw-vogel-body" style={{ transformOrigin: "0px -434px" }}>
      <path d="M-22 -452 L-36 -446 L-24 -440 Z" fill="#3a86ff" />
      <ellipse cx="0" cy="-452" rx="20" ry="15" fill="#4895ef" />
      <ellipse cx="2" cy="-447" rx="11" ry="8" fill="#bde0fe" />
      <circle cx="14" cy="-466" r="11" fill="#4895ef" />
      <Eye cx={18} cy={-468} r={2.2} />
      <path d="M24 -466 L34 -462 L24 -459 Z" fill="#ffb703" />
      <g className="fw-vogel-wing" style={{ transformOrigin: "-4px -458px" }}>
        <path d="M-4 -458 Q-24 -476 -16 -448 Z" fill="#3a86ff" />
      </g>
      <path d="M-4 -438 v6 M6 -438 v6" stroke="#ffb703" strokeWidth="3" strokeLinecap="round" />
      <Notes x={38} y={-480} className="fw-vogel-notes" />
    </g>
  );
}

/** The pigeon on the station roof (station coordinates): it coos, bobs its head and flutters. */
export function Taube() {
  return (
    <g className="fw-taube-body" style={{ transformOrigin: "-380px -530px" }}>
      <path d="M-418 -556 L-440 -548 L-416 -544 Z" fill="#868e96" />
      <ellipse cx="-384" cy="-556" rx="34" ry="22" fill="#adb5bd" />
      <g className="fw-taube-wing" style={{ transformOrigin: "-380px -566px" }}>
        <path d="M-380 -566 Q-414 -578 -414 -552 Q-392 -548 -376 -556 Z" fill="#868e96" />
        <path d="M-404 -560 h10 M-406 -554 h10" stroke="#6c757d" strokeWidth="2.5" />
      </g>
      <g className="fw-taube-head" style={{ transformOrigin: "-360px -566px" }}>
        <path d="M-366 -568 Q-358 -552 -350 -560" stroke="#74c69d" strokeWidth="7" fill="none" />
        <circle cx="-354" cy="-580" r="13" fill="#adb5bd" />
        <Eye cx={-350} cy={-583} r={2.4} />
        <path d="M-342 -580 L-332 -576 L-342 -573 Z" fill="#495057" />
      </g>
      <path d="M-392 -534 v-4 M-376 -534 v-4" stroke="#ff8fa3" strokeWidth="3.5" strokeLinecap="round" />
      <Notes x={-330} y={-600} className="fw-taube-coo" colour="#868e96" />
    </g>
  );
}

/** A duckling swimming in the puddle the hose has made (puddle coordinates). */
export function Ente() {
  return (
    <>
      <g className="fw-ente-ripples" fill="none" stroke="#fff" strokeWidth="3">
        {[0, 1].map((i) => (
          <ellipse key={i} cx="0" cy="-6" rx={50 + i * 20} ry={9 + i * 4} style={nth(i)} />
        ))}
      </g>
      <g className="fw-ente-body" style={{ transformOrigin: "0px -6px" }}>
        <path d="M-36 -26 Q-40 -48 -24 -46 Q-6 -52 16 -44 Q34 -38 30 -20 Q20 -6 -6 -6 Q-30 -6 -36 -26 Z" fill="#ffd60a" />
        <g className="fw-ente-wing" style={{ transformOrigin: "-6px -34px" }}>
          <path d="M-20 -34 Q-6 -44 10 -32 Q-4 -22 -20 -34 Z" fill="#ffc300" />
        </g>
        <g className="fw-ente-head" style={{ transformOrigin: "18px -46px" }}>
          <circle cx="20" cy="-62" r="16" fill="#ffd60a" />
          <path d="M32 -62 Q50 -60 46 -54 Q38 -50 32 -54 Z" fill="#f77f00" />
          <Eye cx={24} cy={-66} r={2.6} />
          <circle cx="26" cy="-56" r="4" fill={CHEEK} opacity="0.5" />
          <path d="M14 -76 q4 -8 8 -2" stroke="#ffc300" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      </g>
      <g className="fw-ente-quack" fill="none" stroke="#f77f00" strokeWidth="3.5" strokeLinecap="round">
        <path d="M56 -72 l10 -6 M58 -60 h12 M56 -48 l10 6" />
      </g>
      <g className="fw-ente-drops" fill="#74c0fc">
        {[-30, -10, 14, 34].map((x, i) => (
          <circle key={x} cx={x} cy="-12" r="4" style={nth(i)} />
        ))}
      </g>
    </>
  );
}

/** The mouse living in a boot (boot coordinates): it pops up, sniffs and ducks again. */
export function Maus() {
  return (
    <g className="fw-maus-body">
      <circle cx="32" cy="-150" r="10" fill="#adb5bd" />
      <circle cx="58" cy="-150" r="10" fill="#adb5bd" />
      <circle cx="32" cy="-150" r="5" fill="#ffb3c1" />
      <circle cx="58" cy="-150" r="5" fill="#ffb3c1" />
      <ellipse cx="45" cy="-134" rx="16" ry="14" fill="#adb5bd" />
      <g className="fw-maus-nose" style={{ transformOrigin: "45px -128px" }}>
        <circle cx="45" cy="-126" r="3.5" fill="#ff8fa3" />
        <path d="M36 -128 h-12 M36 -124 l-11 3 M54 -128 h12 M54 -124 l11 3" stroke="#6c757d" strokeWidth="1.3" />
      </g>
      <Eye cx={39} cy={-136} r={2.2} />
      <Eye cx={51} cy={-136} r={2.2} />
      <path d="M30 -124 h30 v4 h-30 Z" fill="#adb5bd" />
      <circle cx="31" cy="-122" r="4" fill="#ced4da" />
      <circle cx="59" cy="-122" r="4" fill="#ced4da" />
    </g>
  );
}

/** A snail on the lawn: its feelers stretch out and its shell wiggles. Foot point at (0, 0). */
export function Schnecke() {
  return (
    <>
      <g className="fw-schnecke-body" style={{ transformOrigin: "0px 0px" }}>
        <path d="M-44 0 Q-44 -14 -24 -14 H30 Q40 -14 44 -26 Q52 -12 44 0 Z" fill="#f4d58d" />
        <g className="fw-schnecke-feelers" style={{ transformOrigin: "42px -24px" }}>
          <path d="M40 -24 L36 -50 M46 -24 L54 -48" stroke="#e9c46a" strokeWidth="4" strokeLinecap="round" />
          <circle cx="36" cy="-52" r="4" fill={INK} />
          <circle cx="54" cy="-50" r="4" fill={INK} />
        </g>
        <path d="M38 -16 Q42 -12 46 -16" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
        <g className="fw-schnecke-shell" style={{ transformOrigin: "-8px -14px" }}>
          <circle cx="-8" cy="-38" r="28" fill="#e76f51" />
          <path d="M-8 -38 m0 -4 a4 4 0 1 1 -4 4 a10 10 0 1 1 10 10 a16 16 0 1 1 -16 -16 a22 22 0 1 1 22 22" stroke="#9d0208" strokeWidth="3.5" fill="none" />
          <circle cx="-18" cy="-54" r="5" fill="#fff" opacity="0.5" />
        </g>
      </g>
      <g className="fw-schnecke-hearts" fill="#ff5d73">
        <path d="M60 -70 c0 -7 -11 -7 -11 0 c0 5 11 10 11 12 c0 -2 11 -7 11 -12 c0 -7 -11 -7 -11 0 Z" />
      </g>
    </>
  );
}

/** The butterfly over the flower box (flower box coordinates). */
export function Schmetterling() {
  return (
    <g className="fw-falter-body" style={{ transformOrigin: "30px -130px" }}>
      <g className="fw-falter-wings" style={{ transformOrigin: "30px -130px" }}>
        <ellipse cx="18" cy="-140" rx="14" ry="11" fill="#ff8fab" />
        <ellipse cx="42" cy="-140" rx="14" ry="11" fill="#ff8fab" />
        <ellipse cx="20" cy="-122" rx="10" ry="8" fill="#ffc8dd" />
        <ellipse cx="40" cy="-122" rx="10" ry="8" fill="#ffc8dd" />
        <circle cx="16" cy="-142" r="4" fill="#fff" opacity="0.7" />
        <circle cx="44" cy="-142" r="4" fill="#fff" opacity="0.7" />
      </g>
      <rect x="27" y="-146" width="6" height="30" rx="3" fill={INK} />
      <path d="M28 -146 l-6 -10 M32 -146 l6 -10" stroke={INK} strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}
