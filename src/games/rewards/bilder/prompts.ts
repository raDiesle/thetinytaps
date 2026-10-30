import type { PicturePrompt, PicturePromptSet } from "@/content/picturePrompts";
import { ACTIVITIES, MARKS, REWARDS, TASKS, THEMES } from "../catalog";

// Every picture the Belohnungstafel may get, as prompts for the grown-up to check on
// /management/ (Bildvorschläge) before any is made. All of them were made on 30 October 2026 (the user asked for them before
// reviewing) and show in place of the catalogue's emoji (pictures.tsx). Tapsi is the fox of
// „Aufs Töpfchen“, drawn after its first picture so it looks the same.

const DIR = "src/games/rewards/bilder";

/** The style block of /bild-erzeugen, without the background line (the stickers are cut out). */
const STYLE =
  "Children's picture-book illustration for 2–4 year olds. Soft, flat, rounded shapes with thick dark-purple outlines (#2a1e5c), bright friendly colours, gentle shading. No text, no letters, no numbers, no speech bubbles, no frames.";

/** Tapsi as in the potty story, word for word the same every time. */
const TAPSI =
  "Tapsi, a little fox cub (a toddler): orange fur, white muzzle and white belly, big dark eyes, pointy ears, a bushy tail with a white tip, wearing a light blue T-shirt and blue trousers";
const MAMA = "Mama fox, a grown-up fox with a yellow sweater and a small red flower behind one ear";
const PAPA = "Papa fox, a grown-up fox with a green sweater and round glasses";

/** Tapsi's first picture, for its look only. */
const TAPSI_REF = "src/games/potty/bilder/fox-essen.webp";
const REF_ONLY = "Use the reference picture only for how the fox looks and for the drawing style, not for the place or the pose. ";

/**
 * A task or reward picture: one action a two-year-old knows at a glance, small enough for a field. Free-standing, never
 * „inside a circle“: asked for a round sticker, Gemini drew a disc that kept the magenta of the cut-out backdrop, or a
 * white ring, or a small circle on a white square.
 */
const STICKER =
  "One clear action a two-year-old recognises at a glance, only the few things the action needs, drawn as a free-standing cut-out illustration that fills most of the picture: no circle, disc, ring, frame or background shape behind it, no floor patch, nothing pink or magenta.";

/** What Tapsi does on each task's picture, by catalogue id. */
const TASK_ACTIONS: Record<string, string> = {
  zaehne: "stands at a small sink and brushes its teeth with a green toothbrush, a little white foam at the mouth, happy eyes",
  toepfchen: "sits proudly on a small round turquoise potty, trousers down at the ankles, the T-shirt covers the tummy, only fur shows, smiling",
  anziehen: "pulls its light blue T-shirt over its head, the head just coming out of the collar, one arm already in a sleeve",
  bett: "sleeps peacefully in its own small bed under a yellow blanket, hugging a soft toy rabbit, a small moon in the corner",
  haende: "washes its paws at a small sink, lots of soap bubbles, water running from the tap",
  aufraeumen: "puts colourful toy blocks and a teddy bear into a red toy box, smiling",
  schuhe: "sits on the floor and pulls on a red shoe with a velcro strap, the other red shoe beside it",
  jacke: "puts on a yellow rain jacket, one arm in the sleeve, reaching for the other",
  probieren: "holds a fork with one small piece of broccoli in front of its open mouth, curious and brave",
  essen: "sits at a little table and eats soup by itself with a spoon, a bowl in front of it",
  tisch: "carries a plate and a cup carefully with both paws, proud, tongue a little out in concentration",
  baden: "sits in a bathtub full of foam and plays with a yellow rubber duck",
  haare:
    "sits in a small bathtub with foam on its head, holding a small washcloth over its eyes, smiling, while a few light blue water drops from a hand shower rinse the foam; the whole bathtub fits in the picture",
  nase: "blows its nose into a white tissue held with both paws, eyes closed",
  eincremen: "rubs white cream onto its arm, a small cream bottle next to it",
  anschnallen: "sits in a child car seat and clicks the buckle shut, smiling",
  hand: `walks on a pavement holding the paw of ${MAMA}, seen from the side, both smiling`,
  abschied: "waves goodbye with a big smile, a little backpack on its back, an open door behind it",
  helfen: "waters a flower pot with a small green watering can",
};

