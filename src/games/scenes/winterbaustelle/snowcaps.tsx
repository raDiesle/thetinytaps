import { Bagger, Gabelstapler, Kipplaster, Kran } from "../baustelle/machines";
import { Hase, Maus } from "../baustelle/figures";
import { Bauwagen, Container, Haus, Huetchen, Klo, Laterne, Schild, Schubkarre } from "../baustelle/site";
import { INK, nth } from "../shared";
import { Cap, SNOW, SNOW_SHADE } from "./parts";

// The Baustelle's drawings with snow on them. Each overlay is drawn on top of the original in
// its coordinates. Snow on a part that moves sits in a group with that part's class (and pivot),
// so the Baustelle's animation of the item moves the snow along.

export function WinterHaus() {
  return (
    <>
      <Haus />
      {/* The top row of bricks hops one by one; so does the snow on each brick. */}
      <g className="haus-top" fill={SNOW}>
        {[900, 940, 980, 1020, 1060].map((x, i) => (
          <rect key={x} x={x - 1} y="354" width="42" height="9" rx="4.5" style={nth(i)} />
        ))}
      </g>
      <Cap x={1100} y={380} w={120} h={8} />
      {[934, 1104].map((x) => (
        <g key={x}>
          <Cap x={x} y={416} w={82} h={6} />
          <Cap x={x + 2} y={485} w={78} h={6} />
        </g>
      ))}
      <Cap x={1019} y={496} w={82} h={6} />
      <Cap x={860} y={445} w={44} h={6} />
      <Cap x={860} y={525} w={44} h={6} />
    </>
  );
}

// Bumpy snow along the top of the jib, from x 520 to 1270.
const JIB_SNOW = `M518 120 ${Array.from({ length: 15 }, (_, i) => `Q${533 + i * 50} ${110 + (i % 3) * 2} ${568 + i * 50} 116`).join(" ")} L1272 121 H518 Z`;

export function WinterKran() {
  return (
    <>
      <Kran />
      <path d={JIB_SNOW} fill={SNOW} />
      <Cap x={1264} y={84} w={12} h={4} />
      {/* Snow on the bricks that hang from the hook moves with the load. */}
      <g className="kran-trolley">
        <g className="kran-load">
          <g className="kran-swing" style={{ transformOrigin: "1065px 258px" }}>
            <Cap x={1020} y={300} w={90} h={7} />
          </g>
        </g>
      </g>
    </>
  );
}

export function WinterBagger() {
  return (
    <>
      <Bagger />
      <g className="bagger-body">
        <Cap x={126} y={500} w={50} h={8} />
        <Cap x={200} y={500} w={50} h={8} />
        <Cap x={308} y={590} w={50} h={7} />
        <Cap x={254} y={590} w={32} h={7} />
      </g>
      {/* The bucket is full of snow and moves with the arm. */}
      <g className="bagger-arm" style={{ transformOrigin: "330px 610px" }}>
        <g className="bagger-bucket" style={{ transformOrigin: "540px 600px" }}>
          <path d="M522 596 Q530 574 552 578 Q572 562 594 582 Q606 590 602 598 Z" fill={SNOW} />
          <path d="M556 586 Q574 576 590 588" stroke={SNOW_SHADE} strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
      </g>
    </>
  );
}

export function WinterKlo() {
  return (
    <>
      <Klo />
      <g className="klo-body" style={{ transformOrigin: "807px 600px" }}>
        <path d="M762 488 Q807 448 852 488 Q844 483 836 489 Q824 481 812 488 Q800 480 788 488 Q776 482 762 488 Z" fill={SNOW} />
      </g>
    </>
  );
}

// Fairy lights along the roof edge of the site trailer: [x, y, colour].
const FAIRY_LIGHTS = [
  [1392, 541, "#ff5d73"],
  [1416, 546, "#ffd60a"],
  [1440, 547, "#4dabf7"],
  [1464, 543, "#69db7c"],
  [1496, 543, "#ff5d73"],
  [1520, 547, "#ffd60a"],
  [1544, 546, "#4dabf7"],
  [1568, 541, "#69db7c"],
] as const;

export function WinterBauwagen() {
  return (
    <>
      <Bauwagen />
      <path d="M1384 538 Q1430 552 1480 541 Q1530 552 1576 538" stroke={INK} strokeWidth="1.5" fill="none" />
      <g className="wb-lichter">
        {FAIRY_LIGHTS.map(([cx, cy, colour], i) => (
          <circle key={cx} cx={cx} cy={cy} r="4" fill={colour} style={nth(i % 2)} />
        ))}
      </g>
      <path
        d="M1370 536 Q1480 498 1590 536 Q1578 531 1568 537 Q1552 529 1536 536 Q1518 528 1500 535 Q1480 527 1460 535 Q1442 528 1424 536 Q1408 529 1392 536 Q1382 531 1370 536 Z"
        fill={SNOW}
      />
      <Cap x={1400} y={490} w={20} h={5} />
    </>
  );
}

