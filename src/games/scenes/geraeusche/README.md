# Sounds of the Geräusch-Rätsel

The recordings of Lebendige Bilder's „Geräusch-Rätsel“ (idea B-02, `../soundRiddle.ts`), one per sound asked about,
named like the scene sound they stand for (`bark.mp3` for `bark`). They play only in that mode and are fetched only
while it is on (`../riddleSounds.ts`); every other mode keeps the sounds of `src/lib/sounds/` and `@/lib/sfx`.

Made with ElevenLabs' sound effects (user decision, 21 November 2026: „die sind sehr gut“), never on the Mac behind
Zscaler: they wait in `src/content/soundQueue.ts` until a Claude cloud session makes them with `/paid-queue`, as
`src/lib/sounds/README.md` („Made with ElevenLabs“) says – the prompt alone, cut by its loudness to the sound itself.
The sound is the whole question here, so they are saved a little better than the animal calls there: mono, 44.1 kHz,
64 kbit/s, at most 2.5 s (`riddleSounds.test.ts`):

```bash
ffmpeg -ss 0.2 -t 1.6 -i raw.mp3 -af "highpass=f=50,afade=t=in:d=0.01,afade=t=out:st=1.45:d=0.15,loudnorm=I=-18:TP=-1.5:LRA=11" -ac 1 -ar 44100 -c:a libmp3lame -b:a 64k bark.mp3
```

Listen to each before committing (or, where no one can, check its length, loudness and spectrum and say so here).

| File | Prompt (ElevenLabs sound effects) | Cut |
| ---- | --------------------------------- | --- |
