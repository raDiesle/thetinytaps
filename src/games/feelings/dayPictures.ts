import type { QueuedPicture } from "@/content/pictureQueue";
import { ALLTAG_DRAWINGS } from "./alltagDrawings";
import { type Figure, FIGURES } from "./storyPictures";

// The pictures of the days' pages of the story (`days.ts`, user idea, November 2026), as the picture queue takes them
// until they are made (`/bild-erzeugen`, never made on your own); a made one leaves the list, its prompt kept in
// `bilder/README.md` („Tagesgeschichten“). All 39 were made on 4 November 2026: a new page joins with `dayPage`. Each page shows a moment a little *before* the scene
// it leads to, in that scene's place: so it is drawn from that scene's first picture (`firstImage`) as its only `--ref`,
// keeping the place and the look of everyone, and only what the characters do changes – nothing has happened yet, all
// are calm. The night that ends every day is the little bear's room at night. Plain data, with no picture imports, so
// the management page that lists the queue doesn't load the game's pictures; `feelings.test.ts` checks that every page
// still to make has its entry here, drawn from its scene's first picture. Tag 9 to Tag 15 (the everyday scenes of
// alltag.ts, 11 November 2026) wait here until their scenes' first pictures are made.

const DIR = "src/games/feelings/bilder";

/** The start of every page's prompt: the scene's place a little earlier, nothing has happened yet. */
const EARLIER =
  "Redraw this exact picture as a moment a little EARLIER on the same day, before anything in it has happened. Keep the place exactly as it is: the same background, walls, windows, sky, ground, trees, furniture and objects at the same places, the same camera framing (no zoom, no shift), the same colours and line style. Only the characters' poses, faces and places change, and who is there.";

/** The end of every page's prompt: calm and happy, no feeling of the scene yet. */
const CALM = "Everyone is calm and content: nobody cries, nobody is angry or scared. No speech bubbles. No text, no letters.";

/**
 * A page before scene `scene` of day `day`, drawn from `ref` (the scene's first picture, without folder and .webp):
 * `cast` names everyone in it, `action` what they do. Ten of the first 39 got a double of someone („only ONE of each“).
 */
export function dayPage(day: number, scene: number, ref: string, use: string, cast: string, action: string, date = "2026-11-04"): QueuedPicture {
  const id = `tag${day}-${scene}`;
  return {
    id,
    file: `${DIR}/${id}.webp`,
    use: `Gefühle, „Alltagssituationen“, Tag ${day}: ${use}`,
    prompt: `${EARLIER} In the picture, each exactly once: ${cast}. Nobody else: only ONE of each in the whole picture, nobody more in a doorway, on the furniture or peeking in from an edge. Now this happens: ${action} ${CALM}`,
    aspect: "4:3",
    size: "1200x900",
    quality: 65,
    ref: [`${DIR}/${ref}.webp`],
    alone: "story picture",
    date,
  };
}

/** Everyone in a page of an everyday scene: characters of `FIGURES`, or the n-th of that scene's own cast (the hairdresser …). */
const who = (...cast: (Figure | [string, number])[]) =>
  cast.map((f) => (Array.isArray(f) ? (ALLTAG_DRAWINGS.find((d) => d.id === f[0])?.cast[f[1]] ?? "") : (FIGURES[f as keyof typeof FIGURES] ?? f))).join("; ");

/** A page before an everyday scene of alltag.ts, drawn from that scene's first picture. */
const everyday = (day: number, scene: number, story: string, use: string, cast: string, action: string) =>
  dayPage(day, scene, `${story}-passiert`, use, cast, action, "2026-11-11");

