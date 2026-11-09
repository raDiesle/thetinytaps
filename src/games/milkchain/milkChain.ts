// „Tapsis Milchkette“, the second Abstillen story (user request, 9 November 2026): told in chapters that follow the
// steps weaning guides advise for gentle weaning (`GENTLE_STEPS`, research „abstillen-kapitel“) – tell the child first,
// stop offering but don't refuse, put off and shorten, replace one milk time after the other (the day first), part
// falling asleep from drinking, then the night, and last a farewell – so a child of about two learns what goes first,
// why, that it is hard, and what comes instead. Its motif is a chain over Tapsi's bed with one milk drop per milk time:
// when a time goes, Mama and Tapsi take its drop off together, put it into a little box to remember it, and hang what
// comes instead (a ball, a book, a star, a cup). It is plainly about Mama's breast: the word is said, and the pictures
// show Tapsi drinking there.
//
// German only. Played at `/milchkette/` (`MilkChainPlay.tsx`), still being built; its pictures come from Gemini
// (`milkChainPictures.ts`).

/** A step of gentle weaning as the guides give it, in their order; each has a chapter of its own. */
export type WeaningStep = "vorbereiten" | "nicht-anbieten" | "hinauszoegern" | "ersetzen" | "einschlafen" | "nacht" | "abschied" | "begleiten";

/** The steps of gentle weaning in the order the guides give them (research „abstillen-kapitel“), for the grown-up. */
export const GENTLE_STEPS: { id: WeaningStep; title: string; what: string }[] = [
  { id: "vorbereiten", title: "Vorbereiten und erzählen", what: "Dem Kind vorher sagen, was kommt und warum – in seinen Worten." },
  { id: "nicht-anbieten", title: "Nicht anbieten, nicht verweigern", what: "Die Brust nicht mehr anbieten, aber geben, wenn das Kind fragt." },
  { id: "hinauszoegern", title: "Hinauszögern, verkürzen, Orte begrenzen", what: "„Gleich“, nur ein Lied lang, nur noch an einem Ort zu Hause." },
  { id: "ersetzen", title: "Eine Stillzeit nach der anderen ersetzen", what: "Die leichteste zuerst, meist am Tag: trösten, dann Becher, Essen, Spiel." },
  { id: "einschlafen", title: "Einschlafen vom Stillen lösen", what: "Stillen an den Anfang des Abends, dann Buch, Lied – oft bringt Papa ins Bett." },
  { id: "nacht", title: "Nachts abstillen", what: "Wenn es dunkel ist, schläft die Milch: trösten statt stillen, oft durch Papa." },
  { id: "abschied", title: "Die letzte Stillzeit und der Abschied", what: "Angekündigt, bewusst, mit Dank und einem kleinen Fest." },
  { id: "begleiten", title: "Nachbegleiten", what: "Vermissen und Traurigsein zulassen, Nähe geben – kuscheln bleibt." },
];

/** A milk time on the chain, in the order they go. */
export type MilkTime = "tag" | "abend" | "nacht" | "morgen";

/** The order the milk times go in: the day first, then falling asleep, the night, and the morning's milk last (checked in `weaning.test.ts`). */
export const MILK_ORDER: MilkTime[] = ["tag", "abend", "nacht", "morgen"];

/** Where a page plays: every place keeps its look from its first picture on (`milkChainPictures.ts`). */
export type Place = "wohnzimmer" | "kinderzimmer" | "kueche" | "garten" | "weg";

/** Who is in a page's picture: baby Tapsi, Tapsi big, Mama and Papa Fuchs. */
export type Cast = "baby" | "tapsi" | "mama" | "papa";

/** The light of a page. */
export type Light = "tag" | "abend" | "nacht" | "morgen";

/** One page: a picture and what the grown-up reads under it. */
export interface ChainPage {
  /** Unique in the story, also the picture's file name (`bilder/kette-<id>.webp`). */
  id: string;
  /** What is read aloud, German, present tense, short (checked in `weaning.test.ts`). */
  text: string;
  place: Place;
  light: Light;
  /** Everyone in the picture, each once. */
  cast: Cast[];
  /** What happens in the picture, in English, for its Gemini prompt (`milkChainPictures.ts` adds place, cast and chain). */
  picture: string;
  /** Tapsi drinks at Mama's breast in this picture (`NURSING`). */
  nursing?: true;
}

