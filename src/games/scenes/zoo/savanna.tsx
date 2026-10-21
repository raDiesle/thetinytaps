import { CHEEK, Eye, INK, Inside, nth } from "../shared";
import { Drops, Lid } from "./parts";

// The big animals of the savanna and the middle enclosures. Each drawing has its foot
// point at (0, 0), except the lion, who lies on his rock (in the rock's coordinates).

const GIRAFFE = "#f4c95d";
const GIRAFFE_SHADE = "#e9b949";
const GIRAFFE_SPOT = "#c47a32";
const GIRAFFE_DARK = "#7f5539";

const GIRAFFE_SPOTS =
  "M-60 -250 q16 -10 30 0 q6 16 -10 24 q-18 2 -20 -24 Z M-14 -258 q20 -6 30 6 q-2 18 -22 18 q-14 -6 -8 -24 Z M34 -246 q18 -4 26 10 q-6 16 -24 12 q-10 -10 -2 -22 Z M-40 -214 q16 -6 26 6 q-4 16 -20 14 q-12 -6 -6 -20 Z M10 -214 q18 -4 24 10 q-8 14 -22 10 q-8 -10 -2 -20 Z M62 -214 q14 -2 20 10 q-6 12 -18 8 Z";
const NECK_SPOTS = "M-62 -280 q12 -6 20 4 q-2 12 -16 12 Z M-82 -326 q12 -6 18 4 q-4 12 -16 10 Z M-102 -368 q10 -4 16 4 q-4 10 -14 8 Z M-52 -248 q10 -2 14 6 q-6 8 -14 4 Z";

/** Giraffe in the savanna, facing left; she stretches her neck into the acacia and munches leaves. */
export function Giraffe() {
  return (
    <g className="zo-giraffe-body">
      <g className="zo-giraffe-tail" style={{ transformOrigin: "88px -222px" }}>
        <path d="M88 -222 Q106 -190 100 -150" stroke={GIRAFFE_DARK} strokeWidth="5" fill="none" strokeLinecap="round" />
        <ellipse cx="100" cy="-144" rx="6" ry="11" fill={GIRAFFE_DARK} />
      </g>
      {[-54, -30, 42, 66].map((x) => (
        <g key={x}>
          <rect x={x - 9} y="-220" width="18" height="208" rx="8" fill={x === -30 || x === 66 ? GIRAFFE : GIRAFFE_SHADE} />
          <ellipse cx={x} cy="-150" rx="6" ry="9" fill={GIRAFFE_SPOT} opacity="0.7" />
          <rect x={x - 10} y="-16" width="20" height="16" rx="5" fill="#5e3a1f" />
        </g>
      ))}
      <ellipse cx="6" cy="-226" rx="90" ry="46" fill={GIRAFFE} />
      <path d={GIRAFFE_SPOTS} fill={GIRAFFE_SPOT} />
      <ellipse cx="-6" cy="-262" rx="56" ry="8" fill="#fff" opacity="0.3" />
      <g className="zo-giraffe-neck" style={{ transformOrigin: "-50px -240px" }}>
        <path d="M-86 -232 L-142 -404 Q-126 -424 -102 -414 L-30 -252 Z" fill={GIRAFFE} />
        <path d={NECK_SPOTS} fill={GIRAFFE_SPOT} />
        <path d="M-100 -410 L-30 -256" stroke={GIRAFFE_DARK} strokeWidth="8" strokeLinecap="round" />
        <g className="zo-giraffe-head" style={{ transformOrigin: "-122px -412px" }}>
          <g className="zo-giraffe-horns" style={{ transformOrigin: "-118px -430px" }}>
            <path d="M-126 -430 L-132 -460 M-108 -428 L-106 -458" stroke={GIRAFFE} strokeWidth="7" strokeLinecap="round" />
            <circle cx="-132" cy="-462" r="7" fill={GIRAFFE_DARK} />
            <circle cx="-106" cy="-460" r="7" fill={GIRAFFE_DARK} />
          </g>
          <g className="zo-giraffe-ear" style={{ transformOrigin: "-104px -428px" }}>
            <ellipse cx="-92" cy="-432" rx="17" ry="7" fill={GIRAFFE_SHADE} transform="rotate(-25 -92 -432)" />
          </g>
          <path d="M-98 -442 Q-142 -450 -178 -422 Q-188 -400 -168 -392 Q-130 -390 -98 -404 Z" fill={GIRAFFE} />
          <ellipse cx="-166" cy="-406" rx="18" ry="14" fill="#fbe3a1" />
          <ellipse cx="-176" cy="-412" rx="3" ry="2" fill={GIRAFFE_DARK} />
          <path className="zo-giraffe-tongue" d="M-180 -398 Q-202 -394 -206 -408 Q-198 -414 -182 -404 Z" fill="#6d597a" style={{ transformOrigin: "-180px -400px" }} />
          <path d="M-180 -398 Q-170 -393 -158 -398" stroke={GIRAFFE_DARK} strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <circle cx="-140" cy="-404" r="5" fill={CHEEK} opacity="0.5" />
          <Eye cx={-128} cy={-424} r={4.6} />
          <Lid cx={-128} cy={-424} r={4.6} fill={GIRAFFE} />
          <path d="M-134 -430 l-4 -4 M-128 -431 v-5 M-122 -430 l3 -4" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
        </g>
        <g className="zo-giraffe-leaves" fill="#6a994e">
          {[
            [-196, -396],
            [-182, -388],
            [-206, -384],
          ].map(([cx, cy], i) => (
            <ellipse key={cx} cx={cx} cy={cy} rx="8" ry="4" style={nth(i)} />
          ))}
        </g>
      </g>
    </g>
  );
}

