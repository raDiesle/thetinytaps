# Musik im Hintergrund

`musik-hintergrund.mp3` is the background song of the menus and all games (`../backgroundMusic.ts`,
downloaded in `../musicFile.ts`), except games with music of their own or a reason to
stay quiet. It was made for Lebendige Bilder. Without it there is no music.

Song files are named `musik-*.mp3`: the service worker leaves them out of its offline
copy, so they are only downloaded while music is on (`tools/build.ts`, `src/sw.js`).

The song is instrumental, 97 BPM, with a new part every 8 bars (19.79 s). It goes
round the first eight parts (`SONG` in `music.ts`); the file is cut there, so the
break and the ending Suno added after them are not in it. When the song is swapped,
measure these again (see the `/musik-erzeugen` skill).

Made from the WAV with `ffmpeg -i song.wav -t 158.9 -af "loudnorm=I=-16:TP=-1.5:LRA=11" -ar 44100 -c:a libmp3lame -b:a 128k -map_metadata -1 musik-hintergrund.mp3`,
then made mono at 64 kbit/s (November 2026): `ffmpeg -i musik-hintergrund.mp3 -ac 1 -c:a libmp3lame -b:a 64k -map_metadata -1 out.mp3`.
That halved the download (2.5 → 1.3 MB) and the decoded song in the phone's memory (about 60 → 30 MB), and it
plays under the taps at a quarter of full loudness, where nobody hears the stereo. The timing stayed the same
(checked by cross-correlation: 0 samples apart), so `SONG` needed no new measuring. The parts are no copies of each
other (Suno renders every bar anew, no two bars match as waveforms), so cutting the song into repeated pieces saves nothing.

| File                    | Source                                               | Terms                                                                  |
| ----------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------- |
| `musik-hintergrund.mp3` | Generated with [Suno](https://suno.com), 24 Oct 2026 | Suno terms of the account that made it (a paid plan allows publishing) |
