# Warte-Lied

`musik-toepfchen-warten-<lang>.mp3` is the song that plays while the animal sits on
the potty (`../waitMusic.ts`), one per language, found by its file name. Nobody knows
how long a child sits, so the song repeats without end until the tap that says
„fertig“. Suno sings no intro but ends with a break and a final chord: measure the song
(`bun run song`), pick a loop from just before the first sung word to the same place in
the bar a whole number of bars later, after the last turnaround and before the break,
and write it into `LOOPS` in `waitMusic.ts`. Keep about a second of what follows in the
file: looping inside the file stays seamless in every browser, however it trims the
silence an MP3 begins and ends with. It is sung in the app language, German where there
is none in it; while none is there, or while it loads, the synthesized waiting tune
(`playWaitNote`) plays instead. Made with Suno (`/musik-erzeugen`); `suno-lied.md` has what
to type there, per language.

| File                            | Source                                                                                                                                                                                                                              | Terms                                                                  |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `musik-toepfchen-warten-de.mp3` | Generated with [Suno](https://suno.com), 27 Oct 2026, „Warten auf dem Töpfchen“ (text: `suno-lied.md`); the first 2:13 of the 2:15 WAV, −16 LUFS; loop 0.08–132.08 s (55 bars at 100 BPM)                                           | Suno terms of the account that made it (a paid plan allows publishing) |
| `musik-toepfchen-warten-ru.mp3` | Generated with [Suno](https://suno.com), 27 Oct 2026, „Сижу на горшочке“ (text: `suno-lied.md`); 11.94–129.24 s of the 2:24 WAV (the intro and the extra last chorus left out), −16 LUFS; loop 0.50–116.29 s (47 bars at 97.42 BPM) | Suno terms of the account that made it (a paid plan allows publishing) |
