import { heartPath, nth, sparklePath } from "../shared";
import { Cheek, DinoEye, Lines, Notes, Puff, Smile, leafPath } from "./parts";

// The big dinosaurs. Everyone is round and friendly: big eyes, rosy cheeks, a smile,
// no sharp teeth. Each drawing has its foot point at (0, 0).

const CREAM = "#fff8e7";

// ---------- Brachiosaurus ----------

const BRACHIO = "#7fb7e6";
const BRACHIO_DARK = "#679fd0";

/** Long-neck facing right; he stretches up into the tree, bites, chews, swishes his tail and blinks. */
export function Brachiosaurus() {
  return (
    <>
      <rect x="-84" y="-128" width="42" height="128" rx="18" fill={BRACHIO_DARK} />
      <rect x="74" y="-128" width="42" height="128" rx="18" fill={BRACHIO_DARK} />
      <path className="dt-brachio-tail" d="M-120 -196 Q-232 -172 -302 -72 Q-294 -58 -272 -68 Q-200 -132 -108 -138 Z" fill={BRACHIO} style={{ transformOrigin: "-110px -166px" }} />
      <ellipse cx="0" cy="-172" rx="142" ry="80" fill={BRACHIO} />
      <path d="M-112 -128 Q0 -78 112 -128 Q84 -98 0 -96 Q-84 -98 -112 -128 Z" fill="#cfe8fb" />
      <g fill="#a9d0f2">
        <circle cx="-60" cy="-214" r="14" />
        <circle cx="-20" cy="-232" r="11" />
        <circle cx="24" cy="-222" r="13" />
        <circle cx="-90" cy="-184" r="9" />
      </g>
      <path d="M-100 -226 Q-40 -256 30 -246" stroke="#fff" strokeOpacity="0.35" strokeWidth="10" strokeLinecap="round" fill="none" />
      <rect x="-126" y="-136" width="50" height="136" rx="20" fill={BRACHIO} />
      <rect x="36" y="-136" width="50" height="136" rx="20" fill={BRACHIO} />
      {[-118, -101, -84, 44, 61, 78].map((x) => (
        <ellipse key={x} cx={x} cy={-4} rx="6" ry="5" fill={CREAM} />
      ))}
      <g className="dt-brachio-neck" style={{ transformOrigin: "90px -200px" }}>
        <path d="M36 -214 Q118 -300 150 -442 Q170 -466 198 -452 Q178 -330 140 -146 Z" fill={BRACHIO} />
        <path d="M150 -420 Q130 -330 84 -240" stroke="#fff" strokeOpacity="0.3" strokeWidth="8" strokeLinecap="round" fill="none" />
        <g className="dt-brachio-head" style={{ transformOrigin: "172px -456px" }}>
          <path className="dt-brachio-jaw" d="M194 -446 Q222 -442 236 -454 Q232 -432 200 -432 Z" fill="#679fd0" style={{ transformOrigin: "196px -444px" }} />
          <circle cx="178" cy="-486" r="19" fill={BRACHIO} />
          <ellipse cx="198" cy="-462" rx="42" ry="26" fill={BRACHIO} />
          <circle cx="226" cy="-476" r="3" fill="#2b2d42" />
          <DinoEye cx={188} cy={-472} r={10} skin={BRACHIO} look={1} />
          <Cheek cx={208} cy={-448} r={7} />
          <Smile x={212} y={-452} w={20} d={4} width={3} />
          <g transform="rotate(70 238 -452)">
            <path className="dt-brachio-leaf" d={leafPath(238, -452, 12, 30)} fill="#52b788" style={{ transformOrigin: "238px -452px" }} />
          </g>
        </g>
      </g>
      <g className="dt-brachio-crumbs" fill="#52b788">
        {[0, 1, 2].map((i) => (
          <ellipse key={i} cx={224 + i * 8} cy={-430} rx="6" ry="3.5" style={nth(i)} />
        ))}
      </g>
      <Notes x={250} y={-480} texts={["Mampf!", "Mampf!"]} size={26} delays={[0.8, 1.3]} />
    </>
  );
}

// ---------- Parasaurolophus ----------

const PARA = "#b197fc";
const PARA_DARK = "#9775fa";

