import { Cloud, Face, INK, Pane, SAND, STEEL, Wheel, nth } from "./shared";

export function Haus() {
  return (
    <>
      <defs>
        <pattern id="bs-bricks" width="40" height="20" patternUnits="userSpaceOnUse">
          <rect width="40" height="20" fill="#e76f51" />
          <rect x="2" y="3" width="16" height="3" rx="1.5" fill="#f08a6e" />
          <rect x="22" y="13" width="16" height="3" rx="1.5" fill="#f08a6e" />
          <path d="M0 1 H40 M0 11 H40 M20 1 V11 M0 11 V20 M40 11 V20" stroke="#f4a261" strokeWidth="2" />
        </pattern>
      </defs>
      <rect x="900" y="380" width="320" height="220" fill="url(#bs-bricks)" />
      <rect x="1196" y="380" width="24" height="220" fill="#2b2d42" opacity="0.12" />
      <rect x="892" y="590" width="336" height="14" rx="3" fill="#adb5bd" />
      {[940, 1110].map((x) => (
        <g key={x}>
          <rect x={x} y="425" width="70" height="60" rx="4" fill="#5c4033" />
          <rect x={x - 6} y="416" width="82" height="10" rx="2" fill="#ced4da" />
          <rect x={x - 4} y="485" width="78" height="7" rx="2" fill="#ced4da" />
        </g>
      ))}
      <rect x="1025" y="505" width="70" height="95" rx="4" fill="#5c4033" />
      <rect x="1019" y="496" width="82" height="10" rx="2" fill="#ced4da" />
      {/* Bucket of mortar and a trowel on the window sill */}
      <path d="M1118 470 H1144 L1140 485 H1122 Z" fill={STEEL} />
      <ellipse cx="1131" cy="470" rx="13" ry="3" fill="#dee2e6" />
      <path d="M1150 484 L1166 470 L1174 478 Z" fill={INK} />
      {/* Scaffolding with a ladder */}
      <g stroke="#8d5a2b" strokeWidth="6" strokeLinecap="round">
        <path d="M868 350 V600 M896 350 V600" />
        <path d="M862 450 H902 M862 530 H902" strokeWidth="10" />
        <path d="M868 450 L896 530 M896 450 L868 370" strokeWidth="4" />
      </g>
      <path d="M876 456 V528 M888 456 V528 M876 474 H888 M876 492 H888 M876 510 H888" stroke="#c68b59" strokeWidth="3" />
      {/* Bricks of the row that is being laid right now */}
      <g className="haus-top" fill="#e76f51" stroke="#f4a261" strokeWidth="2">
        {[900, 940, 980, 1020, 1060].map((x, i) => (
          <rect key={x} x={x} y="361" width="40" height="19" style={nth(i)} />
        ))}
      </g>
      {/* Window frames that pop in while building */}
      <g className="haus-windows" fill="none" stroke="#fff" strokeWidth="6">
        <rect x="944" y="429" width="62" height="52" rx="3" />
        <rect x="1114" y="429" width="62" height="52" rx="3" style={nth(1)} />
      </g>
    </>
  );
}

export function Wolke() {
  return (
    <>
      <g className="wolke-rain" stroke="#4dabf7" strokeWidth="5" strokeLinecap="round">
        {[176, 206, 236, 266, 296].map((x, i) => (
          <path key={x} d={`M${x} 196 l-4 16`} style={nth(i)} />
        ))}
      </g>
      <g className="wolke-body">
        <Cloud x={190} y={150} />
      </g>
    </>
  );
}

export function Sonne() {
  return (
    <g className="sonne-body" style={{ transformOrigin: "1460px 120px" }}>
      <g className="sonne-rays" style={{ transformOrigin: "1460px 120px" }} stroke="#ffb703" strokeWidth="10" strokeLinecap="round">
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1="1460" y1="22" x2="1460" y2={i % 2 ? 36 : 44} transform={`rotate(${i * 30} 1460 120)`} />
        ))}
      </g>
      <circle cx="1460" cy="120" r="62" fill="#ffd60a" />
      <circle cx="1466" cy="126" r="56" fill="#ffc300" opacity="0.5" />
      <circle cx="1440" cy="94" r="16" fill="#fff" opacity="0.35" />
      <Face cx={1460} cy={112} size={2.4} />
    </g>
  );
}

