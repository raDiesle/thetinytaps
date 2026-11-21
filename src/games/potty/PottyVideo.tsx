import { useEffect, useState } from "react";
import { VideoChoice, VideoRecorder } from "@/components/VideoRecorder";
import { useAppLanguage, useT } from "@/lib/language";
import { TARGET_LANGUAGES } from "@/content/targetLanguages";
import { type Need, picturesFor, POTTY_TEXTS, scenePicture, scenesFor, STEPS, TAPSI, type Went } from "./content";
import { CALL_PICTURE } from "./CallBubble";
import { framesFor, preloadImages } from "./images";
import { PottyPlay, preloadPottySounds } from "./PottyPlay";
import { pottyVoice } from "./voice";
import { loadWaitSong, waitLanguageFor, waitLoopSeconds } from "./waitMusic";
import "./potty.css";

/** How many passes of the waiting song Tapsi can sit in a video (idea Y-22): one for the whole story in a few minutes, more for children who sit longer. */
const PASSES = [1, 2, 3] as const;

/** The steps a video shows: the whole story up to the party, never the week's stars. */
const VIDEO_STEPS = STEPS.slice(
  0,
  STEPS.findIndex((s) => s.id === "stars"),
);

/** `seconds` as minutes and seconds, „1:47“. */
const minutes = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.round(seconds % 60)).padStart(2, "0")}`;

/**
 * Aufs Töpfchen played for a YouTube video (idea Y-21, November 2026), reached from /management/: the whole story once –
 * eating, the need, calling Mama and Papa, the bathroom, sitting with the waiting song and the thoughts, what came,
 * wiping, flushing, washing, the party – on the shared 16 : 9 stage (`VideoRecorder`) with only the picture (`PottyPlay
 * video`). What a grown-up taps in the game is chosen here before: what Tapsi needs, what is in the potty, and how many
 * passes of the waiting song Tapsi sits; each step goes on by itself once its line is said. The language follows the shelf.
 */
export function PottyVideo() {
  const language = useAppLanguage();
  const t = useT();
  const texts = t(POTTY_TEXTS);
  const [said, setSaid] = useState<Went>("pipi");
  const [came, setCame] = useState<Need>("pipi");
  const [passes, setPasses] = useState<number>(1);
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
    const lines = VIDEO_STEPS.filter((s) => s.id !== "sit").map((s, i) => texts.steps[s.id](name, i < STEPS.findIndex((x) => x.id === "done") ? said : came));
    void pottyVoice.ready(lines, language.id).then(() => alive && setVoice(true));
    const pictures = VIDEO_STEPS.flatMap((s) => [...picturesFor(s, s.id === "done" ? came : said), ...(s.moves ?? [])]);
    preloadImages([...pictures, ...scenesFor(said).map(scenePicture)].map((p) => `${TAPSI.pictures}-${p}`).concat(CALL_PICTURE));
    return () => {
      alive = false;
    };
  }, [language.id, said, came]);

  const languageName = TARGET_LANGUAGES.find((l) => l.id === language.id)?.label ?? language.id;
  const sung = waitLanguageFor(language.id, [language.id, "de"]);
  const pass = waitLoopSeconds(language.id);
  const kitchen = framesFor(`${TAPSI.pictures}-essen`)[0];

  return (
    <VideoRecorder
      youtube="toepfchen"
      title="Aufs Töpfchen fürs Video"
      about="Spielt die ganze Töpfchen-Geschichte einmal durch – Essen, muss mal, Mama und Papa rufen, ins Bad, Sitzen mit dem Warte-Lied und den Gedanken, was kommt, Abwischen, Abziehen, Händewaschen, Party – nur das Bild im Format 16 : 9, ohne Schrittleiste, Knöpfe, Wochensterne oder Pokal. Jeder Schritt geht weiter, wenn seine Zeile gesagt ist; das Sitzen endet nach den gewählten Durchläufen des Lieds, nie mitten in einem Vers. Es zählt nichts: kein Stern, keine Spielzeit. Die Sprache stellt man im Regal um (🌐)."
      facts={[
        ["Sprache", `${languageName}${sung && sung !== language.id ? " (Warte-Lied auf Deutsch)" : ""}`],
        ["Sitzen", pass ? `${passes} × Lied ≈ ${minutes(passes * pass)} Min.` : `${passes} × Lied`],
      ]}
      options={
        <>
          <VideoChoice
            label="Tapsi muss"
            value={said}
            options={[
              ["pipi", "💧 Pipi"],
              ["kaka", "💩 Kaka"],
              ["both", "💧💩 beides"],
            ]}
            onChange={chooseSaid}
          />
          <VideoChoice
            label="Im Töpfchen"
            value={came}
            options={[
              ["pipi", "✓💧 Pipi"],
              ["kaka", "✓💩 Kaka"],
            ]}
            onChange={setCame}
          />
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
      fileName={(extension) => `toepfchen-${language.id}-${said}-${came}-${passes}x.${extension}`}
      // The kitchen of the first step, so the first frames before the story are not empty.
      stageStyle={kitchen ? { background: `#fbe7b5 url(${kitchen}) center / cover` } : { background: "#fbe7b5" }}
      play={(onFinished) => <PottyPlay video={{ said, came, passes, onFinished }} />}
    />
  );
}
