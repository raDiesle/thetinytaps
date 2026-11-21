import type { StoryChapter } from "@/components/ChapterBook";

// „Tapsi's Big Bed“ (idea H-106, 21 November 2026): told in chapters that follow what the guides advise when a small
// child moves from the cot into a bed of its own (`BED_STEPS`, research „grosses-bett“) – change when the child climbs
// out or outgrows the cot, tell it beforehand and read about it, let the child choose and help, the new bed where the
// cot stood with the old blanket and the cuddly toy, a rail and a night light, the first naps in it by day, the same
// evening ritual as before with a promise to look in, brought back calmly with few words when it gets up, a grown-up on
// a chair beside the bed moving a little further away each evening, and praise in the morning. Its last steps answer the
// searches „kind im eigenen bett schlafen lernen“ and „sleeping in own bed“: Bruno, Tapsi's bear friend from „Kita-Start“,
// moves out of his parents' bed the way Zero to Three gives it (naps first, a grown-up lying beside the new bed, then
// further away), and a night with a bad dream shows that a grown-up always comes and takes the fear seriously.
// No sticker chart: the guides disagree on rewards for sleep (Graf & Seide advise against them where fear or the wish
// for closeness is behind it), so the story ends in pride and love, as all of them advise.
//
// English first (root CLAUDE.md, user decision, 11 November 2026): other languages, German too, come when the user asks.
// Played at `/grosses-bett/`, the book „Big Bed“ among the Alltagshelfer (`ChapterBook`, `first="en"`); its pictures
// come from Gemini (`bedStoryPictures.ts`).

/** A step of moving a small child into a bed of its own, as the guides give it; each has a chapter of its own. */
export type BedStep = "zeichen" | "erzaehlen" | "mitmachen" | "sicher" | "ritual" | "zurueck" | "naehe" | "morgen" | "familienbett";

/** The steps in the order the guides give them (research „grosses-bett“), for the grown-up. */
export const BED_STEPS: { id: BedStep; title: string; what: string }[] = [
  {
    id: "zeichen",
    title: "Wann es Zeit ist",
    what: "Wenn das Kind aus dem Gitterbett klettert, es zu klein wird oder das Kind selbst fragt – nicht zusammen mit Kita-Start, Umzug oder einem Geschwisterchen.",
  },
  { id: "erzaehlen", title: "Vorher erzählen", what: "Vom großen Bett erzählen, ein Buch dazu anschauen, sagen, wo es steht und was mitkommt." },
  { id: "mitmachen", title: "Aussuchen und mithelfen", what: "Bettwäsche aussuchen, beim Aufbauen helfen, sich vom Gitterbett verabschieden." },
  {
    id: "sicher",
    title: "Sicher und vertraut",
    what: "Das Bett an derselben Stelle, mit Seitengitter und Nachtlicht; die alte Decke und das Kuscheltier kommen mit; zuerst beim Mittagsschlaf.",
  },
  {
    id: "ritual",
    title: "Dasselbe Abendritual",
    what: "Alles wie jeden Abend, nur das Bett ist neu; sagen, dass man gleich noch einmal nachschaut – und es tun.",
  },
  {
    id: "zurueck",
    title: "Ruhig zurückbringen",
    what: "Steht das Kind auf, ruhig und mit wenigen Worten zurück ins Bett bringen, zudecken, umarmen – nie schimpfen oder strafen.",
  },
  {
    id: "naehe",
    title: "Nah bleiben, langsam weiter weg",
    what: "Beim Einschlafen auf einem Stuhl am Bett sitzen und ihn jeden Abend ein Stück weiter zur Tür rücken.",
  },
  { id: "morgen", title: "Am Morgen stolz sein", what: "Am Morgen loben und sich mitfreuen – ohne Stickerplan, das Lob reicht." },
  {
    id: "familienbett",
    title: "Aus dem Familienbett",
    what: "Zuerst Mittagsschlaf im eigenen Bett, ein Erwachsener liegt daneben und rückt später weiter weg; ruft das Kind nachts, kommt jemand.",
  },
];

