import type { Localized } from "@/lib/language";

// What the lion, the mouse and the blowing pictures say and show, German and the other
// app languages side by side (the app language picks one). Translations come only on request,
// so a text may lack one: it is then said in German with the German voice (spokenIn).
// Talking to the child: Arabic says "let's" (هيّا ن…) and Hindi gives commands (तुम),
// because Arabic commands would differ for a boy and a girl.

/** Who reacts: the lion to a loud voice, the mouse to a quiet one. */
export type Who = "lion" | "mouse";

/** What an animal says after its sound (with speech on), one picked at random. */
export const SAYS: Record<Who, Localized<string[]>> = {
  lion: {
    de: ["Roaaar! Ich bin der Löwe!", "So laut! Roaaar!", "Roaaar! Noch mal!"],
    en: ["Roaaar! I'm the lion!", "So loud! Roaaar!", "Roaaar! Again!"],
    zh: ["嗷呜！我是狮子！", "好大声！嗷呜！", "嗷呜！再来一次！"],
    hi: ["गर्र्र! मैं शेर हूँ!", "कितनी ज़ोर से! गर्र्र!", "गर्र्र! फिर से!"],
    es: ["¡Grrraaau! ¡Soy el león!", "¡Qué fuerte! ¡Grrraaau!", "¡Grrraaau! ¡Otra vez!"],
    ar: ["غرررر! أنا الأسد!", "بصوت عالٍ جدًّا! غرررر!", "غرررر! مرة أخرى!"],
    ru: ["Р-р-р! Я лев!", "Как громко! Р-р-р!", "Р-р-р! Ещё раз!"],
  },
  mouse: {
    de: ["Piep! Ich bin die kleine Maus.", "Pssst. Piep, piep.", "Piep! Ganz leise."],
    en: ["Squeak! I'm the little mouse.", "Shhh. Squeak, squeak.", "Squeak! Very quiet."],
    zh: ["吱！我是小老鼠。", "嘘——吱吱。", "吱！轻轻的。"],
    hi: ["चूँ! मैं छोटा चूहा हूँ।", "श्श्श। चूँ, चूँ।", "चूँ! बिल्कुल धीरे।"],
    es: ["¡Iiih! Soy el ratoncito.", "Shhh. Iiih, iiih.", "¡Iiih! Muy bajito."],
    ar: ["زيق! أنا الفأر الصغير.", "هسسس. زيق، زيق.", "زيق! بهدوء شديد."],
    ru: ["Пи! Я маленькая мышка.", "Тс-с-с. Пи-пи.", "Пи! Тихо-тихо."],
  },
};

/** After a quiet while: what the animal asks for, with a microphone and without. */
export const NUDGES: Record<Who, { mic: Localized; tap: Localized }> = {
  lion: {
    mic: {
      de: "Ruf mal ganz laut: Hallo, Löwe!",
      en: "Shout really loud: Hello, lion!",
      zh: "大声喊：你好，狮子！",
      hi: "ज़ोर से बोलो: नमस्ते, शेर!",
      es: "¡Grita muy fuerte: hola, león!",
      ar: "هيّا ننادي بصوت عالٍ: مرحبًا يا أسد!",
      ru: "Крикни громко-громко: Привет, лев!",
    },
    tap: {
      de: "Tipp mal den Löwen an!",
      en: "Tap the lion!",
      zh: "点一点狮子！",
      hi: "शेर को छुओ!",
      es: "¡Toca el león!",
      ar: "هيّا نلمس الأسد!",
      ru: "Нажми на льва!",
    },
  },
  mouse: {
    mic: {
      de: "Und jetzt ganz leise flüstern: Hallo, Maus.",
      en: "And now whisper very softly: Hello, mouse.",
      zh: "现在轻轻地说：你好，小老鼠。",
      hi: "और अब बिल्कुल धीरे से फुसफुसाओ: नमस्ते, चूहे।",
      es: "Y ahora susurra muy bajito: hola, ratón.",
      ar: "والآن هيّا نهمس بهدوء: مرحبًا يا فأر.",
      ru: "А теперь тихо-тихо шепни: Привет, мышка.",
    },
    tap: {
      de: "Tipp mal die kleine Maus an!",
      en: "Tap the little mouse!",
      zh: "点一点小老鼠！",
      hi: "छोटे चूहे को छुओ!",
      es: "¡Toca el ratoncito!",
      ar: "هيّا نلمس الفأر الصغير!",
      ru: "Нажми на маленькую мышку!",
    },
  },
};

