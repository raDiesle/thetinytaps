import type { ReactNode } from "react";
import { INK } from "@/games/scenes/shared";
import { playEngine, playHonk, playMoo, playRing } from "@/lib/realSounds";
import { playChime, playClick, playDoorbell, playPageTurn, playPlop, playPop, playRustle } from "@/lib/sfx";
import { Kid, KidHead, type Look, type Pose, useHero } from "../kid";
import type { Picture } from "../trail/items";
import type { Point } from "../trail/types";
import { Go, route } from "./move";
import { Grownup } from "./people";
import { BackHouse, Outdoors, Road, RoundTree } from "./places";
import { type Film, GROUND, type Scene, type SceneProps } from "./types";

// „Ein Brief für Oma“ (G-20, a film of something being made): the child picks what to paint for Oma, paints it,
// folds it into the envelope and sticks the stamp on, posts it, the post van takes it over the land to Oma's house,
// Oma opens it, and at last she rings to say thank you. A calm film: no siren, soft sounds, slow vehicles.

/** What the child can paint for Oma. */
export type Art = "sonne" | "blume" | "regenbogen";

const FAR = 2400;
/** The lane the post van drives on, in front of the pavement. */
const LANE = GROUND + 80;
/** Where the van drives in from and off to, out of the picture. */
const AWAY = -700;
const BEYOND = 2700;

const PARENT: Look = { shirt: "#20c997", pants: "#495057", hair: "#8d5a3b" };
const POSTIE: Look = { shirt: "#1c7ed6", pants: "#364fc7", hair: "#e8b04b", curly: true };
const OMA: Look = { shirt: "#cc5de8", pants: "#5f3dc4", hair: "#dee2e6", curly: true };

/** The child, in its own clothes. */
function Child({ pose, face = 1 }: { pose: Pose; face?: 1 | -1 }) {
  const hero = useHero();
  return <Kid look={hero} pose={pose} holding={null} wear={[]} face={face} />;
}

/** Something that pops in when it appears. */
function Pop({ children }: { children: ReactNode }) {
  return <g className="fm-pop">{children}</g>;
}

// ---------- The pictures for Oma ----------

/** One of the pictures, centred on (0, 0) in about 300 × 300. While `drawing`, its lines draw themselves and the
 * colours fill in after them, as if the crayon made them. */
function ArtDrawing({ art, drawing = false }: { art: Art; drawing?: boolean }) {
  const line = { className: "fm-br-line", pathLength: 100, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <g className={drawing ? "fm-br-drawing" : undefined}>
      {art === "sonne" && (
        <g>
          <circle className="fm-br-fill" r="62" fill="#ffe066" />
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI) / 4;
            return (
              <path
                key={i}
                {...line}
                d={`M${Math.cos(a) * 84} ${Math.sin(a) * 84} L${Math.cos(a) * 128} ${Math.sin(a) * 128}`}
                stroke="#fab005"
                strokeWidth="14"
              />
            );
          })}
          <circle {...line} r="62" stroke="#f59f00" strokeWidth="10" />
          <g className="fm-br-fill" fill={INK}>
            <circle cx="-20" cy="-12" r="7" />
            <circle cx="20" cy="-12" r="7" />
          </g>
          <path {...line} d="M-26 16 Q0 40 26 16" stroke={INK} strokeWidth="7" />
        </g>
      )}
      {art === "blume" && (
        <g>
          <path {...line} d="M0 140 Q-12 70 0 0" stroke="#2f9e44" strokeWidth="12" />
          <path className="fm-br-fill" d="M-6 96 Q-64 62 -78 104 Q-34 120 -6 96 Z M4 70 Q60 36 76 76 Q32 92 4 70 Z" fill="#69db7c" />
          <path {...line} d="M-6 96 Q-64 62 -78 104 Q-34 120 -6 96 M4 70 Q60 36 76 76 Q32 92 4 70" stroke="#2f9e44" strokeWidth="6" />
          {Array.from({ length: 6 }, (_, i) => {
            const a = (i * Math.PI) / 3;
            const [x, y] = [Math.cos(a) * 52, -40 + Math.sin(a) * 52];
            return (
              <g key={i}>
                <circle className="fm-br-fill" cx={x} cy={y} r="32" fill="#f783ac" />
                <circle {...line} cx={x} cy={y} r="32" stroke="#d6336c" strokeWidth="6" />
              </g>
            );
          })}
          <circle className="fm-br-fill" cy="-40" r="28" fill="#ffd43b" />
          <circle {...line} cy="-40" r="28" stroke="#f59f00" strokeWidth="7" />
        </g>
      )}
      {art === "regenbogen" && (
        <g>
          {["#ff6b6b", "#ff922b", "#ffd43b", "#51cf66", "#4dabf7", "#845ef7"].map((colour, i) => {
            const r = 140 - i * 18;
            return <path key={colour} {...line} d={`M${-r} 60 A${r} ${r} 0 0 1 ${r} 60`} stroke={colour} strokeWidth="18" />;
          })}
          {[-112, 112].map((x) => (
            <g key={x}>
              <path
                className="fm-br-fill"
                d={`M${x - 48} 80 Q${x - 54} 50 ${x - 24} 50 Q${x - 14} 28 ${x + 12} 40 Q${x + 44} 34 ${x + 48} 64 Q${x + 54} 84 ${x + 30} 84 Z`}
                fill="#fff"
              />
              <path
                {...line}
                d={`M${x - 48} 80 Q${x - 54} 50 ${x - 24} 50 Q${x - 14} 28 ${x + 12} 40 Q${x + 44} 34 ${x + 48} 64 Q${x + 54} 84 ${x + 30} 84 Z`}
                stroke="#74c0fc"
                strokeWidth="6"
              />
            </g>
          ))}
        </g>
      )}
    </g>
  );
}

