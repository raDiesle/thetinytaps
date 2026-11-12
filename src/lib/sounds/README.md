# Recorded sounds

Real recordings for the sounds that should sound like the real thing (animals,
bells, water …). `src/lib/sfx/` plays a file here when one has the sound's
name, otherwise – and until the file is loaded – its synthesized sound.

Most recordings are from [Freesound](https://freesound.org) under
**CC0 1.0** (public domain): free to use, no attribution required. The sources
are still listed, so a sound can be swapped or traced back. A few animal calls Freesound
had no fitting recording for are made with ElevenLabs' sound effects (see „Made with ElevenLabs“ below).

Each one is cut to the part used (column "Cut"), faded in and out, brought to
a similar loudness and saved as mono MP3 (96 kbit/s), e.g.:

```bash
ffmpeg -ss 0.15 -t 0.9 -i source.mp3 -af "highpass=f=45,afade=t=in:d=0.008,afade=t=out:st=0.75:d=0.15,volume=-6dB" -ac 1 -ar 44100 -c:a libmp3lame -b:a 96k meow.mp3
```

To try another recording: search Freesound with the licence filter
"Creative Commons 0", put the new file here under the same name, done. Freesound shows only one result per pack
unless the search address ends in `&g=0`: add it, or whole packs of fitting recordings stay hidden.

| File             | Source                                                                                                                                   | By                        | Cut                |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | ------------------ |
| `alarm.mp3`      | [fire alarm bell](https://freesound.org/people/msx2plus/sounds/678345/)                                                                  | msx2plus                  | 0.0–1.60 s         |
| `baa.mp3`        | [Sheep baa](https://freesound.org/people/Chipsplease/sounds/669765/)                                                                     | Chipsplease               | 0.98–1.83 s        |
| `bark.mp3`       | [Puppy Bark](https://freesound.org/people/AntumDeluge/sounds/583142/)                                                                    | AntumDeluge               | 0.08–1.28 s        |
| `bat.mp3`        | [Bat chirp (close-up)](https://freesound.org/people/coelhoigor/sounds/455593/)                                                           | coelhoigor                | 3.40–5.00 s        |
| `bells.mp3`      | [Old Church Bell.wav](https://freesound.org/people/dsp9000/sounds/76405/)                                                                | dsp9000                   | 0.0–3.20 s         |
| `blow.mp3`       | [Hairdryer](https://freesound.org/people/mpue76/sounds/541563/)                                                                          | mpue76                    | 0.4–2.00 s         |
| `boar.mp3`       | [Swine - Pig; Dinosaur-like Grunt](https://freesound.org/people/TheKingOfGeeks360/sounds/842313/)                                        | TheKingOfGeeks360         | 0.00–1.50 s        |
| `bounce.mp3`     | [Bouncing Ball.wav](https://freesound.org/people/JaenKleynhans/sounds/267882/)                                                           | JaenKleynhans             | 0.88–3.18 s        |
| `breath.mp3`     | [Exhale_10115a.wav](https://freesound.org/people/otherthings/sounds/65619/)                                                              | otherthings               | 0.15–1.20 s        |
| `bubbles.mp3`    | [Bubbles](https://freesound.org/people/hotpin7/sounds/840042/)                                                                           | hotpin7                   | 0.0–0.85 s         |
| `buzz.mp3`       | [Bee Buzzing](https://freesound.org/people/JonCon_Library/sounds/481647/)                                                                | JonCon_Library            | 0.1–2.00 s         |
| `camel.mp3`      | [G12-05-Camel Grunt.wav](https://freesound.org/people/craigsmith/sounds/437937/)                                                         | craigsmith                | 1.20–3.60 s        |
| `chatter.mp3`    | [monkey noises.mp3](https://freesound.org/people/CrazyGreenFluff/sounds/674253/)                                                         | CrazyGreenFluff           | 0.15–1.95 s        |
| `cheer.mp3`      | [Children Cheering Inside School](https://freesound.org/people/Moulaythami/sounds/640855/)                                               | Moulaythami               | 0.9–3.20 s         |
| `chew.mp3`       | [Chewing Crunch Cornflakes Knuspern Schnurpsen Eating Essen Munch](https://freesound.org/people/Borgory/sounds/548367/)                  | Borgory                   | 0.8–2.30 s         |
| `clink.mp3`      | [Glass Clink](https://freesound.org/people/Nightflame/sounds/397597/)                                                                    | Nightflame                | 0.3–1.00 s         |
| `cluck.mp3`      | [HEN - 1](https://freesound.org/people/SamuelGremaud/sounds/517778/)                                                                     | SamuelGremaud             | 0.45–1.95 s        |
| `coo.mp3`        | [pigeon territorial coo.wav](https://freesound.org/people/5ro4/sounds/649390/)                                                           | 5ro4                      | 0.1–2.10 s         |
| `crash.mp3`      | [falling-planks-watering-can-platic-toys.mp3](https://freesound.org/people/opyate/sounds/519983/)                                        | opyate                    | 0.25–2.25 s        |
| `cricket.mp3`    | [Cricket singing (close recording)](https://freesound.org/people/felix.blume/sounds/476082/)                                             | felix.blume               | 3.30–5.70 s        |
| `croak.mp3`      | [Frog.ogg](https://freesound.org/people/egomassive/sounds/536759/)                                                                       | egomassive                | 0.1–0.60 s         |
| `crocodile.mp3`  | [Alligator Growls 02.wav](https://freesound.org/people/D.jones/sounds/527844/)                                                           | D.jones                   | 1.00–2.90 s        |
| `crow.mp3`       | [Rooster crow](https://freesound.org/people/jsbarrett/sounds/200339/)                                                                    | jsbarrett                 | 1.3–3.30 s         |
| `cry.mp3`        | [baby girl crying](https://freesound.org/people/josephvm/sounds/442655/)                                                                 | josephvm                  | 5.05–7.20 s        |
| `cuckoo.mp3`     | [CUCKOO - 2](https://freesound.org/people/SamuelGremaud/sounds/517781/)                                                                  | SamuelGremaud             | 0.3–2.25 s         |
| `dolphin.mp3`    | [Dolphin Noise-.wav](https://freesound.org/people/jfournier18/sounds/456151/)                                                            | jfournier18               | 0.4–2.50 s         |
| `eagle.mp3`      | [Red Tailed Hawk Cries](https://freesound.org/people/loganzsound/sounds/875513/)                                                         | loganzsound               | 6.05–7.05 s        |
| `engine.mp3`     | [Small Bulldozer Engine.wav](https://freesound.org/people/esperri/sounds/118974/)                                                        | esperri                   | 2.0–3.60 s         |
| `flamingo.mp3`   | [Flamingos](https://freesound.org/people/Breviceps/sounds/535778/)                                                                       | Breviceps                 | 0.15–2.05 s        |
| `flush.mp3`      | [Toilet flushing sound](https://freesound.org/people/hz37/sounds/792460/)                                                                | hz37                      | 0.6–3.10 s         |
| `fox.mp3`        | [Fox barking in Riverdale](https://freesound.org/people/SoundsLikeYukon/sounds/865257/)                                                  | SoundsLikeYukon           | 21.30–22.30 s      |
| `goat.mp3`       | [Single Goat Bleating 2x](https://freesound.org/people/Kinoton/sounds/581240/)                                                           | Kinoton                   | 0.30–1.40 s        |
| `gobble.mp3`     | [Fowl - Turkey Gobble, Close Perspective, Take 2](https://freesound.org/people/TheKingOfGeeks360/sounds/874270/)                         | TheKingOfGeeks360         | 0.00–1.25 s        |
| `goose.mp3`      | [Waterfowl - Brown Chinese Goose; Female Honk, Close Perspective, Take 2](https://freesound.org/people/TheKingOfGeeks360/sounds/875144/) | TheKingOfGeeks360         | 0.00–0.35 s        |
| `gorilla.mp3`    | [Gorillaschrei.wav](https://freesound.org/people/J0ck0/sounds/397054/)                                                                   | J0ck0                     | 0.05–1.35 s        |
| `growl.mp3`      | [Bear Angry Growl](https://freesound.org/people/celldroid/sounds/763026/)                                                                | celldroid                 | 2.1–4.00 s         |
| `hedgehog.mp3`   | [Hedgehog smell and run.mp3](https://freesound.org/people/ffdown/sounds/570301/)                                                         | ffdown                    | 0.40–1.40 s        |
| `heehaw.mp3`     | [Donkeys - Squeaky High-Pitched Bray](https://freesound.org/people/TheKingOfGeeks360/sounds/859477/)                                     | TheKingOfGeeks360         | 0.15–2.85 s        |
| `helicopter.mp3` | [Powerful helicopter sound Bell 407 OK-ALB](https://freesound.org/people/bzamecnik/sounds/348991/)                                       | bzamecnik                 | 5.5–8.00 s         |
| `hippo.mp3`      | [Hippopotamus Sounds](https://freesound.org/people/JobInThe444/sounds/876412/)                                                           | JobInThe444               | 11.95–12.95 s      |
| `hiss.mp3`       | [Angry snake hissing. OWI.wav](https://freesound.org/people/JesterWhoo/sounds/706977/)                                                   | JesterWhoo                | 2.20–4.40 s        |
| `honk.mp3`       | [J1_Car_Horn.mp3](https://freesound.org/people/Iamgiorgio/sounds/371833/)                                                                | Iamgiorgio                | 0.05–0.41 s, twice |
| `hoot.mp3`       | [Owl Hoot](https://freesound.org/people/Breviceps/sounds/465697/)                                                                        | Breviceps                 | 0.2–2.60 s         |
| `howl.mp3`       | [Cooper Creek 20160313_014852 solitary wolf howl very clear](https://freesound.org/people/betchkal/sounds/500646/)                       | betchkal                  | 29.25–32.25 s      |
| `laugh.mp3`      | [Child_laughing.wav](https://freesound.org/people/Teumova/sounds/439667/)                                                                | Teumova                   | 0.55–1.80 s        |
| `launch.mp3`     | [Rocket Launch](https://freesound.org/people/gracenew/sounds/857959/)                                                                    | gracenew                  | 0.0–2.20 s         |
| `llama.mp3`      | [Camelids - Alpaca; High Moan, Take 2](https://freesound.org/people/TheKingOfGeeks360/sounds/868310/)                                    | TheKingOfGeeks360         | 0.0–0.54 s         |
| `lolly.mp3`      | [Hard Candy / Bone Crunch](https://freesound.org/people/clif_creates/sounds/392883/)                                                     | clif_creates              | 0.0–0.82 s         |
| `meow.mp3`       | [cat meow](https://freesound.org/people/tuberatanka/sounds/110011/)                                                                      | tuberatanka               | 0.15–1.05 s        |
| `moo.mp3`        | [Moo 2 - Moo Moo the Cow](https://freesound.org/people/manofham/sounds/700379/)                                                          | manofham                  | 1.1–2.40 s         |
| `mosquito.mp3`   | [Mosquito](https://freesound.org/people/melliug/sounds/721485/)                                                                          | melliug                   | 1.05–3.05 s        |
| `mouse.mp3`      | [squeak.wav](https://freesound.org/people/semccab/sounds/154381/)                                                                        | semccab                   | 0.0–1.27 s         |
| `munch.mp3`      | [Bite (Apple)](https://freesound.org/people/wadaltmon/sounds/275015/)                                                                    | wadaltmon                 | 0.1–0.80 s         |
| `musicbox.mp3`   | [Music Box 2 (G)](https://freesound.org/people/sonically_sound/sounds/625234/)                                                           | sonically_sound           | 0.0–3.40 s         |
| `neigh.mp3`      | [horse neigh shortened.wav](https://freesound.org/people/shadoWisp/sounds/269571/)                                                       | shadoWisp                 | 0.28–1.48 s        |
| `oink.mp3`       | [Pig Oink](https://freesound.org/people/qubodup/sounds/442906/)                                                                          | qubodup                   | 0.02–0.72 s        |
| `partyhorn.mp3`  | [Party horn.wav](https://freesound.org/people/audiosmedia/sounds/170583/)                                                                | audiosmedia               | 0.0–1.20 s         |
| `peacock.mp3`    | [Bird, Peacock Call](https://freesound.org/people/Kinoton/sounds/688203/)                                                                | Kinoton                   | 0.25–2.05 s        |
| `peck.mp3`       | [woodpecker taps 20240915](https://freesound.org/people/todorrobot/sounds/754590/)                                                       | todorrobot                | 0.12–1.22 s        |
| `penguin.mp3`    | [Pinguin Colony at Gourdin Island](https://freesound.org/people/al.barbosa/sounds/150873/)                                               | al.barbosa                | 5.0–6.70 s         |
| `quack.mp3`      | [Duck quacking.mp3](https://freesound.org/people/DigPro120/sounds/558858/)                                                               | DigPro120                 | 0.18–1.28 s        |
| `raccoon.mp3`    | [120827 Raccoon, bark, screech, yelp, squeal, backyard, Toronto.wav](https://freesound.org/people/TRP/sounds/616622/)                    | TRP                       | 0.45–2.00 s        |
| `rhino.mp3`      | [Indian rhinoceros (Rhinoceros unicornis)](https://freesound.org/people/Breviceps/sounds/535810/)                                        | Breviceps                 | 0.00–0.85 s        |
| `ring.mp3`       | [Bike Bell.wav](https://freesound.org/people/bsumusictech/sounds/81875/)                                                                 | bsumusictech              | 0.03–1.73 s        |
| `roar.mp3`       | [Lion Growl.wav](https://freesound.org/people/LilMati/sounds/516829/)                                                                    | LilMati                   | 1.08–2.38 s        |
| `saw.mp3`        | [Sawing Wood](https://freesound.org/people/Mateusz_Chenc/sounds/519661/)                                                                 | Mateusz_Chenc             | 0.0–1.50 s         |
| `scrub.mp3`      | [toothbrush.wav](https://freesound.org/people/beymer/sounds/25913/)                                                                      | beymer                    | 0.1–1.50 s         |
| `seal.mp3`       | [Sea Lion 2.wav](https://freesound.org/people/nifvimp/sounds/680734/)                                                                    | nifvimp                   | 0.0–0.87 s         |
| `siren.mp3`      | [German fire engine](https://freesound.org/people/Breviceps/sounds/465700/)                                                              | Breviceps                 | 0.05–2.65 s        |
| `slide.mp3`      | [Cartoon Fall](https://freesound.org/people/plasterbrain/sounds/395443/)                                                                 | plasterbrain              | 0.0–1.60 s         |
| `splash.mp3`     | [water splash- small](https://freesound.org/people/morganveilleux/sounds/390005/)                                                        | morganveilleux            | 0.18–1.18 s        |
| `squawk.mp3`     | [Parrot.wav](https://freesound.org/people/13FPanska_Machacova_Petra/sounds/377532/)                                                      | 13FPanska_Machacova_Petra | 0.55–1.85 s        |
| `squirrel.mp3`   | [squirrel upset.wav](https://freesound.org/people/cognito%20perceptu/sounds/18515/)                                                      | cognito perceptu          | 18.55–19.75 s      |
| `stag.mp3`       | [250910_22h43 Gergueil D104 - Brame](https://freesound.org/people/Sadiquecat/sounds/826421/)                                             | Sadiquecat                | 5.60–8.60 s        |
| `stomp.mp3`      | [Stomp.wav](https://freesound.org/people/000600/sounds/180015/)                                                                          | 000600                    | 0.0–1.60 s         |
| `swan.mp3`       | [sangsvan-short.aiff](https://freesound.org/people/PerMagnusLindborg/sounds/223697/)                                                     | PerMagnusLindborg         | 0.20–2.20 s        |
| `switch.mp3`     | [Switch Flip #1](https://freesound.org/people/IanStarGem/sounds/278205/)                                                                 | IanStarGem                | 0.0–0.30 s         |
| `tick.mp3`       | [Ticking Clock](https://freesound.org/people/AntumDeluge/sounds/188033/)                                                                 | AntumDeluge               | 0.1–2.40 s         |
| `tiger.mp3`      | [Tiger Roar](https://freesound.org/people/lauramellis/sounds/263115/)                                                                    | lauramellis               | 0.90–3.30 s        |
| `trill.mp3`      | [Referee whistle blow, gymnasium.wav](https://freesound.org/people/SpliceSound/sounds/218318/)                                           | SpliceSound               | 0.08–0.98 s        |
| `trumpet.mp3`    | [Elephant Trumpets Growls.flac](https://freesound.org/people/D.jones/sounds/527845/)                                                     | D.jones                   | 0.08–1.48 s        |
| `tweet.mp3`      | [Bird Chirping](https://freesound.org/people/Dekpi/sounds/411911/)                                                                       | Dekpi                     | 0.12–1.72 s        |
| `washer.mp3`     | [washing machine rinse .wav](https://freesound.org/people/afnan808/sounds/384121/)                                                       | afnan808                  | 0.0–2.40 s         |
| `whale.mp3`      | [Baleines.wav](https://freesound.org/people/davidou/sounds/88449/)                                                                       | davidou                   | 0.4–3.40 s         |
| `whistle.mp3`    | [Train whistle](https://freesound.org/people/basoap/sounds/345905/)                                                                      | basoap                    | 0.28–2.03 s        |
| `wrapper.mp3`    | [Candy Wrapper Crinkle](https://freesound.org/people/BluetoothBoy/sounds/269338/)                                                        | BluetoothBoy              | 0.0–1.20 s         |
| `yay.mp3`        | [Voice_Child_WowCelebration.wav](https://freesound.org/people/MrFossy/sounds/521900/)                                                    | MrFossy                   | 4.05–4.70 s        |
| `yum.mp3`        | [Mmm girl 1.wav](https://freesound.org/people/esperar/sounds/170788/)                                                                    | esperar                   | 0.0–1.88 s         |
| `zebra.mp3`      | [Zebras - Grant's Zebra Braying](https://freesound.org/people/TheKingOfGeeks360/sounds/850661/)                                          | TheKingOfGeeks360         | 0.20–1.40 s        |

## Made with ElevenLabs

Animal calls Freesound has none of are made with ElevenLabs' sound effects (`POST /v1/sound-generation`, model
`eleven_text_to_sound_v2`) on the first account (`ELEVENLABS_API_KEY`; paid plans may use them commercially). They
are **not free**: about 11 credits a second asked for (a 1.5 s call cost 17, a 2 s one 22, November 2026), counted
like the voice's characters, so check what the account has left first. Ask for the animal's own voice and nothing
else – „A single … , close up, clean recording, no background noise“, 1.5–2 s, `prompt_influence` 0.7 –, look at the
loudness every 50 ms to cut it to the call itself (≈1–1.5 s), and save it small: these calls need no quality, so
mono, 22.05 kHz, 32 kbit/s, which makes 4–7 KB a call instead of the 15–30 KB of the Freesound ones at 96 kbit/s
(`soundFiles.test.ts` checks the files below stay so):

```bash
curl -s -o raw.mp3 -X POST "https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128" \
  -H "xi-api-key: $ELEVENLABS_API_KEY" -H "content-type: application/json" \
  -d '{"text":"A pet hamster squeaking, a few tiny high-pitched squeaks, close up, clean recording, no background noise","duration_seconds":1.5,"prompt_influence":0.7}'
ffmpeg -ss 0.3 -t 1.05 -i raw.mp3 -af "highpass=f=60,afade=t=in:d=0.01,afade=t=out:st=0.93:d=0.12,loudnorm=I=-16:TP=-1.5:LRA=11" -ac 1 -ar 22050 -c:a libmp3lame -b:a 32k hamster.mp3
```

A fly's buzz asked for quietly („a housefly buzzing“) came back as faint noise; asked for loud and close it worked.
Not yet heard by ear (Claude checked only spectrum and loudness): listen to them before building more on them.

| File            | Prompt (ElevenLabs sound effects, November 2026)                                                          | Cut         |
| --------------- | --------------------------------------------------------------------------------------------------------- | ----------- |
| `fly.mp3`       | Loud close-up buzzing of a big fly flying around the microphone, clear bzzz, nothing else (1.5 s, 0.8)    | 0.50–1.45 s |
| `hamster.mp3`   | A pet hamster squeaking, a few tiny high-pitched squeaks, close up, clean recording, no background noise  | 0.30–1.35 s |
| `moose.mp3`     | A moose calling, one long deep nasal bellow, close up, clean recording, no background noise (2 s)         | 0.25–1.65 s |
| `otter.mp3`     | A river otter chirping and squeaking, close up, clean recording, no water, no background noise            | 0.05–1.35 s |
| `peep.mp3`      | A single baby chick peeping, close up, clean recording, no background noise (1.5 s, 0.6)                  | 0.00–1.25 s |
| `polarbear.mp3` | A single polar bear growling once, a deep grumbling growl, close up, clean recording, no background noise | 0.00–1.70 s |

The animal calls added for „Wer macht das Geräusch?“ in Was gehört zum Tier? (November 2026) were picked by their
pages and levels, not yet by ear: `llama.mp3` is an alpaca, `boar.mp3` a domestic pig's rough grunt,
`crocodile.mp3` an alligator, `swan.mp3` a whooper swan, `raccoon.mp3` a screech, `rhino.mp3` an Indian rhino's honk, and
`hippo.mp3`, `mosquito.mp3`, `crocodile.mp3` and `rhino.mp3` are the least certain – listen to
them before swapping anything else.

`bubbles`, `growl`, `helicopter`, `mouse`, `penguin` and `washer` have names of their own (not `blub`,
`squeak`, `rotor`), so they don't change what Lebendige Bilder plays: Zuordnen (Was gehört zum Tier?, Schatten
finden, Wer schaut da raus?) and Socken-Paare use them through `recorded(name, synth)` / `playRecorded`.

Games play most of these through `src/lib/realSounds.ts`: the synthesized sounds of `@/lib/sfx` under the same
names, swapped for their recording (`playGiggle` → `laugh`, `playWash` → `washer` …). A new recording for such a
sound gets its line there.

Still synthesized because Freesound has no fitting CC0 recording yet: `aua` (a small
child's „Aua!“ in Gefühle, `playAua`). An `aua.mp3` here replaces it.
