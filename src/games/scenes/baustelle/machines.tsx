import { GLASS, INK, Inside, Pane, SAND, SKIN, STEEL, Wheel, nth } from "../shared";

/** A driver's head with a hard hat, for cabs. */
function Driver({ cx, cy, hat = "#ffd60a" }: { cx: number; cy: number; hat?: string }) {
  return (
    <g className="bs-driver">
      <rect x={cx - 13} y={cy + 10} width="26" height="14" rx="5" fill="#ff8c42" />
      <circle cx={cx} cy={cy} r="12" fill={SKIN} />
      <circle cx={cx + 4} cy={cy - 1} r="1.8" fill="#2b2d42" />
      <path d={`M${cx - 14} ${cy - 3} Q${cx - 14} ${cy - 18} ${cx} ${cy - 18} Q${cx + 14} ${cy - 18} ${cx + 14} ${cy - 3} Z`} fill={hat} />
    </g>
  );
}

/** An orange warning light on a roof, centred on (cx, cy); it glows while the item plays. */
function Beacon({ cx, cy }: { cx: number; cy: number }) {
  return (
    <>
      <rect x={cx - 7} y={cy - 6} width="14" height="12" rx="5" fill="#b5651d" />
      <rect x={cx - 10} y={cy + 4} width="20" height="4" rx="2" fill={INK} />
      <rect className="bs-beacon" x={cx - 7} y={cy - 6} width="14" height="12" rx="5" fill="#ffb703" />
    </>
  );
}

/** A wheel that turns while its vehicle rolls; `className` picks the turning animation. */
function TurningWheel({ cx, cy, r, className }: { cx: number; cy: number; r?: number; className: string }) {
  return (
    <g className={className} style={{ transformOrigin: `${cx}px ${cy}px` }}>
      <Wheel cx={cx} cy={cy} r={r} />
    </g>
  );
}

export function Bagger() {
  return (
    <>
      <g className="bagger-smoke" fill="#dee2e6">
        {[0, 1, 2].map((i) => (
          <circle key={i} cx="297" cy="540" r="10" style={nth(i)} />
        ))}
      </g>
      <g className="bagger-body">
        <rect x="90" y="660" width="290" height="56" rx="28" fill={INK} />
        <rect className="bagger-track" x="90" y="660" width="290" height="56" rx="28" fill="none" stroke="#2b2d42" strokeWidth="6" strokeDasharray="10 8" />
        {[122, 178, 234, 290, 346].map((cx) => (
          <g key={cx}>
            <circle cx={cx} cy="688" r="17" fill={STEEL} />
            <circle cx={cx} cy="688" r="7" fill="#6c757d" />
          </g>
        ))}
        <rect x="288" y="548" width="18" height="8" rx="3" fill="#2b2d42" />
        <rect x="290" y="552" width="14" height="42" rx="4" fill={INK} />
        <rect x="110" y="590" width="250" height="76" rx="12" fill="#ffb703" />
        <rect x="110" y="646" width="250" height="20" rx="8" fill="#f4a100" />
        <rect x="118" y="594" width="234" height="8" rx="4" fill="#ffd166" />
        {/* Black-yellow warning stripes on the counterweight */}
        <rect x="110" y="606" width="14" height="36" fill="#ffd60a" />
        <path d="M110 612 l14 -6 M110 624 l14 -6 M110 636 l14 -6" stroke="#2b2d42" strokeWidth="4" />
        <rect x="128" y="505" width="120" height="95" rx="14" fill="#ffb703" />
        <rect x="124" y="500" width="128" height="14" rx="7" fill="#f4a100" />
        <Pane x={146} y={522} w={84} h={52}>
          <Driver cx={178} cy={552} />
        </Pane>
        <circle cx="248" cy="530" r="6" fill="#fff4d6" />
        <circle className="bs-blink" cx="188" cy="494" r="8" fill="#ff8c42" />
      </g>
      <g className="bagger-arm" style={{ transformOrigin: "330px 610px" }}>
        <path d="M330 610 L470 480 L540 600" stroke="#f4a100" strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M338 594 L462 480" stroke="#ffd166" strokeWidth="7" strokeLinecap="round" />
        <path d="M360 610 L440 520" stroke="#adb5bd" strokeWidth="9" strokeLinecap="round" />
        <path d="M360 610 L400 566" stroke="#6c757d" strokeWidth="11" strokeLinecap="round" />
        <circle cx="470" cy="480" r="10" fill={INK} />
        <g className="bagger-bucket" style={{ transformOrigin: "540px 600px" }}>
          <path d="M526 592 Q604 596 588 656 L536 656 Q518 628 526 592 Z" fill={INK} />
          <path d="M534 600 Q590 604 580 640" stroke="#5c677d" strokeWidth="5" fill="none" />
          <path d="M540 656 l6 12 l6 -12 M556 656 l6 12 l6 -12 M572 656 l6 12 l6 -12" fill={INK} />
        </g>
        <circle cx="540" cy="600" r="9" fill={STEEL} />
        <circle cx="330" cy="610" r="12" fill={INK} />
        <circle cx="330" cy="610" r="5" fill={STEEL} />
      </g>
    </>
  );
}

