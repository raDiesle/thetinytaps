// The scenes of „Was ist passiert?“ (J-03): the little bear shows a feeling, and two pictures show what may have
// happened – exactly one of them leads to that feeling. Each scene is three pictures in one place (`bilder/<id>.webp`,
// `<id>-grund.webp`, `<id>-anders.webp`, made with Gemini from the `draw` texts below, `causePictures.ts`) and the
// German words for grown-ups under them. The other languages are in `scenes.<lang>.ts`, keyed by id, loaded with their
// language's texts (`src/content/texts/texts-<lang>.ts`). Plain data with no picture imports, so the picture queue can read it.

import type { Localized } from "@/lib/language";

/** The feelings the scenes show; each has its letter for the dev server's scene code („T03“). */
export type CauseFeeling = "traurig" | "wuetend" | "angst" | "froh" | "stolz" | "igitt";

/** The letter of each feeling in a scene's code on the dev server (`DevTag`). */
export const FEELING_LETTER: Record<CauseFeeling, string> = {
  traurig: "T",
  wuetend: "W",
  angst: "A",
  froh: "F",
  stolz: "S",
  igitt: "I",
};

/** One scene: the little bear's feeling, what caused it, and what didn't. */
export interface CauseScene {
  id: string;
  feeling: CauseFeeling;
  /** What the first picture shows of the feeling, under it: „Der kleine Bär weint.“ – the question follows it. */
  shows: string;
  /** The picture of what happened, as a question under its card for grown-ups to ask: „Fliegt sein Luftballon weg?“ */
  cause: string;
  /** The other picture, which leads to another feeling, asked the same way: „Pflückt er eine Blume?“ */
  other: string;
  /** Said under the cause's picture once it is found, naming the feeling: „… Darum ist er traurig.“ */
  told: string;
  /** What Gemini draws (English): the place shared by all three pictures, then each picture's moment. */
  draw: {
    place: string;
    /** The little bear alone, with the feeling plain in face and body. */
    feeling: string;
    /** A moment earlier: what happened. Names everyone else in it. */
    cause: string;
    /** A moment earlier: something else, with the bear's other feeling plain. */
    other: string;
  };
}

/** A scene's words for grown-ups in another language (`scenes.<lang>.ts`). */
export type CauseSceneText = Pick<CauseScene, "shows" | "cause" | "other" | "told">;

/** Every scene's words in one language, by scene id; a scene left out shows its German words. */
export type CauseTranslation = Partial<Record<string, CauseSceneText>>;

/** The question after what the first picture shows, the same in every scene. */
export const CAUSE_QUESTION: Localized = {
  de: "Was ist passiert?",
  en: "What happened?",
  zh: "发生了什么？",
  hi: "क्या हुआ?",
  es: "¿Qué pasó?",
  ar: "ماذا حدث؟",
  ru: "Что случилось?",
};

// The grown-ups and children who come into a cause's picture, described the same way every time.
const BIG_BEAR = "Papa, the big bear (much taller, the same warm brown fur and beige muzzle, a green knitted sweater, kind face)";
const MAMA = "Mama, a grown-up bear (much taller, the same warm brown fur and beige muzzle, a yellow dress, kind face)";
const OMA = "Grandma, an old grown-up bear (much taller, the same warm brown fur with only a little grey round her muzzle, a lilac cardigan)";
const FOX = "the little fox (orange fur, white muzzle, pointed ears, mint-green T-shirt, coral-red trousers)";
const RACCOON =
  "the little raccoon (a small raccoon child, grey fur, a black mask round the eyes, a bushy tail with dark rings, orange-and-white striped T-shirt, brown trousers)";

const CRYING = "He cries: big tears on his cheeks, his mouth wide open and turned down, brows raised in the middle, shoulders up.";
const ANGRY = "He is angry: brows pulled down hard, red cheeks, a tight frown, fists clenched at his sides, stamping one foot.";
const SCARED = "He is scared: eyes wide, mouth a small round „o“, ears back, shoulders pulled up, leaning away.";
const HAPPY = "He laughs with joy: mouth wide open, eyes squeezed into happy arcs.";
const PROUD = "He is proud: he stands tall, chest out, chin up, a big proud closed-mouth smile.";