/**
 * Where a page plays: every place keeps its look from its reference picture on (`bedStoryPictures.ts`). Tapsi's room
 * is seen three times – with the cot (`gitterzimmer`), with the cot gone and the big bed being built (`bau`), and with
 * the big bed made, its rail and its moon night light (`kinderzimmer`).
 */
export type Place = "wohnzimmer" | "gitterzimmer" | "bau" | "kinderzimmer" | "baerenschlafzimmer" | "brunozimmer";

/** Who is in a page's picture: Tapsi, Mama and Papa Fuchs, and Bruno with Mama and Papa Bär. */
export type Cast = "tapsi" | "mama" | "papa" | "bruno" | "mamaBaer" | "papaBaer";

/** The light of a page. */
export type Light = "morgen" | "tag" | "mittag" | "abend" | "nacht";

/** One page: a picture and what the grown-up reads under it. */
export interface BedPage {
  /** Unique in the story, also the picture's file name (`bilder/bett-<id>.webp`). */
  id: string;
  /** What is read aloud, English, present tense, short (checked in `bedstory.test.ts`). */
  text: string;
  place: Place;
  light: Light;
  /** Everyone in the picture, each once. */
  cast: Cast[];
  /**
   * What happens in the picture, in English, for its Gemini prompt (`bedStoryPictures.ts` adds place, cast and light).
   * Its words choose what is worn: „<Name> in pyjamas“ (Tapsi, Papa, Bruno, Papa Bear) or „Mama in her nightgown“ (Mama, Mama Bear),
   * else the day's clothes.
   */
  picture: string;
}

/** One chapter: read on the evening it fits, or the whole story at once. */
export interface BedChapter extends StoryChapter {
  /** The step of moving into a bed of one's own it tells, if any. */
  step?: BedStep;
  pages: BedPage[];
}