export function WinterGabelstapler() {
  return (
    <>
      <Gabelstapler />
      <g className="stapler-body">
        <Cap x={48} y={56} w={22} h={5} />
        <Cap x={98} y={56} w={22} h={5} />
        <g className="stapler-load">
          <Cap x={-30} y={138} w={44} h={6} />
        </g>
      </g>
    </>
  );
}

export function WinterContainer() {
  return (
    <>
      <Container />
      <g className="container-box" style={{ transformOrigin: "90px 110px" }}>
        <Cap x={-2} y={36} w={34} h={6} />
        <Cap x={148} y={36} w={34} h={6} />
      </g>
    </>
  );
}

export function WinterKipper() {
  return (
    <>
      <Kipplaster />
      <g className="kipper-truck">
        <Cap x={1050} y={706} w={18} h={5} />
        <Cap x={1014} y={707} w={14} h={5} />
        {/* The bed is full of snow, which pours out instead of sand. */}
        <g className="kipper-bed" style={{ transformOrigin: "1350px 798px" }}>
          <path d="M1092 714 Q1210 634 1342 714 Z" fill={SNOW} />
          <path d="M1092 714 Q1110 704 1130 712 Q1150 702 1170 712 Q1190 704 1210 713 Q1240 704 1270 713 Q1300 705 1342 714 Z" fill={SNOW_SHADE} />
          <path d="M1150 698 Q1210 664 1270 698" stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.8" />
        </g>
        <g className="kipper-sand" fill={SNOW} stroke={SNOW_SHADE} strokeWidth="2">
          {[1362, 1376, 1390, 1368, 1384].map((cx, i) => (
            <circle key={i} cx={cx} cy="748" r="8" style={nth(i)} />
          ))}
        </g>
      </g>
    </>
  );
}

export function WinterKarre() {
  return (
    <>
      <Schubkarre />
      <g className="karre-body">
        <path className="karre-sand" d="M1396 686 Q1440 652 1484 686 Z" fill={SNOW} />
        <path d="M1388 684 H1492" stroke="#2d9a00" strokeWidth="5" strokeLinecap="round" />
      </g>
    </>
  );
}

export function WinterSchild() {
  return (
    <>
      <Schild />
      <g className="schild-body" style={{ transformOrigin: "50px 700px" }}>
        <Cap x={43} y={526} w={14} h={5} />
        <path d="M41 566 L50 550 L59 566 Q55 562 50 565 Q45 562 41 566 Z" fill={SNOW} />
      </g>
    </>
  );
}

export function WinterLaterne() {
  return (
    <>
      <Laterne />
      <Cap x={62} y={504} w={32} h={6} />
    </>
  );
}

export function WinterHuetchen() {
  return (
    <>
      <Huetchen />
      <g className="huetchen-body" style={{ transformOrigin: "1545px 764px" }}>
        <path d="M1535 714 L1545 688 L1555 714 Q1550 709 1545 712 Q1540 709 1535 714 Z" fill={SNOW} />
      </g>
    </>
  );
}

export function WinterMaus() {
  return (
    <>
      <Maus />
      <g fill={SNOW}>
        <path d="M434.5 863.5 A41 41 0 0 1 505.5 863.5 L498.6 867.5 A33 33 0 0 0 441.4 867.5 Z" />
        <path d="M391.5 936 A41 41 0 0 1 416 911.5 L418.7 919 A33 33 0 0 0 399 938.7 Z" />
        <path d="M524 911.5 A41 41 0 0 1 548.5 936 L541 938.7 A33 33 0 0 0 521.3 919 Z" />
      </g>
    </>
  );
}

export function WinterHase() {
  return (
    <>
      <Hase />
      <g className="hase-bush" style={{ transformOrigin: "80px 106px" }} fill={SNOW}>
        <path d="M54 52 A34 34 0 0 1 106 52 L100 57 A26 26 0 0 0 60 57 Z" />
        <path d="M38 80 A22 22 0 0 1 60 67 L60 73 A16 16 0 0 0 44 82 Z" />
        <path d="M100 74 A20 20 0 0 1 120 82 L114 86 A14 14 0 0 0 102 79 Z" />
      </g>
    </>
  );
}
