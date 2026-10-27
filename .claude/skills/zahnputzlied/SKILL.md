---
name: zahnputzlied
description: The sung Zähneputzen-Lied of „Zähne putzen“ in a new language (or a new take of one) – write the lyrics, one verse per brushing step, give the user the copy-paste texts for suno.com, then convert the WAV they download and find where each verse begins (Whisper), so the steps follow the song; no code needed. Use when the user wants the brushing song in another language (English, Türkisch, Polnisch, …), says "Zahnputzlied", "Lied auf <Sprache>" for Zähne putzen, or hands over a WAV of it.
---

# Zähneputzen-Lied in a new language

The sung brushing song (`src/games/teeth/`, see its `CLAUDE.md`): the brushing lasts
as long as the song (no choice of minutes), the song sings one verse per step about what the picture shows, then a finale
on the end screen. The voice stays silent meanwhile, the song is the hint. Suno doesn't
sing its verses equally long, so **the steps follow the verses**: each step begins a
moment before its verse.

A language is **just two files**: `musik/musik-zaehneputzen-lied-<lang>.mp3` (two-letter
code) and the `.json` of the same name with where its verses begin, found by their name
(`sung.ts`, `music.ts`). There is no choice of song: it is always sung in the app language
(🌐 on the home page, `APP_LANGUAGES` in `src/lib/language.ts`), German when there is no
song in it, so a song in a language the app doesn't speak yet waits until it does. No code.

The user makes the song on suno.com (never ask for their login); general Suno
lessons are in `/musik-erzeugen`.

## 1. Lyrics

`musik/suno-lied.md` has every language made so far, with what was typed into Suno.
Translate the **German** section (the original; the steps are in `steps.ts`) into a
new section `## <Language> (\`<lang>\`, <date>)` there. Rules for the verses:

- **Same frame:** the tag lines stay English and unchanged (`[Tempo: 112 BPM …]`,
  `[Part N – 8 bars – …]`, `[Glockenspiel sparkle]`, `[Final happy chord]`, `[End]`);
  Suno reads them as directions, only the verses are sung.
- **One verse per step, in step order,** 4 short lines (2 bars each), rhyming in pairs.
  It says what the picture shows, not a word-for-word translation:
  1. mouth wide open, bottom chewing surfaces, back and forth
  2. top chewing surfaces, back and forth
  3. bite together, outside on one side, small circles
  4. outside at the front, a big grin, small circles
  5. the other side, small circles
  6. mouth wide open, inside bottom by the tongue, wipe from red to white
  7. inside top, almost done, wipe
  8. finale: done, shiny teeth, the (sugar) monsters are gone, hooray