/** Ostrich in the savanna, facing right; it runs a few steps on its long legs. */
export function Strauss() {
  return (
    <>
      <g className="zo-strauss-body">
        <g className="zo-strauss-leg" style={{ transformOrigin: "-12px -140px" }}>
          <path d="M-12 -140 L-22 -72 L-14 -2" stroke="#f4acb7" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M-14 -2 h20" stroke="#e5989b" strokeWidth="8" strokeLinecap="round" />
        </g>
        <g className="zo-strauss-leg zo-strauss-leg-b" style={{ transformOrigin: "14px -140px" }}>
          <path d="M14 -140 L24 -72 L16 -2" stroke="#f4acb7" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M16 -2 h20" stroke="#e5989b" strokeWidth="8" strokeLinecap="round" />
        </g>
        <g className="zo-strauss-top">
          <ellipse cx="-10" cy="-146" rx="13" ry="20" fill="#f4acb7" />
          <ellipse cx="16" cy="-146" rx="13" ry="20" fill="#f4acb7" />
          <path className="zo-strauss-plume" d="M-60 -196 q-30 -6 -36 14 q-14 6 -8 22 q10 14 30 4 Z" fill="#fff" style={{ transformOrigin: "-60px -180px" }} />
          <ellipse cx="0" cy="-178" rx="72" ry="42" fill="#343a40" />
          <path d="M-50 -170 Q-10 -150 30 -166 Q10 -140 -30 -146 Q-50 -152 -50 -170 Z" fill="#fff" opacity="0.9" />
          <ellipse cx="-14" cy="-204" rx="40" ry="8" fill="#fff" opacity="0.15" />
          <g className="zo-strauss-neck" style={{ transformOrigin: "44px -198px" }}>
            <path d="M34 -200 Q72 -250 50 -300 L66 -306 Q92 -252 56 -190 Z" fill="#f4acb7" />
            <ellipse cx="62" cy="-314" rx="19" ry="15" fill="#f4acb7" />
            <circle cx="56" cy="-328" r="6" fill="#adb5bd" />
            <circle cx="64" cy="-330" r="5" fill="#adb5bd" />
            <path d="M78 -318 Q102 -312 78 -304 Z" fill="#f4a261" />
            <Eye cx={66} cy={-318} r={4.4} />
            <Lid cx={66} cy={-318} r={4.4} fill="#f4acb7" />
            <path d="M62 -324 l-2 -5 M67 -325 v-5 M72 -324 l2 -4" stroke={INK} strokeWidth="1.5" strokeLinecap="round" />
          </g>
        </g>
      </g>
      <Drops x={30} y={-6} className="zo-dust" fill="#d6c3a5" count={4} spread={22} />
    </>
  );
}

const ZEBRA_BODY = "M-92 -132 a92 44 0 1 0 184 0 a92 44 0 1 0 -184 0 Z";
const ZEBRA_NECK = "M40 -160 L84 -238 L118 -222 L88 -128 Z";
const ZEBRA_HEAD = "M86 -240 Q104 -260 124 -242 L162 -198 Q168 -180 148 -174 L130 -178 Q110 -190 92 -214 Z";

