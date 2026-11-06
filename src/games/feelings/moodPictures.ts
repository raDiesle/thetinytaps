import type { QueuedPicture } from "@/content/pictureQueue";

// The cards of „Wie geht's dir?“ and „Was brauche ich?“ (user feedback, November 2026), as the picture queue takes them
// until they are made (`/bild-erzeugen`, never made on your own); a made one leaves the list, its prompt kept in
// `bilder/README.md`. A new card comes in here with the same rules: Always the same little bear in his clothes, alone (only the hug needs a grown-up, dressed too),
// close and big in front of a calm background, in a moment that brings the feeling or does what he needs; drawn from
// `baer-sad-gut` as the only `--ref`, so he stays the same. Plain data, with no picture imports, so the management page
// that lists the queue doesn't load the game's pictures.
//
// „Wie doll ist es?“ shows each feeling three times (user wish, 6 November 2026): its card is the middle, and
// `gefuehl-<id>-wenig` and `-doll` are drawn from it, each alone with the card as the only `--ref` – the rules for them
// are in `bilder/README.md` („Wie doll ist es?“) and the game's CLAUDE.md.

/** Every card of the two games still to make (none now: the strength pictures were made on 6 November 2026, their prompts in `bilder/README.md`). */
export const MOOD_PICTURE_QUEUE: QueuedPicture[] = [];