/**
 * The story in another language, kept in `<lang>.ts` beside this file and loaded with that language's texts
 * (`src/content/texts/texts-<lang>.ts`), never imported by the game. A page or title it lacks shows in German.
 */
export interface MilkChainTranslation {
  /** Each chapter's title by chapter id. */
  chapters: Record<string, string>;
  /** Each page's sentence by page id. */
  pages: Record<string, string>;
}

/** One chapter: read on its own on the evening it fits, or the whole story at once. */
export interface Chapter {
  id: string;
  /** Its heading, German, plain words. */
  title: string;
  /** The step of gentle weaning it tells, if any (the first two chapters only set the scene). */
  step?: WeaningStep;
  /** The milk time this chapter says goodbye to: its drop leaves the chain on this chapter's pages. */
  goes?: MilkTime;
  pages: ChainPage[];
}

export const MILK_CHAIN: Chapter[] = [
  {
    id: "klein",
    title: "Als Tapsi klein war",
    pages: [
      {
        id: "baby",
        text: "Schau, das ist Tapsi. Ganz klein, ein Baby. Tapsi trinkt Milch an Mamas Brust.",
        place: "wohnzimmer",
        light: "tag",
        cast: ["baby", "mama"],
        nursing: true,
        picture: "Mama sits in the big armchair and holds baby Tapsi in her arms; baby Tapsi drinks at her breast, eyes closed, content.",
      },
      {
        id: "satt",
        text: "Mamas Milch ist warm und süß. Tapsi wird satt und schläft in Mamas Arm ein.",
        place: "wohnzimmer",
        light: "tag",
        cast: ["baby", "mama"],
        picture:
          "Mama sits in the big armchair, her sweater pulled down again; baby Tapsi sleeps in her arm with a tiny drop of milk at the corner of the mouth, Mama looks down lovingly.",
      },
      {
        id: "wachsen",
        text: "Tapsi wächst und wächst. Und Mamas Brust macht Milch – am Tag und in der Nacht.",
        place: "wohnzimmer",
        light: "tag",
        cast: ["baby", "mama"],
        picture: "Baby Tapsi, a little bigger now, crawls happily across the rug towards Mama, who kneels on the rug with open arms.",
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
        place: "kueche",
        light: "tag",
        cast: ["tapsi", "papa"],
        picture:
          "Tapsi sits at the kitchen table and bites into a red apple with a big grin that shows the teeth; a plate of noodles and a slice of bread in front. Papa sits beside Tapsi and smiles.",
      },
      {
        id: "becher",
        text: "Tapsi trinkt Wasser aus dem Becher. Ganz allein!",
        place: "kueche",
        light: "tag",
        cast: ["tapsi"],
        picture: "Tapsi sits at the kitchen table and drinks from a small cup held with both paws, proud. Papa's chair is empty.",
      },
      {
        id: "noch",
        text: "Und manchmal trinkt Tapsi noch an Mamas Brust. Das ist warm und gemütlich.",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        nursing: true,
        picture: "Mama sits in the big armchair with toddler Tapsi on her lap; Tapsi drinks at her breast, snuggled in.",
      },
      {
        id: "kette",
        text: "Über Tapsis Bett hängt eine Kette mit vier Milchtropfen: Morgen, Tag, Abend und Nacht.",
        place: "kinderzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture: "Tapsi stands on the bed and points up at the chain of drops; Mama stands beside the bed and smiles.",
      },
    ],
  },
  {
    id: "erzaehlen",
    title: "Mama erzählt etwas",
    step: "vorbereiten",
    pages: [
      {
        id: "schoss",
        text: "Mama nimmt Tapsi auf den Schoß. „Ich muss dir etwas erzählen.“",
        place: "kinderzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture: "Mama sits on the edge of the bed with Tapsi on her lap, her paw on Tapsi's back; both look at each other, Mama serious and kind.",
      },
      {
        id: "babys",
        text: "„Mama-Milch ist für Babys. Babys haben noch keine Zähne. Du bist groß und isst wie wir.“",
        place: "kinderzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture: "Mama sits on the edge of the bed with Tapsi on her lap; Tapsi opens the mouth wide and proudly shows its teeth, Mama laughs.",
      },
      {
        id: "muede",
        text: "„Meine Brust hat so lange Milch gemacht. Jetzt ist sie müde und möchte ausruhen.“",
        place: "kinderzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture:
          "Mama sits on the edge of the bed with Tapsi on her lap; she lays one paw on her own breast over her sweater and looks at Tapsi warmly; Tapsi looks at her paw there.",
      },
      {
        id: "langsam",
        text: "„Darum wird die Milch jetzt weniger. Ganz langsam, ein Tropfen nach dem anderen.“",
        place: "kinderzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture: "Mama sits on the edge of the bed with Tapsi on her lap; both look up at the chain of drops, Mama points at one drop.",
      },
      {
        id: "schwer",
        text: "Tapsi mag das nicht hören. Mama sagt: „Das ist schwer. Du darfst traurig sein. Ich bin bei dir.“",
        place: "kinderzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture: "Tapsi, sad with drooping ears, hides the face against Mama's sweater; Mama sits on the edge of the bed and holds Tapsi close.",
      },
      {
        id: "auch",
        text: "„Ich werde es auch vermissen“, sagt Mama. „Aber kuscheln, das bleibt. Immer.“",
        place: "kinderzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture: "Mama and Tapsi lie cuddled together on the bed, eyes closed, a little sad and very close.",
      },
    ],
  },
  {
    id: "fragen",
    title: "Mama fragt nicht mehr",
    step: "nicht-anbieten",
    pages: [
      {
        id: "fragen-nicht",
        text: "Früher hat Mama gefragt: „Möchtest du Milch?“ Jetzt fragt Mama nicht mehr.",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture: "Tapsi sits on the rug and builds a tower of wooden blocks; Mama sits on the sofa nearby with a cup of tea and watches, relaxed.",
      },
      {
        id: "fragen-tapsi",
        text: "Wenn Tapsi fragt, bekommt Tapsi Milch. Mama kuschelt Tapsi in den Sessel.",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        nursing: true,
        picture: "Mama sits in the big armchair with Tapsi on her lap; Tapsi drinks at her breast. The block tower stands on the rug.",
      },
      {
        id: "fragen-spielen",
        text: "Aber oft spielt Tapsi so schön, dass Tapsi die Milch ganz vergisst.",
        place: "garten",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture: "Tapsi digs happily in the sandpit with a little shovel and bucket; Mama sits on the edge of the sandpit and laughs.",
      },
    ],
  },
  {
    id: "gleich",
    title: "Gleich, und nur ein Lied lang",
    step: "hinauszoegern",
    pages: [
      {
        id: "gleich",
        text: "„Milch!“, ruft Tapsi. „Gleich“, sagt Mama. „Erst bauen wir den Turm fertig.“",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture: "Tapsi and Mama kneel on the rug and build a block tower together; Mama hands Tapsi a block, Tapsi reaches for it.",
      },
      {
        id: "gleich-lied",
        text: "Dann trinkt Tapsi, so lange wie ein Lied. Mama singt, und am Ende ist die Milch fertig.",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        nursing: true,
        picture: "Mama sits in the big armchair and sings with open mouth, two small music notes beside her; Tapsi on her lap drinks at her breast.",
      },
      {
        id: "gleich-sessel",
        text: "Milch gibt es jetzt nur noch zu Hause, im Kuschelsessel.",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture: "Tapsi, in a little coat, stands at the big armchair and pats its cushion; Mama in the doorway with a jacket and the front door key, smiling.",
      },
    ],
  },
  {
    id: "tag",
    title: "Zuerst geht die Tag-Milch",
    step: "ersetzen",
    goes: "tag",
    pages: [
      {
        id: "tag-ab",
        text: "Zuerst geht die Milch am Tag. Tapsi und Mama nehmen den Sonnen-Tropfen von der Kette.",
        place: "kinderzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture: "Mama lifts Tapsi up; Tapsi takes the drop with the full sun off the chain. A small wooden box stands open on the night table.",
      },
      {
        id: "tag-dose",
        text: "Der Tropfen kommt in die Erinnerungsdose. An die Kette kommt ein Ball. Am Tag wird gespielt!",
        place: "kinderzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture: "Tapsi lays the sun drop into the small wooden box on the night table; Mama hangs a small red ball on the chain where it was.",
      },
      {
        id: "tag-will",
        text: "Am Nachmittag möchte Tapsi trinken. Tapsi zieht an Mamas Pulli.",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture: "Mama stands by the sofa; Tapsi tugs at her sweater at her breast and looks up at her, wanting to drink.",
      },
      {
        id: "tag-nicht",
        text: "„Am Tag gibt es keine Mama-Milch mehr“, sagt Mama leise. Tapsi ist wütend und weint.",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture: "Tapsi stands crying and stamps a foot, fists balled; Mama kneels in front of Tapsi, calm and kind, her paws open.",
      },
      {
        id: "tag-halten",
        text: "Mama hält Tapsi fest im Arm, bis die Tränen fertig sind.",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture: "Mama sits on the rug and holds Tapsi in a warm hug; tears on Tapsi's cheeks, already calmer, Mama's cheek on Tapsi's head.",
      },
      {
        id: "tag-raus",
        text: "Dann gibt es Wasser im Becher, einen Apfel – und raus in den Garten, Ball spielen!",
        place: "garten",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture: "Tapsi kicks a red ball across the lawn and laughs; Mama runs after it laughing too. A cup and an apple on the garden table.",
      },
      {
        id: "tag-mittag",
        text: "Zum Mittagsschlaf schiebt Papa Tapsi im Wagen spazieren. Tapsi schläft ein.",
        place: "weg",
        light: "tag",
        cast: ["tapsi", "papa"],
        picture: "Papa pushes a pram along the path; Tapsi lies asleep in it hugging a teddy bear.",
      },
      {
        id: "tag-leichter",
        text: "Jeden Tag geht es ein bisschen leichter.",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture: "Tapsi and Mama sit on the rug and look at a picture book together, both happy and relaxed.",
      },
    ],
  },
  {
    id: "abend",
    title: "Einschlafen ohne Milch",
    step: "einschlafen",
    goes: "abend",
    pages: [
      {
        id: "abend-frueher",
        text: "Am Abend trinkt Tapsi jetzt im Kuschelsessel – noch vor dem Zähneputzen.",
        place: "wohnzimmer",
        light: "abend",
        cast: ["tapsi", "mama"],
        nursing: true,
        picture:
          "Evening, the lamp is on. Tapsi in pyjamas sits on Mama's lap in the big armchair and drinks at her breast; a little toothbrush lies ready on the side table.",
      },
      {
        id: "abend-buch",
        text: "Dann liest Papa ein Buch vor, und Mama singt ein Lied.",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi", "mama", "papa"],
        picture:
          "Evening, the bedside lamp is on. Tapsi in pyjamas lies in bed; Papa sits on the edge and reads a picture book aloud, Mama sits beside him and sings, a small music note beside her.",
      },
      {
        id: "abend-schlaf",
        text: "Tapsi schläft ein – ohne Milch, mit dem Teddy im Arm.",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi"],
        picture: "Evening, the bedside lamp gives a soft light. Tapsi in pyjamas sleeps peacefully in bed, hugging a teddy bear.",
      },
      {
        id: "abend-ab",
        text: "Nach ein paar Abenden geht auch die Abend-Milch. An die Kette kommt ein Buch.",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi", "papa"],
        picture:
          "Evening. Papa lifts Tapsi in pyjamas up; Tapsi hangs a tiny picture book on the chain where the lamp drop was and gives the lamp drop to Papa for the box.",
      },
    ],
  },
  {
    id: "nacht",
    title: "Nachts schläft die Milch",
    step: "nacht",
    goes: "nacht",
    pages: [
      {
        id: "nacht-schlaeft",
        text: "Mama sagt: „Wenn es dunkel ist, schläft die Milch. Wenn die Sonne scheint, wacht sie auf.“",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi", "mama"],
        picture: "Evening, dusk outside. Mama stands at the window with Tapsi in pyjamas on her arm; both look out at the moon rising over the garden.",
      },
      {
        id: "nacht-ab",
        text: "Der Mond-Tropfen kommt in die Dose. An die Kette kommt ein Stern.",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi", "mama"],
        picture:
          "Evening. Tapsi in pyjamas stands on the bed and hangs a yellow star on the chain where the moon drop was; Mama holds the small wooden box open.",
      },
      {
        id: "nacht-wach",
        text: "In der Nacht wacht Tapsi auf. „Milch!“ Aber draußen ist es dunkel.",
        place: "kinderzimmer",
        light: "nacht",
        cast: ["tapsi"],
        picture: "Night, the room in dark blue moonlight, the moon in the window. Tapsi in pyjamas sits up in bed and calls out, mouth open, unhappy.",
      },
      {
        id: "nacht-papa",
        text: "Papa kommt. „Die Milch schläft. Ich bin da.“ Tapsi weint, und Papa trägt Tapsi hin und her.",
        place: "kinderzimmer",
        light: "nacht",
        cast: ["tapsi", "papa"],
        picture:
          "Night, dark blue moonlight. Papa in pyjamas walks slowly through the room carrying Tapsi, who cries on his shoulder; his paw strokes Tapsi's back. Tapsi's bed is empty.",
      },
      {
        id: "nacht-lied",
        text: "Papa summt ein Lied. Ein Schluck Wasser. Tapsi kuschelt sich an Papa und schläft wieder ein.",
        place: "kinderzimmer",
        light: "nacht",
        cast: ["tapsi", "papa"],
        picture:
          "Night, dark blue moonlight. Papa in pyjamas sits on the edge of the bed, Tapsi asleep against his chest with the teddy; a cup of water on the night table.",
      },
      {
        id: "nacht-sonne",
        text: "Am Morgen scheint die Sonne. Die Milch ist wach! Tapsi kuschelt sich zu Mama und trinkt.",
        place: "kinderzimmer",
        light: "morgen",
        cast: ["tapsi", "mama"],
        nursing: true,
        picture:
          "Morning sun shines in through the window. Mama sits on Tapsi's bed and holds Tapsi in pyjamas in her arms; Tapsi drinks at her breast, sleepy and happy.",
      },
      {
        id: "nacht-stolz",
        text: "Nach ein paar Nächten schläft Tapsi länger. Papa ist stolz. Tapsi auch.",
        place: "kinderzimmer",
        light: "morgen",
        cast: ["tapsi", "papa"],
        picture: "Morning sun. Tapsi in pyjamas stands on the bed and gives Papa a high five; both beam.",
      },
    ],
  },
  {
    id: "abschied",
    title: "Tschüss, Mama-Milch",
    step: "abschied",
    goes: "morgen",
    pages: [
      {
        id: "abschied-letzter",
        text: "Nur ein Tropfen hängt noch an der Kette: die Milch am Morgen.",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi"],
        picture: "Evening. Tapsi in pyjamas sits on the bed and looks up thoughtfully at the one milk drop left on the chain.",
      },
      {
        id: "abschied-sagen",
        text: "Mama sagt: „Morgen früh trinkst du zum letzten Mal. Dann sagen wir Tschüss.“",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi", "mama"],
        picture: "Evening. Mama sits on the bed beside Tapsi in pyjamas and talks gently; Tapsi listens, holding the teddy.",
      },
      {
        id: "abschied-trinken",
        text: "Am Morgen kuschelt Tapsi sich an Mamas Brust und trinkt. Ganz langsam. Ein letztes Mal.",
        place: "kinderzimmer",
        light: "morgen",
        cast: ["tapsi", "mama"],
        nursing: true,
        picture:
          "Morning sun. Mama sits on Tapsi's bed and holds Tapsi in pyjamas in her arms; Tapsi drinks at her breast, eyes half closed, Mama strokes Tapsi's head.",
      },
      {
        id: "abschied-danke",
        text: "Dann winkt Tapsi: „Danke, Mama-Brust! Tschüss, Mama-Milch!“",
        place: "kinderzimmer",
        light: "morgen",
        cast: ["tapsi", "mama"],
        picture:
          "Morning sun. Mama sits on the bed, her sweater pulled down again; Tapsi in pyjamas sits on her lap and waves a paw at her chest, smiling; Mama smiles back.",
      },
      {
        id: "abschied-traenen",
        text: "Mama hat Tränen in den Augen und lacht. „Ich bin so stolz auf dich.“",
        place: "kinderzimmer",
        light: "morgen",
        cast: ["tapsi", "mama"],
        picture: "Morning sun. Mama hugs Tapsi in pyjamas on the bed, a tear on her cheek and a big smile; Tapsi pats her cheek.",
      },
      {
        id: "abschied-dose",
        text: "Der letzte Tropfen kommt in die Erinnerungsdose. An die Kette kommt ein Becher.",
        place: "kinderzimmer",
        light: "morgen",
        cast: ["tapsi", "mama"],
        picture:
          "Morning sun. Tapsi in pyjamas lays the last drop into the small wooden box with the three other drops; Mama hangs a tiny cup on the chain where it was.",
      },
      {
        id: "abschied-fest",
        text: "Dann gibt es ein Fest-Frühstück. Tapsi bekommt einen neuen Becher – ganz für sich.",
        place: "kueche",
        light: "morgen",
        cast: ["tapsi", "mama", "papa"],
        picture:
          "Morning sun on the kitchen table, a small cake with one candle on it. Papa hands Tapsi a new cup with a little fox on it, Mama claps, Tapsi beams.",
      },
    ],
  },
  {
    id: "vermissen",
    title: "Wenn Tapsi die Milch vermisst",
    step: "begleiten",
    pages: [
      {
        id: "vermissen-traurig",
        text: "Manchmal vermisst Tapsi die Milch. Dann ist Tapsi traurig.",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi"],
        picture: "Tapsi sits alone on the sofa hugging the teddy, looking down, a little sad.",
      },
      {
        id: "vermissen-mama",
        text: "Mama setzt sich dazu. „Du vermisst die Milch. Das ist schwer. Komm her.“",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture: "Mama sits down on the sofa next to Tapsi and opens her arms; Tapsi looks up at her.",
      },
      {
        id: "vermissen-herz",
        text: "Tapsi legt den Kopf an Mamas Brust. Da drin klopft Mamas Herz: bumm, bumm, bumm.",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture:
          "On the sofa Tapsi lies with the head on Mama's chest over her sweater, an ear pressed to it, eyes closed, listening; three tiny red hearts beside them like a heartbeat.",
      },
      {
        id: "vermissen-immer",
        text: "Milch gibt es keine mehr. Aber kuscheln geht immer.",
        place: "wohnzimmer",
        light: "tag",
        cast: ["tapsi", "mama"],
        picture: "Mama and Tapsi cuddle on the sofa under a soft blanket, both content and smiling.",
      },
    ],
  },
  {
    id: "bleibt",
    title: "Was immer bleibt",
    pages: [
      {
        id: "bleibt-kette",
        text: "An Tapsis Kette hängen jetzt ein Ball, ein Buch, ein Stern und ein Becher.",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi"],
        picture: "Evening, the bedside lamp is on. Tapsi in pyjamas lies in bed with the teddy and looks up at the chain, smiling.",
      },
      {
        id: "bleibt-lieb",
        text: "Tapsi ist groß. Und Mama und Papa haben Tapsi lieb – genau wie früher. Für immer.",
        place: "kinderzimmer",
        light: "abend",
        cast: ["tapsi", "mama", "papa"],
        picture:
          "Evening, the bedside lamp is on. Mama and Papa sit on Tapsi's bed and give Tapsi in pyjamas a good-night kiss on both cheeks; Tapsi smiles sleepily. The small wooden box stands on the shelf.",
      },
    ],
  },
];

/** Every page in reading order. */
export const MILK_CHAIN_PAGES: ChainPage[] = MILK_CHAIN.flatMap((c) => c.pages);

/** What hangs in a milk time's place once it is gone. */
export const INSTEAD: Record<MilkTime, string> = { tag: "Ball", abend: "Buch", nacht: "Stern", morgen: "Becher" };

/**
 * The milk times already gone on a page: those of the chapters before it, and its own chapter's once its drop came off
 * (from the page whose text says what comes onto the chain).
 */
export function goneOn(pageId: string): MilkTime[] {
  const gone: MilkTime[] = [];
  for (const chapter of MILK_CHAIN) {
    const at = chapter.pages.findIndex((p) => p.id === pageId);
    if (at < 0) {
      if (chapter.goes) gone.push(chapter.goes);
      continue;
    }
    const swapped = chapter.goes && chapter.pages.slice(0, at + 1).some((p) => /An die Kette kommt/.test(p.text));
    if (chapter.goes && swapped) gone.push(chapter.goes);
    return gone;
  }
  return gone;
}
