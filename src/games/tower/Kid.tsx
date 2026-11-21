import { memo } from "react";
import { Mascot, type MascotPose } from "@/components/Mascot";
import { useFigure } from "@/lib/common";

/**
 * The child riding up the Counting Tower: it stands for the child playing, so it follows „Junge / Mädchen“ – the fox
 * girl or the bear boy of the shelf's stickers. It does the game's thing: it hops onto every new block, reaches for the
 * goal and takes it. Drawn once per pose; its HTML layer moves.
 */
export const Kid = memo(function Kid({ pose }: { pose: MascotPose }) {
  const girl = useFigure() === "girl";
  return <Mascot kind={girl ? "fox" : "bear"} child lashes={girl} pose={pose} />;
});