/** Every page of the days' stories and the night still to make. */
export const DAY_PICTURE_QUEUE: QueuedPicture[] = [
  // Tag 9: morning, breakfast, kindergarten, nap, pick-up.
  everyday(
    9,
    1,
    "morning",
    "der kleine Bär wacht auf",
    who("bear"),
    "Early morning, the curtain still closed. The little bear lies in his bed under the blue blanket and just opens his eyes, calm and sleepy, with a small smile. The red alarm clock stands on the bedside table, the slippers lie in front of the bed. The doorway is empty: the bear baby is not in the picture.",
  ),
  everyday(
    9,
    2,
    "bluecup",
    "der große Bär deckt den Tisch",
    who("bear", "bigBear"),
    "The big bear puts the bowl of porridge and the spoon on the table, smiling. The little bear comes into the kitchen and climbs onto his chair, happy. The red cup on the table is still empty, the empty blue cup stands by the sink, the milk jug stands on the table.",
  ),
  everyday(
    9,
    3,
    "sticky",
    "der Fuchs malt schon am Tisch",
    who("bear", "fox"),
    "The fox sits at the painting table and paints his yellow sun with his finger, happy. The little bear just comes to the table, his paws still clean, and looks at the paint, curious and smiling. His sheet lies white and empty in front of his place.",
  ),
  everyday(
    9,
    4,
    "accident",
    "der Fuchs baut einen Turm",
    who("bear", "fox"),
    "The fox kneels on the rug and puts one more block on top of his tall tower of colourful blocks, which stands whole and straight. The little bear stands a few steps away and watches, smiling. No block lies on the floor.",
  ),
  everyday(
    9,
    5,
    "nap",
    "alle legen sich zum Mittagsschlaf hin",
    who("bear", "fox", "hedgehog", "teacher"),
    "The fox and the little hedgehog lie under their blankets on their mats, their eyes closing. The little bear lies on his mat with his plush bunny, calm. The teacher sits quietly on her chair by the door and smiles.",
  ),
  everyday(
    9,
    6,
    "pickup",
    "nach dem Schlafen im Spielzimmer",
    who("bear", "fox"),
    "Afternoon. The fox builds his block tower, the little bear sits beside him and helps, both content. The doorway is empty: no grown-up stands in it. The little bear's green backpack hangs on its hook at the coat rack.",
  ),
  // Tag 10: breakfast, painting, sandpit, home tired, brushing teeth.
  everyday(
    10,
    1,
    "myself",
    "Frühstück mit dem großen Bären",
    who("bear", "bigBear"),
    "The big bear puts the two empty cups on the breakfast table and smiles. The little bear sits on his chair, happy. The small juice jug stands on the table, closed; nothing is poured yet.",
  ),
  everyday(
    10,
    2,
    "laughed",
    "am Maltisch im Kindergarten",
    who("bear", "raccoon", "bunny"),
    "The raccoon draws his house and the bunny draws beside him, both busy and calm. The little bear sits down at the table in front of a white, empty sheet and takes a crayon from the cup, smiling. The pinboard on the wall is empty.",
  ),
  everyday(
    10,
    3,
    "hit",
    "im Sandkasten",
    who("bear", "fox"),
    "The little bear and the fox sit in the sandpit side by side and pat a small sand hill together, both smiling. The red spade and the yellow bucket lie in the sand between them.",
  ),
  everyday(
    10,
    4,
    "worn",
    "nach Hause nach dem Kindergarten",
    who("bear", "baby", "bigBear"),
    "The front door has just opened: the big bear comes in carrying the bag, the little bear walks in beside him in his jacket, tired but calm, holding the green lunch box. The bear baby sits on the floor and plays with its blocks. Through the open door the cuddle corner with its cushions and the plush bunny.",
  ),
  everyday(
    10,
    5,
    "teeth",
    "ab ins Badezimmer",
    who("bear", "bigBear"),
    "Evening. The little bear in his pyjamas climbs onto the small step stool in front of the basin, smiling. The big bear squeezes toothpaste onto the toothbrush. The tooth mug and the small sand timer stand on the edge of the basin. The mirror shows no reflection.",
  ),
  // Tag 11: hairdresser, shopping, the fox's new bike, hungry, bedtime.
  everyday(
    11,
    1,
    "barber",
    "beim Friseur",
    who("bear", ["barber", 1], "bigBear"),
    "The little bear and the big bear come into the salon paw in paw, the little bear looks round curiously. The hairdresser stands smiling next to the empty barber's chair, the comb and scissors lie on the shelf.",
  ),
  everyday(
    11,
    2,
    "supermarket",
    "beim Einkaufen",
    who("bear", "bigBear"),
    "The big bear and the little bear walk down the aisle side by side, the little bear holds his plush bunny under his arm and smiles. The crate of apples and the tower of tins stand in their places.",
  ),
  everyday(
    11,
    3,
    "envy",
    "der kleine Bär fährt Roller",
    who("bear", "fox"),
    "The little bear rides his old blue scooter along the pavement, happy. Far back on the pavement the fox comes walking with his new red balance bike, still small in the distance, waving.",
  ),
  everyday(
    11,
    4,
    "pointing",
    "der große Bär macht den Kühlschrank auf",
    who("bear", "bigBear"),
    "The big bear opens the fridge door, the little bear stands beside him and looks in, calm and curious. The yoghurt, the milk bottle and the vegetables stand in the fridge, the two spoons lie on the table. The big bear's paws are still empty: the apple lies on the table.",
  ),
  everyday(
    11,
    5,
    "bedtime",
    "der kleine Bär spielt mit der Eisenbahn",
    who("bear", "bigBear"),
    "Evening. The little bear in his pyjamas pushes the wooden train into the tunnel and laughs. The big bear sits on the sofa and smiles at him, the green picture book lying beside him on the sofa.",
  ),
  // Tag 12: the fox in the garden, watering, the fox's dad, packing.
  everyday(
    12,
    1,
    "race",
    "der Fuchs kommt in den Garten",
    who("bear", "fox"),
    "The little bear and the fox stand side by side at the near edge of the meadow, both smiling, ready to run to the apple tree.",
  ),
  everyday(
    12,
    2,
    "butterfly",
    "Blumen gießen",
    who("bear", "fox"),
    "The fox waters the tulip bed with the green watering can, the little bear stands beside him and points at the water drops, both happy. The single big yellow flower stands empty: no butterfly anywhere in the picture.",
  ),
  everyday(
    12,
    3,
    "farewell",
    "der Papa vom Fuchs klingelt",
    who("bear", "fox", ["farewell", 2], "bigBear"),
    "The big bear opens the front door, the fox's dad stands outside and smiles. The little bear and the fox stand in the hall paw in paw, still happy; the fox's cap hangs on the hook.",
  ),
  everyday(
    12,
    4,
    "excited",
    "der kleine Bär packt den Koffer",
    who("bear"),
    "Evening light. The little bear in his pyjamas kneels by the small suitcase and puts the bucket with the spade next to it, smiling. The bed is still empty, the plush bunny sits on the pillow, the lamp on the bedside table is on.",
  ),
  // Tag 13: the drive, the picnic, the first night at Grandma's.
  everyday(
    13,
    1,
    "car",
    "die Fahrt zu Oma Bär beginnt",
    who("bear", "baby", "bigBear"),
    "The car drives along the country road. The little bear sits in his car seat with his plush bunny and looks out of the window, happy and awake; the bear baby is awake too and smiles. The big bear drives.",
  ),
  everyday(
    13,
    2,
    "bee",
    "Picknick bei Oma Bär",
    who("bear", "bigBear"),
    "The big bear spreads the bread on the picnic blanket, the little bear puts his red cup of juice down, both smiling. The ball lies on the blanket. No bee anywhere in the picture.",
  ),
  everyday(
    13,
    3,
    "homesick",
    "die erste Nacht bei Oma",
    who("bear", "grandma"),
    "Evening. Grandma bear switches on the moon night light, the little bear in his pyjamas sits up in the guest bed under the patchwork blanket and smiles at her. The door is closed.",
  ),
  // Tag 14: ill at home, painting, the puzzle, the nappy, painting with the baby.
  everyday(
    14,
    1,
    "sick",
    "der kleine Bär bleibt zu Hause",
    who("bear"),
    "The little bear with his scarf lies on the sofa under the blue blanket, calm, holding the picture book. The cup of tea stands on the small table. Outside the window the garden is empty: the fox is not there yet, and no ball.",
  ),
  everyday(
    14,
    2,
    "phone",
    "der kleine Bär malt ein Bild",
    who("bear", "bigBear"),
    "The little bear sits at the table and draws his picture with the crayons, happy. The big bear stands at the counter and smiles at him; the phone lies on the counter. The plush bunny sits on the chair.",
  ),
  everyday(
    14,
    3,
    "puzzle",
    "der kleine Bär holt sein Puzzle",
    who("bear", "bigBear"),
    "The little bear carries the wooden farm-animal puzzle to the low table, smiling; all pieces lie on the board. The big bear sits on the sofa and reads.",
  ),
  everyday(
    14,
    4,
    "nappy",
    "der kleine Bär spielt mit dem Auto",
    who("bear", "baby"),
    "The little bear pushes his red toy car over the rug and laughs. The bear baby crawls towards him, happy. No smell anywhere. The fresh nappy lies on the shelf. The doorway is empty: the big bear is not there.",
  ),
  everyday(
    14,
    5,
    "paintbrush",
    "Malen am Tisch",
    who("bear", "baby"),
    "The little bear paints his picture with his brush, happy. The bear baby sits in its high chair with its own sheet and watches him, smiling. The paint box, the cup of paint water and the crayons lie on the table.",
  ),
  // Tag 15: after the rain, the park, the bath.
  everyday(
    15,
    1,
    "socks",
    "nach dem Regen",
    who("bear", "fox"),
    "The little bear in his yellow rubber boots and the fox walk side by side along the wet path towards the puddle, laughing. The bench is empty.",
  ),
  everyday(
    15,
    2,
    "lick",
    "im Park",
    who("bear", ["lick", 1], ["lick", 2]),
    "The little bear walks along the path, happy. Far back on the path the fox lady comes walking with her small dog on its lead, still small in the distance. The stick lies on the path.",
  ),
  everyday(
    15,
    3,
    "bath",
    "ab in die Badewanne",
    who("bear", "fox", "bigBear"),
    "The bath tub is full of foam. The little bear and the fox in their swim shirts and swim shorts climb into the tub, smiling. The big bear sits on the stool with the big towel on his lap. The shampoo bottle and the cup stand on the edge of the tub.",
  ),
];