/** The portable toilet. */
export function Klo() {
  return (
    <g className="klo-body" style={{ transformOrigin: "807px 600px" }}>
      <rect x="772" y="480" width="70" height="120" rx="6" fill="#2a9d8f" />
      <rect x="830" y="480" width="12" height="120" rx="4" fill="#21867a" />
      <path d="M766 486 Q807 456 848 486 Z" fill="#21867a" />
      <rect x="800" y="458" width="14" height="10" rx="2" fill="#21867a" />
      <rect x="782" y="496" width="48" height="98" rx="4" fill="#3bb3a4" />
      <rect x="782" y="496" width="48" height="98" rx="4" fill="none" stroke="#21867a" strokeWidth="2" />
      <path d="M792 508 H822 M792 516 H822" stroke="#21867a" strokeWidth="3" />
      <rect className="klo-sign" x="794" y="528" width="24" height="10" rx="3" fill="#ff3b3b" />
      <circle cx="822" cy="552" r="4" fill={INK} />
      <path d="M800 572 l7 -8 l7 8 l-7 8 Z" fill="#fff" opacity="0.7" />
    </g>
  );
}

export function Bauwagen() {
  return (
    <>
      <g className="wagen-smoke" fill="#e9ecef">
        {[0, 1, 2].map((i) => (
          <circle key={i} cx="1410" cy="490" r="11" style={nth(i)} />
        ))}
      </g>
      <rect x="1404" y="494" width="12" height="36" fill={INK} />
      <rect x="1400" y="490" width="20" height="7" rx="2" fill="#2b2d42" />
      <rect x="1384" y="624" width="192" height="10" fill={INK} />
      <path d="M1374 534 Q1480 506 1586 534 Z" fill="#1d3557" />
      <rect x="1380" y="530" width="200" height="98" rx="10" fill="#457b9d" />
      <path d="M1380 552 H1580 M1380 576 H1580 M1380 600 H1580" stroke="#3d6a88" strokeWidth="3" />
      <rect x="1380" y="530" width="200" height="10" fill="#5e94b8" />
      <Pane x={1400} y={550} w={70} h={40}>
        <path d="M1400 550 H1470 V558 Q1452 572 1435 558 Q1418 572 1400 558 Z" fill="#ff8fa3" />
      </Pane>
      <path d="M1435 550 V590 M1400 570 H1470" stroke="#457b9d" strokeWidth="4" />
      <rect x="1486" y="552" width="24" height="16" rx="3" fill="#ffd60a" />
      <rect x="1520" y="548" width="44" height="80" fill="#2b2d42" />
      <g className="wagen-light">
        <rect x="1520" y="548" width="44" height="80" fill="#ffd166" />
        {/* A mug of cocoa inside */}
        <rect x="1532" y="586" width="18" height="20" rx="4" fill="#ff5d73" />
        <path d="M1550 592 q8 0 8 6 q0 6 -8 6" stroke="#ff5d73" strokeWidth="3" fill="none" />
      </g>
      <g className="wagen-door" style={{ transformOrigin: "1564px 588px" }}>
        <rect x="1520" y="548" width="44" height="80" fill="#1d3557" />
        <rect x="1526" y="556" width="32" height="24" rx="3" fill="#2f4b6e" />
        <circle cx="1528" cy="592" r="4" fill="#ffd60a" />
      </g>
      {/* Steps to the door */}
      <path d="M1516 634 H1568 M1522 646 H1562" stroke="#6c757d" strokeWidth="6" />
      <Wheel cx={1420} cy={640} r={16} />
      <Wheel cx={1540} cy={640} r={16} />
    </>
  );
}

export function Schubkarre() {
  return (
    <g className="karre-body">
      <path d="M1352 722 L1402 702" stroke="#8d5a2b" strokeWidth="7" strokeLinecap="round" />
      <rect x="1344" y="718" width="16" height="9" rx="4" fill="#2b2d42" transform="rotate(-22 1352 722)" />
      <path d="M1412 712 L1406 740" stroke={INK} strokeWidth="6" strokeLinecap="round" />
      <path d="M1398 685 Q1440 656 1482 685 Z" fill={SAND} />
      <path d="M1452 676 L1470 640" stroke="#8d5a2b" strokeWidth="5" strokeLinecap="round" />
      <path d="M1464 636 l16 -6 l4 14 l-14 4 Z" fill={STEEL} />
      <path d="M1390 684 H1490 L1470 718 H1408 Z" fill="#3ec300" />
      <path d="M1400 702 L1476 702 L1470 718 H1408 Z" fill="#2d9a00" />
      <path d="M1388 684 H1492" stroke="#2d9a00" strokeWidth="5" strokeLinecap="round" />
      <g className="karre-wheel" style={{ transformOrigin: "1476px 728px" }}>
        <circle cx="1476" cy="728" r="14" fill="#2b2d42" />
        <circle cx="1476" cy="728" r="6" fill="#ced4da" />
        <path d="M1476 716 V740 M1464 728 H1488" stroke={STEEL} strokeWidth="3" />
      </g>
    </g>
  );
}

