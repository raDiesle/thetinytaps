import type { Research } from "./types";

export const tinyfingersMarke: Research = {
  id: "tinyfingers-marke",
  area: "recht",
  date: "2026-11-21",
  emoji: "⚖️",
  title: "„TinyFingers“ als Name oder Suchwort für Frei tippen?",
  question:
    "Ist „TinyFingers“ (tinyfingers.net) eine geschützte Marke, oder dürfen wir Frei tippen so nennen bzw. den Namen als Suchwort (meta keywords) hinterlegen?",
  method:
    "Websuchen nach tinyfingers.net und nach Marken „TINY FINGERS“ / „TINYFINGERS“, dazu die Seiten tinyfingers.net und tinyfingers.net/about selbst gelesen (21. November 2026). Die Markenregister ließen sich von hier nicht durchsuchen: TMview (EU, DPMA, Benelux in einem) ist im Firmennetz gesperrt, EUIPO-eSearch brach die Verbindung ab, DPMAregister lädt seine Treffer erst im Browser – für die EU, Deutschland und Benelux ist also offen, ob eine Marke eingetragen ist. Die Rechtslage nur aus allgemein bekannten Grundsätzen (MarkenG, UWG, BGH „Impuls“), keine Rechtsberatung.",
  findings: [
    "TinyFingers ist ein direkter Mitbewerber von Frei tippen: ein kostenloses Vollbild-Spielzeug, bei dem Babys und Kleinkinder auf die Tastatur hauen und bunte Buchstaben, Formen und Töne bekommen, dazu Mini-Spiele; seit März 2026 (Product Hunt), mit Werbung (Ezoic) und Google Analytics.",
    "Betreiber laut eigener Seite: Sharp-Mind SRL, Belgien. Die Seite sagt, „website, branding, and original interactive experience“ gehörten dieser Firma; ein ™ oder ® steht nirgends.",
    "USPTO: Gefunden wurde nur eine alte US-Wortmarke „TINY FINGERS“ für Spielzeug-Plattenspieler und -Radios (Klasse 28, eingetragen 1985), 1991 gelöscht. Eine aktive US-Marke kam in den Suchen nicht vor.",
    "EUIPO, DPMA und Benelux (BOIP) blieben ungeprüft – „nichts gefunden“ heißt hier nicht „frei“. Prüfen lässt es sich in TMview (tmdn.org/tmview) mit „tinyfingers“ und „tiny fingers“, Klassen 9, 28 und 41.",
    "Auch ohne eingetragene Marke ist der Name nicht frei: In Deutschland schützt das Markengesetz den Namen einer Website, App oder Software als Werktitel und den Namen eines Geschäfts als Unternehmenskennzeichen schon durch die Benutzung (§ 5, § 15 MarkenG), und das Wettbewerbsrecht verbietet, Verwechslungen mit einem Mitbewerber herbeizuführen (§ 5 Abs. 2 UWG). Derselbe Name für fast dasselbe Spiel ist der Lehrfall der Verwechslungsgefahr.",
    "Als verstecktes Suchwort ebenso nicht: Der BGH hat 2006 entschieden („Impuls“, I ZR 183/03), dass ein fremdes Kennzeichen in den Metatags einer Seite eine Benutzung dieses Zeichens ist und es verletzen kann – auch wenn es niemand sieht.",
    "Meta keywords gibt es bei uns ohnehin nicht (Regel in CLAUDE.md, jetzt mit Test): Google liest sie nicht, Bing wertet sie als Spam-Zeichen. Gesuchte Wörter gehören in Titel, Beschreibung und Text.",
    "Ein sichtbarer Satz wie „eine Alternative zu TinyFingers“ wäre vergleichende Werbung (§ 6 UWG): nur sachlich und nachprüfbar erlaubt, angreifbar und gegen unsere Regel, dass ein Text nur sagt, was die Seite selbst tut. Nicht empfohlen.",
    "Was frei ist: die beschreibenden Wörter, nach denen Eltern suchen und die TinyFingers selbst bedient – „baby keyboard smash“, „keyboard game for babies“, „baby computer games“. Solche Gattungswörter sind keine Marke und dürfen in Titel und Text von Frei tippen stehen, soweit die Seite das wirklich bietet (die Seitentexte brauchen dann alle sieben Sprachen). „Baby“ und „toddler“ dürfen dort stehen, nur nie im Namen eines Spiels oder der App.",
  ],
  topics: [
    {
      emoji: "🔎",
      title: "Gattungswörter, die TinyFingers mit eigenen Seiten bedient",
      searches: ["baby keyboard smash", "keyboard game for babies", "baby computer games", "keyboard smash game for toddlers"],
      ideas: [],
    },
  ],
  games: [
    {
      href: "/buchstaben/",
      searches: ["baby keyboard smash", "keyboard game for babies", "keyboard smash game for toddlers"],
      title: "Keyboard smash game – every key a letter, picture and word",
    },
  ],
  excluded: [
    {
      title: "Frei tippen „TinyFingers“ nennen",
      why: "Name eines Mitbewerbers für fast dasselbe Spiel: Werktitel- und Unternehmenskennzeichenschutz durch Benutzung und Verwechslungsgefahr nach UWG, ob eingetragen oder nicht.",
    },
    {
      title: "„TinyFingers“ in meta keywords oder versteckt im Text",
      why: "Nach BGH „Impuls“ eine Benutzung des fremden Zeichens; dazu gibt es bei uns grundsätzlich keine meta keywords.",
    },
  ],
  ideas: [],
  sources: [
    { label: "TinyFingers – Startseite", url: "https://tinyfingers.net/" },
    { label: "TinyFingers – About, Datenschutz und Betreiber", url: "https://tinyfingers.net/about" },
    { label: "TinyFingers auf Product Hunt", url: "https://www.producthunt.com/products/tinyfingers/alternatives" },
    { label: "Justia: US-Marke TINY FINGERS (1985, 1991 gelöscht)", url: "https://trademark.justia.com/734/95/tiny-fingers-73495079.html" },
    { label: "TMview – Markensuche in EU, DPMA, Benelux", url: "https://www.tmdn.org/tmview/" },
    { label: "§ 5 MarkenG – geschäftliche Bezeichnungen und Werktitel", url: "https://www.gesetze-im-internet.de/markeng/__5.html" },
    { label: "§ 5 UWG – Irreführung, Verwechslungsgefahr", url: "https://www.gesetze-im-internet.de/uwg_2004/__5.html" },
  ],
};
