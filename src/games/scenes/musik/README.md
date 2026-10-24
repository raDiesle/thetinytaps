# Musik in den Bildern

`lebendige-bilder.mp3` is the background music of Lebendige Bilder (`../music.ts`),
for every picture except Gute Nacht. Without it there is no music.

The song is instrumental, 97 BPM, with a new part every 8 bars (19.79 s). It goes
round the first eight parts (`SONG` in `music.ts`); the file is cut there, so the
break and the ending Suno added after them are not in it. When the song is swapped,
measure these again (see the `/musik-erzeugen` skill).

Made from the WAV with `ffmpeg -i song.wav -t 158.9 -af "loudnorm=I=-16:TP=-1.5:LRA=11" -ar 44100 -c:a libmp3lame -b:a 128k -map_metadata -1 lebendige-bilder.mp3`.

| File                   | Source                                               | Terms                                                                  |
| ---------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------- |
| `lebendige-bilder.mp3` | Generated with [Suno](https://suno.com), 24 Oct 2026 | Suno terms of the account that made it (a paid plan allows publishing) |
