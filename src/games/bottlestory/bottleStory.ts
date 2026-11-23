import type { StoryChapter } from "@/components/ChapterBook";
import { shortOf } from "@/lib/storyPages";

// „Bye-Bye, Bottle!“ (idea H-105, user request, 21 November 2026: „setze um in hoher Qualität Idee H-105“): like
// „Tapsis Milchkette“, but for the bottle, and shorter – told in chapters that follow what the guides advise for moving a
// small child from the bottle to a cup (`BOTTLE_STEPS`, research „flasche-abgewoehnen“): tell beforehand, let the child
// choose an open cup and practise with it, then let one bottle go after the other – the daytime bottle first, the
// morning's next, the bedtime bottle last (`BOTTLE_ORDER`) – with milk in the cup at the table, never in bed, the bottle
// put away out of sight, a new bedtime routine and water and comfort at night, and at the end the bottle packed into a
// box together. Its motifs: Tapsi's bottle with the blue cap and the yellow star, the green cup with the little leaf
// that Tapsi picks, the cuddle that stays when the bottle goes, and the plush bunny, who drinks from the cup first.
//
// Written so that it fits a child who was never breastfed too: baby Tapsi gets the bottle from Papa, and nothing here
// speaks of Mama's milk („Abstillen“ tells that). English first (root CLAUDE.md, user decision, 11 November 2026):
// other languages, German too, come when the user asks. Played at `/flaeschchen/` (`ChapterBook`, `first="en"`); its
// pictures come from Gemini (`bottleStoryPictures.ts`).

/** A step of moving a small child from the bottle to a cup, as the guides give it; each has a chapter of its own. */
export type BottleStep = "erzaehlen" | "becher" | "tag" | "morgen" | "abend" | "nacht" | "abschied";

/** The steps in the order the guides give them (research „flasche-abgewoehnen“), for the grown-up. */
export const BOTTLE_STEPS: { id: BottleStep; title: string; what: string }[] = [
  {
    id: "erzaehlen",
    title: "Vorher erzählen",
    what: "Sagen, dass große Kinder aus dem Becher trinken und die Flasche nach und nach Tschüss sagt – nicht alles auf einmal.",
  },
  {
    id: "becher",
    title: "Einen offenen Becher aussuchen und üben",
    what: "Das Kind sucht seinen Becher selbst aus, übt mit Wasser, kleckern ist in Ordnung; erst das Kuscheltier trinken lassen.",
  },
  {
    id: "tag",
    title: "Die Flasche am Tag geht zuerst",
    what: "Milch zum Essen im Becher, die Flasche nicht anbieten und außer Sicht räumen; ablenken und draußen spielen statt nachgeben.",
  },
  { id: "morgen", title: "Dann die Flasche am Morgen", what: "Die Milch am Morgen kommt im Becher, das Kuscheln bleibt." },
  {
    id: "abend",
    title: "Die Abendflasche zuletzt",
    what: "Milch im Becher am Tisch, danach Zähne putzen; im Bett keine Flasche mehr, dafür ein festes Abendritual mit Buch, Lied und Kuscheltier. Traurig sein darf sein.",
  },
  { id: "nacht", title: "In der Nacht", what: "Wacht das Kind auf, gibt es Wasser im Becher und Trost statt Milch; es wird von Nacht zu Nacht leichter." },
  { id: "abschied", title: "Tschüss, Flasche", what: "Die Flaschen gemeinsam verabschieden und wegpacken – für die Erinnerung oder für ein Baby." },
];

/**
 * The bottle times in the order they go (the guides: the daytime bottle first, the morning's next, the one at bedtime
 * last), each with the chapter that lets it go.
 */
export const BOTTLE_ORDER: { time: "tag" | "morgen" | "abend"; chapter: BottleStep }[] = [
  { time: "tag", chapter: "tag" },
  { time: "morgen", chapter: "morgen" },
  { time: "abend", chapter: "abend" },
];

/** Where a page plays: every place keeps its look from its reference picture of the other books (`bottleStoryPictures.ts`). */
export type Place = "wohnzimmer" | "kueche" | "kinderzimmer" | "garten";

/** Who is in a page's picture: Tapsi (or Tapsi as a baby), Mama and Papa Fuchs. */
export type Cast = "baby" | "tapsi" | "mama" | "papa";

/** The light of a page. */
export type Light = "tag" | "morgen" | "abend" | "nacht";

