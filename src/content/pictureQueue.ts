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
];
