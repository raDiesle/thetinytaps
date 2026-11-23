import type { StoryChapter } from "@/components/ChapterBook";
import { SETTLING_STEPS, type SettlingStep } from "@/games/kitastory/kitaStory";
import { shortOf } from "@/lib/storyPages";

// „Tapsi Goes to Lotta's“ (idea H-147, 23 November 2026): the book „Kita-Start“'s second story, for families whose child
// is looked after by a childminder (a German Tagesmutter, Kindertagespflege) instead of a Kita. There the day looks
// different: a flat instead of a big house, a few children of mixed ages instead of a group, one single grown-up who does
// everything, meals together at her kitchen table, walks to the playground with the smallest in a handcart, and the nap
// in a little bed in her bedroom. Its chapters follow the same steps of settling in as „Tapsi geht in die Kita“
// (`SETTLING_STEPS`, research „kita-eingewoehnung“ and its addendum on the childminder): tell the child, a parent stays
// as a safe harbour (here on Lotta's sofa), the first short goodbye, Lotta comforts, the same goodbye every morning,
// the day's order, and coming back as said – „after your nap“, never by the clock. Its motifs: the red ladybug on
// Tapsi's hook, the big kitchen table, the red handcart, the kitchen window to wave from, and Tapsi's plush bunny.
//
// The same fox family as the other chapter books; Lotta the childminder is a bear in her role, and so are the children
// at her home (Emil, Tapsi's friend, a baby and a bigger girl), as the Kita's people are bears. English first (root
// CLAUDE.md), translated into every app language, German too (`<language>.ts`). Played at `/kita/tagesmutter/`
// (`ChapterBook`, `first="en"`), its short version at `/kita/tagesmutter/kurz/`; its pictures come from Gemini
// (`childminderPictures.ts`).

/** Where a page plays: every place keeps its look from its reference picture on (`childminderPictures.ts`). */
export type Place = "wohnzimmer" | "kinderzimmer" | "strasse" | "flur" | "spielzimmer" | "kueche" | "spielplatz" | "schlafzimmer";

/**
 * Who is in a page's picture: Tapsi, Mama and Papa Fuchs, Lotta the childminder, Emil, Tapsi's friend at Lotta's, and
 * the two other children she looks after („kinder“: a baby and a bigger girl).
 */
export type Cast = "tapsi" | "mama" | "papa" | "lotta" | "emil" | "kinder";

/** The light of a page. */
export type Light = "morgen" | "tag" | "mittag" | "abend";

/** One page: a picture and what the grown-up reads under it. */
export interface ChildminderPage {
  /** Unique in the story, also the picture's file name (`bilder/tm-<id>.webp`). */
  id: string;
  /** What is read aloud, English, present tense, short (checked in `childminder.test.ts`). */
  text: string;
  place: Place;
  light: Light;
  /** Everyone in the picture, each once („kinder“ are two). */
  cast: Cast[];
  /**
   * What happens in the picture, in English, for its Gemini prompt (`childminderPictures.ts` adds place, cast and light).
   * Its words choose what Tapsi and Mama wear: „Tapsi in a jacket“, „coat“, „pyjamas“.
   */
  picture: string;
}

/** One chapter of the story. */
export interface ChildminderChapter extends StoryChapter {
  /** The step of settling in it tells. */
  step: SettlingStep;
  pages: ChildminderPage[];
}

