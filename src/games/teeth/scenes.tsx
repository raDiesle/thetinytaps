import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

// The pictures before and after the brushing follow each other like one camera looking round the bathroom: from the
// child's face down to the sink, from the sink up into the mirror, and down to the sink again to put the brush away.
// The old picture stays (still playing) while it slides out and the new one slides in, so there is never a cut.

/** Which picture is on: the story's face, the sink, or the mirror. */
export type SceneKind = "story" | "sink" | "mirror";

/** How long the camera takes from one picture to the next: two beats of the song (112 BPM). */
export const SCENE_MS = 1072;

/** Where the camera goes: down to the sink, up from it, or (story to mirror, a new round) a soft fade. */
const wayTo = (from: SceneKind, to: SceneKind) => (to === "sink" ? "down" : from === "sink" ? "up" : "fade");

/** A picture still sliding out. */
interface Leaving {
  key: string;
  node: ReactNode;
  move: string;
}

/**
 * Shows `children` as the picture `kind`, and when `id` changes slides the old picture out and the new one in.
 * Each picture is a layer of its own that only moves (transform), so the slide costs the phone no painting.
 */
export function Scenes({ id, kind, paused, children }: { id: string; kind: SceneKind; paused: boolean; children: ReactNode }) {
  // The picture as it was last shown, to keep showing while it slides out.
  const last = useRef({ kind, node: children });
  const [scene, setScene] = useState<{ key: string; move: string; leaving: Leaving[] }>({ key: id, move: "", leaving: [] });
  if (scene.key !== id) {
    const way = wayTo(last.current.kind, kind);
    // Kept in front of the new one in the list, so React never moves its element (that would restart its animations).
    setScene({
      key: id,
      move: `enter-${way}`,
      leaving: [...scene.leaving.filter((s) => s.key !== id), { key: scene.key, node: last.current.node, move: `leave-${way}` }],
    });
  }
  useLayoutEffect(() => {
    last.current = { kind, node: children };
  });

  const gone = (key: string) => setScene((s) => ({ ...s, leaving: s.leaving.filter((l) => l.key !== key) }));
  // A picture goes when its slide ends (which waits while the game is paused); in case no animation runs at all
  // (reduced motion), a little later anyway.
  useEffect(() => {
    if (!scene.leaving.length || paused) return;
    const timer = setTimeout(() => setScene((s) => ({ ...s, leaving: [] })), SCENE_MS + 400);
    return () => clearTimeout(timer);
  }, [scene.leaving, paused]);

  return [...scene.leaving, { key: id, node: children, move: scene.key === id ? scene.move : "" }].map((s) => (
    <div
      key={s.key}
      className={`teeth-scene ${s.move}`}
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget && s.key !== id) gone(s.key);
      }}
    >
      {s.node}
    </div>
  ));
}
