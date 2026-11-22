import type { StoryChapter } from "@/components/ChapterBook";

// „The Milk Sleeps at Night“ (idea H-104): a short story in chapters for families who wean only at night and go on
// breastfeeding by day – which „Tapsis Milchkette“, weaning altogether, can't tell. Its chapters follow what the guides
// advise for gentle night weaning (`NIGHT_STEPS`, research „nachts-abstillen“): tell the child beforehand, with one
// picture tied to dark and light („when the moon shines, the milk sleeps“) and who will come at night; keep the milk at
// bedtime but end the evening with a fixed ritual; at night comfort instead of milk – the other parent, water, carrying,
// humming, crying allowed in loving arms, never alone; the milk comes back when the sun is up; and the same again night
// after night until the child sleeps on. Its motifs: the moon and the sun in Tapsi's window, a little picture book of
// the two, waving good night to the milk, Papa's humming, the blue cup of water and the teddy.
//
// The same fox family and home as the other chapter books. It is plainly about Mama's breast, as „Tapsis Milchkette“
// (`NURSING` in its pictures). English first (root CLAUDE.md, user decision, 11 November 2026), translated into every app
// language, German too (`<language>.ts`, 22 November 2026). Played at `/abstillen/nachts/`, a volume tied to the book „Abstillen“ (`ChapterBook`,
// `first="en"`); its pictures come from Gemini (`nightMilkPictures.ts`).

/** A step of gentle night weaning as the guides give it; each has a chapter of its own. */
export type NightStep = "erzaehlen" | "abend" | "troesten" | "morgen" | "dranbleiben";

/** The steps in the order the guides give them (research „nachts-abstillen“), for the grown-up. */
export const NIGHT_STEPS: { id: NightStep; title: string; what: string }[] = [
  {
    id: "erzaehlen",
    title: "Vorher erzählen",
    what: "Am Tag ankündigen, mit einem einfachen Bild an Dunkel und Hell geknüpft („Wenn der Mond scheint, schläft die Milch“), sagen, dass die Milch am Tag bleibt, so oft das Kind mag, und wer nachts kommt.",
  },
  {
    id: "abend",
    title: "Der Abend bleibt, mit festem Ende",
    what: "Vor dem Schlafen darf das Kind trinken; danach immer dasselbe Ritual (Gute Nacht zur Milch, Buch, Lied), damit Trinken und Einschlafen sich lösen.",
  },
  {
    id: "troesten",
    title: "Nachts trösten statt stillen",
    what: "Oft kommt der andere Elternteil: tragen, summen, ein Schluck Wasser. Weinen und Wut dürfen sein, im Arm – das Kind ist nie allein.",
  },
  { id: "morgen", title: "Die Milch kommt mit der Sonne", what: "Am Morgen, wenn es hell ist, darf das Kind wieder trinken; am Tag bleibt alles wie vorher." },
  { id: "dranbleiben", title: "Jede Nacht gleich", what: "Ein paar Nächte lang dasselbe, ruhig und verlässlich, bis das Kind weiterschläft." },
];

/** Where a page plays: every place keeps its look from its reference picture on (`nightMilkPictures.ts`). */
export type Place = "wohnzimmer" | "kinderzimmer";

/** Who is in a page's picture: Tapsi, Mama and Papa Fuchs. */
export type Cast = "tapsi" | "mama" | "papa";

/** The light of a page. */
export type Light = "tag" | "abend" | "nacht" | "morgen";

/** One page: a picture and what the grown-up reads under it. */
export interface NightPage {
  /** Unique in the story, also the picture's file name (`bilder/nacht-<id>.webp`). */
  id: string;
  /** What is read aloud, English, present tense, short (checked in `nightmilk.test.ts`). */
  text: string;
  place: Place;
  light: Light;
  /** Everyone in the picture, each once. */
  cast: Cast[];
  /** What happens in the picture, in English, for its Gemini prompt (`nightMilkPictures.ts` adds place, cast and light). */
  picture: string;
  /** Tapsi drinks at Mama's breast in this picture (`NURSING` of „Tapsis Milchkette“). */
  nursing?: true;
}

/** One chapter: read on its own on the evening it fits, or the whole story at once. */
export interface NightChapter extends StoryChapter {
  /** The step of night weaning it tells. */
  step: NightStep;
  pages: NightPage[];
}