// Zigzag struts of the crane's lattice.
const TOWER_STRUTS = "M" + Array.from({ length: 11 }, (_, i) => `${i % 2 ? 722 : 682} ${572 - i * 45}`).join(" L");
const JIB_STRUTS = "M" + Array.from({ length: 19 }, (_, i) => `${530 + i * 40} ${i % 2 ? 120 : 140}`).join(" L");

export function Kran() {
  return (
    <>
      <rect x="646" y="574" width="112" height="22" rx="4" fill="#adb5bd" />
      <path d="M674 574 V596 M702 574 V596 M730 574 V596" stroke="#8d99ae" strokeWidth="3" />
      <rect x="660" y="562" width="84" height="14" rx="4" fill={INK} />
      <g stroke="#ff5d73" strokeWidth="7" strokeLinecap="round" fill="none">
        <path d="M682 572 V120 M722 572 V120 M520 120 H1270 M520 140 H1270 M682 120 L702 64 L722 120" />
        <path d={TOWER_STRUTS} strokeWidth="4" />
        <path d={JIB_STRUTS} strokeWidth="4" />
      </g>
      <path d="M684 572 V122 M520 122 H1270" stroke="#ff8fa3" strokeWidth="2" />
      <path d="M702 64 L540 120 M702 64 L1260 120" stroke={INK} strokeWidth="3" />
      <circle className="kran-light" cx="702" cy="58" r="8" fill="#ff3b3b" />
      <path d="M1270 120 V84" stroke={INK} strokeWidth="4" />
      <path className="kran-flag" d="M1270 84 L1306 94 L1270 104 Z" fill="#ffd60a" style={{ transformOrigin: "1270px 94px" }} />
      {/* Concrete counterweight blocks */}
      <g fill="#adb5bd" stroke="#8d99ae" strokeWidth="3">
        <rect x="524" y="140" width="72" height="17" rx="3" />
        <rect x="524" y="157" width="72" height="17" rx="3" />
        <rect x="524" y="174" width="72" height="17" rx="3" />
      </g>
      <rect x="728" y="140" width="58" height="48" rx="8" fill="#ffb703" />
      <rect x="728" y="176" width="58" height="12" rx="6" fill="#f4a100" />
      <Pane x={738} y={148} w={40} h={24} rx={4}>
        <circle className="kran-operator" cx="758" cy="164" r="7" fill={SKIN} />
      </Pane>
      {/* The trolley runs along the jib with the cable and the load. */}
      <g className="kran-trolley">
        <rect x="1044" y="136" width="42" height="16" rx="4" fill={INK} />
        <circle cx="1054" cy="136" r="4" fill={STEEL} />
        <circle cx="1076" cy="136" r="4" fill={STEEL} />
        <line
          className="kran-cable"
          x1="1065"
          y1="152"
          x2="1065"
          y2="260"
          stroke={INK}
          strokeWidth="4"
          style={{ transformOrigin: "1065px 152px" }}
        />
        <g className="kran-load">
          <g className="kran-swing" style={{ transformOrigin: "1065px 258px" }}>
            <path d="M1065 258 V270 M1065 270 L1022 300 M1065 270 L1108 300" stroke={INK} strokeWidth="3" fill="none" />
            <rect x="1056" y="252" width="18" height="12" rx="3" fill="#ffd60a" />
            <circle cx="1065" cy="270" r="6" fill="none" stroke={INK} strokeWidth="4" />
            <g fill="#e76f51" stroke="#f4a261" strokeWidth="2">
              {[1020, 1050, 1080].map((x) => (
                <rect key={x} x={x} y="300" width="30" height="15" />
              ))}
              {[1020, 1035, 1065, 1095].map((x, i) => (
                <rect key={x} x={x} y="315" width={i === 0 || i === 3 ? 15 : 30} height="15" />
              ))}
            </g>
            <rect x="1016" y="330" width="98" height="10" rx="2" fill="#8d5a2b" />
          </g>
        </g>
      </g>
    </>
  );
}

