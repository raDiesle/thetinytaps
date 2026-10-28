import type { SceneTranslation } from "../types";

// The Arabic words of the Ostern picture (Modern Standard Arabic, simple, no vowel marks): names with the
// article ال and their gender, what each item says and the chain sentences.

/** „Ostern“ in Arabic. */
export const AR: SceneTranslation = {
  title: "عيد الفصح",
  description: "أرنب الفصح والكتاكيت والبيض المخبأ.",
  items: {
    sonne: { name: "الشمس", gender: "f", sentences: ["الشمس تشرق!", "الشمس تبتسم."] },
    wolke: { name: "الغيمة", gender: "f", sentences: ["الغيمة تمطر. طق، طق!", "الغيمة بيضاء وناعمة."] },
    gartentor: { name: "بوابة الحديقة", gender: "f", sentences: ["زيق! بوابة الحديقة تفتح.", "من يأتي إلى الحديقة؟", "على البوابة إكليل الفصح."] },
    mutterschaf: { name: "النعجة", gender: "f", sentences: ["ماااء! النعجة تنادي حملها الصغير.", "للنعجة صوف ناعم."] },
    laemmchen: { name: "الحمل الصغير", gender: "m", sentences: ["الحمل الصغير يقفز من الفرح!", "تن، تن، يقول الجرس الصغير.", "الحمل ما زال صغيرا."] },
    nistkasten: { name: "بيت العصافير", gender: "m", sentences: ["من يعيش في بيت العصافير؟ القرقف!", "تسي، تسي! القرقف يغني."] },
    kirschbaum: {
      name: "شجرة الكرز",
      gender: "f",
      sentences: ["شجرة الكرز تزهر بالوردي.", "واو! الأزهار تطير في الهواء.", "في الربيع تزهر الأشجار."],
    },
    amselnest: { name: "عش العصافير", gender: "m", sentences: ["صوصو! الفراخ الصغيرة جائعة.", "أم الشحرور تحضر دودة."] },
    gartenhaus: { name: "بيت الحديقة", gender: "m", sentences: ["باب بيت الحديقة يفتح.", "من في الداخل؟", "في بيت الحديقة تسكن أدوات الحديقة."] },
    osterstrauch: { name: "شجرة الفصح", gender: "f", sentences: ["على شجرة الفصح بيض ملون.", "البيض يتأرجح هنا وهناك.", "كم بيضة هنا؟"] },
    schubkarre: { name: "عربة اليد", gender: "f", sentences: ["في عربة اليد أزهار.", "عربة اليد تنطلق!"] },
    vogelbad: { name: "حوض العصافير", gender: "m", sentences: ["العصفور يستحم. طش، طش!", "في حوض العصافير ماء للطيور."] },
    henne: { name: "الدجاجة", gender: "f", sentences: ["كاك، كاك! الدجاجة باضت بيضة.", "الدجاجة تجلس في العش."] },
    maltisch: { name: "طاولة التلوين", gender: "f", sentences: ["هنا نلون البيض.", "أحمر وأصفر وأزرق. البيضة تصبح ملونة!"] },
    schokohase: {
      name: "أرنب الشوكولاتة",
      gender: "m",
      sentences: ["أرنب الشوكولاتة يلمع مثل الذهب.", "تن! لأرنب الشوكولاتة جرس صغير.", "ممم، شوكولاتة!"],
    },
    forsythie: { name: "الشجيرة الصفراء", gender: "f", sentences: ["الشجيرة تزهر بالأصفر.", "خش، خش، تقول الشجيرة."] },
    gruenesei: { name: "البيضة الخضراء", gender: "f", sentences: ["هنا، تحت الشجيرة! بيضة خضراء!", "البيضة الخضراء تتدحرج."] },
    hohlerbaum: {
      name: "الشجرة القديمة",
      gender: "f",
      sentences: ["طق، طق! نقار الخشب يطرق على الشجرة.", "في الشجرة حفرة. من يطل منها؟", "على الأغصان براعم ناعمة."],
    },
    gelbesei: { name: "البيضة الصفراء", gender: "f", sentences: ["مخبأة في الشجرة: بيضة صفراء!", "البيضة الصفراء تهتز."] },
    eikueken: { name: "الكتكوت", gender: "m", sentences: ["طق! الكتكوت يخرج من البيضة.", "صوصو! مرحبا أيها الكتكوت الصغير!"] },
    blauesei: { name: "البيضة الزرقاء", gender: "f", sentences: ["خلف أصيص الزهور! بيضة زرقاء!", "للبيضة الزرقاء نقاط بيضاء."] },
    blumentopf: { name: "أصيص الزهور", gender: "m", sentences: ["في أصيص الزهور تزهر زهرة الربيع.", "أصيص الزهور يهتز."] },
    tulpen: { name: "زهور التوليب", gender: "f", plural: true, sentences: ["زهور التوليب تتفتح.", "توليب أحمر وأصفر وبنفسجي!"] },
    hummel: { name: "النحلة الطنانة", gender: "f", sentences: ["ززز! النحلة الطنانة تطير إلى الأزهار.", "النحلة الطنانة سمينة وناعمة."] },
    bollerwagen: { name: "العربة", gender: "f", sentences: ["العربة تتدحرج.", "في العربة بيض وأزهار."] },
    osterglocken: {
      name: "أزهار النرجس",
      gender: "f",
      plural: true,
      sentences: ["دينغ، دونغ! أزهار النرجس ترن مثل الأجراس.", "أزهار النرجس صفراء."],
    },
    zitronenfalter: { name: "الفراشة", gender: "f", sentences: ["الفراشة الصفراء ترفرف.", "هذه الفراشة اسمها فراشة الليمون."] },
    regenwurm: { name: "دودة الأرض", gender: "f", sentences: ["مرحبا يا دودة الأرض!", "دودة الأرض تعيش في التراب."] },
    osterhase: {
      name: "أرنب الفصح",
      gender: "m",
      sentences: ["مرحبا! أنا أرنب الفصح.", "هوب، هوب! أرنب الفصح يحضر البيض.", "فصح سعيد!"],
    },
    gartenzwerg: { name: "قزم الحديقة", gender: "m", sentences: ["قزم الحديقة متعب. آآآه!", "لقزم الحديقة قبعة حمراء."] },
    haeschen: { name: "الأرنب الصغير", gender: "m", sentences: ["هم، هم! الأرنب الصغير يأكل جزرة.", "الأرنب الصغير يحرك أنفه."] },
    korbkind: { name: "البنت", gender: "f", sentences: ["يا هوو! وجدت بيضة!", "البنت تبحث عن بيض الفصح."] },
    eierlauf: { name: "الولد", gender: "m", sentences: ["سباق البيض! البيضة تهتز على الملعقة.", "أوه! البيضة كادت تسقط."] },
    osternest: { name: "عش الفصح", gender: "m", sentences: ["عش الفصح مليء بالبيض!", "في عش الفصح بيضة شوكولاتة أيضا."] },
    giesskanne: { name: "المرشة", gender: "f", sentences: ["المرشة تسقي الأزهار.", "طش، طش! ماء للتوليب."] },
    osterei: { name: "البيضة الحمراء", gender: "f", sentences: ["هنا بيضة حمراء في العشب!", "من يطل من خلف البيضة؟"] },
    glueckskaefer: { name: "الدعسوقة", gender: "f", sentences: ["الدعسوقة تطير!", "الدعسوقة حمراء بنقاط سوداء."] },
    pusteblume: { name: "زهرة الهندباء", gender: "f", sentences: ["هيّا ننفخ! البذور تطير.", "ووووو! مثل مظلات صغيرة."] },
  },
  chains: [
    ["التوليب يشرب ويتفتح.", "مبلل! دودة الأرض تطل."],
    ["طق! الكتكوت يخرج من البيضة.", "أرنب الفصح يفرح ويقفز."],
    ["الحمل الصغير يسمع أمه ويقفز.", "والفراشة تطير."],
  ],
};