/** A sheet of paper with the picture on it, centred on (0, 0). */
function Sheet({ art, w = 360, h = 300 }: { art: Art; w?: number; h?: number }) {
  return (
    <g>
      <rect x={-w / 2 + 8} y={-h / 2 + 10} width={w} height={h} rx="6" fill="#000" opacity="0.12" />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="6" fill="#fff" stroke={INK} strokeWidth="4" />
      <g transform={`scale(${Math.min(w, h) / 340})`}>
        <ArtDrawing art={art} />
      </g>
    </g>
  );
}

/** A small closed letter, centred on (0, 0): blue with a red heart stamp in its corner. */
function Letter({ s = 1 }: { s?: number }) {
  return (
    <g transform={`scale(${s})`}>
      <rect x="-40" y="-26" width="80" height="52" rx="5" fill="#a5d8ff" stroke={INK} strokeWidth="4" />
      <path d="M-40 -26 L0 4 L40 -26" stroke={INK} strokeWidth="3" fill="none" strokeLinejoin="round" />
      <rect x="18" y="-20" width="16" height="18" rx="2" fill="#fff" stroke="#e03131" strokeWidth="2" />
      <path d="M26 -8 l-5 -5 a3 3 0 0 1 5 -3 a3 3 0 0 1 5 3 Z" fill="#e03131" />
    </g>
  );
}

/** The stamp: a white serrated square with a red heart. Centred on (0, 0). */
function Stamp() {
  const teeth = Array.from({ length: 6 }, (_, i) => -40 + i * 16);
  return (
    <g>
      <rect x="-44" y="-54" width="88" height="108" fill="#fff" stroke={INK} strokeWidth="3" />
      <g fill="#c08552">
        {teeth.map((t) => (
          <g key={t}>
            <circle cx={t} cy="-54" r="5" />
            <circle cx={t} cy="54" r="5" />
          </g>
        ))}
        {Array.from({ length: 7 }, (_, i) => -48 + i * 16).map((t) => (
          <g key={t}>
            <circle cx="-44" cy={t} r="5" />
            <circle cx="44" cy={t} r="5" />
          </g>
        ))}
      </g>
      <rect x="-32" y="-42" width="64" height="84" fill="#ffe3e3" />
      <path d="M0 26 L-26 0 a14 14 0 0 1 26 -18 a14 14 0 0 1 26 18 Z" fill="#e03131" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    </g>
  );
}

/** A heart, centred on (0, 0). */
function Heart({ fill = "#ff6b6b" }: { fill?: string }) {
  return <path d="M0 30 L-32 -2 a18 18 0 0 1 32 -24 a18 18 0 0 1 32 24 Z" fill={fill} stroke={INK} strokeWidth="4" strokeLinejoin="round" />;
}

/** Hearts rising slowly from (0, 0), one after the other. */
function Hearts() {
  return (
    <g>
      {[
        [-90, 0.7, "#ff6b6b"],
        [0, 1, "#f783ac"],
        [90, 0.8, "#ff8787"],
      ].map(([x, s, fill], i) => (
        <g key={i} transform={`translate(${x} 0)`}>
          <g className="fm-br-heart" style={{ animationDelay: `${i * 0.6}s` }}>
            <g transform={`scale(${s})`}>
              <Heart fill={fill as string} />
            </g>
          </g>
        </g>
      ))}
    </g>
  );
}

// ---------- Things of the film ----------

/** The yellow post van, its wheels on (0, 0), from x -200 (back) to 200 (front), driving right. */
function PostVan({ driving = false }: { driving?: boolean }) {
  return (
    <g>
      <ellipse cx="0" cy="0" rx="210" ry="12" fill="#000" opacity="0.15" />
      <path
        d="M-200 -40 V-232 Q-200 -250 -180 -250 H96 Q112 -250 122 -234 L168 -156 Q200 -150 200 -120 V-40 Z"
        fill="#ffd43b"
        stroke={INK}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path d="M104 -232 L152 -156 H100 Z" fill="#d0ebff" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M112 -214 l10 16" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
      <path d="M90 -244 V-48 M-150 -244 V-48" stroke={INK} strokeOpacity="0.4" strokeWidth="3" />
      <rect x="-200" y="-112" width="400" height="16" fill="#f59f00" />
      <rect x="66" y="-140" width="18" height="6" rx="3" fill={INK} opacity="0.5" />
      {/* The post horn on its side */}
      <g transform="translate(-30 -178)" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round">
        <path d="M-50 18 Q-56 -30 -6 -32 Q44 -32 40 10 Q36 34 8 30 Q-14 26 -12 6" />
        <path d="M-50 18 L-80 4 V40 Z" fill={INK} strokeWidth="4" strokeLinejoin="round" />
      </g>
      <circle cx="194" cy="-96" r="10" fill="#ffe066" stroke={INK} strokeWidth="2.5" />
      <rect x="-206" y="-58" width="44" height="14" rx="6" fill="#ced4da" stroke={INK} strokeWidth="3" />
      <rect x="166" y="-58" width="44" height="14" rx="6" fill="#ced4da" stroke={INK} strokeWidth="3" />
      {[-120, 120].map((x) => (
        <g key={x} transform={`translate(${x} -32)`}>
          <circle r="34" fill="#343a40" stroke={INK} strokeWidth="3" />
          <g className={driving ? "fm-wheel spin" : "fm-wheel"}>
            <circle r="15" fill="#ced4da" stroke={INK} strokeWidth="2.5" />
            <path d="M-15 0 H15 M0 -15 V15" stroke="#868e96" strokeWidth="4" />
          </g>
        </g>
      ))}
    </g>
  );
}

/** The postbox on its post, standing on (0, 0): the slot at the top, a door below; `open` swings the door aside and
 * shows the letters inside. */