/** Crested dino facing left; she lifts her head, puffs her cheeks and trumpets through her crest. */
export function Parasaurolophus() {
  return (
    <g className="dt-para-body">
      <path className="dt-para-tail" d="M50 -124 Q132 -112 178 -70 Q172 -58 152 -64 Q110 -86 50 -82 Z" fill={PARA} style={{ transformOrigin: "60px -104px" }} />
      <rect x="10" y="-84" width="26" height="84" rx="11" fill={PARA_DARK} />
      <ellipse cx="18" cy="-2" rx="20" ry="7" fill={PARA_DARK} />
      <ellipse cx="10" cy="-112" rx="72" ry="50" fill={PARA} />
      <path d="M-56 -94 Q0 -64 60 -86 Q30 -70 0 -70 Q-34 -72 -56 -94 Z" fill="#e5dbff" />
      <path d="M-20 -150 Q20 -164 56 -146" stroke="#fff" strokeOpacity="0.35" strokeWidth="8" strokeLinecap="round" fill="none" />
      <ellipse cx="30" cy="-82" rx="30" ry="36" fill={PARA} />
      <rect x="16" y="-64" width="28" height="64" rx="12" fill={PARA} />
      <ellipse cx="26" cy="-2" rx="22" ry="8" fill={PARA} />
      <path className="dt-para-arm" d="M-46 -108 Q-70 -96 -72 -78 Q-64 -74 -60 -82 Q-54 -94 -38 -96 Z" fill={PARA_DARK} style={{ transformOrigin: "-44px -104px" }} />
      <path d="M-30 -144 Q-58 -170 -68 -192 L-36 -206 Q-28 -180 4 -152 Z" fill={PARA} />
      <g className="dt-para-head" style={{ transformOrigin: "-40px -170px" }}>
        <path className="dt-para-crest" d="M-72 -214 Q-20 -252 34 -270 Q52 -270 46 -254 Q0 -230 -48 -198 Z" fill={PARA_DARK} />
        <ellipse cx="-78" cy="-200" rx="38" ry="25" fill={PARA} />
        <ellipse cx="-116" cy="-191" rx="20" ry="12" fill="#e5dbff" />
        <circle cx="-126" cy="-196" r="2.5" fill="#2b2d42" />
        <DinoEye cx={-74} cy={-207} r={10} skin={PARA} look={-1} />
        <ellipse className="dt-para-cheek" cx="-90" cy="-186" rx="11" ry="8" fill="#ff8fa3" opacity="0.6" />
        <Smile x={-112} y={-182} w={18} d={4} width={2.6} />
      </g>
      <Notes x={30} y={-290} texts={["Tröt!", "Tröt!"]} size={28} delays={[0.5, 1]} />
    </g>
  );
}

// ---------- Stegosaurus ----------

const STEGO = "#78c47f";
const STEGO_DARK = "#5ead69";
const PLATES: [number, number][] = [
  [-92, -124],
  [-58, -150],
  [-20, -164],
  [20, -164],
  [58, -150],
  [92, -126],
];

/** Plated dino facing right; the plates on his back ping up one after the other, he wags his tail and smiles. */
export function Stegosaurus() {
  return (
    <>
      <rect x="-78" y="-70" width="26" height="70" rx="11" fill={STEGO_DARK} />
      <rect x="70" y="-70" width="26" height="70" rx="11" fill={STEGO_DARK} />
      <g className="dt-stego-tail" style={{ transformOrigin: "-110px -66px" }}>
        <path d="M-110 -82 Q-168 -86 -208 -112 Q-216 -100 -206 -90 Q-160 -56 -110 -50 Z" fill={STEGO} />
        <ellipse cx="-196" cy="-118" rx="6" ry="13" transform="rotate(-30 -196 -118)" fill="#f4a261" />
        <ellipse cx="-180" cy="-112" rx="6" ry="12" transform="rotate(-10 -180 -112)" fill="#f4a261" />
      </g>
      {PLATES.map(([x, y], i) => (
        <g key={x} className="dt-stego-plate" style={nth(i)}>
          <path d={leafPath(x, y + 24, 24, 48)} fill="#f4a261" />
          <path d={leafPath(x, y + 18, 12, 30)} fill="#ffc98b" />
        </g>
      ))}
      <path d="M-122 -50 Q-102 -152 0 -158 Q102 -154 138 -72 Q142 -44 110 -40 H-100 Q-126 -42 -122 -50 Z" fill={STEGO} />
      <path d="M-100 -52 Q0 -30 110 -54 Q90 -40 0 -40 Q-80 -40 -100 -52 Z" fill="#c7ecc0" />
      <g fill="#93d49a">
        <circle cx="-50" cy="-110" r="10" />
        <circle cx="0" cy="-128" r="12" />
        <circle cx="50" cy="-108" r="9" />
      </g>
      <rect x="-104" y="-72" width="32" height="72" rx="13" fill={STEGO} />
      <rect x="50" y="-72" width="32" height="72" rx="13" fill={STEGO} />
      <path d="M108 -92 Q150 -98 170 -78 L168 -50 Q140 -50 108 -60 Z" fill={STEGO} />
      <g className="dt-stego-head" style={{ transformOrigin: "132px -72px" }}>
        <ellipse cx="176" cy="-68" rx="32" ry="22" fill={STEGO} />
        <circle cx="202" cy="-74" r="2.5" fill="#2b2d42" />
        <DinoEye cx={172} cy={-76} r={9} skin={STEGO} look={1} />
        <Cheek cx={184} cy={-56} r={6} />
        <Smile x={188} y={-60} w={16} d={4} width={2.6} />
      </g>
      <g className="dt-stego-sparks" fill="#fff3b0">
        {PLATES.map(([x, y], i) => (
          <path key={x} d={sparklePath(x, y - 34, 9)} style={nth(i)} />
        ))}
      </g>
    </>
  );
}