/** Tasks parents asked for that the catalogue has no emoji for yet; pictures would let them in. */
const MORE_TASKS: { id: string; use: string; action: string }[] = [
  {
    id: "schnuller",
    use: "Schnuller abgeben (fehlt im Katalog, es gibt kein Emoji dafür)",
    action: "puts its dummy (pacifier) into a small gift box with a ribbon, proud",
  },
  { id: "schlafanzug", use: "Schlafanzug anziehen (fehlt im Katalog)", action: "pulls on striped pyjama trousers, sitting on the edge of a bed" },
  { id: "kaemmen", use: "Haare kämmen (fehlt im Katalog)", action: "combs the fur on its head with a small comb in front of a round mirror" },
  { id: "trinken", use: "Wasser trinken (fehlt im Katalog)", action: "drinks from a small cup with both paws, eyes happily closed" },
];

/** What Tapsi does on each card of the Tagesplan, by activity id: one moment of the day a toddler knows. */
const ACTIVITY_ACTIONS: Record<string, string> = {
  aufstehen: "sits up in a small wooden bed with a pillow and a yellow blanket over its legs, stretching both arms up with a big yawn; the whole bed shows",
  fruehstueck: "sits at a little table eating cereal from a bowl with a spoon, a glass of milk next to it",
  kita: "walks happily towards a small colourful kindergarten building with a little backpack on its back",
  mittagessen: "sits at a little table with a plate of noodles and vegetables, holding a fork",
  mittagsschlaf: "naps on a small mattress under a light blanket in daylight, hugging a soft toy rabbit",
  draussen: "runs across a green meadow under a tree, arms out, a ball in front of it",
  spielplatz: "sits on a swing on a playground, laughing, a small slide behind it",
  spielen: "builds a tower of colourful wooden blocks on the floor, concentrating",
  malen: "paints with a thick brush on a sheet of paper on a little table, colourful blobs on the paper",
  abendessen: "sits at a table in the evening eating a slice of bread, a small lamp hanging above (just the lamp, no light rays or glow)",
  vorlesen: `sits on the lap of ${PAPA} in an armchair, both looking at a picture book (the pages show only pictures)`,
  schlafen: "sleeps in its bed under a blue blanket at night, a crescent moon and stars in the window",
  oma: "hugs a kind grandmother fox with grey fur, round glasses and a knitted cardigan, both smiling",
  freunde: "stands hand in hand with a little white rabbit friend and a little brown bear friend, all three side by side and laughing",
  einkaufen: "sits in the seat of a shopping trolley full of fruit and vegetables, holding a banana",
  ausflug: "walks along a forest path with a small backpack and a little water bottle, pointing ahead",
  schwimmen: "jumps into a small round children's pool wearing orange water wings, splashing; the whole pool fits in the picture",
  turnen: "does a forward roll on a blue gym mat, a small ball and a balance beam nearby",
  musik: "plays a small drum with two sticks, music notes in the air",
  arzt: "sits on an examination table while a friendly doctor bear with a stethoscope listens to its chest, Tapsi smiling",
};

/** What Tapsi (and its parents) do on each reward's picture, by catalogue id. */
const REWARD_SCENES: Record<string, string> = {
  spielplatz: `${TAPSI} slides down a small yellow slide on a playground, arms up, laughing; ${PAPA} waits at the bottom with open arms`,
  buch: `${TAPSI} cuddles on a sofa with ${MAMA}, who reads a big picture book to Tapsi (the open pages show only pictures)`,
  backen: `${TAPSI} bakes with ${PAPA}: both wear small aprons, Tapsi stirs a bowl of dough, a tray of cupcakes next to them`,
  kuscheln: `${TAPSI} gets a big hug from ${MAMA} and ${PAPA}, all three with eyes closed and happy smiles`,
  hoehle: `${TAPSI} peeks out of a cosy blanket fort made of two chairs and a big blanket, fairy lights inside`,
  seifenblasen: `${TAPSI} blows big shiny soap bubbles outside on a meadow, bubbles everywhere`,
  tanzen: `${TAPSI} dances with ${MAMA} in a living room, both spinning with arms out, a few music notes in the air`,
  malen: `${TAPSI} paints with a big brush on a large sheet of paper together with ${PAPA}, colourful blobs and a sun on the paper`,
  picknick: `${TAPSI} has a picnic with ${MAMA} and ${PAPA} on a red and white checked blanket in a meadow, a basket, apples and sandwiches`,
  laufrad: `${TAPSI} rides a small red balance bike without pedals, wearing a helmet, ${PAPA} walking behind`,
  freunde: `${TAPSI} plays in a sandpit with a little rabbit friend, both building a sandcastle and laughing`,
  zoo: `${TAPSI} stands at a low wooden fence at the zoo, holding the paw of ${MAMA}, and looks up at a friendly giraffe`,
  schwimmen: `${TAPSI} splashes in a children's pool wearing orange water wings, ${PAPA} in the water next to it`,
  eis: `${TAPSI} holds an ice cream cone with one pink scoop and licks it happily`,
};

