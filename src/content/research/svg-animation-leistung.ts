import type { Research } from "./types";

export const svgAnimationLeistung: Research = {
  id: "svg-animation-leistung",
  area: "technik",
  date: "2026-11-27",
  emoji: "🧪",
  title: "SVG-Animationen schneller machen – was Browser und Werkzeuge heute können",
  question:
    "Welche Wege gibt es, Animationen aus SVG-Zeichnungen in einer Web-App auf alten Android-Handys und auf iPads flüssig zu machen – über das hinaus, was die Spiele schon tun (bewegte Teile als eigene HTML-Ebenen, nur `transform` und `opacity`, große stille Zeichnungen einmal gebaut) –, und was davon passt zu unseren Spielen?",
  method:
    "Web-Recherche am 27. November 2026 in zwei Teilen (Browser-Ebene; React, Werkzeuge und Messen), vor allem in Primärquellen: Chromiums Quelltext (compositing_reason_finder.cc, compositor_animations.cc, runtime_enabled_features.json5) und Doku, developer.chrome.com, web.dev, react.dev, MDN, WebKit-Bugtracker und der Blog des Entwicklers von WebKits neuer SVG-Technik; dazu Fachartikel (Motion, oxc) und eine begutachtete Studie (Journal of Imaging, Januar 2026). Weil die Quellen zur Frage „malt Chrome ein Teil in einem svg neu?“ dünn waren, ein eigener Versuch im Chrome ohne Fenster wie bei `bun run perf` (640×360, dreifache Pixel, Prozessor 6-mal langsamer): ein bildschirmgroßes svg mit 1 500 bzw. 6 000 Pfaden und einer animierten Gruppe, je 2 s aufgezeichnet – ein Mac, kein echtes Handy, die Grafikkarte nicht gebremst. Was nur in Blogs steht, ist in den Ergebnissen so gekennzeichnet. Unser eigener Code wurde mit `git grep` danach durchsucht, was er schon nutzt.",
  findings: [
    "Chrome legt seit Version 89 eine `transform`- oder `opacity`-Animation eines Teils *in* einem svg auf die Grafikkarte. Im Versuch malte und rasterte er dabei nichts neu; bei `transform` rechnete er aber jedes Bild Stil und Layout des ganzen svg (1,0–2,0 ms je Bild, mehr bei mehr Pfaden), bei `opacity` gar nichts. Die eigene HTML-Ebene war als einzige ganz ohne Arbeit des Hauptfadens – unsere Regel bleibt richtig, nur der Grund ist feiner als „malt alles neu“.",
    "Ausnahmen, in denen Chrome doch das ganze svg neu malt (Quelltext und Versuch): die einzelnen Eigenschaften `translate`, `rotate`, `scale` statt `transform` (im Versuch Rastern in jedem Bild, 2–4 ms), Farbe, Strich und `stroke-dashoffset`, SMIL (`<animate>`), Teile in `<defs>`, Masken oder Mustern, ein verschachteltes `<svg>` mit eigenem viewBox, `<use>` mit x/y und `vector-effect`. Bei geänderter Füllfarbe stieg das Malen mit der Zahl der Elemente im svg (1,9 → 7,2 ms). Etwa 30 unserer Keyframes nutzen `translate`/`rotate`/`scale` (A-54); SMIL nutzt keins.",
    "Safari (iPad, iPhone) legt Teile in einem svg gar nicht auf die Grafikkarte: Seine neue SVG-Technik (LBSE) ist laut ihrem Entwickler (Juli 2026) noch nicht eingeschaltet. Jede Animation in einem svg malt dort das ganze svg neu – nur die eigene HTML-Ebene hilft in beiden Browsern. `bun run perf` misst nur Chrome (A-61).",
    "Filter: Ein `blur` oder `drop-shadow` auf einer eigenen Ebene rechnet die Grafikkarte in jedem Bild neu, solange sich die Ebene bewegt, auch wenn der Filter gleich bleibt (Chrome-Team). Unser CSS hat 47 solcher Filter (A-55). Für Masken, Muster, Verläufe und `feTurbulence` fanden sich keine verlässlichen Messungen.",
    "`will-change: transform` hält eine Ebene in der Schärfe fest, in der sie zuerst gemalt wurde: Wächst sie danach, wird sie unscharf (Chrome seit Version 53). Was groß wird, beginnt darum groß und schrumpft (wie der Pokal beim Überreichen) oder lässt `will-change` danach fallen. Jede Ebene kostet Breite × Höhe × 4 Byte × Pixeldichte² Speicher – eine bildschirmgroße bei 844×390 und dreifachen Pixeln etwa 12 MB; eine offizielle Höchstzahl an Ebenen gibt es nicht.",
    "`contain` und `content-visibility: auto` sparen Arbeit nur für Teile außerhalb des Bildschirms und nur an HTML-Hüllen, nicht innerhalb eines sichtbaren svg (in Safari verschwindet dabei mitunter Text in svg). Für unsere Spiele kaum ein Gewinn; der Code nutzt sie nicht.",
    "Pixeldichte: Für Canvas und WebGL ist eine Obergrenze von 2 üblich (Bewegungsabenteuer hat sie schon, `setPixelRatio(Math.min(…, 2))`); für ein svg im Seiteninhalt gibt es keinen Weg, es mit weniger Pixeln zu rastern. Ein großer, ganz stiller Hintergrund ließe sich als webp in doppelter Auflösung zeigen – üblich, aber ohne Empfehlung von Chrome und gegen unsere Regel, zu zeichnen statt Bilder zu nehmen; nur, wenn eine Messung zeigt, dass sein Rastern hakt.",
    "Bewegung außerhalb von React: Nach einer Rangliste der Macher von Motion (November 2025) sind CSS- und `element.animate()`-Animationen von `transform`/`opacity` am besten, danach `style.transform` aus einer `requestAnimationFrame`-Schleife, schlechter SVG-Attribute (`cx`, `d`) und CSS-Variablen, die sich jedes Bild ändern (eine geerbte Variable ließ 1 300 Elemente je Bild neu berechnen, etwa 8 ms). React-Neuzeichnen kostet leicht über 100 ms. Für die Kettenreaktion, deren Uhrtakt jedes Bild React die Maschine durchgehen lässt, ist das der größte Hebel (A-56).",
    'React Compiler (stabil seit Oktober 2025) setzt `memo`/`useMemo` selbst; offiziell nur als Babel-Plugin, seit August 2026 auch in oxc (`oxc-transform-react`), das sich in unser Bun-Plugin hängen ließe. Gemessen gibt es nur Metas Zahlen (bis zu 2,5-mal schnellere Interaktionen) – lohnt einen Versuch mit Messung (A-59). React 19.2 bringt `<Activity mode="hidden">`, das eine Seite versteckt und mit niedriger Vorfahrt vorab zeichnet (A-60).',
    "Arbeit verteilen: `scheduler.yield()` gibt es in Chrome seit 129 und Firefox seit 142, nicht in Safari; `requestIdleCallback` fehlt in Safari bis heute, `isInputPending` gilt als überholt. Großer Aufbau in Häppchen also mit `scheduler.yield()` und `setTimeout` als Ersatz.",
    "Messen auf echten Geräten: Chrome meldet Bilder über 50 ms mit „Long Animation Frames“ samt der Skripte darin – ein langes Bild ohne Skript heißt Malen. Safari kann das nicht, hat seit 26.2 aber INP; dort zählt man Lücken zwischen `requestAnimationFrame`-Aufrufen. Google rät, nur Zusammenfassungen beim Verlassen der Seite zu senden – passend zu Umamis Kontingent (A-58).",
    "Messwerkzeug: Chrome schreibt für jedes Bild in die Aufzeichnung, ob es gezeigt, verworfen oder nur teilweise gezeigt wurde (`PipelineReporter`) – eine unabhängige Gegenprobe für `bun run perf` (A-57). Das Fenster „Performance insights“ der DevTools gibt es seit Version 132 nicht mehr; seine Teile stehen im Performance-Fenster.",
    "Andere Zeichenwege: Laut einer Studie über mehrere Geräte (Januar 2026) halten DOM und SVG etwa 100 bewegte Dinge gut aus, bei 500 lassen sie nach; Canvas trägt weiter, WebGL am weitesten. Unsere Pfade ließen sich mit `new Path2D(d)` unverändert auf ein Canvas zeichnen – nur für eine Maschine mit sehr vielen bewegten Teilen eine Überlegung, kein Plan. Lottie und Rive hießen, alle Zeichnungen in deren Werkzeugen neu zu machen: nicht lohnend.",
    "SVGO rundet Pfade und fasst sie zusammen; dass das Malen oder Einlesen dadurch messbar schneller wird, belegt keine Quelle. Es würde vor allem das JavaScript kleiner machen – darum keine Idee daraus.",
  ],
  topics: [],
  games: [],
  excluded: [
    {
      title: "Lottie, Rive oder PixiJS statt SVG",
      why: "Alle Zeichnungen müssten in deren Werkzeugen neu entstehen; die Spiele haben meist weit unter 100 bewegte Dinge, wo SVG mit eigenen Ebenen reicht.",
    },
    {
      title: "`content-visibility` und `contain` für die Spiele",
      why: "Hilft nur bei Teilen außerhalb des Bildschirms an HTML-Hüllen; ein Spiel zeigt sein Bild ganz.",
    },
    {
      title: "Pfade mit SVGO verkleinern, um schneller zu malen",
      why: "Kein Beleg für einen Gewinn beim Malen; spart nur etwas Download.",
    },
    {
      title: "Qualität nach `navigator.deviceMemory` oder Prozessorkernen wählen",
      why: "Gibt es nur in Chrome, Safari begrenzt die Kernzahl gegen Fingerabdrücke; wenn überhaupt, dann nach gemessenen Bildlücken in den ersten Sekunden.",
    },
  ],
  ideas: ["A-54", "A-55", "A-56", "A-57", "A-58", "A-59", "A-60", "A-61"],
  sources: [
    { label: "Chrome: Hardware-beschleunigte SVG-Animationen (Chromium 89)", url: "https://developer.chrome.com/blog/hardware-accelerated-animations" },
    {
      label: "Chromium-Quelltext: compositor_animations.cc (wann eine SVG-Animation nicht auf die Grafikkarte darf)",
      url: "https://chromium.googlesource.com/chromium/src/+/main/third_party/blink/renderer/core/animation/compositor_animations.cc",
    },
    {
      label: "Chromium-Quelltext: compositing_reason_finder.cc",
      url: "https://chromium.googlesource.com/chromium/src/+/main/third_party/blink/renderer/core/paint/compositing/compositing_reason_finder.cc",
    },
    { label: "WebKit LBSE: bedingte Ebenen (Igalia, 14.07.2026)", url: "https://blogs.igalia.com/nzimmermann/posts/2026-07-14-lbse-conditional-layers/" },
    { label: "Chrome: Animierter Weichzeichner", url: "https://developer.chrome.com/blog/animated-blur" },
    { label: "Chrome: Neu rastern bei Größenänderung (will-change)", url: "https://developer.chrome.com/blog/re-rastering-composite" },
    { label: "web.dev: content-visibility", url: "https://web.dev/content-visibility" },
    { label: "Motion: Rangliste der Web-Animationen (November 2025)", url: "https://motion.dev/magazine/web-animation-performance-tier-list" },
    { label: "React Compiler 1.0 (07.10.2025)", url: "https://react.dev/blog/2025/10/07/react-compiler-1" },
    { label: "oxc: React-Compiler-Unterstützung (18.08.2026)", url: "https://oxc.rs/blog/2026-08-18-react-compiler-support" },
    { label: "React 19.2 (Activity)", url: "https://react.dev/blog/2025/10/01/react-19-2" },
    { label: "Chrome: scheduler.yield()", url: "https://developer.chrome.com/blog/use-scheduler-yield" },
    { label: "WebKit-Bug: requestIdleCallback", url: "https://bugs.webkit.org/show_bug.cgi?id=285049" },
    { label: "Chrome: Long Animation Frames API", url: "https://developer.chrome.com/docs/web-platform/long-animation-frames" },
    { label: "web.dev: LCP und INP in allen Browsern", url: "https://web.dev/blog/lcp-and-inp-are-now-baseline-newly-available" },
    {
      label: "Chromium: Ruckler in Aufzeichnungen finden (debug-janks)",
      url: "https://chromium.googlesource.com/chromium/src.git/+/main/docs/speed/debug-janks.md",
    },
    { label: "Journal of Imaging: DOM, SVG, Canvas und WebGL im Vergleich (Januar 2026)", url: "https://www.mdpi.com/2313-433X/12/1/45" },
    { label: "MDN: Path2D", url: "https://developer.mozilla.org/docs/Web/API/Path2D/Path2D" },
  ],
};
