import type { CSSProperties } from "react";
import { pick, shuffle } from "@/lib/random";

// Still more of the surprises (user request, 25 November 2026: „erstelle noch mehr dinge die erscheinen“), each one
// thing right where the finger landed – a butterfly, a jack-in-the-box, a beating heart, a raining cloud, a frog
// jumping, a fish leaping out of a puddle. Like the others, each is a few small HTML layers moved only by transform
// and opacity (`surprises.css`), drawn by the app itself in SVG, never with emojis.

/** The kinds drawn here. */
export const TOY_KINDS = ["butterfly", "jack", "heart", "cloud", "frog", "fish"] as const;

/** One kind drawn here. */
export type ToyKind = (typeof TOY_KINDS)[number];

/** How one of these looks this time; drawn once in `toyParams`, so drawing it again changes nothing. */
export type ToyParams =
  | { kind: "butterfly"; wing: string; inner: string; spots: string; loop: 1 | -1 }
  | { kind: "jack"; box: string; star: string; hat: string; pom: string }
  | { kind: "heart"; color: string }
  | { kind: "cloud"; tint: string }
  | { kind: "frog"; skin: string; belly: string }
  | { kind: "fish"; body: string; fin: string; stripes: boolean };

const BRIGHT = ["#ff5d73", "#ffb703", "#3ec300", "#00b4d8", "#8e7dff", "#ff7bd0", "#ff8c42", "#2ec4b6"];

/** Draws this time's look of `kind`. */
export function toyParams(kind: ToyKind): ToyParams {
  switch (kind) {
    case "butterfly": {
      const [wing, inner, spots] = shuffle(BRIGHT);
      return { kind, wing, inner, spots, loop: pick([1, -1] as const) };
    }
    case "jack": {
      const [box, star, hat, pom] = shuffle(BRIGHT);
      return { kind, box, star, hat, pom };
    }
    case "heart":
      return { kind, color: pick(["#ff3d5a", "#ff4fb8", "#ff5d73", "#e8336d"]) };
    case "cloud":
      return { kind, tint: pick(["#ffffff", "#f1f6ff", "#fff6fb"]) };
    case "frog":
      return pick([
        { kind, skin: "#5cc254", belly: "#c9f0a8" },
        { kind, skin: "#3fb37f", belly: "#c4f2d8" },
        { kind, skin: "#8fcf3c", belly: "#eef8c0" },
      ]);
    case "fish": {
      const [body, fin] = shuffle(["#ff8c42", "#ffb703", "#ff5d73", "#00b4d8", "#8e7dff", "#2ec4b6"]);
      return { kind, body, fin, stripes: Math.random() < 0.5 };
    }
  }
}

/** CSS custom properties as a style. */
const vars = (v: Record<string, string | number>) => v as CSSProperties;

/** The outline round every drawing, as on the other surprises. */
const LINE = "#5a3a2a";

/** Draws one of these surprises. */
export function ToyView({ s }: { s: ToyParams }) {
  switch (s.kind) {
    case "butterfly":
      return <Butterfly s={s} />;
    case "jack":
      return <Jack s={s} />;
    case "heart":
      return <Heart s={s} />;
    case "cloud":
      return <Cloud s={s} />;
    case "frog":
      return <Frog s={s} />;
    case "fish":
      return <Fish s={s} />;
  }
}