/** Mudguard arc over a wheel. */
const guard = (cx: number, cy: number, r = 36) => `M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy}`;

export function Betonmischer() {
  return (
    <g className="mischer-truck">
      <rect x="600" y="798" width="354" height="24" rx="6" fill={INK} />
      <path d="M660 800 L684 770 M822 800 L800 774" stroke={INK} strokeWidth="12" />
      <path d="M870 800 V722 Q870 708 884 708 H920 Q950 708 954 740 L958 800 Z" fill="#00b4d8" />
      <path d="M870 784 H958 V800 H870 Z" fill="#0096c7" />
      <path d="M876 716 H916" stroke="#90e0ef" strokeWidth="5" strokeLinecap="round" />
      <path d="M884 722 H918 Q932 722 938 752 H884 Z" fill={GLASS} />
      <Inside d="M884 722 H918 Q932 722 938 752 H884 Z">
        <Driver cx={906} cy={740} hat="#fff" />
      </Inside>
      <path d="M900 724 h8 L896 752 h-8 Z" fill="#fff" opacity="0.5" />
      <rect x="940" y="776" width="18" height="11" rx="4" fill="#fff4d6" />
      <rect className="mischer-light" x="940" y="776" width="18" height="11" rx="4" fill="#ffd60a" />
      <rect x="950" y="790" width="10" height="16" rx="3" fill="#ced4da" />
      <defs>
        <clipPath id="bs-drum">
          <ellipse cx="740" cy="740" rx="122" ry="58" />
        </clipPath>
      </defs>
      <g transform="rotate(-10 740 740)">
        <ellipse cx="740" cy="740" rx="122" ry="58" fill="#f1faee" />
        <g clipPath="url(#bs-drum)">
          <g className="mischer-stripes" stroke="#ff8c42" strokeWidth="16">
            {Array.from({ length: 9 }, (_, i) => (
              <path key={i} d={`M${580 + i * 50} 680 l-40 120`} />
            ))}
          </g>
          <ellipse cx="740" cy="790" rx="130" ry="26" fill={INK} opacity="0.12" />
          <ellipse cx="730" cy="704" rx="80" ry="12" fill="#fff" opacity="0.6" />
        </g>
        <ellipse cx="740" cy="740" rx="122" ry="58" fill="none" stroke={INK} strokeWidth="4" />
        <rect className="mischer-chute" x="604" y="726" width="20" height="28" rx="6" fill={INK} style={{ transformOrigin: "614px 728px" }} />
      </g>
      {/* Concrete dripping from the chute while mixing */}
      <g className="mischer-drops" fill="#adb5bd">
        {[0, 1, 2].map((i) => (
          <circle key={i} cx="606" cy="770" r="6" style={nth(i)} />
        ))}
      </g>
      <path d={`${guard(650, 830)} ${guard(760, 830)} ${guard(905, 830)}`} stroke="#2b2d42" strokeWidth="8" fill="none" />
      <Wheel cx={650} cy={828} />
      <Wheel cx={760} cy={828} />
      <Wheel cx={905} cy={828} />
    </g>
  );
}

