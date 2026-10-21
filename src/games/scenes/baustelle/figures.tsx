import { CHEEK, Face, INK, SKIN, STEEL, nth } from "./shared";

export function Bauarbeiter() {
  return (
    <g className="arbeiter-body" style={{ transformOrigin: "1290px 650px" }}>
      <rect x="1270" y="590" width="18" height="56" rx="6" fill="#1d3557" />
      <rect x="1292" y="590" width="18" height="56" rx="6" fill="#1d3557" />
      <rect x="1262" y="638" width="28" height="12" rx="5" fill={INK} />
      <rect x="1290" y="638" width="28" height="12" rx="5" fill={INK} />
      <path d="M1266 526 L1252 578" stroke="#ff8c42" strokeWidth="14" strokeLinecap="round" />
      <circle cx="1251" cy="583" r="7" fill={SKIN} />
      <rect x="1262" y="514" width="56" height="84" rx="16" fill="#ff8c42" />
      <path d="M1262 550 H1318 M1262 572 H1318" stroke="#ffd60a" strokeWidth="6" />
      <path d="M1300 514 V598" stroke="#e76f51" strokeWidth="4" opacity="0.6" />
      <rect x="1262" y="584" width="56" height="9" fill="#8d5a2b" />
      <rect x="1296" y="582" width="12" height="16" rx="2" fill="#a0522d" />
      <rect x="1302" y="574" width="4" height="12" fill={STEEL} />
      <circle cx="1290" cy="490" r="24" fill={SKIN} />
      <circle cx="1266" cy="492" r="5" fill={SKIN} />
      <circle cx="1314" cy="492" r="5" fill={SKIN} />
      <path d="M1268 484 q2 -8 10 -6 M1312 484 q-2 -8 -10 -6" stroke="#8d5a2b" strokeWidth="5" strokeLinecap="round" fill="none" />
      <Face cx={1290} cy={488} size={1.05} />
      <path d="M1264 482 Q1264 456 1290 456 Q1316 456 1316 482 Z" fill="#ffd60a" />
      <rect x="1258" y="478" width="64" height="8" rx="4" fill="#ffb703" />
      <path d="M1276 470 Q1280 460 1290 458" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.6" fill="none" />
      <g className="arbeiter-arm" style={{ transformOrigin: "1314px 526px" }}>
        <path d="M1314 526 L1328 578" stroke="#ff8c42" strokeWidth="14" strokeLinecap="round" />
        <circle cx="1329" cy="583" r="7" fill={SKIN} />
      </g>
    </g>
  );
}

/** A second worker breaking up the road with a jackhammer. */
export function Presslufthammer() {
  return (
    <>
      <g className="hammer-dust" fill="#ced4da">
        {[1210, 1232, 1252].map((cx, i) => (
          <circle key={cx} cx={cx} cy="988" r="10" style={nth(i)} />
        ))}
      </g>
      <g className="hammer-shake">
        <rect x="1162" y="944" width="16" height="46" rx="5" fill="#1d3557" />
        <rect x="1182" y="944" width="16" height="46" rx="5" fill="#1d3557" />
        <rect x="1156" y="984" width="24" height="10" rx="4" fill={INK} />
        <rect x="1180" y="984" width="24" height="10" rx="4" fill={INK} />
        <rect x="1156" y="884" width="48" height="66" rx="14" fill="#ffd60a" />
        <path d="M1156 910 H1204 M1156 928 H1204" stroke="#fff" strokeWidth="5" />
        <path d="M1196 898 L1222 918" stroke="#ffd60a" strokeWidth="12" strokeLinecap="round" />
        <circle cx="1180" cy="866" r="20" fill={SKIN} />
        <circle cx="1190" cy="874" r="4" fill={CHEEK} opacity="0.55" />
        <path d="M1180 876 Q1188 880 1194 874" stroke="#2b2d42" strokeWidth="3" strokeLinecap="round" fill="none" />
        {/* Safety goggles */}
        <rect x="1178" y="858" width="22" height="11" rx="5" fill="#bde0fe" stroke={INK} strokeWidth="2.5" />
        <circle cx="1188" cy="864" r="2.5" fill="#2b2d42" />
        <path d="M1158 860 Q1158 838 1180 838 Q1202 838 1202 860 Z" fill="#fff" />
        <rect x="1154" y="856" width="54" height="7" rx="3" fill="#dee2e6" />
        {/* Ear protection */}
        <path d="M1164 858 Q1162 872 1166 876" stroke="#ff5d73" strokeWidth="3" fill="none" />
        <rect x="1158" y="864" width="12" height="16" rx="5" fill="#ff5d73" />
        {/* The jackhammer */}
        <path d="M1206 918 H1250" stroke={INK} strokeWidth="8" strokeLinecap="round" />
        <rect x="1219" y="920" width="18" height="52" rx="4" fill="#ff5d73" />
        <path d="M1228 972 V994" stroke={STEEL} strokeWidth="6" />
        <circle cx="1222" cy="918" r="7" fill={SKIN} />
      </g>
    </>
  );
}

