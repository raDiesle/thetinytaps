---
name: musik-erzeugen
description: Background music for a The Tiny Taps game made with Suno – write the copy-paste texts for suno.com, then measure the song the user downloads (tempo, parts), convert it and build it into the game so it loops, follows pause and jumps and gets quiet while the voice speaks. Use when the user wants music, a song or Musik for a game, mentions Suno, or hands over a WAV/MP3 from Suno.
---

# Music with Suno

Suno has no API we use: **the user makes the song on suno.com**, Claude writes
what to type there and builds the downloaded file into the game. Never ask for the
user's Suno login.

Reference: Zähne putzen (`src/games/teeth/music.ts`, `musik/`) – a song whose
parts change exactly with the brushing steps, a finale on the end screen.

## What we learned (keep to it)

- **Instrumental under spoken hints.** Singing under the voice (even quiet) makes both
  hard to follow for a toddler. A **sung song that is itself the hint** works instead:
  one verse per step singing exactly what is shown, the voice then stays silent during
  the steps (Zähne putzen; a new language of it: `/zahnputzlied`). Such a song is part of
  the game: it always plays, sung in the app language (🌐), with no "plain music"
  choice and regardless of "🎵 Musik".
- **Sung songs don't keep to bars.** Asked for "8 bars per part", Suno sang verses of
  5 to 11 bars, put whistled fills between them and sped up from 112 to 115 BPM. Never
  take the beat grid as where the words are: hear where each verse begins
  (`bun run song:verses`, Whisper) and let the game follow the verses. Stretching the
  parts to 8 bars (`bun run song:stretch`) evens out tempo drift of an instrumental song
  only.
- **Give the user exact copy-paste blocks, one per Suno field**, numbered steps in
  the user's language. A general description ("make it loopable, ~90 s") left the
  user not knowing what to do. Every field of every language is a whole block of its own, ready to paste as it is –
  never "the same as above plus …" or a shared block with additions per language to put together by hand (the user
  had to ask again for the Exclude Styles in full). Several languages at once: one complete section per language.
- **Instrumental OFF, structure in the Lyrics field.** With "Instrumental" on, the
  Lyrics field disappears and there is no control over the parts. Lyrics that hold
  only `[bracket tags]` are read as directions and not sung. If Suno sings or hums
  anyway: generate again, or take the instrumental via "Get Stems" (paid plans).
- **Pick the tempo so a part fits the game's timing.** An 8-bar part lasts
  `32 × 60 / BPM` s: 112 BPM → 17.14 s = one step of a 2-minute timer with 7 steps;
  120 BPM → 16 s; 96 BPM → 20 s. Suno kept 112 BPM exactly and made clean 8-bar parts.
  It can't be told "change at 0:17" – the game follows the measured song instead.
- **A loop is cut on the measured grid, never the asked tempo.** The Russian waiting song (Aufs Töpfchen) came at
  97.4 BPM where 100 was asked, with a 13 s intro and an extra chorus at the end. Fit the beat over the whole loop
  and check short windows against it (an off-beat bass shows as half a beat off, not as drift), place the start and
  end on the same bar position (a quiet break or a change in the bass marks a bar line), and keep both clear of
  what is never meant to play (the intro's pickup, the next part's first note).
- **Check a loop's seam against the song itself.** Beat fits over the few seconds round the jump disagreed by half a
  beat in the Spanish waiting song (voice and bass lead them astray). Instead find where the same two parts follow
  each other inside the song (last chorus → first verse is like chorus 1 → verse 2) and cross-correlate onsets: the
  bars before the jump with the bars before that verse, the bars after it with that verse's start – both must land
  within a few hundredths of the seam. Repeated choruses give the most exact times; verses (other words) and
  Whisper's first words after an intro (smeared over it, even a one-bar one) do not. Short windows (1–2 s) over a held
  last note or the quiet gap before a verse have too few onsets and point a beat or a bar off (the English waiting
  song seemed to hold its last chorus a bar longer); windows of 5–8 s reaching across the chorus-to-verse change decide.
  The loop's length is then those two measured distances added up (last chorus − first chorus + verse 2 − verse 1),
  never bars × the tempo: Suno sang the Arabic waiting song's last verse two beats short, so its choruses stood 8, 12,
  12 and then 11.45 bars apart. Check every chorus distance against whole bars before trusting a bar count.
- **Find the parts from the music, not from Whisper's line times.** Whisper (base) heard the Hindi waiting song as
  English, Urdu and an endless „tititi“ and put lines seconds off; it only shows the order of the lines. Where the
  choruses are comes from matching one chorus's spectrum (log bands plus onsets, 10 ms frames) against the whole song:
  the repeats scored 0.85–0.93, everything else below 0.75, and their distances give the tempo to the hundredth.
  Whether anything is sung before the first bar: Whisper on that piece alone, padded with silence.
- Suno usually adds a part and an ending (pause + final chord): useful as a finale
  for the end screen.
- **Download WAV** (best for cutting and converting), otherwise MP3.
- Publishing needs a paid Suno plan (as far as we know); remind the user once.

## 1. Texts for Suno

Ask what the music is for (steps with fixed times, or just a loop) and adapt
tempo, number of parts and instruments. Template for a timed game (Zähne putzen):

