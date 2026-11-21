# Videos for YouTube (`src/video/`)

What the YouTube videos are made of (ideas area Y on `/management/`, user request, November 2026). Nothing here is part
of the site children see: each video has a page only for grown-ups under `/management/` (in `NO_INDEX_PATHS`, linked from
the management page's contents by `TOOL_GROUPS`), never a link from the shelf or a book, until the user decides otherwise.
- Recording a page's own tab in Chrome is `VideoRecorder` (`src/components/VideoRecorder.tsx`), shared by every video
  page (the games' videos, the intro and the outro): a new video page gives it its play, never a recorder of its own.
- Chapters and subtitles (Y-26, `captions.ts`): while the play runs the recorder notes each recorded line as it starts
  (`onLineSaid` in `src/lib/voice.ts`, so every video gets its subtitles by itself) and each `chapter(title)` its play
  calls, counted from the recording's first frame. At the end the card shows the chapter marks to copy into the
  description (`chapterList`: the first at 0:00, one shorter than 10 s joined to the one before, since YouTube shows
  chapters only when there are three of at least 10 s) and saves the lines as an .srt. A new video calls `chapter` where
  its parts begin, with names a parent would look for, never one per few seconds.
- `intro/`: the videos' intro (Y-01), at `/management/video-intro/`: the shelf of picture books, the Fun for Both book
  (the families' picture `buch-cover.webp` as its cover) coming out and opening, its first page filling the screen,
  and the app's own `Logo` printed on it letter by letter, the paw tracks walking to the o and Papa Fox with his child
  sitting down on it, then „funforboth.com“. 7.5 s with a sound of its own (`introSound.ts`: a knock, the rush out of
  the shelf, the page-turn, Fun – for – Both as three rising bell notes, paws patting, a warm chord). No voice yet:
  Tapsi saying „Fun for Both!“ would be a paid recording, made only when the user asks.
- `outro/`: the videos' outro (Y-04, Y-05), at `/management/video-outro/`: the intro backwards (it starts on the page
  the intro ends on, the name fades, the book closes and goes back into its gap – `introSecond` maps its time onto the
  intro's, so both stay one motion), the four picture books lighting up one after another with a menu picture of one of
  their games, then a card with the `Logo`, „funforboth.com“, five signs (free, no ads, offline, languages, play-time
  limit) and a QR code to the video's game in the video's language (`CODE_TARGETS`, `addressFor`; `uqr` draws it). 12 s.
  YouTube shows no end screen links on videos made for children, so all of it is in the picture.
  `bun run video outro --ziel /zaehne/ --sprache en` makes it for one game and language.
- `youtubeTexts.ts` (Y-18): title and description of each video for YouTube Studio, shown to copy under „📝 Text für
  YouTube“ on its page (`VideoRecorder youtube`): the title from the YouTube searches looked up (research „youtube-suchen“,
  at most `TITLE_LIMIT` letters, English, German for a German video), the description from the game's texts for search
  engines in the shelf's language with the game's address. A new video adds its line to `YOUTUBE_VIDEOS`, with
  `forKids` and `song` (a Suno song is to be marked as AI-made on YouTube; research „youtube-rechte“).
- `frames.tsx`, `sound.ts`, `canvas.ts`: what both share – the 1920 × 1080 canvas fitted to its stage, the live play
  (`LivePlay`), the render handle (`RenderPlay`, `window.__video`), and the notes and noises of their sounds.

Rules:
- **Every frame is a function of its second** (`timeline.ts`): positions, scales and what has appeared are computed
  from `t`, never left to CSS animations or timers. So the page plays it live from the clock, and `bun run video intro`
  steps through it frame by frame (`?render`, `window.__video.seek(t)`) and gets the same sharp video every time –
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
- A picture shown in a video has no words in it (the outro shows counting, not the letters game's „Affe“): one picture
  serves the video in every language, and its words are the video's own, in its language.
- A QR code is checked by decoding the rendered frame, also scaled down to 480 × 270 as on a television across the room
  (CoreImage's `CIDetector` in a small Swift script does it on this Mac), never only by looking at it.
- Only the app's own pictures and drawings; a new Gemini picture for a video goes into the picture queue and fills a
  sheet like every other (`/bild-erzeugen`).
