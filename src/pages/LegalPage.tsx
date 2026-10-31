import type { ReactNode } from "react";
import { Link } from "react-router";
import { MenuTop } from "@/components/MenuTop";
import { OPERATOR, PRIVACY_UPDATED } from "@/content/legal";
import { useTitle } from "@/lib/title";
import "@/styles/legal.css";

// Impressum and Datenschutzerklärung, for grown-ups, linked below the home page's first screen. German only,
// as German law asks for them. The Datenschutzerklärung must say what the site really does: whoever adds a
// service, a tracker or a device feature (camera, microphone) changes it in the same commit.

/** A value of OPERATOR, or a marked gap while the site's owner has not filled it in. */
function Field({ value, missing }: { value: string; missing: string }) {
  return value ? value : <span className="legal-missing">[{missing}]</span>;
}

/** Name and postal address of the person responsible. */
function Operator() {
  return (
    <address>
      <Field value={OPERATOR.name} missing="Vor- und Nachname" />
      <br />
      <Field value={OPERATOR.street} missing="Straße und Hausnummer" />
      <br />
      <Field value={OPERATOR.city} missing="PLZ und Ort" />
    </address>
  );
}

/** The e-mail address as a link. */
function Email() {
  return OPERATOR.email ? <a href={`mailto:${OPERATOR.email}`}>{OPERATOR.email}</a> : <Field value="" missing="E-Mail-Adresse" />;
}

