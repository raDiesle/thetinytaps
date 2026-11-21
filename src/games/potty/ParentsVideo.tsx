import { type RefObject, useCallback, useEffect, useRef, useState } from "react";
import { MenuTop } from "@/components/MenuTop";
import { languagePrefix, SEO_LANGUAGES, type SeoLanguage } from "@/content/seo";
import { TARGET_LANGUAGES } from "@/content/targetLanguages";
import { useNoBackgroundMusic } from "@/lib/backgroundMusic";
import { useAppLanguage, useT } from "@/lib/language";
import { unlockAudio } from "@/lib/sfx";
import { canRecord, downloadVideo, type Recording, recordTab, type SavedVideo, useStagePixels, videoExtension } from "@/lib/tabRecording";
import { useTimers } from "@/lib/timers";
import { CALL_PICTURE } from "./CallBubble";
import { picturesFor, scenePicture, scenesFor, STEPS, TAPSI } from "./content";
import { preloadImages } from "./images";
import { END_SLATE_MS, HAND_IN_MS, type HandTarget, PARENTS_SCRIPT, PRESS_MS, sampleWeek, TARGET_SELECTORS } from "./parentsScript";
import { PottyPlay } from "./PottyPlay";
import type { StarLog } from "./stars";
import { pottyVoice } from "./voice";
import { preloadWaitingSong } from "./waitMusic";
import "./potty.css";
import "./parentsVideo.css";

/** Between the recording's start and the story: a still first frame to cut at, and time for the setup card to be gone. */
const LEAD_IN_MS = 600;
/** How often the script looks whether the story has reached the step it waits for. */
const POLL_MS = 100;
/**
 * The tablet's screen in CSS pixels, a common 16 : 10 tablet's: the game is laid out at that size and scaled to the
 * drawn tablet, since it sizes some buttons from the window – laid out in the small drawn screen itself, its ✓ ran off
 * the tablet's edge.
 */
const SCREEN = { width: 1280, height: 800 };

/** What the page shows: the choices before, the story (recorded or only played), or the video made. */
type Phase =
  | { kind: "setup"; note?: string }
  | { kind: "lead" }
  | { kind: "play"; recording: boolean }
  | { kind: "saving" }
  | { kind: "done"; saved?: SavedVideo };

/** Where the hand's fingertip is on the stage, in pixels, and whether it presses. */
interface Hand {
  x: number;
  y: number;
  pressing: boolean;
}

/**
 * Aufs Töpfchen as a video for parents (idea Y-29, user request, November 2026), reached from /management/: the real
 * game on a drawn tablet lying on a table, a grown-up's drawn hand tapping it through after a fixed script
 * (`PARENTS_SCRIPT`) – the story starting at once, what the child said, the song and the thoughts while sitting, the
 * pause, the ✓ of what came, the week's star – with a short line for grown-ups beside the tablet, and a slate with the
 * game's address at the end for YouTube's end screen. Never a real child: only the tablet and the hand. Nothing is kept
 * (`PottyPlay demo`: no star, no trophy, no play time). Recorded in Chrome like Zähne putzen's video (`tabRecording.ts`);
 * the language follows the shelf.
 */
