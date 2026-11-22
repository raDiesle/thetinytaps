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

All below were made on 22 November 2026 with `eleven_text_to_sound_v3` (v2 is deprecated, to be removed March 2027) on
the second account (`ELEVENLABS_API_KEY_2`, a paid Creator plan, while the first had no credits left), cut where the
loudness every 50 ms stays within 30 dB of the peak, at most 2.4 s. **Not yet heard by ear**: Claude checked only
length, loudness (−18 to −22 LUFS) and spectral centroid (the bird's tweet high, the owl's hoot and the pigeon's coo
low): listen to them before building more on them.

| File          | Prompt (ElevenLabs sound effects)                                                                                     | Cut         |
| ------------- | --------------------------------------------------------------------------------------------------------------------- | ----------- |
| `alarm.mp3`   | A fire station alarm bell ringing, close up, clean recording, no background noise (1.5 s, 0.7)                        | 0.00–1.48 s |
| `baa.mp3`     | A sheep bleating once, a clear baa, close up, clean recording, no background noise (1.5 s, 0.7)                       | 0.10–1.30 s |
| `bark.mp3`    | A dog barking twice, woof woof, close up, clean recording, no background noise (1.5 s, 0.7)                           | 0.00–0.85 s |
| `bells.mp3`   | Church bells ringing, ding dong, close up, clean recording, no background noise (2.5 s, 0.7)                          | 0.00–2.05 s |
| `buzz.mp3`    | A bee buzzing loudly around the microphone, a clear bzzz, close up, clean recording, no background noise (1.5 s, 0.7) | 0.00–1.48 s |
| `chatter.mp3` | A monkey chattering, ooh ooh aah aah, close up, clean recording, no background noise (1.5 s, 0.7)                     | 0.00–1.48 s |
| `cluck.mp3`   | A hen clucking a few times, close up, clean recording, no background noise (1.5 s, 0.7)                               | 0.05–1.35 s |
| `coo.mp3`     | A pigeon cooing softly, coo coo, close up, clean recording, no background noise (1.5 s, 0.7)                          | 0.15–1.48 s |
| `croak.mp3`   | A frog croaking a few times, ribbit ribbit, close up, clean recording, no background noise (1.5 s, 0.7)               | 0.05–1.05 s |
| `crow.mp3`    | A rooster crowing once, cock-a-doodle-doo, close up, clean recording, no background noise (2.5 s, 0.7)                | 0.15–2.25 s |
| `cuckoo.mp3`  | A cuckoo bird calling cuckoo twice, close up, clean recording, no background noise (1.5 s, 0.7)                       | 0.20–0.80 s |
| `dolphin.mp3` | A dolphin clicking and whistling, close up, clean recording, no background noise (1.5 s, 0.7)                         | 0.00–1.30 s |
| `engine.mp3`  | A digger's diesel engine starting and rumbling, close up, clean recording, no background noise (2 s, 0.7)             | 0.00–2.00 s |
| `flush.mp3`   | A toilet flushing, close up, clean recording, no background noise (2 s, 0.7)                                          | 0.00–2.00 s |
| `honk.mp3`    | A small car horn honking twice, a friendly beep beep, close up, clean recording, no background noise (1.5 s, 0.7)     | 0.00–1.25 s |
| `hoot.mp3`    | An owl hooting twice, hoo hoo, close up, clean recording, no background noise (2 s, 0.7)                              | 0.15–1.70 s |
| `jet.mp3`     | A jet airplane taking off, a loud rising roar, close up, clean recording, no background noise (2 s, 0.7)              | 0.00–2.00 s |
| `kettle.mp3`  | A kettle boiling and whistling, close up, clean recording, no background noise (2 s, 0.7)                             | 0.00–2.00 s |
| `launch.mp3`  | A rocket launching, a big rumbling whoosh, close up, clean recording, no background noise (2.5 s, 0.7)                | 0.10–1.70 s |
| `meow.mp3`    | A house cat meowing once, a clear friendly meow, close up, clean recording, no background noise (1.5 s, 0.7)          | 0.15–1.25 s |
| `moo.mp3`     | A cow mooing once, one long deep moo, close up, clean recording, no background noise (2 s, 0.7)                       | 0.30–1.70 s |
| `neigh.mp3`   | A horse neighing once, a clear whinny, close up, clean recording, no background noise (2 s, 0.7)                      | 0.05–1.80 s |
| `oink.mp3`    | A pig oinking and grunting a few times, close up, clean recording, no background noise (1.5 s, 0.7)                   | 0.20–1.48 s |
| `quack.mp3`   | A duck quacking a few times, quack quack, close up, clean recording, no background noise (1.5 s, 0.7)                 | 0.00–1.40 s |
| `ring.mp3`    | A bicycle bell ringing twice, ring ring, close up, clean recording, no background noise (1.5 s, 0.7)                  | 0.00–0.75 s |
| `roar.mp3`    | A lion roaring once, one big deep roar, close up, clean recording, no background noise (2 s, 0.7)                     | 0.00–1.75 s |
| `rotor.mp3`   | A helicopter flying past, the whop whop of its rotor, close up, clean recording, no background noise (2 s, 0.7)       | 0.00–2.00 s |
| `saw.mp3`     | A hand saw sawing wood, a few strokes, close up, clean recording, no background noise (2 s, 0.7)                      | 0.05–2.00 s |
| `siren.mp3`   | An emergency vehicle siren wailing, nee naw nee naw, close up, clean recording, no background noise (2 s, 0.7)        | 0.00–2.00 s |
| `sizzle.mp3`  | Food sizzling in a frying pan, close up, clean recording, no background noise (2 s, 0.7)                              | 0.00–2.00 s |
| `sneeze.mp3`  | One big funny sneeze, ah-choo, close up, clean recording, no background noise (1.5 s, 0.7)                            | 0.20–1.25 s |
| `tick.mp3`    | A clock ticking, tick tock tick tock, close up, clean recording, no background noise (2 s, 0.7)                       | 0.00–1.25 s |
| `train.mp3`   | A steam train whistling and chugging, choo choo, close up, clean recording, no background noise (2 s, 0.7)            | 0.10–1.80 s |
| `trill.mp3`   | A whistle blown twice, two short shrill blasts, close up, clean recording, no background noise (1.5 s, 0.7)           | 0.00–1.20 s |
| `trumpet.mp3` | An elephant trumpeting once, close up, clean recording, no background noise (2 s, 0.7)                                | 0.00–1.40 s |
| `tweet.mp3`   | A small songbird chirping and tweeting, close up, clean recording, no background noise (1.5 s, 0.7)                   | 0.15–1.40 s |
| `whale.mp3`   | A whale singing, one long low whale call, close up, clean recording, no background noise (2.5 s, 0.7)                 | 0.10–2.05 s |
