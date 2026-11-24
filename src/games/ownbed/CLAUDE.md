# Tapsi's Own Bed

Route `/grosses-bett/eigenes-bett/` (level `eigenes-bett`) · idea H-148 · research „grosses-bett“ (Nachtrag 24 November 2026).

The second story of the book „Bed“ (`src/games/bedstory`, its `CLAUDE.md` holds the book's rules), beside „Tapsi's Big
Bed“: written on the user's request of 24 November 2026 („eine weitere Geschichte … soll davon gehen, dass das Kind im
eigenen Bett und nicht mehr im Elternbett schlafen soll“). Chosen on the book's first page (`StoryChoice.tsx`, its line
„From Mama and Papa's bed“, dev tags `E<chapter>-<page>`), read with the shared `ChapterBook`, a trophy of its own
(`trophyNames.ts`, level „eigenes-bett“).

Tapsi sleeps between Mama and Papa in the big bed, kicks in the night, and Papa lies at the edge. Mama tells Tapsi about
the own bed; Tapsi would rather stay and is heard („We are always close by“), and Papa promises a cuddle in the big bed
every morning. Tapsi carries the pillow that smells of home into Tapsi's room, Bunny sits on it, the moon night light
glows, the door stays open. The first sleep there is a nap with Mama on the rug beside the bed; the evening is as every
evening, Papa lies beside the bed holding Tapsi's paw and sits a little further away each evening, until he hums by the
door. In the night Tapsi pads over; Mama hugs Tapsi first, then walks Tapsi back calmly and stays, as often as it takes.
In the morning Tapsi climbs into the big bed for the cuddle – they love Tapsi in every bed.
- `ownBed.ts`: the chapters and pages (`OWN_BED_STORY`) and the guides' steps out of the parents' bed (`OWN_BED_STEPS`).
- `ownBedPictures.ts`: the Gemini prompt of every page, as the picture queue takes them; a made picture goes on `MADE`.
- `names.ts`: the story's title and its name in the book's choice, in all seven languages.
- `story.ts`: what `BedStoryGame.tsx` needs of it – Tapsi's voice from `stimme/` (listed in `recordedLines.ts` as
  `grosses-bett-eigenes`, recorded only when the user asks), its pictures from `bilder/`, its translations.
- `de.ts`, `zh.ts`, `hi.ts`, `es.ts`, `ar.ts`, `ru.ts`: the story in the other languages, loaded only with their
  language's texts (`texts-<lang>.ts`, `ownBed`); never import them from game code (`texts.test.ts`).

## Rules

- Everything in `src/games/bedstory/CLAUDE.md`'s rules holds here too: English first and all seven languages in the same
  commit, gentle and true (no scolding, no crying it out, no locked door, no sticker chart or reward), a grown-up in every
  picture of the night but the one where Tapsi gets up, no clock, age or weekday, lines ≤ 110 characters, ending in love
  (`ownBed.test.ts` checks).
- **The parents' bed is never wrong or forbidden.** The family has decided on the own bed, so Tapsi is brought back at
  night – but a child who comes is hugged first, brought back calmly, never sent, and the morning cuddle in the big bed
  stays, a promise kept on the last pages. No line says Tapsi is „too big“ for the big bed or that it is „not allowed“.
- Mama's „Soon you sleep in your own bed“ gives the reason as the family's sleep („Then we all sleep well“), never the
  child's fault; Tapsi's wish to stay is answered by being close, never argued away.
- Pictures (`/bild-erzeugen`; read the lessons in `src/games/bedstory/CLAUDE.md`, `src/games/kitastory/CLAUDE.md` and
  `src/games/hairstory/CLAUDE.md` first): the living room comes from Abstillen's (`kette-fragen-nicht`), Tapsi's room
  from the first story's made bed (`bett-machen`, with its rail and moon night light), so both stories show one room and
  one bed. Mama and Papa's bedroom is new: drawn once from the fox family (`buch-fuechse.webp`) on the first page
  („dritt“), and every other page there from that picture – look at it hardest before the rest are made: one big double
  bed, two separate grown-up foxes (Mama's flower, Papa's glasses), Tapsi between them. The door of Tapsi's room is not
  in the reference picture: pages about it point at the picture's right edge, never draw a door into the room.
- **Not published yet**: its 21 pictures wait in the picture queue (`OWN_BED_PICTURE_QUEUE`, made in a Claude cloud
  session with `/paid-queue`); until then the built site leaves the story out of the book's choice (`storyBook`) and its
  page for search engines is in `WAITING_PATHS` (noindex, out of the sitemap). What is left once they are made stands in
  each entry's `after`.
