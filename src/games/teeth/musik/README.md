# Musik beim Putzen

`zaehneputzen.mp3` is the background music of Zähne putzen (`../music.ts`).
Without it the synthesized tune plays.

The song is instrumental, 112 BPM, with a new part every 8 bars (17.14 s) – exactly
one step of the two-minute brushing. `SONG` in `music.ts` holds where the first
part, the finale (eighth part) and the end of the repeating parts are. When the
song is swapped, measure these again (see the `/musik-erzeugen` skill).

Made from the WAV with `ffmpeg -i song.wav -af "loudnorm=I=-16:TP=-1.5:LRA=11" -ar 44100 -c:a libmp3lame -b:a 128k -map_metadata -1 zaehneputzen.mp3`.

| File               | Source                                               | Terms                                                                  |
| ------------------ | ---------------------------------------------------- | ---------------------------------------------------------------------- |
| `zaehneputzen.mp3` | Generated with [Suno](https://suno.com), 24 Oct 2026 | Suno terms of the account that made it (a paid plan allows publishing) |
