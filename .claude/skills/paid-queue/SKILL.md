---
name: paid-queue
description: Run the open paid queue of Fun for Both in a Claude cloud session – the approved ElevenLabs recordings (src/content/voiceQueue.ts) and sound effects (src/content/soundQueue.ts) and the Gemini pictures cheap now (src/content/pictureQueue.ts) – make them, check and cut them, finish each entry's `after`, take them out of the queues, verify, merge into main and push. Use in a Claude cloud session when the user says "/paid-queue", "run the queue", "Paid-Queue ausführen", "mach die offenen Aufnahmen und Bilder", or /management/ shows „Offen für Claude Cloud“. Never on the user's Mac (Zscaler blocks both services).
---

# Run the paid queue in Claude Cloud

The user's Mac sits behind Zscaler, which blocks ElevenLabs and Gemini, so sessions there only write approved work into
the queues, with the game's code already wired up and what is left to do in each entry's `after`; a Claude cloud session
(outside the filter, the keys `ELEVENLABS_API_KEY`, `ELEVENLABS_API_KEY_2` and `GEMINI_API_KEY` in its environment)
makes it and finishes the task – the only way (root `CLAUDE.md`, „Working here“): `bun run paid` as a bare script on
another computer is deprecated (user decision, 21 November 2026), since nobody there looks at what came. The first box
on `/management/` (`CloudQueueStatus`) says whether anything is open. It was meant to run every evening by itself as a
scheduled task, but scheduled tasks are off for the organization (21 November 2026): until an admin turns them on
(Organization settings → Capabilities), the user starts it by saying `/paid-queue` in a cloud session. Once they are
on, a scheduled task that starts a fresh cloud session each evening with „Run /paid-queue“ makes it automatic.

Being asked to run the queue is the user's approval to spend what the queues list – nothing beyond it, apart from
retries of a picture or sound that came out wrong (step 4).

1. Latest main: `git fetch origin main && git merge --no-edit origin/main` on the session's branch (or start the branch
   from `origin/main`), then `bun install`. Read the `CLAUDE.md` of every game a queued thing belongs to.
2. `bun run paid --dry`. „nothing to make“ → stop and say nothing is open: no commit, no push. Pictures that only wait
   for partners on their sheet are not open; never make them early unless the user says so.
3. Check the three keys are set (only that they are set – never print them), then `bun run paid` (in the background;
   it records, then makes the pictures). The voice script refuses unlicensed models and free accounts
   (`requireLicense`): never work round that. Sound effects (`soundQueue.ts`, listed by the run): before the first one,
   read ElevenLabs' own pages on sound effects (no Beta Service, and its terms allow publishing – root `CLAUDE.md`);
   only then make each as `src/lib/sounds/README.md` says („Made with ElevenLabs“: prompt, seconds, influence, cut by
   loudness to the sound itself, saved small) and add its row to the README's table.
4. Look at everything made as `/bild-erzeugen` says (steps 3–5 there: what was asked, clean cut-outs, no text, judge as
   the user does, not stricter): every sheet in `.image-raw/` and every saved file; a recording or sound by its length
   and loudness (and `whisper-cli` for a line's words where it is at hand). A plainly broken one is made again with a
   better prompt, at most about three tries; what is still wrong keeps its queue entry, its file left out – say so.
5. Do each entry's `after` (the run prints them at its end): a crop, a line of code, `bun run previews <folder>`, a
   placeholder taken out, a `languageStatus.ts` row. Where the game shows the new thing, look at it as the root
   `CLAUDE.md` says (`bun run perf --no-build --shots <scenario>` for a built page when no browser is at hand).
6. Take every made job out of `VOICE_QUEUE`, every made sound out of `SOUND_QUEUE` and every made picture out of its
   queue (the script prints which), in the same commit as the new files (`stimme/`, `bilder/`, `src/lib/sounds/`);
   keep the queue files' types and exported helpers.
7. `bun run format`, then `bun run verify` – it must end with `verify: OK`, never piped before the commit.
8. Commit (`Paid runs: <what was made, in plain words>`), then `bun run ship`: it merges into main, pushes it and
   deletes the session's branch (where pushing main is refused it says so: push the branch and tell the user to merge it).
9. Report: what was recorded, generated and built in, the cost, what was left out and why, and what was pushed.