/**
 * Every scene in the order they are played: five passes of six (`PASS_SIZE`), each mixing the feelings, the plainest
 * contrasts (crying or laughing) first.
 */
export const CAUSE_SCENES: readonly CauseScene[] = [
  // Pass 1
  {
    id: "ballon",
    feeling: "traurig",
    shows: "Der kleine Bär weint.",
    cause: "Fliegt sein Luftballon weg?",
    other: "Pflückt er eine Blume?",
    told: "Sein Luftballon fliegt weg. Darum ist er traurig.",
    draw: {
      place: "a sunny park: a green meadow, a path and one round tree",
      feeling: `He stands on the meadow and cries, looking up at the empty sky, one empty paw still raised. ${CRYING} Nothing is in his paws and nothing is in the sky.`,
      cause:
        "He looks up in dismay as a red balloon floats away above his head: its string has just slipped out of his raised paw and dangles below the balloon, out of his reach.",
      other: "He has just picked a yellow flower from the meadow and holds it up to his nose, smiling happily. No balloon anywhere.",
    },
  },
  {
    id: "oma",
    feeling: "froh",
    shows: "Der kleine Bär lacht.",
    cause: "Kommt Oma zu Besuch?",
    other: "Stößt er sich den Kopf?",
    told: "Oma kommt zu Besuch. Darum freut er sich.",
    draw: {
      place: "the open front door of a small house, a garden path with flowers leading up to it",
      feeling: `He stands in the open front door. ${HAPPY} Both arms are flung wide open. Nobody else is there.`,
      cause: `${OMA} comes up the garden path with a small basket on her arm; the little bear runs to her from the door with his arms wide open, laughing.`,
      other: "He has bumped his head on the door frame and holds it with both paws, crying, eyes squeezed shut. Nobody else is there.",
    },
  },
  {
    id: "schaufel",
    feeling: "wuetend",
    shows: "Der kleine Bär ist wütend.",
    cause: "Nimmt ihm der Waschbär die Schaufel weg?",
    other: "Füllt er seinen Eimer mit Sand?",
    told: "Der Waschbär nimmt ihm die Schaufel weg. Darum ist er wütend.",
    draw: {
      place: "a sandpit on a playground, with a small red bucket in the sand",
      feeling: `He stands in the sandpit with empty paws. ${ANGRY} Nobody else is there.`,
      cause: `${RACCOON} pulls the little bear's yellow toy shovel out of his paw and holds it up; the little bear grabs after it, cross.`,
      other: "He kneels in the sand and fills the small red bucket with his yellow toy shovel, smiling contentedly. Nobody else is there.",
    },
  },
  {
    id: "hund",
    feeling: "angst",
    shows: "Der kleine Bär hat Angst.",
    cause: "Bellt ein großer Hund?",
    other: "Landet ein Schmetterling auf seiner Pfote?",
    told: "Ein großer Hund bellt ganz laut. Darum hat er Angst.",
    draw: {
      place: "a quiet pavement beside a low wooden garden fence with a closed gate",
      feeling: `He stands on the pavement pressed back against a lamppost, looking at the garden fence. ${SCARED} Both paws are held up in front of his chest. No dog is in the picture.`,
      cause:
        "A big brown dog behind the garden fence barks at him, front paws up on the fence, mouth open – no bared teeth; the little bear jumps back with his paws up, scared.",
      other: "A small blue butterfly has landed on his raised paw and he looks at it calmly with a gentle smile. No dog anywhere.",
    },
  },
  {
    id: "kuchen",
    feeling: "froh",
    shows: "Der kleine Bär lacht und klatscht.",
    cause: "Bringt Papa einen Geburtstagskuchen?",
    other: "Fällt der Kuchen herunter?",
    told: "Papa bringt einen Geburtstagskuchen. Darum freut er sich.",
    draw: {
      place: "a kitchen with a wooden table, a few paper garlands on the wall",
      feeling: `He sits at the kitchen table wearing a paper party hat and claps his paws. ${HAPPY} Nobody else is there.`,
      cause: `${BIG_BEAR} sets a birthday cake with three lit candles on the table in front of him; the little bear in his party hat claps and laughs.`,
      other: `A birthday cake has slipped off the table and lies upside down on the floor; the little bear in his party hat looks down at it, crying. ${BIG_BEAR} stands beside him.`,
    },
  },
  {
    id: "zitrone",
    feeling: "igitt",
    shows: "Der kleine Bär verzieht das Gesicht.",
    cause: "Beißt er in eine Zitrone?",
    other: "Isst er eine Erdbeere?",
    told: "Er beißt in eine Zitrone. Die ist ganz sauer!",
    draw: {
      place: "a kitchen table with a plate of fruit: lemon slices and red strawberries",
      feeling:
        "He sits at the table and pulls the sourest face: eyes squeezed shut, lips puckered tight, his whole body shuddering, both paws in the air. Nothing is in his mouth.",
      cause: "He bites into a slice of yellow lemon he holds in his paw and pulls a very sour face, eyes squeezed shut, lips puckered.",
      other: "He bites into a big red strawberry he holds in his paw and smiles happily, eyes bright.",
    },
  },
  // Pass 2
  {
    id: "sandburg",
    feeling: "traurig",
    shows: "Der kleine Bär weint.",
    cause: "Spült eine Welle seine Sandburg weg?",
    other: "Findet er eine Muschel?",
    told: "Eine Welle spült seine Sandburg weg. Darum ist er traurig.",
    draw: {
      place: "a sunny beach at the edge of a calm sea, with a small red bucket and spade on the sand",
      feeling: `He sits on the wet sand and cries; in front of him is only a flat, smooth patch of wet sand. ${CRYING}`,
      cause:
        "A gentle wave rolls over his sandcastle and washes it away – the castle is half gone under the foam; he stares at it, paws raised, mouth open in dismay.",
      other: "He has found a big pink seashell in the sand and holds it up with both paws, smiling with delight.",
    },
  },
  {
    id: "schnee",
    feeling: "froh",
    shows: "Der kleine Bär freut sich.",
    cause: "Schneit es draußen?",
    other: "Kippt sein Kakao um?",
    told: "Draußen schneit es. Darum freut er sich.",
    draw: {
      place: "a cosy room with a big window to the garden, a mug on the windowsill",
      feeling: `He stands at the big window with both paws on the glass. ${HAPPY} Outside the garden is soft and white.`,
      cause: "Outside the window big snowflakes fall and cover the garden in white; he points at them, mouth open in delight.",
      other: "His mug of cocoa has tipped over on the windowsill and the brown cocoa runs off it; he looks at it, sad. Outside the garden is green, no snow.",
    },
  },
  {
    id: "turm",
    feeling: "wuetend",
    shows: "Der kleine Bär ist wütend.",
    cause: "Stößt der Waschbär seinen Turm um?",
    other: "Baut er einen hohen Turm?",
    told: "Der Waschbär stößt seinen Turm um. Darum ist er wütend.",
    draw: {
      place: "a playroom with a soft rug and colourful wooden blocks",
      feeling: `He stands among colourful wooden blocks scattered over the rug. ${ANGRY} Nobody else is there.`,
      cause: `${RACCOON} runs into the little bear's tall block tower, which tips over, blocks tumbling; the little bear stares at it, cross.`,
      other: "He puts one more block on top of his tall, straight block tower and smiles at it. Nobody else is there.",
    },
  },
  {
    id: "knall",
    feeling: "angst",
    shows: "Der kleine Bär erschrickt.",
    cause: "Platzt ein Luftballon?",
    other: "Bekommt er ein Stück Kuchen?",
    told: "Ein Luftballon platzt mit einem lauten Knall. Darum erschrickt er.",
    draw: {
      place: "a room decorated for a party, a few balloons tied to a chair, a small table with a cake",
      feeling: `He stands beside the chair with both paws pressed over his ears and his eyes squeezed shut. ${SCARED}`,
      cause: "A big green balloon right next to him bursts: a few small green rubber scraps fly, no red splashes; he jumps, paws to his ears, scared.",
      other: "He holds a plate with a slice of cake and smiles at it happily. All the balloons are whole.",
    },
  },
  {
    id: "rutsche",
    feeling: "stolz",
    shows: "Der kleine Bär ist stolz.",
    cause: "Klettert er ganz allein nach oben?",
    other: "Rutscht er von der Leiter ab?",
    told: "Er klettert ganz allein nach oben. Darum ist er stolz.",
    draw: {
      place: "a playground with a tall slide and its ladder, sand below",
      feeling: `He stands on the platform at the top of the tall slide. ${PROUD} Nobody else is there.`,
      cause:
        "He climbs the ladder of the tall slide all by himself, nearly at the top, holding on tight, his face proud and happy: a big smile, chin up, no frown.",
      other: "He has slipped off the ladder's lowest step and sits in the sand below it, rubbing his paw, sad.",
    },
  },
  {
    id: "teddy",
    feeling: "traurig",
    shows: "Der kleine Bär weint.",
    cause: "Fällt sein Teddy in die Pfütze?",
    other: "Springt er in die Pfütze?",
    told: "Sein Teddy fällt in die Pfütze. Darum ist er traurig.",
    draw: {
      place: "a garden after the rain with a big muddy puddle on the path and a wooden bench",
      feeling: `He stands at the edge of the puddle holding his teddy, which is wet and brown with mud. ${CRYING} He wears yellow rain boots.`,
      cause:
        "His teddy has just slipped out of his paw and falls into the muddy puddle with a splash; he reaches after it, shocked. He wears yellow rain boots.",
      other:
        "He jumps into the puddle with both feet in his yellow rain boots, laughing, muddy water splashing up round his boots; his clean teddy sits dry on the bench.",
    },
  },
  // Pass 3
  {
    id: "eis",
    feeling: "traurig",
    shows: "Der kleine Bär weint.",
    cause: "Fällt sein Eis herunter?",
    other: "Schleckt er sein Eis?",
    told: "Sein Eis fällt auf den Boden. Darum ist er traurig.",
    draw: {
      place: "a quiet street with a bench in front of a little ice cream shop with a striped awning, no lettering",
      feeling: `He sits on the bench holding an empty ice cream cone. ${CRYING}`,
      cause:
        "The pink scoop of his ice cream has just fallen off the cone and is in the air halfway to the ground; the empty cone is still in his paw; he looks down at it, shocked.",
      other: "He licks a pink scoop of ice cream on its cone, eyes closed with delight.",
    },
  },
  {
    id: "kitzeln",
    feeling: "froh",
    shows: "Der kleine Bär lacht ganz laut.",
    cause: "Kitzelt Papa ihn?",
    other: "Geht sein Spielzeugauto kaputt?",
    told: "Papa kitzelt ihn am Bauch. Darum lacht er.",
    draw: {
      place: "a living room with a soft round rug and a sofa",
      feeling: `He lies on his back on the rug, laughing so hard his eyes are squeezed shut, legs kicking in the air. ${HAPPY} Nobody else is there.`,
      cause: `${BIG_BEAR} kneels beside him on the rug and tickles his tummy; the little bear laughs and wriggles.`,
      other: "He sits on the rug holding his red toy car; one wheel has come off and lies beside it; he looks at it, sad. Nobody else is there.",
    },
  },
  {
    id: "puzzle",
    feeling: "wuetend",
    shows: "Der kleine Bär ist wütend.",
    cause: "Passt das Puzzleteil nicht?",
    other: "Ist sein Puzzle fertig?",
    told: "Das Puzzleteil passt nicht. Darum ist er wütend.",
    draw: {
      place: "a low table with a big wooden jigsaw puzzle on it",
      feeling: `He stands at the table next to the unfinished puzzle. ${ANGRY}`,
      cause: "He presses a puzzle piece hard into a gap that is too small for it; it doesn't fit; he frowns and pushes with both paws.",
      other: "He puts the very last piece into the finished puzzle, which shows a big smiling sun, and throws up his arms, beaming.",
    },
  },
  {
    id: "staubsauger",
    feeling: "angst",
    shows: "Der kleine Bär hält sich die Ohren zu.",
    cause: "Brummt der Staubsauger laut?",
    other: "Bringt Papa ihm einen Kakao?",
    told: "Der Staubsauger brummt ganz laut. Darum hat er Angst.",
    draw: {
      place: "a living room with a rug and a sofa",
      feeling: `He kneels on the sofa with both paws pressed over his ears. ${SCARED} Nobody else is there.`,
      cause: `${BIG_BEAR} vacuums the rug with a big vacuum cleaner; the little bear on the sofa covers his ears, scared.`,
      other: `${BIG_BEAR} hands him a cup of warm cocoa; the little bear on the sofa takes it with both paws, smiling. No vacuum cleaner anywhere.`,
    },
  },
  {
    id: "glas",
    feeling: "stolz",
    shows: "Der kleine Bär ist stolz.",
    cause: "Gießt er sich allein Wasser ein?",
    other: "Läuft das Glas über?",
    told: "Er gießt sich ganz allein Wasser ein. Darum ist er stolz.",
    draw: {
      place: "a kitchen table with a small jug of water and a glass",
      feeling: `He stands at the table holding up a full glass of water. ${PROUD} The table is dry.`,
      cause: "He pours water from the small jug into his glass all by himself, carefully, the tip of his tongue out in concentration; not a drop is spilled.",
      other: "His glass has overflowed: water runs over the table and drips onto the floor; he looks at it, upset.",
    },
  },
  {
    id: "windel",
    feeling: "igitt",
    shows: "Der kleine Bär hält sich die Nase zu.",
    cause: "Wickelt Mama das Baby?",
    other: "Riecht er an einer Blume?",
    told: "Die Windel vom Baby stinkt. Igitt!",
    draw: {
      place: "a bright bathroom with a changing table",
      feeling:
        "He stands by the changing table holding his nose with one paw and pulling a face, tongue out, waving the other paw in front of his nose. Nobody else is there.",
      cause: `${MAMA} changes the nappy of a tiny baby bear in a yellow romper on the changing table; the little bear beside them holds his nose and pulls a face.`,
      other: `${MAMA} holds a pink flower out to him; he sniffs it with his eyes closed, smiling.`,
    },
  },
  // Pass 4
  {
    id: "abschied",
    feeling: "traurig",
    shows: "Der kleine Bär weint.",
    cause: "Winkt Mama zum Abschied?",
    other: "Kommt sein Freund zum Spielen?",
    told: "Mama geht zur Arbeit. Darum ist er traurig.",
    draw: {
      place: "a kindergarten cloakroom with coat hooks and a big window to the street",
      feeling: `He stands at the window with both paws on the glass. ${CRYING} Outside the street is empty.`,
      cause: `Outside the window, on the street, ${MAMA} waves goodbye as she walks away; inside, the little bear waves back at the window, his face sad.`,
      other: `${FOX} comes running in with a ball, and the little bear runs to him, smiling.`,
    },
  },
  {
    id: "seifenblasen",
    feeling: "froh",
    shows: "Der kleine Bär lacht.",
    cause: "Macht Mama Seifenblasen?",
    other: "Regnet es ganz doll?",
    told: "Mama macht große Seifenblasen. Darum freut er sich.",
    draw: {
      place: "a sunny garden with a lawn and a hedge",
      feeling: `He stands on the lawn reaching up with both paws. ${HAPPY} Nobody else is there.`,
      cause: `${MAMA} blows big shimmering soap bubbles with a bubble wand; they float round the little bear and he reaches for them, laughing.`,
      other:
        "It pours with rain from dark clouds; he stands on the lawn still in his light-blue T-shirt and dark blue trousers, wet through, sad. Nobody else is there.",
    },
  },
  {
    id: "schaukel",
    feeling: "wuetend",
    shows: "Der kleine Bär ist wütend.",
    cause: "Will der Waschbär nicht von der Schaukel?",
    other: "Schaukelt er ganz hoch?",
    told: "Der Waschbär will nicht von der Schaukel. Darum ist er wütend.",
    draw: {
      place: "a playground with one swing on a wooden frame",
      feeling: `He stands next to the empty swing. ${ANGRY} Nobody else is there.`,
      cause: `${RACCOON} sits on the swing and swings, turning away; the little bear waits beside it with his paw held out, cross.`,
      other:
        "He swings high on the swing himself, laughing, his feet up in the air. Nobody else is there: no raccoon, no tail, nobody else on or under the swing.",
    },
  },
  {
    id: "dunkel",
    feeling: "angst",
    shows: "Der kleine Bär hat Angst.",
    cause: "Geht das Licht aus?",
    other: "Liest Papa ihm vor?",
    told: "Das Licht geht aus, und es ist ganz dunkel. Darum hat er Angst.",
    draw: {
      place: "his bedroom at night: his bed, a bedside table with a little night lamp, a window with the moon",
      feeling: `He sits up in bed in light-blue pyjamas, pulling the blanket up to his nose. ${SCARED} The room is dim. Nobody else is there.`,
      cause:
        "The night lamp on the bedside table has just gone out; the room is dark blue, lit only by the moon; he peers out from under the blanket in light-blue pyjamas, scared.",
      other: `In the warm light of the night lamp ${BIG_BEAR} sits on the edge of the bed and reads him a picture book; the little bear in light-blue pyjamas snuggles in, smiling.`,
    },
  },
  {
    id: "ball",
    feeling: "stolz",
    shows: "Der kleine Bär ist stolz.",
    cause: "Fängt er den Ball?",
    other: "Fliegt ihm der Ball an den Kopf?",
    told: "Er fängt den Ball. Darum ist er stolz.",
    draw: {
      place: "a garden lawn with a hedge",
      feeling: `He stands on the lawn holding a big red ball up above his head with both paws. ${PROUD} Nobody else is there.`,
      cause: `${BIG_BEAR} has thrown the big red ball, and the little bear has just caught it: he holds the ball tight against his chest with both paws, smiling. The panel has no frame or border.`,
      other: `The big red ball has bounced off his head; he holds his head, crying. ${BIG_BEAR} hurries to him.`,
    },
  },
  {
    id: "laufrad",
    feeling: "traurig",
    shows: "Der kleine Bär weint und hält sein Knie.",
    cause: "Fällt er mit dem Laufrad um?",
    other: "Fährt er schnell mit dem Laufrad?",
    told: "Er fällt mit dem Laufrad um. Sein Knie tut weh. Darum weint er.",
    draw: {
      place: "a park path between grass and bushes",
      feeling: `He sits on the path holding his knee with both paws; his little red balance bike lies on its side beside him. ${CRYING}`,
      cause: "His red balance bike tips over sideways and he is falling off it towards the path, arms out, a startled face. Gentle, no injuries.",
      other: "He rides his red balance bike along the path, both feet lifted, laughing, his ears blown back by the wind.",
    },
  },
  // Pass 5
  {
    id: "drachen",
    feeling: "traurig",
    shows: "Der kleine Bär weint.",
    cause: "Hängt sein Drachen im Baum fest?",
    other: "Fliegt sein Drachen hoch in den Himmel?",
    told: "Sein Drachen bleibt im Baum hängen. Darum ist er traurig.",
    draw: {
      place: "a windy meadow with one tall tree",
      feeling: `He stands under the tall tree holding a string that leads up into the tree's crown. ${CRYING}`,
      cause: "His red and yellow kite flies into the crown of the tall tree and is caught in its branches; he pulls at the string, dismayed.",
      other: "His red and yellow kite flies high in the blue sky, far away from the tree; he holds the string and laughs.",
    },
  },
  {
    id: "enten",
    feeling: "froh",
    shows: "Der kleine Bär freut sich.",
    cause: "Schwimmen Entenküken zu ihm?",
    other: "Fällt seine Mütze ins Wasser?",
    told: "Kleine Entenküken schwimmen zu ihm. Darum freut er sich.",
    draw: {
      place: "the grassy edge of a small pond with reeds",
      feeling: `He kneels at the edge of the pond. ${HAPPY} He wears a red cap.`,
      cause: "A mother duck and three yellow ducklings swim up to him in a row; he holds out his paw to them, delighted. He wears a red cap.",
      other: "His red cap has blown off his head and floats away on the pond; he reaches after it, sad. No ducks anywhere.",
    },
  },
  {
    id: "schuh",
    feeling: "wuetend",
    shows: "Der kleine Bär ist wütend.",
    cause: "Geht sein Schuh nicht an?",
    other: "Findet er sein Spielzeugauto?",
    told: "Sein Schuh will nicht an den Fuß. Darum ist er wütend.",
    draw: {
      place: "a hallway by the front door with a low bench and a shoe rack",
      feeling: `He sits on the floor of the hallway, one blue shoe on his foot and the other lying beside him. ${ANGRY}`,
      cause: "He pulls hard at a blue shoe that won't go onto his foot – its heel is folded under; his face is strained and cross.",
      other:
        "He has just pulled his red toy car out from under the bench and holds it up with both paws, delighted. The floor under the bench is empty now: no car, no toy there – the ONE car is in his paws.",
    },
  },
  {
    id: "feuerwehr",
    feeling: "angst",
    shows: "Der kleine Bär hält sich die Ohren zu.",
    cause: "Fährt die Feuerwehr laut vorbei?",
    other: "Setzt sich ein Vogel auf den Zaun?",
    told: "Die Feuerwehr fährt mit lautem Tatütata vorbei. Darum erschrickt er.",
    draw: {
      place: "a pavement by a street with a little white fence",
      feeling: `He stands on the pavement with both paws pressed over his ears. ${SCARED} The street is empty.`,
      cause: "A red fire engine with flashing blue lights races past on the street, no lettering on it; he covers his ears, scared.",
      other: "A little robin sits on the white fence beside him and he looks at it with a smile. The street is empty.",
    },
  },
  {
    id: "bild",
    feeling: "wuetend",
    shows: "Der kleine Bär ist wütend.",
    cause: "Kritzelt der Waschbär auf sein Bild?",
    other: "Malt er eine Sonne?",
    told: "Der Waschbär kritzelt auf sein Bild. Darum ist er wütend.",
    draw: {
      place: "a low table with paper and crayons",
      feeling: `He stands at the table holding up his drawing, which has wild purple scribbles all over it. ${ANGRY}`,
      cause: `${RACCOON} scribbles with a purple crayon all over the little bear's drawing on the table; the little bear sees it, paws out, cross.`,
      other: "He draws a big yellow sun on his paper with a yellow crayon and smiles at it. Nobody else is there.",
    },
  },
  {
    id: "spinne",
    feeling: "angst",
    shows: "Der kleine Bär hat Angst.",
    cause: "Hängt eine große Spinne vor ihm?",
    other: "Gießt er die Blumen?",
    told: "Eine große Spinne hängt vor seiner Nase. Darum hat er Angst.",
    draw: {
      place: "a garden by a wooden shed with a flower bed",
      feeling: `He stands by the shed leaning back. ${SCARED} Both paws are up in front of his face.`,
      cause: "A big black spider lowers itself on its thread right in front of his face from the shed's roof; he leans back, scared.",
      other: "He waters the flower bed with a small green watering can, smiling. No spider anywhere.",
    },
  },
];

