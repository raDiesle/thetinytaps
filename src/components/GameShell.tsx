"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { enterKidMode, exitKidMode } from "@/lib/fullscreen";
import { unlockAudio } from "@/lib/sfx";
import { stopSpeaking, unlockSpeech } from "@/lib/speech";

const EXIT_HOLD_MS = 1000;

interface GameShellProps {
  title: string;
  emoji: string;
  /** Parent-facing options shown on the start screen. */
  settings?: ReactNode;
  /** The game itself; only mounted while playing. */
  children: ReactNode;
}

/**
 * Wraps a game with a parent start screen, fullscreen + keyboard lock while
 * playing, and an exit that toddlers won't trigger by accident: hold the
 * corner button or the Esc key for two seconds.
 */
export function GameShell({ title, emoji, settings, children }: GameShellProps) {
  const [playing, setPlaying] = useState(false);

  const start = async () => {
    // These need the click as a user gesture, so run them before any await.
    unlockAudio();
    unlockSpeech();
    setPlaying(true);
    await enterKidMode();
  };

  const stop = () => {
    stopSpeaking();
    setPlaying(false);
    void exitKidMode();
  };

  useEffect(() => {
    if (!playing) return;
    let escDownAt: number | null = null;

    // Capture phase so this runs before the game's own handlers.
    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.key !== "Escape") return;
      if (!e.repeat) escDownAt = performance.now();
      else if (escDownAt !== null && performance.now() - escDownAt >= EXIT_HOLD_MS) stop();
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Escape") escDownAt = null;
    };
    const block = (e: Event) => e.preventDefault();

    window.addEventListener("keydown", onKeyDown, { capture: true });
    window.addEventListener("keyup", onKeyUp, { capture: true });
    window.addEventListener("contextmenu", block);
    window.addEventListener("beforeunload", block);
    return () => {
      window.removeEventListener("keydown", onKeyDown, { capture: true });
      window.removeEventListener("keyup", onKeyUp, { capture: true });
      window.removeEventListener("contextmenu", block);
      window.removeEventListener("beforeunload", block);
    };
    // `stop` only uses stable setters and module functions.
  }, [playing]);

  if (playing) {
    return (
      <div className="play-area">
        {children}
        <HoldToExit onExit={stop} />
      </div>
    );
  }

  return (
    <main className="start-screen">
      <Link href="/" className="back-link">
        ← Alle Spiele
      </Link>
      <h1>
        <span aria-hidden>{emoji}</span> {title}
      </h1>
      {settings && <section className="settings">{settings}</section>}
      <button className="start-button" onClick={start}>
        Los geht&apos;s!
      </button>
      <p className="hint">
        Zum Beenden die Taste <kbd>Esc</kbd> oder den Knopf oben rechts 1&nbsp;Sekunde gedrückt halten.
      </p>
    </main>
  );
}

function HoldToExit({ onExit }: { onExit: () => void }) {
  const [holding, setHolding] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const begin = (e: PointerEvent) => {
    e.stopPropagation();
    setHolding(true);
    timer.current = setTimeout(onExit, EXIT_HOLD_MS);
  };
  const cancel = () => {
    setHolding(false);
    if (timer.current) clearTimeout(timer.current);
  };

  useEffect(() => cancel, []);

  return (
    <button
      className={`hold-exit${holding ? " holding" : ""}`}
      style={{ "--hold-ms": `${EXIT_HOLD_MS}ms` } as CSSProperties}
      aria-label="Zum Beenden gedrückt halten"
      onPointerDown={begin}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
    >
      ✕
    </button>
  );
}
