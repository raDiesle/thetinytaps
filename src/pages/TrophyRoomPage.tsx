import { TrophyMuseum } from "@/components/TrophyMuseum";
import { useT } from "@/lib/language";
import { TROPHY_ROOM } from "@/lib/museum";
import { useTitle } from "@/lib/title";

/** The trophy room next to the bookshelf (TrophyMuseum). */
export function TrophyRoomPage() {
  const t = useT();
  useTitle(t(TROPHY_ROOM));
  return <TrophyMuseum />;
}
