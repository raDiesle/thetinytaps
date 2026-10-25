# Musik im Hintergrund

`musik-hintergrund.mp3` is the background song of the menus and all games (`../backgroundMusic.ts`,
downloaded in `../musicFile.ts`), except games with music of their own or a reason to
stay quiet. It was made for Lebendige Bilder. Without it there is no music.

Song files are named `musik-*.mp3`: the service worker leaves them out of its offline
copy, so they are only downloaded while music is on (`rsbuild.config.ts`, `src/sw.js`).

The song is instrumental, 97 BPM, with a new part every 8 bars (19.79 s). It goes
round the first eight parts (`SONG` in `music.ts`); the file is cut there, so the
break and the ending Suno added after them are not in it. When the song is swapped,
measure these again (see the `/musik-erzeugen` skill).

Made from the WAV with `ffmpeg -i song.wav -t 158.9 -af "loudnorm=I=-16:TP=-1.5:LRA=11" -ar 44100 -c:a libmp3lame -b:a 128k -map_metadata -1 musik-hintergrund.mp3`.

| File                    | Source                                               | Terms                                                                  |
| ----------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------- |
| `musik-hintergrund.mp3` | Generated with [Suno](https://suno.com), 24 Oct 2026 | Suno terms of the account that made it (a paid plan allows publishing) |