// ---------- Triceratops ----------

interface TriColours {
  skin: string;
  dark: string;
  frill: string;
  inner: string;
}

const TRI: TriColours = { skin: "#ffd166", dark: "#f2b84b", frill: "#f8961e", inner: "#ffb347" };
const TRI_BABY: TriColours = { skin: "#ffe08a", dark: "#f5c86a", frill: "#ffa94d", inner: "#ffc078" };

/** A three-horned dino facing right. Horns are short and round, the frill has spots. */
function TriBody({ c, baby = false }: { c: TriColours; baby?: boolean }) {
  return (
    <>
      <rect x="-82" y="-62" width="28" height="62" rx="12" fill={c.dark} />
      <rect x="40" y="-62" width="28" height="62" rx="12" fill={c.dark} />
      <path className="dt-tri-tail" d="M-108 -94 Q-162 -84 -182 -52 Q-150 -56 -108 -62 Z" fill={c.skin} style={{ transformOrigin: "-110px -76px" }} />
      <ellipse cx="-10" cy="-92" rx="110" ry="58" fill={c.skin} />
      <path d="M-100 -66 Q-10 -26 90 -64 Q60 -44 -10 -42 Q-70 -44 -100 -66 Z" fill="#fff0c2" />
      <path d="M-80 -130 Q-20 -152 40 -140" stroke="#fff" strokeOpacity="0.4" strokeWidth="9" strokeLinecap="round" fill="none" />
      <rect x="-106" y="-66" width="32" height="66" rx="13" fill={c.skin} />
      <rect className="dt-tri-leg" x="20" y="-66" width="32" height="66" rx="13" fill={c.skin} style={{ transformOrigin: "36px -60px" }} />
      <g className="dt-tri-head" style={{ transformOrigin: "80px -100px" }}>
        <circle cx="78" cy="-124" r="58" fill={c.frill} />
        <circle cx="80" cy="-122" r="44" fill={c.inner} />
        {[200, 240, 280, 320, 0].map((a) => (
          <circle key={a} cx={78 + 50 * Math.cos((a * Math.PI) / 180)} cy={-124 + 50 * Math.sin((a * Math.PI) / 180)} r="6" fill="#ffe8a3" />
        ))}
        <path d="M112 -124 Q118 -168 144 -182 Q150 -178 146 -170 Q136 -150 130 -118 Z" fill={CREAM} />
        <path d="M134 -120 Q144 -160 168 -170 Q174 -166 170 -158 Q158 -140 150 -114 Z" fill="#fff1cf" />
        <path d="M70 -120 Q120 -142 160 -112 Q188 -90 184 -72 Q172 -56 140 -58 Q96 -60 76 -80 Z" fill={c.skin} />
        <path d="M172 -98 Q176 -118 188 -124 Q192 -120 190 -114 Q186 -104 184 -92 Z" fill={CREAM} />
        <path d="M176 -90 Q196 -86 194 -70 Q186 -60 176 -64 Z" fill={c.dark} />
        <circle cx="180" cy="-84" r="2.5" fill="#2b2d42" />
        <DinoEye cx={132} cy={-104} r={baby ? 13 : 10} skin={c.skin} look={1} />
        <Cheek cx={150} cy={-78} r={7} />
        <Smile x={150} y={-70} w={18} d={4} width={2.8} />
        <g className="dt-tri-puffs">
          {[0, 1, 2].map((i) => (
            <Puff key={i} x={204 + i * 10} y={-86 - i * 4} r={7 + i * 2} className="dt-tri-puff" i={i} />
          ))}
        </g>
      </g>
    </>
  );
}

