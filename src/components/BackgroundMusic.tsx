import { useBackgroundMusic } from "@/lib/backgroundMusic";
import { useCommonSettings } from "@/lib/common";

/** The song playing behind the menus and the games while "🎵 Musik" is on (see backgroundMusic.ts); mounted once for the app. */
export function BackgroundMusic() {
  const [common] = useCommonSettings();
  useBackgroundMusic({ enabled: common.music });
  return null;
}