export function Huetchen() {
  return (
    <g className="huetchen-body" style={{ transformOrigin: "1545px 764px" }}>
      <path d="M1545 690 L1572 756 H1518 Z" fill="#ff8c42" strokeLinejoin="round" />
      <path d="M1545 690 L1572 756 H1552 Z" fill="#e76f51" />
      <path d="M1535 716 H1555 M1528 734 H1562" stroke="#fff" strokeWidth="7" />
      <rect x="1510" y="754" width="70" height="10" rx="4" fill="#ff5d73" />
    </g>
  );
}

/** "Achtung Baustelle" warning sign. */
export function Schild() {
  return (
    <g className="schild-body" style={{ transformOrigin: "50px 700px" }}>
      <path d="M50 610 V700" stroke={INK} strokeWidth="6" />
      <path d="M50 548 L84 608 H16 Z" fill="#fff" stroke="#ff5d73" strokeWidth="7" strokeLinejoin="round" />
      <circle cx="44" cy="572" r="5" fill={INK} />
      <path d="M44 578 L48 592 M40 600 L48 590 L56 600 M36 584 L54 582" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <path d="M54 600 Q60 588 68 598 Z" fill={INK} />
    </g>
  );
}

/** A little radio on the scaffolding. */
export function Radio() {
  return (
    <>
      <g className="radio-notes" fill={INK}>
        {[0, 1, 2].map((i) => (
          <g key={i} style={nth(i)}>
            <circle cx={872 + i * 12} cy="412" r="5" />
            <path d={`M${876 + i * 12} 412 V394 l8 4`} stroke={INK} strokeWidth="2.5" fill="none" />
          </g>
        ))}
      </g>
      <g className="radio-body" style={{ transformOrigin: "882px 445px" }}>
        <path d="M894 420 L906 398" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        <rect x="862" y="418" width="42" height="27" rx="6" fill="#8e7dff" />
        <circle cx="875" cy="432" r="8" fill="#5f4bdb" />
        <circle cx="875" cy="432" r="3" fill="#c3b8ff" />
        <rect x="888" y="425" width="11" height="6" rx="2" fill="#ffd60a" />
        <circle cx="891" cy="438" r="2.5" fill="#fff" />
        <circle cx="897" cy="438" r="2.5" fill="#fff" />
      </g>
    </>
  );
}

/** Toolbox in the foreground; the lid opens and the tools pop up. */
export function Werkzeugkasten() {
  return (
    <>
      <g className="werkzeug-tools">
        <path d="M900 952 V914" stroke="#8d5a2b" strokeWidth="7" strokeLinecap="round" />
        <rect x="888" y="906" width="26" height="12" rx="3" fill={STEEL} />
        <path d="M940 952 V918" stroke="#adb5bd" strokeWidth="7" strokeLinecap="round" />
        <path d="M932 912 a9 9 0 1 1 16 0 l-5 4 h-6 Z" fill="#adb5bd" />
        <path d="M976 952 L968 916 M976 952 L986 916" stroke="#ff5d73" strokeWidth="6" strokeLinecap="round" />
      </g>
      <rect x="880" y="952" width="120" height="40" rx="6" fill="#ff5d73" />
      <rect x="880" y="976" width="120" height="16" rx="6" fill="#e63950" />
      <rect x="930" y="962" width="20" height="8" rx="2" fill="#ffd60a" />
      <g className="werkzeug-lid" style={{ transformOrigin: "1000px 952px" }}>
        <rect x="878" y="942" width="124" height="12" rx="4" fill="#e63950" />
        <path d="M924 942 V932 H956 V942" stroke={INK} strokeWidth="5" fill="none" />
      </g>
    </>
  );
}
