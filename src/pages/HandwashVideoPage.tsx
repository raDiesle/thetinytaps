import { HandwashVideo } from "@/games/handwash/HandwashVideo";
import { useTitle } from "@/lib/title";

/** Hidden page for grown-ups, reached from /management/: Hände waschen played for a video recording. */
export function HandwashVideoPage() {
  useTitle("Hände waschen fürs Video");
  return <HandwashVideo />;
}
