import { useEffect, useState } from "react";
import { framesFor } from "./images";

/** How long each frame of a picture stays before the other fades in. */
const FRAME_MS = 900;

/**
 * A picture of the story; in „Muss mal!“ it fills the screen. Its two frames fade into each
 * other, like a tiny GIF, once the story has started (`moving`); before the first
 * tap it stands still. Give it a new `key` for every picture.
 */
export function StoryPicture({ name, moving, className = "pt-picture" }: { name: string; moving: boolean; className?: string }) {
  const frames = framesFor(name);
  const [frame, setFrame] = useState(0);
  const animated = moving && frames.length > 1;

  useEffect(() => {
    if (!animated || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setFrame((f) => f + 1), FRAME_MS);
    return () => clearInterval(timer);
  }, [animated]);

  return (
    <div className={className}>
      {frames.map((src, i) => (
        <img key={src} className={i === frame % frames.length ? "on" : undefined} src={src} alt="" decoding="async" draggable={false} />
      ))}
    </div>
  );
}