export function Kipplaster() {
  return (
    <g className="kipper-truck">
      <g className="kipper-sand" fill={SAND}>
        {[1362, 1376, 1390, 1368, 1384].map((cx, i) => (
          <circle key={i} cx={cx} cy="748" r="8" style={nth(i)} />
        ))}
      </g>
      <rect x="982" y="798" width="374" height="24" rx="6" fill={INK} />
      <path d="M1080 800 V720 Q1080 706 1066 706 H1020 Q992 706 988 740 L984 800 Z" fill="#3ec300" />
      <path d="M984 784 H1080 V800 H984 Z" fill="#2d9a00" />
      <path d="M1026 716 H1068" stroke="#a7f070" strokeWidth="5" strokeLinecap="round" />
      <Beacon cx={1040} cy={698} />
      <path d="M1066 722 H1024 Q1008 722 1002 752 H1066 Z" fill={GLASS} />
      <Inside d="M1066 722 H1024 Q1008 722 1002 752 H1066 Z">
        <Driver cx={1040} cy={740} />
      </Inside>
      <path d="M1046 724 h8 L1042 752 h-8 Z" fill="#fff" opacity="0.5" />
      <rect x="984" y="776" width="18" height="11" rx="4" fill="#fff4d6" />
      <rect x="978" y="790" width="10" height="16" rx="3" fill="#ced4da" />
      <g className="kipper-bed" style={{ transformOrigin: "1350px 798px" }}>
        <path d="M1094 714 Q1210 640 1340 714 Z" fill={SAND} />
        <path d="M1140 700 Q1210 660 1280 700" stroke="#f3cf8e" strokeWidth="8" fill="none" />
        <path d="M1088 712 H1352 L1344 798 H1096 Z" fill="#ff8c42" />
        <path d="M1088 712 H1352 L1351 724 H1089 Z" fill="#e76f51" />
        <path d="M1160 724 V798 M1230 724 V798 M1300 724 V798" stroke="#e76f51" strokeWidth="6" />
        <path d="M1100 740 H1150 M1170 740 H1220" stroke="#ffb07c" strokeWidth="5" strokeLinecap="round" />
        {/* The tailgate swings open so the sand can pour out. */}
        <rect className="kipper-gate" x="1342" y="716" width="10" height="82" rx="3" fill="#e76f51" style={{ transformOrigin: "1347px 716px" }} />
      </g>
      <path d={`${guard(1035, 830)} ${guard(1278, 830, 70)}`} stroke="#2b2d42" strokeWidth="8" fill="none" />
      <TurningWheel cx={1035} cy={828} className="kipper-wheel" />
      <TurningWheel cx={1245} cy={828} className="kipper-wheel" />
      <TurningWheel cx={1310} cy={828} className="kipper-wheel" />
    </g>
  );
}

