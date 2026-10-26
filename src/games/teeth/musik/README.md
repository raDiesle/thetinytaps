# Musik beim Putzen

`musik-zaehneputzen.mp3` is the background music of Zähne putzen (`../music.ts`).
Without it the synthesized tune plays.

`musik-zaehneputzen-lied-<lang>.mp3` are sung versions for the two-minute brushing:
one verse per step singing what is shown, then the finale. `suno-lied.md` has what
was typed into Suno. Suno doesn't sing its verses equally long, so the
`musik-zaehneputzen-lied-<lang>.json` next to each says where its verses begin (heard
with Whisper) and the steps follow them. Both files are made by `yarn song:verses`.
A new language: the `/zahnputzlied` skill.

The song is instrumental, 112 BPM, with a new part every 8 bars (17.14 s) – exactly
one step of the two-minute brushing. `PLAIN` in `music.ts` holds where the first
part, the finale (eighth part) and the end of the repeating parts are. When the
song is swapped, measure these again (see the `/musik-erzeugen` skill).

Made from the WAV with `ffmpeg -i song.wav -af "loudnorm=I=-16:TP=-1.5:LRA=11" -ar 44100 -c:a libmp3lame -b:a 128k -map_metadata -1 musik-zaehneputzen.mp3`.

| File                             | Source                                               | Terms                                                                  |
| -------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------- |
| `musik-zaehneputzen.mp3`         | Generated with [Suno](https://suno.com), 24 Oct 2026 | Suno terms of the account that made it (a paid plan allows publishing) |
| `musik-zaehneputzen-lied-de.mp3` | Generated with [Suno](https://suno.com), 25 Oct 2026 | Suno terms of the account that made it (a paid plan allows publishing) |
| `musik-zaehneputzen-lied-en.mp3` | Generated with [Suno](https://suno.com), 25 Oct 2026 | Suno terms of the account that made it (a paid plan allows publishing) |
| `musik-zaehneputzen-lied-ru.mp3` | Generated with [Suno](https://suno.com), 26 Oct 2026 | Suno terms of the account that made it (a paid plan allows publishing) |
