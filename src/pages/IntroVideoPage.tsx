import { useTitle } from "@/lib/title";
import { IntroVideo } from "@/video/intro/IntroVideo";

/** Hidden page for grown-ups, reached from /management/: the YouTube videos' intro, to watch and to record. */
export function IntroVideoPage() {
  useTitle("Intro für die Videos");
  return <IntroVideo />;
}
