# Warte-Lied

`musik-toepfchen-warten-<lang>.mp3` is the song that plays while the animal sits on
the potty (`../waitMusic.ts`), one per language, found by its file name. Nobody knows
how long a child sits, so the song repeats the whole file without end until the tap
that says „fertig“: make it loop seamlessly (it ends where it can start again, no
fade-out, no long final chord). It is sung in the app language, German where there
is none in it; while none is there, or while it loads, the synthesized waiting tune
(`playWaitNote`) plays instead. Made with Suno (`/musik-erzeugen`); `suno-lied.md` has what
to type there, per language.

| File | Source | Terms |
| ---- | ------ | ----- |
