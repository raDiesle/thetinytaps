import { INK } from "../shared";

// Small animals. Each drawing has its foot point at (0, 0), except those that sit on
// something else: the cat (hay bales), the bee (beehive) and the butterfly (flowers).

const EYE = "#2b2d42";
const TABBY = "#f4a261";

/** Ginger cat dozing on the round hay bale, in the bales' coordinates. */
export function Katze() {
  return (
    <g className="hf-katze-body" style={{ transformOrigin: "10px -122px" }}>
      <path
        className="hf-katze-tail"
        d="M38 -130 Q62 -128 62 -104 Q62 -90 54 -84"
        stroke={TABBY}
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
        style={{ transformOrigin: "38px -130px" }}
      />
      <ellipse cx="10" cy="-138" rx="34" ry="17" fill={TABBY} />
      <path d="M4 -154 q4 8 0 14 M18 -154 q4 8 0 14 M32 -150 q3 6 0 11" stroke="#e76f51" strokeWidth="4" strokeLinecap="round" fill="none" />
      <ellipse cx="-16" cy="-124" rx="9" ry="5" fill="#ffe8d6" />
      <ellipse cx="0" cy="-123" rx="9" ry="5" fill="#ffe8d6" />
      <g className="hf-katze-head" style={{ transformOrigin: "-18px -140px" }}>
        <path d="M-38 -160 L-36 -182 L-24 -168 Z M-12 -168 L0 -182 L0 -160 Z" fill={TABBY} />
        <path d="M-35 -164 L-34 -175 L-28 -168 Z M-8 -168 L-3 -175 L-3 -164 Z" fill="#ffb3c1" />
        <circle cx="-18" cy="-154" r="18" fill={TABBY} />
        <path d="M-22 -170 l1 5 M-18 -171 v5 M-14 -170 l-1 5" stroke="#e76f51" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="-18" cy="-147" rx="9" ry="6" fill="#ffe8d6" />
        <path className="hf-katze-closed" d="M-29 -156 q4 3 8 0 M-15 -156 q4 3 8 0" stroke={EYE} strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <g className="hf-katze-open" fill={EYE}>
          <circle cx="-25" cy="-157" r="2.8" />
          <circle cx="-11" cy="-157" r="2.8" />
        </g>
        <path d="M-20.5 -150 H-15.5 L-18 -147.5 Z" fill="#ff8fa3" />
        <path d="M-38 -148 H-27 M-9 -148 H2" stroke="#6c757d" strokeWidth="1.3" />
      </g>
    </g>
  );
}

/** Brown hare with a carrot; it hops, wiggles its ears and nose. */
export function Hase() {
  return (
    <g className="hf-hase-body">
      <circle cx="-36" cy="-30" r="11" fill="#fff" />
      <ellipse cx="-6" cy="-7" rx="28" ry="8" fill="#9c6644" />
      <ellipse cx="0" cy="-42" rx="36" ry="38" fill="#b08968" />
      <ellipse cx="12" cy="-36" rx="17" ry="24" fill="#ede0d4" />
      <path d="M30 -58 L58 -26 L38 -64 Z" fill="#f77f00" />
      <path d="M38 -46 l6 -2 M44 -38 l6 -2" stroke="#e36414" strokeWidth="2" />
      <path d="M32 -62 l-8 -12 M34 -62 l-2 -14 M36 -62 l6 -12" stroke="#40916c" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="22" cy="-50" rx="9" ry="6" fill="#ede0d4" />
      <ellipse cx="22" cy="-10" rx="10" ry="6" fill="#ede0d4" />
      <g className="hf-hase-head" style={{ transformOrigin: "18px -72px" }}>
        <g className="hf-hase-ear" style={{ transformOrigin: "8px -110px" }}>
          <ellipse cx="4" cy="-138" rx="10" ry="31" transform="rotate(-10 4 -138)" fill="#b08968" />
          <ellipse cx="4" cy="-136" rx="5" ry="22" transform="rotate(-10 4 -136)" fill="#ffb3c1" />
        </g>
        <g className="hf-hase-ear2" style={{ transformOrigin: "26px -110px" }}>
          <ellipse cx="30" cy="-138" rx="10" ry="31" transform="rotate(12 30 -138)" fill="#b08968" />
          <ellipse cx="30" cy="-136" rx="5" ry="22" transform="rotate(12 30 -136)" fill="#ffb3c1" />
        </g>
        <circle cx="18" cy="-94" r="24" fill="#b08968" />
        <circle cx="13" cy="-84" r="8" fill="#ede0d4" />
        <circle cx="27" cy="-84" r="8" fill="#ede0d4" />
        <ellipse className="hf-hase-nose" cx="20" cy="-90" rx="4.5" ry="3.5" fill="#ff8fa3" />
        <circle cx="9" cy="-100" r="3.6" fill={EYE} />
        <circle cx="29" cy="-100" r="3.6" fill={EYE} />
        <circle cx="10.2" cy="-101.2" r="1.2" fill="#fff" />
        <circle cx="30.2" cy="-101.2" r="1.2" fill="#fff" />
        <path d="M4 -84 H-10 M36 -84 H50 M5 -80 L-8 -76 M35 -80 L48 -76" stroke="#6c584c" strokeWidth="1.3" />
      </g>
    </g>
  );
}