/** Mother Triceratops: she nods her big head, snorts little clouds and stamps a foot. */
export function Triceratops() {
  return <TriBody c={TRI} />;
}

/** The Triceratops child: smaller, rounder, with bigger eyes; it hops and nods. */
export function TriceratopsBaby() {
  return (
    <g className="dt-babytri-body">
      <g transform="scale(0.52)">
        <TriBody c={TRI_BABY} baby />
      </g>
      <Notes x={60} y={-110} texts={["Mini!"]} size={18} delays={[0.5]} />
    </g>
  );
}

// ---------- Dino-Mama (Maiasaura) ----------

const MAMA = "#f7a8c4";
const MAMA_DARK = "#e98ab0";

/** The mother of the nest, facing right; she bends down to her eggs, hums, and a heart floats up. */
export function DinoMama() {
  return (
    <>
      <path className="dt-mama-tail" d="M-70 -114 Q-140 -102 -172 -60 Q-162 -50 -146 -58 Q-110 -82 -60 -82 Z" fill={MAMA} style={{ transformOrigin: "-70px -98px" }} />
      <rect x="-20" y="-82" width="26" height="82" rx="11" fill={MAMA_DARK} />
      <ellipse cx="-10" cy="-2" rx="20" ry="7" fill={MAMA_DARK} />
      <ellipse cx="-10" cy="-112" rx="76" ry="54" fill={MAMA} />
      <path d="M-70 -90 Q-10 -60 56 -92 Q30 -70 -10 -68 Q-50 -70 -70 -90 Z" fill="#ffe0ec" />
      <path d="M-60 -150 Q-20 -168 30 -156" stroke="#fff" strokeOpacity="0.4" strokeWidth="8" strokeLinecap="round" fill="none" />
      <g fill="#fbc4d8">
        <circle cx="-40" cy="-130" r="8" />
        <circle cx="-8" cy="-140" r="9" />
      </g>
      <ellipse cx="-30" cy="-84" rx="32" ry="38" fill={MAMA} />
      <rect x="-44" y="-64" width="28" height="64" rx="12" fill={MAMA} />
      <ellipse cx="-36" cy="-2" rx="22" ry="8" fill={MAMA} />
      <path className="dt-mama-arm" d="M48 -110 Q72 -98 74 -80 Q66 -76 62 -84 Q56 -96 40 -98 Z" fill={MAMA_DARK} style={{ transformOrigin: "46px -106px" }} />
      <path d="M36 -144 Q62 -172 72 -194 L104 -180 Q90 -152 58 -110 Z" fill={MAMA} />
      <g className="dt-mama-head" style={{ transformOrigin: "66px -150px" }}>
        <ellipse cx="98" cy="-198" rx="38" ry="26" fill={MAMA} />
        <ellipse cx="136" cy="-188" rx="20" ry="12" fill="#ffe0ec" />
        <circle cx="146" cy="-194" r="2.5" fill="#2b2d42" />
        <path d="M80 -222 Q86 -236 98 -232 Q104 -222 96 -216 Z" fill={MAMA_DARK} />
        {/* A little flower behind her crest */}
        <g fill="#fff3b0">
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx="72" cy="-232" rx="4" ry="6" transform={`rotate(${a} 72 -226)`} />
          ))}
        </g>
        <circle cx="72" cy="-226" r="3.5" fill="#ffb703" />
        <path d="M92 -218 l-3 -7 M99 -219 l0 -8 M106 -217 l3 -7" stroke="#2b2d42" strokeWidth="2.4" strokeLinecap="round" />
        <DinoEye cx={100} cy={-206} r={10} skin={MAMA} look={1} />
        <Cheek cx={116} cy={-180} r={7} />
        <Smile x={124} y={-178} w={18} d={4} width={2.6} />
      </g>
      <g className="dt-mama-hearts" fill="#ff6b8b">
        {[0, 1].map((i) => (
          <path key={i} d={heartPath(150 + i * 26, -236 - i * 14, 12 - i * 3)} style={nth(i)} />
        ))}
      </g>
      <Notes x={-60} y={-200} texts={["♪", "♫"]} colour="#ffd6e7" size={28} delays={[0.4, 1]} />
    </>
  );
}

