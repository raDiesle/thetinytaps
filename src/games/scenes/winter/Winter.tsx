import { Eichhoernchen, Hund } from "../baustelle/figures";
import { float, ground, HORIZON } from "../layout";
import { Sonne } from "../sky";
import type { Scene } from "../types";
import { Reh } from "../wald/animals";
import { FallingSnow } from "../weather";
import { Meise, Rotkehlchen, Schneetanne, Schneewolke, Vogelhaus, Winterfuchs } from "../winterbaustelle/nature";
import { Schlitten, Schneeballkinder } from "../winterbaustelle/people";
import { WinterHase, WinterLaterne } from "../winterbaustelle/snowcaps";
import { Eiszapfen, Fussspuren, Iglu } from "../winterbaustelle/things";
import { Background } from "./background";
import { BENCH, BIRD_TABLE, FIR, HOUSE, SLOPE, SQUIRREL, onHill, rotatedBox } from "./layout";
import { Schlittenmama, Rutscher, Schneeengel, Schneekugel, Schneeopa, Skifahrer } from "./people";
import { Eisente, Eislaeuferin, Schlittschuhe } from "./pond";
import { Schneemann, tannenbaum } from "./schneemann";
import { Pferdeschlitten } from "./sleigh";
import { Futterkrippe, Handschuh, Holzhaus, Kakao, Kirchturm, Parkbank, Schneeflocke } from "./village";
import "../baustelle/baustelle.css";
import "../wald/wald.css";
import "../winterbaustelle/winterbaustelle.css";
import "./winter.css";

// Winter at the edge of the village: a red wooden house with icicles, a frozen pond with a
// skater, the sledging hill on the right and the horse sleigh on the path. Drawings of the
// Winter-Baustelle, the Baustelle and the Wald keep their ids on purpose, so they move with
// their own animations; the new ones are animated in winter.css. Items go from back to front.

// The sledge, the skier and the sledging disc lean with the slope of the hill.
const SLED_BOX = rotatedBox([-118, -160, 226, 160], SLOPE);
const SKI_BOX = rotatedBox([-80, -150, 188, 150], SLOPE);
const DISC_BOX = rotatedBox([-62, -132, 124, 134], SLOPE / 2);

function SchlittenAmHang() {
  return (
    <g transform={`rotate(${SLOPE})`}>
      <Schlitten />
    </g>
  );
}

function SkifahrerAmHang() {
  return (
    <g transform={`rotate(${SLOPE})`}>
      <Skifahrer />
    </g>
  );
}

function RutscherAmHang() {
  return (
    <g transform={`rotate(${SLOPE / 2})`}>
      <Rutscher />
    </g>
  );
}

/** The robin sits on the left end of the bench's backrest. */
const ROBIN = float(0, 0, BENCH.x - 78 * BENCH.scale, BENCH.y - 104 * BENCH.scale, BENCH.scale * 1.15);

