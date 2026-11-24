import type { StoryChapter } from "@/components/ChapterBook";

// „Tapsi's Own Bed“ (idea H-148, user request, 24 November 2026: „eine weitere Geschichte … soll davon gehen, dass das
// kind im eigenen bett und nicht mehr im elternbett schlafen soll“): the second story of the book „Bed“, beside „Tapsi's
// Big Bed“ (src/games/bedstory, from the cot into a big bed). Here Tapsi already has a bed in Tapsi's own room but sleeps
// between Mama and Papa in their big bed, and moves out of it into the own bed. Its chapters follow what the guides
// advise for leaving the family bed (`OWN_BED_STEPS`, research „grosses-bett“): no change together with another big one,
// telling it beforehand in simple words and letting the child be sad about it, making the own bed cosy with what is
// familiar (the pillow from the big bed, the cuddly toy, a night light, the door left open), the first sleeps in it as
// naps with a grown-up lying beside it (Zero to Three), the same evening ritual with a grown-up beside the bed who moves a
// little further away each evening, brought back calmly with few words when the child comes at night, as often as it
// takes (AAP), and pride in the morning – and the big bed stays a place for cuddles in the morning, so the child loses
// none of the closeness, only the night there. No sticker chart (the guides disagree on rewards for sleep) and no
// scolding.
//
// The same fox family and home as the other chapter books; Tapsi's room is the one of „Tapsi's Big Bed“ with the made
// bed, its rail and its moon night light. English first (root CLAUDE.md), translated into every app language, German too
// (`<language>.ts`). Played at `/grosses-bett/eigenes-bett/`, a story of the book „Bed“ (`ChapterBook`, `first="en"`);
// its pictures come from Gemini (`ownBedPictures.ts`).

/** A step of moving a small child out of its parents' bed, as the guides give it; each has a chapter of its own. */
export type OwnBedStep = "zeichen" | "erzaehlen" | "einrichten" | "mittag" | "ritual" | "weiter" | "zurueck" | "morgen";

/** The steps in the order the guides give them (research „grosses-bett“), for the grown-up. */
export const OWN_BED_STEPS: { id: OwnBedStep; title: string; what: string }[] = [
  {
    id: "zeichen",
    title: "Wann es Zeit ist",
    what: "Wenn der Schlaf im Familienbett für einen nicht mehr gut ist – nicht zusammen mit Geschwisterchen, Kita-Start oder Umzug.",
  },
  {
    id: "erzaehlen",
    title: "Vorher erzählen",
    what: "In einfachen Worten sagen, was sich ändert und warum; das Kind darf traurig sein und es nicht wollen, die Eltern bleiben nah.",
  },
  {
    id: "einrichten",
    title: "Das eigene Bett vertraut machen",
    what: "Das Kissen und das Kuscheltier kommen mit, ein kleines Nachtlicht, die Tür bleibt offen.",
  },
  { id: "mittag", title: "Zuerst beim Mittagsschlaf", what: "Die ersten Schläfchen im eigenen Bett am Tag, ein Erwachsener liegt daneben." },
  {
    id: "ritual",
    title: "Dasselbe Abendritual",
    what: "Alles wie jeden Abend, nur im eigenen Bett; ein Erwachsener bleibt daneben, bis das Kind schläft.",
  },
  { id: "weiter", title: "Langsam weiter weg", what: "Jeden Abend ein Stück weiter vom Bett weg, bis zur Tür." },
  {
    id: "zurueck",
    title: "Nachts ruhig zurückbringen",
    what: "Kommt das Kind nachts, ruhig und mit wenigen Worten zurückbringen, zudecken, bleiben, bis es schläft – so oft es nötig ist, nie schimpfen.",
  },
  {
    id: "morgen",
    title: "Am Morgen stolz sein und kuscheln",
    what: "Am Morgen loben und sich mitfreuen, ohne Stickerplan; das große Bett bleibt zum Kuscheln am Morgen.",
  },
];

