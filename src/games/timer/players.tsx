import { useId, useRef } from "react";
import { SettingsGroup } from "@/components/SettingControls";
import { type Texts, useT } from "@/lib/language";
import { MORE_KID_NAMES } from "./marbleNames";
import { NAME_HINT, PICK_PHOTO, PLAYERS_NOTE, PLAYERS_TITLE, REMOVE_PHOTO } from "./playersNames";
import { INK } from "./scenes";
import type { PlayerLook, Players, TurnChild } from "./settings";

// Who the children taking turns really are (user request, 25 November 2026): behind ⚙️ a grown-up writes each child's
// name or picks a photo of it on the device, and every picture of taking turns shows it on that child's place – the
// cushion, the seat, the cup, the mat and the big screen. A photo is cut square and made small here, kept in the
// timer's settings in this browser only, and never sent anywhere (Datenschutzerklärung).

/** The children's names behind ⚙️ („Wer ist dran?“) while no name of their own is written. */
export const KID_NAMES: Record<TurnChild, Texts> = {
  fox: { de: "🦊 Fuchskind", en: "🦊 Little fox", zh: "🦊 小狐狸", hi: "🦊 लोमड़ी का बच्चा", es: "🦊 Zorrito", ar: "🦊 الثعلب الصغير", ru: "🦊 Лисёнок" },
  bear: { de: "🐻 Bärenkind", en: "🐻 Little bear", zh: "🐻 小熊", hi: "🐻 भालू का बच्चा", es: "🐻 Osito", ar: "🐻 الدبّ الصغير", ru: "🐻 Медвежонок" },
  ...MORE_KID_NAMES,
};

/** Each child's animal, before its name behind ⚙️. */
export const KID_EMOJI: Record<TurnChild, string> = { fox: "🦊", bear: "🐻", rabbit: "🐰", frog: "🐸" };

/** The longest name kept: enough for a first name, short enough to stand on a cushion. */
export const NAME_MAX = 14;

/** How big a photo is kept, in pixels each way: sharp on a cushion seen on a tablet, small in the settings (about 15 KB). */
export const PHOTO_SIZE = 240;

/** A child's name as written, trimmed, or nothing. */
export const ownName = (look: PlayerLook | undefined) => look?.name?.trim().slice(0, NAME_MAX) || undefined;

/** The child as „Wer ist dran?“ names it: its animal and its own name, or the animal's child. */
export function kidLabel(kind: TurnChild, players: Players, t: (texts: Texts) => string) {
  const name = ownName(players[kind]);
  return name ? `${KID_EMOJI[kind]} ${name}` : t(KID_NAMES[kind]);
}

/**
 * A photo from the device made small: cut square from its middle and scaled to `PHOTO_SIZE`, as a JPEG data URL – so
 * four of them stay small in the settings, and a big camera photo never sits in the page.
 */
export async function photoFromFile(file: Blob): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.decoding = "async";
    image.src = url;
    await image.decode();
    const side = Math.min(image.naturalWidth, image.naturalHeight);
    const canvas = document.createElement("canvas");
    canvas.width = PHOTO_SIZE;
    canvas.height = PHOTO_SIZE;
    const context = canvas.getContext("2d");
    if (!context || side <= 0) throw new Error("no picture");
    context.drawImage(image, (image.naturalWidth - side) / 2, (image.naturalHeight - side) / 2, side, side, 0, 0, PHOTO_SIZE, PHOTO_SIZE);
    return canvas.toDataURL("image/jpeg", 0.82);
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** How big a name's letters are on a label `width` wide: as big as `max`, smaller for a long name so it fits in one line. */
export function nameSize(name: string, width: number, max: number) {
  return Math.min(max, width / (Math.max(1, [...name].length) * 0.62));
}

/**
 * A child's photo or name on its place, drawn into the picture's svg with its middle at (`x`, `y`): a photo in a round
 * frame `r` big, in the child's colour (`color`), or the name in big letters on a light label – or nothing while
 * neither is set, so the cushion, cup or mat stays as it was.
 */