/** The words in the bubbles and under the animals, read by nobody but seen by everyone. */
export const VOICE_WORDS = {
  roar: { de: "ROAAAR!", en: "ROAAAR!", zh: "嗷呜！", hi: "गर्र्र!", es: "¡GRRR!", ar: "غرررر!", ru: "Р-Р-Р!" },
  squeak: { de: "piep!", en: "squeak!", zh: "吱！", hi: "चूँ!", es: "¡iiih!", ar: "زيق!", ru: "пи!" },
  quiet: { de: "🤫 leise", en: "🤫 quiet", zh: "🤫 小声", hi: "🤫 धीरे", es: "🤫 bajito", ar: "🤫 بهدوء", ru: "🤫 тихо" },
  loud: { de: "📣 laut", en: "📣 loud", zh: "📣 大声", hi: "📣 ज़ोर से", es: "📣 fuerte", ar: "📣 بصوت عالٍ", ru: "📣 громко" },
  scene: { de: "Löwe und Maus", en: "Lion and Mouse", zh: "狮子和老鼠", hi: "शेर और चूहा", es: "El león y el ratón", ar: "الأسد والفأر", ru: "Лев и мышка" },
} satisfies Record<string, Localized>;

/** The blowing pictures, in the order they are played. */
export type StationId = "candles" | "dandelion" | "pinwheel" | "boat";

/** What each blowing picture is called (for screen readers), how it invites blowing, and the cheer when it is all blown. */
export const STATION_TEXTS: Record<StationId, { label: Localized; intro: { mic: Localized; tap: Localized }; cheer: Localized }> = {
  candles: {
    label: {
      de: "Kuchen mit Kerzen",
      en: "Cake with candles",
      zh: "插着蜡烛的蛋糕",
      hi: "मोमबत्तियों वाला केक",
      es: "Pastel con velas",
      ar: "كعكة بالشموع",
      ru: "Торт со свечками",
    },
    intro: {
      mic: {
        de: "Puste die Kerzen aus! Ganz fest pusten!",
        en: "Blow out the candles! Blow really hard!",
        zh: "把蜡烛吹灭！使劲吹！",
        hi: "मोमबत्तियाँ बुझाओ! ज़ोर से फूँको!",
        es: "¡Sopla las velas! ¡Sopla muy fuerte!",
        ar: "هيّا نطفئ الشموع! ننفخ بقوة!",
        ru: "Задуй свечки! Дуй сильно-сильно!",
      },
      tap: {
        de: "Tipp, dann pustest du die Kerzen aus!",
        en: "Tap, and the candles go out!",
        zh: "点一下，蜡烛就灭了！",
        hi: "छुओ, और मोमबत्तियाँ बुझ जाएँगी!",
        es: "¡Toca y las velas se apagan!",
        ar: "لمسة، فتنطفئ الشموع!",
        ru: "Нажми — и свечки погаснут!",
      },
    },
    cheer: {
      de: "Alle Kerzen sind aus! Hurra!",
      en: "All the candles are out! Hooray!",
      zh: "蜡烛全灭了！好耶！",
      hi: "सारी मोमबत्तियाँ बुझ गईं! हुर्रे!",
      es: "¡Todas las velas apagadas! ¡Hurra!",
      ar: "انطفأت كل الشموع! مرحى!",
      ru: "Все свечки погасли! Ура!",
    },
  },
  dandelion: {
    label: { de: "Pusteblume", en: "Dandelion", zh: "蒲公英", hi: "सिंहपर्णी का फूल", es: "Diente de león", ar: "زهرة الهندباء", ru: "Одуванчик" },
    intro: {
      mic: {
        de: "Puste die Pusteblume an!",
        en: "Blow on the dandelion!",
        zh: "吹一吹蒲公英！",
        hi: "फूल पर फूँको!",
        es: "¡Sopla el diente de león!",
        ar: "هيّا ننفخ على الزهرة!",
        ru: "Подуй на одуванчик!",
      },
      tap: {
        de: "Tipp, dann fliegen die Schirmchen!",
        en: "Tap, and the fluff flies away!",
        zh: "点一下，小伞就飞走啦！",
        hi: "छुओ, और रुएँ उड़ जाएँगे!",
        es: "¡Toca y vuelan las semillitas!",
        ar: "لمسة، فتطير المظلات الصغيرة!",
        ru: "Нажми — и пушинки полетят!",
      },
    },
    cheer: {
      de: "Alle Schirmchen fliegen weg!",
      en: "All the fluff flies away!",
      zh: "小伞全都飞走啦！",
      hi: "सारे रुएँ उड़ गए!",
      es: "¡Todas las semillitas se van volando!",
      ar: "كل المظلات الصغيرة تطير!",
      ru: "Все пушинки улетают!",
    },
  },
  pinwheel: {
    label: { de: "Windrad", en: "Pinwheel", zh: "风车", hi: "फिरकी", es: "Molinillo", ar: "مروحة ورقية", ru: "Вертушка" },
    intro: {
      mic: {
        de: "Puste, dann dreht sich das Windrad!",
        en: "Blow, and the pinwheel spins!",
        zh: "吹一吹，风车就转起来！",
        hi: "फूँको, और फिरकी घूमेगी!",
        es: "¡Sopla y el molinillo gira!",
        ar: "هيّا ننفخ، فتدور المروحة!",
        ru: "Подуй — и вертушка закрутится!",
      },
      tap: {
        de: "Tipp, dann dreht sich das Windrad!",
        en: "Tap, and the pinwheel spins!",
        zh: "点一下，风车就转起来！",
        hi: "छुओ, और फिरकी घूमेगी!",
        es: "¡Toca y el molinillo gira!",
        ar: "لمسة، فتدور المروحة!",
        ru: "Нажми — и вертушка закрутится!",
      },
    },
    cheer: { de: "Ein Regenbogen!", en: "A rainbow!", zh: "一道彩虹！", hi: "इंद्रधनुष!", es: "¡Un arcoíris!", ar: "قوس قزح!", ru: "Радуга!" },
  },
  boat: {
    label: { de: "Segelboot", en: "Sailboat", zh: "帆船", hi: "पाल वाली नाव", es: "Velero", ar: "مركب شراعي", ru: "Парусник" },
    intro: {
      mic: {
        de: "Puste ins Segel! Die Maus will zum Löwen.",
        en: "Blow into the sail! The mouse wants to go to the lion.",
        zh: "对着帆吹！小老鼠想去找狮子。",
        hi: "पाल में फूँको! चूहा शेर के पास जाना चाहता है।",
        es: "¡Sopla en la vela! El ratón quiere ir con el león.",
        ar: "هيّا ننفخ في الشراع! الفأر يريد أن يذهب إلى الأسد.",
        ru: "Подуй на парус! Мышка плывёт ко льву.",
      },
      tap: {
        de: "Tipp, dann segelt die Maus zum Löwen!",
        en: "Tap, and the mouse sails to the lion!",
        zh: "点一下，小老鼠就开船去找狮子！",
        hi: "छुओ, और चूहा नाव से शेर के पास जाएगा!",
        es: "¡Toca y el ratón navega hasta el león!",
        ar: "لمسة، فيبحر الفأر إلى الأسد!",
        ru: "Нажми — и мышка поплывёт ко льву!",
      },
    },
    cheer: {
      de: "Angekommen! Hallo, Löwe!",
      en: "Made it! Hello, lion!",
      zh: "到啦！你好，狮子！",
      hi: "पहुँच गए! नमस्ते, शेर!",
      es: "¡Llegamos! ¡Hola, león!",
      ar: "وصلنا! مرحبًا يا أسد!",
      ru: "Приплыли! Привет, лев!",
    },
  },
};