export const NIGHT_MILK: NightChapter[] = [
  {
    id: "mond",
    title: "When the Moon Shines",
    step: "erzaehlen",
    pages: [
      {
        id: "trinken",
        text: "This is Tapsi. Tapsi drinks milk at Mama's breast – in the daytime, and at night too.",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        nursing: true,
        picture: "Mama sits on the green sofa with Tapsi on her lap, holding Tapsi close; Tapsi drinks at her breast, calm and cosy, and Mama smiles down.",
      },
      {
        id: "sagen",
        text: "Mama says: “When the moon shines, the milk sleeps. When the sun comes up, it wakes again.”",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture:
          "Mama sits on the green sofa with Tapsi beside her, and both look into a small open picture book on Mama's lap: on its left page a big yellow moon on a dark blue night, on its right page a big smiling sun on a light blue day. Mama points at the moon, and Tapsi listens with wide eyes.",
      },
      {
        id: "tags",
        text: "“And in the daytime?” asks Tapsi. Mama hugs Tapsi: “Milk and cuddles, as much as you like.”",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture:
          "Mama sits on the green sofa and hugs Tapsi, who sits on her lap and looks up at her with a question on the face; Mama laughs warmly. The small picture book lies closed beside them on the sofa.",
      },
      {
        id: "papa",
        text: "Papa says: “When you wake up at night, I'll come. I'll carry you and hum.”",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "papa"],
        picture:
          "Papa kneels on the round rug in front of Tapsi, who stands on the rug, and holds both of Tapsi's paws in his, smiling warmly; Tapsi looks up at him, curious and trusting.",
      },
    ],
  },
  {
    id: "abend",
    title: "Good Night, Milk",
    step: "abend",
    pages: [
      {
        id: "abendmilch",
        text: "In the evening Tapsi drinks once more. Outside, the moon comes up.",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi", "mama"],
        nursing: true,
        picture:
          "Mama sits on the edge of Tapsi's bed and holds Tapsi in pyjamas in her arms; Tapsi drinks at her breast, sleepy. In the window the moon is rising.",
      },
      {
        id: "winken",
        text: "Tapsi waves at the moon: “Good night, milk!” Papa reads a book, and Tapsi falls asleep.",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi", "mama", "papa"],
        picture:
          "Tapsi in pyjamas lies in bed under the blanket and waves one paw towards the moon in the window, smiling sleepily; Papa sits on a small chair beside the bed with an open picture book, and Mama stands at the foot of the bed and waves at the moon too.",
      },
    ],
  },
  {
    id: "papa",
    title: "Papa Is There",
    step: "troesten",
    pages: [
      {
        id: "wach",
        text: "In the night Tapsi wakes up. “Milk!” But the moon is shining. The milk is asleep.",
        place: "kinderzimmer",
        light: "nacht",
        cast: ["tapsi"],
        picture: "Tapsi in pyjamas sits up in bed, alone, and calls out with the mouth open, unhappy, looking at the moon in the window.",
      },
      {
        id: "weinen",
        text: "Papa comes at once. “I'm here.” Tapsi is angry and cries. Papa holds Tapsi tight.",
        place: "kinderzimmer",
        light: "nacht",
        cast: ["tapsi", "papa"],
        picture:
          "Papa in pyjamas stands beside the bed and holds Tapsi in pyjamas close against his chest; Tapsi cries and pushes a little with both paws, angry, and Papa holds Tapsi gently and lovingly, his cheek on Tapsi's head. The bed is empty.",
      },
      {
        id: "wasser",
        text: "A sip of water from the cup. Papa carries Tapsi back and forth and hums softly.",
        place: "kinderzimmer",
        light: "nacht",
        cast: ["tapsi", "papa"],
        picture:
          "Papa in pyjamas walks slowly across the room carrying Tapsi in pyjamas on his arm; Tapsi, calmer now with wet eyes, holds a small blue cup of water with both paws and drinks a sip. Papa hums with his eyes half closed. The bed is empty.",
      },
      {
        id: "einschlafen",
        text: "Tapsi snuggles into Papa's soft fur. Slowly, Tapsi's eyes close.",
        place: "kinderzimmer",
        light: "nacht",
        cast: ["tapsi", "papa"],
        picture:
          "Papa in pyjamas sits on the edge of the bed with Tapsi in pyjamas asleep against his chest, Tapsi's cheek on his fur, eyes closed and peaceful; Papa strokes Tapsi's back. The small blue cup stands on the night table.",
      },
    ],
  },
  {
    id: "sonne",
    title: "The Milk Wakes Up",
    step: "morgen",
    pages: [
      {
        id: "morgenmilch",
        text: "In the morning the sun comes up. The milk is awake! Tapsi snuggles up to Mama and drinks.",
        place: "kinderzimmer",
        light: "morgen",
        cast: ["tapsi", "mama"],
        nursing: true,
        picture:
          "Morning sun shines in through the window. Mama sits on Tapsi's bed and holds Tapsi in pyjamas in her arms; Tapsi drinks at her breast, sleepy and happy.",
      },
    ],
  },
  {
    id: "naechte",
    title: "Night After Night",
    step: "dranbleiben",
    pages: [
      {
        id: "wieder",
        text: "The next night Tapsi wakes up again. And Papa comes again, every time.",
        place: "kinderzimmer",
        light: "nacht",
        cast: ["tapsi", "papa"],
        picture:
          "Papa in pyjamas sits on the edge of the bed and strokes the head of Tapsi in pyjamas, who lies in bed half awake, a little sad, holding on to Papa's paw.",
      },
      {
        id: "weiter",
        text: "A few nights later Tapsi wakes up, sees the moon, hugs the teddy – and sleeps on.",
        place: "kinderzimmer",
        light: "nacht",
        cast: ["tapsi"],
        picture:
          "Tapsi in pyjamas lies in bed under the blanket, alone, eyes half open, looking at the moon in the window with a sleepy little smile and hugging the teddy close.",
      },
      {
        id: "lieb",
        text: "In the morning everyone has slept. Milk in the day, sleep at night – and love all the time.",
        place: "kinderzimmer",
        light: "morgen",
        cast: ["tapsi", "mama", "papa"],
        picture:
          "Morning sun. Tapsi in pyjamas sits in the middle of the bed and laughs, and Mama and Papa sit on either side and hug Tapsi together; all three look rested and happy.",
      },
    ],
  },
];

/** Every page of the story in reading order. */
export const NIGHT_PAGES: NightPage[] = NIGHT_MILK.flatMap((c) => c.pages);
