// Stories of everyday feelings – disappointed, jealous, disgusted, embarrassed,
// excited, and in a second round angry at leaving, frustrated, impatient, scared,
// sad, overwhelmed, proud, missing someone, shy, bored, caring, startled – at home,
// out and about, in the kindergarten.
// Built and played like the kindergarten stories (`Situation`, `KitaPlay`): the
// little bear has the feeling and helps himself, step by step, with a body
// trick, saying how he feels, or doing something else. The feeling itself is
// never the not-so-good idea; only what hurts someone or breaks something is.
// Ideas C-01 to C-18 (without C-19 to C-22, which are no stories) and C-23 to C-28 on /management/.

import type { Situation } from "./kita";

/** The stories where the little bear helps himself with a feeling, after the kindergarten's on the start screen. */
export const SELF_SITUATIONS: Situation[] = [
  {
    id: "cookie",
    emoji: "🍪",
    title: "Enttäuscht, Keks zerbrochen",
    caption: "Keks zerbrochen, Bär ist traurig",
    intro: [
      { narration: "Der kleine Bär und der Fuchs essen Kekse." },
      { narration: "Knack! Der Keks vom kleinen Bären bricht durch. Er ist so enttäuscht!", sound: "pop" },
    ],
    steps: [
      {
        caption: "Kuscheltier drücken",
        question: "Der Keks ist zerbrochen, der kleine Bär ist traurig. Was kann er tun?",
        beats: [{ narration: "Der kleine Bär drückt sein Kuscheltier ganz fest.", line: "Ich bin traurig." }],
        instead: { caption: "Becher umwerfen", answer: "Hmm, jetzt ist die Milch auf dem Fuchs. Drück lieber dein Kuscheltier ganz fest." },
      },
      {
        caption: "Mit dem Fuchs teilen",
        question: "Der Fuchs hat keinen Keks mehr. Was kann der kleine Bär tun?",
        beats: [
          { narration: "Der kleine Bär gibt dem Fuchs eine Hälfte.", line: "Für dich!" },
          { line: "Danke, Bär!", sound: "pop" },
        ],
        instead: { caption: "Zunge rausstrecken", answer: "Hmm, jetzt ist der Fuchs traurig. Teil lieber mit ihm." },
      },
    ],
    outro: [{ narration: "Toll! Traurig sein ist okay. Kuscheltier drücken und teilen.", sound: "cheer" }],
    endCaption: "Bär und Fuchs essen je eine Hälfte",
  },
  {
    id: "baby",
    emoji: "👶",
    title: "Eifersüchtig aufs Baby",
    caption: "Großer Bär kuschelt das Baby, Bär ist eifersüchtig",
    intro: [{ narration: "Der große Bär kuschelt mit dem Bärenbaby." }, { narration: "Der kleine Bär schaut zu. Er will auch! Er ist eifersüchtig." }],
    steps: [
      {
        caption: "„Ich will auch kuscheln!“ sagen",
        question: "Der große Bär kuschelt mit dem Baby. Was kann der kleine Bär tun?",
        beats: [{ narration: "Der kleine Bär sagt:", line: "Ich will auch kuscheln!" }, { line: "Komm her! Hier ist Platz für dich." }],
        instead: { caption: "Das Baby hauen", answer: "Hmm, Hauen tut weh. Sag lieber: Ich will auch kuscheln!", sound: "aua" },
      },
      {
        caption: "Windel holen",
        question: "Das Baby braucht eine frische Windel. Was kann der kleine Bär tun?",
        beats: [{ narration: "Der kleine Bär holt selbst eine Windel.", line: "Hier!" }, { line: "Danke! Das hilft mir sehr." }],
        instead: { caption: "Rassel wegnehmen", answer: "Hmm, das ist die Rassel vom Baby. Jetzt weint es. Hol lieber eine Windel." },
      },
      {
        caption: "Dem Baby vorsingen",
        question: "Das Baby ist müde. Was kann der kleine Bär tun?",
        beats: [
          { narration: "Der kleine Bär singt dem Baby ein Lied.", sound: "musicbox" },
          { narration: "Das Baby lacht. Und der große Bär kuschelt beide.", sound: "pop" },
        ],
        instead: { caption: "Laut trommeln", answer: "Hmm, vom Krach weint das Baby. Sing ihm lieber ein Lied." },
      },
    ],
    outro: [{ narration: "Super! Sagen, was du brauchst, helfen, vorsingen. Jetzt kuscheln alle drei.", sound: "cheer" }],
    endCaption: "Großer Bär kuschelt beide",
  },
  {
    id: "broccoli",
    emoji: "🥦",
    title: "Igitt, Brokkoli",
    caption: "Brokkoli auf dem Teller, Bär mag ihn nicht",
    intro: [
      { narration: "Der kleine Bär, der Fuchs und der große Bär essen zusammen." },
      { narration: "Auf dem Teller liegt Brokkoli. Igitt! Der kleine Bär mag ihn nicht." },
    ],
    steps: [
      {
        caption: "„Nein, danke“ sagen",
        question: "Der kleine Bär mag keinen Brokkoli. Was kann er tun?",
        beats: [{ narration: "Der kleine Bär sagt:", line: "Nein, danke. Das mag ich nicht." }, { line: "Okay. Du musst nicht." }],
        instead: { caption: "Teller runterwerfen", answer: "Hmm, jetzt ist der Teller kaputt. Sag lieber: Nein, danke.", sound: "crash" },
      },
      {
        caption: "Erst mal riechen",
        question: "Der Brokkoli liegt noch da. Was kann der kleine Bär tun?",
        beats: [{ narration: "Der kleine Bär riecht ganz vorsichtig daran. Schnüff, schnüff." }, { line: "Hm. Der riecht wie ein kleiner Baum." }],
        instead: { caption: "Auf den Tisch spucken", answer: "Hmm, Spucken ist eklig für alle. Riech lieber erst mal." },
      },
      {
        caption: "An den Rand legen",
        question: "Heute mag der kleine Bär ihn nicht essen. Was kann er tun?",
        beats: [
          { narration: "Er legt den Brokkoli an den Tellerrand.", line: "Vielleicht ein andermal." },
          { narration: "Und isst seine Kartoffeln.", sound: "pop" },
        ],
        instead: { caption: "Brokkoli auf den Fuchs werfen", answer: "Hmm, jetzt ist der Fuchs ganz schmutzig. Leg ihn lieber an den Rand." },
      },
    ],
    outro: [{ narration: "Prima! Nein danke sagen, mal riechen, an den Rand legen. Niemand muss alles mögen.", sound: "cheer" }],
    endCaption: "Bär isst Kartoffeln, Brokkoli am Rand",
  },
  {
    id: "oops",
    emoji: "💧",
    title: "Hoppla, in die Hose",
    caption: "Kleine Pfütze, Bär ist es peinlich",
    intro: [{ narration: "Der kleine Bär spielt im Kindergarten." }, { narration: "Hoppla! Er hat in die Hose gemacht. Das ist ihm peinlich." }],
    steps: [
      {
        caption: "Der Erzieherin sagen",
        question: "Die Hose ist nass. Was kann der kleine Bär tun?",
        beats: [
          { narration: "Der kleine Bär geht zur Erzieherin.", line: "Hoppla! Meine Hose ist nass." },
          { line: "Das macht nichts. Das passiert jedem mal." },
        ],
        instead: { caption: "Nass weiterspielen", answer: "Hmm, in der nassen Hose wird ihm kalt. Sag es lieber der Erzieherin." },
      },
      {
        caption: "Frische Hose holen",
        question: "Der kleine Bär braucht eine trockene Hose. Was kann er tun?",
        beats: [{ narration: "Er holt selbst eine frische Hose aus seinem Fach." }, { line: "Toll, das kannst du schon allein!" }],
        instead: { caption: "Pfütze verwischen", answer: "Hmm, jetzt ist der ganze Boden nass und rutschig. Hol lieber eine trockene Hose." },
      },
      {
        caption: "Nasse Hose einpacken",
        question: "Die nasse Hose ist aus. Was kann der kleine Bär tun?",
        beats: [{ narration: "Er steckt die nasse Hose in die Tüte. Fertig!", sound: "pop" }],
        instead: { caption: "Hose in die Ecke werfen", answer: "Hmm, da liegt sie nass herum. Steck sie lieber in die Tüte." },
      },
    ],
    outro: [{ narration: "Super! Sagen, umziehen, einpacken. Ein Hoppla ist nicht schlimm.", sound: "cheer" }],
    endCaption: "Bär in frischer Hose spielt wieder",
  },
  {
    id: "snow",
    emoji: "❄️",
    title: "Aufgeregt, es schneit",
    caption: "Erster Schnee, Bär ist ganz aufgeregt",
    intro: [{ narration: "Der kleine Bär schaut aus dem Fenster." }, { narration: "Es schneit! Der erste Schnee! Der kleine Bär ist ganz aufgeregt." }],
    steps: [
      {
        caption: "Laut jubeln",
        question: "Es schneit! Der kleine Bär ist ganz aufgeregt. Was kann er tun?",
        beats: [{ narration: "Der kleine Bär jubelt ganz laut:", line: "Juhu! Schnee!" }],
        instead: { caption: "Auf dem Sessel toben", answer: "Hmm, jetzt ist die Lampe umgefallen. Jubel lieber ganz laut: Juhu!", sound: "crash" },
      },
      {
        caption: "Stiefel und Jacke anziehen",
        question: "Der kleine Bär will in den Schnee. Was kann er tun?",
        beats: [{ narration: "Erst zieht er selbst Stiefel und Jacke an.", line: "Fertig! Komm mit raus!" }, { line: "Ich komme!" }],
        instead: { caption: "Im Schlafanzug rausrennen", answer: "Hmm, im Schlafanzug ist es draußen eiskalt. Zieh lieber Stiefel und Jacke an." },
      },
      {
        caption: "Schnee-Engel machen",
        question: "Draußen liegt Schnee. Was kann der kleine Bär tun?",
        beats: [{ narration: "Er legt sich in den Schnee und macht einen Schnee-Engel.", sound: "boing" }],
        instead: { caption: "Schneeball ins Gesicht werfen", answer: "Hmm, ins Gesicht tut weh. Mach lieber einen Schnee-Engel.", sound: "aua" },
      },
    ],
    outro: [{ narration: "Juhu! Jubeln, anziehen, Schnee-Engel. Freude darf ganz groß sein.", sound: "cheer" }],
    endCaption: "Bär und großer Bär bauen einen Schneemann",
  },
  // The second round (ideas C-01 to C-15 and C-23 to C-28): everyday moments where the feeling comes up – leaving,
  // a screen going off, a no, waiting, loud noises, fear, missing someone, pride, care for a friend.
  {
    id: "leave",
    emoji: "🛝",
    title: "Wütend, wir gehen heim",
    caption: "Großer Bär wartet am Tor, Bär will nicht gehen",
    intro: [
      { narration: "Der kleine Bär sitzt oben auf der Rutsche." },
      { narration: "Der große Bär wartet am Tor.", line: "Komm, wir gehen nach Hause!" },
      { narration: "Der kleine Bär will nicht. Er ist wütend." },
    ],
    steps: [
      {
        caption: "„Tschüss, Rutsche!“ winken",
        question: "Der kleine Bär will nicht nach Hause. Was kann er tun?",
        beats: [
          { narration: "Er rutscht ein letztes Mal.", sound: "slide" },
          { narration: "Dann winkt er.", line: "Tschüss, Rutsche! Bis morgen!" },
        ],
        instead: { caption: "Wegrennen", answer: "Hmm, da vorne ist die Straße. Das ist gefährlich. Wink lieber: Tschüss, Rutsche!" },
      },
      {
        caption: "Schatz-Stein einstecken",
        question: "Der kleine Bär ist noch ein bisschen wütend. Was kann er tun?",
        beats: [{ narration: "Er findet einen schönen Stein und steckt ihn ein.", line: "Mein Schatz! Den nehm ich mit." }],
        instead: { caption: "Schaufel werfen", answer: "Hmm, die Schaufel trifft den großen Bären. Steck lieber einen schönen Stein ein.", sound: "aua" },
      },
      {
        caption: "Laufrad selbst schieben",
        question: "Das Laufrad steht am Tor. Was kann der kleine Bär tun?",
        beats: [{ narration: "Der kleine Bär schiebt sein Laufrad selbst.", line: "Ich mach das!" }, { line: "Toll! Los geht's." }],
        instead: { caption: "Sand werfen", answer: "Hmm, Sand in den Augen tut weh. Schieb lieber selbst dein Laufrad.", sound: "aua" },
      },
    ],
    outro: [{ narration: "Super! Tschüss sagen, einen Schatz mitnehmen, selbst schieben. Und ab nach Hause!", sound: "cheer" }],
    endCaption: "Bär fährt stolz auf dem Laufrad los",
  },
  {
    id: "screen",
    emoji: "📺",
    title: "Traurig, Sendung zu Ende",
    caption: "Sendung ist aus, Bär ist traurig und wütend",
    intro: [
      { narration: "Der kleine Bär und der Fuchs schauen eine Sendung." },
      { narration: "Jetzt ist sie zu Ende. Der kleine Bär ist traurig und wütend." },
    ],
    steps: [
      {
        caption: "Tschüss sagen und zuklappen",
        question: "Die Sendung ist zu Ende. Was kann der kleine Bär tun?",
        beats: [
          { narration: "Der kleine Bär winkt.", line: "Tschüss! Bis morgen!" },
          { narration: "Dann klappt er das Tablet selbst zu.", sound: "pop" },
        ],
        instead: { caption: "Tablet werfen", answer: "Hmm, jetzt ist das Tablet kaputt. Sag lieber Tschüss und klapp es zu.", sound: "crash" },
      },
      {
        caption: "Kissen fest drücken",
        question: "Der kleine Bär ist noch wütend. Was kann er tun?",
        beats: [{ narration: "Er drückt sein Kissen ganz fest. Und noch mal.", sound: "breath" }, { line: "Puh. Schon besser." }],
        instead: { caption: "Gegen den Tisch treten", answer: "Hmm, das tut am Fuß weh. Drück lieber dein Kissen ganz fest.", sound: "aua" },
      },
      {
        caption: "Mit der Eisenbahn spielen",
        question: "Der kleine Bär will weiterspielen. Was kann er tun?",
        beats: [
          { narration: "Er holt seine Eisenbahn und spielt die Sendung nach.", line: "Tschu-tschu!" },
          { line: "Ich spiel mit!", sound: "pop" },
        ],
        instead: { caption: "Kissen auf den Fuchs werfen", answer: "Hmm, das Kissen trifft den Fuchs im Gesicht. Spiel lieber mit deiner Eisenbahn." },
      },
    ],
    outro: [{ narration: "Prima! Tschüss sagen, Kissen drücken, selbst weiterspielen.", sound: "cheer" }],
    endCaption: "Bär und Fuchs spielen mit der Eisenbahn",
  },
  {
    id: "checkout",
    emoji: "🛒",
    title: "Sauer an der Kasse",
    caption: "Bär will einen Lolli, großer Bär sagt Nein",
    intro: [
      { narration: "Der kleine Bär sitzt im Einkaufswagen. An der Kasse gibt es Lollis." },
      { narration: "Der große Bär sagt:", line: "Heute keinen Lolli." },
      { narration: "Der kleine Bär ist sauer!" },
    ],
    steps: [
      {
        caption: "„Ich bin sauer!“ sagen",
        question: "Der kleine Bär bekommt keinen Lolli. Was kann er tun?",
        beats: [{ narration: "Der kleine Bär sagt ganz laut:", line: "Ich bin sauer!" }, { line: "Ja, das verstehe ich." }],
        instead: { caption: "Lollis runterfegen", answer: "Hmm, jetzt liegen alle Lollis auf dem Boden. Sag lieber laut: Ich bin sauer!", sound: "crash" },
      },
      {
        caption: "Fäuste fest drücken",
        question: "Der kleine Bär ist noch sauer. Was kann er tun?",
        beats: [{ narration: "Er drückt die Fäuste ganz fest zu. Und macht sie wieder auf.", sound: "breath" }, { line: "Puh. Schon besser." }],
        instead: { caption: "Treten", answer: "Hmm, Treten tut dem großen Bären weh. Drück lieber die Fäuste ganz fest.", sound: "aua" },
      },
      {
        caption: "Bananen aufs Band legen",
        question: "Die Bananen müssen aufs Band. Was kann der kleine Bär tun?",
        beats: [
          { narration: "Der kleine Bär legt die Bananen selbst aufs Band." },
          { line: "Danke! Willst du den Knopf drücken?" },
          { narration: "Piep!", sound: "chime" },
        ],
        instead: { caption: "Lolli einstecken", answer: "Hmm, der Lolli gehört dem Laden. Leg lieber die Bananen aufs Band." },
      },
    ],
    outro: [{ narration: "Toll! Sagen, wie du dich fühlst, Fäuste drücken, mithelfen.", sound: "cheer" }],
    endCaption: "Bär drückt an der Kasse den Knopf",
  },
  {
    id: "jacket",
    emoji: "🧥",
    title: "Frust, die Jacke klemmt",
    caption: "Jacke geht nicht an, Bär ist wütend",
    intro: [{ narration: "Der kleine Bär will sich selbst anziehen." }, { narration: "Aber der Ärmel ist verdreht. Die Jacke geht nicht an! Er ist wütend." }],
    steps: [
      {
        caption: "Tief pusten",
        question: "Die Jacke geht nicht an. Was kann der kleine Bär tun?",
        beats: [{ narration: "Der kleine Bär pustet ganz tief aus. Puuuh.", sound: "breath" }, { narration: "Schon ein bisschen ruhiger." }],
        instead: { caption: "Schuh wegwerfen", answer: "Hmm, jetzt ist die Vase kaputt. Puste lieber ganz tief.", sound: "crash" },
      },
      {
        caption: "Jacken-Trick",
        question: "Der Ärmel ist verdreht. Was kann der kleine Bär tun?",
        beats: [
          { narration: "Er legt die Jacke auf den Boden und steckt die Arme rein." },
          { narration: "Hui, über den Kopf!", line: "Ich hab sie an!", sound: "boing" },
        ],
        instead: { caption: "An der Jacke reißen", answer: "Hmm, jetzt ist die Jacke kaputt. Probier lieber den Jacken-Trick." },
      },
      {
        caption: "„Hilf mir bitte!“ sagen",
        question: "Der Reißverschluss klemmt. Was kann der kleine Bär tun?",
        beats: [
          { narration: "Der kleine Bär sagt:", line: "Hilf mir bitte!" },
          { line: "Gern. Ich halte unten fest, du ziehst hoch." },
          { narration: "Ratsch! Er zieht ihn selbst hoch.", sound: "pop" },
        ],
        instead: { caption: "Den großen Bären hauen", answer: "Hmm, Hauen tut weh. Sag lieber: Hilf mir bitte!", sound: "aua" },
      },
    ],
    outro: [{ narration: "Geschafft! Pusten, anders probieren, um Hilfe bitten.", sound: "cheer" }],
    endCaption: "Bär steht stolz in seiner Jacke",
  },
  {
    id: "pancake",
    emoji: "🥞",
    title: "Ungeduldig, Warten aufs Essen",
    caption: "Großer Bär brät Pfannkuchen, Bär hat Hunger",
    intro: [{ narration: "Der große Bär macht Pfannkuchen." }, { narration: "Der kleine Bär hat so Hunger! Warten ist schwer." }],
    steps: [
      {
        caption: "Ein Lied singen",
        question: "Die Pfannkuchen brauchen noch. Was kann der kleine Bär tun?",
        beats: [{ narration: "Der kleine Bär singt ein Lied.", sound: "musicbox" }, { line: "Schön! Gleich sind sie fertig." }],
        instead: { caption: "Teller runterschieben", answer: "Hmm, jetzt ist der Teller kaputt. Sing lieber ein Lied.", sound: "crash" },
      },
      {
        caption: "Löffel hinlegen",
        question: "Es dauert noch. Was kann der kleine Bär tun?",
        beats: [{ narration: "Er legt selbst die Löffel auf den Tisch. Einer, zwei.", line: "Ich helfe!", sound: "pop" }],
        instead: { caption: "In die Pfanne fassen", answer: "Hmm, die Pfanne ist heiß. Leg lieber die Löffel hin.", sound: "aua" },
      },
      {
        caption: "Aus dem Fenster gucken",
        question: "Noch ein kleines bisschen warten. Was kann der kleine Bär tun?",
        beats: [
          { narration: "Er guckt aus dem Fenster.", line: "Da fliegt ein Vogel!" },
          { narration: "Und da kommt der Pfannkuchen!", sound: "pop" },
        ],
        instead: { caption: "Auf den Teller hauen", answer: "Hmm, jetzt hat der Teller einen Sprung. Guck lieber aus dem Fenster.", sound: "crash" },
      },
    ],
    outro: [{ narration: "Mmh! Singen, helfen, gucken. Und schon ist das Warten vorbei.", sound: "cheer" }],
    endCaption: "Bär isst Pfannkuchen",
  },
  {
    id: "vacuum",
    emoji: "🌀",
    title: "Angst vorm Staubsauger",
    caption: "Großer Bär saugt, Bär erschrickt",
    intro: [{ narration: "Der große Bär saugt Staub. Brumm!", sound: "rumble" }, { narration: "Der kleine Bär erschrickt. So laut!" }],
    steps: [
      {
        caption: "Ohren zuhalten",
        question: "Der Staubsauger ist so laut. Was kann der kleine Bär tun?",
        beats: [{ narration: "Der kleine Bär hält sich die Ohren zu." }, { line: "Schon leiser." }],
        instead: { caption: "Staubsauger treten", answer: "Hmm, das tut am Fuß weh. Halt dir lieber die Ohren zu.", sound: "aua" },
      },
      {
        caption: "Kuscheltier holen",
        question: "Der kleine Bär hat noch ein bisschen Angst. Was kann er tun?",
        beats: [{ narration: "Er klettert aufs Sofa und hält sein Kuscheltier ganz fest." }],
        instead: { caption: "Am Kabel ziehen", answer: "Hmm, am Kabel ziehen ist gefährlich. Hol lieber dein Kuscheltier." },
      },
      {
        caption: "Selbst ausschalten",
        question: "Der große Bär zeigt den Knopf. Was kann der kleine Bär tun?",
        beats: [{ line: "Willst du mal drücken? Mit dem Fuß, hier." }, { narration: "Klick, aus! Klick, an! Der kleine Bär lacht.", sound: "laugh" }],
        instead: { caption: "Staubsauger umwerfen", answer: "Hmm, jetzt ist der Staub überall. Drück lieber selbst den Knopf.", sound: "crash" },
      },
    ],
    outro: [{ narration: "Toll! Ohren zuhalten, Kuscheltier holen, selbst drücken. Jetzt ist der Staubsauger nicht mehr so schlimm.", sound: "cheer" }],
    endCaption: "Bär drückt lachend den Knopf",
  },
  {
    id: "dog",
    emoji: "🐕",
    title: "Angst vorm großen Hund",
    caption: "Großer Hund bellt, Bär erschrickt",
    intro: [
      { narration: "Der kleine Bär und der große Bär gehen im Park spazieren." },
      { narration: "Wuff! Ein großer Hund bellt. Der kleine Bär erschrickt.", sound: "bark" },
    ],
    steps: [
      {
        caption: "Stehen wie ein Baum",
        question: "Der Hund bellt. Was kann der kleine Bär tun?",
        beats: [{ narration: "Der kleine Bär steht still wie ein Baum. Füße fest, Arme an den Bauch." }, { narration: "Der Hund schnüffelt nur." }],
        instead: { caption: "Wegrennen", answer: "Hmm, wenn du rennst, will der Hund hinterher. Steh lieber still wie ein Baum." },
      },
      {
        caption: "Zum großen Bären gehen",
        question: "Der kleine Bär hat noch Angst. Was kann er tun?",
        beats: [{ narration: "Er geht zum großen Bären und nimmt seine Pfote." }, { line: "Ich bin bei dir." }],
        instead: { caption: "Stock werfen", answer: "Hmm, der Stock trifft den Hund. Geh lieber zum großen Bären.", sound: "aua" },
      },
      {
        caption: "„Hallo, Hund!“ winken",
        question: "Der Hund sitzt jetzt brav. Was kann der kleine Bär tun?",
        beats: [
          { narration: "Von weitem winkt er.", line: "Hallo, Hund!" },
          { narration: "Der Hund wedelt mit dem Schwanz.", sound: "pop" },
        ],
        instead: { caption: "Am Schwanz ziehen", answer: "Hmm, das tut dem Hund weh. Wink lieber von weitem.", sound: "aua" },
      },
    ],
    outro: [{ narration: "Super! Stehen wie ein Baum, zum großen Bären gehen, von weitem winken.", sound: "cheer" }],
    endCaption: "Bär winkt, der Hund wedelt",
  },
  {
    id: "doctor",
    emoji: "🩺",
    title: "Angst beim Kinderarzt",
    caption: "Die Ärztin hält das Hörrohr, Bär hat Angst",
    intro: [
      { narration: "Der kleine Bär ist beim Kinderarzt. Er sitzt beim großen Bären auf dem Schoß." },
      { narration: "Die Ärztin will ihn abhören. Der kleine Bär hat Angst." },
    ],
    steps: [
      {
        caption: "Kuscheltier drücken",
        question: "Der kleine Bär hat Angst. Was kann er tun?",
        beats: [{ narration: "Der kleine Bär drückt sein Kuscheltier ganz fest." }, { line: "Du bist sehr mutig." }],
        instead: { caption: "Die Ärztin hauen", answer: "Hmm, Hauen tut weh. Drück lieber dein Kuscheltier ganz fest.", sound: "aua" },
      },
      {
        caption: "Tief pusten",
        question: "Das Hörrohr ist ein bisschen kalt. Was kann der kleine Bär tun?",
        beats: [{ narration: "Er pustet ganz tief. Puuuh.", sound: "breath" }, { line: "Toll! Ich höre dein Herz. Bum, bum." }],
        instead: { caption: "Hörrohr wegschlagen", answer: "Hmm, jetzt ist das Hörrohr kaputt. Puste lieber ganz tief.", sound: "crash" },
      },
      {
        caption: "Pflaster aussuchen",
        question: "Fertig! Der kleine Bär will schnell weg. Was kann er tun?",
        beats: [{ narration: "Er sucht sich selbst ein Pflaster aus. Eins mit Sternen!" }, { line: "Das hast du toll gemacht!", sound: "pop" }],
        instead: { caption: "Weglaufen", answer: "Hmm, allein weglaufen ist gefährlich. Such dir lieber ein Pflaster aus." },
      },
    ],
    outro: [{ narration: "Geschafft! Kuscheltier drücken, pusten, ein Pflaster aussuchen.", sound: "cheer" }],
    endCaption: "Bär zeigt stolz sein Sternenpflaster",
  },
  {
    id: "hairwash",
    emoji: "🛁",
    title: "Angst beim Haarewaschen",
    caption: "Schaum auf dem Kopf, Bär hat Angst",
    intro: [
      { narration: "Der kleine Bär sitzt in der Badewanne. Er hat Schaum auf dem Kopf." },
      { narration: "Gleich kommt Wasser. Der kleine Bär hat Angst, dass es in die Augen kommt." },
    ],
    steps: [
      {
        caption: "Waschlappen auf die Augen",
        question: "Gleich kommt Wasser. Was kann der kleine Bär tun?",
        beats: [{ narration: "Er drückt sich selbst den Waschlappen auf die Augen.", line: "So kommt nichts rein!" }],
        instead: { caption: "Wasser rausspritzen", answer: "Hmm, jetzt ist der Boden nass und rutschig. Halt dir lieber den Waschlappen vor die Augen." },
      },
      {
        caption: "Hoch zur Ente gucken",
        question: "Der kleine Bär hat noch ein bisschen Angst. Was kann er tun?",
        beats: [{ narration: "Er legt den Kopf zurück und guckt hoch zur Ente.", line: "Hallo, Ente!" }],
        instead: { caption: "Aus der Wanne klettern", answer: "Hmm, nass und glatt rutscht man aus. Guck lieber hoch zur Ente.", sound: "aua" },
      },
      {
        caption: "Selbst spülen",
        question: "Der Schaum muss runter. Was kann der kleine Bär tun?",
        beats: [{ narration: "Er nimmt den Becher und spült selbst. Platsch!", sound: "splash" }, { line: "Ich hab's geschafft!" }],
        instead: { caption: "Becher werfen", answer: "Hmm, jetzt sind alle Flaschen umgefallen. Spül lieber selbst mit dem Becher.", sound: "crash" },
      },
    ],
    outro: [{ narration: "Super! Waschlappen halten, hochgucken, selbst spülen. Alles sauber!", sound: "cheer" }],
    endCaption: "Bär sitzt froh in der Wanne, Haare sauber",
  },
  {
    id: "night",
    emoji: "🌙",
    title: "Angst, nachts aufgewacht",
    caption: "Nachts ein Schatten an der Wand, Bär ist wach",
    intro: [{ narration: "Es ist Nacht. Der kleine Bär wacht auf." }, { narration: "Da ist ein großer Schatten an der Wand! Der kleine Bär hat Angst." }],
    steps: [
      {
        caption: "Nachtlicht anknipsen",
        question: "Da ist ein Schatten. Was kann der kleine Bär tun?",
        beats: [{ narration: "Er knipst selbst das Nachtlicht an.", sound: "light" }, { narration: "Der Schatten ist nur der Kleiderständer!" }],
        instead: { caption: "Bauklotz werfen", answer: "Hmm, jetzt ist der Kleiderständer umgefallen. Knips lieber das Nachtlicht an.", sound: "crash" },
      },
      {
        caption: "Kuscheltier drücken und summen",
        question: "Der kleine Bär ist noch ein bisschen unruhig. Was kann er tun?",
        beats: [{ narration: "Er drückt sein Kuscheltier und summt leise.", sound: "hum" }],
        instead: { caption: "Im Dunkeln zur Treppe", answer: "Hmm, im Dunkeln kann man auf der Treppe fallen. Drück lieber dein Kuscheltier und summ leise." },
      },
      {
        caption: "Den großen Bären rufen",
        question: "Der kleine Bär möchte nicht allein sein. Was kann er tun?",
        beats: [
          { narration: "Er ruft:", line: "Kannst du kommen?" },
          { narration: "Der große Bär kommt und setzt sich ans Bett.", line: "Ich bin da." },
        ],
        instead: { caption: "Kuscheltier rauswerfen", answer: "Hmm, jetzt liegt dein Kuscheltier allein auf dem Boden. Ruf lieber den großen Bären." },
      },
    ],
    outro: [{ narration: "Gut gemacht! Licht an, Kuscheltier drücken, rufen. Und jetzt: schlaf gut.", sound: "musicbox" }],
    endCaption: "Bär schläft wieder, großer Bär sitzt am Bett",
  },
  {
    id: "lost",
    emoji: "🧸",
    title: "Traurig, Kuschelhase weg",
    caption: "Kuschelhase ist weg, Bär weint",
    intro: [{ narration: "Der kleine Bär will schlafen gehen." }, { narration: "Aber sein Kuschelhase ist weg! Er ist so traurig." }],
    steps: [
      {
        caption: "„Ich bin traurig“ sagen",
        question: "Sein Kuschelhase ist weg. Was kann der kleine Bär tun?",
        beats: [{ narration: "Der kleine Bär sagt:", line: "Ich bin traurig. Mein Kuschelhase ist weg." }, { line: "Oh. Das ist traurig." }],
        instead: { caption: "Spielkiste auskippen", answer: "Hmm, jetzt liegt alles durcheinander. Sag lieber, wie es dir geht.", sound: "crash" },
      },
      {
        caption: "Selbst suchen",
        question: "Wo kann der Kuschelhase sein? Was kann der kleine Bär tun?",
        beats: [{ narration: "Er sucht selbst. Unter dem Bett? Nein." }, { narration: "Im Korb? Da!", sound: "chime" }],
        instead: {
          caption: "Dem Fuchs den Hund wegnehmen",
          answer: "Hmm, das ist der Kuschelhund vom Fuchs. Jetzt ist er traurig. Such lieber deinen Kuschelhasen.",
        },
      },
      {
        caption: "Ganz fest drücken",
        question: "Da ist der Kuschelhase! Was kann der kleine Bär tun?",
        beats: [{ narration: "Er drückt ihn ganz fest.", line: "Da bist du ja!", sound: "pop" }],
        instead: { caption: "In die Ecke werfen", answer: "Hmm, jetzt liegt er wieder allein in der Ecke. Drück ihn lieber ganz fest." },
      },
    ],
    outro: [{ narration: "Schön! Sagen, wie es dir geht, selbst suchen, fest drücken.", sound: "cheer" }],
    endCaption: "Bär kuschelt seinen Kuschelhasen im Bett",
  },
  {
    id: "join",
    emoji: "🏰",
    title: "Traurig, darf nicht mitspielen",
    caption: "Fuchs und Hase bauen eine Burg, Bär steht daneben",
    intro: [
      { narration: "Im Kindergarten bauen der Fuchs und der Hase eine Sandburg." },
      { narration: "Der kleine Bär will mitspielen. Der Igel spielt allein." },
    ],
    steps: [
      {
        caption: "Fragen",
        question: "Der kleine Bär will mitspielen. Was kann er tun?",
        beats: [{ narration: "Der kleine Bär fragt:", line: "Darf ich mitspielen?" }, { line: "Nein, jetzt nicht." }],
        instead: { caption: "Sandburg kaputt treten", answer: "Hmm, jetzt ist die Burg kaputt, und alle sind traurig. Frag lieber: Darf ich mitspielen?" },
      },
      {
        caption: "„Das macht mich traurig“ sagen",
        question: "Der Fuchs sagt Nein. Was kann der kleine Bär tun?",
        beats: [{ narration: "Der kleine Bär sagt:", line: "Das macht mich traurig." }, { line: "Oh. Vielleicht später." }],
        instead: { caption: "Sand werfen", answer: "Hmm, Sand in den Augen tut weh. Sag lieber: Das macht mich traurig.", sound: "aua" },
      },
      {
        caption: "Mit dem Igel bauen",
        question: "Der Igel spielt allein. Was kann der kleine Bär tun?",
        beats: [{ narration: "Er baut mit dem Igel einen hohen Turm." }, { narration: "Bald kommen der Fuchs und der Hase dazu.", sound: "pop" }],
        instead: { caption: "Dem Igel die Schaufel wegnehmen", answer: "Hmm, jetzt ist der Igel auch traurig. Bau lieber mit ihm zusammen." },
      },
    ],
    outro: [{ narration: "Toll! Fragen, sagen, wie es dir geht, mit jemand anderem spielen.", sound: "cheer" }],
    endCaption: "Alle vier bauen zusammen",
  },
  {
    id: "loud",
    emoji: "🎈",
    title: "Zu viel und zu laut",
    caption: "Lautes Fest, Bär hält sich die Ohren zu",
    intro: [
      { narration: "Im Kindergarten ist ein Fest. Musik, Luftballons, alle tanzen.", sound: "melody" },
      { narration: "Dem kleinen Bären ist das zu viel und zu laut." },
    ],
    steps: [
      {
        caption: "In die Kuschelhöhle",
        question: "Alles ist so laut. Was kann der kleine Bär tun?",
        beats: [{ narration: "Er krabbelt in die Kuschelhöhle. Da ist es ruhig." }],
        instead: { caption: "Alle anschreien", answer: "Hmm, jetzt erschrecken sich alle. Krabbel lieber in die Kuschelhöhle." },
      },
      {
        caption: "Kuscheltier halten und pusten",
        question: "In der Höhle ist es ruhig. Was kann der kleine Bär tun?",
        beats: [{ narration: "Er hält das Kuscheltier und pustet ganz tief. Puuuh.", sound: "breath" }],
        instead: { caption: "Luftballon kaputt machen", answer: "Hmm, peng! Jetzt ist es noch lauter. Halt lieber das Kuscheltier und puste.", sound: "crash" },
      },
      {
        caption: "Langsam rauskommen",
        question: "Der kleine Bär ist wieder ruhig. Was kann er tun?",
        beats: [{ narration: "Er kommt langsam raus und spielt erst mal nur mit dem Hasen." }, { line: "Schön, dass du da bist!" }],
        instead: { caption: "Wild losrennen", answer: "Hmm, er rennt den Igel um. Komm lieber langsam raus.", sound: "aua" },
      },
    ],
    outro: [{ narration: "Super! Sich ausruhen, pusten, langsam wieder mitmachen.", sound: "cheer" }],
    endCaption: "Bär und Hase spielen ruhig am Rand des Festes",
  },
  {
    id: "proud",
    emoji: "🏆",
    title: "Stolz, ganz oben",
    caption: "Bär ist allein ganz oben auf dem Klettergerüst",
    intro: [{ narration: "Der kleine Bär klettert auf das Klettergerüst. Ganz allein!" }, { narration: "Jetzt ist er oben. Er ist so stolz!" }],
    steps: [
      {
        caption: "„Komm doch auch hoch!“ rufen",
        question: "Der kleine Bär ist ganz oben. Was kann er tun?",
        beats: [{ narration: "Er ruft dem Fuchs zu:", line: "Komm doch auch hoch!" }, { line: "Au ja, ich komme!" }],
        instead: { caption: "Den Fuchs runterschubsen", answer: "Hmm, Schubsen tut weh. Ruf lieber: Komm doch auch hoch!", sound: "aua" },
      },
      {
        caption: "Jubeln",
        question: "Der kleine Bär freut sich riesig. Was kann er tun?",
        beats: [{ narration: "Er hält sich fest und jubelt.", line: "Juhu! Geschafft!", sound: "laugh" }],
        instead: { caption: "Den Fuchs auslachen", answer: "Hmm, jetzt ist der Fuchs traurig. Freu dich lieber ganz laut." },
      },
      {
        caption: "Dem Fuchs helfen",
        question: "Der Fuchs kommt nicht hoch. Was kann der kleine Bär tun?",
        beats: [
          { narration: "Er zeigt dem Fuchs, wo der Fuß hinkommt.", line: "Da! Und jetzt da!" },
          { line: "Ich bin oben!", sound: "pop" },
        ],
        instead: { caption: "Runterspringen", answer: "Hmm, von so hoch springen tut weh. Zeig lieber dem Fuchs, wie es geht.", sound: "aua" },
      },
    ],
    outro: [{ narration: "Juhu! Rufen, jubeln, helfen. Jetzt sind beide stolz.", sound: "cheer" }],
    endCaption: "Bär und Fuchs zusammen oben",
  },
  {
    id: "miss",
    emoji: "💌",
    title: "Vermissen, Oma fährt weg",
    caption: "Oma fährt weg, Bär ist traurig",
    intro: [{ narration: "Oma Bär war zu Besuch. Jetzt fährt sie wieder nach Hause." }, { narration: "Der kleine Bär vermisst sie schon." }],
    steps: [
      {
        caption: "„Ich vermisse Oma“ sagen",
        question: "Oma ist weggefahren. Was kann der kleine Bär tun?",
        beats: [{ narration: "Der kleine Bär sagt:", line: "Ich vermisse Oma." }, { line: "Ich auch. Komm her." }],
        instead: { caption: "Omas Tasse runterwerfen", answer: "Hmm, jetzt ist Omas Tasse kaputt. Sag lieber: Ich vermisse Oma.", sound: "crash" },
      },
      {
        caption: "Ein Bild malen",
        question: "Der kleine Bär denkt an Oma. Was kann er tun?",
        beats: [{ narration: "Er malt ein Bild für Oma. Mit Sonne und Herz." }],
        instead: { caption: "Stifte zerbrechen", answer: "Hmm, jetzt sind die Stifte kaputt. Mal lieber ein Bild für Oma.", sound: "crash" },
      },
      {
        caption: "Omas Foto anschauen",
        question: "Da hängt Omas Foto. Was kann der kleine Bär tun?",
        beats: [
          { narration: "Er schaut Omas Foto an und gibt ihm einen Kuss.", sound: "pop" },
          { narration: "Da ruft Oma an!", line: "Guck mal, mein Bild!" },
        ],
        instead: { caption: "Foto abreißen", answer: "Hmm, jetzt ist das Foto kaputt. Schau es lieber an." },
      },
    ],
    outro: [{ narration: "Schön! Sagen, malen, an Oma denken. Bald kommt sie wieder.", sound: "cheer" }],
    endCaption: "Bär zeigt Oma im Videoanruf sein Bild",
  },
  {
    id: "shy",
    emoji: "🫣",
    title: "Schüchtern, Besuch ist da",
    caption: "Eine Füchsin kommt zu Besuch, Bär versteckt sich",
    intro: [
      { narration: "Es klingelt. Eine Füchsin kommt zu Besuch.", line: "Hallo, kleiner Bär!" },
      { narration: "Der kleine Bär kennt sie nicht. Er ist schüchtern." },
    ],
    steps: [
      {
        caption: "Erst mal nur gucken",
        question: "Der Besuch ist da. Was kann der kleine Bär tun?",
        beats: [{ narration: "Er hält sich am großen Bären fest und guckt erst mal nur." }, { line: "Du darfst erst mal gucken." }],
        instead: { caption: "„Geh weg!“ schreien", answer: "Hmm, jetzt ist die Füchsin erschrocken. Guck lieber erst mal nur." },
      },
      {
        caption: "Winken",
        question: "Die Füchsin lächelt. Was kann der kleine Bär tun?",
        beats: [{ narration: "Er winkt ihr zu. Ganz klein." }, { line: "Hallo! Schön, dich zu sehen." }],
        instead: { caption: "Nach ihr treten", answer: "Hmm, Treten tut weh. Wink lieber.", sound: "aua" },
      },
      {
        caption: "Sein Auto zeigen",
        question: "Der kleine Bär traut sich ein bisschen mehr. Was kann er tun?",
        beats: [{ narration: "Er holt sein Lieblingsauto und zeigt es ihr." }, { line: "Oh, ist das schön!", sound: "pop" }],
        instead: { caption: "Geschenk wegreißen", answer: "Hmm, jetzt ist das Geschenk kaputt. Zeig ihr lieber dein Auto.", sound: "crash" },
      },
    ],
    outro: [{ narration: "Prima! Erst gucken, dann winken, dann etwas zeigen. Du bestimmst, wie nah.", sound: "cheer" }],
    endCaption: "Bär und Füchsin spielen mit dem Auto",
  },
  {
    id: "bored",
    emoji: "🌧️",
    title: "Langeweile am Regentag",
    caption: "Draußen regnet es, Bär ist langweilig",
    intro: [{ narration: "Draußen regnet es. Der kleine Bär liegt auf dem Sofa." }, { narration: "Ihm ist so langweilig!" }],
    steps: [
      {
        caption: "Mit dem Fuchs Kochen spielen",
        question: "Es regnet. Was kann der kleine Bär tun?",
        beats: [
          { narration: "Er holt die Töpfe und kocht mit dem Fuchs eine Regensuppe. Rühren, rühren!", sound: "pop" },
          { line: "Mmh, lecker! Jetzt koche ich!" },
        ],
        instead: { caption: "Den Fuchs am Ohr ziehen", answer: "Hmm, das tut dem Fuchs weh. Spiel lieber was mit ihm.", sound: "aua" },
      },
      {
        caption: "Eine Höhle bauen",
        question: "Was kann man drinnen spielen? Was kann der kleine Bär tun?",
        beats: [{ narration: "Er baut aus Decke und Kissen eine Höhle.", sound: "pop" }, { line: "Komm rein!" }],
        instead: { caption: "Mit Topf an die Scheibe hauen", answer: "Hmm, jetzt hat die Scheibe einen Sprung. Bau lieber eine Höhle.", sound: "crash" },
      },
      {
        caption: "Karton-Auto fahren",
        question: "Da steht ein großer Karton. Was kann der kleine Bär tun?",
        beats: [{ narration: "Er setzt sich in den Karton. Das ist sein Auto! Brumm, brumm.", sound: "rumble" }, { line: "Nimm mich mit!" }],
        instead: { caption: "Karton zertreten", answer: "Hmm, jetzt ist der Karton kaputt. Mach lieber ein Auto daraus." },
      },
    ],
    outro: [{ narration: "Toll! Aus Langeweile werden Ideen: zusammen kochen, eine Höhle bauen, Auto fahren.", sound: "cheer" }],
    endCaption: "Bär und Fuchs fahren im Karton-Auto",
  },
  {
    id: "empathy",
    emoji: "🫂",
    title: "Mitgefühl, der Fuchs weint",
    caption: "Ballon vom Fuchs ist geplatzt, Fuchs weint",
    intro: [
      { narration: "Der kleine Bär und der Fuchs haben jeder einen Luftballon." },
      { narration: "Peng! Der Ballon vom Fuchs ist geplatzt. Der Fuchs weint.", sound: "pop" },
    ],
    steps: [
      {
        caption: "Fragen: „Bist du traurig?“",
        question: "Der Fuchs weint. Was kann der kleine Bär tun?",
        beats: [{ narration: "Der kleine Bär geht hin und fragt:", line: "Bist du traurig?" }, { line: "Ja. Mein Ballon ist kaputt." }],
        instead: { caption: "Lachen und zeigen", answer: "Hmm, Auslachen macht den Fuchs noch trauriger. Geh lieber hin und frag." },
      },
      {
        caption: "Über den Rücken streicheln",
        question: "Der Fuchs ist ganz traurig. Was kann der kleine Bär tun?",
        beats: [{ narration: "Er streichelt dem Fuchs über den Rücken." }, { line: "Danke, Bär." }],
        instead: { caption: "Eigenen Ballon hochhalten", answer: "Hmm, da wird der Fuchs noch trauriger. Streichel ihn lieber." },
      },
      {
        caption: "Ballon zusammen halten",
        question: "Der kleine Bär hat noch seinen Ballon. Was kann er tun?",
        beats: [
          { narration: "Er gibt dem Fuchs die Schnur mit in die Pfote.", line: "Unser Ballon!" },
          { narration: "Der Fuchs lacht.", sound: "laugh" },
        ],
        instead: { caption: "Weglaufen", answer: "Hmm, jetzt ist der Fuchs ganz allein. Halt lieber den Ballon mit ihm." },
      },
    ],
    outro: [{ narration: "Schön! Fragen, trösten, teilen. So fühlt sich der Fuchs gleich besser.", sound: "cheer" }],
    endCaption: "Bär und Fuchs halten den Ballon zusammen",
  },
  {
    id: "startle",
    emoji: "😲",
    title: "Erschrocken, ein lauter Knall",
    caption: "Ballon platzt, Bär erschrickt",
    intro: [
      { narration: "Der kleine Bär feiert Geburtstag mit dem Fuchs." },
      { narration: "Peng! Ein Luftballon platzt direkt neben ihm. Der kleine Bär erschrickt.", sound: "pop" },
    ],
    steps: [
      {
        caption: "Ohren zuhalten",
        question: "Das war so laut! Was kann der kleine Bär tun?",
        beats: [{ narration: "Er hält sich die Ohren zu." }, { line: "Schon besser." }],
        instead: {
          caption: "Alle Ballons kaputt machen",
          answer: "Hmm, peng, peng! Jetzt erschrecken sich alle. Halt dir lieber die Ohren zu.",
          sound: "crash",
        },
      },
      {
        caption: "Tief pusten",
        question: "Das Herz klopft noch ganz schnell. Was kann der kleine Bär tun?",
        beats: [{ narration: "Er pustet ganz tief. Puuuh.", sound: "breath" }, { narration: "Das Herz wird ruhiger." }],
        instead: { caption: "Kuchen umwerfen", answer: "Hmm, jetzt ist der Kuchen kaputt. Puste lieber ganz tief.", sound: "crash" },
      },
      {
        caption: "Mit dem Fuchs Kuchen essen",
        question: "Der Fuchs wartet am Geburtstagstisch. Was kann der kleine Bär tun?",
        beats: [{ narration: "Er geht zum Fuchs an den Tisch. Sie essen zusammen Kuchen." }, { line: "Mmh, lecker!", sound: "laugh" }],
        instead: { caption: "Den Fuchs anbrüllen", answer: "Hmm, jetzt erschrickt der Fuchs auch. Geh lieber zu ihm und iss Kuchen mit ihm." },
      },
    ],
    outro: [{ narration: "Super! Ohren zuhalten, tief pusten und dann zusammen Kuchen essen.", sound: "cheer" }],
    endCaption: "Bär und Fuchs essen zusammen Kuchen",
  },
];