export function Katze() {
  return (
    <g className="katze-body" style={{ transformOrigin: "1180px 380px" }}>
      <path
        className="katze-tail"
        d="M1198 372 Q1228 368 1222 340"
        stroke="#ff8c42"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
        style={{ transformOrigin: "1198px 372px" }}
      />
      <ellipse cx="1184" cy="362" rx="22" ry="18" fill="#ff8c42" />
      <path d="M1180 346 q4 8 0 14 M1190 346 q4 8 0 14 M1200 352 q3 6 0 10" stroke="#e76f51" strokeWidth="4" strokeLinecap="round" fill="none" />
      <ellipse cx="1176" cy="370" rx="10" ry="8" fill="#ffd8a8" />
      <g className="katze-head" style={{ transformOrigin: "1164px 354px" }}>
        <path d="M1149 336 L1151 318 L1161 328 Z M1175 336 L1173 318 L1163 328 Z" fill="#ff8c42" />
        <path d="M1152 330 L1153 323 L1157 328 Z M1172 330 L1171 323 L1167 328 Z" fill="#ffb3c1" />
        <circle cx="1162" cy="340" r="15" fill="#ff8c42" />
        <path d="M1158 326 l1 6 M1162 325 v6 M1166 326 l-1 6" stroke="#e76f51" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="1162" cy="346" rx="8" ry="5" fill="#ffd8a8" />
        <circle cx="1156" cy="337" r="2.5" fill="#2b2d42" />
        <circle cx="1168" cy="337" r="2.5" fill="#2b2d42" />
        <circle cx="1156.8" cy="336" r="0.9" fill="#fff" />
        <circle cx="1168.8" cy="336" r="0.9" fill="#fff" />
        <path d="M1159 344 H1165 L1162 347 Z" fill="#ff5d73" />
        <path d="M1144 344 H1154 M1170 344 H1180" stroke="#2b2d42" strokeWidth="1.5" />
      </g>
    </g>
  );
}

export function Vogel() {
  return (
    <g className="vogel-flight">
      <path d="M880 104 L860 94 L864 112 Z" fill="#0077b6" />
      <ellipse cx="895" cy="104" rx="20" ry="13" fill="#00b4d8" />
      <ellipse cx="900" cy="110" rx="12" ry="6" fill="#caf0f8" />
      <circle cx="914" cy="92" r="11" fill="#00b4d8" />
      <path d="M910 82 q2 -8 8 -6" stroke="#0077b6" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M923 89 L935 93 L923 97 Z" fill="#ffb703" />
      <circle cx="917" cy="89" r="2.5" fill="#2b2d42" />
      <circle cx="917.8" cy="88.2" r="0.8" fill="#fff" />
      <ellipse
        className="vogel-wing"
        cx="891"
        cy="101"
        rx="12"
        ry="7"
        fill="#0077b6"
        style={{ transformOrigin: "898px 99px" }}
      />
      <path d="M892 112 V117 M900 112 V117" stroke="#ff8c42" strokeWidth="2.5" />
    </g>
  );
}