// ---------- Ankylosaurus ----------

const ANKY = "#d9a066";
const ANKY_DARK = "#c48a52";
const BUMPS: [number, number][] = [
  [-80, -76],
  [-50, -96],
  [-14, -104],
  [24, -102],
  [58, -90],
  [-60, -60],
  [-24, -70],
  [14, -72],
  [50, -62],
];

/** The armoured dino facing left; his bumps wobble, he swings his round tail club and smiles. */
export function Ankylosaurus() {
  return (
    <g className="dt-anky-body">
      <rect x="-66" y="-42" width="24" height="42" rx="10" fill={ANKY_DARK} />
      <rect x="50" y="-42" width="24" height="42" rx="10" fill={ANKY_DARK} />
      <g className="dt-anky-tail" style={{ transformOrigin: "86px -48px" }}>
        <path d="M80 -62 Q130 -58 160 -46 L160 -32 Q120 -36 80 -34 Z" fill={ANKY} />
        <ellipse cx="170" cy="-40" rx="22" ry="17" fill="#b97d45" />
        <ellipse cx="164" cy="-46" rx="8" ry="5" fill="#fff" opacity="0.4" />
      </g>
      <path d="M-112 -30 Q-112 -112 -10 -116 Q92 -114 102 -34 Q60 -24 -10 -24 Q-80 -24 -112 -30 Z" fill={ANKY} />
      <path d="M-100 -34 Q-10 -14 90 -36 Q60 -26 -10 -26 Q-70 -26 -100 -34 Z" fill="#f3d2a8" />
      {BUMPS.map(([x, y], i) => (
        <g key={`${x}-${y}`} className="dt-anky-bump" style={nth(i % 5)}>
          <circle cx={x} cy={y} r="11" fill="#b97d45" />
          <circle cx={x - 3} cy={y - 4} r="4" fill="#fff" opacity="0.35" />
        </g>
      ))}
      <rect x="-92" y="-44" width="28" height="44" rx="11" fill={ANKY} />
      <rect x="28" y="-44" width="28" height="44" rx="11" fill={ANKY} />
      <g className="dt-anky-head" style={{ transformOrigin: "-100px -50px" }}>
        <circle cx="-112" cy="-74" r="9" fill="#b97d45" />
        <circle cx="-140" cy="-74" r="8" fill="#b97d45" />
        <ellipse cx="-128" cy="-54" rx="34" ry="25" fill={ANKY} />
        <circle cx="-158" cy="-56" r="2.5" fill="#2b2d42" />
        <DinoEye cx={-128} cy={-62} r={9} skin={ANKY} look={-1} />
        <Cheek cx={-140} cy={-42} r={6} />
        <Smile x={-160} y={-44} w={18} d={4} width={2.6} />
      </g>
      <Notes x={150} y={-90} texts={["Bumm!"]} size={24} delays={[1]} />
    </g>
  );
}

// ---------- T-Rex ----------

const TREX = "#7bc96f";
const TREX_DARK = "#5fae5a";