export function ParentsVideo() {
  const language = useAppLanguage();
  const t = useT();
  const [phase, setPhase] = useState<Phase>({ kind: "setup" });
  const [songReady, setSongReady] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const recording = useRef<Recording | null>(null);
  /** The run of the script now going; a new run or Esc makes the old one stop at its next step. */
  const run = useRef(0);
  const pixels = useStagePixels(stage);
  const scale = useScreenScale(screen);
  const { later } = useTimers();
  const [hand, setHand] = useState<Hand | null>(null);
  const [line, setLine] = useState<string | null>(null);
  const [slate, setSlate] = useState(false);
  /** The week the end shows, made anew when the story starts, so the video's star lands on today. */
  const [week, setWeek] = useState<StarLog>({});

  // The video's sound is the game's own (voice, sounds, the waiting song): the app's background song stays out of it.
  useNoBackgroundMusic();

  // Everything the story shows and says is fetched while the grown-up reads this page, so nothing comes late.
  useEffect(() => {
    setSongReady(false);
    let alive = true;
    void preloadWaitingSong(language.id).then(() => alive && setSongReady(true));
    pottyVoice.loadAll(language.id);
    const pictures = STEPS.flatMap((step) => [...picturesFor(step, "pipi"), ...(step.moves ?? [])]);
    const thoughts = scenesFor("pipi").map(scenePicture);
    preloadImages([...[...pictures, ...thoughts].map((p) => `${TAPSI.pictures}-${p}`), CALL_PICTURE]);
    return () => {
      alive = false;
    };
  }, [language.id]);

  const fileName = (type: string) => `toepfchen-fuer-eltern-${language.id}.${videoExtension(type)}`;

  const onSaved = useCallback(
    (blob: Blob, sound: boolean) => {
      recording.current = null;
      const saved = { url: URL.createObjectURL(blob), name: fileName(blob.type), bytes: blob.size, sound };
      downloadVideo(saved);
      setPhase({ kind: "done", saved });
    },
    [language.id],
  );

  // The old video's file is let go when a new one is made or the page is left.
  const savedUrl = phase.kind === "done" ? phase.saved?.url : undefined;
  useEffect(() => (savedUrl ? () => URL.revokeObjectURL(savedUrl) : undefined), [savedUrl]);

  /** The slate has stood long enough: the recording ends and is saved, or the playing simply stops. */
  const finish = useCallback(() => {
    run.current++;
    if (recording.current) {
      setPhase({ kind: "saving" });
      recording.current.stop();
    } else setPhase({ kind: "done" });
  }, []);

  // The script: beat by beat it waits for its step, shows its line, and brings the hand to tap at the end of its wait.
  useEffect(() => {
    if (phase.kind !== "play") return;
    const id = ++run.current;
    setLine(null);
    setSlate(false);
    const sleep = (ms: number) => new Promise<void>((resolve) => later(resolve, ms));
    const going = () => run.current === id;
    const root = () => screen.current?.querySelector<HTMLElement>(".potty-play") ?? null;
    /** The hand below the picture again, where it came from: straight down from where it tapped. */
    const away = (x: number) => setHand({ x, y: (stage.current?.clientHeight ?? 0) + 40, pressing: false });

    const tap = async (target: HandTarget) => {
      const button = root()?.querySelector<HTMLElement>(TARGET_SELECTORS[target]);
      const box = stage.current?.getBoundingClientRect();
      const game = root()?.getBoundingClientRect();
      if (!button || !box || !game) return;
      const at = button.getBoundingClientRect();
      const x = at.left + at.width / 2;
      const y = at.top + at.height * 0.55;
      setHand({ x: x - box.left, y: y - box.top, pressing: false });
      await sleep(HAND_IN_MS);
      if (!going()) return;
      setHand({ x: x - box.left, y: y - box.top, pressing: true });
      button.classList.add("pt-pressed");
      await sleep(PRESS_MS);
      if (!going()) return;
      // The game's own answer to the finger: its glow lies in the game's box, so the point is given in it.
      button.dispatchEvent(
        new PointerEvent("pointerdown", {
          bubbles: true,
          cancelable: true,
          pointerType: "touch",
          isPrimary: true,
          clientX: (x - game.left) / (game.width / SCREEN.width),
          clientY: (y - game.top) / (game.height / SCREEN.height),
        }),
      );
      button.classList.remove("pt-pressed");
      away(x - box.left);
    };

    // The hand waits below the picture, so it comes up into it for its first tap.
    away((stage.current?.clientWidth ?? 0) / 2);
    void (async () => {
      for (const beat of PARENTS_SCRIPT) {
        while (going() && !root()?.classList.contains(`pt-at-${beat.at}`)) await sleep(POLL_MS);
        if (!going()) return;
        if (beat.line) setLine(t(beat.line));
        if (!beat.tap) {
          await sleep(beat.wait);
          continue;
        }
        await sleep(Math.max(0, beat.wait - HAND_IN_MS - PRESS_MS));
        if (!going()) return;
        await tap(beat.tap);
      }
      if (!going()) return;
      setLine(null);
      setSlate(true);
      await sleep(END_SLATE_MS);
      if (going()) finish();
    })();
  }, [phase.kind]);

  const start = (recorded: boolean) => {
    setWeek(sampleWeek(new Date()));
    setPhase({ kind: "lead" });
    later(() => setPhase({ kind: "play", recording: recorded }), LEAD_IN_MS);
  };

  const record = async () => {
    unlockAudio();
    const element = stage.current;
    if (!element) return;
    try {
      // The setup card goes first: the stage is recorded with whatever lies over it.
      setPhase({ kind: "lead" });
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      recording.current = await recordTab(element, onSaved);
      start(true);
    } catch {
      // The grown-up said no to sharing the tab, or the browser can't.
      recording.current = null;
      setPhase({ kind: "setup", note: "Keine Aufnahme: Das Teilen des Tabs wurde abgebrochen oder ist hier nicht möglich." });
    }
  };

  const playOnly = () => {
    unlockAudio();
    void document.documentElement.requestFullscreen?.().catch(() => undefined);
    start(false);
  };

  // Esc ends a recording early (keeping what is there) or stops the playing.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || (phase.kind !== "play" && phase.kind !== "lead")) return;
      if (recording.current) finish();
      else {
        run.current++;
        setPhase({ kind: "setup" });
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [phase.kind, finish]);

  // Left in the middle: the capture ends with the page.
  useEffect(
    () => () => {
      run.current++;
      recording.current?.stop();
    },
    [],
  );

  const languageName = TARGET_LANGUAGES.find((l) => l.id === language.id)?.label ?? language.id;
  const running = phase.kind === "lead" || phase.kind === "play" || phase.kind === "saving";
  const sharp = pixels && pixels.height >= 1080;
  // The game's page in the video's language, English where that language has no pages for search engines.
  const pageLanguage: SeoLanguage = SEO_LANGUAGES.find((l) => l === language.id) ?? "en";
  const address = `funforboth.com${languagePrefix(pageLanguage)}/toepfchen/`;

  return (
    <div className={`pv${running ? " running" : ""}`}>
      <div className="pv-stage" ref={stage}>
        <div className="pv-tablet">
          <div className="pv-screen" ref={screen}>
            <div className="pv-device" style={{ width: SCREEN.width, height: SCREEN.height, transform: `scale(${scale})` }}>
              {phase.kind === "play" && <PottyPlay demo={{ stars: week }} />}
            </div>
          </div>
        </div>
        {/* A click of the one recording reaches nothing: only the drawn hand taps the game. */}
        <div className="pv-shield" />
        {line && (
          <p key={line} className="pv-line">
            {line}
          </p>
        )}
        {hand && <ParentHand {...hand} />}
        {slate && (
          <div className="pv-slate">
            <p className="pv-slate-name">Fun for Both</p>
            <p className="pv-slate-address">{address}</p>
          </div>
        )}
      </div>

      {phase.kind === "setup" && (
        <div className="pv-card">
          <MenuTop to="/management/" back="Management" />
          <h1>Aufs Töpfchen: Video für Eltern</h1>
          <p>
            Das echte Spiel auf einem Tablet, eine gezeichnete Hand tippt es durch: die Geschichte startet sofort, „Was muss dein Kind?“, das Lied und die
            Gedanken beim Sitzen, die Pause, das ✓ und der Stern der Woche – daneben kurze Zeilen für Eltern, am Ende {END_SLATE_MS / 1000} s Name und Adresse
            für den Abspann von YouTube. Etwa anderthalb Minuten. Kein echtes Kind im Bild, und es zählt nichts: kein Stern, keine Spielzeit.
          </p>
          <dl className="pv-facts">
            <dt>Sprache</dt>
            <dd>
              {languageName}
              {language.id !== "en" && " (die Zeilen für Eltern gibt es bisher nur auf Englisch)"}
            </dd>
            <dt>Video</dt>
            <dd className={sharp ? undefined : "pv-warn"}>
              {pixels ? `${pixels.width} × ${pixels.height} Pixel` : "…"}
              {pixels && !sharp && " – für 1080p das Fenster größer ziehen"}
            </dd>
            <dt>Lied</dt>
            <dd>{songReady ? "geladen" : "lädt …"}</dd>
            <dt>Adresse</dt>
            <dd>{address}</dd>
          </dl>
          <p className="pv-small">
            Die Sprache stellt man im Regal um (🌐). Bei YouTube als „nicht speziell für Kinder“ hochladen, dann gehen Link und Abspann.
          </p>
          {phase.note && <p className="pv-warn">{phase.note}</p>}
          <div className="pv-actions">
            {canRecord() && (
              <button type="button" className="pv-go" disabled={!songReady} onClick={() => void record()}>
                🎬 Aufnehmen
              </button>
            )}
            <button type="button" disabled={!songReady} onClick={playOnly}>
              ▶ Nur abspielen
            </button>
          </div>
          <p className="pv-small">
            {canRecord()
              ? "🎬 Der Browser fragt, ob er diesen Tab teilen darf: „Tab-Audio teilen“ angehakt lassen. Aufgenommen wird nur das Bild; am Ende speichert er das Video in den Downloads. "
              : "Dieser Browser kann den Tab nicht selbst aufnehmen (das kann Chrome). "}
            ▶ spielt im Vollbild, für ein eigenes Aufnahmeprogramm. Esc bricht ab.
          </p>
        </div>
      )}

      {phase.kind === "saving" && <p className="pv-card pv-small">Video wird gespeichert …</p>}

      {phase.kind === "done" && (
        <div className="pv-card">
          <MenuTop to="/management/" back="Management" />
          {phase.saved ? (
            <>
              <h1>Video gespeichert</h1>
              <p>
                {phase.saved.name} ({(phase.saved.bytes / 1e6).toFixed(0)} MB) liegt in den Downloads.
              </p>
              {!phase.saved.sound && <p className="pv-warn">Ohne Ton aufgenommen: beim Teilen „Tab-Audio teilen“ anhaken.</p>}
              {/* biome-ignore lint/a11y/useMediaCaption: the lines for grown-ups stand in the picture itself. */}
              <video className="pv-preview" src={phase.saved.url} controls />
            </>
          ) : (
            <h1>Fertig</h1>
          )}
          <div className="pv-actions">
            {phase.saved && (
              <button type="button" onClick={() => phase.saved && downloadVideo(phase.saved)}>
                Nochmal speichern
              </button>
            )}
            <button type="button" className="pv-go" onClick={() => setPhase({ kind: "setup" })}>
              Neue Aufnahme
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** How much the tablet's screen of `SCREEN` size is scaled to fill the drawn screen `box`. */
function useScreenScale(box: RefObject<HTMLDivElement | null>) {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const element = box.current;
    if (!element) return;
    const measure = () => setScale(element.clientWidth / SCREEN.width);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [box]);
  return scale;
}

/**
 * A grown-up's hand pointing with its index finger, coming up from below the picture in a sleeve, its fingertip at
 * (`x`, `y`) on the stage: an HTML layer moved by a transform. Drawn like the `TapHint`'s child's hand (one dark line
 * round fills melting into one shape), but long-fingered and with a forearm – a grown-up's, never a child's.
 */
function ParentHand({ x, y, pressing }: Hand) {
  const parts = (
    <>
      <rect x="39" y="4" width="26" height="124" rx="13" />
      <rect x="24" y="98" width="84" height="112" rx="32" />
      <rect x="62" y="100" width="42" height="27" rx="13.5" />
      <rect x="66" y="124" width="42" height="27" rx="13.5" />
      <rect x="64" y="148" width="38" height="25" rx="12.5" />
      <rect x="8" y="112" width="26" height="70" rx="13" transform="rotate(-24 21 147)" />
      <rect x="32" y="190" width="70" height="120" rx="22" />
    </>
  );
  return (
    <>
      <div className={`pv-touch${pressing ? " on" : ""}`} style={{ transform: `translate(${x}px, ${y}px)` }} aria-hidden />
      <div className="pv-hand" style={{ transform: `translate(${x}px, ${y}px)` }} aria-hidden>
        <div className={`pv-hand-press${pressing ? " pressing" : ""}`}>
          <svg viewBox="0 0 130 440" className="pv-hand-svg">
            <g fill="#5c3d4e" stroke="#5c3d4e" strokeWidth="7" strokeLinejoin="round">
              {parts}
              <rect x="22" y="262" width="90" height="180" rx="16" />
            </g>
            <g fill="#f0c4a2">{parts}</g>
            <rect x="44" y="9" width="16" height="17" rx="7" fill="#fbe2d2" />
            <path
              d="M45 76 q7 4 14 0 M45 102 q7 4 14 0 M82 113 h12 M86 137 h12 M84 160 h10"
              fill="none"
              stroke="#c98d6c"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* The sleeve: a soft knitted jumper with a ribbed cuff. */}
            <rect x="22" y="262" width="90" height="180" rx="16" fill="#6f86b8" />
            <rect x="22" y="262" width="90" height="26" rx="12" fill="#5d74a6" />
            <path d="M34 266 v18 M46 266 v18 M58 266 v18 M70 266 v18 M82 266 v18 M94 266 v18" stroke="#4f6593" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </>
  );
}
