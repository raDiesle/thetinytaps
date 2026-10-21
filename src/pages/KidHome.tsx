import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { GameShell, KID_STATE } from "@/components/GameShell";
import { SettingsGroup, Toggle } from "@/components/SettingControls";
import { de } from "@/content/de";
import { SCENES } from "@/games/scenes";
import { playPop } from "@/lib/sfx";
import { speak } from "@/lib/speech";
import { useStoredSettings } from "@/lib/storage";
import { useTitle } from "@/lib/title";

interface KidTile {
  id: string;
  href: string;
  emoji: string;
  /** Spoken when tapped, and the label for screen readers. */
  title: string;
}

const TILES: KidTile[] = [
  { id: "buchstaben", href: "/buchstaben/", emoji: "🔤", title: "Buchstaben und Zahlen" },
  { id: "woerter", href: "/woerter/", emoji: "✍️", title: "Wörter tippen" },
  ...SCENES.map((s) => ({ id: `bild-${s.id}`, href: `/bilder/${s.id}/`, emoji: s.emoji, title: s.title })),
];

const KID_HOME_SETTINGS_KEY = "tt-kid-home";

/** Tile ids the grown-up has hidden. */
const DEFAULT_KID_HOME_SETTINGS: { hidden: string[] } = { hidden: [] };

/** Time for the spoken name before the game opens. */
const OPEN_DELAY_MS = 700;

/**
 * Child-friendly home page (idea A-04): big pictures only, in fullscreen. The
 * child picks a game, which starts right away with the grown-up's saved
 * options; holding ✕ in a game comes back here.
 */
export function KidHome() {
  useTitle("Kinder-Startseite");
  const navigate = useNavigate();
  const [settings, update] = useStoredSettings(KID_HOME_SETTINGS_KEY, DEFAULT_KID_HOME_SETTINGS);
  const shown = TILES.filter((t) => !settings.hidden.includes(t.id));
  const [opening, setOpening] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mashing taps opens only the first picked game.
  const open = (tile: KidTile) => {
    if (timer.current) return;
    setOpening(tile.id);
    playPop();
    speak(tile.title, de.speechLang);
    timer.current = setTimeout(() => navigate(tile.href, { state: KID_STATE }), OPEN_DELAY_MS);
  };

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  return (
    <GameShell
      title="Kinder-Startseite"
      emoji="🧸"
      kidHome
      settings={
        <SettingsGroup title="Diese Spiele zeigen">
          {TILES.map((t) => (
            <Toggle
              key={t.id}
              label={`${t.emoji} ${t.title}`}
              checked={!settings.hidden.includes(t.id)}
              onChange={(on) =>
                update({ hidden: on ? settings.hidden.filter((id) => id !== t.id) : [...settings.hidden, t.id] })
              }
            />
          ))}
          <p className="setting-note">Jedes Spiel startet mit den Einstellungen, die zuletzt auf seiner eigenen Startseite gewählt wurden.</p>
        </SettingsGroup>
      }
    >
      <div className="kid-home">
        <ul className="kid-tiles">
          {(shown.length ? shown : TILES).map((t) => (
            <li key={t.id}>
              <button
                type="button"
                className={`kid-tile${opening === t.id ? " opening" : ""}`}
                aria-label={t.title}
                onClick={() => open(t)}
              >
                {t.emoji}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </GameShell>
  );
}
