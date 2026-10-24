# Musik beim Putzen

Put one MP3 here (any file name) and it becomes the background music of
Zähne putzen; without one the synthesized tune plays (`../music.ts`).
- Instrumental only: the spoken hints must stay easy to understand. The music
  gets quiet by itself while the voice speaks.
- About 60–90 s that loop seamlessly: it repeats for the whole brushing time
  and follows pause and jumps on the progress bar.
- Stereo MP3, 128 kbit/s, normalised loudness, e.g.
  `ffmpeg -i song.wav -af loudnorm=I=-16 -c:a libmp3lame -b:a 128k zaehneputzen.mp3`.
  Every built file is kept offline by the service worker, so keep it small (~1.5 MB).
- Only music we may publish: note here where it comes from and under which terms.

| File | Source | Terms |
| ---- | ------ | ----- |
