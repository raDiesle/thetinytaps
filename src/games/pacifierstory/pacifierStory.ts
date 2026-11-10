import type { StoryChapter } from "@/components/ChapterBook";

// „Tapsi und die Schnullerfee“ (user request, 10 November 2026: a story about the pacifier fairy in the style of the
// book „Abstillen“): told in chapters that follow the steps guides give for saying goodbye to the pacifier gently
// (`PACIFIER_STEPS`, research „schnullerfee-kapitel“) – tell the child first, keep the pacifier for falling asleep only,
// pick the day together, let the child gather and give the pacifiers away itself, stay close in the first night, the
// swap for a present, and stay with it while the child misses the pacifier. Its motifs: Tapsi's three pacifiers (red,
// blue, yellow), three paper stars in the window counting the nights to the fairy, and a box with the pacifiers on the
// windowsill that the fairy swaps for a cuddly bunny.
//
// German here; other languages only once the user asks for them. Played at `/schnullerfee/`, the book „Schnullerfee“
// among the Alltagshelfer (`ChapterBook`); its pictures come from Gemini (`pacifierStoryPictures.ts`).

/** A step of saying goodbye to the pacifier gently, as the guides give it; each has a chapter of its own. */
export type PacifierStep = "vorbereiten" | "weniger" | "festlegen" | "abgeben" | "erste-nacht" | "tausch" | "dabeibleiben";

/** The steps in the order the guides give them (research „schnullerfee-kapitel“), for the grown-up. */
export const PACIFIER_STEPS: { id: PacifierStep; title: string; what: string }[] = [
  { id: "vorbereiten", title: "Vorher erzählen", what: "Dem Kind in seinen Worten sagen, was kommt und warum – Tage vorher, ohne Druck." },
  { id: "weniger", title: "Erst nur noch zum Einschlafen", what: "Am Tag bleibt der Schnuller im Bett; trösten, spielen und erzählen gehen ohne ihn." },
  { id: "festlegen", title: "Den Tag zusammen aussuchen", what: "Das Kind sagt mit, wann; bis dahin zählen alle die Nächte und freuen sich." },
  { id: "abgeben", title: "Selbst einsammeln und abgeben", what: "Das Kind sucht alle Schnuller zusammen und gibt sie selbst ab, mit Abschied." },
  { id: "erste-nacht", title: "Die erste Nacht begleiten", what: "Trösten, ein Lied, ein Kuscheltier im Arm – ein Erwachsener bleibt da." },
  { id: "tausch", title: "Der Tausch", what: "Am Morgen liegt ein kleines Geschenk da, gern eines, das beim Einschlafen hilft." },
  { id: "dabeibleiben", title: "Dabei bleiben", what: "Kein Schnuller kommt zurück; Vermissen und Traurigsein dürfen sein, Nähe hilft." },
];

/** Where a page plays: every place keeps its look from its reference picture on (`pacifierStoryPictures.ts`). */
export type Place = "kinderzimmer" | "wohnzimmer" | "garten" | "himmel";

/** Who is in a page's picture: baby Tapsi, Tapsi big, Mama and Papa Fuchs, and the pacifier fairy (a little bear). */
export type Cast = "baby" | "tapsi" | "mama" | "papa" | "fee";

/** The light of a page. */
export type Light = "tag" | "abend" | "nacht" | "morgen";

/** One page: a picture and what the grown-up reads under it. */
export interface FairyPage {
  /** Unique in the story, also the picture's file name (`bilder/fee-<id>.webp`). */
  id: string;
  /** What is read aloud, German, present tense, short (checked in `pacifierstory.test.ts`). */
  text: string;
  place: Place;
  light: Light;
  /** Everyone in the picture, each once. */
  cast: Cast[];
  /** What happens in the picture, in English, for its Gemini prompt (`pacifierStoryPictures.ts` adds place, cast and light). */
  picture: string;
}

/** One chapter: read on its own on the evening it fits, or the whole story at once. */
export interface FairyChapter extends StoryChapter {
  /** The step of a gentle goodbye it tells, if any. */
  step?: PacifierStep;
  pages: FairyPage[];
}

