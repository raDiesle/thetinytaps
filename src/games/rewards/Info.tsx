import { useT } from "@/lib/language";

// „ℹ️ Über …“ for grown-ups: what the board or the plan shown is for and how it is used.

/** For grown-ups: how the board works, and what parents' guides advise about rewards for toddlers. */
export function BoardInfo() {
  const t = useT();
  return (
    <section className="settings game-info">
      <p>
        {t({
          de: "Eine Tafel, auf der Ihr Kind Sterne sammelt – auf dem Bildschirm und, genau gleich, zum Ausdrucken. Oben wechseln Sie die Ansicht: Tag (die Aufgaben von heute als große Bilder), Woche (Aufgaben × Tage) oder Monat (ein Kalender) – alle drei zeigen dieselben Sterne; mit ‹ geht es zu früheren Tagen, Wochen oder Monaten, um einen vergessenen Stern nachzutragen. Unter „Rückblick“ blättern Sie mit Ihrem Kind durch die letzten Wochen und schauen zusammen, was schon geklappt hat. „Sammeln“ ist ein Weg bis zur Belohnung, ohne Tage. Die Vorlagen zeigen mit Beispiel-Sternen, wie eine Tafel in Benutzung aussieht; „＋ Neu“ führt Schritt für Schritt und in Bildern zu einer eigenen, z. B. eine pro Kind – oder zu einem Tagesplan, der oben in derselben Reihe steht. Unter „Gestalten“ ändern Sie später alles.",
        })}
      </p>
      <p>
        {t({
          de: "So kommt ein Stern auf die Tafel: Sie halten ein Feld gedrückt, bis sein Ring voll ist – dann erscheint ein großer Stern, und Ihr Kind tippt ihn an. Er fliegt in sein Feld. Ein kurzes Tippen allein gibt keinen Stern, das Feld wackelt nur. Eine Aufgabe kann morgens ☀️, mittags 🌤️ und abends 🌙 je ein eigenes Feld haben – Zähne putzen hat morgens und abends eins. Sterne aus „Zähne putzen“ (zur richtigen Tageszeit) und „Aufs Töpfchen“ kommen von selbst, wenn die Aufgabe aus dem Katalog stammt. Haben Sie das falsche Feld erwischt, gibt es kurz danach „Stern zurück“.",
        })}
      </p>
      <p>
        {t({
          de: "Was Ratgeber für Zwei- und Dreijährige empfehlen: eine bis drei Aufgaben, eine davon leicht; der Stern sofort danach; die Belohnung bald (lieber 5 Sterne als eine ganze Woche) und am liebsten Zeit zusammen statt Süßigkeiten. Sterne werden nie weggenommen und es gibt keine Strafe – ein leeres Feld ist einfach noch frei. Klappt etwas von allein, feiern Sie den Abschluss und lassen die Tafel ausklingen. Beim Töpfchen und beim Schlafen gilt besonders: mitfreuen, nie drängen.",
        })}
      </p>
      <p>
        {t({
          de: "Alles bleibt auf diesem Gerät, ohne Anmeldung. Unter „Drucken“: A4 quer oder hochkant, in Farbe oder Schwarz-weiß, mit Feldern zum Ausmalen und einem Bogen Sterne zum Ausschneiden.",
        })}
      </p>
    </section>
  );
}

/** For grown-ups: what the plan is for, how a child uses it, and what helps toddlers with routines. */
export function PlanInfo() {
  const t = useT();
  return (
    <section className="settings game-info">
      <p>
        {t({
          de: "Ein Tagesplan in Bildern (auch Strukturtafel, Bildfahrplan oder Routinekarten genannt): Kleine Kinder können noch keine Uhr lesen, aber sie verstehen Bilder in einer Reihe. So sehen sie, was jetzt kommt und was danach – das macht Übergänge leichter und den Tag vorhersehbar.",
        })}
      </p>
      <p>
        {t({
          de: "„Tag“ zeigt die Schritte von heute als große Karten. Die Karte, die jetzt dran ist, leuchtet („Jetzt“), darüber steht, was „Dann“ kommt. Ist ein Schritt geschafft, tippt Ihr Kind selbst auf die leuchtende Karte: sie fliegt in die Fertig-Kiste unten, wie bei einer Klett-Tafel zu Hause, und die nächste leuchtet. So wird die Reihe kürzer, bis nur noch der letzte Schritt übrig ist; danach gibt es ein kleines Fest, und „Von vorn“ holt alle Karten wieder heraus. Ein Plan mit zwei Karten ist eine Erst–Dann-Tafel: erst das eine, dann das Schöne. „Woche“ zeigt, was an welchem Tag ist (Kita, Oma, Schwimmen), und Monde über den nächsten Tagen zeigen, wie oft man noch schlafen muss.",
        })}
      </p>
      <p>
        {t({
          de: "Ist die Zähne-Karte dran, öffnet ein Tippen darauf gleich das Spiel „Zähne putzen“. Nach dem Putzen (oder mit ✕) geht es zurück zum Plan, und die Karte ist geschafft – auch wenn die Morgenroutine einmal später wird. Das Putzen zählt nicht zur Spielzeit und geht auch, wenn sie vorbei ist. Wer ohne das Spiel putzt, stellt unter „Gestalten“ die Karte auf „Nur abhaken“. Wer aus dem Menü putzt, hakt die Karte auch ab – in der Morgenroutine nur das Putzen am Morgen. Hat Ihr Kind zu früh getippt, gibt es kurz danach „Zurück“; „Von vorn“ beginnt den Tag neu. In der Woche bekommen geschaffte Karten einen Haken. Mit ‹ › sehen Sie andere Tage, etwa was morgen kommt.",
        })}
      </p>
      <p>
        {t({
          de: "Was hilft: wenige Bilder (drei bis sechs), immer dieselbe Reihenfolge, den Plan gemeinsam anschauen, bevor es losgeht. Zum Ausdrucken gibt es jedes Bild auch als Karte zum Ausschneiden, für eine Klett-Tafel. Alles bleibt auf diesem Gerät, ohne Anmeldung.",
        })}
      </p>
    </section>
  );
}
