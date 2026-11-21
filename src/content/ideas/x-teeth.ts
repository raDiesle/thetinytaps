import type { IdeaArea } from "./types";

/**
 * X as well, for Zähne putzen (/zaehne/): its first ideas were numbered among the other games' (`x-other-games.ts`)
 * before it got its own heading on /management/ – numbers stay fixed, so a new X idea takes the next free number of
 * both files.
 */
export const teethIdeas: IdeaArea = {
  key: "X-zaehne",
  prefix: "X",
  emoji: "🪥",
  title: "Zähne putzen",
  intro:
    "Das Zahnputz-Spiel (/zaehne/): Geschichte vom Zuckermonster, Waschbecken, Spiegel mit dem gesungenen Putzen in KAI-Reihenfolge, Ausspülen und der Wochenplan. Alles ohne Worte im Bild, im Takt des Lieds.",
  ideas: [
    {
      id: "X-01",
      emoji: "🦖",
      title: "Zähne vom Dino putzen",
      text: "Vor dem eigenen Putzen putzt das Kind einem Dino, Krokodil oder Teddy die Zähne: Wischen schrubbt die Zuckermonster weg, der Dino lacht mit blitzblanken Zähnen. Dann ist das Kind selbst dran.",
      why: "Kinder, die sich nicht putzen lassen wollen, machen es oft erst bei anderen gern.",
      effort: "M",
    },
    {
      id: "X-02",
      emoji: "☀️",
      title: "Morgens und abends",
      text: "Zähne putzen sieht morgens anders aus (Sonne geht auf, Frühstückskrümel) als abends (Mond, Schlafanzug, danach Gute Nacht). Dazu ein Wochenbild mit zwei Sternen pro Tag.",
      why: "Zweimal täglich wird sichtbar; abends direkter Übergang ins Bett.",
      effort: "S",
      done: true,
    },
    {
      id: "X-13",
      emoji: "🚒",
      title: "Zahnputzlieder mit Thema",
      text: "Zähne putzen bekommt mehr gesungene Lieder zum Aussuchen, jedes mit eigenem Bild: Feuerwehr spritzt die Zuckermonster weg, ein Krokodil hält das Maul auf, ein Bagger baggert. Gemacht wie das Zahnputzlied (/zahnputzlied), ein Vers pro Schritt.",
      why: "Eltern suchen „zahnputzlied feuerwehr“, „zahnputzlied krokodil“ und „zahnputzlied lustig“. Ein neues Lied macht das tägliche Putzen wieder spannend.",
      effort: "S",
    },
    {
      id: "X-16",
      emoji: "✨",
      title: "Zähne putzen: ein Zahn blitzt, dann klebt der Stern",
      text: "Am Ende blitzt ein sauberer Zahn einmal kurz auf, dann wird der Stern auf den Wochenplan geklebt, mit einem leisen Patsch. Sonst fliegt nichts. Gehört zu A-30.",
      why: "Die Belohnung ist das, was geputzt wurde, und der Stern, der bleibt.",
      effort: "S",
    },
    {
      id: "X-17",
      emoji: "👐",
      title: "Mama oder Papa putzt nach",
      text: "Nach dem gesungenen Putzen und vor dem Ausspülen kommt ein kurzer, ruhiger Teil (etwa 30 Sekunden, eine leise Melodie im Takt des Lieds): im Spiegel greift eine große Hand mit der Zahnbürste von der Seite ins Bild und fährt noch einmal sanft über alle Zähne, Seite für Seite, der Mund bleibt weit offen. Die Stimme sagt am Anfang einmal: „Jetzt putzt Mama oder Papa nach.“ Läuft wie alles nach der Uhr, ist auf der Leiste ein eigener Abschnitt und lässt sich überspringen.",
      why: "Zahnärzte raten, bei Kleinkindern immer nachzuputzen, bis das Kind etwa im Schulalter selbst gründlich putzt (Empfehlung der Kinderzahnärzte; vor dem Umsetzen nachlesen, bis zu welchem Alter genau). Heute endet das Spiel, wenn das Kind fertig ist – genau dann, wenn die Eltern dran wären. Das Spiel macht das Nachputzen zu einem selbstverständlichen Teil des Ablaufs statt zu einem Streit danach.",
      effort: "M",
    },
    {
      id: "X-18",
      emoji: "💦",
      title: "Ausspucken, nicht ausspülen",
      text: "Am Ende, vor dem Ausspülen der Bürste, zeigt der Spiegel das Gesicht über dem Waschbecken: die Lippen gespitzt, ein Klecks Schaum fällt ins Becken, ein leises „Ptü“. Kein Becher Wasser zum Mundspülen. Ein Bild mit zwei Takten, ohne Worte im Bild.",
      why: "Empfohlen wird, den Schaum nur auszuspucken und nicht mit Wasser nachzuspülen, damit das Fluorid an den Zähnen bleibt. Kinder machen nach, was sie sehen – und Ausspucken üben viele Zweijährige erst.",
      effort: "S",
    },
    {
      id: "X-19",
      emoji: "🥣",
      title: "Morgens Frühstück statt Süßigkeiten",
      text: "Die Geschichte am Anfang zeigt morgens, was zum Frühstück gegessen wurde: ein Honigbrot, ein Müsli mit Milch, ein Becher Kakao gleiten in den Mund, und auch daraus werden Krümel und dann Zuckermonster. Abends bleiben die drei Süßigkeiten. Die Tageszeit kommt wie bisher von der Uhr.",
      why: "So lernt das Kind, dass auch normales Essen Spuren an den Zähnen lässt und nicht nur Süßes – und das Morgenputzen nach dem Frühstück bekommt seinen eigenen Grund.",
      effort: "M",
    },
    {
      id: "X-20",
      emoji: "🍭",
      title: "Die Monster sehen aus wie ihre Süßigkeit",
      text: "Jedes Zuckermonster trägt die Farbe und ein kleines Merkmal der Süßigkeit, aus deren Krümeln es gewachsen ist: braun mit Schokostückchen, rot-weiß geringelt vom Lolli, bunt gepunktet vom Gummibärchen. Im Spiegel sitzen dieselben Monster wieder auf den Zähnen.",
      why: "Verbindet die Geschichte vom Anfang sichtbar mit dem Putzen: „Da ist ja das Lolli-Monster!“ – Kinder erkennen wieder und erzählen mit.",
      effort: "S",
    },
    {
      id: "X-21",
      emoji: "🪥",
      title: "Die eigene Zahnbürste aussuchen",
      text: "Am Waschbecken stehen beim ersten Mal drei Becher mit drei Zahnbürsten in verschiedenen Farben (mit Dino-, Stern- oder Herzgriff). Das Kind tippt eine an, die Hand nimmt genau diese, und von da an ist sie seine: sie steht im Becher, putzt im Spiegel und wird am Ende ausgespült. Ein Tipp auf die eigene Bürste am Waschbecken wechselt sie. Es gibt kein Falsch, jede Bürste ist richtig.",
      why: "Selbst etwas wählen dürfen ist bei Zweijährigen das stärkste Mittel gegen „Ich will nicht!“ (so raten es viele Elternratgeber, etwa Imlau: eine Wahl lassen, wo es keine Rolle spielt). Und das Spiel wird ein bisschen das eigene.",
      effort: "M",
    },
    {
      id: "X-22",
      emoji: "🍚",
      title: "Reiskorn oder Erbse: die Zahnpasta nach dem Alter",
      text: "Heute drückt die Tube immer einen erbsengroßen Klecks auf die Bürste. Für Kinder unter zwei Jahren ist ein Reiskorn richtig. Eine Wahl hinter ⚙️ („unter 2 Jahren / ab 2 Jahren“) macht den Klecks am Waschbecken entsprechend klein oder groß. Gegen den Grundsatz, keine Einstellungen hinzuzufügen – nur umsetzen, wenn Eltern das brauchen.",
      why: "Die Empfehlung der deutschen Fachgesellschaften seit 2021: vom ersten Zahn bis zum zweiten Geburtstag eine reiskorngroße Menge Kinderzahnpasta, danach erbsengroß. Eltern schauen sich genau das im Spiel ab.",
      effort: "S",
    },
    {
      id: "X-23",
      emoji: "🔇",
      title: "Nur das Lied: putzen mit dem echten Spiegel",
      text: "Eine Art zu spielen ohne Bildschirm: das Zahnputzlied läuft, der Bildschirm wird dunkel und zeigt nur noch einen schlichten Fortschritt (die sieben Schritte als kleine Zähne, die nacheinander weiß werden), damit das Tablet vor der Badezimmertür liegen kann. Das Kind putzt am echten Waschbecken vor dem echten Spiegel, das Lied sagt die Schritte. Am Ende klebt der Stern wie sonst.",
      why: "Passt zu dem, was wir Eltern sagen („erst die echte Welt“): das Spiel bringt das Putzen bei und kann sich dann selbst zurücknehmen. Viele Eltern wollen kein Tablet im Bad.",
      effort: "M",
    },
    {
      id: "X-24",
      emoji: "📷",
      title: "Der eigene Mund im Spiegel (Frontkamera)",
      text: "Statt des gezeichneten Gesichts zeigt der Spiegel das Kind selbst über die Frontkamera, und die Zuckermonster sitzen über seinem eigenen Mund, wo gerade geputzt wird; eine wischt weg, sobald der Schritt vorbei ist. Nichts wird gespeichert oder gesendet. Die Kamera würde nur auf Wunsch der Eltern eingeschaltet und bräuchte einen Absatz in der Datenschutzerklärung.",
      why: "Kinder schauen sich am liebsten selbst an, und das echte Putzen und das Spiel wären eins. Aber: die Kamera ist für viele Eltern heikel, und der Mund wird nicht wirklich erkannt – eher eine Frage zum Entscheiden als eine sichere Sache.",
      effort: "L",
    },
    {
      id: "X-25",
      emoji: "👫",
      title: "Geschwister putzen zusammen",
      text: "Putzen zwei Kinder gleichzeitig, tippt ein Großer am Ende auf die beiden Sticker vom Regal (Fuchsmädchen und Bärenjunge), und jedes Kind bekommt seinen Stern in einer eigenen Wochenreihe. Sonst bleibt alles gleich: ein Lied, ein Spiegel.",
      why: "Mit Geschwistern putzt man abends meist zusammen; heute bekommt nur einer den Stern, und darüber gibt es Streit.",
      effort: "M",
    },
  ],
};
