---
name: paid-queue
description: Run the open paid queue of Fun for Both in a Claude cloud session – the approved ElevenLabs recordings (src/content/voiceQueue.ts) and the Gemini pictures cheap now (src/content/pictureQueue.ts) – check what came, take it out of the queues, verify, merge into main and push. Use in a Claude cloud session when the user says "/paid-queue", "run the queue", "Paid-Queue ausführen", "mach die offenen Aufnahmen und Bilder", or /management/ shows „Offen für Claude Cloud“. Never on the user's Mac (Zscaler blocks both services).
---

# Run the paid queue in Claude Cloud

The user's Mac sits behind Zscaler, which blocks ElevenLabs and Gemini, so sessions there only write approved work into
the queues; a Claude cloud session (outside the filter, the keys `ELEVENLABS_API_KEY`, `ELEVENLABS_API_KEY_2` and
`GEMINI_API_KEY` in its environment) makes it – the recommended default (root `CLAUDE.md`, „Working here“). The first
box on `/management/` (`CloudQueueStatus`) says whether anything is open. It was meant to run every evening by itself as
a scheduled task, but scheduled tasks are off for the organization (21 November 2026): until an admin turns them on
(Organization settings → Capabilities), the user starts it by saying `/paid-queue` in a cloud session. Once they are
on, a scheduled task that starts a fresh cloud session each evening with „Run /paid-queue“ makes it automatic.

Being asked to run the queue is the user's approval to spend what the queues list – nothing beyond it.

1. Latest main: `git fetch origin main && git merge --no-edit origin/main` on the session's branch (or start the branch
   from `origin/main`), then `bun install`.
2. `bun run paid --dry`. „nothing to make“ → stop and say nothing is open: no commit, no push. Pictures that only wait
   for partners on their sheet are not open; never make them early unless the user says so.
3. Check the three keys are set (only that they are set – never print them), then `bun run paid`. The voice script
   refuses unlicensed models and free accounts (`requireLicense`): never work round that.
4. Look at every sheet in `.image-raw/` and the saved files: each picture must show what its queue entry asks, cut out
   cleanly where it says `transparent`. A clearly wrong one keeps its queue entry and its file is left out – say so.
5. Take every made job out of `VOICE_QUEUE` and every made picture out of its queue (the script prints which), in the
   same commit as the new files (`stimme/`, `bilder/`); keep the queue files' types and exported helpers.
6. `bun run format`, then `bun run verify` – it must end with `verify: OK`, never piped before the commit.
7. Commit (`Paid runs: <what was made, in plain words>`), then `bun run ship`: it merges into main, pushes it and
   deletes the session's branch (where pushing main is refused it says so: push the branch and tell the user to merge it).
8. Report: what was recorded and generated, the cost, what was left out and why, and what was pushed.
