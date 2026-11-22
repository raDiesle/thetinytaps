import type { StoryChapter } from "@/components/ChapterBook";

// „Three More Sleeps“ (idea H-143, user request, 22 November 2026: „eine weitere Geschichte, die kürzer ist als ganz
// abstillen“): a short story for weaning altogether on one day set beforehand, with a little goodbye party – for a child
// who drinks only now and then any more, or a family that wants the end plain and near rather than one milk time after
// the other over weeks, which „Tapsis Milchkette“ tells. Its chapters follow the guides' last steps of gentle weaning
// (`GOODBYE_STEPS`, research „abstillen-kapitel“): tell the child beforehand, why and when; make the days until then
// something to see and touch, with the milk still there until the day; drink one last time on purpose, say thank you
// and celebrate; and afterwards let the child miss it, be angry and cry, always in a grown-up's arms – cuddles stay.
// Its motifs: three red paper hearts on Tapsi's shelf, one taken away every morning, the cake Tapsi bakes with Papa, and
// a new orange cup just for Tapsi.
//
// The same fox family and home as the other chapter books. It is plainly about Mama's breast, as „Tapsis Milchkette“
// (`NURSING` in its pictures). English first (root CLAUDE.md), translated into every app language, German too
// (`<language>.ts`). Played at `/abstillen/abschied/`, one of the stories of the book „Abstillen“ (`ChapterBook`,
// `first="en"`); its pictures come from Gemini (`goodbyeMilkPictures.ts`).

/** A step of weaning on a set day as the guides give it; each has a chapter of its own. */
export type GoodbyeStep = "erzaehlen" | "zaehlen" | "abschied" | "begleiten";

/** The steps in the order the guides give them (research „abstillen-kapitel“), for the grown-up. */
export const GOODBYE_STEPS: { id: GoodbyeStep; title: string; what: string }[] = [
  {
    id: "erzaehlen",
    title: "Vorher erzählen",
    what: "Ein paar Tage vorher in einfachen Worten sagen, dass die Milch geht, warum, und wann – Traurigsein darf sein.",
  },
  {
    id: "zaehlen",
    title: "Den Tag sichtbar machen",
    what: "Die Tage bis dahin mit etwas zum Anfassen zählen (Herzen, ein Kalender); bis zum Tag bleibt die Milch, und das Kind bereitet das Fest mit vor.",
  },
  {
    id: "abschied",
    title: "Bewusst Abschied nehmen",
    what: "Ein letztes Mal in Ruhe trinken, Danke sagen, ein kleines Fest feiern, ein eigener neuer Becher.",
  },
  {
    id: "begleiten",
    title: "Nachbegleiten",
    what: "Vermissen, Wut und Tränen zulassen, im Arm; nichts kommt zurück, aber Kuscheln bleibt.",
  },
];

/** Where a page plays: every place keeps its look from its reference picture on (`goodbyeMilkPictures.ts`). */
export type Place = "wohnzimmer" | "kinderzimmer" | "kueche";

/** Who is in a page's picture: Tapsi, Mama and Papa Fuchs. */
export type Cast = "tapsi" | "mama" | "papa";

/** The light of a page. */
export type Light = "tag" | "abend" | "morgen";

/** One page: a picture and what the grown-up reads under it. */
export interface GoodbyePage {
  /** Unique in the story, also the picture's file name (`bilder/fest-<id>.webp`). */
  id: string;
  /** What is read aloud, English, present tense, short (checked in `goodbyeMilk.test.ts`). */
  text: string;
  place: Place;
  light: Light;
  /** Everyone in the picture, each once. */
  cast: Cast[];
  /** What happens in the picture, in English, for its Gemini prompt (`goodbyeMilkPictures.ts` adds place, cast and light). */
  picture: string;
  /** Tapsi drinks at Mama's breast in this picture (`NURSING` of „Tapsis Milchkette“). */
  nursing?: true;
}

/** One chapter of the story. */
export interface GoodbyeChapter extends StoryChapter {
  /** The step it tells. */
  step: GoodbyeStep;
  pages: GoodbyePage[];
}

