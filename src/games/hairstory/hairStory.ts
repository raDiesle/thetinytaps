import type { StoryChapter } from "@/components/ChapterBook";

// „Tapsi and the Foam Crown“ (idea H-14, user request, 13 November 2026: „eine neue Alltagshelfer-Buch zu Haare waschen
// im gleichen Stil wie Stillen oder Kita oder Schnullerfee“): told in chapters that follow what the guides advise for a
// small child who fears or fights hair washing (`WASH_STEPS`, research „haare-waschen“) – say beforehand what comes and
// in which order, play it first with a toy and on a grown-up, let the child choose and do parts itself, keep the eyes
// dry (head back, eyes up to something on the ceiling, a cloth to hold, a cup instead of the shower, the same count every
// time), stop at once when it is too much, and a warm towel and a word of praise afterwards. Its motifs: the foam crown in
// the hand mirror, Tapsi's own red cup, the washcloth Tapsi holds, the sun on the bathroom ceiling, „Now!“ and Mama's
// „one, two, three“, and the plush bunny, who goes first.
//
// English first (root CLAUDE.md, user decision, 11 November 2026): other languages, German too, come when the user asks.
// Played at `/haare-waschen/`, the book „Hair Washing“ among the Alltagshelfer (`ChapterBook`, `first="en"`); its
// pictures come from Gemini (`hairStoryPictures.ts`).

/** A step of washing a small child's hair gently, as the guides give it; each has a chapter of its own. */
export type WashStep = "erzaehlen" | "ueben" | "mitmachen" | "augen" | "pause" | "danach";

/** The steps in the order the guides give them (research „haare-waschen“), for the grown-up. */
export const WASH_STEPS: { id: WashStep; title: string; what: string }[] = [
  {
    id: "erzaehlen",
    title: "Vorher erzählen",
    what: "Sagen, dass heute Haare gewaschen werden und in welcher Reihenfolge; fragen, was das Kind daran nicht mag.",
  },
  { id: "ueben", title: "Vorher spielen", what: "Erst das Kuscheltier waschen, trocken; dann wäscht das Kind die Haare eines Erwachsenen." },
  { id: "mitmachen", title: "Selbst wählen und mitmachen", what: "Becher und Shampoo aussuchen, das Wasser selbst fühlen, den Waschlappen selbst halten." },
  {
    id: "augen",
    title: "Die Augen bleiben trocken",
    what: "Kopf in den Nacken, nach oben schauen, Waschlappen vor den Augen, mit dem Becher spülen, jedes Mal gleich zählen.",
  },
  { id: "pause", title: "Wenn es zu viel wird", what: "Sofort aufhören, Gesicht abtrocknen, trösten; nie festhalten oder weitermachen gegen das Kind." },
  { id: "danach", title: "Das warme Handtuch", what: "Ein warmes Handtuch liegt bereit; sagen, was das Kind selbst geschafft hat." },
];

/** Where a page plays: every place keeps its look from its reference picture on (`hairStoryPictures.ts`). */
export type Place = "wohnzimmer" | "kinderzimmer" | "bad";

/** Who is in a page's picture: Tapsi, Mama and Papa Fuchs. */
export type Cast = "tapsi" | "mama" | "papa";

/** The light of a page. */
export type Light = "tag" | "abend";

/** One page: a picture and what the grown-up reads under it. */
export interface HairPage {
  /** Unique in the story, also the picture's file name (`bilder/haare-<id>.webp`). */
  id: string;
  /** What is read aloud, English, present tense, short (checked in `hairstory.test.ts`). */
  text: string;
  place: Place;
  light: Light;
  /** Everyone in the picture, each once. */
  cast: Cast[];
  /**
   * What happens in the picture, in English, for its Gemini prompt (`hairStoryPictures.ts` adds place, cast and light).
   * Its words choose what Tapsi wears: „in the bath“, „in the towel“, „pyjamas“, else T-shirt and trousers.
   */
  picture: string;
}

/** One chapter: read on its own on the evening it fits (the foam crown before every hair wash), or the whole story at once. */
export interface HairChapter extends StoryChapter {
  /** The step of washing gently it tells, if any. */
  step?: WashStep;
  pages: HairPage[];
}

