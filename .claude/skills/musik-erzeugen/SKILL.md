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

- **Instrumental only.** The spoken hints are what the games are about, and singing
  under them (even quiet) makes both hard to follow for a toddler. Suno's German
  vocals were also not good enough, and a sung song per language isn't worth it.
- **Give the user exact copy-paste blocks, one per Suno field**, numbered steps in
  the user's language. A general description ("make it loopable, ~90 s") left the
  user not knowing what to do.
- **Instrumental OFF, structure in the Lyrics field.** With "Instrumental" on, the
  Lyrics field disappears and there is no control over the parts. Lyrics that hold
  only `[bracket tags]` are read as directions and not sung. If Suno sings or hums
  anyway: generate again, or take the instrumental via "Get Stems" (paid plans).
- **Pick the tempo so a part fits the game's timing.** An 8-bar part lasts
  `32 × 60 / BPM` s: 112 BPM → 17.14 s = one step of a 2-minute timer with 7 steps;
  120 BPM → 16 s; 96 BPM → 20 s. Suno kept 112 BPM exactly and made clean 8-bar parts.
  It can't be told "change at 0:17" – the game follows the measured song instead.
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
yarn song "/Users/…/Downloads/Song.wav" --bpm 112 --bars 8
```

It prints the tempo, the first beat, the part starts, stretches where the bass is
quiet (breaks, a gentle part, the pause before the final chord) and the path of a
spectrogram picture. **Look at the picture with Read**: part changes show as
vertical edges and gaps; check that they sit on the printed part starts (the grid's
phase is only known within one beat – a song with an intro starts its first part
some beats later). Decide which time is the loop start, where the repeating parts
end, and where a finale starts.

## 3. Convert and put it in

```bash
ffmpeg -i Song.wav -af "loudnorm=I=-16:TP=-1.5:LRA=11" -ar 44100 -c:a libmp3lame -b:a 128k -map_metadata -1 src/games/<game>/musik/<name>.mp3
```

- 128 kbit/s stereo ≈ 1 MB per minute. The service worker keeps every built file
  offline on every device, so keep songs at about 2–2.5 minutes.
- `musik/README.md` in the game folder: file, source (Suno, date), terms. Commit the
  MP3, never the WAV.

## 4. Play it in the game

Shared helpers in `@/lib/sfx`: `loadSound(url)` decodes a file, `playLoop(buffer,
{ offset, volume, loopStart, loopEnd, once, fadeIn })` plays it on repeat (or once)
and returns `{ fade, stop }`. Build a small hook like `useBrushingMusic` in
`src/games/teeth/music.ts`:

- find the file with `import.meta.webpackContext("./musik", …)`, so the game still
  builds without it and falls back to its synthesized tune;
- the measured times in one constant (`SONG`) with a comment on the tempo;
- play at the game's own time (offset = first beat + game time), restart when the
  game's clock changes (pause, jumps), stop when paused;
- duck while the voice speaks: poll `speechSynthesis.speaking` every ~150 ms and
  `fade` to a low volume; `VOLUME` ≈ 0.35, ducked ≈ 0.08 for a song at −16 LUFS;
- a "Musik" toggle in the game's settings. Music is off by default in the games
  unless the user asks otherwise (Zähne putzen: on, by request). Nothing plays before
  the child or parent starts the game.

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
