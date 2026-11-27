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
    id: "lion-roar-1",
    file: "src/lib/sounds/lion-roar-1.mp3",
    use: "Zähne putzen (X-26), Phase „Brüllen wie ein Löwe“: der Löwe brüllt in Runde 1 von 3 nach 3, 2, 1 zusammen mit dem Kind – leise und kurz, der erste von dreien. Bis die Aufnahme kommt, spielt roar.mp3 von Freesound.",
    prompt:
      "A friendly lion roaring, a short, gentle roar that swells from a low growl into an open 'rooaar' and fades out, warm and playful for small children, not scary, close up, clean recording, no background noise",
    seconds: 1.5,
    influence: 0.7,
    after:
      "Cut to the roar alone (about 1.0–1.3 s: each round's roar is longer than the one before, and the mouths stay open for it, ROUNDS in src/games/teeth/lion.tsx), bring it to about −18 LUFS like the other recordings – lion.tsx makes the rounds louder itself (ROUNDS' gain) – and add its row under „Made with ElevenLabs“ in src/lib/sounds/README.md. lion.tsx already plays and preloads it by its name; listen at /zaehne/ (tap the lion's symbol on the bar).",
    date: "2026-11-27",
  },
  {
    id: "child-roar-1",
    file: "src/lib/sounds/child-roar-1.mp3",
    use: "Zähne putzen (X-26), Phase „Brüllen wie ein Löwe“: das Kind im Löwenkostüm brüllt in Runde 1 von 3 zusammen mit dem Löwen – leise und kurz, der erste von dreien; ein Kind, kein echter Löwe. Bis die Aufnahme kommt, spielt ein synthetisches „Rooaah“ (playLittleRoar).",
    prompt:
      "A small child playfully roaring like a little lion, a short, gentle 'rooaah' that opens from a short growl into a long 'aah', happy and gentle, not scary, close up, clean recording, no background noise",
    seconds: 1.5,
    influence: 0.7,
    after:
      "Cut to the roar alone (about 1.0–1.3 s, as long as the lion's roar of the same round, which it sounds together with), bring it to about −20 LUFS – a little under the lion's – and add its row under „Made with ElevenLabs“ in src/lib/sounds/README.md. lion.tsx already plays and preloads it by its name; once all six roars are made, say in src/games/teeth/CLAUDE.md that the roars are recordings now and take the stand-ins (playRecorded(\"roar\", …), playLittleRoar's strength) out of roarTogether in lion.tsx.",
    date: "2026-11-27",
  },
  {
    id: "lion-roar-2",
    file: "src/lib/sounds/lion-roar-2.mp3",
    use: "Zähne putzen (X-26), Phase „Brüllen wie ein Löwe“: der Löwe brüllt in Runde 2 von 3 nach 3, 2, 1 zusammen mit dem Kind – lauter und etwas länger als in Runde 1. Bis die Aufnahme kommt, spielt roar.mp3 von Freesound.",
    prompt:
      "A friendly lion roaring, a bigger, longer roar that swells from a low growl into an open 'rooaar' and fades out, warm and playful for small children, not scary, close up, clean recording, no background noise",
    seconds: 2.0,
    influence: 0.7,
    after:
      "Cut to the roar alone (about 1.4–1.8 s: each round's roar is longer than the one before, and the mouths stay open for it, ROUNDS in src/games/teeth/lion.tsx), bring it to about −18 LUFS like the other recordings – lion.tsx makes the rounds louder itself (ROUNDS' gain) – and add its row under „Made with ElevenLabs“ in src/lib/sounds/README.md. lion.tsx already plays and preloads it by its name; listen at /zaehne/ (tap the lion's symbol on the bar).",
    date: "2026-11-27",
  },
  {
    id: "child-roar-2",
    file: "src/lib/sounds/child-roar-2.mp3",
    use: "Zähne putzen (X-26), Phase „Brüllen wie ein Löwe“: das Kind im Löwenkostüm brüllt in Runde 2 von 3 zusammen mit dem Löwen – lauter und etwas länger als in Runde 1; ein Kind, kein echter Löwe. Bis die Aufnahme kommt, spielt ein synthetisches „Rooaah“ (playLittleRoar).",
    prompt:
      "A small child playfully roaring like a little lion, a bigger, longer 'rooaah' that opens from a short growl into a long 'aah', happy and gentle, not scary, close up, clean recording, no background noise",
    seconds: 2.0,
    influence: 0.7,
    after:
      "Cut to the roar alone (about 1.4–1.8 s, as long as the lion's roar of the same round, which it sounds together with), bring it to about −20 LUFS – a little under the lion's – and add its row under „Made with ElevenLabs“ in src/lib/sounds/README.md. lion.tsx already plays and preloads it by its name; once all six roars are made, say in src/games/teeth/CLAUDE.md that the roars are recordings now and take the stand-ins (playRecorded(\"roar\", …), playLittleRoar's strength) out of roarTogether in lion.tsx.",
    date: "2026-11-27",
  },
  {
    id: "lion-roar-3",
    file: "src/lib/sounds/lion-roar-3.mp3",
    use: "Zähne putzen (X-26), Phase „Brüllen wie ein Löwe“: der Löwe brüllt in Runde 3 von 3 nach 3, 2, 1 zusammen mit dem Kind – der lauteste und längste der drei. Bis die Aufnahme kommt, spielt roar.mp3 von Freesound.",
    prompt:
      "A friendly lion roaring, the biggest and longest, proud and full roar that swells from a low growl into an open 'rooaar' and fades out, warm and playful for small children, not scary, close up, clean recording, no background noise",
    seconds: 2.6,
    influence: 0.7,
    after:
      "Cut to the roar alone (about 1.9–2.4 s: each round's roar is longer than the one before, and the mouths stay open for it, ROUNDS in src/games/teeth/lion.tsx), bring it to about −18 LUFS like the other recordings – lion.tsx makes the rounds louder itself (ROUNDS' gain) – and add its row under „Made with ElevenLabs“ in src/lib/sounds/README.md. lion.tsx already plays and preloads it by its name; listen at /zaehne/ (tap the lion's symbol on the bar).",
    date: "2026-11-27",
  },
  {
    id: "child-roar-3",
    file: "src/lib/sounds/child-roar-3.mp3",
    use: "Zähne putzen (X-26), Phase „Brüllen wie ein Löwe“: das Kind im Löwenkostüm brüllt in Runde 3 von 3 zusammen mit dem Löwen – der lauteste und längste der drei; ein Kind, kein echter Löwe. Bis die Aufnahme kommt, spielt ein synthetisches „Rooaah“ (playLittleRoar).",
    prompt:
      "A small child playfully roaring like a little lion, the biggest and longest, proud and full 'rooaah' that opens from a short growl into a long 'aah', happy and gentle, not scary, close up, clean recording, no background noise",
    seconds: 2.6,
    influence: 0.7,
    after:
      "Cut to the roar alone (about 1.9–2.4 s, as long as the lion's roar of the same round, which it sounds together with), bring it to about −20 LUFS – a little under the lion's – and add its row under „Made with ElevenLabs“ in src/lib/sounds/README.md. lion.tsx already plays and preloads it by its name; once all six roars are made, say in src/games/teeth/CLAUDE.md that the roars are recordings now and take the stand-ins (playRecorded(\"roar\", …), playLittleRoar's strength) out of roarTogether in lion.tsx.",
    date: "2026-11-27",
  },
];