/** Zebra in the savanna, facing right; it jumps and kicks out with its hind legs. */
export function Zebra() {
  return (
    <>
      <Drops x={0} y={-6} className="zo-dust" fill="#d6c3a5" count={4} spread={34} />
      <g className="zo-zebra-body" style={{ transformOrigin: "56px 0px" }}>
        <g className="zo-zebra-tail" style={{ transformOrigin: "-86px -150px" }}>
          <path d="M-86 -150 Q-106 -120 -100 -82" stroke="#f8f9fa" strokeWidth="6" fill="none" strokeLinecap="round" />
          <ellipse cx="-100" cy="-76" rx="6" ry="11" fill={INK} />
        </g>
        <g className="zo-zebra-hind" style={{ transformOrigin: "-48px -110px" }}>
          {[-60, -36].map((x) => (
            <g key={x}>
              <rect x={x - 8} y="-120" width="16" height="108" rx="6" fill={x === -36 ? "#f8f9fa" : "#e9ecef"} />
              <path d={`M${x - 8} -86 h16 M${x - 8} -62 h16 M${x - 8} -38 h16`} stroke={INK} strokeWidth="6" />
              <rect x={x - 9} y="-16" width="18" height="16" rx="4" fill={INK} />
            </g>
          ))}
        </g>
        {[44, 68].map((x) => (
          <g key={x}>
            <rect x={x - 8} y="-120" width="16" height="108" rx="6" fill={x === 68 ? "#f8f9fa" : "#e9ecef"} />
            <path d={`M${x - 8} -86 h16 M${x - 8} -62 h16 M${x - 8} -38 h16`} stroke={INK} strokeWidth="6" />
            <rect x={x - 9} y="-16" width="18" height="16" rx="4" fill={INK} />
          </g>
        ))}
        <path d={ZEBRA_BODY} fill="#f8f9fa" />
        <Inside d={ZEBRA_BODY}>
          <path
            d="M-70 -180 Q-56 -132 -72 -84 M-42 -180 Q-28 -132 -44 -84 M-14 -180 Q0 -132 -14 -84 M14 -180 Q28 -132 14 -84 M42 -180 Q56 -132 42 -84 M70 -180 Q80 -140 72 -110"
            stroke={INK}
            strokeWidth="11"
            fill="none"
          />
        </Inside>
        <ellipse cx="-10" cy="-166" rx="56" ry="7" fill="#fff" opacity="0.5" />
        <path d={ZEBRA_NECK} fill="#f8f9fa" />
        <Inside d={ZEBRA_NECK}>
          <path d="M40 -150 L110 -170 M50 -176 L116 -196 M62 -202 L120 -218" stroke={INK} strokeWidth="10" />
        </Inside>
        <path d="M44 -170 L84 -248 L98 -240 L62 -158 Z" fill={INK} />
        <g className="zo-zebra-head" style={{ transformOrigin: "100px -226px" }}>
          <g className="zo-zebra-ear" style={{ transformOrigin: "103px -242px" }}>
            <path d="M94 -240 L98 -268 L112 -244 Z" fill="#f8f9fa" />
            <path d="M96 -256 L98 -268 L104 -258 Z" fill={INK} />
          </g>
          <path d={ZEBRA_HEAD} fill="#f8f9fa" />
          <Inside d={ZEBRA_HEAD}>
            <path d="M98 -246 L112 -230 M110 -250 L126 -234 M118 -228 L134 -214 M128 -214 L142 -200" stroke={INK} strokeWidth="6" />
          </Inside>
          <ellipse cx="150" cy="-186" rx="15" ry="12" fill="#495057" />
          <ellipse cx="156" cy="-190" rx="2.6" ry="2" fill="#212529" />
          <path d="M142 -178 Q150 -174 158 -178" stroke="#212529" strokeWidth="2" fill="none" strokeLinecap="round" />
          <Eye cx={108} cy={-224} r={3.8} />
          <Lid cx={108} cy={-224} r={3.8} fill="#f8f9fa" />
        </g>
      </g>
    </>
  );
}

const ELEPHANT = "#adb5bd";
const ELEPHANT_SHADE = "#949ca5";