/** Big friendly T-Rex facing left: he roars ever so softly, his nose tickles ("Ha… ha…") and he sneezes "Hatschi!". */
export function TRex() {
  return (
    <g className="dt-trex-body">
      <g className="dt-trex-tail" style={{ transformOrigin: "60px -150px" }}>
        <path d="M44 -186 Q146 -176 204 -100 Q208 -82 190 -86 Q130 -124 44 -118 Z" fill={TREX} />
        <path d="M120 -164 q6 12 0 22 M156 -138 q6 10 0 18" stroke={TREX_DARK} strokeWidth="8" strokeLinecap="round" fill="none" />
      </g>
      <ellipse cx="44" cy="-104" rx="34" ry="44" fill={TREX_DARK} />
      <rect x="28" y="-80" width="30" height="74" rx="12" fill={TREX_DARK} />
      <ellipse cx="32" cy="-8" rx="32" ry="10" fill={TREX_DARK} />
      <path className="dt-trex-arm dt-trex-arm-far" d="M-40 -176 Q-66 -170 -76 -150 Q-72 -142 -64 -146 Q-58 -158 -38 -160 Z" fill={TREX_DARK} style={{ transformOrigin: "-40px -170px" }} />
      <path d="M-62 -212 Q-44 -252 20 -248 Q92 -238 98 -162 Q98 -96 30 -86 Q-52 -86 -72 -140 Q-78 -180 -62 -212 Z" fill={TREX} />
      <ellipse cx="-30" cy="-148" rx="30" ry="56" fill="#d8f3c0" transform="rotate(-14 -30 -148)" />
      <path d="M10 -236 q10 10 6 24 M46 -226 q10 10 6 24 M74 -200 q10 8 8 22" stroke={TREX_DARK} strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M-20 -236 Q30 -250 70 -220" stroke="#fff" strokeOpacity="0.35" strokeWidth="10" strokeLinecap="round" fill="none" />
      <ellipse cx="12" cy="-98" rx="40" ry="50" fill={TREX} />
      <rect x="-6" y="-70" width="34" height="62" rx="14" fill={TREX} />
      <ellipse cx="-8" cy="-8" rx="38" ry="12" fill={TREX} />
      {[-36, -20, -4].map((x) => (
        <ellipse key={x} cx={x} cy={-4} rx="6" ry="5" fill={CREAM} />
      ))}
      <path className="dt-trex-arm" d="M-36 -164 Q-62 -158 -74 -138 Q-70 -130 -62 -134 Q-54 -146 -34 -148 Z" fill={TREX} style={{ transformOrigin: "-38px -158px" }} />
      <g className="dt-trex-head" style={{ transformOrigin: "-40px -226px" }}>
        <path className="dt-trex-mouth" d="M-44 -232 H-158 Q-120 -206 -50 -214 Z" fill="#e56b6f" />
        <path className="dt-trex-jaw" d="M-40 -232 H-164 Q-174 -222 -162 -210 Q-100 -192 -48 -204 Z" fill="#c9eab4" style={{ transformOrigin: "-48px -226px" }} />
        <path d="M-20 -290 Q-40 -334 -110 -328 Q-178 -322 -188 -272 Q-192 -240 -170 -232 L-40 -228 Q-14 -250 -20 -290 Z" fill={TREX} />
        <path d="M-146 -233 q5 9 10 0 Z M-120 -232 q5 9 10 0 Z" fill="#fff" stroke="#4d8f48" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M-172 -238 Q-124 -226 -70 -238 q10 -2 14 -10" stroke="#2b2d42" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M-156 -300 Q-110 -320 -50 -300" stroke="#fff" strokeOpacity="0.35" strokeWidth="8" strokeLinecap="round" fill="none" />
        <g className="dt-trex-nose" style={{ transformOrigin: "-172px -278px" }}>
          <ellipse cx="-172" cy="-278" rx="6" ry="4" fill="#4d8f48" />
        </g>
        <path d="M-120 -310 Q-104 -318 -88 -312" stroke="#4d8f48" strokeWidth="4" strokeLinecap="round" fill="none" />
        <DinoEye cx={-102} cy={-282} r={15} skin={TREX} look={-1} />
        <Cheek cx={-124} cy={-250} r={10} />
        <Lines x={-190} y={-218} dir={-1} size={0.9} />
      </g>
      {/* The sneeze: a big puff and little sparkles from the nose */}
      <g className="dt-trex-sneeze">
        <Puff x={-214} y={-280} r={22} className="dt-trex-puff" i={0} />
        <Puff x={-250} y={-300} r={16} className="dt-trex-puff" i={1} />
        <Puff x={-246} y={-250} r={14} className="dt-trex-puff" i={2} />
        <g fill="#ffd166">
          {[
            [-280, -330],
            [-290, -260],
            [-226, -330],
          ].map(([x, y], i) => (
            <path key={i} className="dt-trex-spark" d={sparklePath(x, y, 10)} style={nth(i)} />
          ))}
        </g>
      </g>
      <Notes x={-250} y={-246} texts={["Rrr…"]} size={26} delays={[0.2]} />
      <Notes x={-200} y={-330} texts={["Ha…"]} size={28} delays={[0.95]} />
      <Notes x={-150} y={-350} texts={["ha…"]} size={28} delays={[1.3]} />
      <Notes x={-330} y={-300} texts={["Hatschi!"]} size={40} delays={[1.75]} colour="#fff3b0" />
    </g>
  );
}