/** How many scenes one play-through has: its dots at the top, then „Nochmal“ and „Weiter“. */
export const PASS_SIZE = 6;

/** The scenes in passes of `PASS_SIZE`, in the order they are played. */
export const CAUSE_PASSES: readonly (readonly CauseScene[])[] = Array.from({ length: Math.ceil(CAUSE_SCENES.length / PASS_SIZE) }, (_, i) =>
  CAUSE_SCENES.slice(i * PASS_SIZE, (i + 1) * PASS_SIZE),
);

/** The scene's code on the dev server: its feeling's letter and its number among that feeling's scenes („T03“). */
export function sceneCode(scene: CauseScene): string {
  const number = CAUSE_SCENES.filter((s) => s.feeling === scene.feeling).indexOf(scene) + 1;
  return `${FEELING_LETTER[scene.feeling]}${String(number).padStart(2, "0")}`;
}

/**
 * Whether the cause's card stands on the left: mixed from scene to scene but fixed for each, so a child can't learn a
 * side and feedback about a scene always means the same card.
 */
export function causeOnLeft(scene: CauseScene): boolean {
  let hash = 0;
  for (const c of scene.id) hash = (hash * 31 + c.charCodeAt(0)) >>> 0;
  return hash % 2 === 0;
}

/** The names of a scene's three pictures in `bilder/` (without .webp). */
export const sceneImages = (id: string) => ({ feeling: id, cause: `${id}-grund`, other: `${id}-anders` });
