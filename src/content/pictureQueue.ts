import { DAY_PICTURE_QUEUE } from "@/games/feelings/dayPictures";
import { RITUAL_PICTURE_QUEUE } from "@/games/rewards/bilder/prompts";

// Pictures asked for that wait until they can be made cheaply (/bild-erzeugen). Every picture asked for comes in
// here first; `bun run image queue` then makes at once what is already as cheap as it gets (a full sheet of
// small pictures, or a picture that never shares one) and leaves the rest until later sessions bring partners for
// its sheet – unless the grown-up says to make it now. The management page shows what waits and what for.
// A made picture leaves the queue in the same commit (pictureQueue.test.ts fails while its file exists).

/** One picture someone asked for, waiting to be made with `bun run image`. */
export interface QueuedPicture {
  /** Unique in the queue; usually the file's name without folder and extension. */
  id: string;
  /** Where the picture goes, relative to the repository (.webp, .png or .jpg). */
  file: string;
  /** What it is for, in German, for the grown-up. */
  use: string;
  /** What this picture shows, in English, without the style block: `style` (or the book's default) goes before it. */
  prompt: string;
  /** The shared start of the prompt, when not the book's style block (`BOOK_STYLE`, `CUTOUT_STYLE` for cut-outs). */
  style?: string;
  /** Its aspect, like "1:1" or "4:3" (`--aspect`). */
  aspect?: string;
  /** Its size: "512" for the longest side, "1200x900" exactly (`--size`); without one it needs the whole picture and never shares a sheet. */
  size?: string;
  /** Cut out on a flat backdrop (`--transparent`). */
  transparent?: boolean;
  /** The backdrop colour to cut out, when not ff00ff (`--key`). */
  key?: string;
  /** WebP quality, when not 80 (`--quality`). */
  quality?: number;
  /** Pictures passed as `--ref`, relative to the repository; one still in the queue holds this one back until it is made. */
  ref?: string[];
  /** Why it must be drawn alone (a second frame, a story picture keeping its room), so it never shares a sheet. */
  alone?: string;
  /** When it was asked for, YYYY-MM-DD. */
  date: string;
}

