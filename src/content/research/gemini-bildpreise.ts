import type { Research } from "./types";

export const geminiBildpreise: Research = {
  id: "gemini-bildpreise",
  area: "geld",
  date: "2026-11-11",
  emoji: "🍌",
  title: "Gemini-Bilder: Gibt es günstigere Modelle oder Wege, und was haben wir bisher ausgegeben?",
  question:
    "Stimmen die Preise, mit denen `bun run image` rechnet, noch? Gibt es neue Modelle oder Preisstufen, die günstiger sind und trotzdem gut genug für die Bilderbuch-Bilder, und andere Wege, beim Bildermachen weiter zu sparen?",
  method:
    "Am 11. November 2026 Googles Preisseite der Gemini API (ai.google.dev/gemini-api/docs/pricing, leitet jetzt auf aistudio.google.com/docs/pricing weiter) gelesen, etwa drei Viertel davon wörtlich, den Rest (Gemini 2.5 Flash Image) nur zusammengefasst; die Modellseiten von Nano Banana 2.1 und Nano Banana 2 Lite ganz und den Anfang der Anleitung zur Bilderzeugung. Mit unserem Schlüssel die Liste der Modelle abgefragt (kostenlos). Unsere bisherigen Anfragen aus den Batch-Notizen in .git/image-batches/ gezählt (nur Batches; was mit `--now` lief, steht dort nicht). Wie viel Nano Banana 2.1 „denkt“ und was das kostet, sagen die Quellen widersprüchlich – das ist nur durch einen Versuch zu klären. Testberichte zur Bildqualität von 2.1 stammen fast nur aus Googles eigenen Angaben. Ob die 300 $ Startguthaben von Google Cloud für die Gemini API gelten, nur aus Blogs und einem Forumsbeitrag, keine Seite von Google.",
  findings: [
    "Unser Modell gemini-3.1-flash-lite-image (Nano Banana 2 Lite) kostet weiter 0,0336 $ je 1K-Bild, im Batch 0,0168 $ – die 0,017 $ in REQUEST_PRICE stimmen. Es kann nur 1K, Eingaben kosten 0,125 $ je Million Token im Batch.",
    "Neu seit 6. Oktober 2026: gemini-nano-banana-2.1 (Nano Banana 2.1), ein Update von Nano Banana 2, das Google für alle neuen Projekte empfiehlt. Je 1K-Bild kostet es dasselbe wie Lite (0,0336 $, Batch 0,0168 $), dazu 2K für 0,0504 $ (Batch 0,0252 $) und 4K für 0,113 $ (Batch 0,0567 $). Laut Google besser in Bildqualität, Treue zum Prompt und gleichbleibenden Figuren über mehrere Bilder, bis zu 14 Vorlagen (4 Figuren, 10 Dinge). Unser Schlüssel kann es schon nutzen.",
    "Der Haken an 2.1: Eingaben kosten 0,75 $ je Million Token im Batch (sechsmal Lite), und es denkt immer, standardmäßig „medium“, abschaltbar nur bis „minimal“; Denk-Token kosten wie Text-Ausgabe 3,75 $ je Million im Batch. Wie viele es sind, steht nirgends verlässlich. Ein einzelnes 1K-Bild wird mit 2.1 darum etwas teurer als mit Lite, nicht billiger.",
    "Der eigentliche Hebel ist 2K: ein 2K-Bild hat viermal so viele Pixel wie ein 1K-Bild und kostet nur das Anderthalbfache. Ein 2x2-Bogen in 2K hat vier Felder etwa so groß wie heute ein ganzes 1K-Bild – vier Karten oder Geschichtsbilder für 0,0252 $, also etwa 0,0063 $ je Bild statt 0,0168 $ (plus Eingabe und Denken). Kleine Freisteller (512 px) passen zu 16 auf einen 2K-Bogen statt zu 4 auf einen 1K-Bogen.",
    "Die anderen Modelle sind nicht günstiger: Nano Banana 2 (gemini-3.1-flash-image) 0,067 $ je 1K-Bild, 512 px für 0,045 $, ohne Batch-Preis; Nano Banana Pro (gemini-3-pro-image) 0,134 $; das alte Gemini 2.5 Flash Image 0,0195 $ im Batch – es ist abgekündigt, aber erst am 15. März 2027 abgeschaltet (der Skill nannte es schon abgeschaltet). Imagen steht nicht mehr auf der Preisseite. Für keines der Bildmodelle gibt es eine kostenlose Stufe, Flex-Preise oder Rabatte auf zwischengespeicherte Eingaben.",
    "Bisher (Batches vom Oktober und November 2026): 1 890 Anfragen für 2 449 Bilder, alle mit Lite, also etwa 32 $ (601 Anfragen im Oktober, 1 289 im November). 1 447 Anfragen brachten ein Bild allein (920 davon 1200×900, 121 mit 1376 px), 386 einen 1x2-Bogen, 56 einen 2x2-Bogen; 1 808 Anfragen hatten mindestens eine Vorlage dabei.",
    "Hätten dieselben Bilder auf 2K-Bögen zu viert gelegen, wo sie es dürfen, wären es grob 13 bis 16 $ gewesen statt 32 $ – etwa die Hälfte. Wie viel davon wirklich geht, hängt daran, wie viele Bilder einen Bogen teilen dürfen (Geschichtsbilder mit Vorlagen und eigenem Raum stehen heute bewusst allein, ALONE_REASONS) und ob 2.1 vier Felder so sauber malt wie Lite ein Bild.",
    "Die 300 $ Startguthaben von Google Cloud: Blogs und ein Forumsbeitrag berichten, dass sie seit März 2026 nicht mehr für die Gemini API gelten. Nicht von Google bestätigt, darum nicht damit rechnen.",
    "Empfehlung vor dem Versuch: Lite bleibt vorerst das Standardmodell. Nano Banana 2.1 einmal ausprobieren (A-33), für etwa 0,03 $: ein 2K-2x2-Bogen mit vier wartenden Bildern, Denken auf „minimal“, die Token aus der Antwort lesen und die Bilder neben Lite legen. Einzelne 1K-Bilder lohnen mit 2.1 nicht.",
    "Versuch am 11. November 2026 mit den sieben Bildern von „Heimweh, die erste Nacht bei Oma“ (Gefühle), jedes nach dem ersten Bild der Geschichte als Vorlage: zwei 2K-Bögen mit 2.1 (vier Felder je Bogen, Denken „minimal“) und dieselben Bilder einzeln mit Lite. Die Token-Zahlen aus der Antwort (das Skript schreibt sie jetzt zu jedem Batch): ein 2.1-Bogen etwa 1 970 Token Eingabe, 1 680 Bild-Token, 610 bis 750 Text-Token, 0 Denk-Token – 0,029 $ für vier Bilder, 0,0073 $ je Bild. Lite: je Bild etwa 1 550 Token Eingabe, 1 120 Bild-Token, 355 Text-Token – 0,0173 $ je Bild. Der Bogen kostet also 58 % weniger. Der 2K-Bogen ist 2400×1792 Pixel, ein Feld knapp 1150×860, für 1200×900 um 4 % vergrößert.",
    "Die Bilder des Bogens sind sauber gezeichnet und halten den Raum, aber nicht, was in jedem Bild bleiben muss: Der Kuschelhase, den jedes Bild der Geschichte zeigen soll, fehlte in sechs von acht Feldern, auch als die zweite Fassung des Prompts „EVERY panel, each on its own, contains all of this“ sagte. Im ersten Bogen zoomte die Kamera leicht hinein, und beim „Nachtlicht runterwerfen“ leuchtete das Licht weiter, wo es aus sein sollte; die Aktionen fielen zahmer aus (Oma wegschubsen). Lite hielt in allen sieben Bildern den Hasen, die Kamera und die Aktionen. Die Lite-Bilder sind in die Geschichte gekommen.",
    "Ergebnis: Bilder einer Geschichte, die nach einer Vorlage den Raum und dessen Dinge halten müssen, bleiben einzeln mit Lite (der Grund „story picture“ in ALONE_REASONS bestätigt). Ob 2K-Bögen von 2.1 bei Bildern ohne Vorlage taugen, die ohnehin einen Bogen teilen (Karten, kleine Freisteller), ist noch offen (A-33).",
    "Entscheidung am 12. November 2026 (A-33, Auftrag: nie ein Bild allein, immer am günstigsten, außer es soll schneller gehen): Die Warteschlange wählt für jeden Bogen, was seine Bilder am günstigsten macht und groß genug ist. Kleine Bilder und Freisteller kommen zu viert auf einen 1K-Bogen von Lite (0,017 $, etwa 0,004 $ je Bild – billiger als ein 2K-Bogen von 2.1 mit 0,0073 $ je Bild), große Bilder und ganze Bilder ohne feste Größe zu viert auf einen 2K-Bogen von 2.1 mit Denken „minimal“ (ein Feld hat so viele Pixel wie ein ganzes 1K-Bild). Allein mit Lite bleiben nur Bilder mit einem bewiesenen Grund (das zweite Bild einer Bewegung, die späteren Bilder einer Geschichte), auch sie zusammen in einem Batch. Ein zweiter Versuch mit Geschichtenbildern auf 2.1-Bögen (jedes Feld mit seiner eigenen Liste, was bleiben muss; Denken „medium“ gegen „minimal“) war vorbereitet, aber das Guthaben bei Google war aufgebraucht (Fehler 402). Bei den 50 Geschichtenbildern, die gerade warten, ginge es um 0,85 $ gegen etwa 0,37 $ – zu wenig, um Bilder zu riskieren, die nachgezeichnet werden müssten.",
  ],
  topics: [],
  games: [],
  excluded: [
    {
      title: "Ein anderer Anbieter (OpenAI, Flux und andere)",
      why: "Nicht geprüft: 2 449 Bilder stehen schon im Stil von Gemini, und Geschichten halten ihre Figuren über Vorlagen. Ein anderer Anbieter müsste diesen Stil und die Figuren treffen, bevor ein Preis zählt.",
    },
    {
      title: "Nano Banana 2 oder Pro als Standard",
      why: "Kosten das Vier- bzw. Achtfache von Lite im Batch und bringen für die einfachen Bilderbuch-Bilder nichts, was 2.1 nicht zum Preis von Lite verspricht.",
    },
  ],
  ideas: ["A-33"],
  sources: [
    { label: "Google: Gemini API – Preise", url: "https://ai.google.dev/gemini-api/docs/pricing" },
    { label: "Google: Gemini Nano Banana 2.1", url: "https://ai.google.dev/gemini-api/docs/models/gemini-nano-banana-2.1" },
    { label: "Google: Bilderzeugung mit Gemini", url: "https://ai.google.dev/gemini-api/docs/image-generation" },
    { label: "Android Authority: Nano Banana 2.1", url: "https://www.androidauthority.com/google-launches-nano-banana-2-1-3719823/" },
    {
      label: "Google-Forum: Startguthaben nicht für die Gemini API verwendet",
      url: "https://discuss.ai.google.dev/t/free-trial-credit-300-not-applied-to-gemini-api-usage-charged-from-prepay-balance-instead/180745",
    },
  ],
};