export function PlayerPatch({ look, x, y, r, color }: { look: PlayerLook | undefined; x: number; y: number; r: number; color: string }) {
  const id = `tm-player-${useId().replace(/[^\w-]/g, "")}`;
  const name = ownName(look);
  if (look?.photo)
    return (
      <g className="tm-player-photo">
        <defs>
          <clipPath id={id}>
            <circle cx={x} cy={y} r={r} />
          </clipPath>
        </defs>
        <circle cx={x} cy={y} r={r + r * 0.16} fill="#fff" stroke={INK} strokeWidth={Math.max(3, r * 0.06)} />
        <circle cx={x} cy={y} r={r + r * 0.08} fill="none" stroke={color} strokeWidth={r * 0.1} strokeDasharray={`${r * 0.18} ${r * 0.12}`} />
        <image href={look.photo} x={x - r} y={y - r} width={r * 2} height={r * 2} clipPath={`url(#${id})`} preserveAspectRatio="xMidYMid slice" />
      </g>
    );
  if (!name) return null;
  const w = r * 3.2;
  const h = r * 1.15;
  const size = nameSize(name, w - r * 0.5, h * 0.72);
  return (
    <g className="tm-player-name">
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={h / 2} fill="#fffbe6" stroke={INK} strokeWidth={Math.max(3, r * 0.06)} />
      <rect
        x={x - w / 2 + 5}
        y={y - h / 2 + 5}
        width={w - 10}
        height={h - 10}
        rx={h / 2 - 5}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeDasharray="8 6"
      />
      <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize={size} fontWeight="800" fill={INK}>
        {name}
      </text>
    </g>
  );
}

/** One child's row behind ⚙️: its animal, its photo (a tap picks one), its name to write and ✕ to take the photo away. */
function PlayerRow({ kind, look, onChange }: { kind: TurnChild; look: PlayerLook | undefined; onChange: (look: PlayerLook) => void }) {
  const t = useT();
  const file = useRef<HTMLInputElement>(null);
  return (
    <div className="tm-player-row">
      <span className="tm-player-animal" aria-hidden>
        {KID_EMOJI[kind]}
      </span>
      <button
        type="button"
        className={look?.photo ? "tm-player-pick tm-player-has-photo" : "tm-player-pick"}
        aria-label={t(PICK_PHOTO)}
        title={t(PICK_PHOTO)}
        onClick={() => file.current?.click()}
      >
        {look?.photo ? <img src={look.photo} alt="" /> : <span aria-hidden>📷</span>}
      </button>
      <input
        ref={file}
        type="file"
        accept="image/*"
        hidden
        onChange={async (e) => {
          const picked = e.target.files?.[0];
          e.target.value = "";
          if (!picked) return;
          try {
            onChange({ ...look, photo: await photoFromFile(picked) });
          } catch {
            // A file the browser can't show as a picture changes nothing.
          }
        }}
      />
      <input
        type="text"
        className="tm-player-name-input"
        value={look?.name ?? ""}
        maxLength={NAME_MAX}
        placeholder={t(NAME_HINT)}
        aria-label={`${t(KID_NAMES[kind])}: ${t(NAME_HINT)}`}
        onChange={(e) => onChange({ ...look, name: e.target.value })}
      />
      {look?.photo && (
        <button
          type="button"
          className="tm-player-remove"
          aria-label={t(REMOVE_PHOTO)}
          title={t(REMOVE_PHOTO)}
          onClick={() => onChange({ ...look, photo: undefined })}
        >
          ✕
        </button>
      )}
    </div>
  );
}

/** Behind ⚙️: a name and a photo for each child taking turns now. */
export function PlayersChoice({ kids, players, onChange }: { kids: readonly TurnChild[]; players: Players; onChange: (players: Players) => void }) {
  const t = useT();
  return (
    <SettingsGroup title={t(PLAYERS_TITLE)}>
      <div className="tm-players">
        {kids.map((kind) => (
          <PlayerRow key={kind} kind={kind} look={players[kind]} onChange={(look) => onChange({ ...players, [kind]: look })} />
        ))}
      </div>
      <p className="tm-players-note">{t(PLAYERS_NOTE)}</p>
    </SettingsGroup>
  );
}
