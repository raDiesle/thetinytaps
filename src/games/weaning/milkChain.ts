// „Tapsis Milchkette“, the second Abstillen story (user request, 9 November 2026): told in chapters, the way weaning
// guides advise to go – one milk time after the other, the easiest first (the day), then the night, the morning, and the
// evening's milk at bedtime last – so a child of about two learns what goes first, why, that it is hard, and what comes
// instead. Its motif is a chain over Tapsi's bed with one milk drop per milk time: when a time goes, Mama and Tapsi take
// its drop off together, put it into a little box to remember it, and hang what comes instead (a ball, a star, a cup, a
// heart). It is plainly about Mama's breast: the word is said, and the pictures show Tapsi drinking there.
//
// German only, text only so far: its pictures are made with Gemini when the user asks (`/bild-erzeugen`), and only
// then is it played in the game. The research it follows is „abstillen-kapitel“ in `src/content/research.ts`.

/** A milk time on the chain, in the order they go. */
export type MilkTime = "tag" | "nacht" | "morgen" | "abend";

/** The order the milk times go in: the day first, the evening's milk at bedtime last (`weaning.test.ts` checks the chapters follow it). */
export const MILK_ORDER: MilkTime[] = ["tag", "nacht", "morgen", "abend"];

/** One page: a picture and what the grown-up reads under it. */
export interface ChainPage {
  /** Unique in the story, also the picture's file name later (`kette-<id>.webp`). */
  id: string;
  /** What is read aloud, German, present tense, short (checked in `weaning.test.ts`). */
  text: string;
  /** What the picture shows, in English, as the start of its Gemini prompt. */
  picture: string;
}

/** One chapter: read on its own on the evening it fits, or the whole story at once. */
export interface Chapter {
  id: string;
  /** Its heading, German, plain words. */
  title: string;
  /** The milk time this chapter says goodbye to, if any. */
  goes?: MilkTime;
  pages: ChainPage[];
}

/**
 * How the drinking pictures show the breast (user feedback, November 2026: a child only understands the story when it
 * plainly sees that it is about Mama's breast): as in a picture book about breastfeeding, tender and calm.
 */
export const NURSING_PICTURE =
  "Mama fox sits cosily and holds Tapsi in her arms; her top is lifted at one side and Tapsi drinks at her breast, Tapsi's cheek and mouth against it, so the breast is plainly seen as a soft round shape of her fur while Tapsi's face hides the nipple. Tender, calm, nothing more bare than that.";

/** The chain over the bed, as each picture with it shows it: four drops at first, then what came instead. */
export const CHAIN_PICTURE =
  "Over Tapsi's bed hangs a string with four big white milk drops, each with a tiny sign: a rising sun (morning), a full sun (day), a lamp (evening), a moon (night).";