function Postbox({ open = false, full = true }: { open?: boolean; full?: boolean }) {
  return (
    <g>
      <ellipse cx="0" cy="0" rx="34" ry="7" fill="#000" opacity="0.15" />
      <rect x="-11" y="-140" width="22" height="140" fill="#495057" stroke={INK} strokeWidth="3" />
      <path d="M-64 -320 Q0 -362 64 -320 Z" fill="#fab005" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <rect x="-62" y="-322" width="124" height="190" rx="10" fill="#ffd43b" stroke={INK} strokeWidth="4" />
      <rect x="-42" y="-292" width="84" height="14" rx="5" fill={INK} />
      <rect x="-46" y="-262" width="92" height="112" rx="8" fill="#5c3d2e" stroke={INK} strokeWidth="3" />
      {full && (
        <g>
          {[
            [-14, -180, -8, "#fff"],
            [12, -196, 10, "#ffe3e3"],
            [-6, -214, 4, "#a5d8ff"],
          ].map(([x, y, a, fill]) => (
            <g key={`${x}`} transform={`translate(${x} ${y}) rotate(${a}) scale(0.6)`}>
              <rect x="-40" y="-26" width="80" height="52" rx="5" fill={fill as string} stroke={INK} strokeWidth="4" />
            </g>
          ))}
        </g>
      )}
      <g className="fm-br-door" style={{ transform: open ? "scaleX(-0.15)" : "none" }}>
        <rect x="-46" y="-262" width="92" height="112" rx="8" fill="#ffe066" stroke={INK} strokeWidth="3" />
        <g transform="translate(0 -206) scale(0.42)" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round">
          <path d="M-50 18 Q-56 -30 -6 -32 Q44 -32 40 10 Q36 34 8 30 Q-14 26 -12 6" />
          <path d="M-50 18 L-80 4 V40 Z" fill={INK} strokeWidth="4" strokeLinejoin="round" />
        </g>
        <circle cx="34" cy="-206" r="5" fill={INK} />
      </g>
    </g>
  );
}

/** A spotted cow standing on (0, 0), looking right; `moo` lifts its head once. */
function Cow({ moo = false }: { moo?: boolean }) {
  return (
    <g>
      <ellipse cx="0" cy="0" rx="90" ry="9" fill="#000" opacity="0.12" />
      {[-56, -30, 34, 58].map((x) => (
        <rect key={x} x={x - 8} y="-62" width="16" height="62" rx="6" fill="#fff" stroke={INK} strokeWidth="3" />
      ))}
      <path d="M-84 -110 Q-112 -96 -100 -60" stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round" />
      <ellipse cx="0" cy="-96" rx="88" ry="50" fill="#fff" stroke={INK} strokeWidth="4" />
      <path d="M-50 -136 Q-20 -130 -26 -104 Q-50 -92 -62 -112 Z M14 -80 Q40 -94 52 -72 Q34 -56 14 -66 Z" fill="#343a40" />
      <ellipse cx="6" cy="-50" rx="16" ry="10" fill="#ffc9c9" stroke={INK} strokeWidth="2.5" />
      <g className={moo ? "fm-br-nod" : undefined} style={{ transformOrigin: "70px -110px" }}>
        <path d="M84 -150 l-8 -18 M112 -150 l8 -18" stroke="#e9ecef" strokeWidth="8" strokeLinecap="round" />
        <ellipse cx="66" cy="-142" rx="16" ry="8" fill="#fff" stroke={INK} strokeWidth="3" transform="rotate(-24 66 -142)" />
        <ellipse cx="98" cy="-124" rx="30" ry="34" fill="#fff" stroke={INK} strokeWidth="4" />
        <ellipse cx="108" cy="-98" rx="26" ry="18" fill="#ffc9c9" stroke={INK} strokeWidth="3" />
        <circle cx="100" cy="-100" r="3.5" fill={INK} />
        <circle cx="116" cy="-100" r="3.5" fill={INK} />
        <circle cx="94" cy="-134" r="4.5" fill={INK} />
        {moo && <ellipse cx="108" cy="-88" rx="8" ry="5" fill="#a61e4d" />}
      </g>
    </g>
  );
}

/** The phone at home, standing on (0, 0): a round red body with the receiver on top; it wobbles while it rings. */
function Phone({ ringing = false }: { ringing?: boolean }) {
  return (
    <g className={ringing ? "fm-br-ring" : undefined}>
      <path d="M-46 0 Q-50 -44 -24 -50 H24 Q50 -44 46 0 Z" fill="#e03131" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <circle cx="0" cy="-24" r="16" fill="#fff" stroke={INK} strokeWidth="3" />
      <circle cx="0" cy="-24" r="5" fill={INK} />
      <path d="M-50 -60 Q-50 -76 -34 -74 H34 Q50 -76 50 -60 L40 -50 H-40 Z" fill="#c92a2a" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    </g>
  );
}

// ---------- Small pictures: the strip of scenes and the choice ----------

/** A picture for the strip or a sign, drawn centred and lifted so it stands on (0, 0) like the other pictures. */
const pic = (w: number, h: number, draw: () => ReactNode): Picture => ({ w, h, draw: () => <g transform={`translate(0 ${-h / 2})`}>{draw()}</g> });