export function Hund() {
  return (
    <g className="hund-body" style={{ transformOrigin: "255px 985px" }}>
      <path
        className="hund-tail"
        d="M300 932 Q324 914 318 894"
        stroke="#c68b59"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
        style={{ transformOrigin: "300px 932px" }}
      />
      {[212, 232, 276, 294].map((x) => (
        <rect key={x} x={x} y="950" width="13" height="36" rx="5" fill="#a86f45" />
      ))}
      <ellipse cx="256" cy="940" rx="52" ry="25" fill="#c68b59" />
      <ellipse cx="270" cy="934" rx="16" ry="12" fill="#a86f45" />
      <ellipse cx="240" cy="952" rx="24" ry="9" fill="#e0b98a" />
      <g className="hund-head" style={{ transformOrigin: "216px 924px" }}>
        <circle cx="208" cy="906" r="26" fill="#c68b59" />
        <ellipse cx="190" cy="919" rx="15" ry="11" fill="#e0b98a" />
        <circle cx="178" cy="914" r="6" fill={INK} />
        <circle cx="206" cy="898" r="3.5" fill="#2b2d42" />
        <circle cx="207" cy="896.8" r="1.2" fill="#fff" />
        <circle cx="196" cy="908" r="4" fill={CHEEK} opacity="0.5" />
        <ellipse cx="222" cy="906" rx="9" ry="18" fill="#8d5a2b" transform="rotate(-15 222 906)" />
        <path d="M184 928 Q192 934 200 928" stroke={INK} strokeWidth="2.5" fill="none" />
      </g>
      <path d="M222 926 Q232 940 246 932" stroke="#ff5d73" strokeWidth="6" fill="none" />
      <circle cx="232" cy="940" r="4.5" fill="#ffd60a" />
    </g>
  );
}

/** Concrete pipes with a mouse peeking out of one of them. */
export function Maus() {
  return (
    <>
      {[
        [430, 950],
        [470, 884],
      ].map(([cx, cy]) => (
        <g key={cx}>
          <circle cx={cx} cy={cy} r="38" fill="#adb5bd" />
          <circle cx={cx} cy={cy} r="31" fill="none" stroke="#ced4da" strokeWidth="3" />
          <circle cx={cx} cy={cy} r="24" fill="#495057" />
          <path d={`M${cx - 18} ${cy + 10} A20 20 0 0 0 ${cx + 18} ${cy + 10}`} stroke="#343a40" strokeWidth="6" fill="none" />
        </g>
      ))}
      <circle cx="510" cy="950" r="38" fill="#adb5bd" />
      <circle cx="510" cy="950" r="31" fill="none" stroke="#ced4da" strokeWidth="3" />
      <circle cx="510" cy="950" r="24" fill="#343a40" />
      <g className="maus-body">
        <path className="maus-tail" d="M494 966 Q478 978 488 990" stroke="#f4acb7" strokeWidth="3" fill="none" />
        <ellipse cx="506" cy="962" rx="16" ry="10" fill="#ced4da" />
        <circle cx="500" cy="944" r="8" fill="#ced4da" />
        <circle cx="520" cy="944" r="8" fill="#ced4da" />
        <circle cx="500" cy="944" r="4" fill="#f4acb7" />
        <circle cx="520" cy="944" r="4" fill="#f4acb7" />
        <circle cx="510" cy="955" r="12" fill="#ced4da" />
        <circle cx="506" cy="952" r="2.2" fill="#2b2d42" />
        <circle cx="514" cy="952" r="2.2" fill="#2b2d42" />
        <circle cx="510" cy="960" r="2.6" fill="#ff5d73" />
        <path d="M502 960 H490 M502 963 L491 967 M518 960 H530 M518 963 L529 967" stroke={INK} strokeWidth="1.2" />
      </g>
    </>
  );
}

