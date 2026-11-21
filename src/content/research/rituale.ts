import type { Research } from "./types";

export const rituale: Research = {
  id: "rituale",
  area: "kinder",
  date: "2026-11-04",
  emoji: "💛",
  title: "Rituale für den Tagesplan: Erzählen nach der Kita, Mutmach- und Gute-Nacht-Sätze",
  question:
    "Welche festen Rituale empfehlen Eltern-Ratgeber für den Morgen, nach Kita oder Schule und vor dem Schlafen – und mit welchen Worten genau? Die Fragen nach dem Guten, dem Blöden und dem Neuen des Tages, und Sätze wie „Ich bin gut so, wie ich bin“ und „Ich schaffe das“.",
  method:
    "Websuche auf Deutsch und Englisch (Fragen nach der Schule, Rose/Thorn/Bud, Affirmationen für Kinder, Abendrituale), gelesen wurden Ratgeberseiten, Elternblogs und Pressetexte, die eine Fachperson zitieren. Belastbare Studien zu Affirmationen für Kleinkinder fanden sich nicht; was dazu gesagt wird, stammt aus Blogs. Aus der Fachliteratur bekannt (nicht neu gelesen): Selbstaussagen können bei Menschen mit wenig Selbstwert nach hinten losgehen (Wood u. a. 2009). Darum stehen auf den Karten bedingungslose Sätze („gut so, wie ich bin“, „geliebt“) und „Ich schaffe das“ immer mit „hilft mir jemand“.",
  findings: [
    "Gut, schlecht, neu ist als Rose, Thorn, Bud (Rose, Dorn, Knospe) oder „Highs and Lows“ ein verbreitetes Familienritual am Abendbrottisch; eine feste deutsche Formulierung gibt es nicht. Auf der Karte: „Was war heute schön? … blöd? … neu?“.",
    "Statt „Wie war's?“ lieber konkret fragen (Prof. Tina Kretschmer, zitiert bei echo24), das Kind erst ankommen lassen, zu einer festen Zeit fragen und selbst auch vom eigenen Tag erzählen (Famigros).",
    "Mutmach-Sätze für Kinder (Affirmationen) sind kurz, im Präsens und positiv: „Ich bin gut so, wie ich bin“, „Ich bin mutig“, „Ich kann das schaffen, auch wenn es schwer ist“, „Ich darf Fehler machen“. Die Ratgeber betonen: jeden Tag dieselben, lieber regelmäßig als viele, vor dem Spiegel oder mit der Hand aufs Herz, und das Kind nie zum Nachsprechen zwingen.",
    "Vor dem Schlafen: ein Moment des Dankes („Worüber hast du dich heute gefreut?“), Zuneigung ohne Bedingung („Ich hab dich lieb, genau so, wie du bist“) und Sätze wie „Ich bin geliebt“ und „Morgen ist ein neuer Tag“; gleich jeden Abend, leise beim Kuscheln.",
    "Daraus: vier Ritualkarten im Zeitplan mit den Worten für die Eltern (H-58) und „Wie geht's dir?“ morgens und abends mit dem Vergleich am Abend (C-33), zusammen in der Vorlage „Mein Tag mit Ritualen“.",
  ],
  topics: [],
  games: [],
  excluded: [
    {
      title: "Sätze, die Leistung versprechen („Ich bin der Beste“, „Ich kann alles“)",
      why: "Sie stimmen für ein Kind oft nicht und können dann eher entmutigen; die Karten sagen, dass das Kind geliebt ist und Hilfe bekommt.",
    },
  ],
  ideas: ["H-58", "C-33"],
  sources: [
    {
      label: "echo24 – Viele Eltern stellen nach der Schule die falschen Fragen",
      url: "https://www.echo24.de/welt/viele-eltern-stellen-ihren-kindern-nach-der-schule-die-falschen-fragen-zr-94467210.html",
    },
    {
      label: "Famigros – Kinder zum Reden bringen",
      url: "https://famigros.migros.ch/de/kinder-und-jugendliche/schule-und-ausbildung/schulanfang/kinder-zum-reden-bringen",
    },
    {
      label: "Rose, Thorn, Bud am Familientisch",
      url: "https://de.parent.com/blogs/conversations/2025-rose-thorn-bud-5-dinner-table-gratitude-games-for-kids",
    },
    {
      label: "Stefanie Stahl Akademie – Affirmationen für Kinder",
      url: "https://stefaniestahlakademie.de/affirmationen-fuer-kinder-10-wege-ihr-selbstwertgefuehl-zu-staerken/",
    },
    { label: "Daddylicious – Affirmationen für Kinder", url: "https://www.daddylicious.de/affirmationen-fuer-kinder/" },
    {
      label: "Saarpfalz-Kreis – Abendritual: Gute-Nacht-Box (PDF)",
      url: "https://www.saarpfalz-kreis.de/images/Kinder_Jugend_Familie/Familien-_und_Jugendhilfe/Familienhilfezentren/Abendritual_-_Gute_Nacht_Box.pdf",
    },
  ],
};
