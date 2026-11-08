import { useSyncExternalStore } from "react";
import { isWaiting, subscribeWaiting } from "@/lib/soundWait";

/**
 * The paw track on a slip of paper, in the middle of the screen, while a sound the game needs now is still loading
 * (`waitingFor` in soundWait.ts): the same paws as a page loading (`PageLoading`), so it reads as „it's coming“. It
 * shows only after a moment (`.sound-wait` in base.css), so a quick load shows nothing. Mounted once in index.tsx;
 * taps go through it.
 */
export function SoundLoading() {
  const waiting = useSyncExternalStore(subscribeWaiting, isWaiting, () => false);
  if (!waiting) return null;
  return (
    <div className="sound-wait" aria-busy="true" role="status">
      <div className="boot-wait" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