**Create → Custom**, Instrumental **off**.

Lyrics:

```text
[Instrumental]
[Tempo: 112 BPM, steady]

[Part 1 – 8 bars – bouncy ukulele, scrubbing back and forth rhythm]

[Glockenspiel sparkle]

[Part 2 – 8 bars – glockenspiel melody, same beat, a little higher]

[Glockenspiel sparkle]

[Part 3 – 8 bars – rolling marimba, round circling melody]

… one part per step …

[Part 7 – 8 bars – all instruments together, joyful build]

[Final happy chord]
[End]
```

Style of Music:

```text
cheerful children's instrumental, 112 BPM, C major, steady bouncy beat, seven clearly different 8-bar sections, ukulele, glockenspiel, marimba, whistling flute, toy piano, light hand claps, bright and happy, no vocals, no intro, no fade out, about 2 minutes
```

Exclude Styles (if the field is there):

```text
vocals, singing, voice, choir, humming, rap, heavy drums, electric guitar, distortion, sad, tempo changes
```

Title: a short name for the game's song.

For a plain loop (no timing): Instrumental **on**, no lyrics, style ending in
`same energy all the way through, seamless loop, no intro, no fade out`. Keep songs
of one game in the same key and instruments, so they fit together.

Tell the user what to listen for: no singing or humming, the changes clearly
audible, about the asked length. Then: download as WAV and tell you the path.

## 2. Measure

```bash
bun run song "/Users/…/Downloads/Song.wav" --bpm 112 --bars 8
```

It prints the tempo, the first beat, the part starts, stretches where the bass is
quiet (breaks, a gentle part, the pause before the final chord) and the path of a
spectrogram picture. **Look at the picture with Read**: part changes show as
vertical edges and gaps; check that they sit on the printed part starts (the grid's
phase is only known within one beat – a song with an intro starts its first part
some beats later). Decide which time is the loop start, where the repeating parts
end, and where a finale starts.

If the tempo is off the asked one, or the parts drift off the printed grid, even it out:

```bash
bun run song:stretch "/Users/…/Downloads/Song.wav" song-112.wav --bpm 112 --bars 8 --start 0.3
```

`--start` is where the first part's first beat is (from the measuring and the picture;
the script can't tell it reliably). It finds each part's real start, stretches every
part to exactly 8 bars (pitch stays) and prints where the parts now begin. `--lead 0.2`
also puts the first beat at exactly 0.2 s, and an `.mp3` out is converted for the game
right away (as in 3.). Measure the result with `bun run song` again.

## 3. Convert and put it in

```bash
ffmpeg -i Song.wav -af "loudnorm=I=-16:TP=-1.5:LRA=11" -ar 44100 -c:a libmp3lame -b:a 128k -map_metadata -1 src/games/<game>/musik/musik-<name>.mp3
```

- Name it `musik-<name>.mp3`: the service worker leaves songs out of its offline copy
  and keeps one only once a page has fetched it, so nothing is downloaded while
  music is off on the home page. 128 kbit/s stereo ≈ 1 MB per minute; keep songs at
  about 2–2.5 minutes.
- `musik/README.md` in the game folder: file, source (Suno, date), terms. Commit the
  MP3, never the WAV.

## 4. Play it in the game

Shared helpers in `@/lib/sfx`: `loadSound(url)` decodes a file, `playLoop(buffer,
{ offset, volume, loopStart, loopEnd, once, fadeIn })` plays it on repeat (or once)
and returns `{ fade, stop }`. Build a small hook like `useBrushingMusic` in
`src/games/teeth/music.ts`:

- find the file with `import songFiles from "./musik/*.mp3?glob"`, so the game still
  builds without it and falls back to its synthesized tune;
- the measured times in one constant (`SONG`) with a comment on the tempo;
- play at the game's own time (offset = first beat + game time), restart when the
  game's clock changes (pause, jumps), stop when paused;
- duck while the voice speaks: poll `speechSynthesis.speaking` every ~150 ms and
  `fade` to a low volume; `VOLUME` ≈ 0.35, ducked ≈ 0.08 for a song at −16 LUFS;
- `useNoBackgroundMusic()` in the game's Play component, so the shared background
  song (`src/lib/backgroundMusic.ts`) stops while the game's own one plays;
- background music plays only while `music` in the common settings is on (switch
  "🎵 Musik" on the home page – off means no song is even downloaded); no extra toggle in
  the game. A sung song that carries the game (Zähne putzen) plays regardless. Nothing
  plays before the child or parent starts the game.

## 5. Check

Sound is muted in Claude's preview, so check what plays instead of listening: before
starting the game, run in the page

```js
window.__log = [];
const S = AudioBufferSourceNode.prototype, start = S.start;
S.start = function (when, offset) {
  if (this.buffer?.duration > 30) window.__log.push({ offset, loop: this.loop, loopStart: this.loopStart, loopEnd: this.loopEnd });
  return start.apply(this, arguments);
};
```

then jump through the game (keys, progress bar) and read `window.__log`: each part
should start at its measured time, pause should stop it, the finale play once.
Ask the user to listen on a real device for the loudness next to the voice.