/**
 * Where a page plays: every place keeps its look from its reference picture on (`ownBedPictures.ts`). Mama and Papa's
 * bedroom is new in the fox family's home; Tapsi's room is the one of „Tapsi's Big Bed“, with the made bed.
 */
export type Place = "elternzimmer" | "wohnzimmer" | "kinderzimmer";

/** Who is in a page's picture: Tapsi, Mama and Papa Fuchs. */
export type Cast = "tapsi" | "mama" | "papa";

/** The light of a page. */
export type Light = "morgen" | "tag" | "mittag" | "abend" | "nacht";

/** One page: a picture and what the grown-up reads under it. */
export interface OwnBedPage {
  /** Unique in the story, also the picture's file name (`bilder/eigen-<id>.webp`). */
  id: string;
  /** What is read aloud, English, present tense, short (checked in `ownBed.test.ts`). */
  text: string;
  place: Place;
  light: Light;
  /** Everyone in the picture, each once. */
  cast: Cast[];
  /**
   * What happens in the picture, in English, for its Gemini prompt (`ownBedPictures.ts` adds place, cast and light).
   * Its words choose what is worn: „<Name> in pyjamas“ (Tapsi, Papa) or „Mama in her nightgown“, else the day's clothes.
   */
  picture: string;
}

/** One chapter: read on the evening it fits, or the whole story at once. */
export interface OwnBedChapter extends StoryChapter {
  /** The step of moving out of the parents' bed it tells. */
  step: OwnBedStep;
  pages: OwnBedPage[];
}

