// The 18 worlds of "Bewegungsabenteuer", each with a short look-and-mood brief for the 3D artists.
import type { World } from "./types";

export const WORLDS: World[] = [
  {
    id: "space",
    name: "Weltraum",
    emoji: "🚀",
    look: "Ein tiefblauer, nie schwarzer Himmel voller runder, bonbonbunter Planeten und funkelnder Sterne, dazu eine kleine runde Rakete mit großen Fenstern. Weiches Licht von einer lächelnden Sonne, alles schwebt langsam und ruhig.",
  },
  {
    id: "underwater",
    name: "Unterwasserwelt",
    emoji: "🐠",
    look: "Türkisblaues Wasser mit Lichtstrahlen von oben, runde Korallen in Rosa, Orange und Gelb und viele glitzernde Luftblasen. Rundliche Fische mit großen Augen schwimmen gemächlich, die Stimmung ist sanft und verträumt.",
  },
  {
    id: "jungle",
    name: "Dschungel",
    emoji: "🌴",
    look: "Riesige, runde Blätter in vielen Grüntönen, bunte Blüten und Lianen, durch die warmes, goldenes Licht fällt. Freundliche Tiere mit runden Formen gucken neugierig hervor, alles wirkt fröhlich und lebendig.",
  },
  {
    id: "construction",
    name: "Baustelle",
    emoji: "🏗️",
    look: "Knallgelbe Bagger und Kräne mit runden Kanten, orange-weiße Hütchen und Sandhaufen unter hellem Sonnenlicht. Die Maschinen haben freundliche Scheinwerfer-Augen, die Stimmung ist geschäftig, aber ganz gemütlich.",
  },
  {
    id: "railway",
    name: "Eisenbahn",
    emoji: "🚂",
    look: "Eine kleine rote Dampflok mit bunten Waggons fährt durch sanfte grüne Hügel, kleine Bahnhöfe mit Blumenkästen und Signallampen. Weiche Dampfwölkchen und warmes Nachmittagslicht machen alles gemütlich.",
  },
  {
    id: "fire_station",
    name: "Feuerwache",
    emoji: "🚒",
    look: "Eine helle Feuerwache mit einem runden, roten Feuerwehrauto, glänzender Glocke und gelben Helmen an der Wand. Es gibt nur kleine, harmlose Rauchwölkchen, nie echtes Feuer, und die Stimmung ist mutig und hilfsbereit.",
  },
  {
    id: "magic_castle",
    name: "Zauberschloss",
    emoji: "🏰",
    look: "Ein Schloss aus rosa und lila Steinen mit runden Türmen, Fahnen und Fenstern, die warm leuchten. Überall schweben Glitzerfunken und Laternen, ein kleiner, kuschliger Drache schläft friedlich.",
  },
  {
    id: "farm",
    name: "Bauernhof",
    emoji: "🐄",
    look: "Eine rote Scheune, ein grüner Zaun, goldene Strohballen und ein Gemüsebeet unter der Morgensonne. Rundliche Hühner, Kühe und Schweinchen laufen herum, alles duftet nach Morgen und ist ruhig und freundlich.",
  },
  {
    id: "pirate_island",
    name: "Pirateninsel",
    emoji: "🏝️",
    look: "Eine kleine Insel mit gelbem Sand, schiefen Palmen und türkisem Wasser, davor ein bunt bemaltes Holzschiff mit lustiger Flagge. Ein Papagei und ein freundliches Krokodil leben hier, die Stimmung ist abenteuerlich und sonnig.",
  },
  {
    id: "cloud_world",
    name: "Wolkenland",
    emoji: "☁️",
    look: "Dicke, weiche Wolken in Weiß, Rosa und Hellblau, auf denen man laufen und federn kann, dazwischen Regenbögen. Pastellfarbenes, sanftes Licht und schwebende Drachen und Vögel machen es leicht und luftig.",
  },
  {
    id: "winter_forest",
    name: "Winterwald",
    emoji: "❄️",
    look: "Runde Tannen mit dicken Schneemützen, glitzernder Schnee und ein hellblauer Himmel mit sanft fallenden Flocken. Warmes Laternenlicht und kleine Waldtiere mit Schals machen die Kälte kuschelig.",
  },
  {
    id: "garden",
    name: "Garten",
    emoji: "🌻",
    look: "Bunte Blumenbeete, eine große Sonnenblume, ein kleiner Teich und ein Gartenhäuschen unter strahlender Sonne. Schmetterlinge und Bienen mit runden Körpern fliegen umher, alles ist warm, friedlich und voller Farben.",
  },
  {
    id: "circus",
    name: "Zirkus",
    emoji: "🎪",
    look: "Ein rot-gelb gestreiftes Zelt mit einer runden Manege, bunten Lichterketten und weichen Scheinwerfern. Lustige Tiere und Clowns ohne grelle Schminke treten auf, die Stimmung ist festlich und heiter.",
  },
  {
    id: "dino_valley",
    name: "Dinotal",
    emoji: "🦕",
    look: "Ein grünes Tal mit riesigen Farnen, Riesenpilzen, einem Bach und sanften, rauchlosen Vulkanbergen im Hintergrund. Die Dinos sind rund, bunt und lächeln, die Stimmung ist staunend und freundlich.",
  },
  {
    id: "crystal_cave",
    name: "Kristallhöhle",
    emoji: "💎",
    look: "Eine helle Höhle voller Kristalle in Blau, Lila und Grün, die von innen sanft leuchten und Licht auf die Wände werfen. Es ist nie dunkel oder eng, Glühwürmchen und kleine Fledermäuse mit großen Augen machen es geheimnisvoll und gemütlich.",
  },
  {
    id: "toy_town",
    name: "Spielzeugstadt",
    emoji: "🧸",
    look: "Häuser aus bunten Bauklötzen, Straßen wie Holzbahnen, Aufziehtiere, Teddys und Kreisel in kräftigen Grundfarben. Alles glänzt wie lackiertes Holz im warmen Licht, verspielt und fröhlich.",
  },
  {
    id: "beach",
    name: "Strand",
    emoji: "🏖️",
    look: "Weicher, heller Sand, kleine sanfte Wellen, bunte Muscheln, Sandburgen und ein gestreifter Sonnenschirm. Helles Sommerlicht, Möwen und Krebse machen die Stimmung luftig und ausgelassen.",
  },
  {
    id: "music_room",
    name: "Musikzimmer",
    emoji: "🎵",
    look: "Ein gemütliches Zimmer mit großen, runden Instrumenten: Trommel, Rasseln, Glocken, ein Bass und ein leuchtender Tanzboden. Bunte Noten schweben in der Luft und tanzen im Takt, alles ist warm und rhythmisch.",
  },
];
