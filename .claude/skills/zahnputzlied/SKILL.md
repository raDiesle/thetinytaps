---
name: zahnputzlied
description: The sung Zähneputzen-Lied of „Zähne putzen“ in a new language (or a new take of one) – write the lyrics, one verse per brushing step, give the user the copy-paste texts for suno.com, then even out, convert and drop in the WAV they download; no code needed. Use when the user wants the brushing song in another language (English, Türkisch, Polnisch, …), says "Zahnputzlied", "Lied auf <Sprache>" for Zähne putzen, or hands over a WAV of it.
---

# Zähneputzen-Lied in a new language

The sung brushing song (`src/games/teeth/`, see its `CLAUDE.md`): in two-minute
brushing each of the 7 steps lasts 17.14 s = 8 bars at 112 BPM, and the song sings one
verse per step about what the picture shows, then a finale on the end screen. The
voice stays silent meanwhile, the song is the hint.

A language is **just a file**: `musik/musik-zaehneputzen-lied-<lang>.mp3` (two-letter
code) appears in the setting „Gesungen“ by its name (`sung.ts`, `music.ts`). No code,
unless the language has no name in `SUNG_LABELS` (`sung.ts`) yet – then one line.

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

## 3. Even it out and put it in

Suno speeds up while singing (the German take went from 112 to 115 BPM), so every
part is stretched back to 17.14 s and the first one put at 0.2 s – then all sung songs
share one timing (`SUNG_LEAD`, `SUNG_PART` in `sung.ts`).

```bash
yarn song "/Users/…/Downloads/Song.wav" --bpm 112 --bars 8
```

Look at the spectrogram with Read and find where the first verse's first beat is
(the printed "first beat" can be a beat off; the first part starts right at the
beginning when Suno left out the intro). Then:

```bash
yarn song:stretch "/Users/…/Downloads/Song.wav" src/games/teeth/musik/musik-zaehneputzen-lied-<lang>.mp3 --bpm 112 --start <first beat> --lead 0.2
yarn song src/games/teeth/musik/musik-zaehneputzen-lied-<lang>.mp3 --bpm 112 --bars 8
```

The second must say 112 BPM with parts at about 0.2 + n × 17.14 s (±0.1 s). The
part list of `song:stretch` should show 8 parts of about 16.6–17.2 s plus the short
ending; much shorter or longer means a wrong `--start` or a song that doesn't keep
8-bar verses – then a new take is better than forcing it.

Then:

- `SUNG_LABELS` in `sung.ts`: add the language if it isn't there („🇫🇷 Französisch“).
- `musik/README.md`: a row in the table (source Suno, date, "stretched to 112 BPM").
- `yarn verify` – `sung.test.ts` checks that every song file has a name and its
  lyrics section in `suno-lied.md`.

## 4. Check

Sound is muted in Claude's preview. Log what plays instead (see `/musik-erzeugen` 5.),
choose the language under „Gesungen“, start 2 Minuten, skip the prelude with →, and
step through: the sung file (≈143 s long) must start at 0.20, 17.34, 34.49 … s for the
steps and play 120.20 once at the end. Ask the user to listen on a real device that
each verse comes with its picture. Commit (`Zähne putzen: the brushing song in <Language>`)
and merge into local main.