export const HAIR_STORY: HairChapter[] = [
  {
    id: "heute",
    title: "Hair-Washing Day",
    step: "erzaehlen",
    pages: [
      {
        id: "klebrig",
        text: "Tapsi has porridge in the hair. And sand from the sandpit.",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi sits on the round rug and touches the top of the head, where a blob of porridge and some sand stick in the fur, making a funny face; Mama sits on the green sofa, leans forward and looks at it with a warm smile.",
      },
      {
        id: "sagen",
        text: "Mama says: “Tonight we wash your hair. Not every night – just tonight.”",
        place: "wohnzimmer",
        light: "abend",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi sits on the round rug and looks up at Mama; Mama sits on the green sofa, leans forward towards Tapsi and tells Tapsi something, calm and kind.",
      },
      {
        id: "reihenfolge",
        text: "First water, then foam, then water again. And then the warm towel.",
        place: "wohnzimmer",
        light: "abend",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi sits on the round rug and looks up; Mama sits on the green sofa, leans forward and holds up three fingers of one paw, counting, and Tapsi watches the fingers closely.",
      },
      {
        id: "augen",
        text: "“I don't like water in my eyes,” says Tapsi. Mama listens: “We'll keep your eyes dry.”",
        place: "wohnzimmer",
        light: "abend",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi sits on the round rug and covers both eyes with the paws, a little worried; Mama sits on the green sofa, leans forward, listens closely and lays a paw gently on Tapsi's shoulder.",
      },
    ],
  },
  {
    id: "zuerst",
    title: "Bunny Goes First",
    step: "ueben",
    pages: [
      {
        id: "hase",
        text: "Tapsi washes Bunny's hair. The cup is empty, so Bunny stays dry.",
        place: "kinderzimmer",
        light: "tag",
        cast: ["tapsi"],
        picture:
          "Tapsi sits on the bed with the plush bunny lying back on Tapsi's lap and pretends to pour from a small empty red plastic cup over the bunny's head, carefully and gently, with a calm, caring little smile.",
      },
      {
        id: "hase-augen",
        text: "“Head back, Bunny, and look up!” Tapsi holds a cloth over Bunny's eyes.",
        place: "kinderzimmer",
        light: "tag",
        cast: ["tapsi"],
        picture:
          "Tapsi sits on the bed, the plush bunny leaning back on Tapsi's lap, and holds a small green washcloth over the bunny's eyes with one paw, smiling and caring; the small red cup lies beside them on the blanket.",
      },
      {
        id: "mama-waschen",
        text: "Then Tapsi washes Mama's hair, with real water. “That feels nice,” says Mama.",
        place: "bad",
        light: "abend",
        cast: ["tapsi", "mama"],
        picture:
          "Mama kneels on the bath mat in front of the bathtub, her sleeves pushed up, and leans her head over the tub's edge; Tapsi stands on the little wooden step beside her and pours water from the small red cup over the back of Mama's head. Mama laughs with her eyes closed, and Tapsi grins. The bathtub has a little water in it and nobody sits in it.",
      },
    ],
  },
  {
    id: "selbst",
    title: "Tapsi Chooses",
    step: "mitmachen",
    pages: [
      {
        id: "becher",
        text: "Tapsi picks the cup: the red one. And the shampoo that smells of apples.",
        place: "bad",
        light: "abend",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi stands at the low shelf beside the bathtub and proudly holds up the small red cup in one paw and the green bottle of children's shampoo with an apple on it in the other; Mama kneels beside Tapsi and smiles. The bathtub is empty.",
      },
      {
        id: "fuehlen",
        text: "Tapsi feels the water with a paw. Warm, not hot. Just right.",
        place: "bad",
        light: "abend",
        cast: ["tapsi", "mama"],
        picture:
          "The bathtub is filled only a little with warm water. Tapsi stands on the little wooden step beside the tub and dips one paw into the water, thinking and then pleased; Mama kneels beside Tapsi and holds a paw in the water too.",
      },
      {
        id: "lappen",
        text: "Tapsi gets the washcloth. Tapsi holds it over the eyes, all alone.",
        place: "bad",
        light: "abend",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi stands on the bath mat and presses a small folded green washcloth over both eyes with both paws, practising, smiling under it; Mama kneels in front of Tapsi and claps softly. The bathtub is empty.",
      },
    ],
  },
  {
    id: "krone",
    title: "The Foam Crown",
    step: "augen",
    pages: [
      {
        id: "nass",
        text: "Tapsi sits in the bath. Mama pours warm water from the cup, slowly, at the back.",
        place: "bad",
        light: "abend",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi in the bath sits in the tub, calm; Mama kneels on the bath mat beside the tub and slowly pours water from the small red cup over the back of Tapsi's head, her other hand at Tapsi's forehead so no water runs to the face.",
      },
      {
        id: "sonne",
        text: "Head back, eyes up to the sun on the ceiling. The water runs down the back.",
        place: "bad",
        light: "abend",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi in the bath leans the head back and looks straight up at the yellow sun sticker on the ceiling, which is seen at the top of the picture; Mama kneels beside the tub, one hand behind Tapsi's head, and pours from the small red cup at the back of the head.",
      },
      {
        id: "schaum",
        text: "Tapsi rubs in the foam alone. Rub, rub, rub!",
        place: "bad",
        light: "abend",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi in the bath rubs white shampoo foam into the fur on top of the head with both paws, eyes open and happy; Mama kneels beside the tub and holds the green shampoo bottle with the apple on it.",
      },
      {
        id: "spiegel",
        text: "Mama shapes a foam crown. Tapsi sees it in the mirror and laughs.",
        place: "bad",
        light: "abend",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi in the bath has a tall white foam crown shaped on the head; Mama kneels beside the tub and holds up a small round hand mirror, and Tapsi looks into it and laughs out loud.",
      },
      {
        id: "jetzt",
        text: "Tapsi holds the cloth over the eyes and says: “Now!” Mama counts: “One, two, three.”",
        place: "bad",
        light: "abend",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi in the bath, still with the foam crown, presses the small green washcloth over both eyes with both paws and leans the head back, ready; Mama kneels beside the tub holding the full red cup above Tapsi's head and counts on the fingers of her other hand.",
      },
      {
        id: "spuelen",
        text: "Splash! The foam runs away down the back. Tapsi's eyes stay dry.",
        place: "bad",
        light: "abend",
        cast: ["tapsi", "mama"],
        picture:
          "Mama pours the red cup out at the back of Tapsi's head and the foam runs away down Tapsi's back into the water; Tapsi in the bath lowers the washcloth and peeks out with dry eyes, surprised and pleased.",
      },
    ],
  },
  {
    id: "zuviel",
    title: "When It's Too Much",
    step: "pause",
    pages: [
      {
        id: "tropfen",
        text: "Another night a drop runs into Tapsi's eye. It stings, and Tapsi cries.",
        place: "bad",
        light: "abend",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi in the bath, with a little foam on the head, rubs one eye with a paw and cries; Mama kneels beside the tub and has put the red cup down at once, already reaching for Tapsi.",
      },
      {
        id: "aufhoeren",
        text: "Mama stops at once and dries Tapsi's face. “You may cry. I'm here.”",
        place: "bad",
        light: "abend",
        cast: ["tapsi", "mama"],
        picture:
          "Mama kneels beside the tub and gently dabs Tapsi's face dry with a corner of the fluffy yellow towel; Tapsi in the bath still sniffs, a tear on the cheek, and looks at Mama.",
      },
      {
        id: "warten",
        text: "They wait until it is better. Mama asks: “More water, or stop for today?”",
        place: "bad",
        light: "abend",
        cast: ["tapsi", "mama"],
        picture: "Tapsi in the bath leans on Mama's arm, calmer now, and Mama, kneeling beside the tub, holds Tapsi's paw and asks something kindly.",
      },
      {
        id: "entscheiden",
        text: "Tapsi says: “One more splash.” Tapsi holds the cloth tight, and it is done.",
        place: "bad",
        light: "abend",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi in the bath presses the small green washcloth firmly over the eyes and leans the head back, brave; Mama pours the last water from the red cup gently at the back of Tapsi's head.",
      },
    ],
  },
  {
    id: "handtuch",
    title: "The Warm Towel",
    step: "danach",
    pages: [
      {
        id: "einwickeln",
        text: "Out of the bath and into the warm towel. Mama wraps Tapsi up, snug and cosy.",
        place: "bad",
        light: "abend",
        cast: ["tapsi", "mama"],
        picture:
          "Mama kneels on the bath mat and wraps Tapsi in the towel, hugging Tapsi close; only Tapsi's happy face and wet head fur peek out of the hood. The bathtub behind them is empty, the water let out.",
      },
      {
        id: "trocknen",
        text: "Papa rubs Tapsi's hair dry. Soft and fluffy – and it smells of apples.",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi", "papa"],
        picture:
          "Tapsi in the towel sits on the bed and Papa, sitting beside Tapsi, gently rubs Tapsi's head with the towel's hood; Tapsi's head fur is soft and fluffy and Tapsi sniffs it, smiling.",
      },
      {
        id: "stolz",
        text: "“You held the cloth all by yourself,” says Papa. Tapsi is proud.",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi", "papa"],
        picture:
          "Tapsi in pyjamas sits on the bed, proud, and holds up the small green washcloth like a prize; Papa sits beside Tapsi on the edge of the bed and smiles warmly.",
      },
    ],
  },
  {
    id: "naechstes",
    title: "Next Time",
    pages: [
      {
        id: "hase-krone",
        text: "In bed Tapsi tells Bunny: “Next time you get a foam crown too.”",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi"],
        picture:
          "Tapsi in pyjamas lies in bed under the blanket and holds the plush bunny up in front of the face, telling it something and smiling, the fluffy clean head fur on the pillow.",
      },
      {
        id: "lieb",
        text: "Mama and Papa love Tapsi – with sticky hair and with clean hair.",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi", "mama", "papa"],
        picture:
          "Tapsi in pyjamas lies in bed with the plush bunny in the arm, sleepy and happy; Mama and Papa sit on the edge of the bed and lean over to give Tapsi a good-night kiss on the fluffy head.",
      },
    ],
  },
];

/** Every page of the story in reading order. */
export const HAIR_PAGES: HairPage[] = HAIR_STORY.flatMap((c) => c.pages);
