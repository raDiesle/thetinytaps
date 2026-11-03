// Stories with feelings the others don't have yet – disappointed, jealous,
// disgusted, embarrassed, excited – at home, at the table, in the kindergarten.
// Built and played like the kindergarten stories (`Situation`, `KitaPlay`): the
// little bear has the feeling and helps himself, step by step, with a body
// trick, saying how he feels, or doing something else. The feeling itself is
// never the not-so-good idea; only what hurts someone or breaks something is.
// Ideas C-05, C-12, C-16, C-17 and C-18 on /management/.

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
        caption: "Zwei Hälften zeigen",
        question: "Der kleine Bär ist noch ein bisschen traurig. Was kann er tun?",
        beats: [{ narration: "Er schaut die Hälften an. Eins, zwei!", line: "Jetzt hab ich zwei Kekse!" }],
        instead: { caption: "Keks zerkrümeln", answer: "Hmm, jetzt ist der Keks ganz weg. Schau lieber: Jetzt hast du zwei!" },
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
    outro: [{ narration: "Toll! Traurig sein ist okay. Kuscheltier drücken, anders schauen, teilen.", sound: "cheer" }],
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
        instead: { caption: "Auf dem Sofa toben", answer: "Hmm, jetzt ist die Lampe umgefallen. Jubel lieber ganz laut: Juhu!", sound: "crash" },
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
];