/** A link to another site, opened in a new tab. */
function Out({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

/** The frame both pages share: the way back, the title and the text in panels. */
function LegalPage({ title, emoji, children }: { title: string; emoji: string; children: ReactNode }) {
  useTitle(title);
  return (
    <main className="home legal">
      <MenuTop to="/" back="Alle Spiele" />
      <h1>
        <span aria-hidden>{emoji}</span> {title}
      </h1>
      {children}
    </main>
  );
}

/** /impressum/: who runs the site (§ 5 DDG, § 18 Abs. 2 MStV). */
export function ImprintPage() {
  return (
    <LegalPage title="Impressum" emoji="📇">
      <section className="legal-panel">
        <h2>Angaben gemäß § 5 DDG</h2>
        <Operator />
      </section>
      <section className="legal-panel">
        <h2>Kontakt</h2>
        <p>
          E-Mail: <Email />
        </p>
      </section>
      <section className="legal-panel">
        <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
        <Operator />
      </section>
      <section className="legal-panel">
        <h2>Datenschutz</h2>
        <p>
          Was beim Besuch dieser Seite mit Daten geschieht, steht in der <Link to="/datenschutz/">Datenschutzerklärung</Link>.
        </p>
      </section>
    </LegalPage>
  );
}

/** /datenschutz/: what the site stores and sends, and to whom (Art. 13 DSGVO). */
export function PrivacyPage() {
  return (
    <LegalPage title="Datenschutz" emoji="🔒">
      <section className="legal-panel">
        <h2>Kurz gesagt</h2>
        <p>
          Books for Both braucht kein Konto, setzt keine Cookies und zeigt keine Werbung. Was Ihr Kind spielt und was Sie einstellen, bleibt auf Ihrem Gerät.
          Beim Aufruf der Seite sieht der Anbieter, der sie ausliefert (GitHub), technisch nötige Daten wie Ihre IP-Adresse, und wir zählen die Besuche mit
          Cloudflare Web Analytics, ohne Cookies.
        </p>
      </section>

      <section className="legal-panel">
        <h2>Verantwortlich</h2>
        <Operator />
        <p>
          E-Mail: <Email />
        </p>
      </section>

      <section className="legal-panel">
        <h2>Auslieferung der Seite (GitHub Pages)</h2>
        <p>
          Die Seite liegt bei GitHub Pages, einem Dienst der GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA. Wenn Sie die Seite
          aufrufen, verarbeitet GitHub dabei Ihre IP-Adresse, die Uhrzeit, die aufgerufene Adresse und Angaben zu Ihrem Browser, um die Seite auszuliefern und
          vor Angriffen zu schützen. Rechtsgrundlage ist unser berechtigtes Interesse, die Seite sicher anzubieten (Art. 6 Abs. 1 lit. f DSGVO).
        </p>
        <p>
          GitHub ist nach dem EU-US Data Privacy Framework zertifiziert; für die Übermittlung in die USA gilt damit der Angemessenheitsbeschluss der
          EU-Kommission (Art. 45 DSGVO). Mehr dazu in der{" "}
          <Out href="https://docs.github.com/de/site-policy/privacy-policies/github-general-privacy-statement">Datenschutzerklärung von GitHub</Out>.
        </p>
        <p>
          Die Domain booksforboth.com ist bei der Cloudflare, Inc. registriert, deren Namensserver Ihrem Browser sagen, wo die Seite liegt. Die Seite selbst
          läuft nicht über Cloudflare. Wer eine frühere Adresse (toddlerfox.com) oder funforboth.com aufruft, wird von Cloudflare zu booksforboth.com
          weitergeleitet; dafür verarbeitet Cloudflare kurz Ihre IP-Adresse und die aufgerufene Adresse.
        </p>
      </section>

      <section className="legal-panel">
        <h2>Besuche zählen (Cloudflare Web Analytics)</h2>
        <p>
          Um zu sehen, wie viele Menschen die Seite besuchen und welche Spiele gespielt werden, nutzen wir Cloudflare Web Analytics der Cloudflare, Inc., 101
          Townsend St, San Francisco, CA 94107, USA. Ein kleines Skript meldet dabei, welche Seite aufgerufen wurde, von welcher Seite Sie kamen, Browser,
          Betriebssystem und Gerätetyp, wie schnell die Seite lud, und das Land, das Cloudflare aus Ihrer IP-Adresse ableitet.
        </p>
        <p>
          Cloudflare Web Analytics setzt keine Cookies, speichert nichts auf Ihrem Gerät und verfolgt Sie nicht über andere Seiten hinweg. Wir sehen nur
          zusammengefasste Zahlen, keine einzelnen Besucher. Rechtsgrundlage ist unser berechtigtes Interesse, die Seite zu verbessern (Art. 6 Abs. 1 lit. f
          DSGVO). Sie können widersprechen, indem Sie das Skript mit einem Inhaltsblocker sperren oder uns schreiben.
        </p>
        <p>
          Cloudflare ist nach dem EU-US Data Privacy Framework zertifiziert (Art. 45 DSGVO). Mehr dazu in der{" "}
          <Out href="https://www.cloudflare.com/de-de/privacypolicy/">Datenschutzerklärung von Cloudflare</Out>.
        </p>
      </section>

      <section className="legal-panel">
        <h2>Was auf Ihrem Gerät gespeichert wird</h2>
        <p>
          Damit die Spiele sich merken, was Sie gewählt haben, speichert die Seite im Speicher Ihres Browsers (Local Storage): Sprache, Musik an oder aus, Junge
          oder Mädchen, die Spielzeit des Tages, die Sterne der Belohnungstafel, den Tagesplan und was Sie dort eintippen, etwa Namen von Aufgaben. Damit die
          Spiele auch ohne Internet laufen, legt die Seite eine Kopie ihrer Dateien in den Speicher des Browsers (Service Worker).
        </p>
        <p>
          Das alles bleibt auf Ihrem Gerät und wird nicht an uns oder andere übertragen. Sie können es jederzeit löschen, indem Sie in Ihrem Browser die
          Website-Daten von booksforboth.com löschen. Rechtsgrundlage ist § 25 Abs. 2 Nr. 2 TDDDG: Das Speichern ist nötig, damit die Spiele so funktionieren,
          wie Sie es gewählt haben.
        </p>
      </section>

      <section className="legal-panel">
        <h2>Mikrofon (Laut und leise)</h2>
        <p>
          Das Spiel „Laut und leise“ fragt nach dem Mikrofon, damit ein Löwe brüllt, wenn Ihr Kind laut ist. Es misst dabei nur, wie laut es gerade ist. Der Ton
          wird nicht aufgenommen, nicht gespeichert und nicht übertragen. Ohne Ihre Erlaubnis im Browser bleibt das Mikrofon aus.
        </p>
      </section>

      <section className="legal-panel">
        <h2>Sprachausgabe des Browsers</h2>
        <p>
          Wo für einen Satz noch keine Aufnahme da ist, lassen manche Spiele ihn von der Sprachausgabe Ihres Browsers vorlesen. Je nach Browser (etwa Chrome mit
          den Google-Stimmen) schickt der Browser den Satz dafür an seinen Anbieter. Das sind feste Sätze aus dem Spiel, keine Angaben über Sie oder Ihr Kind.
        </p>
      </section>

      <section className="legal-panel">
        <h2>Kinder</h2>
        <p>Die Spiele sind für kleine Kinder gemacht. Sie fragen keine Namen ab, haben keine Konten und keine Chats und senden nichts über Ihr Kind an uns.</p>
      </section>

      <section className="legal-panel">
        <h2>Wenn Sie uns schreiben</h2>
        <p>
          Schreiben Sie uns eine E-Mail, nutzen wir Ihre Adresse und Ihre Nachricht nur, um Ihnen zu antworten, und löschen sie, wenn das erledigt ist (Art. 6
          Abs. 1 lit. f DSGVO).
        </p>
      </section>

      <section className="legal-panel">
        <h2>Ihre Rechte</h2>
        <p>
          Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18),
          Datenübertragbarkeit (Art. 20) und Widerspruch gegen die Verarbeitung (Art. 21). Schreiben Sie dafür an <Email />. Außerdem können Sie sich bei einer
          Datenschutz-Aufsichtsbehörde beschweren (Art. 77 DSGVO).
        </p>
      </section>

      <p className="legal-updated">Stand: {PRIVACY_UPDATED}</p>
    </LegalPage>
  );
}
