import type { SceneSpec } from "../scene";

// The pairs of the topic „feste“ (topics.ts), written as data (see scene.tsx): a birthday, Christmas, Easter and
// St. Martin, each with the one thing that makes it.

export const SCENES: SceneSpec[] = [
  {
    id: "torte-kerze",
    topic: "feste",
    name: "Torte",
    the: "die Torte",
    toThe: "zur Torte",
    partner: { name: "Kerze", the: "die Kerze", acc: "die Kerze", emoji: "🕯️" },
    thing: "🎂",
    backdrop: "party",
    props: [["🎈", 40, 60, 28]],
    act: "onto",
    sounds: ["clonk", "twinkle"],
  },
  {
    id: "geschenk-schleife",
    topic: "feste",
    name: "Geschenk",
    the: "das Geschenk",
    toThe: "zum Geschenk",
    partner: { name: "Schleife", the: "die Schleife", acc: "die Schleife", emoji: "🎀" },
    thing: "🎁",
    backdrop: "party",
    props: [["🎉", 258, 60, 26]],
    act: "onto",
    sounds: ["rustle", "twinkle"],
  },
  {
    id: "tannenbaum-weihnachtsstern",
    topic: "feste",
    name: "Tannenbaum",
    the: "der Tannenbaum",
    toThe: "zum Tannenbaum",
    partner: { name: "Weihnachtsstern", the: "der Weihnachtsstern", acc: "den Weihnachtsstern", emoji: "🌟" },
    thing: "🎄",
    backdrop: "wohnzimmer",
    props: [["🎁", 252, 150, 26]],
    act: "onto",
    sounds: ["twinkle", "chime"],
    // The moon's star would sit on the tree too, and a pine cone hang in it: „mond-stern“ and „tanne-tannenzapfen“ name it.
  },
  {
    id: "osterei-pinsel",
    topic: "feste",
    name: "Osterei",
    the: "das Osterei",
    toThe: "zum Osterei",
    partner: { name: "Pinsel", the: "der Pinsel", acc: "den Pinsel", emoji: "🖌️" },
    thing: "🥚",
    // Painting eggs at the table before Easter.
    backdrop: "maltisch",
    props: [["🌷", 42, 120, 24]],
    act: "rub",
    sounds: ["swirl"],
    // The handmade paper's crayon paints an egg too.
    alsoFits: ["papier"],
  },
  {
    id: "laterne-licht",
    topic: "feste",
    name: "Laterne",
    the: "die Laterne",
    toThe: "zur Laterne",
    partner: { name: "Licht", the: "das Licht", acc: "das Licht", emoji: "💡" },
    thing: "🏮",
    // St. Martin: the lantern walk in the evening.
    backdrop: "nacht",
    act: "light",
    sounds: ["click", "chime"],
    // The birthday candle would light a lantern too.
    alsoFits: ["torte-kerze"],
  },
  {
    id: "pinata-bonbons",
    topic: "feste",
    name: "Piñata",
    the: "die Piñata",
    toThe: "zur Piñata",
    partner: { name: "Bonbons", the: "die Bonbons", acc: "die Bonbons", plural: true, emoji: "🍬" },
    thing: "🪅",
    backdrop: "party",
    act: "into",
    sounds: ["rattle", "giggle"],
  },
  {
    id: "blumenstrauss-vase",
    topic: "feste",
    name: "Blumenstrauß",
    the: "der Blumenstrauß",
    toThe: "zum Blumenstrauß",
    partner: { name: "Vase", the: "die Vase", acc: "die Vase", emoji: "🏺" },
    thing: "💐",
    backdrop: "party",
    act: "into",
    sounds: ["rustle", "plop"],
    // The handmade flower's watering can would water a bouquet too.
    alsoFits: ["blume"],
  },
];
