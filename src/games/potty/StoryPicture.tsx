import { useEffect, useState } from "react";
import { framesFor } from "./images";

/** How long each frame of a picture stays before the other fades in. */
const FRAME_MS = 900;

/** How long each picture of a step's tiny animation (`moves`) stays before the next. */
const MOVE_MS = 650;

/**
 * A picture of the story; in „Muss mal!“ it fills the screen. Its two frames fade into each
 * other, like a tiny GIF, once the story has started (`moving`); before the first
 * tap it stands still. Several names show one picture's frames after the other's. The pictures of
 * `moves` come once before them (trousers going down), then the picture stays – or, with `again`, they play
 * once more after that pause, over and over. Give it a new `key` for every picture.
 */
export function StoryPicture({
  name,
  moves = [],
  again,
  moving,
  className = "pt-picture",
}: {
  name: string | string[];
  moves?: string[];
  again?: number;
  moving: boolean;
  className?: string;
}) {
  const once = moves.flatMap(framesFor);
  const loop = (typeof name === "string" ? [name] : name).flatMap(framesFor);
  const still = !moving || matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Without movement the animation is skipped: the picture shows as it ends.
  const [frame, setFrame] = useState(still ? once.length : 0);
  const intro = frame < once.length;
  /** The animation is playing again (`again`), not for the first time. */
  const [replaying, setReplaying] = useState(false);

  useEffect(() => {
    if (still || (!intro && loop.length < 2)) return;
    const timer = setTimeout(() => setFrame((f) => f + 1), intro ? MOVE_MS : FRAME_MS);
    return () => clearTimeout(timer);
  }, [still, intro, loop.length, frame]);

  // After the pause the animation starts again from its first picture.
  useEffect(() => {
    if (still || intro || again === undefined || once.length === 0) return;
    const timer = setTimeout(() => {
      setReplaying(true);
      setFrame(0);
    }, again);
    return () => clearTimeout(timer);
  }, [still, intro, again, once.length]);

  const shown = intro ? frame : once.length + ((frame - once.length) % Math.max(loop.length, 1));
  // The floor always shows, so the shown frame only fades in over it – never a gap. During the animation it is
  // its first picture, then the picture's first frame, so nothing of the animation shines through the frames.
  const floor = intro ? 0 : once.length;
  // When the animation ends its last picture stays below the picture's first frame while that fades in, so nothing
  // flickers; when it starts again, the picture stays below its first one.
  const restart = replaying && frame === 0;
  const below = intro ? (restart ? once.length : -1) : once.length - 1;

  return (
    <div className={className}>
      {[...once, ...loop].map((src, i) => (
        <img
          key={src}
          className={i === shown ? (restart ? "on top" : "on") : i === floor || i === below ? "base" : undefined}
          src={src}
          alt=""
          decoding="async"
          draggable={false}
        />
      ))}
    </div>
  );
}
