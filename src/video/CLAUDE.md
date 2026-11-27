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
- `intro/`: the videos' intro (Y-01), at `/management/video-intro/`: the shelf of picture books, the Little Steps to Grow book
  (the families' picture `buch-cover.webp` as its cover) coming out and opening, its first page filling the screen,
  and the app's own `Logo` printed on it letter by letter, the paw tracks walking to the o and Papa Fox with his child
  sitting down on it, then „littlestepstogrow.com“. 7.5 s with a sound of its own (`introSound.ts`: a knock, the rush out of
  the shelf, the page-turn, Fun – for – Both as three rising bell notes, paws patting, a warm chord). No voice yet:
  Tapsi saying „Little Steps to Grow!“ would be a paid recording, made only when the user asks.
- `outro/`: the videos' outro (Y-04, Y-05), at `/management/video-outro/`: the intro backwards (it starts on the page
  the intro ends on, the name fades, the book closes and goes back into its gap – `introSecond` maps its time onto the
  intro's, so both stay one motion), the four picture books lighting up one after another with a menu picture of one of
  their games, then a card with the `Logo`, „littlestepstogrow.com“, five signs (free, no ads, offline, languages, play-time
  limit) and a QR code to the home page in the video's language (`codeAddress`; `uqr` draws it). 12 s.
  YouTube shows no end screen links on videos made for children, so all of it is in the picture.
  `bun run video outro --sprache en` makes it for one language.
  **The outro is the same in every video** (user decision, November 2026): its code leads to the home page, never to
  the video's game, so one outro per language is rendered once and put after each video; the link to the game stands
  in the video's description (`VIDEO_PAGES`, `youtubeTexts.ts`). Nothing in it may depend on the video it follows.
  It comes in three variants (choice „Variante“ on the page, `--variante bilder` or `--variante regal` for the tool):
  „Pinnwand“, the default, „Bilder aus den Spielen“ and the shelf one above.
  „Pinnwand“ (`pinboard.ts`, `PinboardScene`, `schedulePinboardSound`, 7 s; user request, 27 November 2026: the
  pictures one after another went by too fast and gave no overview) is one single picture: a cork board filling the
  screen with the games' photos (`PINBOARD` in `content.ts`, places in `PIN_SLOTS`) in white frames, each with a word
  for what it shows on its frame (the game's name, or a short `word` where that is a whole question), each held by a
  pushpin – **all of them there from the first frame** (user request, 27 November 2026: pinned one after another the
  board took too long), and only then a sheet torn from a spiral pad (its holes along the top, faintly squared, two
  pins) pressed into the middle with the site's name as the app prints it (`Logo` in one line, Papa Fox and his child
  on the o, the paw tracks) and under it „www.littlestepstogrow.com“ in the app's rounded letters, marked by a
  highlighter stroke drawn on, and „Alltagshelfer & Lernspiele“ (`BOARD_LINE`) – no card, no signs, no code after it.
  Its words are in the board's own style, never a bold serif on a plain card (user feedback, 27 November 2026), and
  every word stays inside its sheet in every language: the address once ran out over the photos beside it – look at
  a frame (`--shots 6`) in a long language (es) after changing the sheet. Which photos hang there is the user's choice
  (they pick from `/management/bilder/`; the twelve there now were chosen on 27 November 2026); a photo swapped keeps
  its place, and the board stays one picture to take in at a glance, never a run of pictures again.
  „Bilder aus den Spielen“ (`gallery.ts`, `GalleryScene`, `scheduleGallerySound`, about 17 s; user request, November
  2026: show the games' pictures big, not the books) opens on the two
  categories side by side, „Alltagshelfer“ and „Lernspiele“, each with a picture of its games and its name under it;
  then six helpers and six games (`GALLERY` in `content.ts`) come one after another out of the depth into the middle,
  big, the game's name on a slip under it and its category over it, each with a rising note, the one before flying on
  past the camera; then the same card (`EndCard`). Motion, pictures and sound are the same in every video; only the
  words and the code's address follow the video's language.
- Pictures shown big in a video are at least 1100 px wide (`gallery.test.ts`): a menu's 480 × 320 preview shown
  1140 wide was blurred. The games' painted pictures (1200 wide) serve as they are; a game drawn in code gets a cut of
  1200 × 800 by `bun run previews --video` (`VIDEO_GAMES` in `tools/previews.ts`, into `outro/bilder/`), with what it
  lays over its picture (minutes, names, a question, buttons) hidden there – a new one adds its line.
- In a run of pictures flying past, the one passing fades within a few frames (slowly, it lay over the next as a pale
  double picture), a heading changes by crossfading in place (moving, it crossed the growing picture), and the card
  comes only once the last picture is gone (over it, it looked muddy) – `gallery.test.ts` checks the last two.
- `youtubeTexts.ts` (Y-18): title and description of each video for YouTube Studio, shown to copy under „📝 Text für
  YouTube“ on its page (`VideoRecorder youtube`): the title from the YouTube searches looked up (research „youtube-suchen“,
  at most `TITLE_LIMIT` letters, English, German for a German video), the description from the game's texts for search
  engines in the shelf's language with the game's address. A new video adds its line to `YOUTUBE_VIDEOS`, with
  `forKids` and `song` (a Suno song is to be marked as AI-made on YouTube; research „youtube-rechte“).
- `frames.tsx`, `sound.ts`, `canvas.ts`: what both share – the 1920 × 1080 canvas fitted to its stage, the live play
  (`LivePlay`), the render handle (`RenderPlay`, `window.__video`), and the notes and noises of their sounds.
  Space or a click on the picture pauses the live play and goes on (user request, 27 November 2026, to look at a moment
  while testing): its clock stands and the audio context is suspended with it, and a slip at the stage's foot says the
  second it stands at. Every video page has it through `LivePlay`; never a pause of a page's own.

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