/** Field mouse holding an ear of wheat; it hops and turns around. */
export function Maus() {
  return (
    <g className="hf-maus-body">
      <path d="M12 -8 Q40 -4 42 -26" stroke="#c8b6a6" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M-22 -26 L-34 -82" stroke="#d4a373" strokeWidth="3" strokeLinecap="round" />
      {[0, 1, 2, 3].map((i) => (
        <ellipse key={i} cx={-31 - (i % 2) * 6 + i * -1} cy={-68 - i * 5} rx="3" ry="6" fill="#e9c46a" transform={`rotate(${i % 2 ? -30 : 20} ${-31 - (i % 2) * 6} ${-68 - i * 5})`} />
      ))}
      <ellipse cx="-8" cy="-4" rx="9" ry="4" fill="#9c6644" />
      <ellipse cx="8" cy="-4" rx="9" ry="4" fill="#9c6644" />
      <ellipse cx="0" cy="-24" rx="16" ry="22" fill="#b08968" />
      <ellipse cx="-4" cy="-20" rx="9" ry="14" fill="#ede0d4" />
      <circle cx="-18" cy="-36" r="4.5" fill="#b08968" />
      <circle cx="-16" cy="-64" r="8" fill="#b08968" />
      <circle cx="8" cy="-64" r="8" fill="#b08968" />
      <circle cx="-16" cy="-64" r="4.5" fill="#ffb3c1" />
      <circle cx="8" cy="-64" r="4.5" fill="#ffb3c1" />
      <circle cx="-4" cy="-52" r="14" fill="#b08968" />
      <circle cx="-9" cy="-54" r="2.3" fill={EYE} />
      <circle cx="1" cy="-54" r="2.3" fill={EYE} />
      <circle cx="-8.3" cy="-54.8" r="0.8" fill="#fff" />
      <circle cx="1.7" cy="-54.8" r="0.8" fill="#fff" />
      <circle cx="-5" cy="-46" r="2.6" fill="#ff8fa3" />
      <path d="M-9 -45 H-22 M-1 -45 H12" stroke="#6c584c" strokeWidth="1.1" />
    </g>
  );
}

/** Snail with a spiral shell, facing right; it hides in its shell and comes out again. */
export function Schnecke() {
  return (
    <>
      <g className="hf-schnecke-foot" style={{ transformOrigin: "0px -10px" }}>
        <path d="M-40 0 Q-40 -12 -20 -12 H30 Q44 -14 46 -30 Q50 -38 56 -34 Q62 -20 52 -6 Q46 0 30 0 Z" fill="#e9d8a6" />
        <path d="M48 -34 L46 -52 M54 -34 L60 -50" stroke="#e9d8a6" strokeWidth="4" strokeLinecap="round" />
        <circle cx="46" cy="-53" r="4.5" fill="#e9d8a6" />
        <circle cx="60" cy="-51" r="4.5" fill="#e9d8a6" />
        <circle cx="46.5" cy="-53" r="2" fill={EYE} />
        <circle cx="60.5" cy="-51" r="2" fill={EYE} />
        <path d="M50 -20 q4 3 8 0" stroke="#bc8a5f" strokeWidth="2" strokeLinecap="round" fill="none" />
      </g>
      <g className="hf-schnecke-shell" style={{ transformOrigin: "0px -10px" }}>
        <circle cx="0" cy="-32" r="26" fill="#bc6c25" />
        <path d="M2 -32 m-4 0 a4 4 0 1 1 8 0 a8 8 0 1 1 -16 0 a12 12 0 1 1 24 0 a16 16 0 1 1 -32 0" stroke="#8d5a2b" strokeWidth="3.5" fill="none" />
        <ellipse cx="-10" cy="-48" rx="8" ry="4" fill="#fff" opacity="0.4" />
      </g>
    </>
  );
}

