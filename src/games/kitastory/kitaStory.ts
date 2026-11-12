import type { StoryChapter } from "@/components/ChapterBook";

// „Tapsi geht in die Kita“ (idea H-10, user request, 11 November 2026: „im gleichen Stil wie Abstillen“): told in
// chapters that follow the steps of settling a small child into a Kita gently (`SETTLING_STEPS`, research
// „kita-eingewoehnung“, after the Berliner Eingewöhnungsmodell) – tell the child first, a parent stays in the Kita as a
// safe harbour, the first short goodbye with a clear return, the teacher becomes the one who comforts, the same short
// goodbye ritual every morning, the day in the Kita, and the parent comes back as promised. Its motifs: Tapsi's plush
// bunny that comes along, the yellow star on Tapsi's hook, the waving window, and Mama's promise told by the day's
// order – „nach dem Mittagsschlaf“ – never by the clock.
//
// German only (translations come when the user asks). Played at `/kita/`, the book „Kita-Start“ among the Alltagshelfer
// (`ChapterBook`); its pictures come from Gemini (`kitaStoryPictures.ts`).

/** A step of settling into a Kita gently, as the guides give it; each has a chapter of its own. */
export type SettlingStep = "vorbereiten" | "dabeibleiben" | "erste-trennung" | "bezugsperson" | "ritual" | "tagesablauf" | "abholen";

/** The steps in the order the guides give them (research „kita-eingewoehnung“), for the grown-up. */
export const SETTLING_STEPS: { id: SettlingStep; title: string; what: string }[] = [
  { id: "vorbereiten", title: "Vorher erzählen", what: "Dem Kind in seinen Worten sagen, was kommt; die Kita von außen anschauen, zusammen packen." },
  {
    id: "dabeibleiben",
    title: "Ein Elternteil bleibt dabei",
    what: "Die ersten Tage bleibt Mama oder Papa im Raum, als sicherer Hafen, und geht mit dem Kind wieder heim.",
  },
  {
    id: "erste-trennung",
    title: "Der erste kurze Abschied",
    what: "Sagen, dass man kurz geht und wiederkommt, nie heimlich; nur ein paar Minuten vor der Tür, im Haus.",
  },
  {
    id: "bezugsperson",
    title: "Die Erzieherin tröstet",
    what: "Die Erzieherin übernimmt Essen, Wickeln und Trösten, erst neben Mama; die Trennungen werden länger.",
  },
  {
    id: "ritual",
    title: "Jeden Morgen dasselbe Tschüss",
    what: "Ein kurzes, immer gleiches Ritual: Kuss, Kuscheltier, Winken – und sagen, wann man wiederkommt.",
  },
  { id: "tagesablauf", title: "Der Tag in der Kita", what: "Ein fester Ablauf, den das Kind kennt: spielen, singen, essen, draußen sein, schlafen." },
  { id: "abholen", title: "Wiederkommen wie gesagt", what: "Dann kommen, wann man es gesagt hat, sich freuen, und das Kind erzählen lassen." },
];

/** Where a page plays: every place keeps its look from its reference picture on (`kitaStoryPictures.ts`). */
export type Place = "wohnzimmer" | "kinderzimmer" | "weg" | "kita" | "garderobe" | "gruppenraum" | "garten";

/**
 * Who is in a page's picture: Tapsi, Mama and Papa Fuchs, Mia the Kita teacher, Bruno, two more children of the group
 * („kinder“) and, where the whole group plays, four more („gruppe“).
 */
export type Cast = "tapsi" | "mama" | "papa" | "mia" | "bruno" | "kinder" | "gruppe";

/** The light of a page. */
export type Light = "morgen" | "tag" | "mittag" | "abend";

/** One page: a picture and what the grown-up reads under it. */
export interface KitaPage {
  /** Unique in the story, also the picture's file name (`bilder/kita-<id>.webp`). */
  id: string;
  /** What is read aloud, German, present tense, short (checked in `kitastory.test.ts`). */
  text: string;
  place: Place;
  light: Light;
  /** Everyone in the picture, each once („kinder“ are two, „gruppe“ four). */
  cast: Cast[];
  /** What happens in the picture, in English, for its Gemini prompt (`kitaStoryPictures.ts` adds place, cast and light). */
  picture: string;
}

