import { useEffect, useState } from "react";
import { waitingFor } from "./soundWait";
import type { RecordedVoice, VoiceLine } from "./voice";

/**
 * Whether the lines a round starts with are loaded: the game shows that round only once they are, so its first line
 * comes with its picture (user request, November 2026). Meanwhile the paw track of `SoundLoading` shows; after
 * SOUND_WAIT_MS the round starts anyway. `next` are the lines of the round after it, loaded meanwhile so that one
 * comes at once. Off (`enabled` false, the voice switched off): always ready, nothing loaded.
 */
export function useVoiceReady(
  voice: RecordedVoice,
  lines: VoiceLine[],
  language: string,
  { next = [], enabled = true }: { next?: VoiceLine[]; enabled?: boolean } = {},
) {
  const key = `${language}\n${JSON.stringify(lines)}`;
  const nextKey = JSON.stringify(next);
  const [readyKey, setReadyKey] = useState<string | null>(null);
  const ready = !enabled || readyKey === key || voice.isReady(lines, language);

  useEffect(() => {
    if (!enabled) return;
    const wanted: VoiceLine[] = JSON.parse(key.slice(key.indexOf("\n") + 1));
    let alive = true;
    const loaded = voice.ready(wanted, language);
    // Only what is due now shows the paw track; the next round loads quietly behind it.
    void (voice.isReady(wanted, language) ? loaded : waitingFor(loaded)).then(() => {
      if (alive) setReadyKey(key);
      voice.load(JSON.parse(nextKey), language);
    });
    return () => {
      alive = false;
    };
  }, [voice, key, nextKey, language, enabled]);

  return ready;
}