export const BED_STORY: BedChapter[] = [
  {
    id: "zu-klein",
    title: "The Cot Is Too Small",
    step: "zeichen",
    pages: [
      {
        id: "eng",
        text: "Tapsi sleeps in a cot with bars all round. Tapsi stretches – bump! The feet touch the end.",
        place: "gitterzimmer",
        light: "morgen",
        cast: ["tapsi"],
        picture:
          "Tapsi in pyjamas lies in the cot under the small yellow blanket and stretches out long with a big yawn, both feet pressing against the bars at the cot's end, surprised and amused.",
      },
      {
        id: "klettern",
        text: "Tapsi stands up and lifts a leg over the bars. Papa is right there and lifts Tapsi out.",
        place: "gitterzimmer",
        light: "morgen",
        cast: ["tapsi", "papa"],
        picture:
          "Tapsi in pyjamas stands in the cot, holding its top rail with both paws, one foot lifted onto a bar as if to climb over; Papa stands right beside the cot and lifts Tapsi out under the arms, calm and smiling.",
      },
      {
        id: "wachsen",
        text: "Papa smiles: “You are growing. Soon you get a big bed, all your own.”",
        place: "gitterzimmer",
        light: "morgen",
        cast: ["tapsi", "papa"],
        picture:
          "Papa kneels on the rug in front of the cot with Tapsi in pyjamas on his knee, and both look at the cot; Papa smiles and Tapsi looks up at him, curious and excited. The cot is empty.",
      },
    ],
  },
  {
    id: "erzaehlen",
    title: "Talking About the Big Bed",
    step: "erzaehlen",
    pages: [
      {
        id: "buch",
        text: "Mama and Tapsi look at a picture book. In it a little mouse sleeps in a big bed.",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture:
          "Mama sits on the green sofa with Tapsi beside her, and an open picture book lies across both their laps; on its page is a simple drawing of a little grey mouse asleep in a big bed. Tapsi points at it, delighted.",
      },
      {
        id: "wo",
        text: "“Where will my big bed stand?” “In your room,” says Mama, “just where the cot is now.”",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi sits on the round rug and looks up at Mama, asking something; Mama sits on the green sofa, leans forward and answers kindly, pointing over to one side, where Tapsi's room is.",
      },
      {
        id: "mit",
        text: "“And Bunny?” Mama smiles: “Bunny comes too. And your little yellow blanket, and our song.”",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi sits on the round rug and holds up the plush bunny and the small yellow blanket in both arms, a little worried; Mama sits on the green sofa, leans forward and smiles warmly at Tapsi.",
      },
    ],
  },
  {
    id: "helfen",
    title: "Tapsi Helps",
    step: "mitmachen",
    pages: [
      {
        id: "aussuchen",
        text: "Tapsi picks the covers for the big bed: the blue ones, like the evening sky.",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture:
          "Mama sits on the green sofa and holds up two folded sets of bed covers, a green one in one paw and a blue one in the other; Tapsi stands on the round rug in front of her and points at the blue one, beaming.",
      },
      {
        id: "abschied",
        text: "The cot goes to the cellar. Tapsi pats it: “Bye-bye, little bed. Thank you!”",
        place: "gitterzimmer",
        light: "tag",
        cast: ["tapsi", "papa"],
        picture:
          "Tapsi stands beside the empty cot and pats its top rail with one paw, waving goodbye with the other; Papa kneels at the cot's other end, ready to carry it away, and smiles at Tapsi. The small yellow blanket is not in the cot any more.",
      },
      {
        id: "bauen",
        text: "The big bed comes in pieces. Tapsi hands Papa each board, and Papa builds.",
        place: "bau",
        light: "tag",
        cast: ["tapsi", "papa"],
        picture:
          "Where the bed stands in the reference there is no bed yet: only its wooden frame, half put together, stands there, and two wooden boards lie on the floor beside it. Papa kneels at the frame and fits a board in; Tapsi holds out the next wooden board to him with both paws, proud and eager.",
      },
      {
        id: "machen",
        text: "Tapsi and Mama make the bed: the pillow, the blue blanket – and Bunny on top.",
        place: "kinderzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture:
          "Mama stands beside the bed and smooths the blue blanket over it; Tapsi stands at the head of the bed on tiptoes and sets the plush bunny on the pillow, very pleased. The small yellow blanket lies folded at the foot of the bed.",
      },
    ],
  },
  {
    id: "sicher",
    title: "Safe and Cosy",
    step: "sicher",
    pages: [
      {
        id: "gelaender",
        text: "Along the bed runs a little rail. Tapsi rolls over to try it – bump! Tapsi stays in bed.",
        place: "kinderzimmer",
        light: "tag",
        cast: ["tapsi", "papa"],
        picture:
          "Tapsi lies on top of the blue blanket and rolls against the low wooden rail along the bed's side, laughing; Papa kneels on the floor beside the bed and laughs with Tapsi.",
      },
      {
        id: "licht",
        text: "Tapsi gets a little night light: a moon. It glows soft and warm all night.",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi sits on the bed and points, amazed, at the small moon-shaped night light glowing softly at the wall low beside the bed; Mama kneels beside it, having just switched it on, and smiles at Tapsi.",
      },
      {
        id: "mittag",
        text: "First Tapsi naps in the big bed in the daytime. Mama sits close by on a little chair.",
        place: "kinderzimmer",
        light: "mittag",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi lies asleep in the bed under the blue blanket, the plush bunny in the arm; Mama sits on a small wooden chair right beside the bed, reading a book quietly.",
      },
    ],
  },
  {
    id: "abend",
    title: "Just Like Every Evening",
    step: "ritual",
    pages: [
      {
        id: "geschichte",
        text: "Pyjamas, teeth, a story – just like every evening. Only the bed is new.",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi", "papa"],
        picture:
          "Tapsi in pyjamas sits in the bed under the blue blanket, the plush bunny in the arm; Papa sits on the edge of the bed and reads from an open picture book, and Tapsi listens, cosy and calm.",
      },
      {
        id: "lied",
        text: "Papa sings Tapsi's song. Bunny is in the arm, and the little moon glows.",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi", "papa"],
        picture:
          "Tapsi in pyjamas lies in the bed under the blue blanket, the plush bunny in the arm, eyes half closed; Papa sits on the edge of the bed and sings softly, stroking Tapsi's head. The moon night light glows.",
      },
      {
        id: "gutenacht",
        text: "“Good night, big bed!” Papa says: “I'll come back soon and look in on you.”",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi", "papa"],
        picture:
          "Tapsi in pyjamas lies snug in the bed and waves; Papa stands beside the bed, about to go, and waves back with a warm smile. The moon night light glows.",
      },
      {
        id: "nachschauen",
        text: "Papa comes back to look in on Tapsi, just as he said. Tapsi is snug and sleepy.",
        place: "kinderzimmer",
        light: "nacht",
        cast: ["tapsi", "papa"],
        picture:
          "Papa leans over the bed and looks in on Tapsi, smiling; Tapsi in pyjamas lies under the blue blanket with the plush bunny, eyes nearly closed, and smiles back sleepily. The moon night light glows.",
      },
    ],
  },
  {
    id: "aufstehen",
    title: "Out of Bed",
    step: "zurueck",
    pages: [
      {
        id: "raus",
        text: "In the night Tapsi climbs out of the big bed and pads across the room.",
        place: "kinderzimmer",
        light: "nacht",
        cast: ["tapsi"],
        picture:
          "Tapsi in pyjamas tiptoes across the rug away from the bed, the plush bunny dangling from one paw, wide awake; the blue blanket is thrown back and the bed is empty. The moon night light glows.",
      },
      {
        id: "zurueck",
        text: "Papa takes Tapsi's paw, calm and quiet: “It's night. Back to bed.”",
        place: "kinderzimmer",
        light: "nacht",
        cast: ["tapsi", "papa"],
        picture:
          "Papa in pyjamas walks Tapsi in pyjamas back to the bed, holding Tapsi's paw, calm and kind; Tapsi holds the plush bunny and walks along. The moon night light glows.",
      },
      {
        id: "zudecken",
        text: "Papa tucks Tapsi in and gives a hug. If Tapsi gets up again, Papa brings Tapsi back again.",
        place: "kinderzimmer",
        light: "nacht",
        cast: ["tapsi", "papa"],
        picture:
          "Papa in pyjamas bends over the bed and hugs Tapsi, tucking the blue blanket round Tapsi in pyjamas; Tapsi hugs him back, the plush bunny in the other arm. The moon night light glows.",
      },
    ],
  },
  {
    id: "nah",
    title: "Mama Stays Close",
    step: "naehe",
    pages: [
      {
        id: "stuhl",
        text: "Mama sits on the little chair beside the bed until Tapsi falls asleep.",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi in pyjamas lies in the bed under the blue blanket with the plush bunny, eyes closing; Mama sits on a small wooden chair right beside the bed, quiet and close, one paw resting on the edge of the bed.",
      },
      {
        id: "weiter",
        text: "Every evening the chair moves a little further from the bed, step by step.",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi", "mama"],
        picture:
          "Mama sits on the small wooden chair in the middle of the rug, a few steps away from the bed, quiet and calm; Tapsi in pyjamas lies in the bed with the plush bunny and looks over at her, sleepy and content.",
      },
      {
        id: "tuer",
        text: "Now Mama sits over by the door. Tapsi can still see her, and Tapsi sleeps.",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi", "mama"],
        picture:
          "Mama sits on the small wooden chair at the far right side of the room, close to the picture's right edge and far from the bed; Tapsi in pyjamas lies asleep in the bed with the plush bunny, peaceful. The moon night light glows.",
      },
    ],
  },
  {
    id: "morgen",
    title: "Good Morning, Big Bed",
    step: "morgen",
    pages: [
      {
        id: "aufwachen",
        text: "Morning! Tapsi wakes up in the big bed. The sun shines on the blue blanket.",
        place: "kinderzimmer",
        light: "morgen",
        cast: ["tapsi"],
        picture: "Tapsi in pyjamas sits up in the bed under the blue blanket, stretching both arms high with a happy yawn, the plush bunny beside the pillow.",
      },
      {
        id: "stolz",
        text: "Mama and Papa come in: “You slept in your big bed!” Tapsi is proud.",
        place: "kinderzimmer",
        light: "morgen",
        cast: ["tapsi", "mama", "papa"],
        picture:
          "Tapsi in pyjamas stands on the bed, proud, arms up; Mama and Papa stand beside the bed and smile at Tapsi with open arms, ready for a big morning hug.",
      },
    ],
  },
  {
    id: "bruno",
    title: "Bruno's Own Bed",
    step: "familienbett",
    pages: [
      {
        id: "bruno-familienbett",
        text: "Tapsi's friend Bruno the bear sleeps in Mama and Papa Bear's big bed, right between them.",
        place: "baerenschlafzimmer",
        light: "nacht",
        cast: ["bruno", "mamaBaer", "papaBaer"],
        picture:
          "Bruno in pyjamas lies asleep in the middle of the big double bed between Mama Bear in her nightgown on the left and Papa Bear in pyjamas on the right, all three under one big blanket, snug and peaceful.",
      },
      {
        id: "bruno-bett",
        text: "Now Bruno gets a bed of his own, in his own room. He picks the pillow with the boats.",
        place: "brunozimmer",
        light: "tag",
        cast: ["bruno", "papaBaer"],
        picture:
          "Bruno stands beside his new low bed and hugs a pillow with little blue boats on it, beaming; Papa Bear kneels beside the bed and smiles at him.",
      },
      {
        id: "bruno-mittag",
        text: "First Bruno naps in it in the daytime. Mama Bear lies on the rug right beside him.",
        place: "brunozimmer",
        light: "mittag",
        cast: ["bruno", "mamaBaer"],
        picture:
          "Bruno lies asleep in his new low bed with the boat pillow; Mama Bear lies on the rug right beside the bed, resting on one elbow, and watches him sleep with a soft smile.",
      },
      {
        id: "bruno-nacht",
        text: "At night Papa Bear stays beside Bruno's bed until Bruno is asleep.",
        place: "brunozimmer",
        light: "abend",
        cast: ["bruno", "papaBaer"],
        picture:
          "Bruno in pyjamas lies in his low bed with the boat pillow, eyes closing; Papa Bear sits on the rug beside the bed, leaning against it, and holds Bruno's paw.",
      },
      {
        id: "bruno-rufen",
        text: "When Bruno wakes and calls, Mama or Papa Bear comes. They are always near.",
        place: "brunozimmer",
        light: "nacht",
        cast: ["bruno", "mamaBaer"],
        picture:
          "Bruno in pyjamas sits up in his low bed, arms reaching out; Mama Bear in her nightgown kneels beside the bed and gathers him into a hug, warm and calm.",
      },
    ],
  },
  {
    id: "traum",
    title: "A Bad Dream",
    pages: [
      {
        id: "traum",
        text: "One night Tapsi wakes up from a bad dream and calls: “Mama!”",
        place: "kinderzimmer",
        light: "nacht",
        cast: ["tapsi"],
        picture:
          "Tapsi in pyjamas sits up in the bed, hugging the plush bunny tight, frightened, and calls out with a wide-open mouth. The moon night light glows.",
      },
      {
        id: "zuhoeren",
        text: "Mama comes at once. Tapsi tells her about the dream, and Mama listens.",
        place: "kinderzimmer",
        light: "nacht",
        cast: ["tapsi", "mama"],
        picture:
          "Mama in her nightgown sits on the edge of the bed and holds Tapsi in pyjamas close in her arms; Tapsi tells her something, still a little scared, and Mama listens closely and gently. The moon night light glows.",
      },
      {
        id: "bleiben",
        text: "Mama lies down on the rug beside the bed and holds Tapsi's paw until Tapsi sleeps.",
        place: "kinderzimmer",
        light: "nacht",
        cast: ["tapsi", "mama"],
        picture:
          "Mama in her nightgown lies on the rug right beside the bed with a cushion under her head and reaches up to hold Tapsi's paw; Tapsi in pyjamas lies in the bed with the plush bunny, calm again, eyes closing. The moon night light glows.",
      },
      {
        id: "lieb",
        text: "Mama and Papa are always close. They love Tapsi – in the little bed and in the big one.",
        place: "kinderzimmer",
        light: "nacht",
        cast: ["tapsi", "mama", "papa"],
        picture:
          "Tapsi in pyjamas sleeps peacefully in the bed with the plush bunny in the arm; Mama in her nightgown and Papa in pyjamas lean over from beside the bed and give Tapsi a soft good-night kiss on the head. The moon night light glows.",
      },
    ],
  },
];

/** Every page of the story in reading order. */
export const BED_PAGES: BedPage[] = BED_STORY.flatMap((c) => c.pages);
