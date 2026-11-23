import type { StoryChapter } from "@/components/ChapterBook";
import { WASH_STEPS, type WashStep } from "@/games/hairstory/hairStory";
import { shortOf } from "@/lib/storyPages";

// „Tapsi and the Warm Rain“ (idea H-146, 23 November 2026): the book „Hair Washing“'s second story, for families who
// have a shower and no bathtub – there it is about other things than in „Tapsi and the Foam Crown“: the shower head and
// its noise, where the child sits, and where the water comes from. Its chapters follow the same guides' steps
// (`WASH_STEPS`, research „haare-waschen“, read again for the shower on 23 November 2026): tell beforehand and listen to
// what the child doesn't like (the shower's noise, water in the eyes); practise first, here by letting the shower's
// rain run over Papa's feet; let the child join in – Tapsi sits on the shower's floor on a soft mat with Papa beside it,
// the rain comes low and from below, first on the feet, then the paws, and Tapsi holds the shower head too (Alder Hey:
// the child holds it and finds how close feels good; Welsh Government: sit with the toddler on the shower floor); keep
// the eyes dry – head back, eyes up to the fish on the tiles, the washcloth over the eyes, „Now!“, and the rain at the
// back of the head, never from above; stop at once when it is too much, and Tapsi chooses how to finish – the shower or
// the cup (CTM: let the child choose how to rinse); the warm towel and praise afterwards. Its motifs: the warm rain,
// Tapsi's foam spikes like a hedgehog's, the fish on the tiles, and the shower head Tapsi holds.
//
// The same fox family as the other chapter books, with Papa in the shower this time (Mama was in the bath). English
// first (root CLAUDE.md), translated into every app language, German too (`<language>.ts`). Played at
// `/haare-waschen/dusche/` (`ChapterBook`, `first="en"`), its short version at `/haare-waschen/dusche/kurz/`; its
// pictures come from Gemini (`hairShowerPictures.ts`).

/** Where a page plays: every place keeps its look from its reference picture on (`hairShowerPictures.ts`). */
export type Place = "wohnzimmer" | "kinderzimmer" | "dusche";

/** Who is in a page's picture: Tapsi, Mama and Papa Fuchs. */
export type Cast = "tapsi" | "mama" | "papa";

/** The light of a page. */
export type Light = "tag" | "abend";

/** One page: a picture and what the grown-up reads under it. */
export interface ShowerPage {
  /** Unique in the story, also the picture's file name (`bilder/dusche-<id>.webp`). */
  id: string;
  /** What is read aloud, English, present tense, short (checked in `hairShower.test.ts`). */
  text: string;
  place: Place;
  light: Light;
  /** Everyone in the picture, each once. */
  cast: Cast[];
  /**
   * What happens in the picture, in English, for its Gemini prompt (`hairShowerPictures.ts` adds place, cast and light).
   * Its words choose what Tapsi wears: „in the shower“, „in the towel“, „pyjamas“, else T-shirt and trousers.
   */
  picture: string;
}

/** One chapter of the story. */
export interface ShowerChapter extends StoryChapter {
  /** The step of washing gently it tells. */
  step: WashStep;
  pages: ShowerPage[];
}

