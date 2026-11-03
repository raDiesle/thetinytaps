import type { Localized } from "@/lib/language";

/** How the pacifiers leave: in a little box on the windowsill, or tied to a balloon flying out of the window. */
export type Farewell = "box" | "balloon";

/** The ways of saying goodbye a grown-up can pick behind ⚙️, the one they really do at home. */
export const FAREWELLS: { id: Farewell; emoji: string; name: Localized }[] = [
  {
    id: "box",
    emoji: "📦",
    name: {
      de: "Schnullerkästchen auf der Fensterbank",
      en: "Pacifier box on the windowsill",
      zh: "窗台上的奶嘴盒",
      hi: "खिड़की पर चुसनी का डिब्बा",
      es: "Cajita de chupetes en la ventana",
      ar: "علبة اللهّايات على حافة النافذة",
      ru: "Коробочка с пустышками на подоконнике",
    },
  },
  {
    id: "balloon",
    emoji: "🎈",
    name: {
      de: "Luftballon aus dem Fenster",
      en: "Balloon out of the window",
      zh: "从窗口飞走的气球",
      hi: "खिड़की से उड़ता गुब्बारा",
      es: "Globo por la ventana",
      ar: "بالون يطير من النافذة",
      ru: "Воздушный шарик в окно",
    },
  },
];

/** A present the fairy can leave, as a picture: grown-ups pick the one that really waits for the child in the morning. */
export interface Gift {
  id: string;
  emoji: string;
  name: Localized;
}

export const GIFTS: Gift[] = [
  {
    id: "teddy",
    emoji: "🧸",
    name: { de: "Kuscheltier", en: "Cuddly toy", zh: "毛绒玩具", hi: "मुलायम खिलौना", es: "Peluche", ar: "دمية محشوّة", ru: "Мягкая игрушка" },
  },
  { id: "book", emoji: "📚", name: { de: "Buch", en: "Book", zh: "书", hi: "किताब", es: "Libro", ar: "كتاب", ru: "Книжка" } },
  { id: "car", emoji: "🚗", name: { de: "Auto", en: "Car", zh: "小汽车", hi: "गाड़ी", es: "Coche", ar: "سيارة", ru: "Машинка" } },
  { id: "ball", emoji: "⚽", name: { de: "Ball", en: "Ball", zh: "球", hi: "गेंद", es: "Pelota", ar: "كرة", ru: "Мяч" } },
  {
    id: "crayons",
    emoji: "🖍️",
    name: { de: "Malstifte", en: "Crayons", zh: "蜡笔", hi: "रंगीन पेंसिलें", es: "Ceras de colores", ar: "أقلام تلوين", ru: "Карандаши" },
  },
  {
    id: "train",
    emoji: "🚂",
    name: { de: "Eisenbahn", en: "Train set", zh: "小火车", hi: "खिलौना रेलगाड़ी", es: "Tren de juguete", ar: "قطار لعبة", ru: "Железная дорога" },
  },
  { id: "dino", emoji: "🦖", name: { de: "Dino", en: "Dinosaur", zh: "恐龙", hi: "डायनासोर", es: "Dinosaurio", ar: "ديناصور", ru: "Динозавр" } },
  { id: "unicorn", emoji: "🦄", name: { de: "Einhorn", en: "Unicorn", zh: "独角兽", hi: "यूनिकॉर्न", es: "Unicornio", ar: "حصان وحيد القرن", ru: "Единорог" } },
];

/** The gift with that id, or the first one (an id saved before a gift was taken out). */
export const giftById = (id: string) => GIFTS.find((g) => g.id === id) ?? GIFTS[0];

/**
 * The steps of the story, each with one thing to tap (`goalOf` in PacifierPlay):
 * gather the pacifiers, send them off, switch the lamp off, the fairy comes (the window, then the fairy three times),
 * wake Tapsi up, open the present – then the party.
 */
export type StepId = "collect" | "send" | "sleep" | "fairy" | "wake" | "gift" | "party";

/** A rectangle in the picture's 1600 × 900. */
export interface Spot {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** The picture is drawn 1600 × 900 and covers the screen: what matters stays within these, the rest may be cut off. */
export const STAGE = { w: 1600, h: 900 };

/** Where the three pacifiers lie in the evening: on the bed, on the floor, on the windowsill. */
export const PACIFIERS: { spot: Spot; colour: string }[] = [
  { spot: { x: 440, y: 470, w: 90, h: 90 }, colour: "#ff8fb8" },
  { spot: { x: 410, y: 690, w: 90, h: 90 }, colour: "#7fd8c4" },
  { spot: { x: 1090, y: 345, w: 90, h: 90 }, colour: "#ffd166" },
];

/** The places of everything else in the room, and where things go. */
export const SPOTS = {
  /** The pacifier box on the floor beside Tapsi. */
  box: { x: 960, y: 650, w: 140, h: 120 },
  /** The box (and later the present) on the windowsill. */
  sill: { x: 990, y: 315, w: 140, h: 120 },
  /** The balloon, floating beside Tapsi. */
  balloon: { x: 950, y: 280, w: 180, h: 440 },
  /** The middle of the window: what leaves flies into it, the fairy comes out of it. */
  window: { x: 900, y: 130, w: 280, h: 300 },
  /** The lamp on the bedside table. */
  lamp: { x: 645, y: 400, w: 110, h: 150 },
  tapsi: { x: 770, y: 450, w: 160, h: 320 },
  /** Tapsi asleep in the bed: head on the pillow, the blanket over him. */
  asleep: { x: 210, y: 400, w: 420, h: 230 },
  mama: { x: 1190, y: 330, w: 200, h: 440 },
  /** The fairy hovering beside the windowsill. */
  fairy: { x: 1130, y: 140, w: 264, h: 288 },
} satisfies Record<string, Spot>;

/** Where a pacifier goes when it is tapped: into the box's opening, or to the end of the balloon's string. */
export const DROP = { box: { x: 1030, y: 690 }, balloon: { x: 1040, y: 650 } };

/** The middle of a spot. */
export const centre = (s: Spot) => ({ x: s.x + s.w / 2, y: s.y + s.h / 2 });