/**
 * Elephant facing right: body, ear, trunk and the water it sprays. The calf uses the same
 * drawing, mirrored and smaller, without tusks; `prefix` keeps the classes apart.
 */
function ElephantShape({ prefix, tusk }: { prefix: string; tusk: boolean }) {
  return (
    <g className={`${prefix}-body`} style={{ transformOrigin: "0px 0px" }}>
      <g className={`${prefix}-tail`} style={{ transformOrigin: "-136px -200px" }}>
        <path d="M-136 -200 Q-156 -170 -150 -130" stroke={ELEPHANT_SHADE} strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M-150 -132 l-6 10 M-150 -132 l2 12 M-150 -132 l8 8" stroke="#6c757d" strokeWidth="3" strokeLinecap="round" />
      </g>
      {[-96, -56, 46, 86].map((x) => (
        <g key={x} className={x === 86 ? `${prefix}-leg` : undefined} style={x === 86 ? { transformOrigin: `${x}px -120px` } : undefined}>
          <rect x={x - 20} y="-130" width="40" height="130" rx="14" fill={x === -56 || x === 86 ? ELEPHANT : ELEPHANT_SHADE} />
          <path d={`M${x - 12} -4 a5 5 0 0 1 10 0 M${x + 2} -4 a5 5 0 0 1 10 0`} fill="#f1f3f5" />
        </g>
      ))}
      <ellipse cx="-14" cy="-176" rx="132" ry="92" fill={ELEPHANT} />
      <ellipse cx="-30" cy="-240" rx="80" ry="16" fill="#fff" opacity="0.3" />
      <circle cx="108" cy="-200" r="72" fill={ELEPHANT} />
      <g className={`${prefix}-trunk`} style={{ transformOrigin: "150px -186px" }}>
        <path d="M150 -186 Q204 -150 192 -86 Q188 -58 206 -48" stroke={ELEPHANT} strokeWidth="32" strokeLinecap="round" fill="none" />
        <path d="M166 -150 h18 M174 -124 h18 M174 -98 h16" stroke={ELEPHANT_SHADE} strokeWidth="3" strokeLinecap="round" />
      </g>
      {tusk && <path d="M140 -160 Q170 -130 196 -140 Q170 -150 154 -170 Z" fill="#fff8e7" />}
      <g className={`${prefix}-ear`} style={{ transformOrigin: "70px -236px" }}>
        <path d="M70 -262 Q10 -280 -6 -210 Q-6 -140 60 -144 Q86 -170 80 -260 Z" fill={ELEPHANT_SHADE} />
        <path d="M60 -244 Q20 -252 12 -206 Q12 -164 54 -164" stroke="#ffc8dd" strokeWidth="14" fill="none" strokeLinecap="round" opacity="0.7" />
      </g>
      <circle cx="140" cy="-196" r="8" fill={CHEEK} opacity="0.45" />
      <Eye cx={126} cy={-222} r={6} />
      <Lid cx={126} cy={-222} r={6} fill={ELEPHANT} />
      <path d="M118 -232 l-4 -6 M126 -234 v-7 M134 -232 l4 -6" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      <g className={`${prefix}-water`} fill="#74c0fc">
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={i} cx={280 + (i % 2) * 14} cy={-290 + (i % 3) * 10} r={9 - (i % 3) * 2} style={nth(i)} />
        ))}
      </g>
    </g>
  );
}

/** The big elephant; it lifts its trunk and sprays water. */
export function Elefant() {
  return <ElephantShape prefix="zo-elefant" tusk />;
}

/** The elephant calf, facing its mother (left). */
export function Elefantenbaby() {
  return (
    <g transform="scale(-0.6 0.6)">
      <ElephantShape prefix="zo-baby" tusk={false} />
    </g>
  );
}