/** Each mark as a sticker, by catalogue id. */
const MARK_LOOKS: Record<string, string> = {
  stern: "a big golden star with a happy face: two dot eyes, a smile, rosy cheeks",
  herz: "a plump red heart with a happy face: two dot eyes, a smile",
  blume: "a pink flower with five round petals and a yellow middle with a happy face",
  sonne: "a round yellow sun with short rounded rays and a happy face",
  kaefer: "a cute red ladybird with black dots, seen from above, with a smiling face",
  schmetterling: "a colourful butterfly with round wings in pink, yellow and blue, seen from the front, smiling",
  pfote: "a single orange fox paw print, round and soft",
  smiley: "a round yellow face with a big smile and closed happy eyes",
};

/** What decorates the top of a printed board, by theme id. */
const THEME_LOOKS: Record<string, string> = {
  sonne: "a sunny sky: a smiling sun on the left, small white clouds and a few birds",
  meer: "the sea: soft blue waves along the bottom, a little fish jumping, a sailing boat and a seagull",
  wiese: "a meadow: green grass along the bottom with daisies, a ladybird and a butterfly",
  beere: "berries: strawberries, raspberries and blueberries with green leaves scattered along the strip",
  nacht: "a calm night: a smiling crescent moon, small stars and soft clouds on dark blue",
};

const task = (id: string, use: string, action: string): PicturePrompt => ({
  id: `aufgabe-${id}`,
  file: `${DIR}/aufgabe-${id}.webp`,
  use,
  prompt: `${REF_ONLY}${STYLE} ${STICKER} ${TAPSI}, ${action}. Tapsi is the only character.`,
  // At least 600 px, so a card is still sharp as a 5 cm photo print at 300 dpi.
  options: "--transparent --size 768",
  ref: [TAPSI_REF],
});

const TASK_PROMPTS = [
  ...TASKS.map((t) => task(t.id, `Aufgabe „${t.label.de}“ (statt ${t.emoji})`, TASK_ACTIONS[t.id])),
  ...MORE_TASKS.map((t) => task(t.id, t.use, t.action)),
];

/** The cards of the Tagesplan: like a task's picture, a moment Tapsi lives through. */
const STEP_PROMPTS: PicturePrompt[] = ACTIVITIES.map((a) => ({
  ...task(a.id, `Tagesplan-Karte „${a.label.de}“ (statt ${a.emoji})`, ACTIVITY_ACTIONS[a.id]),
  id: `schritt-${a.id}`,
  file: `${DIR}/schritt-${a.id}.webp`,
}));

const REWARD_PROMPTS: PicturePrompt[] = REWARDS.map((r) => ({
  id: `belohnung-${r.id}`,
  file: `${DIR}/belohnung-${r.id}.webp`,
  use: `Belohnung „${r.label.de}“ (statt ${r.emoji}), im Ziel-Feld und beim Fest`,
  prompt: `${REF_ONLY}${STYLE} ${STICKER} ${REWARD_SCENES[r.id]}. Nobody else.`,
  options: "--transparent --size 768",
  ref: [TAPSI_REF],
}));

/**
 * Line-art twins for black-and-white prints with „Felder zum Ausmalen“: the colour picture redrawn as outlines. When
 * made, the reference is the colour picture flattened onto white (the cut-out's transparent parts might come out black).
 */
const lineArt = (picture: PicturePrompt): PicturePrompt => ({
  id: `${picture.id}-linie`,
  file: picture.file.replace(".webp", "-linie.webp"),
  use: `Ausmalfassung von ${picture.id}`,
  prompt:
    "Redraw this exact picture as a colouring page for toddlers: only clean, thick, even black outlines on pure white, no colour, no grey, no shading, no filled areas. Keep every character, pose and thing exactly as it is, the same framing. No text, no letters.",
  options: "--size 768",
  ref: [picture.file],
});

