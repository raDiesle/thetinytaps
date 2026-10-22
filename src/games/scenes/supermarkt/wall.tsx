import { Eye, Face, INK, Inside, SKIN, STEEL, nth } from "../shared";
import { Lid, Lines, Mist, Notes, Sparkles } from "./parts";

// Things on and at the back wall, drawn in picture coordinates: the loudspeaker, the sliding
// door with the dog outside, the bakery with its pretzel sign, the cheese, the fish tank's
// fish and crab, and the balloons.

/** The loudspeaker under the ceiling; it pulses and plays the little announcement jingle. */
export function Lautsprecher() {
  return (
    <>
      <rect x="796" y="24" width="8" height="18" fill={STEEL} />
      <g className="sm-speaker-body" style={{ transformOrigin: "800px 40px" }}>
        <rect x="766" y="40" width="68" height="54" rx="14" fill="#f1f3f5" stroke="#ced4da" strokeWidth="3" />
        <circle cx="800" cy="67" r="21" fill="#495057" />
        <g className="sm-speaker-cone" style={{ transformOrigin: "800px 67px" }}>
          <circle cx="800" cy="67" r="14" fill="#343a40" />
          <circle cx="800" cy="67" r="6" fill="#868e96" />
        </g>
        <path d="M776 50 Q784 44 794 44" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" />
        <circle className="sm-speaker-led" cx="826" cy="86" r="3.5" fill="#ced4da" />
      </g>
      <Lines x={842} y={67} />
      <Lines x={758} y={67} dir={-1} />
      <Notes x={838} y={108} colour="#f76707" size={0.8} />
    </>
  );
}

const DOORWAY = "M106 128 H224 V330 H106 Z";

/** The sliding door at the entrance; both glass leaves slide apart and Oma comes in and waves. */
export function Schiebetuer() {
  return (
    <>
      <rect x="96" y="104" width="136" height="226" fill="#adb5bd" />
      <Inside d={DOORWAY}>
        <rect x="100" y="120" width="130" height="212" fill="#a5d8ff" />
        <circle cx="128" cy="164" r="28" fill="#69db7c" />
        <circle cx="160" cy="176" r="24" fill="#51cf66" />
        <rect x="140" y="182" width="10" height="70" fill="#a0522d" />
        <rect x="100" y="250" width="130" height="82" fill="#ced4da" />
        <path d="M100 274 H230 M100 300 H230 M140 250 V332 M190 250 V332" stroke="#adb5bd" strokeWidth="2" />
        <g className="sm-tuer-oma">
          <path d="M150 330 V268 Q150 246 168 246 Q186 246 186 268 V330 Z" fill="#9775fa" />
          <circle cx="168" cy="228" r="18" fill={SKIN} />
          <path d="M150 226 Q148 204 168 204 Q188 204 186 226 Q178 214 168 214 Q158 214 150 226 Z" fill="#dee2e6" />
          <circle cx="168" cy="204" r="9" fill="#dee2e6" />
          <Face cx={168} cy={229} size={0.62} />
          <circle cx="163.5" cy="229" r="5" fill="none" stroke={INK} strokeWidth="1.6" />
          <circle cx="172.5" cy="229" r="5" fill="none" stroke={INK} strokeWidth="1.6" />
          <rect x="142" y="282" width="18" height="22" rx="5" fill="#e64980" />
          <path d="M145 284 Q151 272 157 284" stroke="#e64980" strokeWidth="3" fill="none" />
          <g className="sm-tuer-arm" style={{ transformOrigin: "184px 262px" }}>
            <path d="M184 262 L200 240" stroke="#9775fa" strokeWidth="9" strokeLinecap="round" />
            <circle cx="202" cy="236" r="6" fill={SKIN} />
          </g>
        </g>
        {[
          { x: 106, cls: "sm-tuer-left" },
          { x: 165, cls: "sm-tuer-right" },
        ].map(({ x, cls }) => (
          <g key={cls} className={cls}>
            <rect x={x} y="128" width="59" height="202" fill="#d0ebff" fillOpacity="0.45" stroke="#868e96" strokeWidth="4" />
            <path d={`M${x + 14} 300 L${x + 40} 150`} stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.55" />
            <rect x={x === 106 ? x + 50 : x + 4} y="214" width="5" height="40" rx="2" fill={STEEL} />
          </g>
        ))}
      </Inside>
      {/* Header with the entrance arrow and the motion sensor */}
      <rect x="96" y="104" width="136" height="24" fill="#868e96" />
      <rect x="112" y="108" width="60" height="16" rx="4" fill="#40c057" />
      <path d="M122 116 H158 M150 110 L158 116 L150 122" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="196" y="110" width="26" height="12" rx="6" fill="#343a40" />
      <circle className="sm-tuer-sensor" cx="209" cy="116" r="4" fill="#ff6b6b" />
    </>
  );
}