/** Grey rhino in the middle enclosure, facing left; it snorts and stamps. */
export function Nashorn() {
  const skin = "#a19388";
  const shade = "#8a7d73";
  return (
    <g className="zo-nashorn-body">
      {/* A little bird hides behind the rhino's back and peeks out. */}
      <g className="zo-nashorn-bird">
        <ellipse cx="30" cy="-146" rx="16" ry="10" fill="#ffb703" />
        <g className="zo-nashorn-bird-wing" style={{ transformOrigin: "34px -150px" }}>
          <path d="M34 -152 Q48 -166 52 -148 Q44 -144 34 -148 Z" fill="#fb8500" />
        </g>
        <circle cx="16" cy="-156" r="9" fill="#ffb703" />
        <path d="M8 -158 L0 -155 L8 -152 Z" fill="#e63946" />
        <Eye cx={14} cy={-158} r={2} />
      </g>
      <path className="zo-nashorn-tail" d="M118 -136 Q138 -116 132 -90" stroke={shade} strokeWidth="5" fill="none" strokeLinecap="round" style={{ transformOrigin: "118px -136px" }} />
      {[-70, -40, 56, 86].map((x) => (
        <g key={x} className={x === -40 ? "zo-nashorn-stamp" : undefined} style={x === -40 ? { transformOrigin: `${x}px -90px` } : undefined}>
          <rect x={x - 17} y="-96" width="34" height="96" rx="12" fill={x === -40 || x === 86 ? skin : shade} />
          <path d={`M${x - 10} -4 a5 5 0 0 1 10 0 M${x + 1} -4 a5 5 0 0 1 10 0`} fill="#e9ecef" />
        </g>
      ))}
      <ellipse cx="16" cy="-122" rx="116" ry="62" fill={skin} />
      <path d="M-30 -170 Q10 -184 60 -170" stroke={shade} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M-40 -140 Q-36 -110 -44 -84 M40 -150 Q46 -120 40 -80" stroke={shade} strokeWidth="4" fill="none" strokeLinecap="round" />
      <ellipse cx="0" cy="-166" rx="60" ry="10" fill="#fff" opacity="0.25" />
      <g className="zo-nashorn-head" style={{ transformOrigin: "-80px -130px" }}>
        <path className="zo-nashorn-ears" d="M-90 -160 L-96 -188 L-78 -166 Z M-70 -162 L-70 -190 L-56 -164 Z" fill={shade} style={{ transformOrigin: "-76px -162px" }} />
        <path d="M-60 -168 Q-110 -176 -150 -140 Q-176 -118 -170 -96 Q-150 -82 -110 -90 Q-70 -96 -56 -110 Z" fill={skin} />
        <path d="M-154 -130 Q-172 -170 -164 -196 Q-150 -168 -136 -138 Z" fill="#f1e9df" />
        <path d="M-126 -146 Q-130 -162 -124 -172 Q-114 -160 -114 -148 Z" fill="#f1e9df" />
        <ellipse cx="-160" cy="-106" rx="3" ry="2.4" fill="#5c534c" />
        <path d="M-166 -94 Q-152 -88 -140 -94" stroke="#5c534c" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="-112" cy="-108" r="6" fill={CHEEK} opacity="0.45" />
        <Eye cx={-100} cy={-132} r={4} />
        <Lid cx={-100} cy={-132} r={4} fill={skin} />
      </g>
      <g className="zo-nashorn-puffs" fill="#e9ecef">
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={-186 - i * 8} cy={-96 + i * 6} r={9 + i * 2} style={nth(i)} />
        ))}
      </g>
      <g className="zo-nashorn-dust" fill="#d6c3a5">
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={-60 + i * 18} cy={-4} r={8} style={nth(i)} />
        ))}
      </g>
    </g>
  );
}

const MANE = "#c8641b";
const LION = "#f0b35a";

