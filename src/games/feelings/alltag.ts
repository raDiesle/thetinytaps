import type { Situation } from "./kita";

// The everyday scenes of „Alltagssituationen“ from the ideas C-37 to C-72 (November 2026): the bear frustrated, scared,
// excited, worn out or disgusted at home, in the kindergarten and out and about, three steps each like the stories of
// selbst.ts. German only, kept apart from SELF_SITUATIONS so they wait for their translations without failing that list's
// check; their pictures wait in the picture queue (alltagDrawings.ts), so on the live site a story shows only once all its
// pictures are made (stories.ts).

/** The everyday scenes, in the order of their ideas. */
export const ALLTAG_SITUATIONS: Situation[] = [
  // C-37
  {
    id: "puzzle",
    emoji: "🧩",
    title: "Frust, das Puzzle passt nicht",
    caption: "Kuh passt nicht, Bär ist wütend",
    intro: [
      { narration: "Der kleine Bär macht ein Puzzle mit Bauernhoftieren." },
      { narration: "Die Kuh passt nicht in ihr Loch! Der kleine Bär ist wütend." },
    ],
    steps: [
      {
        caption: "Fäuste drücken",
        question: "Die Kuh passt nicht. Der kleine Bär ist wütend. Was kann er tun?",
        beats: [{ narration: "Der kleine Bär drückt die Fäuste ganz fest. Und lässt los.", sound: "breath" }, { line: "Puh. Schon besser." }],
        instead: {
          caption: "Puzzle vom Tisch fegen",
          answer: "Hmm, jetzt liegen alle Teile auf dem Boden. Drück lieber die Fäuste ganz fest.",
          sound: "crash",
        },
      },
      {
        caption: "Teil umdrehen",
        question: "Die Kuh passt nicht in ihr Loch. Was kann der kleine Bär tun?",
        beats: [{ narration: "Der kleine Bär dreht die Kuh um und probiert es andersherum." }, { line: "Klick! Sie passt!", sound: "pop" }],
        instead: { caption: "Teil reinhauen", answer: "Hmm, jetzt ist das Puzzle kaputt. Dreh die Kuh lieber um und probier es andersherum.", sound: "crash" },
      },
      {
        caption: "„Hilf mir bitte!“ sagen",
        question: "Der kleine Bär schafft es nicht allein. Was kann er tun?",
        beats: [
          { narration: "Der kleine Bär sagt zum großen Bären:", line: "Hilf mir bitte!" },
          { narration: "Der große Bär zeigt auf die Ecke. Und die Kuh passt.", sound: "pop" },
        ],
        instead: { caption: "Den großen Bären anbrüllen", answer: "Hmm, jetzt ist der große Bär erschrocken. Sag lieber: Hilf mir bitte!" },
      },
    ],
    outro: [{ narration: "Super! Fäuste drücken, Teil umdrehen, um Hilfe bitten. Das Puzzle ist fertig, und die Kuh macht: Muh!", sound: "cheer" }],
    endCaption: "Puzzle fertig, Bär strahlt",
  },
  // C-38
  {
    id: "race",
    emoji: "🏃",
    title: "Verloren beim Wettrennen",
    caption: "Fuchs ist zuerst am Baum, Bär ist sauer",
    intro: [
      { narration: "Der kleine Bär und der Fuchs rennen um die Wette. Bis zum Apfelbaum!" },
      { narration: "Der Fuchs ist zuerst da. Der kleine Bär hat verloren. Er ist sauer." },
    ],
    steps: [
      {
        caption: "Fest stampfen",
        question: "Der Fuchs hat gewonnen. Der kleine Bär ist sauer. Was kann er tun?",
        beats: [{ narration: "Der kleine Bär stampft ganz fest auf den Boden. Stampf, stampf!", sound: "stomp" }, { line: "Puh. Jetzt ist der Ärger raus." }],
        instead: { caption: "Den Fuchs schubsen", answer: "Hmm, Schubsen tut weh. Stampf lieber ganz fest auf den Boden.", sound: "aua" },
      },
      {
        caption: "„Nochmal!“ rufen",
        question: "Der kleine Bär will auch mal gewinnen. Was kann er tun?",
        beats: [
          { narration: "Der kleine Bär ruft:", line: "Nochmal! Noch ein Rennen!" },
          { line: "Au ja! Auf die Plätze, fertig, los!", sound: "pop" },
        ],
        instead: { caption: "„Gilt nicht!“ schreien und weglaufen", answer: "Hmm, jetzt steht der Fuchs ganz allein da und ist traurig. Ruf lieber: Nochmal!" },
      },
      {
        caption: "Abklatschen",
        question: "Der Fuchs freut sich. Was kann der kleine Bär tun?",
        beats: [
          { narration: "Der kleine Bär hält dem Fuchs die Pfote hin.", line: "Gut gerannt!" },
          { narration: "Klatsch! Die beiden klatschen ab.", sound: "pop" },
        ],
        instead: { caption: "Den Fuchs am Ohr ziehen", answer: "Hmm, das tut dem Fuchs weh. Klatsch lieber mit ihm ab.", sound: "aua" },
      },
    ],
    outro: [{ narration: "Super! Stampfen, nochmal rennen, abklatschen. Und jetzt rennen beide Hand in Hand.", sound: "cheer" }],
    endCaption: "Bär und Fuchs rennen Hand in Hand",
  },
  // C-39
  {
    id: "farewell",
    emoji: "👋",
    title: "Traurig, der Freund geht heim",
    caption: "Fuchs geht heim, Bär weint",
    intro: [
      { narration: "Der Fuchs war zum Spielen da. Jetzt holt sein Papa ihn ab." },
      { narration: "Der Fuchs setzt seine Mütze auf. Der kleine Bär weint." },
    ],
    steps: [
      {
        caption: "Fest umarmen",
        question: "Der Fuchs geht nach Hause. Der kleine Bär ist traurig. Was kann er tun?",
        beats: [{ narration: "Der kleine Bär umarmt den Fuchs ganz fest.", line: "Tschüss, Fuchs!" }, { line: "Tschüss, Bär!" }],
        instead: { caption: "Dem Fuchs die Mütze wegnehmen", answer: "Hmm, jetzt weint der Fuchs. Er will seine Mütze. Umarm ihn lieber zum Abschied." },
      },
      {
        caption: "Auto fest drücken",
        question: "Der kleine Bär hält das Auto vom Spielen. Er ist traurig. Was kann er tun?",
        beats: [{ narration: "Der kleine Bär drückt das Auto ganz fest an seinen Bauch.", line: "Damit spielen wir morgen weiter." }],
        instead: { caption: "Auto hinterherwerfen", answer: "Hmm, jetzt ist das Auto kaputt. Drück es lieber ganz fest an den Bauch.", sound: "crash" },
      },
      {
        caption: "Am Fenster winken",
        question: "Der Fuchs geht mit seinem Papa los. Was kann der kleine Bär tun?",
        beats: [
          { narration: "Der kleine Bär läuft ans Fenster und winkt, bis der Fuchs um die Ecke ist." },
          { narration: "Der Fuchs winkt zurück.", sound: "pop" },
        ],
        instead: { caption: "Gegen die Tür treten", answer: "Hmm, das tut am Fuß weh. Lauf lieber ans Fenster und wink.", sound: "aua" },
      },
    ],
    outro: [{ narration: "Super! Umarmen, Auto drücken, winken. Und der große Bär sagt:", line: "Morgen wieder!", sound: "cheer" }],
    endCaption: "Fuchs winkt von draußen, Bär winkt zurück",
  },
  // C-40
  {
    id: "myself",
    emoji: "✋",
    title: "Wütend, ich will selber",
    caption: "Saft schon eingeschenkt, Bär ist wütend",
    intro: [
      { narration: "Der kleine Bär und der große Bär frühstücken." },
      { narration: "Der große Bär hat den Saft schon eingeschenkt. Aber der kleine Bär wollte selber! Er ist wütend." },
    ],
    steps: [
      {
        caption: "„Ich will selber!“ sagen",
        question: "Der große Bär hat den Saft eingeschenkt. Der kleine Bär wollte das selbst machen. Was kann er tun?",
        beats: [{ narration: "Der kleine Bär sagt laut:", line: "Ich will selber!" }, { line: "Gut, dass du das sagst. Dann schenkst du jetzt ein." }],
        instead: { caption: "Saftbecher umkippen", answer: "Hmm, jetzt ist der ganze Saft auf dem Tisch. Sag lieber: Ich will selber!" },
      },
      {
        caption: "Tief pusten",
        question: "Der kleine Bär ist ganz wütend. Was kann er tun?",
        beats: [{ narration: "Der kleine Bär dreht sich vom Tisch weg und pustet ganz tief nach oben. Puuuh.", sound: "breath" }, { line: "Schon besser." }],
        instead: { caption: "Den großen Bären hauen", answer: "Hmm, Hauen tut weh. Puste lieber ganz tief.", sound: "aua" },
      },
      {
        caption: "Selbst einschenken",
        question: "Der Becher vom großen Bären ist leer. Was kann der kleine Bär tun?",
        beats: [
          { narration: "Der kleine Bär schenkt dem großen Bären selbst ein. Der große Bär hält die Kanne nur ein bisschen mit." },
          { line: "Ich kann das!", sound: "pop" },
        ],
        instead: { caption: "Kanne runterwerfen", answer: "Hmm, jetzt ist die Kanne kaputt. Schenk lieber selbst ein.", sound: "crash" },
      },
    ],
    outro: [{ narration: "Super! Sagen, was du willst, tief pusten, selbst einschenken. Jetzt trinken beide.", sound: "cheer" }],
    endCaption: "Bär und großer Bär trinken Saft, Bär strahlt",
  },
  // C-41
  {
    id: "homesick",
    emoji: "🏡",
    title: "Heimweh, die erste Nacht bei Oma",
    caption: "Erste Nacht bei Oma, Bär hat Heimweh",
    intro: [
      { narration: "Der kleine Bär schläft heute zum ersten Mal bei Oma Bär." },
      { narration: "Der große Bär ist nach Hause gefahren. Der kleine Bär hat Heimweh." },
    ],
    steps: [
      {
        caption: "Kuschelhase drücken",
        question: "Der kleine Bär hat Heimweh. Was kann er tun?",
        beats: [{ narration: "Der kleine Bär drückt seinen Kuschelhasen ganz fest. Der ist von zu Hause mitgekommen." }, { line: "Gut, dass du da bist." }],
        instead: {
          caption: "Nachtlicht runterwerfen",
          answer: "Hmm, jetzt ist das Nachtlicht kaputt. Drück lieber deinen Kuschelhasen ganz fest.",
          sound: "crash",
        },
      },
      {
        caption: "„Ich vermisse mein Zuhause“ sagen",
        question: "Oma sitzt am Bett. Was kann der kleine Bär tun?",
        beats: [
          { narration: "Der kleine Bär sagt zu Oma:", line: "Ich vermisse mein Zuhause." },
          { narration: "Oma nickt und streichelt ihm über den Kopf.", line: "Morgen früh holt dich der große Bär ab." },
        ],
        instead: { caption: "Oma wegschubsen", answer: "Hmm, Schubsen tut Oma weh. Sag ihr lieber, was du vermisst.", sound: "aua" },
      },
      {
        caption: "Langsam atmen",
        question: "Der kleine Bär kann nicht einschlafen. Was kann er tun?",
        beats: [{ narration: "Er macht die Augen zu und legt die Pfote auf den Bauch." }, { narration: "Ein. Und aus. Ganz langsam.", sound: "breath" }],
        instead: {
          caption: "Bild von der Wand reißen",
          answer: "Hmm, jetzt ist das Bild kaputt. Atme lieber ganz langsam, die Pfote auf dem Bauch.",
          sound: "crash",
        },
      },
    ],
    outro: [{ narration: "Super! Kuschelhasen drücken, sagen, was du vermisst, langsam atmen. Jetzt schläft der kleine Bär.", sound: "cheer" }],
    endCaption: "Bär schläft lächelnd bei Oma",
  },
  // C-42
  {
    id: "barber",
    emoji: "✂️",
    title: "Angst beim Friseur",
    caption: "Bär auf dem Friseurstuhl hat Angst",
    intro: [
      { narration: "Der kleine Bär ist beim Friseur. Er sitzt auf dem hohen Stuhl." },
      { narration: "Die Friseurin kommt mit Kamm und Schere. Der kleine Bär hat Angst." },
    ],
    steps: [
      {
        caption: "Armlehnen fest drücken",
        question: "Der kleine Bär hat Angst vor der Schere. Was kann er tun?",
        beats: [{ narration: "Der kleine Bär drückt die Pfoten ganz fest um die Armlehnen. Und hält still." }, { line: "Ich halte mich gut fest." }],
        instead: { caption: "Die Friseurin treten", answer: "Hmm, Treten tut der Friseurin weh. Halt dich lieber an den Armlehnen fest.", sound: "aua" },
      },
      {
        caption: "Im Spiegel zuschauen",
        question: "Hinter dem Ohr macht es schnipp, schnapp. Was kann der kleine Bär tun?",
        beats: [{ narration: "Der kleine Bär schaut in den Spiegel. Da fällt ein Büschel Fell herunter." }, { line: "Oh! Da fliegt mein Fell!", sound: "pop" }],
        instead: { caption: "Sprühflasche runterwerfen", answer: "Hmm, jetzt ist die Sprühflasche kaputt. Schau lieber im Spiegel zu.", sound: "crash" },
      },
      {
        caption: "„Kurz Pause, bitte!“ sagen",
        question: "Das ist ganz schön viel für den kleinen Bären. Was kann er tun?",
        beats: [
          { narration: "Der kleine Bär sagt:", line: "Kurz Pause, bitte!" },
          { narration: "Die Friseurin wartet. Und der große Bär winkt ihm zu.", line: "Klar! Sag, wenn es weitergeht." },
        ],
        instead: { caption: "Die Friseurin anbrüllen", answer: "Hmm, jetzt ist die Friseurin erschrocken. Sag lieber: Kurz Pause, bitte!" },
      },
    ],
    outro: [{ narration: "Super! Festhalten, im Spiegel zuschauen, Pause sagen. Und jetzt hat der kleine Bär einen neuen Schopf!", sound: "cheer" }],
    endCaption: "Bär lacht im Spiegel über seinen neuen Schopf",
  },
  // C-43
  {
    id: "accident",
    emoji: "🫢",
    title: "Ups, aus Versehen",
    caption: "Turm vom Fuchs umgestoßen, Bär erschrickt",
    intro: [
      { narration: "Der kleine Bär rennt durch den Kindergarten." },
      { narration: "Rums! Aus Versehen stößt er an den Turm vom Fuchs. Der Turm fällt um. Der kleine Bär erschrickt.", sound: "rumble" },
    ],
    steps: [
      {
        caption: "„Entschuldigung!“ sagen",
        question: "Der Turm vom Fuchs ist umgefallen. Was kann der kleine Bär tun?",
        beats: [{ narration: "Der kleine Bär sagt zum Fuchs:", line: "Entschuldigung! Das wollte ich nicht." }, { line: "Schon gut." }],
        instead: {
          caption: "Restliche Klötze umtreten",
          answer: "Hmm, jetzt ist alles umgefallen, und der Fuchs ist traurig. Sag lieber: Entschuldigung!",
          sound: "crash",
        },
      },
      {
        caption: "Tief pusten",
        question: "Der kleine Bär ist ganz erschrocken. Was kann er tun?",
        beats: [
          { narration: "Er kniet sich neben den Fuchs und pustet ganz tief nach oben. Puuuh.", sound: "breath" },
          { narration: "Jetzt klopft sein Herz ruhiger." },
        ],
        instead: { caption: "Lachen und weiterrennen", answer: "Hmm, jetzt weint der Fuchs. Knie dich lieber zu ihm und puste ganz tief." },
      },
      {
        caption: "Zusammen neu bauen",
        question: "Die Klötze liegen auf dem Boden. Was kann der kleine Bär tun?",
        beats: [
          { narration: "Er gibt dem Fuchs einen Klotz.", line: "Bauen wir zusammen?" },
          { line: "Au ja!", sound: "pop" },
        ],
        instead: { caption: "Mit Klötzen werfen", answer: "Hmm, der Klotz trifft den Fuchs. Das tut weh. Bau lieber mit ihm zusammen.", sound: "aua" },
      },
    ],
    outro: [{ narration: "Super! Entschuldigung sagen, tief pusten, zusammen bauen. Der neue Turm ist noch höher!", sound: "cheer" }],
    endCaption: "Neuer hoher Turm, Bär und Fuchs lachen",
  },
  // C-44
  {
    id: "laughed",
    emoji: "😣",
    title: "Gekränkt, ausgelacht beim Malen",
    caption: "Waschbär lacht über das Bild, Bär ist gekränkt",
    intro: [
      { narration: "Der kleine Bär malt im Kindergarten. Bunte Kringel. Das ist der große Bär!" },
      { narration: "Der Waschbär zeigt drauf und lacht. Der kleine Bär ist gekränkt." },
    ],
    steps: [
      {
        caption: "„Das mag ich nicht!“ sagen",
        question: "Der Waschbär lacht über das Bild vom kleinen Bären. Was kann der kleine Bär tun?",
        beats: [
          { narration: "Der kleine Bär sagt laut:", line: "Lach nicht! Das mag ich nicht!" },
          { narration: "Der Waschbär hört auf zu lachen.", line: "Okay. Tut mir leid." },
        ],
        instead: {
          caption: "Das Bild vom Waschbären zerreißen",
          answer: "Hmm, jetzt ist das Bild vom Waschbären kaputt, und er weint. Sag lieber laut: Das mag ich nicht!",
        },
      },
      {
        caption: "Fäuste drücken und pusten",
        question: "Der kleine Bär ist ganz gekränkt. Was kann er tun?",
        beats: [{ narration: "Er drückt die Fäuste ganz fest. Dann pustet er tief nach oben. Puuuh.", sound: "breath" }, { line: "Schon besser." }],
        instead: {
          caption: "Mit Stiften werfen",
          answer: "Hmm, die Stifte treffen den Waschbären. Das tut weh. Drück lieber die Fäuste und puste.",
          sound: "aua",
        },
      },
      {
        caption: "Beim Hasen weitermalen",
        question: "Der Hase malt ganz in Ruhe. Was kann der kleine Bär tun?",
        beats: [{ narration: "Der kleine Bär setzt sich neben den Hasen und malt weiter." }, { line: "Schön! Das ist ja der große Bär!", sound: "pop" }],
        instead: { caption: "Eigenes Bild zerknüllen", answer: "Hmm, jetzt ist dein schönes Bild kaputt. Setz dich lieber zum Hasen und mal weiter." },
      },
    ],
    outro: [{ narration: "Super! Sagen, was du nicht magst, pusten, weitermalen. Jetzt hängt das Bild an der Wand.", sound: "cheer" }],
    endCaption: "Bild vom Bären hängt an der Wand, Waschbär schaut es an",
  },
  // C-45
  {
    id: "excited",
    emoji: "🧳",
    title: "Zu aufgeregt zum Schlafen",
    caption: "Koffer gepackt, Bär ist hellwach im Bett",
    intro: [
      { narration: "Morgen fährt der kleine Bär ans Meer! Sein Koffer ist schon gepackt." },
      { narration: "Er liegt im Bett. Er ist so aufgeregt, er kann nicht schlafen." },
    ],
    steps: [
      {
        caption: "Pfote auf den Bauch legen",
        question: "Der kleine Bär ist ganz aufgeregt. Was kann er tun?",
        beats: [{ narration: "Er legt die Pfote auf den Bauch und atmet ganz langsam. Ein und aus.", sound: "breath" }],
        instead: {
          caption: "Koffer auskippen",
          answer: "Hmm, rumms! Jetzt liegt alles auf dem Boden. Leg lieber die Pfote auf den Bauch und atme langsam.",
          sound: "crash",
        },
      },
      {
        caption: "Dem Kuschelhasen flüstern",
        question: "Der kleine Bär denkt die ganze Zeit ans Meer. Was kann er tun?",
        beats: [{ narration: "Er flüstert seinem Kuschelhasen ins Ohr:", line: "Morgen bauen wir eine Sandburg." }],
        instead: {
          caption: "Auf den Eimer trommeln",
          answer: "Hmm, so laut! Jetzt ist das Baby nebenan aufgewacht. Flüster lieber deinem Kuschelhasen, was du morgen baust.",
        },
      },
      {
        caption: "Augen zu, an die Wellen denken",
        question: "Es ist schon spät. Was kann der kleine Bär tun?",
        beats: [{ narration: "Er macht die Augen zu und denkt an die Wellen." }, { narration: "Schsch, schsch. Er wird ganz ruhig.", sound: "breath" }],
        instead: { caption: "Licht an und spielen", answer: "Hmm, im Hellen wird man ganz wach. Mach lieber die Augen zu und denk an die Wellen." },
      },
    ],
    outro: [{ narration: "Super! Langsam atmen, dem Kuschelhasen flüstern, an die Wellen denken. Gute Nacht!", sound: "musicbox" }],
    endCaption: "Bär schläft, die Schaufel im Arm",
  },
  // C-46
  {
    id: "envy",
    emoji: "🛴",
    title: "Neidisch auf das Laufrad",
    caption: "Fuchs zeigt sein neues Laufrad, Bär ist neidisch",
    intro: [
      { narration: "Der Fuchs hat ein neues Laufrad. Rot, mit Klingel!", sound: "chime" },
      { narration: "Der kleine Bär hat nur seinen alten Roller. Er ist neidisch." },
    ],
    steps: [
      {
        caption: "Fäuste drücken",
        question: "Der kleine Bär will auch so ein Laufrad. Was kann er tun?",
        beats: [
          { narration: "Der kleine Bär drückt die Fäuste ganz fest und sagt:", line: "Das will ich auch!" },
          { narration: "Puh. Jetzt geht es ihm besser." },
        ],
        instead: { caption: "Laufrad umschubsen", answer: "Hmm, jetzt ist die Klingel kaputt. Drück lieber die Fäuste ganz fest.", sound: "crash" },
      },
      {
        caption: "„Darf ich mal?“ fragen",
        question: "Der kleine Bär will auch mal Laufrad fahren. Was kann er tun?",
        beats: [
          { narration: "Der kleine Bär fragt:", line: "Darf ich mal?" },
          { line: "Ja! Nach meiner Runde.", sound: "pop" },
        ],
        instead: { caption: "Den Fuchs vom Laufrad ziehen", answer: "Hmm, jetzt ist der Fuchs hingefallen. Frag lieber: Darf ich mal?", sound: "aua" },
      },
      {
        caption: "Tauschen",
        question: "Der kleine Bär hat einen Roller. Was kann er tun?",
        beats: [
          { narration: "Der kleine Bär fragt:", line: "Wollen wir tauschen?" },
          { narration: "Der Fuchs probiert den Roller, der kleine Bär das Laufrad.", sound: "pop" },
        ],
        instead: { caption: "Roller wegtreten", answer: "Hmm, jetzt ist dein Roller kaputt. Tausch lieber mit dem Fuchs.", sound: "crash" },
      },
    ],
    outro: [{ narration: "Super! Fäuste drücken, fragen, tauschen. Jetzt fahren beide zusammen.", sound: "cheer" }],
    endCaption: "Bär und Fuchs fahren nebeneinander, Bär klingelt",
  },
  // C-47
  {
    id: "supermarket",
    emoji: "🛒",
    title: "Angst, allein im Supermarkt",
    caption: "Bär allein zwischen den Regalen, hat Angst",
    intro: [{ narration: "Der kleine Bär ist im Supermarkt." }, { narration: "Wo ist der große Bär? Der kleine Bär sieht ihn nicht mehr. Er hat Angst." }],
    steps: [
      {
        caption: "Stehen bleiben wie ein Baum",
        question: "Der kleine Bär ist allein. Was kann er tun?",
        beats: [
          { narration: "Der kleine Bär bleibt stehen wie ein Baum. Die Füße fest auf dem Boden." },
          { narration: "Er atmet tief ein und aus.", sound: "breath" },
        ],
        instead: { caption: "Regal hochklettern", answer: "Hmm, das Regal wackelt, und alles fällt runter. Bleib lieber stehen wie ein Baum.", sound: "crash" },
      },
      {
        caption: "„Papa!“ rufen",
        question: "Der kleine Bär sieht den großen Bären nicht. Was kann er tun?",
        beats: [{ narration: "Er ruft ganz laut:", line: "Papa! Ich bin hier!" }, { line: "Ich höre dich! Ich komme!" }],
        instead: { caption: "Dosenturm umwerfen", answer: "Hmm, jetzt liegen alle Dosen auf dem Boden. Ruf lieber ganz laut: Papa!", sound: "crash" },
      },
      {
        caption: "Kuschelhasen drücken und warten",
        question: "Der große Bär sucht ihn. Was kann der kleine Bär tun?",
        beats: [{ narration: "Er drückt seinen Kuschelhasen ganz fest und wartet genau da, wo er ist." }],
        instead: {
          caption: "Äpfel rausrollen",
          answer: "Hmm, jetzt rollen die Äpfel überall herum. Drück lieber deinen Kuschelhasen und warte hier.",
          sound: "crash",
        },
      },
    ],
    outro: [
      { narration: "Da kommt der große Bär um die Ecke!", line: "Da bist du ja!" },
      { narration: "Super! Stehen bleiben, laut rufen, warten.", sound: "cheer" },
    ],
    endCaption: "Großer Bär ist da, beide umarmen sich",
  },
  // C-48
  {
    id: "pointing",
    emoji: "🥄",
    title: "Wütend, keiner versteht mich",
    caption: "Großer Bär hält einen Apfel hoch, Bär will den Joghurt",
    intro: [
      { narration: "Der kleine Bär will den Joghurt. Er ruft:", line: "Da! Da!" },
      { narration: "Der große Bär hält einen Apfel hoch. Nein! Der kleine Bär ist so wütend." },
    ],
    steps: [
      {
        caption: "Genau zeigen",
        question: "Der große Bär hält einen Apfel hoch. Was kann der kleine Bär tun?",
        beats: [{ narration: "Der kleine Bär zeigt mit der Pfote genau auf den Joghurt." }, { line: "Ah, den Joghurt!", sound: "pop" }],
        instead: { caption: "Apfel aus der Pfote schlagen", answer: "Hmm, das tut dem großen Bären weh. Zeig lieber genau auf den Joghurt.", sound: "aua" },
      },
      {
        caption: "Stampfen und pusten",
        question: "Der kleine Bär ist ganz wütend. Was kann er tun?",
        beats: [
          { narration: "Er stampft ganz fest. Bumm, bumm!", sound: "stomp" },
          { narration: "Dann pustet er ganz tief. Puuuh.", sound: "breath" },
        ],
        instead: {
          caption: "Gegen den Kühlschrank treten",
          answer: "Hmm, jetzt ist im Kühlschrank alles umgefallen. Stampf lieber ganz fest und puste.",
          sound: "crash",
        },
      },
      {
        caption: "Zum Kühlschrank ziehen",
        question: "Der große Bär versteht ihn nicht. Was kann der kleine Bär tun?",
        beats: [
          { narration: "Er nimmt den großen Bären an der Pfote und zieht ihn zum Kühlschrank." },
          { line: "Ach, der Joghurt! Jetzt verstehe ich.", sound: "pop" },
        ],
        instead: {
          caption: "Ganz laut schreien",
          answer: "Hmm, so laut! Das tut dem großen Bären in den Ohren weh. Nimm ihn lieber an der Pfote.",
          sound: "aua",
        },
      },
    ],
    outro: [{ narration: "Super! Zeigen, stampfen und pusten, hinführen. Jetzt löffeln beide Joghurt.", sound: "cheer" }],
    endCaption: "Bär und großer Bär löffeln Joghurt",
  },
  // C-49
  {
    id: "bee",
    emoji: "🐝",
    title: "Angst vor der Biene",
    caption: "Biene summt um den Saft, Bär hat Angst",
    intro: [
      { narration: "Der kleine Bär und der große Bär machen Picknick auf der Wiese." },
      { narration: "Summ, summ! Eine Biene fliegt um den Saft. Der kleine Bär hat Angst." },
    ],
    steps: [
      {
        caption: "Ganz still sitzen",
        question: "Die Biene summt um den Saft. Was kann der kleine Bär tun?",
        beats: [{ narration: "Der kleine Bär sitzt ganz still. Wie ein Stein." }, { line: "Gut so. Die Biene will nur den Saft." }],
        instead: { caption: "Nach der Biene schlagen", answer: "Hmm, jetzt hat die Biene gestochen. Bleib lieber ganz still sitzen.", sound: "aua" },
      },
      {
        caption: "Langsam weggehen",
        question: "Die Biene bleibt am Becher. Was kann der kleine Bär tun?",
        beats: [{ narration: "Er steht langsam auf und geht ein paar Schritte weg." }, { narration: "Hier ist keine Biene. Puh!" }],
        instead: { caption: "Saft umkippen", answer: "Hmm, platsch! Jetzt ist die Decke ganz nass. Geh lieber langsam ein paar Schritte weg.", sound: "crash" },
      },
      {
        caption: "Zuschauen und ausatmen",
        question: "Die Biene fliegt los. Was kann der kleine Bär tun?",
        beats: [{ narration: "Er schaut zu, wie die Biene zu den Blumen fliegt." }, { narration: "Dann atmet er tief aus. Puuuh.", sound: "breath" }],
        instead: {
          caption: "Ball nach der Biene werfen",
          answer: "Hmm, jetzt sind Saft und Tee umgekippt. Schau lieber zu, wie die Biene wegfliegt.",
          sound: "crash",
        },
      },
    ],
    outro: [{ narration: "Super! Still sitzen, weggehen, ausatmen. Die Biene summt jetzt in den Blumen.", sound: "cheer" }],
    endCaption: "Beide sitzen auf der Decke, die Biene ist bei den Blumen",
  },
  // C-50
  {
    id: "phone",
    emoji: "📞",
    title: "Warten, großer Bär telefoniert",
    caption: "Großer Bär telefoniert, Bär will sein Bild zeigen",
    intro: [
      { narration: "Der große Bär telefoniert in der Küche." },
      { narration: "Der kleine Bär will ihm sein neues Bild zeigen. Jetzt gleich! Warten ist so schwer." },
    ],
    steps: [
      {
        caption: "Leise antippen",
        question: "Der große Bär telefoniert. Was kann der kleine Bär tun?",
        beats: [
          { narration: "Der kleine Bär tippt den großen Bären leise am Arm an." },
          { narration: "Der große Bär hebt die Pfote und flüstert:", line: "Gleich." },
        ],
        instead: {
          caption: "Telefon wegreißen",
          answer: "Hmm, jetzt ist das Telefon runtergefallen und kaputt. Tipp den großen Bären lieber leise an.",
          sound: "crash",
        },
      },
      {
        caption: "Mit dem Kuschelhasen zählen",
        question: "Das Telefonieren dauert. Was kann der kleine Bär tun?",
        beats: [
          { narration: "Er setzt sich mit dem Kuschelhasen im Arm auf den Stuhl und zählt an den Fingern." },
          { line: "Eins, zwei, drei, vier, fünf!", sound: "pop" },
        ],
        instead: {
          caption: "Laut dazwischenschreien",
          answer: "Hmm, so laut! Das tut dem großen Bären in den Ohren weh. Zähl lieber an den Fingern.",
          sound: "aua",
        },
      },
      {
        caption: "Bild auf den Tisch legen",
        question: "Der kleine Bär hält sein Bild. Was kann er tun?",
        beats: [{ narration: "Er legt sein Bild schön auf den Tisch und malt eine Sonne dazu." }, { narration: "So ist es fertig, wenn der große Bär kommt." }],
        instead: { caption: "Bild zerknüllen", answer: "Hmm, jetzt ist dein schönes Bild zerknüllt. Leg es lieber schön auf den Tisch." },
      },
    ],
    outro: [
      { narration: "Der große Bär legt auf und schaut sich das Bild ganz lange an.", line: "Oh, ist das schön!" },
      { narration: "Super! Leise antippen, zählen, das Bild hinlegen.", sound: "cheer" },
    ],
    endCaption: "Großer Bär schaut sich lange das Bild an",
  },
  // C-51
  {
    id: "hit",
    emoji: "🩹",
    title: "Selbst gehauen, und jetzt?",
    caption: "Fuchs hält sich den Arm, Bär erschrickt",
    intro: [
      { narration: "Der kleine Bär und der Fuchs streiten um die Schaufel. Da haut der kleine Bär den Fuchs." },
      { narration: "Der Fuchs weint. Der kleine Bär erschrickt.", sound: "cry" },
    ],
    steps: [
      {
        caption: "Pfoten runter, tief pusten",
        question: "Der kleine Bär hat gehauen. Was kann er tun?",
        beats: [{ narration: "Der kleine Bär nimmt die Pfoten runter und pustet ganz tief. Puuuh.", sound: "breath" }, { narration: "Jetzt ist er ruhiger." }],
        instead: { caption: "Nochmal hauen", answer: "Hmm, das tut dem Fuchs noch mehr weh. Nimm lieber die Pfoten runter und puste.", sound: "aua" },
      },
      {
        caption: "„Entschuldigung!“ sagen",
        question: "Der Fuchs weint. Was kann der kleine Bär tun?",
        beats: [
          { narration: "Der kleine Bär sagt:", line: "Entschuldigung! Das wollte ich nicht." },
          { narration: "Der Fuchs schnieft.", line: "Okay." },
        ],
        instead: { caption: "Mit der Schaufel weiterbuddeln", answer: "Hmm, jetzt weint der Fuchs noch mehr. Sag ihm lieber: Entschuldigung!" },
      },
      {
        caption: "Zur Erzieherin gehen",
        question: "Dem Fuchs tut der Arm weh. Was kann der kleine Bär tun?",
        beats: [
          { narration: "Er geht mit dem Fuchs zur Erzieherin." },
          { narration: "Sie legt einen Kühlakku auf den Arm.", line: "So, gleich wird es besser." },
        ],
        instead: { caption: "Den Fuchs auslachen", answer: "Hmm, Auslachen macht den Fuchs noch trauriger. Geh lieber mit ihm zur Erzieherin." },
      },
    ],
    outro: [{ narration: "Super! Pusten, Entschuldigung sagen, Hilfe holen. Jetzt buddeln beide zusammen.", sound: "cheer" }],
    endCaption: "Bär und Fuchs buddeln zusammen",
  },
  // C-55
  {
    id: "pickup",
    emoji: "🤗",
    title: "Freude beim Abholen",
    caption: "Großer Bär winkt in der Tür, Bär strahlt",
    intro: [
      { narration: "Es ist Nachmittag im Kindergarten. Da steht der große Bär in der Tür!" },
      { narration: "Der kleine Bär freut sich riesig!", sound: "laugh" },
    ],
    steps: [
      {
        caption: "Hüpfen und winken",
        question: "Der große Bär ist da! Was kann der kleine Bär tun?",
        beats: [{ narration: "Der kleine Bär hüpft vor Freude und winkt.", line: "Papa!", sound: "bounce" }, { line: "Hallo, kleiner Bär!" }],
        instead: { caption: "Den Fuchs umrennen", answer: "Hmm, jetzt ist der Fuchs hingefallen. Hüpf lieber und wink.", sound: "aua" },
      },
      {
        caption: "„Tschüss!“ zum Fuchs sagen",
        question: "Der Fuchs baut einen Turm. Was kann der kleine Bär tun?",
        beats: [{ narration: "Erst geht der kleine Bär zum Fuchs.", line: "Tschüss, bis morgen!" }, { line: "Tschüss, Bär!" }],
        instead: { caption: "Turm umrennen", answer: "Hmm, jetzt ist der Turm vom Fuchs kaputt. Sag ihm lieber erst: Tschüss!", sound: "crash" },
      },
      {
        caption: "Ganz fest drücken",
        question: "Der kleine Bär freut sich so! Was kann er tun?",
        beats: [{ narration: "Er läuft in die Arme vom großen Bären und drückt ihn ganz fest." }, { line: "Ich hab dich vermisst!", sound: "laugh" }],
        instead: { caption: "Tasche wegreißen", answer: "Hmm, ratsch! Jetzt ist der Riemen ab. Lauf lieber in seine Arme und drück ihn.", sound: "crash" },
      },
    ],
    outro: [{ narration: "Super! Hüpfen und winken, tschüss sagen, ganz fest drücken. Jetzt geht es nach Hause.", sound: "cheer" }],
    endCaption: "Bär und großer Bär gehen Hand in Hand, der Fuchs winkt",
  },
  // C-56
  {
    id: "bath",
    emoji: "🫧",
    title: "Albern in der Badewanne",
    caption: "Bär und Fuchs kichern in der Wanne",
    intro: [
      { narration: "Der Fuchs ist zu Besuch. Er und der kleine Bär baden zusammen." },
      { narration: "Sie kichern und kichern. Der kleine Bär ist ganz albern!", sound: "laugh" },
    ],
    steps: [
      {
        caption: "Schaumbart machen",
        question: "Der kleine Bär ist ganz albern. Was kann er tun?",
        beats: [
          { narration: "Der kleine Bär macht sich einen Schaumbart.", line: "Ho, ho, ho!" },
          { narration: "Der Fuchs lacht mit.", sound: "laugh" },
        ],
        instead: { caption: "Fuchs nass spritzen", answer: "Hmm, jetzt hat der Fuchs Wasser in den Augen und weint. Mach dir lieber einen Schaumbart." },
      },
      {
        caption: "Schaum hochpusten",
        question: "Der kleine Bär ist ganz wild vor Freude. Was kann er tun?",
        beats: [
          { narration: "Er nimmt Schaum auf die Pfote und pustet ganz langsam. Puuuh.", sound: "breath" },
          { narration: "Die Flocken fliegen hoch. Der kleine Bär wird ruhig und lacht leise." },
        ],
        instead: {
          caption: "Shampoo ausleeren",
          answer: "Hmm, jetzt ist das Shampoo alle, und der Schaum brennt dem Fuchs in den Augen. Puste lieber ganz langsam Schaum hoch.",
        },
      },
      {
        caption: "Ins Handtuch kuscheln",
        question: "Das Baden ist fertig. Was kann der kleine Bär tun?",
        beats: [
          { narration: "Der kleine Bär steigt langsam aus der Wanne.", line: "Handtuch, bitte!" },
          { narration: "Er kuschelt sich ins weiche Handtuch.", sound: "pop" },
        ],
        instead: {
          caption: "Aus der Wanne springen",
          answer: "Hmm, auf dem nassen Boden rutscht man aus. Steig lieber langsam raus, ins Handtuch.",
          sound: "aua",
        },
      },
    ],
    outro: [{ narration: "Super! Schaumbart machen, Schaum pusten, ins Handtuch kuscheln. Jetzt kichern beide ganz leise.", sound: "cheer" }],
    endCaption: "Bär und Fuchs kichern leise im Handtuch",
  },
  // C-57
  {
    id: "butterfly",
    emoji: "🦋",
    title: "Staunen, ein Schmetterling",
    caption: "Schmetterling auf der Blume, Bär staunt",
    intro: [{ narration: "Der kleine Bär und der Fuchs sind im Garten." }, { narration: "Da! Auf der Blume sitzt ein Schmetterling. Der kleine Bär staunt." }],
    steps: [
      {
        caption: "Ganz still stehen",
        question: "Der Schmetterling sitzt ganz nah. Was kann der kleine Bär tun?",
        beats: [
          { narration: "Der kleine Bär steht ganz still. Er atmet ganz leise." },
          { narration: "Der Schmetterling bleibt sitzen und klappt die Flügel auf und zu.", sound: "chime" },
        ],
        instead: {
          caption: "Nach dem Schmetterling greifen",
          answer: "Hmm, Schmetterlinge sind ganz zart. Jetzt ist er weggeflogen, und der Fuchs ist traurig. Steh lieber ganz still.",
        },
      },
      {
        caption: "Leise „Guck mal!“ flüstern",
        question: "Der Fuchs will den Schmetterling auch sehen. Was kann der kleine Bär tun?",
        beats: [
          { narration: "Der kleine Bär macht Platz und zeigt auf die Blume.", line: "Psst, guck mal!" },
          { line: "Oh, wie schön!", sound: "pop" },
        ],
        instead: { caption: "Fuchs wegschubsen", answer: "Hmm, Schubsen tut weh. Mach lieber Platz und flüster: Guck mal!", sound: "aua" },
      },
      {
        caption: "Flattern wie ein Schmetterling",
        question: "Der Schmetterling fliegt los. Was kann der kleine Bär tun?",
        beats: [
          { narration: "Der kleine Bär flattert mit den Armen wie ein Schmetterling.", line: "Flatter, flatter!" },
          { narration: "Der Fuchs flattert mit.", sound: "laugh" },
        ],
        instead: {
          caption: "Durchs Blumenbeet rennen",
          answer: "Hmm, jetzt sind die Blumen umgeknickt, und der Fuchs ist traurig. Flatter lieber wie ein Schmetterling.",
        },
      },
    ],
    outro: [{ narration: "Super! Still stehen, leise zeigen, flattern. Und der Schmetterling landet auf der Gießkanne.", sound: "cheer" }],
    endCaption: "Schmetterling auf der Gießkanne, beide lachen leise",
  },
  // C-58
  {
    id: "morning",
    emoji: "🌅",
    title: "Morgenmuffel, Aufstehen ist schwer",
    caption: "Morgens im Bett, Bär ist grummelig",
    intro: [{ narration: "Es ist Morgen. Der kleine Bär wacht auf." }, { narration: "Er ist so verschlafen. Aufstehen ist schwer! Er ist grummelig." }],
    steps: [
      {
        caption: "Strecken und gähnen",
        question: "Der kleine Bär ist verschlafen und grummelig. Was kann er tun?",
        beats: [
          { narration: "Der kleine Bär streckt sich ganz lang, wie eine Katze." },
          { narration: "Dann gähnt er ganz groß. Uaaah! Schon wacher.", sound: "breath" },
        ],
        instead: { caption: "Wecker runterwerfen", answer: "Hmm, jetzt ist der Wecker kaputt. Streck dich lieber ganz lang wie eine Katze.", sound: "crash" },
      },
      {
        caption: "Hausschuhe anziehen",
        question: "Die Hausschuhe stehen vor dem Bett. Was kann der kleine Bär tun?",
        beats: [
          { narration: "Der kleine Bär schlüpft in seine Hausschuhe. Erst in den einen, dann in den anderen." },
          { line: "Guten Morgen, Baby!", sound: "laugh" },
        ],
        instead: { caption: "Hausschuh nach dem Baby werfen", answer: "Hmm, der Hausschuh trifft das Baby. Zieh deine Hausschuhe lieber an.", sound: "aua" },
      },
      {
        caption: "Vorhang aufziehen",
        question: "Der Vorhang ist zu, das Zimmer ist dunkel. Was kann der kleine Bär tun?",
        beats: [
          { narration: "Der kleine Bär zieht den Vorhang auf.", sound: "chime" },
          { narration: "Die Sonne scheint herein. Er blinzelt und lächelt.", line: "Hallo, Sonne!" },
        ],
        instead: {
          caption: "Vorhang runterreißen",
          answer: "Hmm, jetzt liegt der Vorhang am Boden. Zieh ihn lieber auf und lass die Sonne rein.",
          sound: "crash",
        },
      },
    ],
    outro: [{ narration: "Super! Strecken, Hausschuhe anziehen, Sonne reinlassen. Guten Morgen!", sound: "cheer" }],
    endCaption: "Bär in Hausschuhen geht mit dem Baby zum Frühstück",
  },
  // C-59
  {
    id: "worn",
    emoji: "🎒",
    title: "Geschafft nach dem Kindergarten",
    caption: "Bär liegt in Jacke im Flur, ganz geschafft",
    intro: [
      { narration: "Der kleine Bär kommt aus dem Kindergarten nach Hause." },
      { narration: "Er legt sich in der Jacke auf den Boden. Er ist so geschafft und quengelig." },
    ],
    steps: [
      {
        caption: "Liegen und tief atmen",
        question: "Der kleine Bär ist ganz geschafft und quengelig. Was kann er tun?",
        beats: [
          { narration: "Der kleine Bär bleibt einfach liegen. Er atmet tief ein und ganz langsam aus. Puuuh.", sound: "breath" },
          { narration: "Schon ein bisschen ruhiger." },
        ],
        instead: { caption: "Brotdose an die Wand werfen", answer: "Hmm, jetzt ist die Brotdose kaputt. Bleib lieber liegen und atme tief.", sound: "crash" },
      },
      {
        caption: "„Ich bin so geschafft“ sagen",
        question: "Alles ist dem kleinen Bären zu viel. Was kann er tun?",
        beats: [
          { narration: "Der kleine Bär sagt zum großen Bären:", line: "Ich bin so geschafft." },
          { line: "Das glaub ich dir. Komm, ich helf dir mit der Jacke." },
        ],
        instead: {
          caption: "Turm vom Baby umwerfen",
          answer: "Hmm, jetzt ist der Turm vom Baby kaputt, und es weint. Sag lieber: Ich bin so geschafft.",
          sound: "crash",
        },
      },
      {
        caption: "In die Kuschelecke krabbeln",
        question: "Der kleine Bär braucht Ruhe. Was kann er tun?",
        beats: [
          { narration: "Der kleine Bär krabbelt selbst in die Kuschelecke." },
          { narration: "Er kuschelt sich ins Kissen und drückt seinen Kuschelhasen.", sound: "pop" },
        ],
        instead: {
          caption: "Den großen Bären hauen",
          answer: "Hmm, Hauen tut weh. Der große Bär will nur helfen. Krabbel lieber in die Kuschelecke.",
          sound: "aua",
        },
      },
    ],
    outro: [{ narration: "Super! Tief atmen, sagen, wie es dir geht, ausruhen. Jetzt geht es ihm besser.", sound: "cheer" }],
    endCaption: "Bär liegt mit Kuschelhase in der Kuschelecke",
  },
  // C-60
  {
    id: "sick",
    emoji: "🤧",
    title: "Krank und schlapp",
    caption: "Bär ist krank, draußen spielt der Fuchs",
    intro: [
      { narration: "Der kleine Bär ist krank. Er liegt auf dem Sofa, die Nase läuft." },
      { narration: "Draußen spielt der Fuchs mit dem Ball. Der kleine Bär ist schlapp und traurig." },
    ],
    steps: [
      {
        caption: "In die Decke kuscheln",
        question: "Der kleine Bär ist krank und ganz schlapp. Was kann er tun?",
        beats: [
          { narration: "Der kleine Bär kuschelt sich in die Decke und macht die Augen zu." },
          { narration: "Er atmet ganz ruhig. Ausruhen tut gut.", sound: "breath" },
        ],
        instead: {
          caption: "Teetasse runterschubsen",
          answer: "Hmm, jetzt ist die Tasse kaputt und der Tee ausgelaufen. Kuschel dich lieber in die Decke.",
          sound: "crash",
        },
      },
      {
        caption: "Dem Fuchs winken",
        question: "Der kleine Bär will auch raus, aber er muss drinnen bleiben. Was kann er tun?",
        beats: [{ narration: "Der kleine Bär winkt dem Fuchs durchs Fenster." }, { narration: "Der Fuchs winkt zurück und lacht.", sound: "laugh" }],
        instead: {
          caption: "Gegen das Fenster hauen",
          answer: "Hmm, das tut an der Pfote weh, und das Fenster kann kaputtgehen. Wink dem Fuchs lieber.",
          sound: "aua",
        },
      },
      {
        caption: "Bilderbuch anschauen",
        question: "Auf dem Sofa wird es dem kleinen Bären langweilig. Was kann er tun?",
        beats: [{ narration: "Der kleine Bär schlägt das Bilderbuch auf." }, { narration: "Er schaut die Bilder an. Ein Schiff, ein Wal!", sound: "pop" }],
        instead: { caption: "Bilderbuch zerreißen", answer: "Hmm, jetzt ist das schöne Bilderbuch kaputt. Schau dir lieber die Bilder an." },
      },
    ],
    outro: [{ narration: "Super! Ausruhen, winken, Bilder anschauen. Bald ist der kleine Bär gesund.", sound: "cheer" }],
    endCaption: "Bär winkt mit dem Buch, Fuchs winkt draußen",
  },
  // C-61
  {
    id: "car",
    emoji: "🚗",
    title: "Quengelig im Auto",
    caption: "Lange Fahrt zu Oma Bär, Bär ist quengelig",
    intro: [
      { narration: "Der große Bär fährt mit dem kleinen Bären und dem Baby zu Oma Bär." },
      { narration: "Die Fahrt ist so lang! Das Baby schläft. Der kleine Bär ist quengelig." },
    ],
    steps: [
      {
        caption: "Kuschelhasen fest drücken",
        question: "Die Fahrt ist so lang. Was kann der kleine Bär tun?",
        beats: [
          { narration: "Der kleine Bär legt die Arme ganz fest um seinen Kuschelhasen." },
          { narration: "Fest drücken. Und loslassen. Schon besser.", sound: "breath" },
        ],
        instead: {
          caption: "Gegen den Sitz treten",
          answer: "Hmm, das tut dem großen Bären im Rücken weh, und er muss doch fahren. Drück lieber deinen Kuschelhasen ganz fest.",
          sound: "aua",
        },
      },
      {
        caption: "Autos zählen",
        question: "Der kleine Bär sitzt schon so lange im Kindersitz. Was kann er tun?",
        beats: [{ narration: "Der kleine Bär schaut aus dem Fenster und zählt Autos." }, { line: "Ein rotes Auto! Ein blaues! Ein gelbes!", sound: "pop" }],
        instead: {
          caption: "Trinkflasche nach vorne werfen",
          answer: "Hmm, die Flasche fliegt nach vorne zum großen Bären. Beim Fahren ist das gefährlich. Zähl lieber Autos.",
          sound: "crash",
        },
      },
      {
        caption: "Augen zumachen",
        question: "Der kleine Bär ist müde und quengelig. Was kann er tun?",
        beats: [
          { narration: "Der kleine Bär lehnt den Kopf an und macht die Augen zu." },
          { narration: "Gleich schläft er, wie das Baby.", sound: "musicbox" },
        ],
        instead: { caption: "Das Baby wecken", answer: "Hmm, jetzt ist das Baby wach und weint. Mach lieber die Augen zu." },
      },
    ],
    outro: [{ narration: "Super! Kuschelhasen drücken, Autos zählen, Augen zumachen. Gleich sind sie bei Oma Bär.", sound: "cheer" }],
    endCaption: "Bär und Baby schlafen, großer Bär fährt zu Oma",
  },
  // C-62
  {
    id: "sticky",
    emoji: "🎨",
    title: "Igitt, klebrige Pfoten",
    caption: "Pfoten voller Farbe, Bär ekelt sich",
    intro: [
      { narration: "Der kleine Bär und der Fuchs malen mit Fingerfarbe." },
      { narration: "Jetzt sind die Pfoten vom kleinen Bären ganz klebrig. Igitt! Er ekelt sich." },
    ],
    steps: [
      {
        caption: "Pfoten hoch und pusten",
        question: "Die Farbe klebt an den Pfoten. Igitt! Was kann der kleine Bär tun?",
        beats: [
          { narration: "Der kleine Bär hält die Pfoten hoch.", line: "Igitt, das klebt!" },
          { narration: "Dann pustet er ganz langsam aus. Puuuh. Schon besser.", sound: "breath" },
        ],
        instead: {
          caption: "Pfoten am Fuchs abwischen",
          answer: "Hmm, jetzt ist das T-Shirt vom Fuchs voller Farbe, und er weint. Halt deine Pfoten lieber hoch und puste.",
        },
      },
      {
        caption: "Pfoten waschen",
        question: "Der kleine Bär will saubere Pfoten. Was kann er tun?",
        beats: [{ narration: "Der kleine Bär geht zum Waschbecken und wäscht seine Pfoten.", sound: "splash" }, { line: "Alles sauber!" }],
        instead: { caption: "Farbbecher umwerfen", answer: "Hmm, jetzt ist die Farbe auf dem ganzen Tisch. Wasch lieber deine Pfoten.", sound: "crash" },
      },
      {
        caption: "Mit dem Pinsel malen",
        question: "Mit den Fingern malen mag der kleine Bär nicht. Was kann er tun?",
        beats: [
          { narration: "Der kleine Bär nimmt den Pinsel und malt weiter.", line: "So geht's auch!" },
          { narration: "Ein Baum und eine Sonne!", sound: "pop" },
        ],
        instead: { caption: "Bild vom Fuchs zerknüllen", answer: "Hmm, jetzt ist das Bild vom Fuchs kaputt, und er weint. Mal lieber mit dem Pinsel weiter." },
      },
    ],
    outro: [{ narration: "Super! Pfoten hoch und pusten, waschen, mit dem Pinsel malen. Jetzt zeigen beide ihre Bilder.", sound: "cheer" }],
    endCaption: "Bär und Fuchs halten ihre Bilder hoch",
  },
  // C-63
  {
    id: "nappy",
    emoji: "🧷",
    title: "Puh, die Windel stinkt",
    caption: "Windel vom Baby stinkt, Bär rümpft die Nase",
    intro: [{ narration: "Der kleine Bär spielt mit seinem Auto. Das Baby sitzt neben ihm." }, { narration: "Puh! Die Windel vom Baby stinkt. Igitt!" }],
    steps: [
      {
        caption: "Nase zuhalten und lachen",
        question: "Die Windel vom Baby stinkt. Was kann der kleine Bär tun?",
        beats: [
          { narration: "Der kleine Bär hält sich die Nase zu.", line: "Puuuh!" },
          { narration: "Er lacht. Das Baby lacht mit.", sound: "laugh" },
        ],
        instead: { caption: "Baby wegschubsen", answer: "Hmm, jetzt ist das Baby umgekippt und weint. Halt dir lieber die Nase zu." },
      },
      {
        caption: "Fenster aufmachen",
        question: "Im Zimmer riecht es nach Windel. Was kann der kleine Bär tun?",
        beats: [{ narration: "Der kleine Bär macht das Fenster auf." }, { narration: "Frische Luft kommt herein. Aaah!", sound: "breath" }],
        instead: { caption: "Auto nach dem Baby werfen", answer: "Hmm, das Auto trifft das Baby. Das tut weh. Mach lieber das Fenster auf.", sound: "aua" },
      },
      {
        caption: "Frische Windel reichen",
        question: "Der große Bär will das Baby wickeln. Was kann der kleine Bär tun?",
        beats: [
          { narration: "Der kleine Bär nimmt die frische Windel und gibt sie dem großen Bären.", line: "Hier!" },
          { line: "Danke! Das ist eine große Hilfe." },
        ],
        instead: {
          caption: "Wegrennen und Tür zuknallen",
          answer: "Hmm, die Tür knallt so laut, und das Baby erschrickt. Gib lieber dem großen Bären die frische Windel.",
          sound: "crash",
        },
      },
    ],
    outro: [{ narration: "Super! Nase zuhalten, Fenster auf, mithelfen. Jetzt riecht das Baby gut und lacht.", sound: "cheer" }],
    endCaption: "Baby frisch gewickelt, lacht mit Bär",
  },
  // C-64
  {
    id: "socks",
    emoji: "🧦",
    title: "Igitt, nasse Socken",
    caption: "Wasser im Stiefel, Bär ekelt sich",
    intro: [
      { narration: "Es hat geregnet. Der kleine Bär und der Fuchs gehen draußen spazieren." },
      { narration: "Platsch! Der kleine Bär tritt in eine tiefe Pfütze. Wasser im Stiefel! Igitt!", sound: "splash" },
    ],
    steps: [
      {
        caption: "Fuß schütteln",
        question: "Im Stiefel ist Wasser. Igitt! Was kann der kleine Bär tun?",
        beats: [
          { narration: "Der kleine Bär schüttelt seinen Fuß ganz doll.", line: "Igitt, alles nass!" },
          { narration: "Da muss er lachen.", sound: "laugh" },
        ],
        instead: {
          caption: "Den Fuchs in die Pfütze schubsen",
          answer: "Hmm, jetzt sitzt der Fuchs in der Pfütze und weint. Schüttel lieber deinen Fuß ganz doll.",
        },
      },
      {
        caption: "Stiefel auskippen",
        question: "Der Stiefel ist voll Wasser. Was kann der kleine Bär tun?",
        beats: [
          { narration: "Er setzt sich auf die Bank und zieht den Stiefel aus." },
          { narration: "Dann kippt er ihn aus. Platsch!", line: "Raus mit dem Wasser!", sound: "splash" },
        ],
        instead: {
          caption: "Stiefel nach dem Fuchs werfen",
          answer: "Hmm, der Stiefel trifft den Fuchs. Das tut weh. Setz dich lieber auf die Bank und kipp ihn aus.",
          sound: "aua",
        },
      },
      {
        caption: "Socke auswringen",
        question: "Die Socke ist klitschnass. Was kann der kleine Bär tun?",
        beats: [
          { narration: "Er zieht die nasse Socke aus und wringt sie aus. Plitsch, plitsch!" },
          { narration: "Dann zieht er den Stiefel wieder an.", line: "Viel besser!", sound: "laugh" },
        ],
        instead: { caption: "Den Fuchs nass spritzen", answer: "Hmm, jetzt ist der Fuchs auch nass und weint. Wring lieber deine Socke aus." },
      },
    ],
    outro: [{ narration: "Super! Fuß schütteln, Stiefel auskippen, Socke auswringen. Und weiter geht's!", sound: "cheer" }],
    endCaption: "Bär und Fuchs spazieren lachend weiter",
  },
  // C-65
  {
    id: "lick",
    emoji: "🐶",
    title: "Igitt, der Hund schleckt",
    caption: "Hund schleckt Bär ab, Bär ekelt sich",
    intro: [
      { narration: "Der kleine Bär ist im Park. Da kommt eine Füchsin mit einem kleinen Hund." },
      { narration: "Schleck! Der Hund schleckt ihm quer übers Gesicht. Igitt!" },
    ],
    steps: [
      {
        caption: "„Nicht schlecken!“ sagen",
        question: "Der Hund schleckt dem kleinen Bären übers Gesicht. Was kann der kleine Bär tun?",
        beats: [
          { narration: "Der kleine Bär dreht das Gesicht weg und sagt laut:", line: "Nicht schlecken!" },
          { line: "Oh, Entschuldigung! Sitz, Hund!" },
          { narration: "Der Hund setzt sich brav hin.", sound: "pop" },
        ],
        instead: { caption: "Den Hund hauen", answer: "Hmm, Hauen tut dem Hund weh. Dreh lieber das Gesicht weg und sag: Nicht schlecken!", sound: "aua" },
      },
      {
        caption: "Gesicht abwischen",
        question: "Das Gesicht ist ganz nass. Igitt! Was kann der kleine Bär tun?",
        beats: [
          { narration: "Der kleine Bär wischt sich mit der Pfote übers Gesicht.", line: "Igitt!" },
          { narration: "Dann muss er lachen.", sound: "laugh" },
        ],
        instead: { caption: "An den Ohren ziehen", answer: "Hmm, das tut dem Hund weh. Wisch dir lieber das Gesicht ab.", sound: "aua" },
      },
      {
        caption: "Am Rücken streicheln",
        question: "Der kleine Hund ist ganz lieb. Was kann der kleine Bär tun?",
        beats: [
          { narration: "Die Füchsin zeigt auf den Rücken vom Hund.", line: "Hier mag er es." },
          { narration: "Der kleine Bär streichelt ihn ganz vorsichtig.", line: "So weich!" },
          { narration: "Der Hund wedelt mit dem Schwanz.", sound: "pop" },
        ],
        instead: {
          caption: "Stock nach dem Hund werfen",
          answer: "Hmm, der Stock trifft den Hund. Streichel ihn lieber ganz vorsichtig am Rücken.",
          sound: "aua",
        },
      },
    ],
    outro: [{ narration: "Super! Nein sagen, Gesicht abwischen, vorsichtig streicheln. Tschüss, kleiner Hund!", sound: "cheer" }],
    endCaption: "Der Hund wedelt, Bär winkt ihm nach",
  },
  // C-67
  {
    id: "paintbrush",
    emoji: "🖌️",
    title: "Wütend, Baby nimmt den Pinsel",
    caption: "Baby hat den Pinsel, Bär ist wütend",
    intro: [
      { narration: "Der kleine Bär malt am Tisch. Das Bärenbaby sitzt neben ihm." },
      { narration: "Schwupp! Das Baby schnappt sich den Pinsel vom kleinen Bären und schmiert damit herum. Der kleine Bär ist wütend!" },
    ],
    steps: [
      {
        caption: "„Das ist meiner!“ sagen",
        question: "Das Baby hat den Pinsel vom kleinen Bären. Was kann er tun?",
        beats: [
          { narration: "Der kleine Bär sagt laut:", line: "Das ist meiner! Gib ihn mir bitte." },
          { narration: "Das Baby guckt. Dann gibt es ihm den Pinsel.", sound: "pop" },
        ],
        instead: { caption: "Pinsel wegreißen", answer: "Hmm, jetzt weint das Baby. Sag lieber laut: Das ist meiner!" },
      },
      {
        caption: "Ins Kissen boxen",
        question: "Der kleine Bär ist so wütend! Was kann er tun?",
        beats: [
          { narration: "Er geht zum Sofa und boxt ins Kissen. Bumm, bumm, bumm!", sound: "stomp" },
          { narration: "Die Wut ist raus.", line: "Puh. Schon besser." },
        ],
        instead: { caption: "Farbbecher werfen", answer: "Hmm, jetzt ist überall Farbe, und das Baby erschrickt. Box lieber ins Sofakissen.", sound: "crash" },
      },
      {
        caption: "Buntstift geben",
        question: "Das Baby will auch malen. Was kann der kleine Bär tun?",
        beats: [
          { narration: "Der kleine Bär gibt dem Baby einen Buntstift.", line: "Hier, der ist für dich!" },
          { narration: "Das Baby lässt den Pinsel los. Jetzt malen beide.", sound: "pop" },
        ],
        instead: { caption: "Blatt vom Baby zerreißen", answer: "Hmm, jetzt ist das Blatt kaputt und das Baby weint. Gib ihm lieber einen Buntstift." },
      },
    ],
    outro: [{ narration: "Super! Sagen, was deins ist, ins Kissen boxen, zusammen malen.", sound: "cheer" }],
    endCaption: "Bär und Baby malen zusammen",
  },
  // C-69
  {
    id: "bluecup",
    emoji: "🥣",
    title: "Wütend, der blaue Becher",
    caption: "Milch im roten Becher, Bär ist wütend",
    intro: [{ narration: "Frühstück! Der große Bär gießt Milch in den roten Becher." }, { narration: "Aber der kleine Bär will den blauen! Er ist wütend." }],
    steps: [
      {
        caption: "„Ich will den blauen!“ sagen",
        question: "Der kleine Bär will den blauen Becher. Was kann er tun?",
        beats: [
          { narration: "Der kleine Bär sagt laut:", line: "Ich will den blauen Becher!" },
          { line: "Ah, den blauen. Gut, dass du es sagst!" },
          { narration: "Der große Bär stellt den blauen Becher dazu.", sound: "pop" },
        ],
        instead: { caption: "Roten Becher umkippen", answer: "Hmm, jetzt ist die Milch ausgelaufen. Sag lieber laut: Ich will den blauen!", sound: "crash" },
      },
      {
        caption: "Ganz fest stampfen",
        question: "Der kleine Bär ist ganz wütend. Was kann er tun?",
        beats: [{ narration: "Der kleine Bär stampft ganz fest mit beiden Füßen. Stampf, stampf!", sound: "stomp" }, { line: "Puh. Schon besser." }],
        instead: {
          caption: "Mit dem Löffel hauen",
          answer: "Hmm, das ist so laut, und der Brei spritzt herum. Stampf lieber ganz fest mit den Füßen.",
          sound: "crash",
        },
      },
      {
        caption: "Selbst umgießen",
        question: "Die Milch ist im roten Becher. Was kann der kleine Bär tun?",
        beats: [
          { narration: "Der kleine Bär holt den blauen Becher. Der große Bär hält ihn fest." },
          { narration: "Und der kleine Bär gießt die Milch selbst um. Gluck, gluck!", line: "Ich hab's geschafft!", sound: "pop" },
        ],
        instead: {
          caption: "Brei runterschieben",
          answer: "Hmm, jetzt ist die Schüssel kaputt und der Brei liegt am Boden. Gieß lieber selbst um, in den blauen Becher.",
          sound: "crash",
        },
      },
    ],
    outro: [{ narration: "Super! Sagen, was du willst, ganz fest stampfen, selbst umgießen. Guten Appetit!", sound: "cheer" }],
    endCaption: "Bär trinkt froh aus dem blauen Becher",
  },
  // C-70
  {
    id: "nap",
    emoji: "😴",
    title: "Wach beim Mittagsschlaf",
    caption: "Alle schlafen, Bär ist hellwach",
    intro: [
      { narration: "Mittagsschlaf im Kindergarten. Der Fuchs und der Igel schlafen schon." },
      { narration: "Nur der kleine Bär ist hellwach. Er zappelt und zappelt. Er kann nicht einschlafen." },
    ],
    steps: [
      {
        caption: "Kuschelhasen drücken",
        question: "Alle schlafen, nur der kleine Bär ist wach. Was kann er tun?",
        beats: [
          { narration: "Der kleine Bär drückt seinen Kuschelhasen ganz fest an sich.", line: "Gute Nacht, Hase." },
          { narration: "Ganz weich und warm. Er wird ruhiger." },
        ],
        instead: { caption: "Den Fuchs anstupsen", answer: "Hmm, jetzt ist der Fuchs aufgewacht und weint. Drück lieber deinen Kuschelhasen ganz fest." },
      },
      {
        caption: "Langsam pusten",
        question: "Der kleine Bär zappelt und zappelt. Was kann er tun?",
        beats: [
          { narration: "Er pustet ganz langsam, wie bei einer Kerze. Puuuh.", sound: "breath" },
          { narration: "Und noch mal. Die Arme werden ganz schwer." },
        ],
        instead: { caption: "Laut singen", answer: "Hmm, jetzt sind alle wach, und der Igel weint. Puste lieber ganz langsam." },
      },
      {
        caption: "An etwas Schönes denken",
        question: "Der kleine Bär kann nicht einschlafen. Was kann er tun?",
        beats: [
          { narration: "Er liegt ganz still und denkt an etwas Schönes." },
          { narration: "An die Schaukel. Hin und her, hin und her.", sound: "musicbox" },
        ],
        instead: {
          caption: "Durch den Raum rennen",
          answer: "Hmm, er stolpert über den Igel. Das tut weh. Lieg lieber still und denk an etwas Schönes.",
          sound: "aua",
        },
      },
    ],
    outro: [{ narration: "Super! Kuschelhasen drücken, langsam pusten, an etwas Schönes denken. Und schon schläft er.", sound: "cheer" }],
    endCaption: "Bär schläft mit seinem Kuschelhasen",
  },
  // C-71
  {
    id: "teeth",
    emoji: "🪥",
    title: "Wütend beim Zähneputzen",
    caption: "Mund zu, Bär will nicht putzen",
    intro: [
      { narration: "Es ist Abend. Der kleine Bär hat schon seinen Schlafanzug an." },
      { narration: "Der große Bär hält die Zahnbürste hin. Aber der kleine Bär will nicht! Er macht den Mund ganz fest zu." },
    ],
    steps: [
      {
        caption: "Ganz fest stampfen",
        question: "Der kleine Bär will nicht Zähne putzen. Was kann er tun?",
        beats: [
          { narration: "Der kleine Bär stampft ganz fest mit beiden Füßen.", line: "Ich mag nicht!", sound: "stomp" },
          { line: "Ich weiß. Stampf ruhig ganz fest." },
          { narration: "Puh. Jetzt ist die Wut raus." },
        ],
        instead: {
          caption: "Zahnbürste wegschlagen",
          answer: "Hmm, jetzt liegt die Zahnbürste am Boden. Stampf lieber ganz fest und sag: Ich mag nicht!",
          sound: "crash",
        },
      },
      {
        caption: "Sanduhr umdrehen",
        question: "Zähneputzen dauert so lange. Was kann der kleine Bär tun?",
        beats: [
          { narration: "Der kleine Bär dreht die Sanduhr selbst um.", line: "Los geht's!", sound: "pop" },
          { narration: "Der Sand rieselt. Jetzt wird geputzt, bis er unten ist." },
        ],
        instead: { caption: "Wegrennen", answer: "Hmm, auf den glatten Fliesen rutscht er aus. Dreh lieber selbst die Sanduhr um.", sound: "aua" },
      },
      {
        caption: "Selbst putzen",
        question: "Der große Bär hält die Zahnbürste hin. Was kann der kleine Bär tun?",
        beats: [
          { narration: "Der kleine Bär nimmt die Zahnbürste und putzt selbst. Schrubb, schrubb!" },
          { narration: "Dann zeigt er dem Spiegel seine Zähne.", line: "Guck mal, ganz sauber!", sound: "chime" },
        ],
        instead: {
          caption: "Becher runterwerfen",
          answer: "Hmm, jetzt ist der Becher kaputt. Putz lieber selbst und zeig dem Spiegel deine Zähne.",
          sound: "crash",
        },
      },
    ],
    outro: [{ narration: "Super! Stampfen, die Sanduhr umdrehen, selbst putzen. Blitzeblank!", sound: "cheer" }],
    endCaption: "Bär zeigt im Spiegel seine sauberen Zähne",
  },
  // C-72
  {
    id: "bedtime",
    emoji: "🌙",
    title: "Wütend, noch nicht ins Bett",
    caption: "Schlafenszeit, Bär will weiterspielen",
    intro: [
      { narration: "Es ist Abend. Der kleine Bär spielt im Schlafanzug mit seiner Eisenbahn." },
      { narration: "Der große Bär hält ein Bilderbuch.", line: "Komm, Schlafenszeit!" },
      { narration: "Der kleine Bär schüttelt den Kopf. Er ist wütend." },
    ],
    steps: [
      {
        caption: "Fäuste drücken",
        question: "Der kleine Bär will weiterspielen. Was kann er tun?",
        beats: [
          { narration: "Der kleine Bär drückt die Fäuste ganz fest und sagt:", line: "Ich will noch spielen!" },
          { line: "Ich weiß. Eine Runde noch, dann ist Schlafenszeit." },
          { narration: "Er macht die Fäuste auf. Puh.", sound: "breath" },
        ],
        instead: {
          caption: "Eisenbahn werfen",
          answer: "Hmm, jetzt ist die Lok kaputt. Drück lieber die Fäuste und sag: Ich will noch spielen!",
          sound: "crash",
        },
      },
      {
        caption: "Zug in den Tunnel fahren",
        question: "Es ist Schlafenszeit für die Eisenbahn. Was kann der kleine Bär tun?",
        beats: [
          { narration: "Der kleine Bär fährt die Eisenbahn selbst in den Tunnel.", line: "Gute Nacht, Zug!", sound: "rumble" },
          { narration: "Tschu-tschu. Jetzt schläft sie." },
        ],
        instead: {
          caption: "Schienen kaputt treten",
          answer: "Hmm, jetzt sind die Schienen kaputt. Fahr lieber den Zug in den Tunnel: Gute Nacht, Zug!",
          sound: "crash",
        },
      },
      {
        caption: "Buch aussuchen",
        question: "Gleich wird vorgelesen. Was kann der kleine Bär tun?",
        beats: [
          { narration: "Der kleine Bär sucht sich selbst ein Buch aus dem Regal aus.", line: "Das hier! Mit dem Mond." },
          { line: "Oh, das ist schön. Komm, ich lese vor.", sound: "pop" },
        ],
        instead: { caption: "Buch zerreißen", answer: "Hmm, jetzt ist das Buch kaputt. Such dir lieber selbst ein Buch aus.", sound: "crash" },
      },
    ],
    outro: [{ narration: "Super! Fäuste drücken, dem Zug Gute Nacht sagen, ein Buch aussuchen. Jetzt wird vorgelesen.", sound: "cheer" }],
    endCaption: "Großer Bär liest vor, Bär kuschelt sich an",
  },
];