const WINDOW = "M8 120 H92 V322 H8 Z";

/** A dog waits outside the window, tied to a ring; it jumps up, wags and barks. */
export function Hund() {
  return (
    <>
      <Inside d={WINDOW}>
        <rect x="70" y="262" width="12" height="12" rx="6" fill="none" stroke={STEEL} strokeWidth="3" />
        <path className="sm-hund-leash" d="M76 274 Q66 300 50 272" stroke="#e64980" strokeWidth="3" fill="none" />
        <g className="sm-hund-body" style={{ transformOrigin: "46px 320px" }}>
          <path
            className="sm-hund-tail"
            d="M66 306 Q86 300 82 278"
            stroke="#c8814a"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
            style={{ transformOrigin: "66px 306px" }}
          />
          <ellipse cx="50" cy="300" rx="22" ry="22" fill="#e0a060" />
          <ellipse cx="46" cy="306" rx="12" ry="14" fill="#fff4e6" />
          <rect x="30" y="306" width="10" height="16" rx="5" fill="#e0a060" />
          <rect x="52" y="306" width="10" height="16" rx="5" fill="#e0a060" />
          <path d="M30 284 H66" stroke="#e64980" strokeWidth="5" strokeLinecap="round" />
          <g className="sm-hund-head" style={{ transformOrigin: "46px 276px" }}>
            <circle cx="44" cy="258" r="20" fill="#e0a060" />
            <ellipse cx="44" cy="268" rx="12" ry="9" fill="#fff4e6" />
            <g className="sm-hund-ear" style={{ transformOrigin: "28px 246px" }}>
              <path d="M28 244 Q16 248 20 270 Q30 268 32 252 Z" fill="#a0522d" />
            </g>
            <g className="sm-hund-ear" style={{ ...nth(1), transformOrigin: "60px 246px" }}>
              <path d="M60 244 Q72 248 68 270 Q58 268 56 252 Z" fill="#a0522d" />
            </g>
            <Eye cx={37} cy={255} r={2.8} />
            <Eye cx={51} cy={255} r={2.8} />
            <Lid cx={37} cy={255} r={2.8} fill="#e0a060" />
            <Lid cx={51} cy={255} r={2.8} fill="#e0a060" />
            <ellipse cx="44" cy="264" rx="5" ry="3.6" fill={INK} />
            <path d="M38 270 Q44 275 50 270" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
            <path className="sm-hund-tongue" d="M41 272 h7 v7 q-3.5 4 -7 0 Z" fill="#ff8fa3" />
          </g>
        </g>
      </Inside>
      {/* The window glass in front of the dog */}
      <path d="M20 316 L52 128 M34 316 L66 128" stroke="#fff" strokeWidth="5" opacity="0.35" />
      <path d={WINDOW} fill="none" stroke="#dee2e6" strokeWidth="6" />
      <Lines x={70} y={250} colour="#fff" />
    </>
  );
}

