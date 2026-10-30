import { memo } from "react";
import { useLocation } from "react-router";
import { INDOOR, Sun, type WorldId, WorldGround, WorldWindow } from "@/components/Worlds";
import { worldOf } from "@/content/games";

/**
 * The menus' backdrop: a sunny sky with drifting clouds over rolling hills. Purely decorative.
 * The pages of a home category and of its games show that category's world (Worlds.tsx): a room instead of the sky,
 * or things standing on the hills.
 */
export const Sky = memo(function Sky() {
  const world = worldOf(useLocation().pathname)?.id as WorldId | undefined;
  const indoor = world !== undefined && INDOOR.includes(world);
  return (
    <div className="sky" data-world={world} aria-hidden>
      {indoor ? (
        <WorldWindow />
      ) : (
        <>
          <svg className="sky-sun" viewBox="0 0 200 200">
            <Sun />
          </svg>
          <Cloud className="sky-cloud c1" />
          <Cloud className="sky-cloud c2" />
          <Cloud className="sky-cloud c3" />
          <svg className="sky-hills" viewBox="0 0 1200 220" preserveAspectRatio="none">
            <path className="hill-back" d="M0 120 C180 40 360 40 520 110 C680 180 860 30 1200 90 V220 H0 Z" />
            <path className="hill-front" d="M0 170 C220 100 420 120 600 160 C800 205 980 110 1200 140 V220 H0 Z" />
          </svg>
        </>
      )}
      {world && <WorldGround world={world} />}
    </div>
  );
});

function Cloud({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 160 80">
      <path d="M30 70 a24 24 0 0 1 4-47 a30 30 0 0 1 56-8 a26 26 0 0 1 44 20 a22 22 0 0 1-4 35 Z" />
    </svg>
  );
}
