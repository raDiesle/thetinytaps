import { useState } from "react";
import { MenuTop } from "@/components/MenuTop";
import { DRAFT_LANGUAGES, lyricsOf, SONG_DRAFTS, SONG_GUIDE } from "@/content/songDrafts";
import { useTitle } from "@/lib/title";
import "@/styles/ideas.css";
import { BackToContents, Contents, goToPlace, useHashPlace } from "./management/Contents";
import { IdeaLink } from "./management/shared";

/** One text to paste into a field of suno.com: its field's name, a button that copies it, and the text as it is. */
function PasteBlock({ field, text }: { field: string; text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () =>
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  return (
    <div className="ideas-song-block">
      <div className="ideas-song-field">
        <strong>{field}</strong>
        <button type="button" className="ideas-copy" onClick={copy}>
          {copied ? "Kopiert ✓" : "📋 Kopieren"}
        </button>
      </div>
      <pre>{text}</pre>
    </div>
  );
}

/**
 * Hidden page for grown-ups, reached from /management/: the songs drafted for the timer (`content/songDrafts.ts`) with
 * their words in each language written so far and every Suno field as a block to copy, above them how to make them and
 * fit them to the timer's lengths – to read in peace and to pick one before a session makes it (user request, 26
 * November 2026). `#<song id>` in the address shows that song.
 */
export function SongsPage() {
  useTitle("Lieder für Suno");
  useHashPlace(goToPlace);

  return (
    <main className="home ideas" lang="de" dir="ltr">
      <MenuTop to="/management/" back="Management" />
      <h1>
        <span aria-hidden>🎶</span> Lieder für Suno
      </h1>
      <p className="home-subtitle">
        Entwürfe für Timer-Lieder, fertig zum Einfügen auf suno.com: jedes Lied mit seinen Worten auf Englisch und Deutsch und je einem Stil-Text für eine
        schnelle und eine ruhige Fassung. In Ruhe lesen, eins wählen, dann in einer neuen Claude-Session mit /musik-erzeugen weitermachen.
      </p>

      <Contents
        groups={[
          { title: "📝 Vorgehen", entries: SONG_GUIDE.map((section) => ({ id: section.id, label: section.title })) },
          {
            title: "🎶 Lieder",
            entries: SONG_DRAFTS.map((song) => ({ id: song.id, label: `${song.emoji} ${song.title}`, note: `${song.names.en} / ${song.names.de}` })),
          },
        ]}
      />

      {SONG_GUIDE.map((section) => (
        <section key={section.id} id={section.id} className="ideas-panel">
          <h2>{section.title}</h2>
          <ul className="ideas-song-points">
            {section.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </section>
      ))}

      {SONG_DRAFTS.map((song) => (
        <section key={song.id} id={song.id} className="ideas-panel">
          <h2>
            {song.emoji} {song.title}
          </h2>
          <p>{song.about}</p>
          <p className="ideas-hint">
            Ideen:{" "}
            {song.ideas.map((id) => (
              <IdeaLink key={id} id={id} />
            ))}{" "}
            · Fassungen: {song.styles.map((style) => `${style.label} (${style.bpm} BPM)${style.recommended ? " ⭐" : ""}`).join(", ")}
          </p>
          <div className="ideas-song-languages">
            {DRAFT_LANGUAGES.map((language) => (
              <div key={language.id} lang={language.id}>
                <h3>{language.label}</h3>
                <PasteBlock field="Title" text={song.names[language.id]} />
                <PasteBlock field="Lyrics" text={lyricsOf(song.words[language.id])} />
                {song.styles.map((style) => (
                  <div key={style.label} className="ideas-song-style">
                    <h4>
                      Fassung {style.label}, {style.bpm} BPM{style.recommended ? " ⭐ zuerst probieren" : ""}
                    </h4>
                    <PasteBlock field="Style of Music" text={`${style.style}, ${language.sungIn}`} />
                    <PasteBlock field="Exclude Styles" text={style.exclude} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      ))}
      <BackToContents />
    </main>
  );
}
