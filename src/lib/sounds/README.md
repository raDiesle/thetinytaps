# Recorded sounds

Real recordings for the sounds that should sound like the real thing (animals,
bells, water …). `src/lib/sfx/` plays a file here when one has the sound's
name, otherwise – and until the file is loaded – its synthesized sound.

All recordings are from [Freesound](https://freesound.org) under
**CC0 1.0** (public domain): free to use, no attribution required. The sources
are still listed, so a sound can be swapped or traced back.

Each one is cut to the part used (column "Cut"), faded in and out, brought to
a similar loudness and saved as mono MP3 (96 kbit/s), e.g.:

```bash
ffmpeg -ss 0.15 -t 0.9 -i source.mp3 -af "highpass=f=45,afade=t=in:d=0.008,afade=t=out:st=0.75:d=0.15,volume=-6dB" -ac 1 -ar 44100 -c:a libmp3lame -b:a 96k meow.mp3
```

To try another recording: search Freesound with the licence filter
"Creative Commons 0", put the new file here under the same name, done.

| File          | Source                                                                                         | By                        | Cut                |
| ------------- | ---------------------------------------------------------------------------------------------- | ------------------------- | ------------------ |
| `alarm.mp3`   | [fire alarm bell](https://freesound.org/people/msx2plus/sounds/678345/)                        | msx2plus                  | 0.0–1.60 s         |
| `baa.mp3`     | [Sheep baa](https://freesound.org/people/Chipsplease/sounds/669765/)                           | Chipsplease               | 0.98–1.83 s        |
| `bark.mp3`    | [Puppy Bark](https://freesound.org/people/AntumDeluge/sounds/583142/)                          | AntumDeluge               | 0.08–1.28 s        |
| `bells.mp3`   | [Old Church Bell.wav](https://freesound.org/people/dsp9000/sounds/76405/)                      | dsp9000                   | 0.0–3.20 s         |
| `blow.mp3`    | [Hairdryer](https://freesound.org/people/mpue76/sounds/541563/)                                | mpue76                    | 0.4–2.00 s         |
| `buzz.mp3`    | [Bee Buzzing](https://freesound.org/people/JonCon_Library/sounds/481647/)                      | JonCon_Library            | 0.1–2.00 s         |
| `chatter.mp3` | [monkey noises.mp3](https://freesound.org/people/CrazyGreenFluff/sounds/674253/)               | CrazyGreenFluff           | 0.15–1.95 s        |
| `cluck.mp3`   | [HEN - 1](https://freesound.org/people/SamuelGremaud/sounds/517778/)                           | SamuelGremaud             | 0.45–1.95 s        |
| `coo.mp3`     | [pigeon territorial coo.wav](https://freesound.org/people/5ro4/sounds/649390/)                 | 5ro4                      | 0.1–2.10 s         |
| `croak.mp3`   | [Frog.ogg](https://freesound.org/people/egomassive/sounds/536759/)                             | egomassive                | 0.1–0.60 s         |
| `crow.mp3`    | [Rooster crow](https://freesound.org/people/jsbarrett/sounds/200339/)                          | jsbarrett                 | 1.3–3.30 s         |
| `cuckoo.mp3`  | [CUCKOO - 2](https://freesound.org/people/SamuelGremaud/sounds/517781/)                        | SamuelGremaud             | 0.3–2.25 s         |
| `dolphin.mp3` | [Dolphin Noise-.wav](https://freesound.org/people/jfournier18/sounds/456151/)                  | jfournier18               | 0.4–2.50 s         |
| `engine.mp3`  | [Small Bulldozer Engine.wav](https://freesound.org/people/esperri/sounds/118974/)              | esperri                   | 2.0–3.60 s         |
| `flush.mp3`   | [Toilet flushing sound](https://freesound.org/people/hz37/sounds/792460/)                      | hz37                      | 0.6–3.10 s         |
| `honk.mp3`    | [J1_Car_Horn.mp3](https://freesound.org/people/Iamgiorgio/sounds/371833/)                      | Iamgiorgio                | 0.05–0.41 s, twice |
| `hoot.mp3`    | [Owl Hoot](https://freesound.org/people/Breviceps/sounds/465697/)                              | Breviceps                 | 0.2–2.60 s         |
| `launch.mp3`  | [Rocket Launch](https://freesound.org/people/gracenew/sounds/857959/)                          | gracenew                  | 0.0–2.20 s         |
| `meow.mp3`    | [cat meow](https://freesound.org/people/tuberatanka/sounds/110011/)                            | tuberatanka               | 0.15–1.05 s        |
| `moo.mp3`     | [Moo 2 - Moo Moo the Cow](https://freesound.org/people/manofham/sounds/700379/)                | manofham                  | 1.1–2.40 s         |
| `munch.mp3`   | [Bite (Apple)](https://freesound.org/people/wadaltmon/sounds/275015/)                          | wadaltmon                 | 0.1–0.80 s         |
| `neigh.mp3`   | [horse neigh shortened.wav](https://freesound.org/people/shadoWisp/sounds/269571/)             | shadoWisp                 | 0.28–1.48 s        |
| `oink.mp3`    | [Pig Oink](https://freesound.org/people/qubodup/sounds/442906/)                                | qubodup                   | 0.02–0.72 s        |
| `peck.mp3`    | [woodpecker taps 20240915](https://freesound.org/people/todorrobot/sounds/754590/)             | todorrobot                | 0.12–1.22 s        |
| `quack.mp3`   | [Duck quacking.mp3](https://freesound.org/people/DigPro120/sounds/558858/)                     | DigPro120                 | 0.18–1.28 s        |
| `ring.mp3`    | [Bike Bell.wav](https://freesound.org/people/bsumusictech/sounds/81875/)                       | bsumusictech              | 0.03–1.73 s        |
| `roar.mp3`    | [Lion Growl.wav](https://freesound.org/people/LilMati/sounds/516829/)                          | LilMati                   | 1.08–2.38 s        |
| `saw.mp3`     | [Sawing Wood](https://freesound.org/people/Mateusz_Chenc/sounds/519661/)                       | Mateusz_Chenc             | 0.0–1.50 s         |
| `scrub.mp3`   | [toothbrush.wav](https://freesound.org/people/beymer/sounds/25913/)                            | beymer                    | 0.1–1.50 s         |
| `siren.mp3`   | [German fire engine](https://freesound.org/people/Breviceps/sounds/465700/)                    | Breviceps                 | 0.05–2.65 s        |
| `splash.mp3`  | [water splash- small](https://freesound.org/people/morganveilleux/sounds/390005/)              | morganveilleux            | 0.18–1.18 s        |
| `squawk.mp3`  | [Parrot.wav](https://freesound.org/people/13FPanska_Machacova_Petra/sounds/377532/)            | 13FPanska_Machacova_Petra | 0.55–1.85 s        |
| `tick.mp3`    | [Ticking Clock](https://freesound.org/people/AntumDeluge/sounds/188033/)                       | AntumDeluge               | 0.1–2.40 s         |
| `trill.mp3`   | [Referee whistle blow, gymnasium.wav](https://freesound.org/people/SpliceSound/sounds/218318/) | SpliceSound               | 0.08–0.98 s        |
| `trumpet.mp3` | [Elephant Trumpets Growls.flac](https://freesound.org/people/D.jones/sounds/527845/)           | D.jones                   | 0.08–1.48 s        |
| `tweet.mp3`   | [Bird Chirping](https://freesound.org/people/Dekpi/sounds/411911/)                             | Dekpi                     | 0.12–1.72 s        |
| `whale.mp3`   | [Baleines.wav](https://freesound.org/people/davidou/sounds/88449/)                             | davidou                   | 0.4–3.40 s         |
| `whistle.mp3` | [Train whistle](https://freesound.org/people/basoap/sounds/345905/)                            | basoap                    | 0.28–2.03 s        |
