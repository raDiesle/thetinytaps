import type { Research } from "./types";

export const besucherVerhalten: Research = {
  id: "besucher-verhalten",
  date: "2026-11-07",
  emoji: "📊",
  title: "Womit sehen, was Besucher in der App tun – ohne Cookie-Banner?",
  question:
    "Cloudflare Web Analytics zählt Besuche und Seiten, aber keine Ereignisse (Level fertig, „Nochmal“ oder „Weiter“, Sprache gewechselt, Musik aus). Welches Werkzeug zeigt das ohne Cookies und ohne Einwilligungs-Banner, und lässt sich Umami Cloud kostenlos nutzen?",
  method:
    "Selbst gelesen am 7. November 2026: die Preisseite von Umami (umami.is/pricing), sein Auftragsverarbeitungsvertrag (umami.is/dpa), seine Datenschutzerklärung und die Erklärung seiner Kennzahlen. Nicht gelesen: Umamis Anleitung zum Einbau des Skripts (ob es etwas im Browser speichert) und die Preisseiten von Plausible, Pirsch und GoatCounter – deren Angaben unten stammen aus dem Gedächtnis und sind vor einer Entscheidung nachzulesen. Was Google Analytics' Consent Mode und das TDDDG verlangen, ist eine Einschätzung aus bekannten Quellen, keine Rechtsberatung.",
  findings: [
    "Was es schon gibt: Cloudflare Web Analytics folgt den Seitenwechseln in der App, und jedes Spiel hat eine eigene Adresse – welche Spiele und Menüs wie oft geöffnet werden, ist also schon zu sehen. Es fehlen eigene Ereignisse; Cloudflare stichprobt und filtert wenig.",
    "Google Analytics setzt Cookies und braucht darum ein Banner. Sein Consent Mode ohne Einwilligung setzt keine Cookies, schickt aber weiter Daten an Google; die Berichte zeigen daraus kaum etwas, weil Google nur hochrechnet, wenn genug Besucher zugestimmt haben, und die deutschen Aufsichtsbehörden sehen auch diese Daten als einwilligungspflichtig. Für eine App ohne Banner taugt er nicht.",
    "Umami Cloud kostenlos („Hobby“, 0 $): bis 100 000 Ereignisse im Monat, eine Website, 6 Monate Aufbewahrung, keine Teammitglieder. Eigene Ereignisse und ihre Eigenschaften stehen in der Tabelle ohne Strich, sind also wohl dabei. Nicht dabei: API, Session-Aufzeichnungen, Heatmaps, zusätzliche Ereignisse.",
    "Was über 100 000 Ereignissen im Hobby-Plan passiert, sagt die Seite nicht klar: Die Fragen-Antworten versprechen, dass nichts verloren geht, und rechnen darüber hinaus pro Ereignis ab – der Hobby-Plan hat aber keine zusätzlichen Ereignisse. Seitenaufrufe zählen mit; schickt man sie Umami nicht, weil Cloudflare sie schon zählt, bleiben die 100 000 für Ereignisse.",
    "Nächste Stufe: Pro für 20 $ im Monat mit 1 Million Ereignissen, 20 Websites, 2 Jahren Aufbewahrung.",
    "Umami setzt keine Cookies: Ein Besucher wird über einen Hash aus Website, IP-Adresse, Browser und einem monatlich wechselnden Salz erkannt; die IP wird nicht als Feld gespeichert. Die Server stehen laut Umami in den USA und der EU – ob man die EU wählen kann, steht nirgends. Die Firma sitzt in San Francisco; der Auftragsverarbeitungsvertrag gilt mit dem Konto automatisch, für jeden Plan, mit EU-Standardvertragsklauseln.",
    "Andere ohne Cookies (nicht nachgelesen): Plausible (EU, bezahlt), Pirsch (Deutschland, bezahlt), GoatCounter (kostenlos, sehr schlicht), Umami selbst betrieben (kostenlos, braucht aber einen Server, den die App sonst nicht hat).",
    "Entschieden und eingebaut (7. November 2026): Umami Cloud im kostenlosen Plan. Umami zählt die Seitenaufrufe selbst (Einstieg, Ausstieg, Absprünge, Dauer eines Besuchs); die App meldet dazu die Zeit auf jeder Seite (ohne Zeit im Hintergrund, ab 3 Sekunden), das Ende eines Levels mit „Nochmal“ oder „Weiter“, abgelaufene und verlängerte Spielzeit, Einstellungen für alle Spiele und Installationen (src/lib/analytics.ts). Cloudflare Web Analytics bleibt daneben.",
    "Wer eines davon einbaut, ändert im selben Commit die Datenschutzerklärung und ihr PRIVACY_UPDATED, die Regel in CLAUDE.md und tracking.test.ts (beide erlauben bisher nur Cloudflare), und schickt nur grobe Dinge (Spiel, Level, Sprache) über eine kleine gemeinsame Funktion aus GameShell und GameEnd.",
  ],
  topics: [],
  games: [],
  excluded: [
    {
      title: "Session-Aufzeichnungen und Heatmaps (Aufzeichnungsdienste, auch die von PostHog oder Umami)",
      why: "Brauchen in der EU eine Einwilligung, und Kinder beim Spielen aufzuzeichnen passt nicht zu einer App, die Eltern vertrauen sollen.",
    },
    { title: "Google Analytics, auch im Consent Mode", why: "Cookies und Banner, oder ohne Einwilligung kaum Zahlen und trotzdem heikel (siehe oben)." },
  ],
  ideas: [],
  sources: [
    { label: "Umami – Preise", url: "https://umami.is/pricing" },
    { label: "Umami – Auftragsverarbeitungsvertrag", url: "https://umami.is/dpa" },
    { label: "Umami – Datenschutz", url: "https://umami.is/privacy" },
    { label: "Umami – Kennzahlen", url: "https://docs.umami.is/docs/metric-definitions" },
  ],
};