/** The bakery's sign: a big golden pretzel; it swings on its chains and salt sparkles. */
export function Brezel() {
  return (
    <>
      <path d="M244 32 H344" stroke={INK} strokeWidth="6" strokeLinecap="round" />
      <rect x="236" y="26" width="10" height="20" rx="3" fill={INK} />
      <g className="sm-brezel-sign" style={{ transformOrigin: "310px 34px" }}>
        <path d="M284 34 V56 M336 34 V56" stroke={STEEL} strokeWidth="3" strokeDasharray="4 3" />
        <g transform="translate(310 92)">
          <path
            d="M-6 -16 C-30 -34 -52 -8 -42 12 C-32 32 32 32 42 12 C52 -8 30 -34 6 -16 M-6 -16 C2 -8 14 4 28 20 M6 -16 C-2 -8 -14 4 -28 20"
            stroke="#a0522d"
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M-6 -16 C-30 -34 -52 -8 -42 12 C-32 32 32 32 42 12 C52 -8 30 -34 6 -16 M-6 -16 C2 -8 14 4 28 20 M6 -16 C-2 -8 -14 4 -28 20"
            stroke="#d9873f"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M-36 0 C-38 -14 -26 -24 -14 -20 M18 -22 C30 -24 38 -12 36 0" stroke="#f3c582" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          {[
            [-34, 14],
            [-20, 22],
            [22, 22],
            [36, 10],
            [0, -2],
            [-42, -2],
          ].map(([x, y]) => (
            <rect key={`${x}-${y}`} x={x - 2} y={y - 2} width="4" height="4" rx="1" fill="#fff" />
          ))}
        </g>
      </g>
      <Sparkles x={310} y={92} spread={46} colour="#fff3bf" />
    </>
  );
}

/** The baker behind the counter; she waves and rings the little bell on the counter. */
export function Baeckerin() {
  return (
    <>
      <g className="sm-baeckerin-body" style={{ transformOrigin: "322px 250px" }}>
        <path d="M290 260 V232 Q290 214 322 214 Q354 214 354 232 V260 Z" fill="#f783ac" />
        <path d="M304 216 H340 V260 H304 Z" fill="#fff" />
        <circle cx="322" cy="232" r="4" fill="#ffd43b" />
        <g className="sm-baeckerin-arm" style={{ transformOrigin: "296px 224px" }}>
          <path d="M296 224 L276 196" stroke="#f783ac" strokeWidth="11" strokeLinecap="round" />
          <circle cx="274" cy="191" r="7" fill={SKIN} />
        </g>
        <g className="sm-baeckerin-head" style={{ transformOrigin: "322px 212px" }}>
          <circle cx="322" cy="194" r="20" fill={SKIN} />
          <path d="M303 192 Q301 176 322 176 Q343 176 341 192 Q333 182 322 184 Q311 182 303 192 Z" fill="#e8590c" />
          <Face cx={322} cy={195} size={0.72} />
          <Lid cx={316.96} cy={195} r={2.6} fill={SKIN} />
          <Lid cx={327.04} cy={195} r={2.6} fill={SKIN} />
          <g className="sm-baeckerin-hat" style={{ transformOrigin: "322px 178px" }}>
            <rect x="306" y="170" width="32" height="10" rx="3" fill="#fff" stroke="#e9ecef" strokeWidth="2" />
            <circle cx="312" cy="162" r="10" fill="#fff" />
            <circle cx="324" cy="158" r="12" fill="#fff" />
            <circle cx="334" cy="164" r="9" fill="#fff" />
            <path d="M310 158 Q316 152 322 152" stroke="#e9ecef" strokeWidth="2.5" fill="none" />
          </g>
        </g>
      </g>
      {/* The bell on the counter and the arm that rings it */}
      <path d="M362 246 Q362 228 374 228 Q386 228 386 246 Z" fill="#fcc419" />
      <rect x="358" y="243" width="32" height="5" rx="2" fill="#e67700" />
      <path d="M367 240 Q368 233 373 231" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7" />
      <rect className="sm-baeckerin-button" x="371" y="222" width="6" height="7" rx="2" fill="#e67700" />
      <g className="sm-baeckerin-ring" style={{ transformOrigin: "348px 224px" }}>
        <path d="M348 224 L368 216" stroke="#f783ac" strokeWidth="10" strokeLinecap="round" />
        <circle cx="372" cy="215" r="6.5" fill={SKIN} />
      </g>
      <g className="sm-baeckerin-dings" stroke="#fab005" strokeWidth="3" strokeLinecap="round">
        <path d="M356 220 l-8 -8" style={nth(0)} />
        <path d="M374 210 v-12" style={nth(1)} />
        <path d="M392 220 l8 -8" style={nth(2)} />
      </g>
    </>
  );
}