/** One chapter: read on its own on the day it fits (the morning's ritual every morning), or the whole story at once. */
export interface KitaChapter extends StoryChapter {
  /** The step of settling in it tells, if any. */
  step?: SettlingStep;
  pages: KitaPage[];
}

export const KITA_STORY: KitaChapter[] = [
  {
    id: "bald",
    title: "Bald geht Tapsi in die Kita",
    step: "vorbereiten",
    pages: [
      {
        id: "erzaehlen",
        text: "Mama und Papa erzählen: „Bald gehst du in die Kita. Da spielen viele Kinder.“",
        place: "wohnzimmer",
        light: "abend",
        cast: ["tapsi", "mama", "papa"],
        picture: "Mama and Papa sit on the green sofa with Tapsi between them and tell Tapsi something, warm and calm; Tapsi listens with big curious eyes.",
      },
      {
        id: "anschauen",
        text: "Papa und Tapsi schauen sich die Kita von außen an. Am Fenster hängen bunte Bilder.",
        place: "kita",
        light: "tag",
        cast: ["tapsi", "papa"],
        picture:
          "Papa and Tapsi stand hand in hand on the pavement at the left in front of the low fence, turned three-quarters towards the house so their faces are seen, and look at the daycare house; Tapsi points with the free paw at the paintings in the big window, curious.",
      },
      {
        id: "packen",
        text: "Zusammen packen sie den Rucksack: Hausschuhe, Wechselsachen und den Kuschelhasen.",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi and Mama kneel on the round rug in front of the bed and pack Tapsi's backpack: Mama holds up small red slippers, and Tapsi pushes the plush bunny into the backpack so its ears stick out. Tapsi looks happy and eager, smiling with relaxed, raised brows – not frowning.",
      },
    ],
  },
  {
    id: "dabei",
    title: "Mama bleibt dabei",
    step: "dabeibleiben",
    pages: [
      {
        id: "ankommen",
        text: "Am ersten Tag kommt Mama mit. Mia wartet schon: „Hallo Tapsi, ich bin Mia.“",
        place: "garderobe",
        light: "morgen",
        cast: ["tapsi", "mama", "mia"],
        picture:
          "Mama in her coat and Tapsi in a jacket with the backpack have just come in through the front door; Mia kneels in front of Tapsi with a warm smile and waves hello, and Tapsi half hides behind Mama's leg and peeks out.",
      },
      {
        id: "haken",
        text: "Tapsi hat einen eigenen Haken. Darüber klebt ein gelber Stern.",
        place: "garderobe",
        light: "morgen",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi stands on tiptoes in front of the cubbies and hangs the yellow rain jacket on the hook with the star sign above it, proud; Mama, in her coat, sits on the bench and smiles. The backpack lies on the bench beside Mama, and every other hook is empty.",
      },
      {
        id: "stuhl",
        text: "Mama setzt sich auf einen kleinen Stuhl. Tapsi sitzt auf ihrem Schoß und schaut.",
        place: "gruppenraum",
        light: "morgen",
        cast: ["tapsi", "mama", "mia", "bruno"],
        picture:
          "Mama sits on the small wooden chair at the back wall with Tapsi on her lap, Tapsi holding the plush bunny and watching; on the play rug Mia and Bruno build a tower of wooden blocks and Bruno looks over at Tapsi.",
      },
      {
        id: "entdecken",
        text: "Dann klettert Tapsi runter und spielt. Ab und zu schaut Tapsi zu Mama. Mama ist da.",
        place: "gruppenraum",
        light: "morgen",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi kneels on the play rug a few steps away and pushes the toy truck, looking back over the shoulder at Mama; Mama sits on the small wooden chair at the back wall and nods and smiles.",
      },
      {
        id: "ball",
        text: "Mia rollt Tapsi einen Ball zu. Tapsi rollt ihn zurück.",
        place: "gruppenraum",
        light: "morgen",
        cast: ["tapsi", "mama", "mia"],
        picture:
          "Mia sits on the play rug with her legs apart and rolls a red ball over to Tapsi, who sits facing her and reaches for it, a first small smile; Mama sits on the small wooden chair at the back wall and watches.",
      },
      {
        id: "heim",
        text: "Nach dem Spielen gehen Mama und Tapsi zusammen nach Hause. Morgen kommen sie wieder.",
        place: "weg",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture: "Mama in her coat and Tapsi in a jacket with the backpack walk hand in hand along the path, Tapsi hopping and chatting, Mama laughing.",
      },
    ],
  },
  {
    id: "kurz",
    title: "Mama geht kurz raus",
    step: "erste-trennung",
    pages: [
      {
        id: "sagen",
        text: "Ein paar Tage später sagt Mama: „Ich gehe kurz raus. Dann komme ich wieder.“",
        place: "gruppenraum",
        light: "morgen",
        cast: ["tapsi", "mama", "mia"],
        picture:
          "Mama kneels on the play rug in front of Tapsi and holds Tapsi's paws, looking into Tapsi's eyes, calm and clear; Mia sits close beside them on the rug.",
      },
      {
        id: "weinen",
        text: "Tapsi weint. Das darf Tapsi. Mia nimmt Tapsi in den Arm und tröstet.",
        place: "gruppenraum",
        light: "morgen",
        cast: ["tapsi", "mia"],
        picture:
          "Mia sits on the play rug and holds the crying Tapsi in her arms, Tapsi clutching the plush bunny, tears on the cheeks; Mia strokes Tapsi's back gently.",
      },
      {
        id: "wieder",
        text: "Da ist Mama wieder! Genau wie sie gesagt hat.",
        place: "gruppenraum",
        light: "morgen",
        cast: ["tapsi", "mama", "mia"],
        picture:
          "Mama comes back in through the open doorway with open arms and kneels, and Tapsi runs to her with a happy face; Mia stands up from the play rug and smiles.",
      },
    ],
  },
  {
    id: "mia",
    title: "Mia ist für Tapsi da",
    step: "bezugsperson",
    pages: [
      {
        id: "essen",
        text: "Beim Frühstück hilft jetzt Mia. Mama sitzt noch auf ihrem Stuhl und schaut zu.",
        place: "gruppenraum",
        light: "morgen",
        cast: ["tapsi", "mama", "mia", "bruno"],
        picture:
          "Tapsi, Bruno and Mia sit at the low round table with small plates of bread and cut apple; Mia sits beside Tapsi and helps spread butter on Tapsi's bread, Bruno munches; Mama sits alone on the small wooden chair at the back wall, her lap empty, and watches with a calm smile: Tapsi sits only at the table.",
      },
      {
        id: "pusten",
        text: "Draußen fällt Tapsi hin. Mia pustet und tröstet, und es geht wieder.",
        place: "garten",
        light: "tag",
        cast: ["tapsi", "mia"],
        picture: "Tapsi sits on the lawn after a fall, a small tear on the cheek; Mia kneels beside Tapsi, holds Tapsi close and gently blows on Tapsi's knee.",
      },
      {
        id: "traurig",
        text: "Wenn Mama gegangen ist, ist Tapsi manchmal traurig. Mia bleibt da, bis es wieder geht.",
        place: "gruppenraum",
        light: "morgen",
        cast: ["tapsi", "mia"],
        picture:
          "Mia sits cross-legged on the play rug with Tapsi on her lap, Tapsi leans against her with a sad face and holds the plush bunny; Mia holds Tapsi gently. The small wooden chair at the back wall is empty.",
      },
      {
        id: "zuhause",
        text: "Und Mama? Mama ist zu Hause und saugt Staub. Sie denkt an Tapsi.",
        place: "wohnzimmer",
        light: "morgen",
        cast: ["mama"],
        picture:
          "Mama vacuums the rug in front of the green sofa with an upright vacuum cleaner and smiles softly to herself, thinking of Tapsi. Tapsi is not at home: the rug is empty, no blocks on it, no fox child anywhere.",
      },
      {
        id: "laenger",
        text: "Jeden Tag bleibt Mama ein bisschen länger weg. Tapsi spielt jetzt mit Bruno.",
        place: "garten",
        light: "tag",
        cast: ["tapsi", "bruno"],
        picture: "Tapsi and Bruno sit in the sandpit and fill a red bucket together with small shovels, both laughing.",
      },
      {
        id: "toben",
        text: "Im Garten spielen viele Kinder. Sie rutschen, rennen und buddeln. Tapsi lacht mit.",
        place: "garten",
        light: "tag",
        cast: ["tapsi", "bruno", "kinder", "gruppe", "mia"],
        picture:
          "The whole group plays in the garden and has fun, all laughing: Tapsi comes down the small slide with both arms up, Bruno waits at the slide's foot and cheers; the bear girl in the green dress and the bear boy in the orange T-shirt chase each other across the lawn; two of the other bear children dig in the sandpit and two kick a big red ball on the lawn; Mia stands on the lawn by the sandpit and laughs.",
      },
    ],
  },
  {
    id: "morgen",
    title: "Jeden Morgen gleich",
    step: "ritual",
    pages: [
      {
        id: "weg",
        text: "Jeden Morgen gehen Mama und Tapsi denselben Weg zur Kita.",
        place: "weg",
        light: "morgen",
        cast: ["tapsi", "mama"],
        picture:
          "Mama in her coat and Tapsi in a jacket with the backpack walk hand in hand along the path in the morning, Tapsi carrying the plush bunny under one arm.",
      },
      {
        id: "schuhe",
        text: "In der Garderobe: Jacke an den Sternhaken, Hausschuhe an.",
        place: "garderobe",
        light: "morgen",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi sits on the bench and Mama, in her coat, kneels in front of Tapsi and helps put on small red slippers; Tapsi's yellow rain jacket already hangs on the hook with the star sign above it, and the backpack hangs beside it.",
      },
      {
        id: "kuss",
        text: "Einmal ganz fest drücken und ein Kuss auf die Nase.",
        place: "garderobe",
        light: "morgen",
        cast: ["tapsi", "mama"],
        picture: "Mama, in her coat, kneels and hugs Tapsi tight, giving Tapsi a kiss on the nose; Tapsi holds the plush bunny and closes the eyes happily.",
      },
      {
        id: "wann",
        text: "Mama sagt: „Ich hole dich nach dem Mittagsschlaf ab.“",
        place: "garderobe",
        light: "morgen",
        cast: ["tapsi", "mama", "mia"],
        picture:
          "Mama, in her coat, kneels in front of Tapsi and holds up one paw as she tells Tapsi something clearly and kindly; Mia has come from the doorway and stands beside Tapsi, ready to take Tapsi's paw.",
      },
      {
        id: "hand",
        text: "Mia nimmt Tapsis Hand. Mama sagt Tschüss und geht – sie schleicht sich nie weg.",
        place: "garderobe",
        light: "morgen",
        cast: ["tapsi", "mama", "mia"],
        picture:
          "Mia holds Tapsi's paw near the doorway to the play room, Tapsi holds the plush bunny with the other paw; Mama, in her coat, stands at the front door with one paw on the handle and waves goodbye openly.",
      },
      {
        id: "winken",
        text: "Am Winkefenster winken Tapsi und Mia. Mama winkt zurück. Tschüss, Mama!",
        place: "gruppenraum",
        light: "morgen",
        cast: ["tapsi", "mama", "mia"],
        picture:
          "Inside the play room at the big window on the left: Tapsi stands on a small wooden step at the window and waves out with both paws, and Mia kneels beside Tapsi, one arm round Tapsi, waving too; outside, beyond the glass on the pavement across the street, Mama in her coat waves back and blows a kiss, small and seen through the window. The small chair, the table and the rug are empty.",
      },
    ],
  },
  {
    id: "tag",
    title: "Tapsis Tag in der Kita",
    step: "tagesablauf",
    pages: [
      {
        id: "kreis",
        text: "Im Morgenkreis singen alle Kinder ein Lied. Tapsi klatscht mit.",
        place: "gruppenraum",
        light: "morgen",
        cast: ["tapsi", "mia", "bruno", "kinder"],
        picture: "Mia and the children sit in a circle on the play rug and sing; Tapsi claps along, Bruno sings with his mouth wide open.",
      },
      {
        id: "spielen",
        text: "Tapsi und Bruno bauen einen hohen Turm.",
        place: "gruppenraum",
        light: "tag",
        cast: ["tapsi", "bruno"],
        picture:
          "Tapsi and Bruno kneel on the play rug and build a tall tower of wooden blocks; Tapsi sets the last block on top, both look up at it, delighted.",
      },
      {
        id: "draussen",
        text: "Draußen buddeln sie im Sand. Mia sitzt am Rand und lacht.",
        place: "garten",
        light: "tag",
        cast: ["tapsi", "bruno", "mia"],
        picture: "Tapsi and Bruno dig in the sandpit with small shovels, building a sandcastle; Mia sits on the wooden edge of the sandpit and laughs.",
      },
      {
        id: "mittag",
        text: "Zum Mittagessen gibt es Nudeln. Alle essen zusammen am Tisch.",
        place: "gruppenraum",
        light: "tag",
        cast: ["tapsi", "mia", "bruno", "kinder"],
        picture:
          "Tapsi, Bruno and the other children sit at the low round table and eat noodles from small bowls; Mia sits with them. Tapsi has a noodle hanging from the mouth and grins.",
      },
      {
        id: "schlafen",
        text: "Nach dem Essen ist Mittagsschlaf. Tapsi kuschelt sich an den Hasen.",
        place: "gruppenraum",
        light: "mittag",
        cast: ["tapsi", "bruno", "mia"],
        picture:
          "The table is pushed aside and small mattresses with blankets lie on the floor; Tapsi sleeps on one with the cheek on the plush bunny, Bruno sleeps on the next; Mia sits quietly on the small wooden chair at the back wall, her paws resting empty in her lap: the only plush bunny is under Tapsi's cheek.",
      },
    ],
  },
  {
    id: "abholen",
    title: "Mama kommt wieder",
    step: "abholen",
    pages: [
      {
        id: "aufwachen",
        text: "Tapsi wacht auf. Jetzt ist der Mittagsschlaf vorbei. Was kommt jetzt?",
        place: "gruppenraum",
        light: "tag",
        cast: ["tapsi", "mia"],
        picture:
          "Tapsi sits up on a small mattress on the floor, rubbing the eyes, the plush bunny in one arm, and looks over to the open doorway; Mia kneels beside Tapsi and smiles.",
      },
      {
        id: "da",
        text: "Da ist Mama! Genau nach dem Mittagsschlaf, wie sie gesagt hat.",
        place: "garderobe",
        light: "tag",
        cast: ["tapsi", "mama", "mia"],
        picture:
          "Mama, in her coat, kneels just inside the front door with open arms, and Tapsi runs into them, beaming, holding the plush bunny tight in one paw; Mia stands in the doorway to the play room and waves.",
      },
      {
        id: "erzaehlt",
        text: "Auf dem Heimweg erzählt Tapsi: vom Turm, vom Sand und von Bruno.",
        place: "weg",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture:
          "Mama in her coat and Tapsi in a jacket with the backpack walk home hand in hand along the path; Tapsi tells with big gestures, Mama listens and laughs.",
      },
    ],
  },
  {
    id: "immer",
    title: "Was immer bleibt",
    pages: [
      {
        id: "lieb",
        text: "Mama und Papa kommen immer wieder. Und sie haben Tapsi lieb – zu Hause und in der Kita.",
        place: "wohnzimmer",
        light: "abend",
        cast: ["tapsi", "mama", "papa"],
        picture:
          "Mama, Papa and Tapsi all three sit together on the rug in front of the sofa in a big cuddle: Tapsi, the small fox toddler, in the middle holding the plush bunny, Mama on one side and Papa on the other, both with their arms round Tapsi, all three smiling. Nobody sits on the sofa or the armchair: both are empty.",
      },
    ],
  },
];

/** Every page in reading order. */
export const KITA_PAGES: KitaPage[] = KITA_STORY.flatMap((c) => c.pages);
