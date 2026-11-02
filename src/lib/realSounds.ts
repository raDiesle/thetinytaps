import * as sfx from "@/lib/sfx";

// The synthesized sounds of animals, water and machines that have a real CC0 recording in src/lib/sounds/, under the
// same names as in @/lib/sfx: a game imports these from here instead, and plays the recording (the synthesized sound
// until it is loaded). Only sounds whose recording fits wherever the game plays them: a bicycle bell is no telephone,
// so a game whose sound differs from the recording keeps the one from @/lib/sfx.

const names = new Map<() => void, string>();

/** The recording `name`, `synth` until it is loaded; remembered for `loadRealSounds`. */
function real(name: string, synth: () => void) {
  const play = sfx.recorded(name, synth);
  names.set(play, name);
  return play;
}

/** Starts loading the recordings of these sounds (the others are skipped), so even their first play is the real one. */
export function loadRealSounds(sounds: Iterable<unknown>) {
  const found = new Set<string>();
  for (const sound of sounds) {
    const name = names.get(sound as () => void);
    if (name) found.add(name);
  }
  sfx.loadRecordings(found);
}

/** A real child laughing. */
export const playGiggle = real("laugh", sfx.playGiggle);
/** Water splashing. */
export const playSplash = real("splash", sfx.playSplash);
/** A toilet flushing. */
export const playFlush = real("flush", sfx.playFlush);
/** A hair dryer. */
export const playBlow = real("blow", sfx.playBlow);
/** A washing machine. */
export const playWash = real("washer", sfx.playWash);
/** A bite into an apple. */
export const playMunch = real("munch", sfx.playMunch);
/** Sawing wood. */
export const playSaw = real("saw", sfx.playSaw);
/** A small engine starting. */
export const playEngine = real("engine", sfx.playEngine);
/** A car horn. */
export const playHonk = real("honk", sfx.playHonk);
/** A fire engine's siren. */
export const playSiren = real("siren", sfx.playSiren);
/** A bicycle bell. */
export const playRing = real("ring", sfx.playRing);
/** A steam train's whistle. */
export const playWhistle = real("whistle", sfx.playWhistle);
/** A church bell. */
export const playBells = real("bells", sfx.playBells);
/** A rocket lifting off. */
export const playLaunch = real("launch", sfx.playLaunch);
/** A dog. */
export const playBark = real("bark", sfx.playBark);
/** A cat. */
export const playMeow = real("meow", sfx.playMeow);
/** A cow. */
export const playMoo = real("moo", sfx.playMoo);
/** A pig. */
export const playOink = real("oink", sfx.playOink);
/** A horse. */
export const playNeigh = real("neigh", sfx.playNeigh);
/** A sheep. */
export const playBaa = real("baa", sfx.playBaa);
/** A duck. */
export const playQuack = real("quack", sfx.playQuack);
/** A frog. */
export const playCroak = real("croak", sfx.playCroak);
/** A hen. */
export const playCluck = real("cluck", sfx.playCluck);
/** A rooster. */
export const playCrow = real("crow", sfx.playCrow);
/** A songbird. */
export const playTweet = real("tweet", sfx.playTweet);
/** A pigeon. */
export const playCoo = real("coo", sfx.playCoo);
/** A parrot. */
export const playSquawk = real("squawk", sfx.playSquawk);
/** A cuckoo. */
export const playCuckoo = real("cuckoo", sfx.playCuckoo);
/** An owl. */
export const playHoot = real("hoot", sfx.playHoot);
/** A lion. */
export const playRoar = real("roar", sfx.playRoar);
/** An elephant. */
export const playTrumpet = real("trumpet", sfx.playTrumpet);
/** A monkey. */
export const playChatter = real("chatter", sfx.playChatter);
/** A bee. */
export const playBuzz = real("buzz", sfx.playBuzz);
/** A whale. */
export const playWhale = real("whale", sfx.playWhale);
