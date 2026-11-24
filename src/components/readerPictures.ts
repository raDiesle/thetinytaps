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
export const READER_PICTURE_QUEUE: QueuedPicture[] = [];