/** All picture prompts of the Belohnungstafel, shown on /management/. */
export const REWARDS_PICTURE_PROMPTS: PicturePromptSet = {
  id: "belohnungstafel",
  emoji: "🌟",
  title: "Belohnungstafel",
  date: "2026-10-28",
  intro:
    "Bilder, die die Emoji der Belohnungstafel ersetzen könnten – auf dem Bildschirm und im Ausdruck. Tapsi ist der Fuchs aus „Aufs Töpfchen“ (dessen erstes Bild ist die Referenz). Prüfen: Erkennt ein Zweijähriger die Aufgabe ohne Worte? Passt die Belohnung (Zeit zusammen)? Fehlt eine Aufgabe? Alle erzeugt am 30. Oktober 2026 (src/games/rewards/bilder/) und eingebaut; nur das Vorschaubild „tafel“ wartet noch auf eigene Vorschaubilder je Seite. Ein geändertes Bild wird einzeln neu erzeugt (Batch, je Bild etwa 2 Cent).",
  groups: [
    {
      title: "Aufgaben",
      note: "Freigestellt (transparent), 768 px (scharf auch als Fotoabzug). Jede Aufgabe des Katalogs, dazu vier, für die es kein Emoji gibt.",
      prompts: TASK_PROMPTS,
    },
    {
      title: "Tagesplan-Karten",
      note: "Freigestellt, 768 px: die Schritte eines Tages (Essen, Kita, Schlafen …) für den Tagesplan und seine Bildkarten zum Ausschneiden; Aufgaben wie Zähne putzen nehmen die Bilder oben.",
      prompts: STEP_PROMPTS,
    },
    { title: "Belohnungen", note: "Freigestellt, 768 px: im Ziel-Feld groß und beim Fest bildschirmfüllend.", prompts: REWARD_PROMPTS },
    {
      title: "Zeichen fürs Feld (Sticker)",
      note: "Freigestellt, 256 px; als 2×2-Raster billiger (--grid 2x2, je vier in einem Bild). Auch für den Ausschneidebogen.",
      prompts: MARKS.map((m) => ({
        id: `zeichen-${m.id}`,
        file: `${DIR}/zeichen-${m.id}.webp`,
        use: `Zeichen „${m.label.de}“ (statt ${m.emoji}) im Feld und auf dem Ausschneidebogen`,
        prompt: `${STYLE} A single sticker: ${MARK_LOOKS[m.id]}. Centred, nothing else.`,
        options: "--transparent --size 256",
      })),
    },
    {
      title: "Tapsi feiert",
      prompts: [
        {
          id: "fest",
          file: `${DIR}/fest.webp`,
          use: "Das große Fest, wenn das Ziel erreicht ist (statt 🎉 ohne Belohnung)",
          prompt: `${REF_ONLY}${STYLE} ${TAPSI}, jumps for joy with both arms up, mouth wide open laughing, colourful confetti and small golden stars falling all around. Tapsi is the only character.`,
          options: "--transparent --size 768",
          ref: [TAPSI_REF],
        },
        {
          id: "stern-halten",
          file: `${DIR}/stern-halten.webp`,
          use: "Der große Stern, den das Kind antippt, gehalten von Tapsi; auch Kopf von „Über die Tafel“",
          prompt: `${REF_ONLY}${STYLE} ${TAPSI}, holds a big shining golden star high above its head with both paws, proud and happy. Tapsi is the only character.`,
          options: "--transparent --size 768",
          ref: [TAPSI_REF],
        },
        {
          id: "tafel",
          file: `${DIR}/tafel.webp`,
          use: "Vorschaubild für Suchmaschinen und Links (og:image) und für die Seite /belohnungstafel/",
          prompt: `${REF_ONLY}${STYLE} Simple, uncluttered background. ${TAPSI}, stands next to a big chart on a wall and points at it happily. The chart is a grid of round fields, some with golden stars, some still empty; small pictures of a toothbrush and a potty mark its rows. No writing anywhere on the chart. Tapsi is the only character. Wide picture with calm space around.`,
          options: "--aspect 16:9 --size 1200x630",
          ref: [TAPSI_REF],
        },
      ],
    },
    {
      title: "Schmuck für den Ausdruck",
      note: "Ein schmaler Streifen oben auf der gedruckten Tafel, je Farbe einer; nur im Farbdruck.",
      prompts: THEMES.map((th) => ({
        id: `streifen-${th.id}`,
        file: `${DIR}/streifen-${th.id}.webp`,
        use: `Streifen für die Farbe ${th.label.de}`,
        prompt: `Children's picture-book illustration for 2–4 year olds. Soft, flat, rounded shapes with thick dark-purple outlines (#2a1e5c), bright friendly colours, gentle shading. No text, no letters, no numbers. A long, narrow decorative strip showing ${THEME_LOOKS[th.id]}, evenly spread from left to right, nothing important at the very ends (they may be cut off). The scene fills the whole picture from edge to edge: no border, margin, frame, outline round the strip or rounded corners.`,
        options: "--aspect 21:9 --size 1680x420",
      })),
    },
    {
      title: "Zum Ausmalen (Schwarz-weiß-Druck)",
      note: "Jedes Aufgaben-, Tagesplan- und Belohnungsbild noch einmal als Ausmalbild, mit dem farbigen als einziger Referenz – erst nachdem das farbige gelungen ist.",
      prompts: [...TASK_PROMPTS, ...STEP_PROMPTS, ...REWARD_PROMPTS].map(lineArt),
    },
  ],
};
