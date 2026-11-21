import { useEffect, useState } from "react";
import { VideoChoice, VideoRecorder } from "@/components/VideoRecorder";
import { useAppLanguage, useT } from "@/lib/language";
import { TARGET_LANGUAGES } from "@/content/targetLanguages";
import { type Need, NOTHING_STEPS, picturesFor, POTTY_TEXTS, scenePicture, scenesFor, STEPS, TAPSI, type Went } from "./content";
import { CALL_PICTURE } from "./CallBubble";
import { framesFor, preloadImages } from "./images";
import { PottyPlay, preloadPottySounds } from "./PottyPlay";
import { NOTHING_CHAPTERS, STEP_CHAPTERS } from "./videoChapters";
import { pottyVoice } from "./voice";
import { loadWaitSong, waitLanguageFor, waitLoopSeconds } from "./waitMusic";
import "./potty.css";

/**
 * How many passes of the waiting song Tapsi can sit in a video (idea Y-22): one for the whole story in a few minutes,
 * more for children who sit longer – 3 and 5 are about 5 and 10 minutes of a sitting-only potty song (Y-23).
 */
const PASSES = [1, 2, 3, 5] as const;

/** The steps a video shows: the whole story up to the party, never the week's stars. */
const VIDEO_STEPS = STEPS.slice(
  0,
  STEPS.findIndex((s) => s.id === "stars"),
);

/** Where the waiting ends: the step after sitting, which says what came. */
const DONE = STEPS.findIndex((s) => s.id === "done");
const SIT = STEPS.findIndex((s) => s.id === "sit");

/** What is in the potty: what came, or nothing (the other story, idea Y-24). */
type Came = Need | "nothing";