export const winter: Scene = {
  id: "winter",
  title: "Winter",
  emoji: "⛄",
  description: "Schneemann, Schlitten, Eislaufen und ein Pferdeschlitten im Schnee.",
  width: 1600,
  height: 1000,
  sky: "#8fbce6",
  ground: "#dce7f2",
  Background,
  Overlay: () => <FallingSnow seed="winter" />,
  // Wind blows through the sky; out of the snow everywhere (the frozen pond's snowy ice too) a bunny peeks.
  spots: [
    { box: [0, 0, 1600, HORIZON], kinds: ["flurry"] },
    { box: [0, HORIZON, 1600, 1000 - HORIZON], kinds: ["snow"] },
  ],
  items: [
    // ---------- Sky ----------
    {
      id: "sonne",
      name: "die Sonne",
      sentences: ["Die Wintersonne scheint!", "Die Sonne lacht. Aber es ist kalt!"],
      sound: "chime",
      traits: ["yellow"],
      box: [1386, 46, 148, 148],
      hitAreas: [[1360, 20, 200, 200]],
      place: float(1460, 120, 1470, 96, 0.72),
      durationMs: 2000,
      Art: Sonne,
    },
    {
      id: "schneewolke",
      name: "die Schneewolke",
      sentences: ["Die Wolke lässt es schneien!", "Schneeflocken fallen ganz leise.", "Die Wolke ist weiß und weich."],
      sound: "whoosh",
      box: [148, 80, 180, 112],
      place: float(238, 136, 560, 104, 0.8),
      durationMs: 2600,
      Art: Schneewolke,
    },
    {
      id: "schneeflocke",
      name: "die Schneeflocke",
      sentences: ["Die Schneeflocke dreht sich!", "Glitzer, glitzer! Die Schneeflocke funkelt.", "Jede Schneeflocke hat sechs Zacken."],
      sound: "twinkle",
      box: [-56, -56, 112, 112],
      hitAreas: [[-60, -60, 120, 120]],
      place: float(0, 0, 880, 120, 0.85),
      durationMs: 2000,
      Art: Schneeflocke,
    },

    // ---------- Far back: the church, the forest edge ----------
    {
      id: "kirchturm",
      name: "der Kirchturm",
      sentences: ["Bim, bam! Die Glocke läutet.", "Oben auf dem Turm dreht sich ein Hahn.", "Die Uhr am Turm zeigt die Zeit."],
      sound: "bells",
      traits: ["big"],
      key: "K",
      box: [-130, -370, 200, 372],
      place: ground(0, 0, 1110, 348, 1.35),
      durationMs: 2400,
      Art: Kirchturm,
    },
    {
      id: "hase",
      name: "der Hase",
      sentences: ["Guck mal, ein Hase im verschneiten Busch!", "Hoppel, hoppel, macht der Hase."],
      sound: "boing",
      traits: ["animal"],
      box: [0, -6, 150, 112],
      place: ground(75, 100, 438, 404, 1.2),
      durationMs: 1800,
      Art: WinterHase,
    },
    {
      id: "schneetanne",
      name: "die Tanne",
      sentences: ["Die Tanne schüttelt sich. Der Schnee fällt runter!", "Die Tanne ist im Winter grün.", "Plumps! Ganz viel Schnee."],
      sound: "rustle",
      traits: ["green", "big"],
      key: "T",
      box: [-94, -258, 188, 258],
      place: FIR,
      shadow: [0, 0, 40],
      durationMs: 2200,
      Art: Schneetanne,
    },
    {
      id: "eichhoernchen",
      name: "das Eichhörnchen",
      sentences: ["Das Eichhörnchen sitzt in der Tanne.", "Das Eichhörnchen knabbert eine Nuss."],
      sound: "squeak",
      traits: ["animal", "small"],
      box: [136, 446, 38, 48],
      hitAreas: [[118, 428, 72, 72]],
      place: SQUIRREL,
      durationMs: 1800,
      Art: Eichhoernchen,
    },
    {
      id: "futterkrippe",
      name: "die Futterkrippe",
      sentences: ["In der Futterkrippe ist Heu für die Rehe.", "Im Winter finden die Tiere wenig Futter.", "Da liegen auch Möhren und ein Apfel!"],
      sound: "rustle",
      box: [-96, -180, 192, 182],
      place: ground(0, 0, 318, 432, 1.15),
      shadow: [0, 0, 80],
      durationMs: 2000,
      Art: Futterkrippe,
    },
    {
      id: "reh",
      name: "das Reh",
      sentences: ["Das Reh kommt zur Futterkrippe.", "Hopp! Das Reh springt durch den Schnee.", "Das Reh hat große Ohren."],
      sound: "boing",
      traits: ["animal"],
      key: "R",
      box: [-76, -200, 184, 200],
      place: ground(0, 0, 192, 446, 1.2),
      shadow: [0, 0, 70],
      durationMs: 2000,
      Art: Reh,
    },

    // ---------- Middle: the red house, the lit fir, grandpa, the bird table ----------
    {
      id: "holzhaus",
      name: "das Holzhaus",
      sentences: ["Im Holzhaus ist es warm und gemütlich.", "Aus dem Schornstein kommt Rauch.", "Die Tür geht auf. Wer ist da?"],
      sound: "knocks",
      traits: ["red", "big"],
      key: "H",
      box: [900, 340, 322, 364],
      place: HOUSE,
      shadow: [1060, 702, 170],
      durationMs: 2600,
      hideout: [0.2, 0.8],
      Art: Holzhaus,
    },
    {
      id: "eiszapfen",
      name: "die Eiszapfen",
      sentences: ["Am Dach hängen Eiszapfen.", "Die Eiszapfen glitzern. Tropf, tropf!", "Eiszapfen sind kalt und glatt."],
      sound: "drops",
      plural: true,
      key: "E",
      box: [936, 488, 242, 40],
      hitAreas: [
        [928, 486, 90, 62],
        [1100, 486, 90, 62],
      ],
      place: HOUSE,
      durationMs: 2000,
      Art: Eiszapfen,
    },
    { ...tannenbaum(ground(0, 0, 914, 520)), key: "B" },
    {
      id: "schneeopa",
      name: "der Opa",
      sentences: ["Der Opa schiebt den Schnee weg.", "Hau ruck! Der Weg wird frei.", "Puh, der Opa schnauft."],
      sound: "crunch",
      key: "O",
      box: [-130, -210, 182, 212],
      place: ground(0, 0, 820, 614),
      shadow: [0, 0, 40],
      durationMs: 2200,
      Art: Schneeopa,
    },
    {
      id: "vogelhaus",
      name: "das Vogelhaus",
      sentences: ["Im Vogelhaus gibt es Körner für die Vögel.", "Der Meisenknödel schaukelt."],
      sound: "pop",
      key: "V",
      box: [-72, -236, 148, 236],
      hitAreas: [[-72, -236, 108, 236]],
      place: BIRD_TABLE,
      durationMs: 2000,
      Art: Vogelhaus,
    },
    {
      id: "meise",
      name: "die Meise",
      sentences: ["Piep! Die Meise pickt Körner.", "Die Meise hat einen blauen Kopf und einen gelben Bauch."],
      sound: "tweet",
      traits: ["blue", "yellow", "flies", "animal", "small"],
      box: [38, -200, 58, 48],
      hitAreas: [[36, -214, 70, 70]],
      place: BIRD_TABLE,
      durationMs: 1800,
      Art: Meise,
    },

    // ---------- The frozen pond ----------
    {
      id: "eisente",
      name: "die Ente",
      sentences: ["Hui! Die Ente rutscht auf dem Eis.", "Quak! Das Eis ist so glatt!", "Die Ente hat einen roten Schal."],
      sound: "quack",
      traits: ["animal", "flies"],
      box: [-60, -84, 112, 88],
      place: ground(0, 0, 292, 640, 1.2),
      shadow: [0, 0, 40],
      durationMs: 2000,
      Art: Eisente,
    },
    {
      id: "eislaeuferin",
      name: "die Eisläuferin",
      sentences: ["Das Mädchen läuft Schlittschuh.", "Sie dreht sich im Kreis. Wie schön!", "Das Eis glitzert."],
      sound: "musicbox",
      box: [-62, -164, 120, 166],
      place: ground(0, 0, 530, 668),
      shadow: [0, 0, 44],
      durationMs: 2400,
      Art: Eislaeuferin,
    },

    // ---------- The sledging hill ----------
    {
      id: "iglu",
      name: "das Iglu",
      sentences: ["Das Iglu ist aus Schnee gebaut.", "Wer wohnt denn im Iglu? Hallo!", "Im Iglu geht das Licht an."],
      sound: "chime",
      key: "I",
      box: [-122, -152, 244, 152],
      hitAreas: [[-122, -112, 244, 112]],
      place: onHill(1478, 414, 1.2),
      shadow: [0, 0, 120],
      durationMs: 2400,
      hideout: [0.15, 0.9],
      Art: Iglu,
    },
    {
      id: "skifahrer",
      name: "der Skifahrer",
      sentences: ["Der Junge fährt Ski. Hui!", "Mit den Stöcken schiebt er an.", "Der Schnee staubt."],
      sound: "whoosh",
      box: SKI_BOX,
      place: onHill(1310, 476),
      durationMs: 2000,
      Art: SkifahrerAmHang,
    },
    {
      id: "schlitten",
      name: "der Schlitten",
      sentences: ["Juhu! Das Kind fährt Schlitten.", "Der Schlitten saust den Berg runter.", "Klingeling, macht die Glocke."],
      sound: "sleigh",
      key: "L",
      box: SLED_BOX,
      place: onHill(1166, 556, 1.05),
      durationMs: 2400,
      Art: SchlittenAmHang,
    },
    {
      id: "rutscher",
      name: "der Po-Rutscher",
      sentences: ["Das Kind rutscht auf dem Po-Rutscher.", "Er dreht sich im Kreis. Juhu!", "Der Po-Rutscher ist rot."],
      sound: "giggle",
      box: DISC_BOX,
      place: onHill(1004, 632),
      durationMs: 2000,
      Art: RutscherAmHang,
    },
    {
      id: "schlittschuhe",
      name: "die Schlittschuhe",
      sentences: ["Hier liegen Schlittschuhe.", "Mit Schlittschuhen kann man auf dem Eis laufen.", "Hopp! Die Schlittschuhe hüpfen."],
      sound: "ping",
      plural: true,
      box: [-70, -86, 136, 90],
      place: ground(0, 0, 214, 724, 1.2),
      durationMs: 1600,
      Art: Schlittschuhe,
    },
    {
      id: "schlittenmama",
      name: "die Mama",
      sentences: ["Die Mama zieht den Schlitten.", "Das Baby winkt. Hallo!", "Knirsch, knirsch, macht der Schnee."],
      sound: "giggle",
      key: "M",
      box: [-44, -194, 214, 196],
      place: ground(0, 0, 1214, 762),
      shadow: [56, 0, 110],
      durationMs: 2200,
      Art: Schlittenmama,
    },

    // ---------- The path ----------
    {
      id: "parkbank",
      name: "die Bank",
      sentences: ["Auf der Bank liegt Schnee.", "Plumps! Der Schnee fällt runter.", "Hier kann man sich ausruhen."],
      sound: "pop",
      box: [-104, -116, 208, 116],
      hitAreas: [[-104, -116, 136, 116]],
      place: BENCH,
      shadow: [0, 0, 100],
      durationMs: 2000,
      Art: Parkbank,
    },
    {
      id: "kakao",
      name: "der Kakao",
      sentences: ["Mmh, heißer Kakao!", "Pust, pust! Der Kakao ist heiß.", "Der Kakao wärmt die Hände."],
      sound: "blow",
      traits: ["small"],
      box: [32, -110, 66, 62],
      hitAreas: [[26, -116, 80, 116]],
      place: BENCH,
      durationMs: 2000,
      Art: Kakao,
    },
    {
      id: "rotkehlchen",
      name: "das Rotkehlchen",
      sentences: ["Das Rotkehlchen sitzt auf der Bank.", "Tirili! Das Rotkehlchen singt."],
      sound: "tweet",
      traits: ["flies", "animal", "small"],
      box: [-32, -54, 72, 54],
      hitAreas: [[-44, -70, 86, 74]],
      place: ROBIN,
      durationMs: 1800,
      Art: Rotkehlchen,
    },
    {
      id: "pferdeschlitten",
      name: "der Pferdeschlitten",
      sentences: ["Das Pferd zieht den Schlitten.", "Klingeling! Die Glöckchen klingen.", "Hü, Pferdchen, lauf!"],
      sound: "neigh",
      traits: ["red", "big"],
      key: "P",
      box: [-272, -230, 470, 232],
      hitAreas: [
        [-272, -230, 236, 232],
        [-70, -168, 266, 170],
      ],
      place: ground(0, 0, 806, 820, 0.95),
      shadow: [-40, 0, 220],
      durationMs: 2600,
      Art: Pferdeschlitten,
    },
    {
      id: "laterne",
      name: "die Laterne",
      sentences: ["Die Laterne geht an. Im Winter wird es früh dunkel.", "Die Laterne hat eine Schneemütze."],
      sound: "hum",
      box: [36, 498, 64, 206],
      hitAreas: [[26, 490, 84, 214]],
      place: ground(68, 704, 1062, 842, 1.1),
      shadow: [50, 703, 18],
      durationMs: 2200,
      Art: WinterLaterne,
    },

    // ---------- Front ----------
    {
      id: "handschuh",
      name: "der Handschuh",
      sentences: ["Da liegt ein Handschuh im Schnee.", "Wer hat den Handschuh verloren?", "Guck mal, im Handschuh wohnt jemand!"],
      sound: "rustle",
      traits: ["red", "small"],
      box: [-64, -94, 128, 96],
      place: ground(0, 0, 478, 884, 1.25),
      durationMs: 2400,
      hideout: true,
      Art: Handschuh,
    },
    {
      id: "winterfuchs",
      name: "der Fuchs",
      sentences: ["Hopp! Der Fuchs springt in den Schnee.", "Der Fuchs hört eine Maus unter dem Schnee.", "Der Fuchs hat einen buschigen Schwanz."],
      sound: "sniff",
      traits: ["animal"],
      key: "F",
      box: [-112, -126, 226, 126],
      place: ground(0, 0, 1206, 902),
      durationMs: 2200,
      Art: Winterfuchs,
    },
    {
      id: "schneekugel",
      name: "die Schneekugel",
      sentences: ["Das Kind rollt eine große Schneekugel.", "Die Kugel wird immer dicker!", "Daraus wird ein Schneemann."],
      sound: "crunch",
      box: [-104, -156, 222, 158],
      place: ground(0, 0, 918, 934),
      shadow: [-30, 0, 90],
      durationMs: 2200,
      Art: Schneekugel,
    },
    {
      id: "schneeengel",
      name: "der Schneeengel",
      sentences: ["Das Mädchen macht einen Schneeengel.", "Arme hoch, Arme runter!", "Hihi, der Schnee kitzelt."],
      sound: "giggle",
      box: [-104, -124, 208, 126],
      place: ground(0, 0, 694, 958),
      durationMs: 2200,
      Art: Schneeengel,
    },
    {
      id: "schneemann",
      name: "der Schneemann",
      sentences: ["Hallo, Schneemann!", "Der Schneemann hat eine Möhrennase.", "Der Schneemann zieht seinen Hut."],
      sound: "boing",
      key: "S",
      box: [-92, -264, 184, 264],
      hitAreas: [[-70, -264, 140, 264]],
      place: ground(0, 0, 150, 966, 0.95),
      shadow: [0, 0, 64],
      durationMs: 2400,
      Art: Schneemann,
    },
    {
      id: "schneeballkinder",
      name: "die Schneeball-Kinder",
      sentences: ["Die Kinder machen eine Schneeballschlacht!", "Platsch! Daneben!", "Die Kinder lachen."],
      sound: "pop",
      plural: true,
      box: [-134, -170, 256, 170],
      place: ground(0, 0, 1440, 976),
      shadow: [0, 0, 120],
      durationMs: 2400,
      Art: Schneeballkinder,
    },
    {
      id: "hund",
      name: "der Hund",
      sentences: ["Wau, wau! Der Hund spielt im Schnee.", "Der Hund wedelt mit dem Schwanz.", "Der Hund will auch einen Schneeball!"],
      sound: "bark",
      traits: ["animal"],
      box: [166, 878, 164, 112],
      place: ground(248, 988, 338, 990),
      shadow: [255, 990, 62],
      durationMs: 1600,
      Art: Hund,
    },
    {
      id: "fussspuren",
      name: "die Fußspuren",
      sentences: ["Hier sind Spuren im Schnee. Wer war das?", "Knirsch, knirsch! Spuren im Schnee."],
      sound: "crunch",
      plural: true,
      box: [-208, -30, 344, 40],
      hitAreas: [[-208, -60, 344, 76]],
      place: ground(0, 0, 1104, 992),
      durationMs: 2000,
      Art: Fussspuren,
    },
  ],
  // Little stories: one item sets off the next ones (explore and colour mode).
  chains: [
    {
      start: "schneeballkinder",
      steps: [
        { item: "hund", sentence: "Der Hund will mitspielen. Wau, wau!" },
        { item: "schneemann", sentence: "Platsch! Ein Schneeball trifft den Schneemann. Er zieht den Hut." },
      ],
    },
    {
      start: "fussspuren",
      steps: [
        { item: "winterfuchs", sentence: "Wer war das? Der Fuchs! Hopp, er springt in den Schnee." },
        { item: "rotkehlchen", sentence: "Das Rotkehlchen erschrickt und hüpft weg." },
      ],
    },
    {
      start: "schlitten",
      steps: [
        { item: "rutscher", sentence: "Jetzt saust der Po-Rutscher den Berg runter." },
        { item: "skifahrer", sentence: "Und der Skifahrer kommt hinterher!" },
      ],
    },
  ],
};
