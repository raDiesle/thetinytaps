import { useT } from "@/lib/language";

/**
 * For parents, a few words from us as parents (the home page's foot; in the book look behind the shelf's carved
 * „mehr …“, RoomNotes): why no age is named (each family decides
 * when screens come in), that the real world comes first, then playing on a screen together, a learning game alone
 * later, and plain watching least – and that this book means to be that first step together.
 */
export function ParentsNote() {
  const t = useT();
  return (
    <section className="seo-text parents-note">
      <h2>{t({ de: "Ein paar Worte von uns" })}</h2>
      <p>
        {t({
          de: "Wir sind selbst Eltern und haben Books for Both gemacht, weil wir uns immer wieder dieselbe Frage gestellt haben: Wie viel Bildschirm tut einem kleinen Kind eigentlich gut? Eine Altersangabe finden Sie hier deshalb nicht. Wann Ihr Kind die ersten Schritte ins Digitale macht, wissen Sie selbst am besten – jedes Kind ist anders, und jede Familie auch.",
        })}
      </p>
      <p>
        {t({
          de: "Ehrlich gesagt ist das Schönste ohnehin nicht digital. In Pfützen springen, Türme bauen und wieder umwerfen, ein Bilderbuch so oft vorlesen, bis alle es auswendig können – die echte Welt bleibt der beste Spielplatz, und kein Bildschirm kommt da heran.",
        })}
      </p>
      <p>
        {t({
          de: "Kommt der Bildschirm doch dazu, dann am liebsten zusammen: auf dem Schoß, ein kleiner Finger auf dem Bild, viel Staunen und Erzählen dazwischen. Später darf ein Kind auch mal allein ein kleines Lernspiel spielen. Am wenigsten halten wir vom bloßen Zuschauen, ein Video nach dem anderen, ohne selbst etwas zu tun.",
        })}
      </p>
      <p>
        {t({
          de: "Genau für diesen ersten gemeinsamen Schritt ist Books for Both gedacht: ein Bilderbuch, das Sie zusammen aufschlagen, das auf jedes Antippen antwortet – und das sich genauso gut wieder zuklappen lässt, um draußen weiterzuspielen. Wir wünschen Ihnen und Ihrem Kind viele schöne Momente damit, auf dem Bildschirm und noch viel mehr daneben.",
        })}
      </p>
    </section>
  );
}