/** Lion lying on his rock (in the rock's coordinates), facing right; he yawns a big yawn. */
export function Loewe() {
  return (
    <g className="zo-loewe-body">
      <g className="zo-loewe-tail" style={{ transformOrigin: "-84px -150px" }}>
        <path d="M-84 -150 Q-130 -150 -140 -110 Q-146 -80 -130 -70" stroke={LION} strokeWidth="9" fill="none" strokeLinecap="round" />
        <ellipse cx="-128" cy="-66" rx="10" ry="13" fill={MANE} />
      </g>
      <ellipse cx="-16" cy="-160" rx="84" ry="38" fill={LION} />
      <ellipse cx="-30" cy="-186" rx="50" ry="8" fill="#fff" opacity="0.3" />
      <g className="zo-loewe-paws">
        <path d="M40 -134 H110 Q122 -128 110 -122 H40 Z M20 -128 H92 Q104 -122 92 -116 H20 Z" fill="#e9a24c" />
        <path d="M100 -132 v8 M94 -126 v6 M86 -132 v8" stroke="#c8841b" strokeWidth="2" strokeLinecap="round" />
      </g>
      <g className="zo-loewe-head" style={{ transformOrigin: "70px -170px" }}>
        <g className="zo-loewe-mane" style={{ transformOrigin: "84px -196px" }}>
          {Array.from({ length: 12 }, (_, i) => (
            <circle key={i} cx={84 + 50 * Math.cos((i * Math.PI) / 6)} cy={-196 + 50 * Math.sin((i * Math.PI) / 6)} r="22" fill={MANE} />
          ))}
          <circle cx="84" cy="-196" r="52" fill={MANE} />
        </g>
        {[62, 106].map((x) => (
          <g key={x} className="zo-loewe-ear" style={{ transformOrigin: `${x}px -216px` }}>
            <circle cx={x} cy="-226" r="10" fill={LION} />
            <circle cx={x} cy="-226" r="5" fill="#e9a24c" />
          </g>
        ))}
        <circle cx="84" cy="-196" r="36" fill={LION} />
        <ellipse cx="84" cy="-180" rx="20" ry="14" fill="#fbe3a1" />
        <g className="zo-loewe-mouth" style={{ transformOrigin: "84px -172px" }}>
          <ellipse cx="84" cy="-166" rx="12" ry="12" fill="#9d0208" />
          <ellipse cx="84" cy="-160" rx="7" ry="5" fill="#ff8fa3" />
        </g>
        <path d="M78 -186 H90 L84 -180 Z" fill="#6f4518" />
        <path d="M84 -180 V-174 M84 -174 Q78 -170 74 -174 M84 -174 Q90 -170 94 -174" stroke="#6f4518" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="64" cy="-186" r="6" fill={CHEEK} opacity="0.45" />
        <circle cx="104" cy="-186" r="6" fill={CHEEK} opacity="0.45" />
        <g className="zo-loewe-eyes">
          <Eye cx={72} cy={-202} r={4.2} />
          <Eye cx={96} cy={-202} r={4.2} />
        </g>
        <path className="zo-loewe-lids" d="M66 -202 q6 5 12 0 M90 -202 q6 5 12 0" stroke="#6f4518" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
}

/** Lion cub at the foot of the rock, facing left; it pounces and squeaks a tiny roar. */
export function Loewenbaby() {
  return (
    <g className="zo-cub-body" style={{ transformOrigin: "0px 0px" }}>
      <path className="zo-cub-tail" d="M40 -40 Q70 -50 66 -80" stroke={LION} strokeWidth="6" fill="none" strokeLinecap="round" style={{ transformOrigin: "40px -40px" }} />
      <circle cx="66" cy="-82" r="6" fill={MANE} />
      {[-30, -14, 22, 36].map((x) => (
        <rect key={x} x={x - 7} y="-40" width="14" height="40" rx="6" fill={x === -14 || x === 36 ? LION : "#e9a24c"} />
      ))}
      <ellipse cx="4" cy="-50" rx="46" ry="24" fill={LION} />
      <ellipse cx="-4" cy="-64" rx="26" ry="5" fill="#fff" opacity="0.3" />
      <g className="zo-cub-head" style={{ transformOrigin: "-34px -60px" }}>
        {[-56, -20].map((x) => (
          <g key={x} className="zo-cub-ear" style={{ transformOrigin: `${x}px -88px` }}>
            <circle cx={x} cy="-96" r="9" fill={LION} />
            <circle cx={x} cy="-96" r="4" fill="#ffc8dd" />
          </g>
        ))}
        <circle cx="-38" cy="-74" r="26" fill={LION} />
        <ellipse cx="-42" cy="-62" rx="13" ry="9" fill="#fbe3a1" />
        <g className="zo-cub-mouth" style={{ transformOrigin: "-42px -58px" }}>
          <ellipse cx="-42" cy="-55" rx="6" ry="6" fill="#9d0208" />
        </g>
        <path d="M-46 -68 H-38 L-42 -64 Z" fill="#6f4518" />
        <circle cx="-58" cy="-66" r="4.5" fill={CHEEK} opacity="0.5" />
        <circle cx="-24" cy="-66" r="4.5" fill={CHEEK} opacity="0.5" />
        <Eye cx={-50} cy={-80} r={4} />
        <Eye cx={-30} cy={-80} r={4} />
        <Lid cx={-50} cy={-80} r={4} fill={LION} />
        <Lid cx={-30} cy={-80} r={4} fill={LION} />
      </g>
    </g>
  );
}