/** Every picture waiting, oldest first. */
export const PICTURE_QUEUE: QueuedPicture[] = [
  {
    id: "hilft-kuscheln",
    file: "src/games/feelings/bilder/hilft-kuscheln.webp",
    use: "Gefühle, „Wie geht's dir?“: Karte „Kuscheln“ bei „Was hilft dir jetzt?“ (C-31)",
    prompt:
      "Redraw the little bear from this picture in the same cosy room, same style. He is happy and calm, no tears. No hands, no arms come in from the edges. Exactly two characters, each once: the little bear and Mama Bear, a big brown grown-up bear. She sits on the rug, and the little bear snuggles into her arms, his cheek on her chest; both have their eyes softly closed and smile.",
    aspect: "4:3",
    size: "800x600",
    ref: ["src/games/feelings/bilder/baer-sad-gut.webp"],
    date: "2026-11-04",
  },
  {
    id: "hilft-toben",
    file: "src/games/feelings/bilder/hilft-toben.webp",
    use: "Gefühle, „Wie geht's dir?“: Karte „Toben“ bei „Was hilft dir jetzt?“ (C-31)",
    prompt:
      "Redraw the little bear from this picture in the same cosy room, same style. He is happy and calm, no tears. No hands, no arms come in from the edges. Exactly two characters, each once: the little bear and Papa Bear, a big brown grown-up bear. The little bear jumps high from the rug into a heap of big soft cushions, both arms up, laughing; Papa Bear kneels beside the cushions and laughs with him. Nothing breaks, nothing flies about.",
    aspect: "4:3",
    size: "800x600",
    ref: ["src/games/feelings/bilder/baer-sad-gut.webp"],
    date: "2026-11-04",
  },
  {
    id: "hilft-trinken",
    file: "src/games/feelings/bilder/hilft-trinken.webp",
    use: "Gefühle, „Wie geht's dir?“: Karte „Etwas trinken“ bei „Was hilft dir jetzt?“ (C-31)",
    prompt:
      "Redraw the little bear from this picture in the same cosy room, same style. He is happy and calm, no tears. No hands, no arms come in from the edges. Exactly two characters, each once: the little bear and Mama Bear, a big brown grown-up bear. The little bear sits on the rug and drinks from a big cup of water he holds in both paws, close to the front; Mama Bear sits beside him holding a jug of water, smiling. Only one cup.",
    aspect: "4:3",
    size: "800x600",
    ref: ["src/games/feelings/bilder/baer-sad-gut.webp"],
    date: "2026-11-04",
  },
  {
    id: "hilft-allein",
    file: "src/games/feelings/bilder/hilft-allein.webp",
    use: "Gefühle, „Wie geht's dir?“: Karte „Ein bisschen allein sein“ bei „Was hilft dir jetzt?“ (C-31)",
    prompt:
      "Redraw the little bear from this picture in the same cosy room, same style. He is happy and calm, no tears. No hands, no arms come in from the edges. Only the little bear, nobody else. He sits alone, calm and content, in a small cosy cave of blankets in the corner of his room, holding his teddy, eyes half closed, a soft smile. The rest of the room is empty and quiet.",
    aspect: "4:3",
    size: "800x600",
    ref: ["src/games/feelings/bilder/baer-sad-gut.webp"],
    date: "2026-11-04",
  },
  {
    id: "hilft-lied",
    file: "src/games/feelings/bilder/hilft-lied.webp",
    use: "Gefühle, „Wie geht's dir?“: Karte „Ein Lied singen“ bei „Was hilft dir jetzt?“ (C-31)",
    prompt:
      "Redraw the little bear from this picture in the same cosy room, same style. He is happy and calm, no tears. No hands, no arms come in from the edges. Exactly two characters, each once: the little bear and Papa Bear, a big brown grown-up bear. They sit side by side on the rug and sing together, mouths open in song, heads swaying; three music notes float in the air above them. No instrument.",
    aspect: "4:3",
    size: "800x600",
    ref: ["src/games/feelings/bilder/baer-sad-gut.webp"],
    date: "2026-11-04",
  },
  {
    id: "gesicht-froh",
    file: "src/games/feelings/bilder/gesicht-froh.webp",
    use: "Gefühle, „Wie geht's dir?“: Karte „Fröhlich“ (C-30)",
    prompt:
      "Redraw the little bear from this picture in the same cosy room, same style. No hands, no arms come in from the edges. Exactly two characters, each once: the little bear and Papa Bear, a big brown grown-up bear. The little bear stands close to the front, his face big and clear – the feeling is the biggest thing in the picture. He is happy: laughing with his mouth wide open, eyes squeezed into happy arcs, both arms up. He kneels beside him and looks at him kindly and attentively, not touching him yet.",
    aspect: "4:3",
    size: "800x600",
    ref: ["src/games/feelings/bilder/baer-sad-gut.webp"],
    date: "2026-11-04",
  },
  {
    id: "gesicht-froh-arm",
    file: "src/games/feelings/bilder/gesicht-froh-arm.webp",
    use: "Gefühle, „Wie geht's dir?“: „Fröhlich“ gewählt – Papa nimmt das Kind in den Arm (C-30)",
    prompt:
      "Redraw this exact picture a moment later, same room, same two characters, same style, nothing else changes. No hands, no arms come in from the edges. Papa Bear nods and takes the little bear in his arms in a warm, gentle hug; the little bear's face is still clearly seen and shows the same feeling, but softer and comforted.",
    aspect: "4:3",
    size: "800x600",
    ref: ["src/games/feelings/bilder/gesicht-froh.webp"],
    alone: "Drawn from its card, the same moment a little later",
    date: "2026-11-04",
  },
  {
    id: "gesicht-stolz",
    file: "src/games/feelings/bilder/gesicht-stolz.webp",
    use: "Gefühle, „Wie geht's dir?“: Karte „Stolz“ (C-30)",
    prompt:
      "Redraw the little fox from this picture, same style, now at home in a cosy room with a rug, a sofa and a window. No hands, no arms come in from the edges. Exactly two characters, each once: the little fox and Mama Fox, a big orange grown-up fox. The little fox stands close to the front, his face big and clear – the feeling is the biggest thing in the picture. He is proud: standing tall, chest out, chin up, paws on his hips, a proud closed-mouth smile; beside him a small tower of wooden blocks he has just built. She kneels beside him and looks at him kindly and attentively, not touching him yet.",
    aspect: "4:3",
    size: "800x600",
    ref: ["src/games/feelings/bilder/empathy-passiert.webp"],
    date: "2026-11-04",
  },
  {
    id: "gesicht-stolz-arm",
    file: "src/games/feelings/bilder/gesicht-stolz-arm.webp",
    use: "Gefühle, „Wie geht's dir?“: „Stolz“ gewählt – Mama nimmt das Kind in den Arm (C-30)",
    prompt:
      "Redraw this exact picture a moment later, same room, same two characters, same style, nothing else changes. No hands, no arms come in from the edges. Mama Fox nods and takes the little fox in her arms in a warm, gentle hug; the little fox's face is still clearly seen and shows the same feeling, but softer and comforted.",
    aspect: "4:3",
    size: "800x600",
    ref: ["src/games/feelings/bilder/gesicht-stolz.webp"],
    alone: "Drawn from its card, the same moment a little later",
    date: "2026-11-04",
  },
  {
    id: "gesicht-aufgeregt",
    file: "src/games/feelings/bilder/gesicht-aufgeregt.webp",
    use: "Gefühle, „Wie geht's dir?“: Karte „Aufgeregt“ (C-30)",
    prompt:
      "Redraw the little fox from this picture, same style, now at home in a cosy room with a rug, a sofa and a window. No hands, no arms come in from the edges. Exactly two characters, each once: the little fox and Papa Fox, a big orange grown-up fox. The little fox stands close to the front, his face big and clear – the feeling is the biggest thing in the picture. He is excited and fidgety: eyes wide open, mouth open in a big excited „oh“, up on his tiptoes, paws clenched in front of his chest. He kneels beside him and looks at him kindly and attentively, not touching him yet.",
    aspect: "4:3",
    size: "800x600",
    ref: ["src/games/feelings/bilder/empathy-passiert.webp"],
    date: "2026-11-04",
  },
  {
    id: "gesicht-aufgeregt-arm",
    file: "src/games/feelings/bilder/gesicht-aufgeregt-arm.webp",
    use: "Gefühle, „Wie geht's dir?“: „Aufgeregt“ gewählt – Papa nimmt das Kind in den Arm (C-30)",
    prompt:
      "Redraw this exact picture a moment later, same room, same two characters, same style, nothing else changes. No hands, no arms come in from the edges. Papa Fox nods and takes the little fox in his arms in a warm, gentle hug; the little fox's face is still clearly seen and shows the same feeling, but softer and comforted.",
    aspect: "4:3",
    size: "800x600",
    ref: ["src/games/feelings/bilder/gesicht-aufgeregt.webp"],
    alone: "Drawn from its card, the same moment a little later",
    date: "2026-11-04",
  },
  {
    id: "gesicht-ruhig",
    file: "src/games/feelings/bilder/gesicht-ruhig.webp",
    use: "Gefühle, „Wie geht's dir?“: Karte „Ruhig“ (C-30)",
    prompt:
      "Redraw the little bear from this picture in the same cosy room, same style. No hands, no arms come in from the edges. Exactly two characters, each once: the little bear and Mama Bear, a big brown grown-up bear. The little bear stands close to the front, his face big and clear – the feeling is the biggest thing in the picture. He is calm and content: sitting cross-legged on the rug, eyes softly closed, a gentle smile, paws resting in his lap. She kneels beside him and looks at him kindly and attentively, not touching him yet.",
    aspect: "4:3",
    size: "800x600",
    ref: ["src/games/feelings/bilder/baer-sad-gut.webp"],
    date: "2026-11-04",
  },
  {
    id: "gesicht-ruhig-arm",
    file: "src/games/feelings/bilder/gesicht-ruhig-arm.webp",
    use: "Gefühle, „Wie geht's dir?“: „Ruhig“ gewählt – Mama nimmt das Kind in den Arm (C-30)",
    prompt:
      "Redraw this exact picture a moment later, same room, same two characters, same style, nothing else changes. No hands, no arms come in from the edges. Mama Bear nods and takes the little bear in her arms in a warm, gentle hug; the little bear's face is still clearly seen and shows the same feeling, but softer and comforted.",
    aspect: "4:3",
    size: "800x600",
    ref: ["src/games/feelings/bilder/gesicht-ruhig.webp"],
    alone: "Drawn from its card, the same moment a little later",
    date: "2026-11-04",
  },
  {
    id: "gesicht-muede",
    file: "src/games/feelings/bilder/gesicht-muede.webp",
    use: "Gefühle, „Wie geht's dir?“: Karte „Müde“ (C-30)",
    prompt:
      "Redraw the little bear from this picture in the same cosy room, same style. No hands, no arms come in from the edges. Exactly two characters, each once: the little bear and Papa Bear, a big brown grown-up bear. The little bear stands close to the front, his face big and clear – the feeling is the biggest thing in the picture. He is tired: yawning wide, eyes half closed, rubbing one eye with a paw, shoulders drooping. He kneels beside him and looks at him kindly and attentively, not touching him yet.",
    aspect: "4:3",
    size: "800x600",
    ref: ["src/games/feelings/bilder/baer-sad-gut.webp"],
    date: "2026-11-04",
  },
  {
    id: "gesicht-muede-arm",
    file: "src/games/feelings/bilder/gesicht-muede-arm.webp",
    use: "Gefühle, „Wie geht's dir?“: „Müde“ gewählt – Papa nimmt das Kind in den Arm (C-30)",
    prompt:
      "Redraw this exact picture a moment later, same room, same two characters, same style, nothing else changes. No hands, no arms come in from the edges. Papa Bear nods and takes the little bear in his arms in a warm, gentle hug; the little bear's face is still clearly seen and shows the same feeling, but softer and comforted.",
    aspect: "4:3",
    size: "800x600",
    ref: ["src/games/feelings/bilder/gesicht-muede.webp"],
    alone: "Drawn from its card, the same moment a little later",
    date: "2026-11-04",
  },
  {
    id: "gesicht-traurig",
    file: "src/games/feelings/bilder/gesicht-traurig.webp",
    use: "Gefühle, „Wie geht's dir?“: Karte „Traurig“ (C-30)",
    prompt:
      "Redraw the little fox from this picture, same style, now at home in a cosy room with a rug, a sofa and a window. No hands, no arms come in from the edges. Exactly two characters, each once: the little fox and Mama Fox, a big orange grown-up fox. The little fox stands close to the front, his face big and clear – the feeling is the biggest thing in the picture. He is sad: mouth turned down, brows raised in the middle, one tear on his cheek, head and shoulders hanging. She kneels beside him and looks at him kindly and attentively, not touching him yet.",
    aspect: "4:3",
    size: "800x600",
    ref: ["src/games/feelings/bilder/empathy-passiert.webp"],
    date: "2026-11-04",
  },
  {
    id: "gesicht-traurig-arm",
    file: "src/games/feelings/bilder/gesicht-traurig-arm.webp",
    use: "Gefühle, „Wie geht's dir?“: „Traurig“ gewählt – Mama nimmt das Kind in den Arm (C-30)",
    prompt:
      "Redraw this exact picture a moment later, same room, same two characters, same style, nothing else changes. No hands, no arms come in from the edges. Mama Fox nods and takes the little fox in her arms in a warm, gentle hug; the little fox's face is still clearly seen and shows the same feeling, but softer and comforted.",
    aspect: "4:3",
    size: "800x600",
    ref: ["src/games/feelings/bilder/gesicht-traurig.webp"],
    alone: "Drawn from its card, the same moment a little later",
    date: "2026-11-04",
  },
  {
    id: "gesicht-wuetend",
    file: "src/games/feelings/bilder/gesicht-wuetend.webp",
    use: "Gefühle, „Wie geht's dir?“: Karte „Wütend“ (C-30)",
    prompt:
      "Redraw the little bear from this picture in the same cosy room, same style. No hands, no arms come in from the edges. Exactly two characters, each once: the little bear and Mama Bear, a big brown grown-up bear. The little bear stands close to the front, his face big and clear – the feeling is the biggest thing in the picture. He is angry: brows pulled down hard, mouth a tight frown, red cheeks, fists clenched at his sides. Nothing near him he could hit or throw. She kneels beside him and looks at him kindly and attentively, not touching him yet.",
    aspect: "4:3",
    size: "800x600",
    ref: ["src/games/feelings/bilder/baer-sad-gut.webp"],
    date: "2026-11-04",
  },
  {
    id: "gesicht-wuetend-arm",
    file: "src/games/feelings/bilder/gesicht-wuetend-arm.webp",
    use: "Gefühle, „Wie geht's dir?“: „Wütend“ gewählt – Mama nimmt das Kind in den Arm (C-30)",
    prompt:
      "Redraw this exact picture a moment later, same room, same two characters, same style, nothing else changes. No hands, no arms come in from the edges. Mama Bear nods and takes the little bear in her arms in a warm, gentle hug; the little bear's face is still clearly seen and shows the same feeling, but softer and comforted.",
    aspect: "4:3",
    size: "800x600",
    ref: ["src/games/feelings/bilder/gesicht-wuetend.webp"],
    alone: "Drawn from its card, the same moment a little later",
    date: "2026-11-04",
  },
  {
    id: "gesicht-angst",
    file: "src/games/feelings/bilder/gesicht-angst.webp",
    use: "Gefühle, „Wie geht's dir?“: Karte „Ängstlich“ (C-30)",
    prompt:
      "Redraw the little fox from this picture, same style, now at home in a cosy room with a rug, a sofa and a window. No hands, no arms come in from the edges. Exactly two characters, each once: the little fox and Papa Fox, a big orange grown-up fox. The little fox stands close to the front, his face big and clear – the feeling is the biggest thing in the picture. He is scared: eyes wide, brows raised and drawn together, mouth a small „o“, shoulders pulled up, paws held to his chest. Nothing scary is in the picture. He kneels beside him and looks at him kindly and attentively, not touching him yet.",
    aspect: "4:3",
    size: "800x600",
    ref: ["src/games/feelings/bilder/empathy-passiert.webp"],
    date: "2026-11-04",
  },
  {
    id: "gesicht-angst-arm",
    file: "src/games/feelings/bilder/gesicht-angst-arm.webp",
    use: "Gefühle, „Wie geht's dir?“: „Ängstlich“ gewählt – Papa nimmt das Kind in den Arm (C-30)",
    prompt:
      "Redraw this exact picture a moment later, same room, same two characters, same style, nothing else changes. No hands, no arms come in from the edges. Papa Fox nods and takes the little fox in his arms in a warm, gentle hug; the little fox's face is still clearly seen and shows the same feeling, but softer and comforted.",
    aspect: "4:3",
    size: "800x600",
    ref: ["src/games/feelings/bilder/gesicht-angst.webp"],
    alone: "Drawn from its card, the same moment a little later",
    date: "2026-11-04",
  },
  // The ritual cards of the Tagesplan (H-58, C-33) and their line-art twins, from their prompts.
  ...RITUAL_PICTURE_QUEUE,
  ...DAY_PICTURE_QUEUE,
];
