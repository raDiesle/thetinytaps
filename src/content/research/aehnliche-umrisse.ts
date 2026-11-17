import type { Research } from "./types";

export const aehnlicheUmrisse: Research = {
  id: "aehnliche-umrisse",
  date: "2026-11-03",
  emoji: "☝️",
  title: "Schatten und Verstecke: Welche Bilder sehen sich zu ähnlich?",
  question:
    "Bei Schatten finden und Wer schaut da raus? soll immer genau eine Antwort passen (X-14). Welche Bilder kann ein Kind als schwarzen Schatten oder als Teil, der aus dem Busch schaut, nicht auseinanderhalten?",
  method:
    "Im Browser jedes der 65 Bilder von Schatten finden in Apples Emojis (iPhone, Mac) und in Googles Noto Color Emoji (Android, von Google Fonts geladen) gezeichnet. Für die Schatten: der Umriss jedes Paars verglichen (Überdeckung, auf gleiche Größe gebracht) und die ähnlichsten Paare in beiden Schriften schwarz nebeneinander angesehen – die Zahl allein taugt nicht, sie hält alle runden Bilder für ähnlich (Erdbeere und Haus). Für Wer schaut da raus?: der sichtbare Teil (oben, links, rechts, bei 20 %) farbig in jeder Gruppe von PEEK_LOOKS verglichen (Umriss mal Farbe), dazu die Durchschnittsfarbe jedes Tiers für die Gucklöcher im Laub; die ähnlichsten groß angesehen. Entschieden nach Augenschein, ob ein Kind sie auseinanderhält.",
  findings: [
    "Schatten, die sich nicht unterscheiden lassen: Schwein, Schaf und Schildkröte (auf Android drei runde Kleckse auf kurzen Beinen), Schnecke und Schildkröte, Katze und Hund (auf dem iPhone), Hund und Elefant, Hund und Teddy, Eule und Teddy (auf Android), Apfel, Birne und Erdbeere, Pilz und Baum.",
    "Teile, die aus dem Busch gleich aussehen: der hellbraune Schwanz mit Hinterbein von Katze und Hund, das Grau von Elefant neben Kuh oder Schaf, das grauweiße Fell von Hase und Maus und das Braun von Eichhörnchen und Igel durch die Gucklöcher.",
    "Diese Paare kommen nie zusammen zur Auswahl (SHADOW_LOOKALIKES, PEEK_LOOKALIKES); die übrigen ähnlichen Bilder einer Art bleiben, damit die schweren Stufen schwer bleiben.",
    "Nachtrag 7. November 2026, 35 weitere Tiere ebenso geprüft (headless Chrome, Apple Color Emoji und Noto Color Emoji von Google Fonts, Umriss-Überdeckung jedes neuen Tiers mit allen Bildern, die nächsten schwarz nebeneinander; sichtbare Teile oben, links, rechts bei 25 % und die Durchschnittsfarbe je Gruppe): 20 kamen dazu. Gleiche Schatten: Zebra und Kuh, Nilpferd und Schwein, Pfau und Baum (auf Android), Affe und Eichhörnchen. Gleiche Teile: einfarbig braunes Fell durch die Gucklöcher (Affe, Hirsch, Känguru, Kamel, Ziege, Pferd), Grau (Nashorn, Elefant, Gorilla; Robbe und Nilpferd aus dem Teich), Schwarz-Weiß (Zebra, Kuh), weiße Wolle (Schaf, Lama), Orange mit dunklen Flecken (Tiger, Giraffe), Grün (Pfau und Papagei; Schildkröte, Eidechse und Raupe), die gelb-schwarzen Ringe von Raupe und Biene, der gebogene Schwanz von Affe und Hund und ein blauer Rücken mit Flosse aus dem Wasser (Delfin, Fisch).",
    "Nachtrag 7. November 2026, zweite Runde: rund 190 Emojis aus Fahrzeugen, Essen, Dingen und Tieren ebenso geprüft (im Browser in Apple Color Emoji und Noto Color Emoji gezeichnet, Umriss-Überdeckung mit allen Bildern, die nächsten schwarz nebeneinander); 94 kamen dazu (13 Fahrzeuge, 14 zum Essen, 62 Dinge, 5 Tiere). Was am häufigsten scheitert: Apples Fahrzeuge schräg von vorn sind alle derselbe Kasten (Bus, Lastwagen, Feuerwehr, Straßenbahn, Polizeiauto, Auto, Krankenwagen), Essen in Schachtel oder Becher wird ein Kasten (Pommes, Popcorn, Becher, Saft), und vieles ist ein runder Kopf auf kurzem Stiel (Spiegelei, Lutscher, Ballon, Glühbirne, Baum, Pfau). Neue gleiche Schatten: diese Kästen untereinander, Schuhe und Socke (Stiefel, Rollschuh, Schlittschuh), Torte und Muffin, Kuchenstück mit Käse und Haus, Eimer, Korb und Geschenk, Stift, Flip-Flop und Raupe, Zahnbürste und Möhre, Geige und Gitarre, Karussell und Pferd, Zelt und Berg, Regenbogen und Mond, Tropfen mit Birne und Feuer, das Ahornblatt mit Stern und Tanne, Sonne, Schneeflocke und Sonnenblume, Fallschirm und Schirm, Spinne und Marienkäfer, Teekanne und Fisch. Gleiche Teile: T-Rex und Dino (grün), Spinne mit Ameise, Marienkäfer und Grashüpfer (dünne dunkle Beine), Grashüpfer und Schnecke (braun), Hummer mit Krebs und Tintenfisch (rot aus dem Teich).",
  ],
  topics: [],
  games: [],
  excluded: [
    { title: "Traktor und Feuerwehr, Auto und Traktor", why: "Ähnlich kastig, aber das große Hinterrad und die Leiter unterscheiden sie deutlich." },
    { title: "Eule und Pinguin", why: "Farbig und als Schatten gut zu unterscheiden: der Pinguin steht schmal mit Schnabel zur Seite." },
    { title: "Erdbeere und Haus", why: "Der Umrissvergleich hielt sie für am ähnlichsten, das Dach unterscheidet sie aber auf den ersten Blick." },
    {
      title: "Leopard, Dromedar, Hai, Otter, Stier, Bison, Taube und Adler",
      why: "Haben denselben Umriss wie ein anderes Tier (Tiger, Kamel, Delfin, Robbe, Kuh, Schwein, untereinander) – von zweien gleich aussehenden kam nur eins dazu.",
    },
    {
      title: "Küken, Frosch, Fledermaus, Faultier, Schlange, Truthahn",
      why: "Küken und Frosch sind Gesichter oder runde Kleckse; die anderen kennen kleine Kinder weniger oder wären in ihrer Gruppe allen anderen zu ähnlich (die grüne Schlange).",
    },
    {
      title: "Krankenwagen, Pickup, Kleinbus, Fähre, Gondel, Schnellzug",
      why: "Auf dem iPhone derselbe Kasten wie Bus, Lastwagen, Feuerwehr oder Polizeiauto, die Gondel wie die Seilbahn, die Fähre wie das Schiff; der Schnellzug ist ein Keil, den kein Kind erkennt.",
    },
    {
      title:
        "Zitrone, Orange, Tomate, Avocado, Paprika, Kartoffel, Ei, Zwiebel, Kiwi, Burger, Brot, Pfannkuchen, Sandwich, Hotdog, Schokolade, Gurke, Waffel, Pudding, Blaubeeren",
      why: "Als Schatten runde oder längliche Kleckse ohne eigenen Umriss.",
    },
    {
      title: "Pommes, Popcorn, Lutscher, Croissant, Honig, Baguette, Fleisch",
      why: "Pommes und Popcorn sind auf dem iPhone ein Kasten wie Eimer und Geschenk, der Lutscher ein Kreis am Stiel wie Spiegelei und Ballon, das Croissant auf Android ein Klumpen wie Brokkoli, Honig ein runder Topf wie der Apfel, das Baguette ein Stab wie der Stift, das Fleisch wie die Hähnchenkeule.",
    },
    {
      title: "Fernseher, Telefon, Kamera, Radio, Koffer, Rucksack, Klopapier, Vorhängeschloss, Pflaster, Mikrofon, Wachsmalstift, Pinsel",
      why: "Kästen, Kleckse oder Stäbe (der Pinsel wie Zahnbürste und Möhre); das alte Telefon kennen kleine Kinder nicht, und „Schloss“ wäre neben der Burg doppeldeutig.",
    },
    {
      title: "Magnet, Pokal, Planet, Welle, Schraubenschlüssel, Anker, Schleife, Kleeblatt, Wanderschuh",
      why: "Kennen kleine Kinder kaum, oder der Umriss gleicht einem Bild, das schon da ist (der Wanderschuh dem Schuh).",
    },
    {
      title: "Qualle, Esel, Gans, Widder, Käfer, Vogel, Kugelfisch, Biber",
      why: "Die Qualle ist auf dem iPhone halb durchsichtig und ihr Schatten grau; Esel, Gans, Widder und Käfer stehen wie Zebra, Ente, Schaf und Marienkäfer, der Vogel ist auf dem iPhone ein Gesicht, Kugelfisch und Biber sind Kleckse.",
    },
  ],
  ideas: ["X-14"],
  sources: [],
};