/** `seconds` as minutes and seconds, „1:47“. */
const minutes = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.round(seconds % 60)).padStart(2, "0")}`;

/**
 * Aufs Töpfchen played for a YouTube video (idea Y-21, November 2026), reached from /management/: the whole story once –
 * eating, the need, calling Mama and Papa, the bathroom, sitting with the waiting song and the thoughts, what came,
 * wiping, flushing, washing, the party – on the shared 16 : 9 stage (`VideoRecorder`) with only the picture (`PottyPlay
 * video`). What a grown-up taps in the game is chosen here before: what Tapsi needs, what is in the potty, and how many
 * passes of the waiting song Tapsi sits; each step goes on by itself once its line is said. „nichts“ in the potty plays
 * the other story (idea Y-24), and „Nur Sitzen“ only the sitting with the song, a potty song to leave running while the
 * child sits on the real potty (Y-23). Each step or, sitting only, each thought is a chapter mark (Y-26). The language
 * follows the shelf.
 */
export function PottyVideo() {
  const language = useAppLanguage();
  const t = useT();
  const texts = t(POTTY_TEXTS);
  const [said, setSaid] = useState<Went>("pipi");
  const [came, setCame] = useState<Came>("pipi");
  const [passes, setPasses] = useState<number>(1);
  /** Only the sitting with the waiting song, a potty song for the real potty (idea Y-23). */
  const [sittingOnly, setSittingOnly] = useState(false);
  const nothing = !sittingOnly && came === "nothing";
  const [song, setSong] = useState(false);
  const [voice, setVoice] = useState(false);

  /** What Tapsi needs also picks what comes, which can still be changed (a child saying „Pipi“ may do kaka). */
  const chooseSaid = (choice: Went) => {
    setSaid(choice);
    setCame(choice === "kaka" ? "kaka" : "pipi");
  };

  // Everything the story plays is fetched while the grown-up reads this page, so nothing comes late in the video: the
  // pictures with their frames, the thoughts that fit, the sounds, the waiting song and every line said.
  useEffect(() => {
    let alive = true;
    setSong(false);
    preloadPottySounds();
    void loadWaitSong(language.id).then(() => alive && setSong(true));
    return () => {
      alive = false;
    };
  }, [language.id]);
  useEffect(() => {
    let alive = true;
    setVoice(false);
    const name = t(TAPSI.name);
    const story = sittingOnly ? [STEPS[SIT]] : nothing ? NOTHING_STEPS : VIDEO_STEPS;
    const lines = story.filter((s) => s.id !== "sit").map((s) => texts.steps[s.id](name, came !== "nothing" && STEPS.indexOf(s) >= DONE ? came : said));
    if (nothing) lines.push(texts.nothing);
    void pottyVoice.ready(lines, language.id).then(() => alive && setVoice(true));
    const pictures = story.flatMap((s) => [...picturesFor(s, s.id === "done" && came !== "nothing" ? came : said), ...(s.moves ?? [])]);
    preloadImages([...pictures, ...scenesFor(said).map(scenePicture)].map((p) => `${TAPSI.pictures}-${p}`).concat(CALL_PICTURE));
    return () => {
      alive = false;
    };
  }, [language.id, said, came, sittingOnly, nothing]);

  const languageName = TARGET_LANGUAGES.find((l) => l.id === language.id)?.label ?? language.id;
  const sung = waitLanguageFor(language.id, [language.id, "de"]);
  const pass = waitLoopSeconds(language.id);
  const kitchen = framesFor(`${TAPSI.pictures}-essen`)[0];

  return (
    <VideoRecorder
      youtube={sittingOnly ? "toepfchen-warten" : nothing ? "toepfchen-nichts" : "toepfchen"}
      title="Aufs Töpfchen fürs Video"
      about="Spielt die ganze Töpfchen-Geschichte einmal durch – Essen, muss mal, Mama und Papa rufen, ins Bad, Sitzen mit dem Warte-Lied und den Gedanken, was kommt, Abwischen, Abziehen, Händewaschen, Party – nur das Bild im Format 16 : 9, ohne Schrittleiste, Knöpfe, Wochensterne oder Pokal. Mit „nichts“ im Töpfchen kommt die zweite Geschichte: „Heute kommt nichts. Macht nichts!“, Händewaschen, Tapsi spielt und Mama und Papa fragen an der Tür noch einmal. „Nur Sitzen“ ist ein Töpfchen-Lied zum Laufenlassen, während das Kind auf dem echten Töpfchen sitzt: Tapsi setzt sich, das Warte-Lied und die Gedanken zu dem, was Tapsi muss, und Schluss nach den Durchläufen. Jeder Schritt geht weiter, wenn seine Zeile gesagt ist; das Sitzen endet nach den gewählten Durchläufen des Lieds, nie mitten in einem Vers. Es zählt nichts: kein Stern, keine Spielzeit. Die Sprache stellt man im Regal um (🌐). Am Ende gibt es Kapitelmarken für die Beschreibung und die Untertitel als .srt."
      facts={[
        ["Sprache", `${languageName}${sung && sung !== language.id ? " (Warte-Lied auf Deutsch)" : ""}`],
        ["Sitzen", pass ? `${passes} × Lied ≈ ${minutes(passes * pass)} Min.` : `${passes} × Lied`],
      ]}
      options={
        <>
          <VideoChoice
            label="Video"
            value={sittingOnly ? "sit" : "story"}
            options={[
              ["story", "📖 Ganze Geschichte"],
              ["sit", "🎵 Nur Sitzen (Töpfchen-Lied)"],
            ]}
            onChange={(choice) => setSittingOnly(choice === "sit")}
          />
          <VideoChoice
            label={sittingOnly ? "Gedanken für" : "Tapsi muss"}
            value={said}
            options={[
              ["pipi", "💧 Pipi"],
              ["kaka", "💩 Kaka"],
              ["both", "💧💩 beides"],
            ]}
            onChange={chooseSaid}
          />
          {!sittingOnly && (
            <VideoChoice
              label="Im Töpfchen"
              value={came}
              options={[
                ["pipi", "✓💧 Pipi"],
                ["kaka", "✓💩 Kaka"],
                ["nothing", "nichts"],
              ]}
              onChange={setCame}
            />
          )}
          <VideoChoice
            label="Sitzen"
            value={passes}
            options={PASSES.map((n) => [n, pass ? `${n} × Lied (${minutes(n * pass)})` : `${n} × Lied`] as const)}
            onChange={setPasses}
          />
        </>
      }
      ready={song && voice}
      loading={`${[!song && "Warte-Lied", !voice && "Stimme"].filter(Boolean).join(", ")} lädt …`}
      fileName={(extension) => `toepfchen-${language.id}-${sittingOnly ? `sitzen-${said}` : `${said}-${came}`}-${passes}x.${extension}`}
      // The kitchen of the first step, so the first frames before the story are not empty.
      stageStyle={kitchen ? { background: `#fbe7b5 url(${kitchen}) center / cover` } : { background: "#fbe7b5" }}
      play={(onFinished, chapter) => (
        <PottyPlay
          video={{
            said,
            came,
            passes,
            sittingOnly,
            onFinished,
            // The story's chapters by its steps; a sitting-only video's by its thoughts, named by their lines.
            onStep: (id) => {
              const title = sittingOnly ? undefined : ((nothing ? NOTHING_CHAPTERS[id] : undefined) ?? STEP_CHAPTERS[id]);
              if (title) chapter(t(title));
            },
            onThought: sittingOnly ? (scene) => chapter(texts.scenes[scene.id]) : undefined,
          }}
        />
      )}
    />
  );
}
