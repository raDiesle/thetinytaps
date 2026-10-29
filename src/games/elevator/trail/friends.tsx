import type { ComponentType } from "react";
import { INK } from "@/games/scenes/shared";
import { playBark } from "@/lib/sfx";
import type { ItemId } from "./items";

// Friends (G-10, „Ein Freund kommt mit“): a creature the child has helped walks along behind it, and its picture
// stands in the backpack with the things. At a later obstacle the child can pick it like a thing ("Wer hilft?"):
// the friend runs over and does the job itself – the dog digs the ball out of the sand. `TrailPlay` draws a friend
// from the moment it joins, so the level's scenery leaves the creature out from then on (`SceneryProps.friends`).

/** What a friend does: sits behind the child, runs along, or does its job at an obstacle. */
export type FriendPose = "sit" | "walk" | "work";

/** A creature that walks along once it has been helped. */
export interface Friend {
  /** The creature in the world, standing on (0, 0) and facing right. */
  Body: ComponentType<{ pose: FriendPose }>;
  /** Its voice: when it joins, sets off to help, or is tapped. */
  sound: () => void;
}

const WHITE = "#f8f9fa";
const COLLAR = "#e03131";

/** Black spots on the white coat. */
function Spots({ spots }: { spots: [number, number, number][] }) {
  return (
    <>
      {spots.map(([x, y, r]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={r} fill={INK} />
      ))}
    </>
  );
}

/** The dog's head looking right, with its black ear; its neck at about (0, 0). */
function DogHead() {
  return (
    <g>
      <circle cx="8" cy="-30" r="32" fill={WHITE} stroke={INK} strokeWidth="4" />
      <ellipse cx="40" cy="-18" rx="24" ry="17" fill={WHITE} stroke={INK} strokeWidth="3.5" />
      <circle cx="60" cy="-24" r="7" fill={INK} />
      <circle cx="16" cy="-40" r="5" fill={INK} />
      <path d="M-10 -56 Q-34 -50 -28 -10 Q-10 -16 -6 -50 Z" fill={INK} />
      <path d="M50 -4 Q42 4 34 -2" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  );
}

/** The dog sitting, just as it sat on the pavement (`ball.tsx`), only looking the other way. */
function SittingDog() {
  return (
    <g>
      <path d="M-40 -16 Q-76 -20 -70 -60" stroke={INK} strokeWidth="14" strokeLinecap="round" fill="none" />
      <path d="M-40 -16 Q-76 -20 -70 -60" stroke={WHITE} strokeWidth="7" strokeLinecap="round" fill="none" />
      <ellipse cx="-22" cy="-18" rx="34" ry="18" fill={WHITE} stroke={INK} strokeWidth="4" />
      <ellipse cx="-6" cy="-62" rx="36" ry="50" fill={WHITE} stroke={INK} strokeWidth="4" />
      <Spots
        spots={[
          [12, -80, 7],
          [-20, -50, 9],
          [4, -36, 6],
          [-30, -14, 7],
          [-14, -94, 5],
        ]}
      />
      {[24, 6].map((x) => (
        <rect key={x} x={x - 8} y="-60" width="16" height="60" rx="7" fill={WHITE} stroke={INK} strokeWidth="3.5" />
      ))}
      <path d="M26 -100 Q-6 -110 -34 -100" stroke={COLLAR} strokeWidth="9" strokeLinecap="round" fill="none" />
      <g transform="translate(0 -100)">
        <DogHead />
      </g>
    </g>
  );
}

/** A leg of the standing dog, from its hip at (x, -58) down to the ground. */
function Leg({ x, className }: { x: number; className: string }) {
  return (
    <g className={className} style={{ transformOrigin: `${x}px -54px` }}>
      <rect x={x - 8} y="-62" width="16" height="62" rx="7" fill={WHITE} stroke={INK} strokeWidth="3.5" />
    </g>
  );
}

/** Sand flying back between the hind legs while the dog digs. */
const SAND: [number, number][] = [
  [-60, -40],
  [-90, -70],
  [-110, -30],
  [-74, -96],
];

/** The dog on four legs: running along (its legs swing, its tail wags) or digging with its front paws, head down. */
function StandingDog({ pose }: { pose: "walk" | "work" }) {
  return (
    <g className={`tl-friend-dog ${pose}`}>
      <g className="tl-friend-tail" style={{ transformOrigin: "-52px -76px" }}>
        <path d="M-52 -76 Q-84 -80 -84 -118" stroke={INK} strokeWidth="14" strokeLinecap="round" fill="none" />
        <path d="M-52 -76 Q-84 -80 -84 -118" stroke={WHITE} strokeWidth="7" strokeLinecap="round" fill="none" />
      </g>
      <Leg x={-40} className="tl-friend-leg a" />
      <Leg x={34} className="tl-friend-leg b tl-friend-paw" />
      <ellipse cx="0" cy="-74" rx="60" ry="28" fill={WHITE} stroke={INK} strokeWidth="4" />
      <Spots
        spots={[
          [-30, -80, 9],
          [6, -88, 6],
          [24, -66, 7],
          [-12, -60, 5],
        ]}
      />
      <Leg x={-22} className="tl-friend-leg b" />
      <Leg x={50} className="tl-friend-leg a tl-friend-paw" />
      <g className="tl-friend-head" style={{ transformOrigin: "46px -90px" }}>
        <path d="M40 -104 Q54 -84 50 -64" stroke={COLLAR} strokeWidth="9" strokeLinecap="round" fill="none" />
        <g transform="translate(54 -84)">
          <DogHead />
        </g>
      </g>
      {pose === "work" &&
        SAND.map(([x, y], i) => (
          <circle
            key={x}
            className="tl-friend-sand"
            cx={x}
            cy={y}
            r="7"
            fill="#ffd8a8"
            stroke="#e8a35c"
            strokeWidth="2"
            style={{ animationDelay: `${i * 110}ms` }}
          />
        ))}
    </g>
  );
}

function DogFriend({ pose }: { pose: FriendPose }) {
  return pose === "sit" ? <SittingDog /> : <StandingDog pose={pose} />;
}

/** The dog's picture in the backpack: its head and chest, as if it peeked out. */
export function DogFace() {
  return (
    <g transform="translate(-14 0)">
      <ellipse cx="-2" cy="-24" rx="34" ry="36" fill={WHITE} stroke={INK} strokeWidth="4" />
      <Spots
        spots={[
          [-16, -22, 8],
          [12, -8, 6],
        ]}
      />
      <path d="M30 -60 Q-2 -70 -30 -60" stroke={COLLAR} strokeWidth="9" strokeLinecap="round" fill="none" />
      <g transform="translate(4 -62)">
        <DogHead />
      </g>
    </g>
  );
}

/** The friends, keyed by their picture in the backpack (an `ItemId`, so it stands there like a thing). */
export const FRIENDS: Partial<Record<ItemId, Friend>> = {
  dog: { Body: DogFriend, sound: playBark },
};