/** The bread counter: fresh loaves, rolls and pretzels behind the glass; they hop and steam rises. */
export function Brottheke() {
  const breads = [
    { x: 254, d: "M236 296 Q236 276 258 276 Q280 276 280 296 Z", fill: "#c8814a" },
    { x: 296, d: "M282 296 Q282 282 296 282 Q310 282 310 296 Z", fill: "#e0a060" },
    { x: 330, d: "M312 296 Q312 272 334 272 Q356 272 356 296 Z", fill: "#a0522d" },
    { x: 380, d: "M358 296 Q360 284 380 282 Q402 284 404 296 Z", fill: "#e0a060" },
  ];
  return (
    <>
      <rect x="232" y="252" width="182" height="78" fill="#d4a373" />
      <rect x="236" y="256" width="174" height="44" fill="#fff8ee" />
      {breads.map(({ x, d, fill }, i) => (
        <g key={x} className="sm-brot-loaf" style={{ ...nth(i), transformOrigin: `${x}px 296px` }}>
          <path d={d} fill={fill} />
          <path d={`M${x - 8} ${286 - (i % 2) * 2} l4 -6 M${x} ${285 - (i % 2) * 2} l4 -6 M${x + 8} ${286 - (i % 2) * 2} l4 -6`} stroke="#f3d9b1" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      ))}
      <path className="sm-brot-shine" d="M250 300 L266 256 H280 L264 300 Z" fill="#fff" opacity="0.45" />
      <rect x="232" y="298" width="182" height="6" fill="#b07d48" />
      <rect x="228" y="244" width="190" height="10" rx="3" fill="#b07d48" />
      {/* Rolls in front */}
      {[256, 290, 324, 358, 392].map((x, i) => (
        <circle key={x} cx={x} cy="318" r="9" fill={i % 2 ? "#e0a060" : "#c8814a"} />
      ))}
      <Mist x={322} y={262} count={4} spread={34} r={9} colour="#fff" />
    </>
  );
}

/** A big wheel of cheese on the counter; a little mouse pops out from behind and sniffs. */
export function Kaese() {
  return (
    <>
      <g className="sm-kaese-maus" style={{ transformOrigin: "728px 190px" }}>
        <circle cx="716" cy="152" r="8" fill="#adb5bd" />
        <circle cx="740" cy="152" r="8" fill="#adb5bd" />
        <circle cx="716" cy="152" r="4.5" fill="#ffc9c9" />
        <circle cx="740" cy="152" r="4.5" fill="#ffc9c9" />
        <ellipse cx="728" cy="168" rx="15" ry="13" fill="#ced4da" />
        <Eye cx={722} cy={165} r={2.4} />
        <Eye cx={734} cy={165} r={2.4} />
        <g className="sm-kaese-nose" style={{ transformOrigin: "728px 174px" }}>
          <circle cx="728" cy="175" r="3" fill="#ff8fa3" />
          <path d="M716 174 H704 M716 178 L705 182 M740 174 H752 M740 178 L751 182" stroke="#868e96" strokeWidth="1.3" />
        </g>
        <rect x="716" y="180" width="24" height="20" rx="8" fill="#ced4da" />
      </g>
      <g className="sm-kaese-wheel" style={{ transformOrigin: "705px 246px" }}>
        <ellipse cx="705" cy="230" rx="58" ry="16" fill="#f59f00" />
        <rect x="647" y="194" width="116" height="36" fill="#fab005" />
        <ellipse cx="705" cy="194" rx="58" ry="16" fill="#ffe066" />
        {/* The cut where a wedge is missing */}
        <path d="M705 194 L763 194 L763 230 L705 230 Z" fill="#fff3bf" />
        <path d="M705 194 L763 194 Q760 204 748 208 Z" fill="#ffd43b" />
        {[
          [668, 214, 5],
          [688, 204, 4],
          [684, 222, 3],
          [726, 214, 4.5],
          [748, 220, 3.5],
          [740, 204, 3],
        ].map(([cx, cy, r]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="#f08c00" />
        ))}
        <path d="M656 200 Q660 222 672 226" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.5" />
      </g>
      <g className="sm-kaese-wedge" style={{ transformOrigin: "780px 240px" }}>
        <path d="M766 240 L796 240 L796 222 Z" fill="#ffd43b" />
        <circle cx="788" cy="235" r="2.5" fill="#f08c00" />
      </g>
      <Lines x={750} y={162} colour="#868e96" size={0.7} />
    </>
  );
}

