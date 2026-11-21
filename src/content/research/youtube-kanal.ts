import type { Research } from "./types";

export const youtubeKanal: Research = {
  id: "youtube-kanal",
  area: "youtube",
  date: "2026-11-21",
  emoji: "🏷️",
  title: "YouTube-Kanal: Ist @funforboth frei, und taugen die Reihennamen?",
  question:
    "Gibt es schon einen Kanal mit dem Handle @funforboth oder dem Namen „Fun for Both“, sind die Reihen „Brush with Tapsi“, „Potty time with Tapsi“, „Tapsi reads“ und „Calm timers“ unbelegt, und ist „Tapsi“ schon eine Kindermarke? (Y-03)",
  method:
    "Am 21. November 2026 ohne Anmeldung die Kanalseiten youtube.com/@… abgerufen (Gegenprobe: @YouTube und @cocomelon antworten mit ihrem Kanal, ein 404 heißt also „kein öffentlicher Kanal“), dazu YouTubes Suche nach Kanälen und Videos und eine Websuche. Ob ein Handle wirklich frei ist, zeigt erst YouTube Studio beim Anlegen – auch gesperrte oder versteckte Kanäle können eines belegen. Die Markenregister (DPMA, EUIPO) wurden nicht geprüft.",
  findings: [
    "Kein öffentlicher Kanal unter @funforboth, @funforbothapp, @funforboth_com, @funforbothcom, @funforbothkids und @fun4both.",
    "Ein Kanal namens „Fun for Both“ fand sich weder auf YouTube noch im Netz; nur ähnliche, kleine Kanäle („Fun For Two“, „Fun with Both“).",
    "Auch @brushwithtapsi, @pottytimewithtapsi, @tapsireads, @tapsi, @tapsikids und @tapsi_kids sind keine öffentlichen Kanäle; „Brush with Tapsi“, „Potty time with Tapsi“ und „Tapsi reads“ gibt es nicht als Kanal oder Playlist.",
    "„Calm timers“ taugt nicht als Reihenname: Viele Timer-Videos tragen es im Titel, und @CalmTimers ist vergeben (ein Kanal mit einem Video).",
    "„Tapsi“ ist keine große Kindermarke, aber nicht ungenutzt: ein kleiner deutscher Kinderlied-Kanal mit einem Tapsi-Bären (2 Abos), Tapsi als Teddy oder Katze in einigen Kinderliedern, ein serbisches Kinderlied „Tapsi Tapsi“ (10,8 Mio. Aufrufe) und ein iranischer Fahrdienst „Tapsi“ – Verwechslungsgefahr gering bis mittel, daher den Kanal nach der Seite benennen und Tapsi nur in den Reihen nennen.",
  ],
  topics: [],
  games: [],
  excluded: [
    {
      title: "Kanal „Tapsi“ oder @tapsi",
      why: "Der Name ist mehrfach von Kleinen besetzt, und der Kanal soll zur Adresse führen: „Fun for Both“ bleibt der Name.",
    },
    { title: "„Calm timers“ als Reihe", why: "Gattungsbegriff, unter dem Tausende Videos stehen; besser „Calm timers with Tapsi“." },
  ],
  ideas: ["Y-03", "Y-09"],
  sources: [
    { label: "youtube.com/@funforboth (404 – kein öffentlicher Kanal)", url: "https://www.youtube.com/@funforboth" },
    { label: "youtube.com/@CalmTimers (vergeben)", url: "https://www.youtube.com/@CalmTimers" },
    { label: "youtube.com/@tapsitv (vergeben)", url: "https://www.youtube.com/@tapsitv" },
    { label: "YouTube-Suche nach Kanälen „Fun for Both“", url: "https://www.youtube.com/results?search_query=Fun+for+Both&sp=EgIQAg%3D%3D" },
    { label: "YouTube-Suche „Tapsi“", url: "https://www.youtube.com/results?search_query=Tapsi" },
  ],
};