/** A duck splashing in a puddle. */
export function Ente() {
  return (
    <>
      <ellipse cx="756" cy="962" rx="100" ry="24" fill="#8ecae6" />
      <g className="ente-ripples" fill="none" stroke="#fff" strokeWidth="3">
        <ellipse cx="756" cy="962" rx="50" ry="12" />
        <ellipse cx="756" cy="962" rx="50" ry="12" style={nth(1)} />
      </g>
      <g className="ente-body" style={{ transformOrigin: "756px 960px" }}>
        <path d="M792 938 L808 928 L800 948 Z" fill="#ffd60a" />
        <ellipse cx="764" cy="946" rx="36" ry="20" fill="#ffd60a" />
        <ellipse cx="772" cy="942" rx="16" ry="10" fill="#ffb703" />
        <path d="M762 940 q8 4 18 0 M764 946 q8 4 16 0" stroke="#f48c06" strokeWidth="2" fill="none" />
        <circle cx="734" cy="918" r="16" fill="#ffd60a" />
        <path d="M720 916 L702 922 L720 928 Z" fill="#ff8c42" />
        <circle cx="730" cy="913" r="2.6" fill="#2b2d42" />
        <circle cx="730.8" cy="912.2" r="0.9" fill="#fff" />
        <circle cx="738" cy="922" r="4" fill={CHEEK} opacity="0.5" />
      </g>
      <ellipse cx="760" cy="963" rx="44" ry="7" fill="#8ecae6" />
      <g className="ente-splash" fill="#8ecae6">
        {[722, 790, 808].map((cx, i) => (
          <circle key={cx} cx={cx} cy="950" r="5" style={nth(i)} />
        ))}
      </g>
    </>
  );
}

export function Schmetterling() {
  return (
    <g className="falter-flight">
      <g className="falter-wings" style={{ transformOrigin: "1545px 905px" }}>
        <ellipse cx="1532" cy="898" rx="14" ry="11" fill="#ff7bd0" />
        <ellipse cx="1558" cy="898" rx="14" ry="11" fill="#ff7bd0" />
        <ellipse cx="1535" cy="914" rx="9" ry="8" fill="#8e7dff" />
        <ellipse cx="1555" cy="914" rx="9" ry="8" fill="#8e7dff" />
        <circle cx="1530" cy="897" r="4" fill="#ffd60a" />
        <circle cx="1560" cy="897" r="4" fill="#ffd60a" />
        <circle cx="1535" cy="914" r="2.5" fill="#fff" />
        <circle cx="1555" cy="914" r="2.5" fill="#fff" />
      </g>
      <rect x="1542" y="892" width="6" height="28" rx="3" fill={INK} />
      <path d="M1544 892 q-6 -10 -10 -12 M1546 892 q6 -10 10 -12" stroke={INK} strokeWidth="2" fill="none" />
    </g>
  );
}

/** The tree at the left edge; its crown rustles and drops a few leaves. */
export function Baum() {
  return (
    <>
      <rect x="102" y="480" width="12" height="90" fill="#8d5a2b" />
      <rect x="110" y="480" width="4" height="90" fill="#6f4520" />
      <path d="M108 520 L124 504" stroke="#8d5a2b" strokeWidth="6" strokeLinecap="round" />
      <g className="baum-crown" style={{ transformOrigin: "108px 520px" }}>
        <circle cx="86" cy="478" r="22" fill="#40916c" />
        <circle cx="130" cy="476" r="24" fill="#40916c" />
        <circle cx="108" cy="462" r="34" fill="#52b788" />
        <circle cx="96" cy="448" r="13" fill="#74c69d" />
        <circle cx="122" cy="486" r="7" fill="#ff5d73" />
        <circle cx="92" cy="486" r="6" fill="#ff5d73" />
        <circle cx="116" cy="450" r="6" fill="#ff5d73" />
      </g>
      <g className="baum-leaves" fill="#52b788">
        {[
          [84, 494],
          [118, 500],
          [100, 490],
        ].map(([x, y], i) => (
          <ellipse key={x} cx={x} cy={y} rx="6" ry="3.5" style={nth(i)} />
        ))}
      </g>
    </>
  );
}

