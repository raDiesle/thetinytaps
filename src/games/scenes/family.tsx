import { MASCOT_COLORS } from "@/components/Mascot";
import { MascotFace, type Mascot } from "./shared";
import { Poke } from "./spots";

// The app's mascots out and about in a picture: a fox or bear grown-up and its child hand in hand, drawn flat like the
// people of the pictures (no line), with the shared head. They are part of the background, not an item: a tap makes them
// hop (a `<Poke>`), and nothing is said, so no picture loses its translations for them.

/** What the grown-up and the child wear, so each picture dresses them for its place. */
export interface FamilyClothes {
  top: string;
  legs: string;
  childTop: string;
  childLegs: string;
}

/**
 * A fox or bear grown-up with its child on its left (as we see it), holding hands, foot point of the grown-up at (0, 0),
 * about 180 high; the child stands at x = 86. Place it with `transform` (translate, and scale for a picture's depth).
 */
export function WalkingFamily({ kind, clothes }: { kind: Mascot; clothes: FamilyClothes }) {
  const c = MASCOT_COLORS[kind];
  const fox = kind === "fox";
  const paw = fox ? c.paw : c.fur;
  return (
    <Poke kind="hop">
      <ellipse cx="40" cy="0" rx="78" ry="7" fill="#000" opacity="0.1" />
      {/* The grown-up */}
      {fox && <path d="M-14 -66 Q-58 -64 -64 -104 Q-46 -84 -12 -84 Z" fill={c.fur} />}
      {fox && <path d="M-64 -104 Q-62 -86 -48 -76 Q-56 -90 -56 -98 Z" fill={c.pale} />}
      <rect x="-17" y="-62" width="15" height="56" rx="6" fill={clothes.legs} />
      <rect x="2" y="-62" width="15" height="56" rx="6" fill={clothes.legs} />
      <ellipse cx="-11" cy="-5" rx="12" ry="6" fill={paw} />
      <ellipse cx="11" cy="-5" rx="12" ry="6" fill={paw} />
      <rect x="-27" y="-130" width="54" height="76" rx="20" fill={clothes.top} />
      <path d="M-22 -118 Q-34 -96 -30 -72" stroke={clothes.top} strokeWidth="13" strokeLinecap="round" fill="none" />
      <circle cx="-30" cy="-68" r="7" fill={paw} />
      <path d="M22 -118 Q38 -100 46 -80" stroke={clothes.top} strokeWidth="13" strokeLinecap="round" fill="none" />
      <MascotFace kind={kind} cx={0} cy={-154} r={25} />
      {/* The child, a head smaller, its paw in the grown-up's */}
      <g transform="translate(86 0)">
        {fox && <path d="M12 -40 Q42 -40 46 -66 Q34 -54 12 -52 Z" fill={c.fur} />}
        {fox && <path d="M46 -66 Q44 -54 34 -48 Q40 -58 40 -62 Z" fill={c.pale} />}
        <rect x="-12" y="-40" width="11" height="36" rx="5" fill={clothes.childLegs} />
        <rect x="1" y="-40" width="11" height="36" rx="5" fill={clothes.childLegs} />
        <ellipse cx="-7" cy="-4" rx="9" ry="5" fill={paw} />
        <ellipse cx="7" cy="-4" rx="9" ry="5" fill={paw} />
        <rect x="-19" y="-88" width="38" height="52" rx="15" fill={clothes.childTop} />
        <path d="M-15 -80 Q-28 -76 -36 -74" stroke={clothes.childTop} strokeWidth="10" strokeLinecap="round" fill="none" />
        <path d="M15 -80 Q22 -66 22 -54" stroke={clothes.childTop} strokeWidth="10" strokeLinecap="round" fill="none" />
        <circle cx="22" cy="-50" r="5.5" fill={paw} />
        <MascotFace kind={kind} cx={0} cy={-108} r={21} child />
      </g>
      {/* Their two paws held together, over both arms */}
      <circle cx="48" cy="-76" r="7.5" fill={paw} />
      <circle cx="51" cy="-73" r="5.5" fill={paw} />
    </Poke>
  );
}