const ART_ICON: Record<Art, Picture> = {
  sonne: pic(300, 300, () => <ArtDrawing art="sonne" />),
  blume: pic(300, 340, () => <ArtDrawing art="blume" />),
  regenbogen: pic(320, 240, () => <ArtDrawing art="regenbogen" />),
};
const HOME_ICON = pic(300, 220, () => (
  <g>
    <rect x="-140" y="-10" width="280" height="20" rx="4" fill="#a0522d" stroke={INK} strokeWidth="6" />
    <rect x="-120" y="10" width="16" height="90" fill="#8d5a3b" />
    <rect x="104" y="10" width="16" height="90" fill="#8d5a3b" />
    <rect x="-90" y="-60" width="110" height="46" rx="4" fill="#fff" stroke={INK} strokeWidth="6" transform="rotate(-6)" />
    <g transform="translate(90 -10) scale(0.9)">
      <Phone />
    </g>
  </g>
));
const PAINT_ICON = pic(300, 240, () => (
  <g>
    <rect x="-140" y="-110" width="280" height="220" rx="8" fill="#fff" stroke={INK} strokeWidth="8" />
    <path d="M-80 40 Q-40 -60 0 20 Q40 90 80 -30" stroke="#e03131" strokeWidth="14" strokeLinecap="round" fill="none" />
  </g>
));
const POSTBOX_ICON = pic(160, 380, () => (
  <g transform="translate(0 180)">
    <Postbox full={false} />
  </g>
));
const VAN_ICON = pic(440, 280, () => (
  <g transform="translate(0 130)">
    <PostVan />
  </g>
));
const OMA_ICON = pic(300, 300, () => (
  <g>
    <rect x="-140" y="-140" width="280" height="280" rx="30" fill="#fff4e6" stroke={INK} strokeWidth="6" />
    <g transform="translate(0 150) scale(1.5)">
      <KidHead look={OMA} />
    </g>
  </g>
));
const PHONE_ICON = pic(200, 200, () => (
  <g transform="translate(0 60) scale(1.7)">
    <Phone />
  </g>
));
const LETTER_ICON = pic(240, 160, () => <Letter s={2.6} />);

const ART_SAY: Record<Art, string> = {
  sonne: "Eine Sonne!",
  blume: "Eine Blume!",
  regenbogen: "Einen Regenbogen!",
};

// ---------- At home: what do we paint for Oma? ----------

/** The table at home: its top at `TABLE_TOP`, from x 580 to 1020. */
const TABLE_TOP = GROUND - 110;
/** Where the phone stands on the table. */
const PHONE_AT: Point = [970, TABLE_TOP];

/** The living room: a warm wall with a window, Oma's picture in a frame, a plant, a wooden floor; the table with the
 * crayons and the phone. */
