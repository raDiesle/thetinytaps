import type { StoryChapter } from "@/components/ChapterBook";
import { PACIFIER_STEPS, type PacifierStep } from "@/games/pacifierstory/pacifierStory";
import { shortOf } from "@/lib/storyPages";

// „Tapsi and the Pacifier Tree“ (idea H-145, user request, 23 November 2026): the book „Schnullerfee“'s second story,
// for families who want no fairy – Tapsi hangs the pacifiers on the pacifier tree in the park, a real custom in many
// towns, and says goodbye there. Shorter than „Tapsi und die Schnullerfee“, and like it whole and as a short version
// (user: „unterschiedliche Länge und zwei Versionen kurz lang anzubieten ist perfekt“). Its chapters follow the same
// guides' steps of a gentle goodbye (research „schnullerfee-kapitel“, which names the tree as the other gentle way), all
// but the swap for a present: tell the child, keep the pacifier for bed, pick the day together, the child gathers the
// pacifiers and gives them away itself, stay close in the first night, and stay with it while the child misses them.
// Its motifs: Tapsi's three pacifiers (red, blue, yellow, as in the fairy's story), a ribbon picked for each, and the big
// old tree in the park full of other children's pacifiers, where Tapsi's stay and can be visited.
//
// The same fox family and home as the other chapter books. English first (root CLAUDE.md), translated into every app
// language, German too (`<language>.ts`). Played at `/schnullerfee/baum/` (`ChapterBook`, `first="en"`), its short
// version at `/schnullerfee/baum/kurz/`; its pictures come from Gemini (`pacifierTreePictures.ts`).

/** The steps this story tells, in the guides' order: all of the fairy's but the swap for a present. */
export const TREE_STEPS: PacifierStep[] = PACIFIER_STEPS.map((s) => s.id).filter((id) => id !== "tausch");

/** Where a page plays: every place keeps its look from its reference picture on (`pacifierTreePictures.ts`). */
export type Place = "kinderzimmer" | "wohnzimmer" | "park";

/** Who is in a page's picture: Tapsi, Mama and Papa Fuchs. */
export type Cast = "tapsi" | "mama" | "papa";

/** The light of a page. */
export type Light = "tag" | "abend" | "morgen";

/** One page: a picture and what the grown-up reads under it. */
export interface TreePage {
  /** Unique in the story, also the picture's file name (`bilder/baum-<id>.webp`). */
  id: string;
  /** What is read aloud, English, present tense, short (checked in `pacifierTree.test.ts`). */
  text: string;
  place: Place;
  light: Light;
  /** Everyone in the picture, each once. */
  cast: Cast[];
  /** What happens in the picture, in English, for its Gemini prompt (`pacifierTreePictures.ts` adds place, cast and light). */
  picture: string;
}

/** One chapter of the story. */
export interface TreeChapter extends StoryChapter {
  /** The step of a gentle goodbye it tells, if any. */
  step?: PacifierStep;
  pages: TreePage[];
}

