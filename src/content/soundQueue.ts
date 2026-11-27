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
export const SOUND_QUEUE: QueuedSound[] = [];
