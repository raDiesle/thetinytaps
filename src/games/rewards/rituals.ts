import type { Localized } from "@/lib/language";
import type { CatalogTask } from "./catalog";

// Rituals for the Tagesplan (H-58): fixed moments of the day a parent shares with the child – brave sentences in the
// morning, telling about the day after Kita or school, good-night sentences in bed. Each is a card on the plan like
// any other step; tapped when it is the one to do, it opens its words for the grown-up to say or ask (`RitualCard`) –
// or its game, „Wie geht's dir?“ (C-33) –
// and the plan prints them as cards to keep at the mirror or the bed. Where the words come from: research „rituale“ in
// src/content/research.ts. German only until translations are asked for (languageStatus.ts says so).

/** Who speaks a group of lines: the grown-up asks, the grown-up says, or the child says it after them. */
export interface RitualPart {
  /** For the grown-up, over the lines: „Sie fragen:“. */
  who: Localized;
  /** What is said, each with a small sign a child can point at. */
  lines: { emoji: string; text: Localized }[];
}

/** A card of the plan that is a ritual: its picture and name like any step, and the words that go with it. */
export interface Ritual extends CatalogTask {
  /** When it belongs, for the grown-up: „Am Morgen, vor dem Spiegel“. */
  when: Localized;
  /** What is said, in the order it is said. */
  parts: RitualPart[];
  /** How it goes best, in two or three sentences for the grown-up. */
  how: Localized;
  /**
   * The game the card opens instead of its words, like the teeth card opens Zähne putzen: the child answers there, and
   * the card is ticked when it comes back (`gameOf`). Its words are still printed.
   */
  game?: string;
}

/** The rituals, in the order of the day. */
export const RITUALS: Ritual[] = [
  {
    id: "mutmachen",
    emoji: "💪",
    label: { de: "Mutmach-Sätze" },
    when: { de: "Am Morgen, vor dem Spiegel" },
    parts: [
      {
        who: { de: "Sie sagen vor, Ihr Kind spricht nach:" },
        lines: [
          { emoji: "🌟", text: { de: "Ich bin gut so, wie ich bin." } },
          { emoji: "🦁", text: { de: "Ich bin mutig." } },
          { emoji: "💪", text: { de: "Ich schaffe das. Und wenn es schwer ist, hilft mir jemand." } },
          { emoji: "🌱", text: { de: "Ich darf Fehler machen. So lerne ich." } },
        ],
      },
    ],
    how: {
      de: "Stellen Sie sich zusammen vor den Spiegel, eine Hand aufs Herz. Ihr Kind spricht nach, wenn es mag – es muss nie. Jeden Morgen dieselben Sätze: Gerade die Wiederholung macht sie vertraut.",
    },
  },
  {
    id: "erzaehlen",
    emoji: "💬",
    label: { de: "Erzählen" },
    when: { de: "Nach Kita oder Schule" },
    parts: [
      {
        who: { de: "Sie fragen – und erzählen auch von Ihrem Tag:" },
        lines: [
          { emoji: "☀️", text: { de: "Was war heute schön?" } },
          { emoji: "🌧️", text: { de: "Was war heute blöd?" } },
          { emoji: "🌱", text: { de: "Was war heute neu?" } },
        ],
      },
    ],
    how: {
      de: "Erst ankommen lassen – trinken, kuscheln, spielen –, dann fragen. Erzählen Sie zuerst von sich: So lernt Ihr Kind, wie Erzählen geht. Beim Blöden erst einmal nur zuhören, nicht gleich lösen. Den Kleinsten reicht ein Wort oder ein Zeigen.",
    },
  },
  {
    // C-33: once in the morning and once in the evening; in the evening the game shows the morning's weather beside.
    id: "wiegehts",
    emoji: "🌦️",
    label: { de: "Wie geht's dir?" },
    when: { de: "Am Morgen und am Abend" },
    game: "/wie-gehts-dir/",
    parts: [
      { who: { de: "Sie fragen:" }, lines: [{ emoji: "🌤️", text: { de: "Wie geht's dir heute? Welches Wetter passt zu dir?" } }] },
      { who: { de: "Am Abend:" }, lines: [{ emoji: "🌦️", text: { de: "Heute früh war Regen – und jetzt? Was ist passiert?" } }] },
    ],
    how: {
      de: "Ihr Kind tippt das Wetter an, das zu ihm passt. Am Abend zeigt das Spiel das Wetter vom Morgen daneben: So sieht es, dass Gefühle kommen und gehen. Jedes Wetter ist in Ordnung.",
    },
  },
  {
    id: "gutenacht",
    emoji: "💛",
    label: { de: "Gute-Nacht-Sätze" },
    when: { de: "Vor dem Schlafen, im Bett" },
    parts: [
      { who: { de: "Sie fragen:" }, lines: [{ emoji: "😊", text: { de: "Worüber hast du dich heute gefreut?" } }] },
      { who: { de: "Sie sagen:" }, lines: [{ emoji: "🤗", text: { de: "Ich hab dich lieb, genau so, wie du bist." } }] },
      {
        who: { de: "Ihr Kind sagt nach:" },
        lines: [
          { emoji: "🌟", text: { de: "Ich bin gut so, wie ich bin." } },
          { emoji: "💛", text: { de: "Ich bin geliebt." } },
          { emoji: "🌅", text: { de: "Morgen ist ein neuer Tag." } },
        ],
      },
    ],
    how: {
      de: "Leise, beim Kuscheln, wenn das Licht schon aus ist. Jeden Abend gleich: Das gibt Halt und macht das Einschlafen leichter. Mag Ihr Kind nicht nachsprechen, sagen Sie die Sätze allein – sie kommen trotzdem an.",
    },
  },
];

const RITUAL_BY_ID = new Map(RITUALS.map((ritual) => [ritual.id, ritual]));

/** The ritual a plan's card is, by the catalogue entry it came from – none for any other card. */
export const ritualOf = (step: { catalog?: string }): Ritual | undefined => (step.catalog ? RITUAL_BY_ID.get(step.catalog) : undefined);