export const MILK_CHAIN: Chapter[] = [
  {
    id: "klein",
    title: "Als Tapsi klein war",
    pages: [
      {
        id: "baby",
        text: "Schau, das ist Tapsi. Ganz klein, ein Baby. Tapsi trinkt Milch an Mamas Brust.",
        picture: `Tapsi as a tiny baby fox. ${NURSING_PICTURE}`,
      },
      {
        id: "satt",
        text: "Mamas Milch ist warm und süß. Tapsi wird satt und schläft in Mamas Arm ein.",
        picture: "Baby Tapsi asleep in Mama's arm, a drop of milk at the corner of the mouth, Mama looking down at Tapsi lovingly.",
      },
      {
        id: "wachsen",
        text: "Tapsi wächst und wächst. Mamas Brust macht Milch – am Tag und in der Nacht.",
        picture: "Three small pictures in a row, like photos on a wall: baby Tapsi drinking at the breast, Tapsi crawling, Tapsi standing up at the sofa.",
      },
    ],
  },
  {
    id: "gross",
    title: "Tapsi ist groß",
    pages: [
      {
        id: "essen",
        text: "Jetzt ist Tapsi groß. Tapsi hat viele Zähne und isst Brot, Nudeln und Äpfel.",
        picture: "Toddler Tapsi at the family table on a high chair, biting into an apple, a plate of noodles in front, Papa fox beside, smiling.",
      },
      {
        id: "becher",
        text: "Tapsi trinkt Wasser aus dem Becher. Ganz allein!",
        picture: "Tapsi holding a cup with both paws and drinking, proud.",
      },
      {
        id: "noch",
        text: "Und manchmal trinkt Tapsi noch an Mamas Brust: am Morgen, am Tag, am Abend, in der Nacht.",
        picture: `Toddler Tapsi on Mama's lap on the sofa. ${NURSING_PICTURE}`,
      },
      {
        id: "kette",
        text: "Über Tapsis Bett hängt eine Kette mit vier Milchtropfen. Einer für jede Milchzeit.",
        picture: `Tapsi's bedroom. ${CHAIN_PICTURE} Tapsi stands on the bed and points at the drops, Mama beside.`,
      },
    ],
  },
  {
    id: "erzaehlen",
    title: "Mama erzählt etwas",
    pages: [
      {
        id: "schoss",
        text: "Mama nimmt Tapsi auf den Schoß. „Ich muss dir etwas erzählen.“",
        picture: "Mama sits on the bed with Tapsi on her lap, both dressed, Mama's paw on Tapsi's back, the chain with the four drops above them.",
      },
      {
        id: "babys",
        text: "„Mama-Milch ist für Babys. Babys haben noch keine Zähne. Du bist groß und isst wie wir.“",
        picture: "Mama shows Tapsi a picture book with a baby fox drinking at its mother's breast; Tapsi opens the mouth wide and shows its teeth.",
      },
      {
        id: "muede",
        text: "„Meine Brust hat so lange Milch gemacht. Jetzt ist sie müde und möchte ausruhen.“",
        picture: "Mama, dressed, lays her paw on her breast and looks at Tapsi warmly; Tapsi looks at the paw.",
      },
      {
        id: "langsam",
        text: "„Darum wird die Milch jetzt weniger. Ganz langsam, eine Milchzeit nach der anderen.“",
        picture: "Mama and Tapsi look up at the chain with the four milk drops; Mama points at one of them.",
      },
      {
        id: "schwer",
        text: "Tapsi mag das nicht hören. Mama sagt: „Das ist schwer. Du darfst traurig sein. Ich bin bei dir.“",
        picture: "Tapsi buries the face in Mama's sweater, ears drooping; Mama holds Tapsi close.",
      },
      {
        id: "auch",
        text: "„Ich werde es auch vermissen“, sagt Mama. „Aber kuscheln, das bleibt. Immer.“",
        picture: "Mama and Tapsi cuddle on the bed, both a little sad and close, eyes closed.",
      },
    ],
  },
  {
    id: "tag",
    title: "Zuerst geht die Tag-Milch",
    goes: "tag",
    pages: [
      {
        id: "tag-ab",
        text: "Zuerst geht die Milch am Tag. Tapsi und Mama nehmen den Sonnen-Tropfen ab.",
        picture: "Tapsi on Mama's arm takes the drop with the full sun off the chain. Mama holds a small wooden box open.",
      },
      {
        id: "tag-dose",
        text: "Der Tropfen kommt in die Erinnerungsdose. An die Kette kommt ein Ball. Am Tag wird gespielt!",
        picture: "The drop lies in the little wooden box. Tapsi hangs a small red ball where the drop was; three drops and a ball on the chain.",
      },
      {
        id: "tag-will",
        text: "Am Nachmittag möchte Tapsi trinken. Tapsi zieht an Mamas Pulli.",
        picture: "Living room in the afternoon. Tapsi tugs at Mama's sweater over her breast and looks up at her, wanting to drink.",
      },
      {
        id: "tag-nicht",
        text: "„Am Tag gibt es keine Mama-Milch mehr“, sagt Mama leise. Tapsi ist wütend und weint.",
        picture: "Tapsi stands crying and stamping a foot, fists balled; Mama kneels down in front of Tapsi, calm and kind.",
      },
      {
        id: "tag-halten",
        text: "Mama hält Tapsi fest im Arm, bis die Tränen fertig sind.",
        picture: "Mama sits on the floor holding Tapsi in a warm hug; Tapsi's face is wet with tears, already calmer.",
      },
      {
        id: "tag-raus",
        text: "Dann gibt es Wasser im Becher, einen Apfel – und raus in den Garten, Ball spielen!",
        picture: "Garden in the sun: Tapsi kicks a red ball, Mama runs after it laughing; a cup and an apple on the garden table.",
      },
      {
        id: "tag-mittag",
        text: "Zum Mittagsschlaf schiebt Papa Tapsi im Wagen spazieren. Tapsi schläft ein.",
        picture: "Papa fox pushes a pram along a path under trees; Tapsi asleep in it with a teddy.",
      },
      {
        id: "tag-leichter",
        text: "Jeden Tag geht es ein bisschen leichter.",
        picture: "Tapsi and Mama build a block tower together on the rug, both happy.",
      },
    ],
  },
  {
    id: "nacht",
    title: "Nachts schläft die Milch",
    goes: "nacht",
    pages: [
      {
        id: "nacht-ab",
        text: "Dann geht die Milch in der Nacht. Der Mond-Tropfen kommt in die Dose. An die Kette kommt ein Stern.",
        picture:
          "Evening, Tapsi's room with a lamp on. Tapsi on Papa's arm hangs a yellow star where the moon drop was; Mama holds the box with two drops in it.",
      },
      {
        id: "nacht-schlaeft",
        text: "Mama sagt: „Wenn es dunkel ist, schläft die Milch. Wenn die Sonne scheint, wacht sie auf.“",
        picture: "Mama at the window with Tapsi on her arm, both looking out at the moon and stars over the dark garden.",
      },
      {
        id: "nacht-wach",
        text: "In der Nacht wacht Tapsi auf. „Milch!“ Aber draußen ist es dunkel.",
        picture: "Night, the room dark blue, the moon in the window. Tapsi sits up in bed calling, the star on the chain glowing softly.",
      },
      {
        id: "nacht-papa",
        text: "Papa kommt. „Die Milch schläft. Ich bin da.“ Tapsi weint, und Papa trägt Tapsi hin und her.",
        picture: "Papa fox in pyjamas walks slowly through the dark room, Tapsi crying on his shoulder, his paw on Tapsi's back.",
      },
      {
        id: "nacht-lied",
        text: "Papa summt ein Lied. Ein Schluck Wasser. Tapsi kuschelt sich an Papa und schläft wieder ein.",
        picture: "Papa sits on the edge of the bed, Tapsi asleep against his chest holding a teddy, a cup of water on the night table.",
      },
      {
        id: "nacht-sonne",
        text: "Am Morgen scheint die Sonne. Die Milch ist wach! Tapsi kuschelt sich zu Mama.",
        picture: `Morning sun through the window. Tapsi in Mama's bed, cuddled close. ${NURSING_PICTURE}`,
      },
      {
        id: "nacht-stolz",
        text: "Nach ein paar Nächten schläft Tapsi länger. Papa ist stolz. Tapsi auch.",
        picture: "Morning: Tapsi and Papa give each other a high five on the bed, both beaming; the chain shows two drops, a ball and a star.",
      },
    ],
  },
  {
    id: "morgen",
    title: "Frühstück mit dem Becher",
    goes: "morgen",
    pages: [
      {
        id: "morgen-ab",
        text: "Bald geht auch die Milch am Morgen. Der Morgen-Tropfen kommt in die Dose, ein Becher an die Kette.",
        picture: "Tapsi hangs a tiny cup on the chain where the rising-sun drop was; one drop is left beside a ball, a star and the cup.",
      },
      {
        id: "morgen-fruehstueck",
        text: "Jetzt frühstücken Tapsi, Mama und Papa zusammen. Warme Milch im Becher – mmh!",
        picture: "Breakfast table in the morning sun: Tapsi drinks from the cup with both paws, Mama and Papa eat bread beside, all cosy in pyjamas.",
      },
      {
        id: "morgen-kuscheln",
        text: "Und vorher kuscheln alle drei im großen Bett.",
        picture: "Mama, Papa and Tapsi cuddled under one blanket in the big bed, laughing, morning light.",
      },
    ],
  },
  {
    id: "abschied",
    title: "Tschüss, Mama-Milch",
    goes: "abend",
    pages: [
      {
        id: "abschied-letzter",
        text: "Nur ein Tropfen hängt noch an der Kette: die Milch am Abend.",
        picture: "Evening, the chain over the bed: a ball, a star, a cup and one single milk drop with a lamp sign. Tapsi looks at it.",
      },
      {
        id: "abschied-sagen",
        text: "Mama sagt: „Heute Abend trinkst du zum letzten Mal. Dann sagen wir Tschüss.“",
        picture: "Mama and Tapsi sit on the bed in pyjamas; Mama talks gently, Tapsi listens, holding the teddy.",
      },
      {
        id: "abschied-trinken",
        text: "Tapsi kuschelt sich an Mamas Brust und trinkt. Ganz langsam. Ein letztes Mal.",
        picture: `Evening lamp light in Tapsi's room. ${NURSING_PICTURE} Tapsi's eyes are half closed, Mama strokes Tapsi's head.`,
      },
      {
        id: "abschied-danke",
        text: "Dann winkt Tapsi: „Danke, Mama-Brust! Tschüss, Mama-Milch!“",
        picture: "Tapsi, sitting on Mama's lap, waves a paw towards Mama's covered chest, smiling; Mama smiles back.",
      },
      {
        id: "abschied-traenen",
        text: "Mama hat Tränen in den Augen und lacht. „Ich bin so stolz auf dich.“",
        picture: "Mama hugs Tapsi, a tear on her cheek and a smile; Tapsi pats her cheek.",
      },
      {
        id: "abschied-herz",
        text: "Der letzte Tropfen kommt in die Erinnerungsdose. An die Kette kommt ein Herz.",
        picture: "Tapsi lays the last drop into the little wooden box next to the three others; Mama hangs a red heart on the chain.",
      },
      {
        id: "abschied-fest",
        text: "Am Morgen feiern alle ein kleines Fest. Tapsi bekommt einen neuen Becher – ganz für sich.",
        picture: "Breakfast table with a small cake and a candle; Papa gives Tapsi a new cup with a fox on it, Mama claps, Tapsi beams.",
      },
    ],
  },
  {
    id: "vermissen",
    title: "Wenn Tapsi die Milch vermisst",
    pages: [
      {
        id: "vermissen-traurig",
        text: "Manchmal vermisst Tapsi die Milch. Dann ist Tapsi traurig.",
        picture: "Tapsi sits alone on the sofa hugging the teddy, looking down, a little sad.",
      },
      {
        id: "vermissen-mama",
        text: "Mama setzt sich dazu. „Du vermisst die Milch. Das ist schwer. Komm her.“",
        picture: "Mama sits down next to Tapsi and opens her arms.",
      },
      {
        id: "vermissen-herz",
        text: "Tapsi legt den Kopf an Mamas Brust. Da drin klopft Mamas Herz: bumm, bumm, bumm.",
        picture:
          "Tapsi lies with the head on Mama's chest, over her sweater, ear pressed to it, eyes closed, listening; tiny soft hearts drawn like a heartbeat beside.",
      },
      {
        id: "vermissen-immer",
        text: "Milch gibt es keine mehr. Aber kuscheln geht immer.",
        picture: "Mama and Tapsi cuddled up on the sofa under a blanket, both content.",
      },
    ],
  },
  {
    id: "bleibt",
    title: "Was immer bleibt",
    pages: [
      {
        id: "bleibt-kette",
        text: "An Tapsis Kette hängen jetzt ein Ball, ein Stern, ein Becher und ein Herz.",
        picture:
          "Tapsi's bedroom at evening, the chain now shows a red ball, a yellow star, a small cup and a red heart; Tapsi in bed with the teddy looks up at it.",
      },
      {
        id: "bleibt-lieb",
        text: "Tapsi ist groß. Und Mama und Papa haben Tapsi lieb – genau wie früher. Für immer.",
        picture: "Mama and Papa sit on Tapsi's bed and kiss Tapsi good night, Tapsi smiling sleepily; the box with the four drops on the shelf.",
      },
    ],
  },
];

/** Every page in reading order. */
export const MILK_CHAIN_PAGES: ChainPage[] = MILK_CHAIN.flatMap((c) => c.pages);