export const SHOWER_STORY: ShowerChapter[] = [
  {
    id: "heute",
    title: "Sand in the Hair",
    step: "erzaehlen",
    pages: [
      {
        id: "sand",
        text: "Tapsi has sand in the hair, from the sandpit. It itches!",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "papa"],
        picture:
          "Tapsi sits on the round rug and scratches the top of the head, where sand sticks in the fur, making a funny face; Papa sits on the green sofa, leans forward and looks at it with a warm smile.",
      },
      {
        id: "sagen",
        text: "Papa says: “Tonight we wash your hair in the shower. First the feet, then the hair.”",
        place: "wohnzimmer",
        light: "abend",
        cast: ["tapsi", "papa"],
        picture:
          "Tapsi sits on the round rug and looks up at Papa; Papa sits on the green sofa, leans forward towards Tapsi and tells Tapsi something, calm and kind.",
      },
      {
        id: "laut",
        text: "“The shower is so loud,” says Tapsi. “And it rains in my eyes.” Papa listens.",
        place: "wohnzimmer",
        light: "abend",
        cast: ["tapsi", "papa"],
        picture:
          "Tapsi sits on the round rug, covers both ears with the paws and squeezes the eyes shut, a little worried; Papa sits on the green sofa, leans forward, listens closely and lays a paw gently on Tapsi's shoulder.",
      },
      {
        id: "leise",
        text: "“We make the rain soft and low,” says Papa. “And you say when.”",
        place: "wohnzimmer",
        light: "abend",
        cast: ["tapsi", "papa"],
        picture:
          "Papa sits on the green sofa and holds one paw low and flat, wiggling the fingers downwards like soft gentle rain; Tapsi sits on the round rug, watches the fingers and smiles a little.",
      },
    ],
  },
  {
    id: "fuesse",
    title: "Rain for Bunny and Papa",
    step: "ueben",
    pages: [
      {
        id: "hase",
        text: "Tapsi plays shower with Bunny. The watering can is empty, so Bunny stays dry.",
        place: "kinderzimmer",
        light: "tag",
        cast: ["tapsi"],
        picture:
          "Tapsi sits on the round rug with the plush bunny sitting in front of Tapsi and holds a small empty yellow toy watering can low over the bunny's feet, pretending to let it rain, gently, with a calm, caring little smile.",
      },
      {
        id: "papa-fuesse",
        text: "First Tapsi lets it rain on Papa's feet. “That tickles!” Papa laughs.",
        place: "dusche",
        light: "abend",
        cast: ["tapsi", "papa"],
        picture:
          "Papa sits on the low edge of the open shower with his trousers rolled up to the knees and his bare feet inside on the shower floor; Tapsi stands on the bath mat outside the shower and holds the shower head low in both paws, letting gentle water run over Papa's feet. Papa laughs, and Tapsi grins.",
      },
    ],
  },
  {
    id: "mitmachen",
    title: "Tapsi Joins In",
    step: "mitmachen",
    pages: [
      {
        id: "matte",
        text: "Tapsi sits on the soft mat in the shower. Papa kneels right beside Tapsi.",
        place: "dusche",
        light: "abend",
        cast: ["tapsi", "papa"],
        picture:
          "Tapsi in the shower sits on the soft blue mat with the little white fish on the shower floor, still dry, and looks up; Papa kneels on the bath mat at the open side of the shower, right beside Tapsi, and holds the shower head low in one hand, the water not on yet.",
      },
      {
        id: "zehen",
        text: "The rain comes low, on the toes first. Warm, not hot. Just right.",
        place: "dusche",
        light: "abend",
        cast: ["tapsi", "papa"],
        picture:
          "Tapsi in the shower sits on the soft mat and wiggles the toes; Papa kneels beside the shower and holds the shower head low, close to the floor, so a soft warm spray runs only over Tapsi's feet. Tapsi looks down at the feet, pleased.",
      },
      {
        id: "selbst",
        text: "Tapsi holds the shower too. Rain on the paws, rain on the tummy.",
        place: "dusche",
        light: "abend",
        cast: ["tapsi", "papa"],
        picture:
          "Tapsi in the shower sits on the soft mat and holds the shower head with both paws, letting a soft spray run over the own tummy, laughing; Papa kneels beside the shower, one hand lightly on the hose, smiling.",
      },
    ],
  },
  {
    id: "igel",
    title: "Tapsi the Hedgehog",
    step: "augen",
    pages: [
      {
        id: "fisch",
        text: "Head back, eyes up to the fish on the tiles. Papa brings the rain to the back.",
        place: "dusche",
        light: "abend",
        cast: ["tapsi", "papa"],
        picture:
          "Tapsi in the shower sits on the soft mat, tips the head back and looks straight up at the little orange fish sticker high on the tiles; Papa kneels beside the shower, his other hand at Tapsi's forehead, and holds the shower head low behind Tapsi, so the soft spray runs only over the back of Tapsi's head and down the back.",
      },
      {
        id: "schaum",
        text: "Tapsi rubs in the foam alone. Foam spikes all over – Tapsi is a little hedgehog!",
        place: "dusche",
        light: "abend",
        cast: ["tapsi", "papa"],
        picture:
          "Tapsi in the shower sits on the soft mat with white shampoo foam pulled up into many little pointy spikes all over the head, like a hedgehog, touching them with both paws and laughing; Papa kneels beside the shower, holds the green shampoo bottle with the apple on it and laughs too. The water is off.",
      },
      {
        id: "jetzt",
        text: "Tapsi holds the cloth over the eyes and says: “Now!” Papa counts: “One, two, three.”",
        place: "dusche",
        light: "abend",
        cast: ["tapsi", "papa"],
        picture:
          "Tapsi in the shower, still with the foam spikes, presses the small green washcloth over both eyes with both paws and leans the head back, ready; Papa kneels beside the shower, holds the shower head low behind Tapsi's head and counts on the fingers of his other hand.",
      },
      {
        id: "spuelen",
        text: "The warm rain runs down the back, and the hedgehog is gone. Tapsi's eyes stay dry.",
        place: "dusche",
        light: "abend",
        cast: ["tapsi", "papa"],
        picture:
          "Papa holds the shower head low behind Tapsi and the soft spray washes the foam off the back of Tapsi's head and down Tapsi's back; Tapsi in the shower lowers the washcloth and peeks out with dry eyes, surprised and pleased.",
      },
    ],
  },
  {
    id: "zuviel",
    title: "When It's Too Much",
    step: "pause",
    pages: [
      {
        id: "spritzer",
        text: "Another night Tapsi looks down, and the rain splashes into Tapsi's face. Tapsi cries.",
        place: "dusche",
        light: "abend",
        cast: ["tapsi", "papa"],
        picture:
          "Tapsi in the shower, with a little foam on the head, rubs the wet eyes with both paws and cries; Papa kneels beside the shower and has already turned the shower head away to the floor, reaching for Tapsi.",
      },
      {
        id: "aus",
        text: "Papa turns the water off at once and dries Tapsi's face. “You may cry. I'm here.”",
        place: "dusche",
        light: "abend",
        cast: ["tapsi", "papa"],
        picture:
          "The water is off and the shower head hangs on its holder; Papa kneels beside the shower and gently dabs Tapsi's face dry with a corner of the fluffy yellow towel; Tapsi in the shower still sniffs, a tear on the cheek, and looks at Papa.",
      },
      {
        id: "becher",
        text: "Papa asks: “The shower or the cup?” Tapsi picks the cup, and the last foam is gone.",
        place: "dusche",
        light: "abend",
        cast: ["tapsi", "papa"],
        picture:
          "Tapsi in the shower, calm again, presses the small green washcloth over the eyes and leans the head back; Papa kneels beside the shower and gently pours water from a small red cup over the back of Tapsi's head. The water of the shower is off.",
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
        text: "Out of the shower and into the warm towel. Mama wraps Tapsi up, snug and cosy.",
        place: "dusche",
        light: "abend",
        cast: ["tapsi", "mama", "papa"],
        picture:
          "Mama kneels on the bath mat in front of the shower and wraps Tapsi in the towel, hugging Tapsi close; only Tapsi's happy face and wet head fur peek out of the hood. Papa kneels beside them and smiles. The shower behind them is off.",
      },
      {
        id: "trocknen",
        text: "Papa rubs Tapsi's hair dry. Tapsi peeks out: “Am I still a hedgehog?”",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi", "papa"],
        picture:
          "Tapsi in the towel sits on the bed and Papa, sitting beside Tapsi, gently rubs Tapsi's head with the towel's hood; Tapsi peeks out from under the hood with a cheeky grin, the head fur standing up a little.",
      },
      {
        id: "stolz",
        text: "“You held the shower all by yourself,” says Mama. Tapsi is proud.",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi", "mama"],
        picture:
          "Tapsi in pyjamas sits on the bed, proud, the clean head fur soft and fluffy, and holds up the small green washcloth like a prize; Mama sits beside Tapsi on the edge of the bed and smiles warmly.",
      },
      {
        id: "lieb",
        text: "Mama and Papa love Tapsi – with sand in the hair and with clean hair.",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi", "mama", "papa"],
        picture:
          "Tapsi in pyjamas lies in bed under the blanket, sleepy and happy; Mama and Papa sit on the edge of the bed and lean over to give Tapsi a good-night kiss on the fluffy head.",
      },
    ],
  },
];

/** Every page of the story in reading order. */
export const SHOWER_PAGES: ShowerPage[] = SHOWER_STORY.flatMap((c) => c.pages);

/** The steps the story tells, in the guides' order: all of „Tapsi and the Foam Crown“'s. */
export const SHOWER_STEPS: WashStep[] = WASH_STEPS.map((s) => s.id);

/**
 * The short version's pages, about half of the story and read in a few minutes from the story's own pages, so it needs no picture, translation
 * or recording of its own: the sand, Papa saying it is hair-washing night in the shower, what Tapsi doesn't like, the
 * rain on the toes first, the fish on the tiles, the hedgehog, „Now!“ and the rinse, the splash and the water turned
 * off at once, and the love.
 */
export const SHOWER_SHORT_PAGES = ["sand", "sagen", "laut", "zehen", "fisch", "schaum", "jetzt", "spuelen", "spritzer", "aus", "lieb"] as const;

/** The short version, chapter by chapter. */
export const SHOWER_STORY_SHORT = shortOf(SHOWER_STORY, SHOWER_SHORT_PAGES);