export function Hubschrauber() {
  return (
    <g className="heli-body" style={{ transformOrigin: "390px 300px" }}>
      <path d="M356 292 L300 288 L296 304 L356 306 Z" fill="#ff5d73" />
      <path d="M300 288 L292 266 L306 266 L312 288 Z" fill="#e63950" />
      <circle cx="299" cy="264" r="4" fill="#a4161a" />
      <circle className="bs-beacon" cx="299" cy="264" r="4" fill="#ff3b3b" />
      <g className="heli-tail-rotor" style={{ transformOrigin: "298px 290px" }} stroke={INK} strokeWidth="4" strokeLinecap="round">
        <path d="M298 276 V304 M284 290 H312" />
      </g>
      <path d="M360 342 H438 Q446 342 448 334 M372 330 V342 M420 330 V342" stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none" />
      <ellipse cx="392" cy="302" rx="46" ry="30" fill="#ff5d73" />
      <ellipse cx="384" cy="318" rx="38" ry="12" fill="#e63950" />
      <path d="M396 278 Q436 280 438 306 H396 Z" fill={GLASS} />
      <circle className="heli-pilot" cx="412" cy="296" r="9" fill={SKIN} />
      <path d="M402 286 Q406 282 410 282 L404 304 H400 Z" fill="#fff" opacity="0.55" />
      <ellipse cx="370" cy="288" rx="14" ry="6" fill="#ff8fa3" />
      <rect x="386" y="262" width="10" height="14" fill={INK} />
      <path className="heli-rotor" d="M318 262 H466" stroke={INK} strokeWidth="6" strokeLinecap="round" style={{ transformOrigin: "391px 262px" }} />
    </g>
  );
}

export function Ampel() {
  return (
    <>
      <rect x="1436" y="880" width="8" height="110" fill={INK} />
      <path d="M1436 930 h8 M1436 960 h8" stroke="#fff" strokeWidth="6" />
      {/* The button box: pressing it lights "Signal kommt". */}
      <rect x="1444" y="904" width="20" height="32" rx="4" fill="#ffd60a" />
      <rect x="1447" y="908" width="14" height="8" rx="2" fill="#2b2d42" />
      <rect className="ampel-signal" x="1447" y="908" width="14" height="8" rx="2" fill="#fff3b0" />
      <circle className="ampel-button" cx="1454" cy="926" r="4" fill={INK} />
      <rect x="1414" y="770" width="52" height="118" rx="12" fill="#2b2d42" />
      <rect x="1418" y="774" width="10" height="110" rx="5" fill="#4a4e69" />
      {[800, 829, 858].map((cy) => (
        <path key={cy} d={`M1424 ${cy - 6} A16 16 0 0 1 1456 ${cy - 6}`} stroke="#1b1d2e" strokeWidth="6" fill="none" />
      ))}
      <circle cx="1440" cy="800" r="12" fill="#5a1e1e" />
      <circle cx="1440" cy="829" r="12" fill="#5a4a1e" />
      <circle cx="1440" cy="858" r="12" fill="#1e5a2a" />
      <circle className="ampel-red" cx="1440" cy="800" r="12" fill="#ff3b3b" />
      <circle className="ampel-yellow" cx="1440" cy="829" r="12" fill="#ffd60a" />
      <circle className="ampel-green" cx="1440" cy="858" r="12" fill="#3ec300" />
      <g fill="#fff" opacity="0.5">
        <circle cx="1436" cy="796" r="3.5" />
        <circle cx="1436" cy="825" r="3.5" />
        <circle cx="1436" cy="854" r="3.5" />
      </g>
    </>
  );
}

/** Hot-air balloon drifting above the site. */
export function Ballon() {
  return (
    <g className="ballon-body">
      <defs>
        <clipPath id="bs-balloon">
          <path d="M420 34 C470 34 474 88 446 122 L436 134 H404 L394 122 C366 88 370 34 420 34 Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#bs-balloon)">
        <rect x="360" y="30" width="120" height="110" fill="#ff5d73" />
        <path d="M398 30 V140 M442 30 V140" stroke="#ffd60a" strokeWidth="16" />
        <path d="M360 92 H480" stroke="#fff" strokeWidth="8" opacity="0.8" />
        <ellipse cx="400" cy="60" rx="10" ry="18" fill="#fff" opacity="0.4" />
      </g>
      {/* The basket swings below the balloon; the pilot looks out and waves. */}
      <g className="ballon-basket" style={{ transformOrigin: "420px 134px" }}>
        <path d="M404 134 L408 154 M436 134 L432 154" stroke="#8d5a2b" strokeWidth="2.5" />
        <path className="ballon-flame" d="M420 150 q-7 -10 0 -22 q7 12 0 22 Z" fill="#ff8c42" style={{ transformOrigin: "420px 150px" }} />
        <g className="ballon-pilot">
          <path className="ballon-arm" d="M430 154 L434 143" stroke={SKIN} strokeWidth="3" strokeLinecap="round" style={{ transformOrigin: "430px 154px" }} />
          <circle cx="428" cy="150" r="6" fill={SKIN} />
          <path d="M422 148 Q422 142 428 142 Q434 142 434 148 Z" fill="#ff5d73" />
        </g>
        <rect x="404" y="152" width="32" height="20" rx="4" fill="#a0522d" />
        <path d="M404 160 H436" stroke="#8d5a2b" strokeWidth="3" />
      </g>
    </g>
  );
}