/** One page: a picture and what the grown-up reads under it. */
export interface BottlePage {
  /** Unique in the story, also the picture's file name (`bilder/flasche-<id>.webp`). */
  id: string;
  /** What is read aloud, English, present tense, short (checked in `bottlestory.test.ts`). */
  text: string;
  place: Place;
  light: Light;
  /** Everyone in the picture, each once. */
  cast: Cast[];
  /**
   * What happens in the picture, in English, for its Gemini prompt (`bottleStoryPictures.ts` adds place, cast and light).
   * Its words choose what Tapsi wears („pyjamas“, else T-shirt and trousers) and which things are described („bottle“,
   * „green cup“, „plush bunny“, „box“); a thing is named only where it is drawn.
   */
  picture: string;
}

/** One chapter: read on its own on the day it fits (the bedtime chapter on the evening the bedtime bottle goes), or the whole story at once. */
export interface BottleChapter extends StoryChapter {
  /** The step of moving to the cup it tells, if any. */
  step?: BottleStep;
  pages: BottlePage[];
}

export const BOTTLE_STORY: BottleChapter[] = [
  {
    id: "flasche",
    title: "Tapsi's Bottle",
    step: "erzaehlen",
    pages: [
      {
        id: "baby",
        text: "Look, this is Tapsi as a tiny baby. Papa holds Tapsi close and gives the bottle.",
        place: "wohnzimmer",
        light: "tag",
        cast: ["baby", "papa"],
        picture:
          "Papa sits in the big mustard-yellow armchair and holds baby Tapsi in his arms, feeding baby Tapsi from the baby bottle; baby Tapsi drinks with the eyes closed, content, and Papa looks down lovingly.",
      },
      {
        id: "gross",
        text: "Now Tapsi is big. Tapsi runs and climbs and eats with a spoon.",
        place: "kueche",
        light: "tag",
        cast: ["tapsi", "papa"],
        picture:
          "Tapsi sits in the child's chair at the table and eats porridge from a small bowl with a spoon, all alone, proud; Papa sits at the table beside Tapsi and smiles.",
      },
      {
        id: "sagen",
        text: "Mama says: “Big children drink from a cup. Bit by bit, the bottle says bye-bye.”",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi sits on the round rug holding the baby bottle in both paws and looks up at Mama; Mama sits on the green sofa, leans forward towards Tapsi and tells Tapsi something, calm and kind.",
      },
      {
        id: "zusammen",
        text: "“My bottle too?” asks Tapsi. Mama nods: “Not all at once. We do it together.”",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi sits on Mama's lap on the green sofa and leans against her, thoughtful; Mama holds Tapsi in her arm and nods with a warm smile. The rug is empty.",
      },
    ],
  },
  {
    id: "becher",
    title: "The Big Cup",
    step: "becher",
    pages: [
      {
        id: "aussuchen",
        text: "Tapsi may choose a cup. A red one, a yellow one – or the green one with the little leaf?",
        place: "kueche",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture:
          "On the table stand three small open cups side by side: a red one, a yellow one and the green cup. Tapsi sits in the child's chair and points at the green cup, delighted; Mama sits on the grown-up chair at the front left of the table and smiles.",
      },
      {
        id: "schluck",
        text: "Tapsi holds the green cup with both paws. A little water, a small sip. It works!",
        place: "kueche",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi sits in the child's chair and drinks water from the green cup, holding it with both paws, eyes wide and pleased; Mama sits on the grown-up chair at the front left of the table and watches, glad.",
      },
      {
        id: "kleckern",
        text: "Oops – water on Tapsi's shirt. “That's fine,” says Mama. “A cup needs practice.”",
        place: "kueche",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi sits in the child's chair, a wet spot on the T-shirt, and laughs; the green cup stands on the table. Mama stands beside the child's chair, laughs too and dabs the wet spot with a small kitchen towel.",
      },
      {
        id: "hase",
        text: "Tapsi gives Bunny a drink from the cup too. “Small sips, Bunny!”",
        place: "kinderzimmer",
        light: "tag",
        cast: ["tapsi"],
        picture:
          "Tapsi sits on the bed with the plush bunny on Tapsi's lap and holds the green cup to the bunny's mouth, pretending to give it a drink, with a calm, caring little smile.",
      },
    ],
  },
  {
    id: "tag",
    title: "Bye-Bye, Daytime Bottle",
    step: "tag",
    pages: [
      {
        id: "schrank",
        text: "Mama puts the bottle in the cupboard. In the daytime it rests there, out of sight.",
        place: "kueche",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture:
          "Mama stands at the kitchen counter and puts the baby bottle into an open wall cupboard above it; Tapsi stands on the floor beside her, watches and waves at the bottle.",
      },
      {
        id: "mittag",
        text: "At lunch the milk comes in the green cup, right next to Tapsi's plate.",
        place: "kueche",
        light: "tag",
        cast: ["tapsi", "papa"],
        picture:
          "Tapsi sits in the child's chair with a plate of pasta and the green cup full of milk beside it, and drinks from the cup; Papa sits at the table beside Tapsi and eats too.",
      },
      {
        id: "will",
        text: "“I want my bottle!” Papa gives Tapsi a hug: “The daytime bottle is resting. Here is your cup.”",
        place: "kueche",
        light: "tag",
        cast: ["tapsi", "papa"],
        picture:
          "Tapsi sits in the child's chair with arms crossed and a pouting, unhappy face; Papa kneels beside the chair, hugs Tapsi with one arm and holds out the green cup with the other paw, kind and patient. The wall cupboard is closed.",
      },
      {
        id: "spielen",
        text: "Then Papa and Tapsi play outside. Tapsi doesn't think of the bottle at all.",
        place: "garten",
        light: "tag",
        cast: ["tapsi", "papa"],
        picture: "Tapsi kicks the red ball across the lawn and laughs; Papa runs after it with his arms open, laughing too.",
      },
    ],
  },
  {
    id: "morgen",
    title: "Morning Milk",
    step: "morgen",
    pages: [
      {
        id: "kuscheln",
        text: "In the morning Tapsi and Mama cuddle on the sofa, like every morning.",
        place: "wohnzimmer",
        light: "morgen",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi in pyjamas sits on Mama's lap on the green sofa, still sleepy, and snuggles against her; Mama, in a yellow dressing gown, holds Tapsi in both arms. The rug is empty.",
      },
      {
        id: "morgenmilch",
        text: "The warm milk comes in the green cup now. The bottle goes – the cuddle stays.",
        place: "wohnzimmer",
        light: "morgen",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi in pyjamas sits on Mama's lap on the green sofa and drinks warm milk from the green cup, content; Mama, in her yellow dressing gown, holds Tapsi in one arm and smiles. The rug is empty.",
      },
    ],
  },
  {
    id: "abend",
    title: "The Bedtime Bottle",
    step: "abend",
    pages: [
      {
        id: "abendmilch",
        text: "In the evening Tapsi drinks milk from the cup at the table. Then teeth are brushed.",
        place: "kueche",
        light: "abend",
        cast: ["tapsi", "papa"],
        picture:
          "Tapsi in pyjamas sits in the child's chair and drinks milk from the green cup; Papa sits at the table beside Tapsi and holds up a small toothbrush, smiling.",
      },
      {
        id: "bett",
        text: "In bed there is no bottle any more. There is Bunny, a book and Mama's song.",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi in pyjamas lies in bed under the blanket with the plush bunny in the arm; Mama sits on the edge of the bed and reads from a picture book, and Tapsi listens.",
      },
      {
        id: "traurig",
        text: "Tapsi misses the bottle and cries. That's all right. Mama holds Tapsi close.",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi in pyjamas sits in bed and cries, tears on the cheeks; Mama sits on the edge of the bed and holds Tapsi close in her arms, comforting, her cheek on Tapsi's head.",
      },
      {
        id: "einschlafen",
        text: "Mama sings softly and strokes Tapsi's back, until Tapsi's eyes close.",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi in pyjamas lies in bed with the plush bunny, eyes closing, calm; Mama sits on the edge of the bed, strokes Tapsi's back and sings softly.",
      },
    ],
  },
  {
    id: "nacht",
    title: "In the Night",
    step: "nacht",
    pages: [
      {
        id: "wach",
        text: "In the night Tapsi wakes up: “Bottle!” Papa comes at once.",
        place: "kinderzimmer",
        light: "nacht",
        cast: ["tapsi", "papa"],
        picture:
          "Tapsi in pyjamas sits up in bed, sleepy and calling out; Papa, in a green T-shirt and pyjama trousers, hurries to the bed and reaches out to Tapsi.",
      },
      {
        id: "wasser",
        text: "Papa has water in the cup. He hums softly, and Tapsi snuggles into the pillow.",
        place: "kinderzimmer",
        light: "nacht",
        cast: ["tapsi", "papa"],
        picture:
          "Papa, in his green T-shirt and pyjama trousers, sits on the edge of the bed and holds the green cup while Tapsi in pyjamas takes a small sip of water; Papa hums with a gentle face and lays his other paw on Tapsi's back.",
      },
      {
        id: "sonne",
        text: "Every night it gets a little easier. And one morning Tapsi wakes up – and the sun is shining.",
        place: "kinderzimmer",
        light: "morgen",
        cast: ["tapsi"],
        picture: "Tapsi in pyjamas sits up in bed and stretches both arms high, rested and happy, the plush bunny beside Tapsi on the pillow.",
      },
    ],
  },
  {
    id: "abschied",
    title: "Bye-Bye, Bottle",
    step: "abschied",
    pages: [
      {
        id: "waschen",
        text: "Tapsi doesn't need the bottle any more. Tapsi and Papa wash it one last time.",
        place: "kueche",
        light: "tag",
        cast: ["tapsi", "papa"],
        picture:
          "Papa stands at the kitchen sink and holds Tapsi on his arm; Tapsi rinses the baby bottle under the running water and smiles, and Papa helps with his free paw.",
      },
      {
        id: "kiste",
        text: "Tapsi lays the bottle in a box. “Thank you, bottle. Bye-bye!”",
        place: "kinderzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi kneels on the blue rug in front of the open box, its lid lying beside it, and lays the baby bottle into it gently, waving with the other paw; Mama kneels beside Tapsi and smiles warmly.",
      },
      {
        id: "regal",
        text: "The box goes on the shelf – to remember, or for a little baby one day.",
        place: "kinderzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture: "Tapsi stands at the low shelf and puts the closed box with its ribbon on top of it, proud; Mama kneels beside Tapsi and smiles.",
      },
    ],
  },
  {
    id: "gross",
    title: "Big Tapsi",
    pages: [
      {
        id: "ueberall",
        text: "Now Tapsi drinks from the cup – at breakfast, in the garden and in the evening.",
        place: "garten",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi sits on a chair at the small garden table and drinks from the green cup, both paws round it, happy; Mama sits on the other chair and holds up her own cup to Tapsi, smiling.",
      },
      {
        id: "vermissen",
        text: "Sometimes Tapsi thinks of the bottle. Then Mama gives Tapsi a big cuddle.",
        place: "wohnzimmer",
        light: "abend",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi sits on Mama's lap on the green sofa, a little wistful, and Mama hugs Tapsi tight with both arms, her cheek on Tapsi's head. The rug is empty.",
      },
      {
        id: "lieb",
        text: "Mama and Papa love Tapsi – with the bottle and with the big cup.",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi", "mama", "papa"],
        picture:
          "Tapsi in pyjamas lies in bed with the plush bunny in the arm, sleepy and happy; Mama and Papa sit on the edge of the bed and lean over to give Tapsi a good-night kiss.",
      },
    ],
  },
];