/** A squirrel sitting at the edge of the tree crown. */
export function Eichhoernchen() {
  return (
    <g className="hoernchen-body" style={{ transformOrigin: "152px 490px" }}>
      <path
        className="hoernchen-tail"
        d="M158 488 Q178 480 170 460 Q164 446 152 452 Q164 462 156 474 Z"
        fill="#d9822b"
        style={{ transformOrigin: "158px 488px" }}
      />
      <ellipse cx="150" cy="478" rx="9" ry="12" fill="#e8a04f" />
      <ellipse cx="147" cy="482" rx="5" ry="7" fill="#ffe8cc" />
      <circle cx="146" cy="464" r="8" fill="#e8a04f" />
      <path d="M143 457 L145 449 L149 456 Z" fill="#d9822b" />
      <circle cx="143" cy="463" r="1.8" fill="#2b2d42" />
      <circle cx="139" cy="467" r="1.5" fill={INK} />
      <circle cx="142" cy="480" r="3.5" fill="#a0522d" />
    </g>
  );
}

/** A frog in the foreground that jumps. */
export function Frosch() {
  return (
    <g className="frosch-body" style={{ transformOrigin: "1066px 994px" }}>
      <path d="M1040 990 Q1036 970 1052 970 M1092 990 Q1096 970 1080 970" stroke="#2d9a00" strokeWidth="9" strokeLinecap="round" fill="none" />
      <ellipse cx="1066" cy="976" rx="24" ry="18" fill="#3ec300" />
      <ellipse cx="1066" cy="984" rx="15" ry="9" fill="#b9f18c" />
      <circle cx="1054" cy="958" r="8" fill="#3ec300" />
      <circle cx="1078" cy="958" r="8" fill="#3ec300" />
      <circle cx="1054" cy="957" r="4" fill="#fff" />
      <circle cx="1078" cy="957" r="4" fill="#fff" />
      <circle cx="1055" cy="957" r="2.2" fill="#2b2d42" />
      <circle cx="1079" cy="957" r="2.2" fill="#2b2d42" />
      <path d="M1056 972 Q1066 978 1076 972" stroke="#1b5e20" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="1050" cy="970" r="3" fill={CHEEK} opacity="0.6" />
      <circle cx="1082" cy="970" r="3" fill={CHEEK} opacity="0.6" />
      <path d="M1040 992 h14 M1078 992 h14" stroke="#2d9a00" strokeWidth="6" strokeLinecap="round" />
    </g>
  );
}

/** A snail crawling at the front left. */
export function Schnecke() {
  return (
    <g className="schnecke-crawl">
      <g className="schnecke-foot" style={{ transformOrigin: "112px 994px" }}>
        <path d="M58 994 Q56 982 70 982 H120 Q132 982 134 970 L138 994 Z" fill="#c9ada7" />
        <g className="schnecke-stalks" style={{ transformOrigin: "130px 976px" }}>
          <path d="M128 976 L124 954 M134 976 L138 956" stroke="#c9ada7" strokeWidth="4" strokeLinecap="round" />
          <circle cx="124" cy="953" r="3.5" fill="#2b2d42" />
          <circle cx="138" cy="955" r="3.5" fill="#2b2d42" />
        </g>
        <circle cx="132" cy="984" r="2.5" fill={CHEEK} />
      </g>
      <circle cx="88" cy="968" r="22" fill="#f4a261" />
      <path d="M88 968 m0 -14 a14 14 0 1 1 -12 20 a9 9 0 1 1 14 -10 a4 4 0 1 1 -4 4" stroke="#c2703d" strokeWidth="4" strokeLinecap="round" fill="none" />
      <ellipse cx="80" cy="954" rx="6" ry="3" fill="#fff" opacity="0.5" />
    </g>
  );
}