/** A friendly fish in the aquarium; it swims a lap, wags its tail and blows bubbles. */
export function Fisch() {
  return (
    <>
      <g className="sm-fisch-body" style={{ transformOrigin: "872px 192px" }}>
        <g className="sm-fisch-tail" style={{ transformOrigin: "900px 192px" }}>
          <path d="M898 192 L918 176 Q912 192 918 208 Z" fill="#1c7ed6" />
        </g>
        <ellipse cx="872" cy="192" rx="30" ry="18" fill="#4dabf7" />
        <path d="M862 176 Q872 166 884 176 Z" fill="#1c7ed6" />
        <path d="M866 200 q6 8 14 2" fill="#1c7ed6" />
        <path d="M878 180 q4 12 0 24 M888 182 q4 10 0 20" stroke="#a5d8ff" strokeWidth="2.5" fill="none" />
        <Eye cx={856} cy={188} r={4} />
        <path d="M846 198 Q850 202 856 199" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
      <g className="sm-fisch-bubbles" fill="#e7f5ff" stroke="#fff" strokeWidth="1.5">
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={842 - i * 2} cy={186 - i * 4} r={3 + i} style={nth(i)} />
        ))}
      </g>
    </>
  );
}

/** A red crab at the bottom of the aquarium; it snaps its claws and scuttles sideways. */
export function Krabbe() {
  return (
    <g className="sm-krabbe-body" style={{ transformOrigin: "956px 234px" }}>
      <path d="M940 226 l-10 8 M944 230 l-8 8 M972 226 l10 8 M968 230 l8 8" stroke="#e03131" strokeWidth="3.5" strokeLinecap="round" />
      <g className="sm-krabbe-claw" style={{ transformOrigin: "940px 220px" }}>
        <path d="M940 220 L930 208" stroke="#e03131" strokeWidth="4" strokeLinecap="round" />
        <path d="M932 210 Q920 210 922 198 L930 204 L928 196 Q940 198 932 210 Z" fill="#fa5252" />
      </g>
      <g className="sm-krabbe-claw" style={{ ...nth(1), transformOrigin: "972px 220px" }}>
        <path d="M972 220 L982 208" stroke="#e03131" strokeWidth="4" strokeLinecap="round" />
        <path d="M980 210 Q992 210 990 198 L982 204 L984 196 Q972 198 980 210 Z" fill="#fa5252" />
      </g>
      <ellipse cx="956" cy="224" rx="18" ry="12" fill="#fa5252" />
      <path d="M944 222 Q956 214 968 222" stroke="#ffa8a8" strokeWidth="2.5" fill="none" />
      <g className="sm-krabbe-eyes" style={{ transformOrigin: "956px 216px" }}>
        <path d="M950 216 V206 M962 216 V206" stroke="#e03131" strokeWidth="3" />
        <Eye cx={950} cy={204} r={3} />
        <Eye cx={962} cy={204} r={3} />
      </g>
      <path d="M951 228 Q956 232 961 228" stroke={INK} strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </g>
  );
}

const BALLOONS = [
  { cx: 1490, cy: 50, fill: "#ff6b6b" },
  { cx: 1538, cy: 34, fill: "#ffd43b" },
  { cx: 1574, cy: 66, fill: "#4dabf7" },
  { cx: 1522, cy: 88, fill: "#69db7c" },
];

/** Balloons tied to the bottle machine; they bob, bump each other and squeak. */
export function Luftballons() {
  return (
    <>
      {BALLOONS.map(({ cx, cy, fill }, i) => (
        <g key={cx} className="sm-ballon" style={{ ...nth(i), transformOrigin: "1530px 160px" }}>
          <path d={`M1530 160 Q${(cx + 1530) / 2 + 8} ${(cy + 160) / 2 + 10} ${cx} ${cy + 28}`} stroke="#868e96" strokeWidth="1.6" fill="none" />
          <path d={`M${cx - 4} ${cy + 30} L${cx} ${cy + 24} L${cx + 4} ${cy + 30} Z`} fill={fill} />
          <ellipse cx={cx} cy={cy} rx="22" ry="26" fill={fill} />
          <ellipse cx={cx - 8} cy={cy - 10} rx="5" ry="8" fill="#fff" opacity="0.55" transform={`rotate(-20 ${cx - 8} ${cy - 10})`} />
        </g>
      ))}
      <circle cx="1530" cy="160" r="3" fill="#868e96" />
    </>
  );
}
