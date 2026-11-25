// How loud voice, music and sounds play next to each other (user feedback, November 2026: on a phone at full
// volume the music was too quiet – it played about 12 dB under the voice – and music, voice and sounds should
// sound alike, the sounds only a little quieter). Loudness is measured in LUFS with
// `ffmpeg -i <file> -af ebur128 -f null -` (the "I:" line at the end).

/**
 * Loudness of the voice recordings (ElevenLabs, played at full gain): the level everything is matched to.
 * Measured November 2026 over 140 lines in every language: median −17.3 LUFS.
 */
export const VOICE_LUFS = -17.3;

/**
 * Gain that plays a song measured at `lufs` as loud as the voice (never above 1, which would distort).
 * A new song's loudness is measured and passed here, never a volume guessed by ear in Claude's muted preview.
 */
export const songGain = (lufs: number) => Math.min(1, 10 ** ((VOICE_LUFS - lufs) / 20));

/**
 * The shared background song (menus and every game without its own song) plays this far under the voice: about
 * −6 dB (user request, 25 November 2026: at the voice's loudness it distracted, and voice and sounds were hard to
 * follow over it; 12 dB under, in early November, was too quiet on a phone at full volume). A song that is the game
 * itself (the Zahnputzlied, the potty's waiting song) stays as loud as the voice and never takes this.
 */
export const BACKGROUND_GAIN = 0.5;

/** How far a song dips while the voice speaks (about −12 dB), so the words are understood over it. */
export const DUCK = 0.25;

/**
 * All sounds (recorded and synthesized) play at this share of their own volume: a little quieter than voice and
 * music (−1 dB; the recordings in `src/lib/sounds/` sit about 1 dB under the voice already), never much.
 */
export const EFFECTS_GAIN = 0.9;
