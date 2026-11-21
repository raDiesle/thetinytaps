# Videos for YouTube (`src/video/`)

What the YouTube videos are made of (ideas area Y on `/management/`, user request, November 2026). Nothing here is part
of the site children see: each video has a page only for grown-ups under `/management/` (in `NO_INDEX_PATHS`, linked at
the top of the management page), never a link from the shelf or a book, until the user decides otherwise.
- Recording a page's own tab in Chrome is `VideoRecorder` (`src/components/VideoRecorder.tsx`), shared by every video
  page (the games' videos and the intro): a new video page gives it its play, never a recorder of its own.
- `intro/`: the videos' intro (Y-01), at `/management/video-intro/`: the shelf of picture books, the Fun for Both book
  (the families' picture `buch-cover.webp` as its cover) coming out and opening, its first page filling the screen,
  and the app's own `Logo` printed on it letter by letter, the paw tracks walking to the o and Papa Fox with his child
  sitting down on it, then „funforboth.com“. 7.5 s with a sound of its own (`introSound.ts`: a knock, the rush out of
  the shelf, the page-turn, Fun – for – Both as three rising bell notes, paws patting, a warm chord). No voice yet:
  Tapsi saying „Fun for Both!“ would be a paid recording, made only when the user asks.

Rules:
- **Every frame is a function of its second** (`timeline.ts`): positions, scales and what has appeared are computed
  from `t`, never left to CSS animations or timers. So the page plays it live from the clock, and `bun run video intro`
  steps through it frame by frame (`?render`, `window.__intro.seek(t)`) and gets the same sharp video every time –
  1920 × 1080 at 60 fps, no dropped frame. A new video made by the tool follows the same pattern and is added to
  `VIDEOS` in `tools/video.ts`.
- The canvas is drawn at 1920 × 1080 in pixels and scaled to the stage (`.vi-fit`); the title lies over the book only
  once its page fills the whole picture (`timeline.test.ts`), so the name is never drawn scaled up and blurred.
- Sound is laid on a time line of its own (`scheduleIntroSound`): live it goes through the app's one audio context and
  `speaker()` (so `silent` keeps Claude's preview quiet); for the file it is rendered by an `OfflineAudioContext`, which
  plays nothing, and ffmpeg sets it to −16 LUFS. Noise has a fixed seed. Check it by its waveform or by measuring the
  file (`ffmpeg -af ebur128`), never by playing it on this Mac – and say so.
- The Browser pane, when hidden, throttles frames and `seek` never resolves there: look at frames with
  `bun run video intro --shots 0.9,2.8,4.4` (PNGs in `video-out/`, which git ignores) instead.
- Only the app's own pictures and drawings; a new Gemini picture for a video goes into the picture queue and fills a
  sheet like every other (`/bild-erzeugen`).