/** Every page of the story in reading order. */
export const BOTTLE_PAGES: BottlePage[] = BOTTLE_STORY.flatMap((c) => c.pages);

/**
 * The pages of the short version (user request, 23 November 2026: „biete auch Kurzversionen an, was schon da ist“), read
 * in a few minutes: the same story told with its own pages – baby Tapsi with the bottle in Papa's arms, Tapsi big, Mama telling that
 * the bottle says bye-bye bit by bit, the first sip from the green cup, the daytime bottle resting in the cupboard and
 * the milk in the cup at lunch, the morning milk in the cup, the evening milk at the table and bed without a bottle,
 * the tears in Mama's arms, Papa with water at night, the bottle laid in its box, and the love that stays – the bottles
 * still going in `BOTTLE_ORDER`. Only pages of the whole story, in its order, so
 * its pictures, translations and recordings serve both (`storyBooks.test.ts` checks).
 */
export const BOTTLE_SHORT_PAGES = [
  "baby",
  "gross",
  "sagen",
  "schluck",
  "schrank",
  "mittag",
  "morgenmilch",
  "abendmilch",
  "bett",
  "traurig",
  "wach",
  "wasser",
  "kiste",
  "lieb",
];

/** The short version's chapters: each chapter with only its pages on `BOTTLE_SHORT_PAGES`, the empty ones left out. */
export const BOTTLE_STORY_SHORT: BottleChapter[] = shortOf(BOTTLE_STORY, BOTTLE_SHORT_PAGES);