/** Frog on a lily pad; it puffs up its throat and jumps. */
export function Frosch() {
  return (
    <>
      <path d="M2 -4 L42 -12 A46 13 0 1 1 44 0 Z" fill="#52b788" />
      <path d="M2 -4 L-30 -10 M2 -4 L-20 6 M2 -4 L26 8" stroke="#40916c" strokeWidth="2" />
      <g className="hf-frosch-body">
        <ellipse cx="-22" cy="-12" rx="14" ry="9" fill="#55a630" />
        <ellipse cx="22" cy="-12" rx="14" ry="9" fill="#55a630" />
        <ellipse cx="0" cy="-24" rx="24" ry="20" fill="#80b918" />
        <ellipse cx="0" cy="-18" rx="14" ry="12" fill="#d4e09b" />
        <ellipse className="hf-frosch-sac" cx="0" cy="-22" rx="11" ry="8" fill="#e9f5db" />
        <ellipse cx="-10" cy="-5" rx="6" ry="4" fill="#55a630" />
        <ellipse cx="10" cy="-5" rx="6" ry="4" fill="#55a630" />
        <circle cx="-12" cy="-42" r="10" fill="#80b918" />
        <circle cx="12" cy="-42" r="10" fill="#80b918" />
        <circle cx="-12" cy="-43" r="6.5" fill="#fff" />
        <circle cx="12" cy="-43" r="6.5" fill="#fff" />
        <circle cx="-11" cy="-43" r="3.6" fill={EYE} />
        <circle cx="13" cy="-43" r="3.6" fill={EYE} />
        <circle cx="-10" cy="-44.4" r="1.2" fill="#fff" />
        <circle cx="14" cy="-44.4" r="1.2" fill="#fff" />
        <path d="M-14 -30 Q0 -22 14 -30" stroke="#2b9348" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <circle cx="-16" cy="-28" r="3.5" fill="#ff8fa3" opacity="0.5" />
        <circle cx="16" cy="-28" r="3.5" fill="#ff8fa3" opacity="0.5" />
      </g>
    </>
  );
}

/** Honey bee next to the hive, in the hive's coordinates; it flies a loop. */
export function Biene() {
  return (
    <g className="hf-biene-flight">
      <g className="hf-biene-wings" style={{ transformOrigin: "68px -120px" }}>
        <ellipse cx="62" cy="-126" rx="9" ry="6" fill="#fff" opacity="0.85" />
        <ellipse cx="74" cy="-128" rx="9" ry="6" fill="#fff" opacity="0.85" />
      </g>
      <ellipse cx="70" cy="-110" rx="16" ry="11" fill="#ffd60a" />
      <path d="M64 -120 v20 M73 -121 v22" stroke={EYE} strokeWidth="4" />
      <path d="M54 -110 L49 -110" stroke={EYE} strokeWidth="2" strokeLinecap="round" />
      <circle cx="87" cy="-112" r="8" fill={EYE} />
      <circle cx="89" cy="-114" r="2" fill="#fff" />
      <path d="M86 -119 q2 -8 7 -10 M90 -118 q4 -6 8 -6" stroke={EYE} strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </g>
  );
}

/** Lemon-yellow butterfly above the wild flowers, in the flowers' coordinates. */
export function Schmetterling() {
  return (
    <g className="hf-falter-flight">
      <g className="hf-falter-wings" style={{ transformOrigin: "26px -160px" }}>
        <path d="M26 -162 Q10 -188 4 -168 Q2 -152 26 -160 Z M26 -162 Q42 -188 48 -168 Q50 -152 26 -160 Z" fill="#ffe066" />
        <path d="M26 -158 Q12 -150 14 -142 Q20 -140 26 -156 Z M26 -158 Q40 -150 38 -142 Q32 -140 26 -156 Z" fill="#ffd60a" />
        <circle cx="13" cy="-170" r="3" fill="#f77f00" />
        <circle cx="39" cy="-170" r="3" fill="#f77f00" />
      </g>
      <ellipse cx="26" cy="-160" rx="3" ry="12" fill={INK} />
      <path d="M24 -171 q-4 -10 -9 -12 M28 -171 q4 -10 9 -12" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  );
}