- **For a two-year-old:** words a toddler knows, present tense, sound words to join
  in (*schrubbel*, *brumm*, *wisch* – find the language's own ones), repeat lines
  between similar steps (3–5, 6–7). No names, nothing to count, no "if".
- Let a native speaker of the family read it if possible; tell the user which lines
  you are unsure of.

## 2. Texts for Suno

Give the user numbered steps with one copy-paste block per field, in the user's language:

1. **Create → Custom**, **Instrumental off**.
2. **Lyrics:** the new section's lyrics.
3. **Style of Music** – the German one with the language swapped:

```text
cheerful <Language> children's song for toddlers, exactly 112 BPM, steady tempo that never speeds up, C major, steady bouncy beat, one warm friendly female voice, slow clear pronunciation, simple sing-along melody, eight clearly different 8-bar sections, ukulele, glockenspiel, marimba, whistling flute, toy piano, light hand claps, bright and happy, no intro, no fade out, about 2 minutes 20 seconds
```

4. **Exclude Styles:**

```text
choir, rap, autotune, whisper, heavy drums, electric guitar, distortion, sad, tempo changes, speeding up, long intro
```

5. **Title:** the song's name in that language.
6. Listen to both takes: every word clear, no line missing or doubled, no extra verse,
   about 2:20 with a final chord. Wrong word → generate again or "Replace Section".
   Download the better one as **WAV** and send the path.

## 3. Put it in

```bash
bun run song:verses "/Users/…/Downloads/Song.wav" src/games/teeth/musik/musik-zaehneputzen-lied-<lang>.mp3 --lang <lang>
```

It converts the song for the game, listens to it with Whisper (needs
`brew install whisper-cpp` and the model in `~/.cache/whisper/ggml-base.bin` – the
script prints how; downloading them needs the user's OK), finds the first line of every
part of the new lyrics section in order, and writes the `.json`. It prints each part's
start and length:

- **A line not found:** it prints what Whisper heard there. Usually Suno left out or
  changed the line – a new take is better than forcing it.
- **Nothing found at all** (Chinese and Hindi so far, expect it for every language not in
  Latin or Cyrillic letters): the `.mp3` is already written; the matching failed, not the
  song. Whisper writes in another script (Chinese in traditional characters with homophones,
  牙齿 → 雅之; Hindi in Latin or Urdu letters) and over a whole song often falls into a loop
  (Hindi: „Band karo“ for the last 50 s). Write the `.json` by hand instead:
  1. `whisper-cli -m ~/.cache/whisper/ggml-base.bin -l <lang> -f song.wav -ml 1 -dtw base`
     gives word times; read each part's first line by its sound in whatever script comes out.
  2. Where it loops or is unsure, cut 14–16 s around the part and let it listen to that alone.
  3. Draw part 1 (there is usually a whistled intro) and check the grid: Suno sings a line
     every 2 bars (about 4.3 s), so a start that breaks it is suspect.
  4. Each start 0.3 s before the first word; check every step is 13–26 s.
  A `--prompt` in the right script got Chinese into simplified characters but sent Hindi into
  an endless „music music“, so the script doesn't use one.
- **"odd length"** (a step under 13 s or over 26 s): Suno crammed or stretched a verse.
  Usable (the German take has a 9 s step), but tell the user and offer a new take.
- **"unsure start"**: Whisper spread the line's first three words over more than 3 s,
  smearing them over an intro or a break (Spanish: „Abre grande“ over 7 s of whistling,
  the start came out 5 s early). Always draw that part and correct the start.
- **Whisper's times can be seconds off**, mostly for the first word after a break.
  Always draw part 1: Suno puts a whistled intro before it in spite of "no intro"
  (Spanish 7 s, Italian 9.5 s). Over a whole song Whisper's text also drifts: it can squeeze
  lines together or borrow a line from an earlier verse. Before calling a start or a sung
  line wrong, let Whisper listen to a 12–16 s cut around it alone
  (`ffmpeg -ss <from> -t 16 -i song.wav cut.wav`, then `whisper-cli -l <lang> -f cut.wav`). For any start that looks doubtful, draw that stretch and look at it with Read: the
  voice shows as stacks of many harmonics, a whistle or flute as a single line.

```bash
ffmpeg -ss <from> -t 12 -i src/games/teeth/musik/musik-zaehneputzen-lied-<lang>.mp3 -lavfi "pan=mono|c0=0.5*c0+0.5*c1,showspectrumpic=s=1400x500:fscale=log:start=150:stop=3000:legend=1" check.png
```

  If a start is wrong, correct it in the `.json` by hand (a moment, ~0.3 s, before the
  first word).

Then:

- `musik/README.md`: a row in the table (source Suno, date); `suno-lied.md`: a note on
  anything odd in the take.
- `bun run verify` – `sung.test.ts` checks that every song has its `.json` (one start per
  step plus the finale, steps 8–30 s) and its lyrics in `suno-lied.md`.

## 4. Check

Sound is muted in Claude's preview. Log what plays instead (see `/musik-erzeugen` 5.),
choose the language with 🌐 on the home page, open Zähne putzen, press „Los geht's!“, skip the prelude with →, and
step through: the sung file must start at the `.json`'s times, one per step, and play
the last one once at the end; the timer shows the song's length (finale − first verse). Ask the user to listen on a real device that
each verse comes with its picture. Commit (`Zähne putzen: the brushing song in <Language>`)
and merge into local main.
