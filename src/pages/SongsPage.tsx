import { useState } from "react";
import { MenuTop } from "@/components/MenuTop";
import { DRAFT_LANGUAGES, lyricsOf, SONG_DRAFTS, SONG_GUIDE, type SongDraft, type SongStyle } from "@/content/songDrafts";
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

/** The fields of one way to play a song, in one language. */
function StyleBlocks({ style, sungIn }: { style: SongStyle; sungIn: string }) {
  return (
    <>
      <PasteBlock field="Style of Music" text={`${style.style}, ${sungIn}`} />
      <PasteBlock field="Exclude Styles" text={style.exclude} />
    </>
  );
}

/**
 * A song with its words and Suno fields side by side per language. A way of playing it that is put aside stays
 * folded, with why, so it is still there to read but not made by mistake.
 */
function SongPanel({ song }: { song: SongDraft }) {
  const styles = song.styles.filter((style) => !style.postponed);
  const later = song.styles.filter((style) => style.postponed);
  return (
    <section id={song.id} className="ideas-panel">
      <h2>
        {song.emoji} {song.title}
      </h2>
      {song.postponed && <p className="ideas-song-postponed">🅿️ {song.postponed}</p>}
      <p>{song.about}</p>
      <p className="ideas-hint">
        Ideen:{" "}
        {song.ideas.map((id) => (
          <IdeaLink key={id} id={id} />
        ))}{" "}
        · Fassung: {styles.map((style) => `${style.label} (${style.bpm} BPM)`).join(", ")}
        {later.length > 0 && ` · zurückgestellt: ${later.map((style) => style.label).join(", ")}`}
      </p>
      <div className="ideas-song-languages">
        {DRAFT_LANGUAGES.map((language) => (
          <div key={language.id} lang={language.id}>
            <h3>{language.label}</h3>
            <PasteBlock field="Title" text={song.names[language.id]} />
            <PasteBlock field="Lyrics" text={lyricsOf(song.words[language.id])} />
            {styles.map((style) => (
              <div key={style.label} className="ideas-song-style">
                <h4>
                  Fassung {style.label}, {style.bpm} BPM
                </h4>
                <StyleBlocks style={style} sungIn={language.sungIn} />
              </div>
            ))}
            {later.map((style) => (
              <details key={style.label} className="ideas-song-style">
                <summary>
                  🅿️ Fassung {style.label}, {style.bpm} BPM – zurückgestellt
                </summary>
                <p className="ideas-hint">{style.postponed}</p>
                <StyleBlocks style={style} sungIn={language.sungIn} />
              </details>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Hidden page for grown-ups, reached from /management/: the songs drafted for the timer (`content/songDrafts.ts`) with
 * their words in each language written so far and every Suno field as a block to copy, above them how to make them and
 * fit them to the timer's lengths, and the songs put aside folded below – to read in peace and to pick one before a session makes it (user request, 26
 * November 2026). `#<song id>` in the address shows that song.
 */
export function SongsPage() {
  useTitle("Lieder für Suno");
  useHashPlace(goToPlace);
  const songs = SONG_DRAFTS.filter((song) => !song.postponed);
  const postponed = SONG_DRAFTS.filter((song) => song.postponed);

  return (
    <main className="home ideas" lang="de" dir="ltr">
      <MenuTop to="/management/" back="Management" />
      <h1>
        <span aria-hidden>🎶</span> Lieder für Suno
      </h1>
      <p className="home-subtitle">
        Entwürfe für Timer-Lieder, fertig zum Einfügen auf suno.com: das schnelle Aufräumlied und das allgemeine Countdown-Lied, jedes mit seinen Worten auf
        Englisch und Deutsch. Die ruhigen Fassungen sind zurückgestellt und stehen eingeklappt dabei. In Ruhe lesen, dann in einer neuen Claude-Session mit
        /musik-erzeugen weitermachen.
      </p>

      <Contents
        groups={[
          { title: "📝 Vorgehen", entries: SONG_GUIDE.map((section) => ({ id: section.id, label: section.title })) },
          {
            title: "🎶 Lieder",
            entries: songs.map((song) => ({ id: song.id, label: `${song.emoji} ${song.title}`, note: `${song.names.en} / ${song.names.de}` })),
          },
          {
            title: "🅿️ Zurückgestellt",
            entries: postponed.map((song) => ({ id: song.id, label: `${song.emoji} ${song.title}`, note: "eingeklappt" })),
          },
        ].filter((group) => group.entries.length > 0)}
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

      {songs.map((song) => (
        <SongPanel key={song.id} song={song} />
      ))}

      {postponed.length > 0 && (
        <details className="ideas-panel">
          <summary>
            <h2>🅿️ Zurückgestellt ({postponed.length})</h2>
          </summary>
          <p className="ideas-hint">Nicht abgelehnt, nur später: Diese Lieder werden nicht mit den anderen gemacht.</p>
          {postponed.map((song) => (
            <SongPanel key={song.id} song={song} />
          ))}
        </details>
      )}
      <BackToContents />
    </main>
  );
}
