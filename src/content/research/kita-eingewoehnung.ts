import type { Research } from "./types";

export const kitaEingewoehnung: Research = {
  id: "kita-eingewoehnung",
  date: "2026-11-11",
  emoji: "🎒",
  title: "Kita-Eingewöhnung und Abschied am Morgen: Welche Schritte, und was hilft?",
  question:
    "Für das Buch „Kita-Start“ („Tapsi geht in die Kita“, eine Geschichte in Kapiteln wie „Abstillen“, Idee H-10): In welchen Schritten raten Fachleute, ein Kleinkind in der Kita einzugewöhnen, und wie sieht ein guter Abschied am Morgen aus?",
  method:
    "Eine Runde am 11. November 2026, die Quellen selbst gelesen: die Lexikon-Artikel von socialnet zum Berliner Modell (nach Laewen, Andres und Hédervári, „Ohne Eltern geht es nicht“ – das Buch selbst nicht) und zum Münchener Modell, die Präsentationsnotizen des Papilio-U3-Moduls 6 (Berliner, Münchener Modell, Ahnert), Renz-Polsters „Kita-Eingewöhnung: Abbrechen oder Durchhalten?“, vier Seiten von Zero to Three (Trennungsangst, Monat 36, erster Babysitter, zurück in die Betreuung), Nora Imlaus Kolumne in der Apotheken Umschau, der BZgA-Elternbrief für 34–36 Monate und ihre Broschüre „Das Baby“ (beide ohne eigene Schritte zum Abschied) und kita.de als Portal. Zu Graf & Seide, Juul und Siegel & Bryson fand sich nichts Lesbares zum Abschied in der Kita.",
  findings: [
    "Die Schritte des Berliner Modells sind die Kapitel des Buchs: vorher erzählen; die Grundphase, in der ein Elternteil ein bis zwei Stunden im Raum bleibt, als sicherer Hafen, und mit dem Kind wieder geht; am vierten Tag die erste kurze Trennung (nicht nach einem Wochenende); die Stabilisierung, in der die Erzieherin Füttern, Wickeln und Trösten übernimmt, erst neben dem Elternteil, und die Trennungen länger werden; dann ist das Elternteil nur noch erreichbar (socialnet, Papilio).",
    "Die erste Trennung: das Elternteil verabschiedet sich, geht aus dem Raum, bleibt aber im Haus; weint das Kind untröstlich, nur zwei bis drei Minuten (Papilio nach Braukhane & Knobeloch). Im Münchener Modell erklärt das Elternteil vorher, warum es geht.",
    "Eingewöhnt ist ein Kind, wenn es sich von der Erzieherin trösten lässt – nicht, wenn es nicht mehr weint (Berliner Modell). Abschiedstränen sind normal, „Trennungsschmerz ist ein Teil von Bindung“ (Renz-Polster). In der Geschichte weint Tapsi, und Mia tröstet.",
    "Ein kurzes, immer gleiches Abschiedsritual hilft: Kuss, Kuscheln, Übergabe, Winken (Zero to Three); ein Kuscheltier oder Foto erinnert daran, dass Mama wiederkommt. In der Geschichte kommt Tapsis Kuschelhase mit.",
    "Nie heimlich wegschleichen, kein langer Abschied an der Tür, nicht wieder hineinlaufen (Zero to Three, Imlau, kita.de); sagen, wann man wiederkommt, in den Worten des Tages statt der Uhr (kita.de: „nach dem Spielen“). In der Geschichte: „nach dem Mittagsschlaf“.",
    "Die Eingewöhnung braucht zwei bis vier Wochen und mehr, anfangs nur halbtags (Papilio), Schritt für Schritt, manchmal Monate (Imlau); der Stress sinkt oft erst nach Monaten ganz (Ahnert). Die Geschichte nennt darum keine Tage, nur „ein paar Tage später“ und „jeden Tag ein bisschen länger“.",
    "Ein Winkefenster und das Wiedersehen beim Abholen standen in keiner gelesenen Quelle; beides kommt aus der Idee H-10 und aus dem Kita-Alltag, nicht aus der Literatur.",
  ],
  topics: [],
  games: [],
  excluded: [
    {
      title: "Das Kind vom Arm nehmen und schnell gehen, oder heimlich, während es spielt",
      why: "Alle gelesenen Quellen raten davon ab (Zero to Three, Imlau, Renz-Polster); die Geschichte bleibt wahr und sanft.",
    },
    {
      title: "Ein fester Stufenplan mit Tagen",
      why: "Renz-Polster warnt vor Zeitdruck und starren Plänen, und Kitas machen es verschieden; die Geschichte nennt keine Zahlen.",
    },
  ],
  ideas: ["H-10"],
  sources: [
    { label: "socialnet Lexikon: Berliner Eingewöhnungsmodell", url: "https://www.socialnet.de/lexikon/Berliner-Eingewoehnungsmodell" },
    { label: "socialnet Lexikon: Münchener Eingewöhnungsmodell", url: "https://www.socialnet.de/lexikon/Muenchener-Eingewoehnungsmodell" },
    {
      label: "Papilio-U3, Modul 6: Präsentationsnotizen zur Eingewöhnung",
      url: "https://akademie.papilio.de/wp-content/uploads/2026/02/U3_06_Modul_Praesentationsnotizen.pdf",
    },
    {
      label: "Herbert Renz-Polster: Kita-Eingewöhnung – Abbrechen oder Durchhalten?",
      url: "https://www.kinder-verstehen.de/wp-content/uploads/kita-eingewoehnung-abbrechen-oder-durchhalten.pdf",
    },
    { label: "Zero to Three: Separation Anxiety", url: "https://www.zerotothree.org/resource/separation-anxiety/" },
    { label: "Zero to Three: From Baby to Big Kid, Month 36", url: "https://zerotothree.org/resources/1277-from-baby-to-big-kid-month-36" },
    {
      label: "Zero to Three: What Comes Next – Back to Child Care",
      url: "https://www.zerotothree.org/resource/what-comes-next-back-to-child-care-following-shelter-in-place/",
    },
    {
      label: "Apotheken Umschau, liebe NORA!: Wie lasse ich mein Kind gut los? (Nora Imlau)",
      url: "https://www.apotheken-umschau.de/print/el/el25-09/liebe-nora-wie-lasse-ich-mein-kind-gut-los-1393577.html",
    },
    { label: "BZgA/BIÖG: Elternbrief 34.–36. Lebensmonat", url: "https://www.kindergesundheit-info.de/elternbriefe-online/u7a-34-36-lebensmonat/" },
    { label: "kita.de: Berliner und Münchner Eingewöhnungsmodell", url: "https://www.kita.de/wissen/kita-eingewoehnung-berliner-und-muenchner-modell/" },
  ],
};