function Room({ ringing = false, paper = true, children }: { ringing?: boolean; paper?: boolean; children?: ReactNode }) {
  return (
    <g>
      <rect x={-FAR} y={-FAR} width={FAR * 3} height={FAR + GROUND} fill="#fff4e6" />
      <rect x={-FAR} y={GROUND - 200} width={FAR * 3} height="200" fill="#ffe8cc" />
      <path d={`M${-FAR} ${GROUND - 200} H${FAR * 2}`} stroke="#e8b04b" strokeWidth="10" />
      <rect x={-FAR} y={GROUND - 16} width={FAR * 3} height="16" fill="#d9a066" stroke={INK} strokeWidth="2" />
      <rect x={-FAR} y={GROUND} width={FAR * 3} height={FAR} fill="#d9a066" />
      <path d={`M${-FAR} ${GROUND + 40} H${FAR * 2} M${-FAR} ${GROUND + 92} H${FAR * 2}`} stroke="#c08552" strokeWidth="4" />
      {/* The window, the sky outside, curtains on a rod */}
      <rect x="170" y="170" width="260" height="260" rx="8" fill="#a5d8ff" stroke={INK} strokeWidth="5" />
      <circle cx="380" cy="220" r="30" fill="#ffe066" stroke="#fab005" strokeWidth="4" />
      <path d="M200 300 Q200 276 228 278 Q240 256 266 268 Q292 262 296 290 Q316 296 300 312 H210 Q196 312 200 300 Z" fill="#fff" />
      <path d="M300 170 V430 M170 300 H430" stroke="#fff" strokeWidth="12" />
      <path d="M300 170 V430 M170 300 H430" stroke={INK} strokeWidth="3" />
      <path
        d="M156 160 Q176 300 160 440 L136 440 V160 Z M444 160 Q424 300 440 440 L464 440 V160 Z"
        fill="#ffc078"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M126 158 H474" stroke="#8d5a3b" strokeWidth="10" strokeLinecap="round" />
      <rect x="160" y="430" width="280" height="14" rx="5" fill="#fff" stroke={INK} strokeWidth="3" />
      {/* Oma's picture on the wall */}
      <rect x="1230" y="196" width="160" height="150" rx="6" fill="#fff9db" stroke="#a0522d" strokeWidth="12" />
      <g transform="translate(1310 362) scale(0.62)">
        <KidHead look={OMA} />
      </g>
      {/* A plant in the corner */}
      <g transform={`translate(1470 ${GROUND})`}>
        <path d="M-34 0 L-26 -70 H26 L34 0 Z" fill="#e8590c" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <g fill="#40c057" stroke={INK} strokeWidth="3">
          <ellipse cx="-34" cy="-110" rx="18" ry="44" transform="rotate(-30 -34 -110)" />
          <ellipse cx="34" cy="-110" rx="18" ry="44" transform="rotate(30 34 -110)" />
          <ellipse cx="0" cy="-130" rx="18" ry="50" />
        </g>
      </g>
      {/* The table with the crayons, a sheet of paper and the phone */}
      <rect x="600" y={TABLE_TOP + 16} width="16" height={GROUND - TABLE_TOP - 16} fill="#8d5a3b" stroke={INK} strokeWidth="2" />
      <rect x="984" y={TABLE_TOP + 16} width="16" height={GROUND - TABLE_TOP - 16} fill="#8d5a3b" stroke={INK} strokeWidth="2" />
      <rect x="580" y={TABLE_TOP} width="440" height="20" rx="5" fill="#a0522d" stroke={INK} strokeWidth="3" />
      {paper && (
        <path d={`M640 ${TABLE_TOP} L690 ${TABLE_TOP - 10} H820 L790 ${TABLE_TOP} Z`} fill="#fff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      )}
      <g transform={`translate(860 ${TABLE_TOP})`}>
        {["#e03131", "#1c7ed6", "#2f9e44"].map((c, i) => (
          <rect
            key={c}
            x={-14 + i * 10}
            y={-66 + i * 4}
            width="9"
            height="40"
            rx="3"
            fill={c}
            stroke={INK}
            strokeWidth="2"
            transform={`rotate(${-10 + i * 10} ${-10 + i * 10} -30)`}
          />
        ))}
        <rect x="-22" y="-40" width="44" height="40" rx="6" fill="#4dabf7" stroke={INK} strokeWidth="3" />
      </g>
      <g transform={`translate(${PHONE_AT[0]} ${PHONE_AT[1]})`}>
        <Phone ringing={ringing} />
      </g>
      {children}
    </g>
  );
}

const KID_AT = 500;
const PARENT_AT = 1130;

function HomeDraw() {
  return (
    <Room>
      <g transform={`translate(${KID_AT} ${GROUND})`}>
        <Child pose="stand" />
      </g>
      <g transform={`translate(${PARENT_AT} ${GROUND})`}>
        <Grownup look={PARENT} pose="stand" face={-1} />
      </g>
    </Room>
  );
}

const home: Scene = {
  id: "zuhause",
  icon: HOME_ICON,
  focus: [240, 140, 1120, 660],
  Draw: HomeDraw,
  beats: [{ ms: 1800, say: "Heute malen wir Oma ein Bild und schicken es ihr." }],
  choice: {
    ask: "Was malen wir für Oma?",
    options: (["sonne", "blume", "regenbogen"] as Art[]).map((art, i) => ({
      id: art,
      picture: ART_ICON[art],
      at: [560 + i * 240, 300] as Point,
      r: 110,
      sign: true,
      say: ART_SAY[art],
    })),
  },
};

// ---------- At the table, seen from above: paint, fold, stamp ----------

const PAPER: Point = [530, 380];
const ENVELOPE: Point = [1100, 540];
const STAMP_AT: Point = [1380, 300];
/** The stamp's place on the envelope, in its top right corner. */
const STAMP_ON: Point = [ENVELOPE[0] + 120, ENVELOPE[1] - 64];
const CRAYON_REST: Point = [330, 680];

function PaintDraw({ step, busy, picks }: SceneProps) {
  const art = picks[0] as Art;
  const crayon = route<Point[]>(step, [
    [0, [CRAYON_REST]],
    [1, [CRAYON_REST, [420, 300], [640, 290], [430, 440], [630, 470], [540, 360], CRAYON_REST]],
  ]);
  const paper = route<Point[]>(step, [
    [0, [PAPER]],
    [2, [PAPER, [ENVELOPE[0], 320], [ENVELOPE[0], ENVELOPE[1] + 20]]],
  ]);
  const stamp = route<Point[]>(step, [
    [0, [STAMP_AT]],
    [3, [STAMP_AT, [STAMP_ON[0] + 60, STAMP_ON[1] - 140], STAMP_ON]],
  ]);
  const folding = step >= 2;
  const inside = step >= 3 || (step === 2 && !busy);
  const [ex, ey] = ENVELOPE;
  return (
    <g>
      {/* The tabletop: planks of warm wood */}
      <rect x={-FAR} y={-FAR} width={FAR * 3} height={FAR * 3} fill="#e8b678" />
      <path d={Array.from({ length: 40 }, (_, i) => `M${-FAR} ${-FAR + i * 130} H${FAR * 2}`).join(" ")} stroke="#c08552" strokeWidth="4" />
      <path d="M200 120 q40 8 80 0 M900 260 q60 10 120 0 M1300 700 q50 8 100 0" stroke="#d9a066" strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* The crayons lying below the paper */}
      {(
        [
          ["#1c7ed6", 450],
          ["#2f9e44", 560],
          ["#fab005", 670],
        ] as const
      ).map(([c, x]) => (
        <g key={c} transform={`translate(${x} 690) rotate(-8)`}>
          <rect x="-50" y="-10" width="90" height="20" rx="6" fill={c} stroke={INK} strokeWidth="3" />
          <path d="M40 -10 L62 0 L40 10 Z" fill="#ffe8cc" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        </g>
      ))}
      {/* The envelope seen from its back: the flap open while the picture goes in, then closed */}
      <path
        className="fm-br-flap"
        d={
          inside
            ? `M${ex - 170} ${ey - 110} L${ex} ${ey + 10} L${ex + 170} ${ey - 110} Z`
            : `M${ex - 170} ${ey - 110} L${ex} ${ey - 210} L${ex + 170} ${ey - 110} Z`
        }
        fill="#74c0fc"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {!inside && (
        <Go path={paper} ms={1800} delay={900}>
          <g className="fm-br-fold" style={{ transform: folding ? "scale(0.42, 0.3)" : "none" }}>
            <rect x="-290" y="-210" width="580" height="420" rx="8" fill="#000" opacity="0.12" transform="translate(10 12)" />
            <rect x="-290" y="-210" width="580" height="420" rx="8" fill="#fff" stroke={INK} strokeWidth="4" />
            {step >= 1 && <ArtDrawing art={art} drawing={step === 1} />}
          </g>
        </Go>
      )}
      <rect x={ex - 170} y={ey - 110} width="340" height="220" rx="8" fill="#a5d8ff" stroke={INK} strokeWidth="4" />
      <path d={`M${ex - 170} ${ey + 110} L${ex - 20} ${ey} M${ex + 170} ${ey + 110} L${ex + 20} ${ey}`} stroke={INK} strokeOpacity="0.35" strokeWidth="3" />
      {inside && (
        <path d={`M${ex - 170} ${ey - 110} L${ex} ${ey + 10} L${ex + 170} ${ey - 110}`} stroke={INK} strokeWidth="4" fill="none" strokeLinejoin="round" />
      )}
      <Go path={stamp} ms={1500}>
        <g transform={step >= 3 ? "scale(0.62)" : undefined} className="fm-br-stamp">
          <Stamp />
        </g>
      </Go>
      {/* The red crayon the child paints with */}
      <Go path={crayon} ms={3400}>
        <g transform="rotate(-40)">
          <rect x="-12" y="-120" width="24" height="110" rx="7" fill="#e03131" stroke={INK} strokeWidth="3" />
          <path d="M-12 -10 L0 16 L12 -10 Z" fill="#ffe8cc" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <path d="M-5 6 L0 16 L5 6 Z" fill="#e03131" />
        </g>
      </Go>
    </g>
  );
}

const paint: Scene = {
  id: "malen",
  icon: PAINT_ICON,
  focus: [100, 120, 1400, 620],
  Draw: PaintDraw,
  beats: [
    {
      tap: { at: PAPER, r: 170 },
      ask: "Mal das Bild für Oma!",
      sounds: [
        [200, playRustle],
        [1700, playRustle],
      ],
      say: "Kritzel, kratzel. Das wird schön!",
      ms: 3600,
    },
    {
      tap: { at: ENVELOPE, r: 150 },
      ask: "Jetzt in den Umschlag!",
      sounds: [
        [0, playPageTurn],
        [2200, playPlop],
      ],
      say: "Falten und hinein.",
      ms: 3000,
    },
    {
      tap: { at: STAMP_AT, r: 85 },
      ask: "Und die Briefmarke drauf!",
      sounds: [[1400, playPop]],
      say: "Die Briefmarke klebt. Der Brief ist fertig!",
      ms: 2400,
    },
  ],
};

// ---------- The postbox in the street ----------

const BOX_X = 900;
/** The postbox's slot and its door, in the picture. */
const SLOT: Point = [BOX_X, GROUND - 285];
const DOOR: Point = [BOX_X, GROUND - 206];
const KID_BOX = 780;
const VAN_STOP = 1310;
const POSTIE_AT = 1060;
/** The child holds the letter against its chest while it walks. */
const CARRY: Point = [26, -86];

function PostboxDraw({ step, busy }: SceneProps) {
  const kid = route<Point[]>(step, [
    [0, [[230, GROUND]]],
    [
      1,
      [
        [230, GROUND],
        [KID_BOX, GROUND],
      ],
    ],
  ]);
  const parent = route<Point[]>(step, [
    [0, [[80, GROUND]]],
    [
      1,
      [
        [80, GROUND],
        [630, GROUND],
      ],
    ],
  ]);
  const at = (x: number): Point => [x + CARRY[0], GROUND + CARRY[1]];
  const letter = route<Point[]>(step, [
    [0, [at(230)]],
    [1, [at(230), at(KID_BOX)]],
    [2, [at(KID_BOX), [SLOT[0], SLOT[1] - 30], [SLOT[0], SLOT[1] + 10]]],
  ]);
  const van = route<Point[]>(step, [
    [0, [[AWAY, LANE]]],
    [
      3,
      [
        [AWAY, LANE],
        [VAN_STOP, LANE],
      ],
    ],
    [
      6,
      [
        [VAN_STOP, LANE],
        [BEYOND, LANE],
      ],
    ],
  ]);
  const walking = busy && step === 1;
  const posted = step >= 3 || (step === 2 && !busy);
  const emptied = step >= 6 || (step === 5 && !busy);
  return (
    <g>
      <Outdoors />
      <BackHouse x={160} w={200} h={320} wall="#d0ebff" roof="#5c7cfa" />
      <BackHouse x={560} w={170} h={260} wall="#fff3bf" roof="#e8590c" />
      <RoundTree x={1260} s={0.95} />
      <BackHouse x={1560} w={200} h={300} wall="#e6fcf5" roof="#2b8a3e" />
      <Road />
      <g transform={`translate(${BOX_X} ${GROUND})`}>
        <Postbox open={step === 5} full={!emptied} />
      </g>
      <Go path={parent} ms={3000}>
        <Grownup look={PARENT} pose={walking ? "walk" : step >= 6 ? "cheer" : "stand"} face={1} />
      </Go>
      <Go path={kid} ms={3000}>
        <Child pose={walking ? "walk" : step === 2 && busy ? "lift" : step >= 6 ? "cheer" : "stand"} />
      </Go>
      {!posted && (
        <Go path={letter} ms={step === 2 ? 1000 : 3000}>
          <Letter s={0.8} />
        </Go>
      )}
      {step >= 4 && (
        <g transform={`translate(${POSTIE_AT} ${GROUND})`} className={step >= 6 ? "fm-board" : undefined}>
          <Pop>
            <Grownup look={POSTIE} pose={step === 5 && busy ? "hold" : "stand"} face={-1} />
          </Pop>
        </g>
      )}
      {step === 5 &&
        !emptied &&
        [
          ["#a5d8ff", 0],
          ["#fff", 1],
          ["#ffe3e3", 2],
        ].map(([fill, i]) => (
          <Go
            key={i}
            path={[
              [DOOR[0], DOOR[1] + 10],
              [DOOR[0] + 140, DOOR[1] - 60],
              [VAN_STOP - 190, LANE - 150],
            ]}
            ms={1200}
            delay={300 + (i as number) * 400}
          >
            <g transform="scale(0.6)">
              <rect x="-40" y="-26" width="80" height="52" rx="5" fill={fill as string} stroke={INK} strokeWidth="4" />
            </g>
          </Go>
        ))}
      <Go path={van} ms={step >= 6 ? 3200 : 3600}>
        <PostVan driving={busy && (step === 3 || step === 6)} />
      </Go>
    </g>
  );
}

const postbox: Scene = {
  id: "briefkasten",
  icon: POSTBOX_ICON,
  focus: [150, 260, 1400, 640],
  Draw: PostboxDraw,
  beats: [
    { ms: 3000, say: "Wir bringen den Brief zum Briefkasten." },
    {
      tap: { at: SLOT, r: 80 },
      ask: "Wirf den Brief ein!",
      sounds: [[800, playPlop]],
      say: "Plopp! Der Brief ist im Briefkasten.",
      ms: 2000,
    },
    { ms: 3600, sounds: [[0, playEngine]], say: "Da kommt das Postauto." },
    { ms: 900, sounds: [[0, playPop]] },
    {
      tap: { at: DOOR, r: 90 },
      ask: "Mach den Briefkasten auf!",
      sounds: [
        [0, playClick],
        [1000, playRustle],
      ],
      say: "Alle Briefe kommen ins Postauto.",
      ms: 2800,
    },
    { ms: 3200, sounds: [[0, playEngine]], say: "Tschüss, Postauto!" },
  ],
};

// ---------- Over the land ----------

const VAN_FIELD = 760;

function FieldDraw({ step, busy }: SceneProps) {
  const van = route<Point[]>(step, [
    [0, [[AWAY, LANE]]],
    [
      1,
      [
        [AWAY, LANE],
        [VAN_FIELD, LANE],
      ],
    ],
    [
      3,
      [
        [VAN_FIELD, LANE],
        [BEYOND, LANE],
      ],
    ],
  ]);
  return (
    <g>
      <Outdoors />
      <RoundTree x={120} s={1.1} />
      <RoundTree x={1500} s={0.9} />
      {/* The meadow's fence, the cows behind it */}
      <g transform="translate(330 700) scale(0.85)">
        <Cow />
      </g>
      <g transform="translate(1140 704) scale(0.9)">
        <Cow moo={step === 2 && busy} />
      </g>
      <path d={`M${-FAR} ${GROUND - 50} H${FAR * 2} M${-FAR} ${GROUND - 22} H${FAR * 2}`} stroke="#a0522d" strokeWidth="8" />
      <path
        d={Array.from({ length: 40 }, (_, i) => `M${-600 + i * 120} ${GROUND - 70} V${GROUND}`).join(" ")}
        stroke="#8d5a3b"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <Road />
      <Go path={van} ms={3400}>
        <PostVan driving={busy && (step === 1 || step === 3)} />
      </Go>
    </g>
  );
}

const field: Scene = {
  id: "landstrasse",
  icon: VAN_ICON,
  focus: [100, 380, 1400, 520],
  Draw: FieldDraw,
  beats: [
    { ms: 3400, sounds: [[0, playEngine]], say: "Das Postauto fährt übers Land zu Oma." },
    {
      tap: { at: [VAN_FIELD, LANE - 130], r: 130 },
      ask: "Hup mal!",
      sounds: [
        [0, playHonk],
        [1400, playMoo],
      ],
      say: "Tut tut! Und die Kuh sagt Muh.",
      ms: 3000,
    },
    { ms: 3400, sounds: [[0, playEngine]] },
  ],
};

// ---------- At Oma's house ----------

const HOUSE_X = 1180;
const BELL: Point = [HOUSE_X + 48, GROUND - 64];
const VAN_OMA = 380;
const POSTIE_OMA = 760;
const OMA_AT = 1010;
/** Where the letter is held: in the postie's hands, then in Oma's. */
const HANDS = (x: number): Point => [x, GROUND - 122];

function OmaDraw({ step, busy, picks }: SceneProps) {
  const art = picks[0] as Art;
  const van = route<Point[]>(step, [
    [0, [[AWAY, LANE]]],
    [
      1,
      [
        [AWAY, LANE],
        [VAN_OMA, LANE],
      ],
    ],
  ]);
  const oma = route<Point[]>(step, [
    [0, [[HOUSE_X, GROUND]]],
    [
      3,
      [
        [HOUSE_X, GROUND],
        [OMA_AT, GROUND],
      ],
    ],
  ]);
  const letter = route<Point[]>(step, [
    [0, [HANDS(POSTIE_OMA)]],
    [4, [HANDS(POSTIE_OMA), [(POSTIE_OMA + OMA_AT) / 2, GROUND - 200], HANDS(OMA_AT)]],
  ]);
  const open = step >= 3;
  const read = step >= 5;
  return (
    <g>
      <Outdoors />
      <RoundTree x={1560} s={1.1} />
      <BackHouse x={HOUSE_X} w={380} h={360} wall="#ffe8cc" roof="#e8590c" />
      {/* The doorbell beside the door, and the door open once Oma comes */}
      <circle cx={BELL[0]} cy={BELL[1]} r="9" fill="#ffd43b" stroke={INK} strokeWidth="3" />
      {open && (
        <g>
          <rect x={HOUSE_X - 24} y={GROUND - 92} width="48" height="92" rx="6" fill="#3b2a20" stroke={INK} strokeWidth="3" />
          <rect x={HOUSE_X - 44} y={GROUND - 94} width="20" height="94" rx="4" fill="#e8590c" stroke={INK} strokeWidth="3" />
        </g>
      )}
      {/* Oma's garden fence and flowers */}
      <path d={`M860 ${GROUND - 40} H990 M860 ${GROUND - 16} H990`} stroke="#fff" strokeWidth="8" />
      {[870, 910, 950, 990].map((x) => (
        <path key={x} d={`M${x} ${GROUND} V${GROUND - 60} l8 -10 l8 10 V${GROUND}`} fill="#fff" stroke={INK} strokeWidth="2.5" />
      ))}
      {[1300, 1340, 1380].map((x, i) => (
        <g key={x} transform={`translate(${x} ${GROUND - 40})`}>
          <path d="M0 40 V0" stroke="#2f9e44" strokeWidth="5" />
          <circle r="12" fill={["#ff6b6b", "#ffd43b", "#f783ac"][i]} stroke={INK} strokeWidth="2" />
          <circle r="4" fill="#fff3bf" />
        </g>
      ))}
      <Road />
      {open && (
        <Go path={oma} ms={1800}>
          <Grownup look={OMA} pose={read ? "cheer" : busy && step === 3 ? "walk" : "hold"} face={-1} />
        </Go>
      )}
      {step >= 2 && (
        <g transform={`translate(${POSTIE_OMA} ${GROUND})`}>
          <Pop>
            <Grownup look={POSTIE} pose={step >= 4 && !busy ? "stand" : "hold"} face={1} />
          </Pop>
        </g>
      )}
      {step >= 2 && !read && (
        <Go path={letter} ms={1400}>
          <Letter s={0.8} />
        </Go>
      )}
      {read && (
        <g transform={`translate(${OMA_AT} ${GROUND - 410})`}>
          <g className="fm-pop">
            <Sheet art={art} w={300} h={230} />
          </g>
          {busy && (
            <g transform="translate(0 -130)">
              <Hearts />
            </g>
          )}
        </g>
      )}
      <Go path={van} ms={3400}>
        <PostVan driving={busy && step === 1} />
      </Go>
    </g>
  );
}

const atOma: Scene = {
  id: "bei-oma",
  icon: OMA_ICON,
  focus: [300, 180, 1150, 720],
  Draw: OmaDraw,
  beats: [
    { ms: 3400, sounds: [[0, playEngine]], say: "Das Postauto ist bei Oma." },
    { ms: 900, sounds: [[0, playPop]] },
    {
      tap: { at: [BELL[0] - 20, BELL[1] - 10], r: 75 },
      ask: "Klingel bei Oma!",
      sounds: [[0, playDoorbell]],
      say: "Ding dong! Da ist Oma.",
      ms: 2600,
    },
    {
      tap: { at: HANDS(POSTIE_OMA), r: 85 },
      ask: "Gib Oma den Brief!",
      sounds: [[1200, playPop]],
      say: "Ein Brief für dich, Oma!",
      ms: 2200,
    },
    {
      tap: { at: HANDS(OMA_AT), r: 85 },
      ask: "Mach den Brief auf!",
      sounds: [
        [0, playPageTurn],
        [1400, playChime],
      ],
      say: "Oh, wie schön! Oma freut sich.",
      ms: 3800,
    },
  ],
};

// ---------- At home again: Oma rings ----------

/** The speech bubble from the phone: Oma with the picture beside her. */
const BUBBLE: [number, number, number, number] = [560, 130, 540, 320];

function CallDraw({ step, busy, picks }: SceneProps) {
  const art = picks[0] as Art;
  const [bx, by, bw, bh] = BUBBLE;
  const [px, py] = PHONE_AT;
  const talking = step >= 2;
  const happy = step >= 3;
  return (
    <Room ringing={step < 2} paper={false}>
      <g transform={`translate(${KID_AT} ${GROUND})`}>
        <Child pose={happy ? "cheer" : "stand"} />
      </g>
      <g transform={`translate(${PARENT_AT} ${GROUND})`}>
        <Grownup look={PARENT} pose={happy ? "cheer" : "stand"} face={-1} />
      </g>
      {talking && (
        <g className="fm-pop">
          <path
            d={`M${px - 40} ${by + bh - 10} L${px - 10} ${py - 80} L${px + 20} ${by + bh - 10} Z`}
            fill="#fff"
            stroke={INK}
            strokeWidth="5"
            strokeLinejoin="round"
          />
          <rect x={bx} y={by} width={bw} height={bh} rx="40" fill="#fff" stroke={INK} strokeWidth="5" />
          <path d={`M${px - 36} ${by + bh - 3} H${px + 16}`} stroke="#fff" strokeWidth="8" />
          <g transform={`translate(${bx + 140} ${by + 300}) scale(1.1)`}>
            <KidHead look={OMA} />
          </g>
          <g transform={`translate(${bx + 380} ${by + bh / 2})`}>
            <Sheet art={art} w={220} h={170} />
          </g>
        </g>
      )}
      {happy && busy && (
        <g transform={`translate(${KID_AT + 40} ${GROUND - 240})`}>
          <Hearts />
        </g>
      )}
    </Room>
  );
}

const call: Scene = {
  id: "telefon",
  icon: PHONE_ICON,
  focus: [240, 110, 1120, 690],
  Draw: CallDraw,
  beats: [
    {
      ms: 2600,
      sounds: [
        [0, playRing],
        [1500, playRing],
      ],
      say: "Hör mal, das Telefon klingelt.",
    },
    {
      tap: { at: [PHONE_AT[0], PHONE_AT[1] - 40], r: 90 },
      ask: "Geh ans Telefon!",
      sounds: [[0, playPop]],
      say: "Es ist Oma! Sie sagt: Danke für das schöne Bild.",
      ms: 3600,
    },
    { ms: 3000, sounds: [[0, playChime]], say: "Wir haben Oma lieb." },
  ],
};

/** „Ein Brief für Oma“: the picture the child picks, from the table at home to Oma's door, and her call to say thanks. */
export const BRIEF: Film = {
  id: "brief",
  title: "Ein Brief für Oma",
  picture: LETTER_ICON,
  end: "Was für ein schöner Brief!",
  scenes: (picks) => (picks[0] ? [home, paint, postbox, field, atOma, call] : [home]),
};
