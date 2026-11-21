import { useTitle } from "@/lib/title";
import { OutroVideo } from "@/video/outro/OutroVideo";

/** Hidden page for grown-ups, reached from /management/: the YouTube videos' outro, to watch and to record. */
export function OutroVideoPage() {
  useTitle("Abspann für die Videos");
  return <OutroVideo />;
}
