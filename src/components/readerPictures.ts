import type { QueuedPicture } from "@/content/pictureQueue";

// Who reads with the child at the bottom of the menus (BookFamily, D-21) and the readers' pictures still waiting in the
// picture queue (/bild-erzeugen). Plain data, so the queue on the management page loads no pictures.

/** The two animal families reading one book together: Tapsi's (the foxes) and the little bear's. */
export type Family = "fox" | "bear";

/**
 * The readers' pictures in `bilder/`, in turn from visit to visit: the parents, then Oma, then Opa – on the bears' side
 * Opa before Oma, so the two sides never show the same grown-ups (Oma Fuchs beside Opa Bär).
 */
export const READER_FILES: Record<Family, string[]> = {
  fox: ["buch-fuechse.webp", "buch-oma-fuchs.webp", "buch-opa-fuchs.webp"],
  bear: ["buch-baeren.webp", "buch-opa-baer.webp", "buch-oma-baer.webp"],
};

/** Readers' pictures to draw (again): until one is made its side shows the parents. */
export const READER_PICTURE_QUEUE: QueuedPicture[] = [
  {
    // The first one was cut off by its frame at the bottom and on the right: the cardigan and the legs ended in
    // straight lines in every menu (user feedback, 13 November 2026).
    id: "buch-oma-baer",
    file: "src/components/bilder/buch-oma-baer.webp",
    use: "Oma Bär liest dem Bärenkind vor, unten rechts in den Menüs (neu: das erste war unten und rechts abgeschnitten)",
    prompt:
      "Grandma Bear sits on the ground and reads a picture book with her little bear grandchild, both looking like the bears of the reference picture (only their look, fur colour and clothes style). Grandma keeps the same warm brown fur, with only a little grey on top of her head; round glasses, a lilac cardigan over a white blouse, dark blue skirt. The little bear in his light-blue T-shirt and dark blue-purple trousers sits beside her, laughing and pointing at the book, which shows only simple shapes. The whole of both figures fits in the picture with empty room on every side – heads, ears, elbows, legs and feet included: nothing touches or crosses the picture's edges. No white outline, sticker edge or halo round them – their dark plum ink line is their outer edge, as in the reference picture.",
    aspect: "1:1",
    size: "640",
    transparent: true,
    ref: ["src/components/bilder/buch-baeren.webp"],
    date: "2026-11-13",
  },
];