/** A butterfly's right wings, from the body at x = 0 outwards; the left ones are the same, mirrored. */
function Wing({ s, left }: { s: Extract<ToyParams, { kind: "butterfly" }>; left?: boolean }) {
  return (
    <svg className={`ft-fly-wing ${left ? "left" : "right"}`} viewBox="0 -50 50 100" role="presentation">
      <g transform={left ? "translate(50 0) scale(-1 1)" : undefined} stroke={LINE} strokeWidth="2.5" strokeLinejoin="round">
        <path d="M2 -4 C6 -40 30 -48 44 -38 C50 -30 44 -12 30 -4 C20 0 8 0 2 -4 Z" fill={s.wing} />
        <path d="M2 2 C10 4 30 8 36 22 C40 34 28 44 18 40 C8 36 3 20 2 2 Z" fill={s.wing} />
        <path d="M6 -8 C10 -30 26 -36 34 -30 C38 -24 32 -14 24 -10 C16 -6 10 -6 6 -8 Z" fill={s.inner} stroke="none" />
        <circle cx="30" cy="-26" r="5" fill={s.spots} stroke="none" />
        <circle cx="20" cy="26" r="4.5" fill={s.spots} stroke="none" />
      </g>
    </svg>
  );
}

function Butterfly({ s }: { s: Extract<ToyParams, { kind: "butterfly" }> }) {
  return (
    <div className="ft-fly" style={vars({ "--loop": s.loop })}>
      <Wing s={s} left />
      <Wing s={s} />
      <svg className="ft-fly-body" viewBox="-12 -52 24 104" role="presentation">
        <path d="M-2 -30 C-6 -42 -8 -46 -10 -48 M2 -30 C6 -42 8 -46 10 -48" fill="none" stroke={LINE} strokeWidth="2" strokeLinecap="round" />
        <circle cx="-10" cy="-48" r="2.5" fill={LINE} />
        <circle cx="10" cy="-48" r="2.5" fill={LINE} />
        <ellipse cx="0" cy="4" rx="5.5" ry="30" fill="#6b4a3a" stroke={LINE} strokeWidth="2" />
        <circle cx="0" cy="-28" r="8" fill="#6b4a3a" stroke={LINE} strokeWidth="2" />
        <circle cx="-3" cy="-29" r="1.8" fill="#ffffff" />
        <circle cx="3" cy="-29" r="1.8" fill="#ffffff" />
      </svg>
    </div>
  );
}

function Jack({ s }: { s: Extract<ToyParams, { kind: "jack" }> }) {
  return (
    <>
      {/* The spring and the jester's head: drawn first, so the box's front hides the spring's foot. */}
      <svg className="ft-jack-pop" viewBox="-35 -64 70 104" role="presentation">
        <polyline
          points="0,40 -14,34 14,26 -14,18 14,10 -14,2 14,-6 0,-12"
          fill="none"
          stroke="#9aa4b2"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M-20 -30 L0 -58 L20 -30 Z" fill={s.hat} stroke={LINE} strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="0" cy="-56" r="5" fill={s.pom} stroke={LINE} strokeWidth="2" />
        <circle cx="0" cy="-22" r="18" fill="#ffe2c2" stroke={LINE} strokeWidth="2.5" />
        <circle cx="-7" cy="-26" r="3" fill={LINE} />
        <circle cx="7" cy="-26" r="3" fill={LINE} />
        <circle cx="-6" cy="-27" r="1" fill="#ffffff" />
        <circle cx="8" cy="-27" r="1" fill="#ffffff" />
        <circle cx="0" cy="-20" r="4.5" fill="#ff5d73" stroke={LINE} strokeWidth="1.5" />
        <path d="M-9 -13 C-4 -7 4 -7 9 -13" fill="none" stroke={LINE} strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="-12" cy="-16" r="3.2" fill="#ff9fb0" opacity="0.8" />
        <circle cx="12" cy="-16" r="3.2" fill="#ff9fb0" opacity="0.8" />
        <path d="M-18 -6 C-10 0 10 0 18 -6 L14 2 C6 6 -6 6 -14 2 Z" fill={s.pom} stroke={LINE} strokeWidth="2" strokeLinejoin="round" />
      </svg>
      <svg className="ft-jack-box" viewBox="-50 -50 100 100" role="presentation">
        <rect x="-38" y="-40" width="76" height="76" rx="5" fill={s.box} stroke={LINE} strokeWidth="3" />
        <rect x="-38" y="-40" width="76" height="9" fill="#00000022" />
        <polygon points="0,-24 6,-8 22,-8 9,2 14,18 0,8 -14,18 -9,2 -22,-8 -6,-8" fill={s.star} stroke={LINE} strokeWidth="2" strokeLinejoin="round" />
        <rect x="38" y="-6" width="8" height="6" fill="#9aa4b2" stroke={LINE} strokeWidth="2" />
        <rect x="42" y="-2" width="5" height="18" rx="2" fill="#9aa4b2" stroke={LINE} strokeWidth="2" />
        <circle cx="44.5" cy="18" r="4" fill="#ff5d73" stroke={LINE} strokeWidth="2" />
      </svg>
      <svg className="ft-jack-lid" viewBox="-50 -10 100 20" role="presentation">
        <rect x="-40" y="-6" width="80" height="12" rx="3" fill={s.box} stroke={LINE} strokeWidth="3" />
      </svg>
    </>
  );
}