export const GOODBYE_MILK: GoodbyeChapter[] = [
  {
    id: "erzaehlen",
    title: "Mama Tells Tapsi",
    step: "erzaehlen",
    pages: [
      {
        id: "trinken",
        text: "This is Tapsi. Tapsi is big now and still drinks milk at Mama's breast.",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        nursing: true,
        picture: "Mama sits on the green sofa with toddler Tapsi on her lap; Tapsi drinks at her breast, snuggled in, eyes half closed.",
      },
      {
        id: "sagen",
        text: "Mama says: “My breast has made milk for so long. In three sleeps, we say goodbye to the milk.”",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture:
          "Mama sits on the green sofa, her sweater pulled down, and Tapsi sits beside her; Mama gently lays one paw on her breast over her sweater and holds up three fingers of the other paw. Tapsi looks up at her, listening.",
      },
      {
        id: "traurig",
        text: "Tapsi doesn't want that. Mama hugs Tapsi: “That's hard. You may be sad. I'm here.”",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture: "On the green sofa Mama holds sad Tapsi close in a warm hug; Tapsi's ears hang down and a small tear runs down one cheek.",
      },
    ],
  },
  {
    id: "zaehlen",
    title: "Three More Sleeps",
    step: "zaehlen",
    pages: [
      {
        id: "herzen",
        text: "Mama puts three paper hearts on Tapsi's shelf. One for every sleep.",
        place: "kinderzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture:
          "Mama stands three red paper hearts in a row on top of the low shelf at the right, beside the teddy; Tapsi stands next to her on the rug and looks at the hearts curiously.",
      },
      {
        id: "morgen",
        text: "Every morning Tapsi takes one heart away. And there is still milk, and a long cuddle.",
        place: "kinderzimmer",
        light: "morgen",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi in pyjamas stands at the low shelf and holds one red paper heart; two red paper hearts are still standing on the shelf. Mama sits on the edge of the bed with open arms, smiling.",
      },
      {
        id: "kuchen",
        text: "Tapsi and Papa bake a cake for the goodbye party. Tapsi stirs and stirs.",
        place: "kueche",
        light: "tag",
        cast: ["tapsi", "papa"],
        picture:
          "Tapsi kneels on the high chair at the kitchen table and stirs dough in a big bowl with a wooden spoon, a little flour on the nose; Papa holds the bowl steady and laughs.",
      },
    ],
  },
  {
    id: "abschied",
    title: "Goodbye, Milk",
    step: "abschied",
    pages: [
      {
        id: "letzte",
        text: "The last heart is gone. Tapsi drinks at Mama's breast one last time – very slowly.",
        place: "kinderzimmer",
        light: "morgen",
        cast: ["tapsi", "mama"],
        nursing: true,
        picture:
          "Mama sits on Tapsi's bed and holds Tapsi in pyjamas on her lap; Tapsi drinks at her breast slowly, eyes closed. The top of the low shelf has no paper hearts any more.",
      },
      {
        id: "danke",
        text: "Tapsi waves: “Thank you, Mama's breast! Goodbye, milk!” Mama smiles with tears in her eyes.",
        place: "kinderzimmer",
        light: "morgen",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi in pyjamas sits on the bed and waves with one paw; Mama, her sweater pulled down again, sits beside Tapsi and smiles with tears in her eyes.",
      },
      {
        id: "fest",
        text: "Then it's party time: cake for everyone, and a new cup just for Tapsi.",
        place: "kueche",
        light: "morgen",
        cast: ["tapsi", "mama", "papa"],
        picture:
          "Tapsi sits in the high chair at the kitchen table and proudly holds up the new cup with both paws; the round cake Tapsi baked stands in the middle of the table with a small red paper heart on top. Mama and Papa sit at the table and smile at Tapsi.",
      },
    ],
  },
  {
    id: "vermissen",
    title: "When Tapsi Misses It",
    step: "begleiten",
    pages: [
      {
        id: "will",
        text: "In the evening Tapsi wants milk. Mama says softly: “The milk has gone. But I'm here.”",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi in pyjamas sits on the bed and tugs at Mama's sweater; Mama sits beside Tapsi, lays her paw on her breast over her sweater and looks at Tapsi softly.",
      },
      {
        id: "weinen",
        text: "Tapsi is angry and cries. Mama and Papa hold Tapsi tight until the tears are done.",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi", "mama", "papa"],
        picture: "Mama sits on the bed and holds crying, angry Tapsi in pyjamas tight in her arms; Papa sits close beside them and strokes Tapsi's back.",
      },
      {
        id: "immer",
        text: "Every day it gets a little easier. The milk is gone – but cuddles stay. Always.",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "mama", "papa"],
        picture: "On the green sofa Mama and Papa sit with Tapsi between them, all three cuddling and laughing; Tapsi holds the new cup in both paws.",
      },
    ],
  },
];

/** Every page of the story in reading order. */
export const GOODBYE_PAGES: GoodbyePage[] = GOODBYE_MILK.flatMap((c) => c.pages);