export const CHILDMINDER_STORY: ChildminderChapter[] = [
  {
    id: "bald",
    title: "Soon Tapsi Goes to Lotta's",
    step: "vorbereiten",
    pages: [
      {
        id: "erzaehlen",
        text: "Mama and Papa say: “Soon you go to Lotta's. She looks after a few children in her home.”",
        place: "wohnzimmer",
        light: "abend",
        cast: ["tapsi", "mama", "papa"],
        picture:
          "Tapsi sits on the round rug right where the reference has Tapsi, and looks up with big curious eyes; Mama and Papa sit side by side on the green sofa, lean forward and tell Tapsi something, warm and calm.",
      },
      {
        id: "besuch",
        text: "Papa and Tapsi visit Lotta. She opens her front door: “Hello, Tapsi! Come in.”",
        place: "flur",
        light: "tag",
        cast: ["tapsi", "papa", "lotta"],
        picture:
          "Papa and Tapsi stand hand in hand just inside the open front door, on the doormat; Lotta kneels in front of Tapsi with a warm smile and waves hello, and Tapsi looks at her shyly and curiously, holding on to Papa's hand.",
      },
      {
        id: "packen",
        text: "Together they pack the backpack: slippers, spare clothes and Bunny.",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi and Mama kneel on the round rug in front of the bed and pack Tapsi's backpack: Mama holds up small red slippers, and Tapsi pushes the plush bunny into the backpack so its ears stick out. Tapsi looks happy and eager, smiling with relaxed, raised brows – not frowning. The bed is empty.",
      },
    ],
  },
  {
    id: "dabei",
    title: "Mama Stays Close",
    step: "dabeibleiben",
    pages: [
      {
        id: "ankommen",
        text: "On the first day Mama comes too. Tapsi's hook has a red ladybug on it.",
        place: "flur",
        light: "morgen",
        cast: ["tapsi", "mama", "lotta"],
        picture:
          "Tapsi stands on tiptoes in front of the coat hooks and hangs the yellow rain jacket on the hook with the ladybug sign above it, proud; Mama in her coat stands behind Tapsi and smiles, and Lotta stands in the doorway to the living room and smiles too. The backpack lies on the little bench, and every other hook is empty.",
      },
      {
        id: "sofa",
        text: "Mama sits on Lotta's sofa. Tapsi sits on her lap and watches the other children.",
        place: "spielzimmer",
        light: "morgen",
        cast: ["tapsi", "mama", "lotta", "emil", "kinder"],
        picture:
          "Mama sits on the soft blue sofa with Tapsi on her lap, and Tapsi watches the others, a little unsure; on the play rug Emil pushes a wooden train along its track, the baby sits beside him with a block, the bigger girl looks at a picture book, and Lotta sits on the floor with them and smiles over at Tapsi.",
      },
      {
        id: "zug",
        text: "Then Tapsi climbs down and plays trains with Emil. Now and then Tapsi looks at Mama.",
        place: "spielzimmer",
        light: "morgen",
        cast: ["tapsi", "mama", "emil"],
        picture:
          "Tapsi kneels on the play rug beside Emil and pushes a wooden train engine along the track, turning the head to look back at Mama; Mama sits on the blue sofa and smiles at Tapsi, her lap empty.",
      },
      {
        id: "heim",
        text: "After playing, Mama and Tapsi go home together. Tomorrow they come again.",
        place: "strasse",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture:
          "Mama and Tapsi walk hand in hand along the pavement away from the apartment house, turned three-quarters towards the viewer so their faces are seen, Tapsi skipping a little and looking up at Mama, both content.",
      },
    ],
  },
  {
    id: "kurz",
    title: "Just for a Moment",
    step: "erste-trennung",
    pages: [
      {
        id: "sagen",
        text: "A few days later Mama says: “I'm going out for a moment. Then I come back.”",
        place: "spielzimmer",
        light: "morgen",
        cast: ["tapsi", "mama", "lotta"],
        picture:
          "Mama kneels on the play rug in front of Tapsi, holds both of Tapsi's paws and tells Tapsi calmly and kindly that she goes out for a moment; Tapsi listens with big eyes; Lotta sits on the floor close by, calm. The sofa is empty.",
      },
      {
        id: "weinen",
        text: "Tapsi cries. That's okay. Lotta takes Tapsi in her arms and comforts.",
        place: "spielzimmer",
        light: "morgen",
        cast: ["tapsi", "lotta"],
        picture:
          "Lotta sits on the play rug and holds Tapsi close in her arms; Tapsi cries with tears on the cheeks and leans against her, and Lotta strokes Tapsi's back gently. The sofa is empty.",
      },
      {
        id: "wieder",
        text: "There's Mama again! Just as she said.",
        place: "spielzimmer",
        light: "morgen",
        cast: ["tapsi", "mama", "lotta"],
        picture:
          "Mama has just come back into the room and kneels with open arms, and Tapsi runs into them, beaming; Lotta sits on the play rug and smiles at them both.",
      },
    ],
  },
  {
    id: "lotta",
    title: "Lotta Is There",
    step: "bezugsperson",
    pages: [
      {
        id: "essen",
        text: "Snack at the big kitchen table: apple for everyone. Lotta helps Tapsi now, and Mama watches.",
        place: "kueche",
        light: "morgen",
        cast: ["tapsi", "mama", "lotta", "emil", "kinder"],
        picture:
          "Tapsi, Emil and the bigger girl sit on small chairs at the long kitchen table with apple slices on colourful plates, and the baby sits in the high chair; Lotta sits beside Tapsi and hands Tapsi a slice of apple; Mama sits at the far end of the table and watches, smiling.",
      },
      {
        id: "traurig",
        text: "When Mama has gone, Tapsi is sometimes sad. Lotta stays close until it's better.",
        place: "spielzimmer",
        light: "tag",
        cast: ["tapsi", "lotta"],
        picture:
          "Tapsi sits on the play rug, a little sad, holding the plush bunny; Lotta sits on the rug beside Tapsi with an arm around Tapsi and shows Tapsi a picture book, gently. The sofa is empty.",
      },
      {
        id: "zuhause",
        text: "And Mama? Mama is at home, watering the plants. She thinks of Tapsi.",
        place: "wohnzimmer",
        light: "tag",
        cast: ["mama"],
        picture:
          "Mama stands by the living room window with a small green watering can and waters a plant, smiling softly as she thinks of Tapsi. The rug and the sofa are empty: no Tapsi, no blocks, nobody else.",
      },
      {
        id: "laenger",
        text: "Each day Mama stays away a little longer. Tapsi and Emil build a tall tower.",
        place: "spielzimmer",
        light: "tag",
        cast: ["tapsi", "lotta", "emil"],
        picture:
          "Tapsi and Emil kneel on the play rug and build a tall tower of wooden blocks together, laughing; Lotta sits on the floor beside them and holds out one more block.",
      },
    ],
  },
  {
    id: "morgen",
    title: "Every Morning the Same Goodbye",
    step: "ritual",
    pages: [
      {
        id: "weg",
        text: "Every morning Mama and Tapsi walk the same way to Lotta's door.",
        place: "strasse",
        light: "morgen",
        cast: ["tapsi", "mama"],
        picture:
          "Mama in her coat and Tapsi in a jacket with the backpack walk hand in hand along the pavement towards the green front door of the apartment house, turned three-quarters towards the viewer so their faces are seen, calm and cheerful in the fresh morning.",
      },
      {
        id: "haken",
        text: "In the hall: jacket on the ladybug hook, slippers on.",
        place: "flur",
        light: "morgen",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi sits on the little bench and pulls on small red slippers; the yellow rain jacket already hangs on the hook with the ladybug sign; Mama in her coat kneels beside Tapsi and helps with a slipper. Every other hook is empty.",
      },
      {
        id: "kuss",
        text: "One big squeeze and a kiss on the nose.",
        place: "flur",
        light: "morgen",
        cast: ["tapsi", "mama"],
        picture: "Mama in her coat kneels and hugs Tapsi tightly and gives Tapsi a kiss on the nose; Tapsi squeezes the eyes shut and smiles.",
      },
      {
        id: "wann",
        text: "Mama says: “I'll pick you up after your nap.”",
        place: "flur",
        light: "morgen",
        cast: ["tapsi", "mama", "lotta"],
        picture:
          "Mama in her coat kneels in front of Tapsi, one paw on Tapsi's shoulder, and tells Tapsi when she comes back, calm and sure; Tapsi listens and nods; Lotta stands in the doorway to the living room and waits, kind.",
      },
      {
        id: "hand",
        text: "Lotta takes Tapsi's hand. Mama says bye and goes – she never sneaks away.",
        place: "flur",
        light: "morgen",
        cast: ["tapsi", "mama", "lotta"],
        picture:
          "Lotta holds Tapsi's hand; Mama in her coat stands in the open front door, turned back to them, and waves goodbye; Tapsi waves back, a little brave, a little sad.",
      },
      {
        id: "winken",
        text: "At the kitchen window Tapsi and Lotta wave. Mama waves back. Bye, Mama!",
        place: "kueche",
        light: "morgen",
        cast: ["tapsi", "mama", "lotta"],
        picture:
          "Seen from inside the kitchen: Lotta holds Tapsi up on her arm at the big kitchen window, and both wave with big smiles; outside, seen small through the glass, Mama in her coat stands on the pavement and waves back. The kitchen table is empty.",
      },
    ],
  },
  {
    id: "tag",
    title: "A Day at Lotta's",
    step: "tagesablauf",
    pages: [
      {
        id: "wagen",
        text: "Off to the playground! The baby rides in the red handcart, the others walk with Lotta.",
        place: "spielplatz",
        light: "tag",
        cast: ["tapsi", "lotta", "emil", "kinder"],
        picture:
          "Lotta pulls the red handcart along the path to the playground, the baby sitting in it with a sun hat; Tapsi and Emil walk beside the handcart holding on to its edge, and the bigger girl holds Lotta's other hand; everyone looks cheerful.",
      },
      {
        id: "sand",
        text: "Tapsi and Emil dig in the sand. Lotta sits right beside them and laughs.",
        place: "spielplatz",
        light: "tag",
        cast: ["tapsi", "lotta", "emil"],
        picture:
          "Tapsi and Emil sit in the sandpit and dig with a small shovel and a bucket, laughing; Lotta sits on the sandpit's wooden edge right beside them and laughs too. The red handcart stands empty on the path.",
      },
      {
        id: "mittag",
        text: "Back at Lotta's, lunch is noodles. Everyone eats together at the big kitchen table.",
        place: "kueche",
        light: "mittag",
        cast: ["tapsi", "lotta", "emil", "kinder"],
        picture:
          "Tapsi, Emil and the bigger girl sit on small chairs at the long kitchen table and eat noodles from colourful plates, and the baby in the high chair has a few noodles in its paws; Lotta sits at the table with them and laughs; nobody stands at the window.",
      },
      {
        id: "schlafen",
        text: "Then it's nap time in a little bed at Lotta's. Tapsi cuddles Bunny.",
        place: "schlafzimmer",
        light: "mittag",
        cast: ["tapsi", "lotta"],
        picture:
          "Tapsi lies in the nearest little bed under a soft blanket, eyes closed, cuddling the plush bunny; Lotta sits on the small chair beside the bed and gently tucks the blanket in. The other beds are empty and smooth.",
      },
    ],
  },
  {
    id: "abholen",
    title: "Mama Comes Back",
    step: "abholen",
    pages: [
      {
        id: "aufwachen",
        text: "Tapsi wakes up. The nap is over. What comes now?",
        place: "schlafzimmer",
        light: "mittag",
        cast: ["tapsi", "lotta"],
        picture:
          "Tapsi sits up in the little bed, stretches with both arms up and yawns, the plush bunny in the lap; Lotta sits on the small chair beside the bed and opens one curtain a little, smiling, so a little daylight comes in.",
      },
      {
        id: "da",
        text: "There's Mama! Right after the nap, just as she said.",
        place: "flur",
        light: "tag",
        cast: ["tapsi", "mama", "lotta"],
        picture:
          "Mama in her coat kneels just inside the open front door with open arms, and Tapsi runs into them, beaming; Lotta stands in the doorway to the living room and smiles.",
      },
      {
        id: "erzaehlt",
        text: "On the way home Tapsi tells about the handcart, the sand and Emil.",
        place: "strasse",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture:
          "Mama and Tapsi walk hand in hand along the pavement away from the apartment house, turned three-quarters towards the viewer; Tapsi waves the free paw about and tells eagerly, and Mama listens with a big smile.",
      },
      {
        id: "lieb",
        text: "Mama and Papa always come back. And they love Tapsi – at home and at Lotta's.",
        place: "wohnzimmer",
        light: "abend",
        cast: ["tapsi", "mama", "papa"],
        picture: "Mama and Papa sit on the green sofa and hold Tapsi between them in a big cuddle; Tapsi laughs, safe and happy. The rug is empty.",
      },
    ],
  },
];

/** Every page of the story in reading order. */
export const CHILDMINDER_PAGES: ChildminderPage[] = CHILDMINDER_STORY.flatMap((c) => c.pages);

/** The steps the story tells, in the guides' order: all of „Tapsi geht in die Kita“'s. */
export const CHILDMINDER_STEPS: SettlingStep[] = SETTLING_STEPS.map((s) => s.id);

/**
 * The short version's pages, under half of the story and read in a few minutes from the story's own pages, so it needs
 * no picture, translation or recording of its own: being told, the first day with Mama on Lotta's sofa, the first short
 * goodbye with its tears and Lotta's comfort and Mama coming back, the snack at the kitchen table, the morning's
 * squeeze, Mama's promise and the waving at the kitchen window, the nap, Mama there just after it, and the love.
 */
export const CHILDMINDER_SHORT_PAGES = [
  "erzaehlen",
  "ankommen",
  "sofa",
  "sagen",
  "weinen",
  "wieder",
  "essen",
  "kuss",
  "wann",
  "winken",
  "schlafen",
  "da",
  "lieb",
] as const;

/** The short version, chapter by chapter. */
export const CHILDMINDER_STORY_SHORT = shortOf(CHILDMINDER_STORY, CHILDMINDER_SHORT_PAGES);