function Heart({ s }: { s: Extract<ToyParams, { kind: "heart" }> }) {
  return (
    <svg className="ft-heart" viewBox="-50 -50 100 100" role="presentation">
      <path
        d="M0 40 C-30 18 -46 2 -46 -18 C-46 -34 -34 -44 -21 -44 C-11 -44 -4 -38 0 -30 C4 -38 11 -44 21 -44 C34 -44 46 -34 46 -18 C46 2 30 18 0 40 Z"
        fill={s.color}
        stroke={LINE}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <ellipse cx="-24" cy="-24" rx="9" ry="6" fill="#ffffff99" transform="rotate(-35 -24 -24)" />
      <circle cx="-12" cy="-34" r="3" fill="#ffffff99" />
    </svg>
  );
}

function Cloud({ s }: { s: Extract<ToyParams, { kind: "cloud" }> }) {
  return (
    <>
      {[-0.13, -0.04, 0.05, 0.14].map((x, i) => (
        <svg key={i} className="ft-rain" viewBox="-10 -14 20 28" role="presentation" style={vars({ "--x": x, "--delay": `${0.7 + ((i * 3) % 4) * 0.15}s` })}>
          <path d="M0 -12 C5 -3 8 2 8 6 C8 10 4 13 0 13 C-4 13 -8 10 -8 6 C-8 2 -5 -3 0 -12 Z" fill="#4fb3ff" stroke={LINE} strokeWidth="1.5" />
          <ellipse cx="-3" cy="5" rx="2" ry="3" fill="#ffffffaa" />
        </svg>
      ))}
      <svg className="ft-cloud" viewBox="-50 -50 100 100" role="presentation">
        <path
          d="M-34 22 C-48 22 -50 2 -36 -2 C-38 -18 -20 -26 -10 -16 C-6 -34 22 -34 24 -12 C38 -16 48 -2 40 10 C48 18 40 26 32 22 Z"
          fill={s.tint}
          stroke={LINE}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="M-14 0 C-12 4 -6 4 -4 0" fill="none" stroke={LINE} strokeWidth="2.2" strokeLinecap="round" />
        <path d="M6 0 C8 4 14 4 16 0" fill="none" stroke={LINE} strokeWidth="2.2" strokeLinecap="round" />
        <path d="M-4 8 C-1 12 5 12 8 8" fill="none" stroke={LINE} strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="-18" cy="7" r="4" fill="#ffb3c4" opacity="0.8" />
        <circle cx="22" cy="7" r="4" fill="#ffb3c4" opacity="0.8" />
      </svg>
    </>
  );
}