export const OWN_BED_STORY: OwnBedChapter[] = [
  {
    id: "zu-dritt",
    title: "Three in One Bed",
    step: "zeichen",
    pages: [
      {
        id: "dritt",
        text: "Tapsi sleeps in Mama and Papa's big bed, right between them. It is warm and cosy.",
        place: "elternzimmer",
        light: "nacht",
        cast: ["tapsi", "mama", "papa"],
        picture:
          "Tapsi in pyjamas lies asleep in the middle of the big double bed between Mama in her nightgown on the left and Papa in pyjamas on the right, all three under one big blanket, snug and peaceful, the plush bunny in Tapsi's arm.",
      },
      {
        id: "eng",
        text: "In the night Tapsi turns and kicks. Papa lies right at the edge, and Mama is awake.",
        place: "elternzimmer",
        light: "nacht",
        cast: ["tapsi", "mama", "papa"],
        picture:
          "Tapsi in pyjamas sleeps sprawled across the middle of the big double bed like a starfish, one foot against Papa's back; Papa in pyjamas lies squeezed right at the bed's edge, asleep and holding on to his pillow; Mama in her nightgown lies awake on her pillow with open eyes, tired but smiling. The plush bunny lies by Tapsi's head.",
      },
    ],
  },
  {
    id: "erzaehlen",
    title: "Mama Tells Tapsi",
    step: "erzaehlen",
    pages: [
      {
        id: "sagen",
        text: "Mama says: “Soon you sleep in your own bed, in your own room. Then we all sleep well.”",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture:
          "Mama sits on the green sofa with Tapsi on her lap and explains something kindly, one paw resting on Tapsi's back; Tapsi listens and looks up at her, thoughtful.",
      },
      {
        id: "nicht-wollen",
        text: "“But I want to sleep with you!” says Tapsi. Mama hugs Tapsi: “I know. We are always close by.”",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi sits on Mama's lap on the green sofa with a sad, pouting face, the plush bunny pressed to the chest; Mama holds Tapsi in a warm hug, her cheek against Tapsi's head, gentle and understanding.",
      },
      {
        id: "morgens",
        text: "Papa says: “And every morning you come over to our big bed for a cuddle.”",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "mama", "papa"],
        picture:
          "Papa sits down on the green sofa beside Mama, who has Tapsi on her lap, and smiles at Tapsi with a big open-armed gesture as if promising a hug; Tapsi looks at Papa and starts to smile again.",
      },
    ],
  },
  {
    id: "einrichten",
    title: "Tapsi's Own Bed",
    step: "einrichten",
    pages: [
      {
        id: "kissen",
        text: "Tapsi carries the pillow from the big bed into Tapsi's room. It smells of home.",
        place: "kinderzimmer",
        light: "tag",
        cast: ["tapsi", "papa"],
        picture:
          "Tapsi walks across the blue rug towards the bed, hugging a big white pillow that is almost as big as Tapsi, proud and eager; the bed has no pillow on it yet. Papa walks right behind and smiles.",
      },
      {
        id: "hase",
        text: "Bunny sits on the pillow. And the little moon by the bed glows soft and warm.",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi stands at the head of the bed on tiptoes and sets the plush bunny on the pillow; Mama kneels beside the bedside table and has just switched on the moon night light, which glows softly, and both smile.",
      },
      {
        id: "offen",
        text: "“Your door stays open,” says Papa, “and we are right next door.”",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi", "papa"],
        picture:
          "Tapsi sits on the edge of the bed with the plush bunny; Papa sits beside Tapsi on the bed and points to the right edge of the picture, where the open door is (outside the picture), explaining kindly. The moon night light glows.",
      },
    ],
  },
  {
    id: "mittag",
    title: "First a Nap",
    step: "mittag",
    pages: [
      {
        id: "mittag",
        text: "First Tapsi naps in Tapsi's own bed in the daytime. Mama lies on the rug right beside it.",
        place: "kinderzimmer",
        light: "mittag",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi lies asleep in the bed under the blue blanket, the plush bunny in the arm; Mama lies on the blue rug right beside the bed with a cushion under her head, resting on one elbow, and watches Tapsi sleep with a soft smile.",
      },
      {
        id: "geschafft",
        text: "Tapsi wakes up, and Mama is still there. “You slept in your own bed!”",
        place: "kinderzimmer",
        light: "mittag",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi sits up in the bed under the blue blanket, rubbing one eye and smiling, the plush bunny beside the pillow; Mama kneels on the rug right beside the bed and beams at Tapsi.",
      },
    ],
  },
  {
    id: "abend",
    title: "Just Like Every Evening",
    step: "ritual",
    pages: [
      {
        id: "ritual",
        text: "Pyjamas, teeth, a story, our song – just like every evening. Only the bed is Tapsi's own.",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi", "papa"],
        picture:
          "Tapsi in pyjamas sits in the bed under the blue blanket, the plush bunny in the arm; Papa sits on the edge of the bed and reads from an open picture book, and Tapsi listens, cosy and calm. The moon night light glows.",
      },
      {
        id: "daneben",
        text: "Papa lies on the rug beside the bed and holds Tapsi's paw until Tapsi sleeps.",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi", "papa"],
        picture:
          "Tapsi in pyjamas lies in the bed under the blue blanket with the plush bunny, eyes closing; Papa lies on the blue rug right beside the bed with a cushion under his head and reaches up to hold Tapsi's paw. The moon night light glows.",
      },
    ],
  },
  {
    id: "weiter",
    title: "A Little Further",
    step: "weiter",
    pages: [
      {
        id: "weiter",
        text: "Every evening Papa sits a little further from the bed, step by step.",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi", "papa"],
        picture:
          "Papa sits cross-legged in the middle of the blue rug, a few steps away from the bed, quiet and calm; Tapsi in pyjamas lies in the bed with the plush bunny and looks over at him, sleepy and content. The moon night light glows.",
      },
      {
        id: "tuer",
        text: "Now Papa sits by the open door. Tapsi can hear him humming, and Tapsi sleeps.",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi", "papa"],
        picture:
          "Papa sits on the floor at the far right side of the room, right at the picture's right edge where the door is (outside the picture), far from the bed, humming softly; Tapsi in pyjamas lies asleep in the bed with the plush bunny, peaceful. The moon night light glows.",
      },
    ],
  },
  {
    id: "nachts",
    title: "In the Night",
    step: "zurueck",
    pages: [
      {
        id: "raus",
        text: "In the night Tapsi wakes up, climbs out of bed and pads over to Mama and Papa.",
        place: "kinderzimmer",
        light: "nacht",
        cast: ["tapsi"],
        picture:
          "Tapsi in pyjamas tiptoes across the blue rug away from the bed towards the right side of the room, the plush bunny dangling from one paw; the blue blanket is thrown back and the bed is empty. The moon night light glows.",
      },
      {
        id: "da",
        text: "Tapsi stands at the big bed. Mama wakes up at once and takes Tapsi in her arms.",
        place: "elternzimmer",
        light: "nacht",
        cast: ["tapsi", "mama", "papa"],
        picture:
          "Tapsi in pyjamas stands beside the big double bed on Mama's side, holding the plush bunny; Mama in her nightgown sits up on the edge of the bed and wraps Tapsi in a warm hug, calm and kind; Papa in pyjamas sleeps on in his half of the bed.",
      },
      {
        id: "zurueck",
        text: "Mama walks Tapsi back, calm and quiet: “It's night. Your bed is waiting for you.”",
        place: "kinderzimmer",
        light: "nacht",
        cast: ["tapsi", "mama"],
        picture:
          "Mama in her nightgown walks Tapsi in pyjamas back to the bed across the blue rug, holding Tapsi's paw, calm and kind; Tapsi holds the plush bunny and walks along, sleepy. The moon night light glows.",
      },
      {
        id: "zudecken",
        text: "Mama tucks Tapsi in and stays until Tapsi sleeps. If Tapsi comes again, she brings Tapsi back again.",
        place: "kinderzimmer",
        light: "nacht",
        cast: ["tapsi", "mama"],
        picture:
          "Mama in her nightgown sits on the edge of the bed and tucks the blue blanket round Tapsi in pyjamas, stroking Tapsi's head; Tapsi lies with the plush bunny, eyes closing. The moon night light glows.",
      },
    ],
  },
  {
    id: "morgen",
    title: "Good Morning!",
    step: "morgen",
    pages: [
      {
        id: "aufwachen",
        text: "Morning! Tapsi wakes up in Tapsi's own bed. The sun shines, and Bunny is there too.",
        place: "kinderzimmer",
        light: "morgen",
        cast: ["tapsi"],
        picture: "Tapsi in pyjamas sits up in the bed under the blue blanket, stretching both arms high with a happy yawn, the plush bunny beside the pillow.",
      },
      {
        id: "kuscheln",
        text: "Tapsi climbs into the big bed for a morning cuddle. “I slept in my own bed!”",
        place: "elternzimmer",
        light: "morgen",
        cast: ["tapsi", "mama", "papa"],
        picture:
          "Tapsi in pyjamas kneels on the big double bed between Mama in her nightgown and Papa in pyjamas, who sit up against their pillows; Tapsi throws both arms up, proud and beaming, and Mama and Papa laugh and open their arms for a cuddle.",
      },
      {
        id: "lieb",
        text: "Mama and Papa hug Tapsi tight. They love Tapsi – by day, by night, in every bed.",
        place: "elternzimmer",
        light: "morgen",
        cast: ["tapsi", "mama", "papa"],
        picture:
          "Mama in her nightgown and Papa in pyjamas sit in the big double bed and hug Tapsi in pyjamas between them in one big warm family cuddle, all three smiling with closed eyes.",
      },
    ],
  },
];

/** Every page of the story in reading order. */
export const OWN_BED_PAGES: OwnBedPage[] = OWN_BED_STORY.flatMap((c) => c.pages);
