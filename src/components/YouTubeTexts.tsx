import { useState } from "react";
import { useAppLanguage } from "@/lib/language";
import { TITLE_LIMIT, YOUTUBE_VIDEOS, type YouTubeVideoId, youtubeText } from "@/video/youtubeTexts";

/** A button that copies a text and says so for a moment. */
export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() =>
        void navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        })
      }
    >
      {copied ? "Kopiert ✓" : "📋 Kopieren"}
    </button>
  );
}

/**
 * What goes into YouTube Studio for this video (Y-18), folded under the video page's card: title and description in the
 * app language (🌐 on the shelf), each to copy, and whether to set it as „made for kids“.
 */
export function YouTubeTexts({ video }: { video: YouTubeVideoId }) {
  const language = useAppLanguage().id;
  const { title, description, language: written } = youtubeText(video, language);
  const { forKids, song } = YOUTUBE_VIDEOS[video];
  return (
    <details className="video-rec-youtube">
      <summary>📝 Text für YouTube</summary>
      <p className="video-rec-small">
        {forKids
          ? "In YouTube Studio „Ja, speziell für Kinder“ wählen: dann gibt es weder Kommentare noch Abspann-Links, die Adresse steht in der Beschreibung und im Abspann."
          : "„Nein, nicht speziell für Kinder“: Abspann-Links und Infokarten auf die Seite sind erlaubt."}
        {song && " Das Lied ist mit Suno gemacht: bei „Veränderte oder synthetische Inhalte“ „Ja“ wählen."}
        {written !== language && ` Die Texte für Suchmaschinen gibt es in dieser Sprache nicht, die Beschreibung ist deshalb in „${written}“.`}
      </p>
      <h2>
        Titel{" "}
        <small>
          ({title.length} von höchstens {TITLE_LIMIT} Zeichen)
        </small>{" "}
        <CopyButton text={title} />
      </h2>
      <p>{title}</p>
      <h2>
        Beschreibung <CopyButton text={description} />
      </h2>
      <pre>{description}</pre>
    </details>
  );
}
