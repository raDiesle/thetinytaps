import { memo } from "react";
import { useLocation } from "react-router";
import { BookFamilies } from "@/components/BookFamily";
import { INDOOR, SunFace, SunRays, type WorldId, WorldGround, WorldWindow } from "@/components/Worlds";
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
          {/* The rays are a layer of their own, so a tap turns them as a whole (`spinSunAt`) without the phone painting the sun again in every frame. */}
          <div className="sky-sun">
            <svg className="sky-sun-ray-layer" viewBox="0 0 200 200">
              <SunRays />
            </svg>
            <svg className="sky-sun-face" viewBox="0 0 200 200">
              <SunFace />
            </svg>
          </div>
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
      {/* The fox and the bear family reading together at the bottom of the page. */}
      <BookFamilies />
    </div>
  );
});

/** How long the rays take for one turn after a tap on the sun. */
const SUN_SPIN_MS = 2400;

/**
 * Turns the menu's sun's rays once round clockwise when (x, y) lies on the sun – face or rays – and says whether it did.
 * The sky lies behind the page, so a tap never lands on it: the menus' one tap listener (`MenuRipples`) asks here. A tap
 * while they turn gives them one more turn from where they are, so the rays never jump.
 */
export function spinSunAt(x: number, y: number): boolean {
  const sun = document.querySelector<HTMLElement>(".sky .sky-sun");
  const rays = sun?.querySelector<SVGSVGElement>(".sky-sun-ray-layer");
  if (!sun || !rays) return false;
  const box = sun.getBoundingClientRect();
  if (box.width === 0) return false;
  // The rays reach 96 of the box's 100 from its middle: only a tap on the sun counts, not the box's empty corners.
  const r = (box.width / 2) * 0.96;
  if (Math.hypot(x - (box.left + box.width / 2), y - (box.top + box.height / 2)) > r) return false;
  const now = Number.parseFloat(getComputedStyle(rays).rotate) || 0;
  for (const spin of rays.getAnimations()) spin.cancel();
  // Ending on a whole ray's step: once the turn is over the rays stand as before, so dropping the turn shows no jump.
  const end = Math.ceil((now + 360) / 30) * 30;
  rays.animate([{ rotate: `${now}deg` }, { rotate: `${end}deg` }], { duration: SUN_SPIN_MS, easing: "cubic-bezier(.3,0,.25,1)" });
  return true;
}

function Cloud({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 160 80">
      <path d="M30 70 a24 24 0 0 1 4-47 a30 30 0 0 1 56-8 a26 26 0 0 1 44 20 a22 22 0 0 1-4 35 Z" />
    </svg>
  );
}
