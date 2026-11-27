/**
 * Sound effects the user has asked for that wait for ElevenLabs (user request, 21 November 2026): the Mac most sessions
 * run on sits behind the company's Zscaler, which blocks ElevenLabs, so a session there writes the approved sound down
 * here, in the same commit as the code that plays it, and a Claude cloud session makes it with `/paid-queue`
 * (`.claude/skills/paid-queue/`): with ElevenLabs' sound effects as `src/lib/sounds/README.md` („Made with ElevenLabs“)
 * says – the prompt, then cut by its loudness to the sound itself and saved small – checked, and committed with this
 * entry taken out (`soundQueue.test.ts` fails while its file exists).
 *
 * Only a sound no CC0 recording on Freesound fits comes here (README), or one the user chose ElevenLabs for (the
 * Geräusch-Rätsel's, 21 November 2026); they cost credits (about 11 a second asked for).
 */

/** One sound effect to make. */
export interface QueuedSound {
  /** Unique, short; usually the file's name without folder and extension. */
  id: string;
  /** Where the finished sound goes, relative to the repository (`src/lib/sounds/<name>.mp3`, or a game's own folder of sounds). */
  file: string;
  /** What it is for, in German, for the grown-up on `/management/`. */
  use: string;
  /** What ElevenLabs is asked for, in English: the one sound and nothing else („…, close up, clean recording, no background noise“). */
  prompt: string;
  /** Seconds asked for (`duration_seconds`, 1.5–2 for a call); the cut keeps only the sound itself. */
  seconds: number;
  /** How closely it follows the prompt (`prompt_influence`, 0.7 for a call). */
  influence: number;
  /** What is left to do once it is made, beyond saving it at `file` (a line in `realSounds.ts`, a README row …). */
  after?: string;
  /** When it was asked for, YYYY-MM-DD. */
  date: string;
}

/** Approved and not made yet, oldest first. */
export const SOUND_QUEUE: QueuedSound[] = [
  {
    id: "littleroar",
    file: "src/lib/sounds/littleroar.mp3",
    use: "Zähne putzen (X-26): vor dem ersten Vers reißt das Kind im Spiegel den Mund weit auf und brüllt einmal leise wie ein kleiner Löwe – ein Kind, kein echter Löwe. Bis die Aufnahme kommt, spielt ein synthetisches „Rooaah“ (playLittleRoar).",
    prompt:
      "A small child playfully roaring like a little lion, one soft and cute 'rooaah' that opens from a short growl into a long 'aah', happy and gentle, not scary, close up, clean recording, no background noise",
    seconds: 2,
    influence: 0.7,
    after:
      "Cut to the roar alone (about 1.2–1.8 s, it starts on the third beat of the lion's two bars, ROAR_AT in src/games/teeth/TeethPlay.tsx, and must have rung out before 3, 2, 1 begins at 4.3 s), bring it to about −20 LUFS – a soft roar, a little under the other sounds – and add its row under „Made with ElevenLabs“ in src/lib/sounds/README.md. TeethPlay already plays and preloads it by its name (LITTLE_ROAR); listen to it at /zaehne/ (jump to the first look in the mirror) and say in src/games/teeth/CLAUDE.md that the roar is a recording now.",
    date: "2026-11-27",
  },
];