export const TREE_STORY: TreeChapter[] = [
  {
    id: "schnuller",
    title: "Tapsi's Pacifiers",
    pages: [
      {
        id: "schnuller",
        text: "This is Tapsi. Tapsi has three pacifiers: a red one, a blue one and a yellow one.",
        place: "kinderzimmer",
        light: "tag",
        cast: ["tapsi"],
        picture:
          "Tapsi sits on the round rug and pushes a small wooden toy car, the red pacifier in the mouth; the blue pacifier and the yellow pacifier lie on the rug beside Tapsi.",
      },
      {
        id: "troesten",
        text: "The pacifier comforts Tapsi and helps Tapsi fall asleep.",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture: "Mama sits on the green sofa and holds Tapsi on her lap; Tapsi sucks the red pacifier, snuggled in, eyes half closed.",
      },
    ],
  },
  {
    id: "erzaehlen",
    title: "A Tree Full of Pacifiers",
    step: "vorbereiten",
    pages: [
      {
        id: "buch",
        text: "Papa shows Tapsi a book. In it stands a big tree, full of pacifiers on ribbons.",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "papa"],
        picture:
          "Papa and Tapsi sit side by side on the green sofa and look into an open picture book on Papa's knees; its page shows a drawing of a big tree with many little colourful pacifiers hanging on ribbons from its branches. Tapsi points at it, curious.",
      },
      {
        id: "kinder",
        text: "“That's the pacifier tree,” says Papa. “Children hang their pacifiers there to say goodbye.”",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "papa"],
        picture: "On the green sofa Papa has closed the picture book on his knees and talks to Tapsi warmly; Tapsi looks up at Papa and listens.",
      },
      {
        id: "meine",
        text: "Tapsi holds the pacifiers tight: “Mine!” Papa hugs Tapsi: “You may be sad. I'm here.”",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "papa"],
        picture:
          "On the green sofa Tapsi clutches the red, the blue and the yellow pacifier to the chest with both paws, ears down, a little cross and sad; Papa holds Tapsi in a warm hug.",
      },
    ],
  },
  {
    id: "bett",
    title: "Only in Bed",
    step: "weniger",
    pages: [
      {
        id: "kissen",
        text: "From now on the pacifiers stay in bed in the daytime. Tapsi lays them on the pillow.",
        place: "kinderzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture: "Tapsi stands at the bed and lays the red, the blue and the yellow pacifier side by side on the pillow; Mama stands next to Tapsi and smiles.",
      },
      {
        id: "spielen",
        text: "Tapsi plays without a pacifier. And when Tapsi is sad, Papa gives a big cuddle.",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "papa"],
        picture: "Tapsi and Papa kneel on the rug and build a tall tower of wooden blocks together, both laughing.",
      },
    ],
  },
  {
    id: "tag",
    title: "Tapsi Picks the Day",
    step: "festlegen",
    pages: [
      {
        id: "wann",
        text: "Mama asks: “When shall we go to the tree?” Tapsi thinks: “After two more sleeps!”",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "mama", "papa"],
        picture:
          "Mama and Papa sit on the green sofa and Tapsi stands on the rug in front of them and holds up two fingers of one paw (index and middle finger up, thumb, ring and little finger folded), thinking hard; Mama and Papa smile.",
      },
      {
        id: "baender",
        text: "Tapsi picks a ribbon for every pacifier: a red one, a blue one and a yellow one.",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi and Mama sit on the rug; Tapsi ties a red ribbon to the ring of the red pacifier, and the blue pacifier with a blue ribbon and the yellow pacifier with a yellow ribbon already lie on the rug in front of Tapsi. Mama helps with the knot.",
      },
    ],
  },
  {
    id: "baum",
    title: "At the Pacifier Tree",
    step: "abgeben",
    pages: [
      {
        id: "los",
        text: "The day is here! Tapsi carries the three pacifiers to the park. Mama and Papa come too.",
        place: "park",
        light: "tag",
        cast: ["tapsi", "mama", "papa"],
        picture:
          "On the path through the park Tapsi walks between Mama and Papa and carries the red, the blue and the yellow pacifier on their ribbons in both paws; ahead of them stands the big old pacifier tree.",
      },
      {
        id: "baum",
        text: "There is the tree! So many pacifiers hang in it, from so many children.",
        place: "park",
        light: "tag",
        cast: ["tapsi", "mama", "papa"],
        picture:
          "Tapsi stands under the big old tree and looks up in wonder at the many pacifiers hanging on ribbons from its branches, the three own pacifiers still in both paws; Mama and Papa stand close behind Tapsi.",
      },
      {
        id: "rot",
        text: "Papa lifts Tapsi up. Tapsi ties the pacifiers to a branch: first the red one.",
        place: "park",
        light: "tag",
        cast: ["tapsi", "mama", "papa"],
        picture:
          "Under the tree Papa lifts Tapsi up high and Tapsi ties the red pacifier by its red ribbon to a low branch; Mama stands beside them and holds the blue and the yellow pacifier in her paw.",
      },
      {
        id: "alle",
        text: "Then the blue one and the yellow one. Now all three hang in the tree.",
        place: "park",
        light: "tag",
        cast: ["tapsi", "mama", "papa"],
        picture:
          "Tapsi stands on the ground again under the tree between Mama and Papa and looks up at the low branch where the red, the blue and the yellow pacifier hang side by side on their ribbons, among the many other pacifiers in the tree.",
      },
      {
        id: "tschuess",
        text: "Tapsi waves: “Bye-bye, pacifiers!” Mama and Papa hug Tapsi tight.",
        place: "park",
        light: "tag",
        cast: ["tapsi", "mama", "papa"],
        picture:
          "Under the tree Tapsi waves up at the branch with one paw while Mama and Papa kneel beside Tapsi and hug Tapsi from both sides; the pacifiers hang in the tree above them.",
      },
    ],
  },
  {
    id: "nacht",
    title: "The First Night",
    step: "erste-nacht",
    pages: [
      {
        id: "abend",
        text: "In the evening Tapsi wants a pacifier and cries. Mama holds Tapsi close.",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi", "mama"],
        picture: "Mama sits on the edge of the bed and holds crying Tapsi in pyjamas close in her arms, stroking Tapsi's head.",
      },
      {
        id: "lied",
        text: "Papa sings softly. Tapsi cuddles the teddy, and slowly Tapsi's eyes fall shut.",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi", "papa"],
        picture:
          "Tapsi in pyjamas lies in bed under the blanket, the small brown teddy in both arms, eyes nearly closed; Papa sits on a stool beside the bed and sings softly.",
      },
      {
        id: "stolz",
        text: "In the morning Tapsi wakes up proud: “I slept without a pacifier!”",
        place: "kinderzimmer",
        light: "morgen",
        cast: ["tapsi", "mama", "papa"],
        picture: "Tapsi in pyjamas stands on the bed with both arms up, beaming and proud, the teddy on the pillow; Mama and Papa stand at the bed and smile.",
      },
    ],
  },
  {
    id: "dabei",
    title: "A Little Easier Every Day",
    step: "dabeibleiben",
    pages: [
      {
        id: "vermisst",
        text: "Sometimes Tapsi still misses the pacifiers. Then Mama is there for a cuddle.",
        place: "wohnzimmer",
        light: "abend",
        cast: ["tapsi", "mama"],
        picture: "On the green sofa Mama holds Tapsi, a little sad, in a long cuddle; the small lamp gives warm light.",
      },
      {
        id: "besuch",
        text: "On a walk Tapsi points up into the tree: “My pacifiers live there!”",
        place: "park",
        light: "tag",
        cast: ["tapsi", "mama", "papa"],
        picture:
          "Under the big old tree Tapsi points up with one paw at the red, the blue and the yellow pacifier hanging on their ribbons on the low branch and laughs; Mama and Papa hold hands behind Tapsi.",
      },
      {
        id: "lieb",
        text: "Mama and Papa hug Tapsi: “We love you – with a pacifier and without one. Always.”",
        place: "wohnzimmer",
        light: "abend",
        cast: ["tapsi", "mama", "papa"],
        picture: "On the green sofa Mama and Papa hug Tapsi between them, all three cuddling and smiling.",
      },
    ],
  },
];

/** Every page of the story in reading order. */
export const TREE_PAGES: TreePage[] = TREE_STORY.flatMap((c) => c.pages);

/**
 * The short version's pages (user request, 23 November 2026: both stories of the book whole and short): the pacifiers,
 * the book about the tree, the day picked, the goodbye at the tree, the first night and the love at the end – read in
 * about three minutes, from the story's own pages, so it needs no picture, translation or recording of its own.
 */
export const TREE_SHORT_PAGES = ["schnuller", "buch", "kinder", "wann", "los", "rot", "alle", "tschuess", "abend", "stolz", "lieb"] as const;

/** The short version, chapter by chapter. */
export const TREE_STORY_SHORT = shortOf(TREE_STORY, TREE_SHORT_PAGES);