/** The two levels: their name (on the „Weiter“ button) and what to tap when there is no microphone. */
export const LEVEL_TEXTS = {
  voice: {
    name: { de: "Löwe und Maus", en: "Lion and Mouse", zh: "狮子和老鼠", hi: "शेर और चूहा", es: "El león y el ratón", ar: "الأسد والفأر", ru: "Лев и мышка" },
    tapHint: {
      de: "Löwe und Maus antippen",
      en: "tap the lion and the mouse",
      zh: "点狮子和老鼠",
      hi: "शेर और चूहे पर टैप करें",
      es: "toque el león y el ratón",
      ar: "المسوا الأسد والفأر",
      ru: "нажимайте на льва и мышку",
    },
  },
  blow: {
    name: { de: "Pusten", en: "Blowing", zh: "吹一吹", hi: "फूँकना", es: "Soplar", ar: "النفخ", ru: "Дуем" },
    tapHint: {
      de: "antippen, das pustet auch",
      en: "tap the picture, that blows too",
      zh: "点图片，也能吹",
      hi: "तस्वीर पर टैप करें, उससे भी फूँक लगती है",
      es: "toque la imagen, eso también sopla",
      ar: "المسوا الصورة، فهذا ينفخ أيضًا",
      ru: "нажимайте на картинку, это тоже дует",
    },
  },
} satisfies Record<string, { name: Localized; tapHint: Localized }>;