/** Road roller: the heavy drum flattens the new road. */
export function Walze() {
  return (
    <g className="walze-body">
      <g className="walze-smoke" fill="#dee2e6">
        {[0, 1, 2].map((i) => (
          <circle key={i} cx="236" cy="648" r="9" style={nth(i)} />
        ))}
      </g>
      <rect x="230" y="652" width="12" height="50" rx="3" fill={INK} />
      <path d="M170 760 L232 722 H262" stroke="#e85d04" strokeWidth="14" strokeLinecap="round" />
      <rect x="196" y="700" width="210" height="58" rx="12" fill="#ffb703" />
      <rect x="196" y="740" width="210" height="18" rx="8" fill="#f48c06" />
      <rect x="204" y="705" width="194" height="6" rx="3" fill="#ffd166" />
      <path d="M206 722 H250 M206 730 H250" stroke="#2b2d42" strokeWidth="3" opacity="0.3" />
      <path d="M288 700 V646 M378 700 V646" stroke={INK} strokeWidth="6" />
      <rect x="280" y="636" width="108" height="12" rx="5" fill="#e85d04" />
      <Beacon cx={334} cy={628} />
      <Pane x={296} y={654} w={76} h={44}>
        <Driver cx={334} cy={676} />
      </Pane>
      <g className="walze-drum" style={{ transformOrigin: "170px 760px" }}>
        <circle cx="170" cy="760" r="40" fill="#6c757d" />
        <circle cx="170" cy="760" r="32" fill="#8d99ae" />
        <path d="M170 728 V792 M138 760 H202" stroke="#6c757d" strokeWidth="5" />
        <circle cx="170" cy="760" r="10" fill={INK} />
      </g>
      <TurningWheel cx={372} cy={772} r={28} className="walze-wheel" />
    </g>
  );
}

/** Forklift with a pallet of boxes. Drawn at its own spot; the scene places it far back. */
export function Gabelstapler() {
  return (
    <g className="stapler-body">
      <path d="M28 40 V192 M40 40 V192" stroke={INK} strokeWidth="6" />
      <g className="stapler-load">
        <path d="M22 118 V190 H-32" stroke="#495057" strokeWidth="6" fill="none" strokeLinejoin="round" />
        <rect x="-34" y="178" width="52" height="9" rx="2" fill="#a0522d" />
        <rect x="-30" y="138" width="44" height="40" rx="3" fill="#c68b59" />
        <path d="M-30 156 H14" stroke="#e9c46a" strokeWidth="5" />
      </g>
      <path d="M44 130 H120 Q140 130 140 150 V186 H44 Z" fill="#ff8c42" />
      <rect x="118" y="118" width="26" height="68" rx="8" fill="#e76f51" />
      <path d="M54 130 V64 M112 130 V64" stroke={INK} strokeWidth="5" />
      <rect x="48" y="56" width="72" height="9" rx="3" fill={INK} />
      <Beacon cx={84} cy={50} />
      <Driver cx={84} cy={106} />
      <TurningWheel cx={62} cy={186} r={14} className="stapler-wheel" />
      <TurningWheel cx={124} cy={186} r={14} className="stapler-wheel" />
    </g>
  );
}
