// Which recording belongs to which line: the file name is a short hash of the line's text, so a changed
// line has no recording until it is made again (`bun run voice make`). No imports, so
// scripts/elevenlabs-voice.mjs can use it as it is.

/** The file name (without .mp3) of the recording of `text`: FNV-1a over its characters, 8 hex digits. */
export function voiceId(text: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

/**
 * The file name (without .mp3) of the recording of `text` in `language`: the hash for German
 * (stimme/<hash>.mp3), the language in front for the others (stimme/en/en-<hash>.mp3), so the
 * build can leave those out of what every phone keeps offline (tools/build.ts).
 */
export const recordingName = (text: string, language: string) => (language === "de" ? voiceId(text) : `${language}-${voiceId(text)}`);