export const PACIFIER_STORY: FairyChapter[] = [
  {
    id: "schnuller",
    title: "Tapsis Schnuller",
    pages: [
      {
        id: "baby",
        text: "Schau, das ist Tapsi als Baby. Der Schnuller tröstet Tapsi und hilft beim Einschlafen.",
        place: "wohnzimmer",
        light: "tag",
        cast: ["baby", "mama"],
        picture:
          "Mama sits in the big mustard-yellow armchair and holds baby Tapsi in her arms; baby Tapsi sucks a red pacifier, eyes half closed, sleepy and content.",
      },
      {
        id: "drei",
        text: "Tapsi hat drei Schnuller: einen roten, einen blauen und einen gelben.",
        place: "kinderzimmer",
        light: "tag",
        cast: ["tapsi"],
        picture:
          "Tapsi sits on the bed and proudly holds up three pacifiers in both paws to show them: a red one, a blue one and a yellow one. Mama and Papa are not in the room.",
      },
      {
        id: "gross",
        text: "Jetzt ist Tapsi groß, rennt und klettert. Und der Schnuller ist immer dabei.",
        place: "garten",
        light: "tag",
        cast: ["tapsi", "papa"],
        picture:
          "Tapsi climbs onto the edge of the sandpit, a red pacifier in the mouth; Papa stands close beside Tapsi with open paws, ready to help, and smiles.",
      },
      {
        id: "mmm",
        text: "Mit Schnuller kann Tapsi schlecht erzählen. Mama versteht nur: „Mmm-mmm!“",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi stands on the rug with a red pacifier in the mouth, eagerly holding up a toy train and trying to tell Mama something; Mama, sitting on the green sofa, leans forward with a puzzled, friendly look, one ear turned to listen.",
      },
    ],
  },
  {
    id: "erzaehlen",
    title: "Mama und Papa erzählen etwas",
    step: "vorbereiten",
    pages: [
      {
        id: "sofa",
        text: "Mama und Papa setzen sich zu Tapsi aufs Sofa. „Wir erzählen dir etwas.“",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "mama", "papa"],
        picture: "Mama and Papa sit on the green sofa with Tapsi between them, a red pacifier in Tapsi's mouth; both parents turn to Tapsi, warm and calm.",
      },
      {
        id: "zaehne",
        text: "„Der Schnuller drückt auf deine Zähne. Ohne ihn wachsen sie schön gerade.“",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "papa"],
        picture:
          "Papa sits on the green sofa and holds up a small round hand mirror; Tapsi stands on the sofa beside him and looks into the mirror showing the little teeth with a big grin.",
      },
      {
        id: "fee",
        text: "„Es gibt eine Schnullerfee. Sie holt die Schnuller ab, wenn ein Kind bereit ist.“",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture:
          "Mama sits on the green sofa with Tapsi on her lap and holds an open picture book; on its page is a little fairy with wings and a star wand. Tapsi looks at it with big curious eyes.",
      },
      {
        id: "babys",
        text: "„Sie bringt die Schnuller zu den kleinen Babys. Und dir bringt sie ein Geschenk.“",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "mama", "papa"],
        picture:
          "Mama and Papa sit side by side on the green sofa, and Tapsi sits on the rug in front of them, looking up at them. Papa forms a small present shape with his paws in the air, and Tapsi's eyes are wide with wonder.",
      },
      {
        id: "meiner",
        text: "Tapsi hält den Schnuller fest. „Meiner!“ Papa sagt: „Du hast Zeit. Wir machen das zusammen.“",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "papa"],
        picture:
          "Tapsi stands on the rug and holds the red pacifier tight against the chest with both paws, looking unsure; Papa kneels on the rug in front of Tapsi and lays a gentle paw on Tapsi's shoulder, kind and patient.",
      },
    ],
  },
  {
    id: "bett",
    title: "Der Schnuller wohnt im Bett",
    step: "weniger",
    pages: [
      {
        id: "kissen",
        text: "Am Tag bleibt der Schnuller jetzt im Bett. Dort wartet er auf die Nacht.",
        place: "kinderzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture: "Tapsi lays the red pacifier on the pillow of the bed; Mama stands beside the bed and smiles.",
      },
      {
        id: "bauen",
        text: "Beim Spielen braucht Tapsi keinen Schnuller. Tapsi baut, singt und erzählt.",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "papa"],
        picture: "Tapsi and Papa sit on the rug and build a tall tower of wooden blocks; Tapsi sings with the mouth wide open, and Papa laughs.",
      },
      {
        id: "pusten",
        text: "Tapsi fällt hin. Mama tröstet mit Pusten und Kuscheln – ganz ohne Schnuller.",
        place: "garten",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi sits on the lawn after a fall, a small tear on the cheek; Mama kneels beside Tapsi, holds Tapsi close and gently blows on Tapsi's knee.",
      },
      {
        id: "einschlafen",
        text: "Nur zum Einschlafen darf der Schnuller noch in den Mund.",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi", "papa"],
        picture:
          "Tapsi lies in bed under the blanket in pyjamas, the red pacifier in the mouth, eyes getting heavy; Papa sits on the edge of the bed and strokes Tapsi's head.",
      },
    ],
  },
  {
    id: "tag",
    title: "Tapsi sucht den Tag aus",
    step: "festlegen",
    pages: [
      {
        id: "bereit",
        text: "Eines Abends sagt Tapsi: „Die Schnullerfee darf kommen.“",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi sits in bed in pyjamas and holds the red pacifier out in front, looking at it thoughtfully but decided; Mama sits on the edge of the bed, listening with a soft, proud smile.",
      },
      {
        id: "sterne",
        text: "Papa klebt drei Sterne ans Fenster. Jeden Morgen nimmt Tapsi einen ab.",
        place: "kinderzimmer",
        light: "morgen",
        cast: ["tapsi", "papa"],
        picture:
          "Papa sticks the last of three yellow paper stars onto the window pane, so exactly three yellow paper stars stick on the window in a row; Tapsi stands beside him and points at them, excited.",
      },
      {
        id: "malen",
        text: "Für die Schnullerfee malt Tapsi ein Bild.",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi lies on the rug on the tummy and draws with crayons on a sheet of paper: a colourful child's scribble of a fairy and a big heart. Mama sits on the rug beside Tapsi and watches.",
      },
    ],
  },
  {
    id: "sammeln",
    title: "Alle Schnuller einsammeln",
    step: "abgeben",
    pages: [
      {
        id: "heute",
        text: "Tapsi nimmt den letzten Stern ab. Heute Nacht kommt die Schnullerfee!",
        place: "kinderzimmer",
        light: "morgen",
        cast: ["tapsi", "papa"],
        picture:
          "Papa lifts Tapsi up at the window, and Tapsi pulls the last yellow paper star off the window pane, holding it high and beaming; no other star is on the window.",
      },
      {
        id: "rot",
        text: "Wo sind die Schnuller? Der rote liegt unter dem Kissen.",
        place: "kinderzimmer",
        light: "tag",
        cast: ["tapsi"],
        picture: "Tapsi kneels on the bed and lifts the pillow; under it lies the red pacifier, and Tapsi reaches for it with a happy face.",
      },
      {
        id: "blau",
        text: "Der blaue liegt hinter dem Sofa.",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi"],
        picture:
          "Tapsi kneels at the side of the green sofa and reaches into the gap behind it, pulling out the blue pacifier, proud. In the other paw Tapsi holds the red pacifier. Exactly two pacifiers in the whole picture, the red and the blue one – the yellow one is not found yet and not drawn.",
      },
      {
        id: "gelb",
        text: "Und der gelbe? Der steckt in Mamas Tasche!",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture:
          "Mama sits on the green sofa and holds her open handbag on her knees; Tapsi stands in front of her and pulls a yellow pacifier out of the bag, laughing, the red and the blue pacifier in the other paw.",
      },
      {
        id: "schachtel",
        text: "Alle drei kommen in eine Schachtel. Tapsi macht eine Schleife drum.",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi sits on the rug in front of the open pacifier box with the three pacifiers inside (red, blue, yellow) and holds a red ribbon ready. The box's one lid lies beside it on the rug. Mama sits on the edge of the green sofa with her paws in her lap and watches, smiling; her paws are empty.",
      },
    ],
  },
  {
    id: "abschied",
    title: "Tschüss, Schnuller",
    pages: [
      {
        id: "kuss",
        text: "Tapsi gibt jedem Schnuller noch einen Kuss. „Tschüss, Schnuller. Danke!“",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi sits on the bed in pyjamas with the open pacifier box on the lap and kisses the red pacifier; the blue and the yellow pacifier lie in the box. Mama sits beside Tapsi, one arm round Tapsi.",
      },
      {
        id: "fensterbrett",
        text: "Die Schachtel kommt aufs Fensterbrett, mit dem Bild für die Fee.",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi", "papa"],
        picture:
          "Papa holds Tapsi in pyjamas on his arm in front of the window. Tapsi has just set the closed pacifier box onto the windowsill and still touches it with both paws – it is the only box in the picture. Tapsi's drawing of a fairy and a heart leans against the window beside it.",
      },
      {
        id: "zudecken",
        text: "Mama und Papa kuscheln Tapsi ins Bett. Heute ohne Schnuller.",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi", "mama", "papa"],
        picture:
          "Tapsi lies in bed in pyjamas with the teddy; Mama tucks the blanket in and Papa bends down to kiss Tapsi's forehead. On the windowsill stands the closed pacifier box with its red ribbon and the drawing.",
      },
    ],
  },
  {
    id: "nacht",
    title: "Die erste Nacht ohne Schnuller",
    step: "erste-nacht",
    pages: [
      {
        id: "weinen",
        text: "Ohne Schnuller ist Einschlafen schwer. Tapsi weint: „Ich will meinen Schnuller!“",
        place: "kinderzimmer",
        light: "nacht",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi sits up in bed in pyjamas and cries, tears on the cheeks, reaching towards the windowsill where the closed pacifier box stands; Mama sits on the edge of the bed and opens her arms.",
      },
      {
        id: "traurig",
        text: "Mama sagt: „Das ist schwer. Du darfst traurig sein. Ich bin bei dir.“",
        place: "kinderzimmer",
        light: "nacht",
        cast: ["tapsi", "mama"],
        picture:
          "Mama sits on the edge of the bed and holds Tapsi in pyjamas tight in her arms; Tapsi's face lies against her shoulder, the tears slowing. The closed pacifier box stands on the windowsill.",
      },
      {
        id: "lied",
        text: "Papa singt leise ein Lied. Tapsi drückt den Teddy an sich und schläft ein.",
        place: "kinderzimmer",
        light: "nacht",
        cast: ["tapsi", "papa"],
        picture:
          "Tapsi lies in bed in pyjamas, hugging the teddy, eyes closing; Papa sits on a small chair beside the bed and sings softly with a gentle face. The closed pacifier box stands on the windowsill.",
      },
    ],
  },
  {
    id: "fee",
    title: "Die Schnullerfee kommt",
    pages: [
      {
        id: "kommt",
        text: "Ganz leise fliegt die Schnullerfee durchs Fenster herein.",
        place: "kinderzimmer",
        light: "nacht",
        cast: ["tapsi", "fee"],
        picture:
          "Tapsi sleeps in bed in pyjamas, hugging the teddy; through the opened window the pacifier fairy flies in quietly, glowing softly, a finger at her lips. The closed pacifier box with its red ribbon stands on the windowsill.",
      },
      {
        id: "nimmt",
        text: "Sie sieht Tapsis Bild und lächelt. Dann nimmt sie die Schachtel mit den Schnullern.",
        place: "kinderzimmer",
        light: "nacht",
        cast: ["tapsi", "fee"],
        picture:
          "The pacifier fairy hovers at the windowsill holding Tapsi's drawing of a fairy and a heart, smiling warmly; with her other arm she holds the pacifier box with its red ribbon. Tapsi sleeps in bed with the teddy.",
      },
      {
        id: "geschenk",
        text: "Und aufs Fensterbrett legt sie ein Geschenk.",
        place: "kinderzimmer",
        light: "nacht",
        cast: ["tapsi", "fee"],
        picture:
          "The pacifier fairy, the pacifier box under one arm, sets a small present wrapped in blue paper with a golden bow onto the windowsill and touches it with her star wand, a few tiny sparkles around it. Tapsi sleeps in bed with the teddy.",
      },
      {
        id: "fort",
        text: "Dann fliegt sie weit fort, zu den kleinen Babys.",
        place: "himmel",
        light: "nacht",
        cast: ["fee"],
        picture:
          "The pacifier fairy flies away over the moonlit roofs of a small town, the pacifier box with its red ribbon in her arms, a soft trail of glitter behind her; the moon and many stars in the deep blue night sky.",
      },
    ],
  },
  {
    id: "morgen",
    title: "Das Geschenk",
    step: "tausch",
    pages: [
      {
        id: "aufwachen",
        text: "Am Morgen wacht Tapsi auf. Was liegt denn da auf dem Fensterbrett?",
        place: "kinderzimmer",
        light: "morgen",
        cast: ["tapsi"],
        picture:
          "Tapsi sits up in bed in pyjamas, rubbing the eyes, and looks surprised at the windowsill, where a small present in blue paper with a golden bow lies in the sunlight. The pacifier box is gone.",
      },
      {
        id: "weg",
        text: "Die Schachtel ist weg! Da liegt ein Geschenk mit einer goldenen Schleife.",
        place: "kinderzimmer",
        light: "morgen",
        cast: ["tapsi", "mama", "papa"],
        picture:
          "Tapsi in pyjamas stands on the floor in front of the window and holds the present in blue paper with its golden bow, amazed; Mama and Papa stand on the floor right behind Tapsi, smiling. The pacifier box is gone.",
      },
      {
        id: "hase",
        text: "Ein Kuschelhase! Und eine Karte voller Sterne von der Schnullerfee.",
        place: "kinderzimmer",
        light: "morgen",
        cast: ["tapsi", "mama", "papa"],
        picture:
          "Tapsi in pyjamas sits on the rug with the opened present: blue paper and the golden bow lie round, and Tapsi holds up a soft light-grey plush bunny, overjoyed; a small card covered with drawn golden stars lies beside it. Mama and Papa kneel beside Tapsi, happy.",
      },
      {
        id: "freuen",
        text: "Tapsi drückt den Hasen ganz fest. Mama und Papa freuen sich mit.",
        place: "kinderzimmer",
        light: "morgen",
        cast: ["tapsi", "mama", "papa"],
        picture: "Tapsi in pyjamas hugs the light-grey plush bunny tight with closed eyes and a big smile; Mama and Papa hug Tapsi from both sides.",
      },
    ],
  },
  {
    id: "vermissen",
    title: "Wenn Tapsi den Schnuller vermisst",
    step: "dabeibleiben",
    pages: [
      {
        id: "wo",
        text: "Am nächsten Abend fragt Tapsi leise: „Wo ist mein Schnuller?“",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi sits in bed in pyjamas, holding the light-grey plush bunny, and looks sadly at the empty windowsill; Mama sits on the edge of the bed and looks at Tapsi with warmth.",
      },
      {
        id: "vermisst",
        text: "„Bei den kleinen Babys“, sagt Mama. „Du vermisst ihn. Komm, wir kuscheln.“",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi", "mama"],
        picture: "Mama lies beside Tapsi on the bed and cuddles Tapsi, who is in pyjamas and holds the light-grey plush bunny; Tapsi's face relaxes.",
      },
      {
        id: "leichter",
        text: "Der Kuschelhase hilft beim Einschlafen. Jeden Abend geht es ein bisschen leichter.",
        place: "kinderzimmer",
        light: "nacht",
        cast: ["tapsi"],
        picture: "Tapsi sleeps peacefully in bed in pyjamas, cheek on the light-grey plush bunny, with a little smile. The windowsill is empty.",
      },
    ],
  },
  {
    id: "bleibt",
    title: "Was immer bleibt",
    pages: [
      {
        id: "erzaehlen",
        text: "Jetzt erzählt Tapsi ganz viel – und Mama versteht jedes Wort.",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi stands on the rug and tells Mama something with big gestures, the mouth open, holding up a toy train; Mama sits on the green sofa, laughing and listening. The light-grey plush bunny sits on the armchair.",
      },
      {
        id: "lieb",
        text: "Mama und Papa haben Tapsi lieb – mit Schnuller und ohne. Für immer.",
        place: "wohnzimmer",
        light: "abend",
        cast: ["tapsi", "mama", "papa"],
        picture:
          "Mama, Papa and Tapsi sit close together on the green sofa in a big cuddle, Tapsi in the middle holding the light-grey plush bunny, all three smiling.",
      },
    ],
  },
];

/** Every page in reading order. */
export const PACIFIER_PAGES: FairyPage[] = PACIFIER_STORY.flatMap((c) => c.pages);