function Frog({ s }: { s: Extract<ToyParams, { kind: "frog" }> }) {
  return (
    <>
      <svg className="ft-frog" viewBox="-50 -50 100 100" role="presentation">
        <ellipse cx="-30" cy="34" rx="14" ry="7" fill={s.skin} stroke={LINE} strokeWidth="2.5" />
        <ellipse cx="30" cy="34" rx="14" ry="7" fill={s.skin} stroke={LINE} strokeWidth="2.5" />
        <ellipse cx="0" cy="14" rx="36" ry="26" fill={s.skin} stroke={LINE} strokeWidth="3" />
        <ellipse cx="0" cy="22" rx="22" ry="15" fill={s.belly} />
        <circle cx="-18" cy="-14" r="14" fill={s.skin} stroke={LINE} strokeWidth="3" />
        <circle cx="18" cy="-14" r="14" fill={s.skin} stroke={LINE} strokeWidth="3" />
        <circle cx="-18" cy="-15" r="9" fill="#ffffff" />
        <circle cx="18" cy="-15" r="9" fill="#ffffff" />
        <circle cx="-16" cy="-14" r="5" fill="#3a2a22" />
        <circle cx="20" cy="-14" r="5" fill="#3a2a22" />
        <circle cx="-14" cy="-16" r="1.8" fill="#ffffff" />
        <circle cx="22" cy="-16" r="1.8" fill="#ffffff" />
        <path d="M-20 6 C-10 16 10 16 20 6" fill="none" stroke={LINE} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="-26" cy="6" r="4" fill="#ff9fb0" opacity="0.7" />
        <circle cx="26" cy="6" r="4" fill="#ff9fb0" opacity="0.7" />
        <ellipse cx="-16" cy="38" rx="7" ry="5" fill={s.skin} stroke={LINE} strokeWidth="2.5" />
        <ellipse cx="16" cy="38" rx="7" ry="5" fill={s.skin} stroke={LINE} strokeWidth="2.5" />
      </svg>
      {/* The throat puffing up as it croaks, on its own small layer, while the frog sits still. */}
      <svg className="ft-frog-throat" viewBox="-20 -14 40 28" role="presentation">
        <ellipse cx="0" cy="0" rx="17" ry="11" fill="#fff6dc" stroke={LINE} strokeWidth="2" />
        <ellipse cx="-5" cy="-4" rx="4" ry="2.5" fill="#ffffffaa" />
      </svg>
    </>
  );
}

function Fish({ s }: { s: Extract<ToyParams, { kind: "fish" }> }) {
  return (
    <>
      <svg className="ft-fish-water" viewBox="-50 -20 100 40" role="presentation">
        <ellipse cx="0" cy="0" rx="46" ry="14" fill="#7fd0ff" stroke="#2f8fd0" strokeWidth="2.5" />
        <ellipse cx="0" cy="0" rx="30" ry="8" fill="none" stroke="#ffffffaa" strokeWidth="2" />
        <ellipse cx="0" cy="0" rx="14" ry="3.5" fill="none" stroke="#ffffffaa" strokeWidth="1.5" />
      </svg>
      <div className="ft-fish-arc">
        <svg className="ft-fish" viewBox="-50 -30 100 60" role="presentation">
          <path d="M-30 0 L-48 -18 L-44 0 L-48 18 Z" fill={s.fin} stroke={LINE} strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M-6 -20 C0 -30 12 -30 16 -20 Z" fill={s.fin} stroke={LINE} strokeWidth="2.5" strokeLinejoin="round" />
          <ellipse cx="2" cy="0" rx="34" ry="20" fill={s.body} stroke={LINE} strokeWidth="3" />
          {s.stripes && (
            <>
              <path d="M-14 -18 C-8 -6 -8 6 -14 18" fill="none" stroke="#ffffff" strokeWidth="5" />
              <path d="M2 -20 C8 -6 8 6 2 20" fill="none" stroke="#ffffff" strokeWidth="5" />
            </>
          )}
          <path d="M-2 4 C4 10 10 10 12 6" fill={s.fin} stroke={LINE} strokeWidth="2" strokeLinejoin="round" />
          <circle cx="20" cy="-6" r="6" fill="#ffffff" stroke={LINE} strokeWidth="1.5" />
          <circle cx="22" cy="-6" r="3" fill="#3a2a22" />
          <path d="M28 6 C31 8 33 7 34 5" fill="none" stroke={LINE} strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    </>
  );
}
