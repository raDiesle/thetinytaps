// Small synthesized sound effects, so no audio files are needed; real recordings
// from src/lib/sounds/ where there are some. Sorted by topic into the files here,
// so parallel branches adding sounds don't all change one file.

export {
  audioContext,
  decodeSound,
  type Loop,
  type LoopOptions,
  loadRecordings,
  loadSound,
  playLoop,
  playRecorded,
  recorded,
  setSfxVolume,
  unlockAudio,
} from "./core";
export * from "./animals";
export * from "./home";
export * from "./music";
export * from "./vehicles";
