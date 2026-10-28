import { GameShell } from "@/components/GameShell";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { TouchKeysSetting, useTouchKeys } from "@/components/TouchKeyboard";
import { hasCase, sampleLetter, useLanguagePack } from "@/content/languages";
import { useGameSettings } from "@/lib/common";
import { useT } from "@/lib/language";
import {
  DEFAULT_LETTERS_SETTINGS,
  LETTERS_SETTINGS_KEY,
  type Announce,
  type LetterCase,
  type LettersMode,
  type LettersSettings,
  type NumberReveal,
  type WordKind,
  type WordLength,
  type WordTyping,
} from "./settings";
import { FindPlay } from "./FindPlay";
import { LettersPlay } from "./LettersPlay";
import { WordsPlay } from "./WordsPlay";

export function LettersGame() {
  const [settings, update] = useGameSettings(LETTERS_SETTINGS_KEY, DEFAULT_LETTERS_SETTINGS);
  const pack = useLanguagePack();
  // Hindi and Arabic letters have one form only: no choice of big and small letters, the games show that one.
  const cased = hasCase(pack);
  const play: LettersSettings = cased ? settings : { ...settings, letterCase: "upper" };
  // Examples in the settings, in the app language: „Be, wie Bär“.
  const b = sampleLetter(pack);
  const word = b.words[0].word;
  const a = pack.letters[0];
  const t = useT();
  const quote = (text: string) => t({ de: `„${text}“`, ru: `«${text}»`, en: `“${text}”`, zh: `“${text}”`, hi: `“${text}”`, es: `«${text}»`, ar: `«${text}»` });
  const findTitle = t({
    de: `Wo ist das ${b.upper}?`,
    ru: `Где буква ${b.upper}?`,
    en: `Where is the ${b.upper}?`,
    zh: `${b.upper}在哪里？`,
    hi: `${b.upper} कहाँ है?`,
    es: `¿Dónde está la ${b.upper}?`,
    ar: `أين حرف ${b.upper}؟`,
  });
  const freeTitle = t({
    de: "Frei tippen",
    ru: "Печатать что хочешь",
    en: "Free typing",
    zh: "随便按",
    hi: "आज़ाद टाइपिंग",
    es: "Teclear libre",
    ar: "كتابة حرة",
  });
  const countTitle = t({ de: "Zählen", ru: "Считаем", en: "Counting", zh: "数一数", hi: "गिनती", es: "Contar", ar: "العدّ" });
  const wordsTitle = t({
    de: "Wörter tippen",
    ru: "Печатаем слова",
    en: "Typing words",
    zh: "拼词语",
    hi: "शब्द टाइपिंग",
    es: "Escribir palabras",
    ar: "كتابة كلمات",
  });
  const all = t({ de: "🌈 Alle", ru: "🌈 Все", en: "🌈 All", zh: "🌈 全部", hi: "🌈 सब", es: "🌈 Todas", ar: "🌈 الكل" });
  // Free typing and Zählen: the keys on every touch screen, the other modes only on tablets.
  const anyTouch = settings.mode === "free" || settings.mode === "count";
  const touchKeys = useTouchKeys(settings.touchKeys, anyTouch);
  const pictureWords = settings.wordKind === "nouns" || settings.wordKind === "all";

  return (
    <GameShell
      title={t({
        de: "Buchstaben & Zahlen",
        ru: "Буквы и цифры",
        en: "Letters & Numbers",
        zh: "字母和数字",
        hi: "अक्षर और अंक",
        es: "Letras y números",
        ar: "حروف وأرقام",
      })}
      emoji="🔤"
      modes={[
        { id: "free", emoji: "⌨️", title: freeTitle },
        { id: "count", emoji: "🔢", title: countTitle },
        { id: "find", emoji: "🔍", title: findTitle },
        { id: "words", emoji: "✍️", title: wordsTitle },
      ]}
      mode={settings.mode}
      onMode={(mode) => update({ mode: mode as LettersMode })}
      level={
        // Always in sight above the cards: the letters for every mode, then what „Wörter tippen“ plays.
        <div className="letters-level">
          {cased && (
            <Choice<LetterCase>
              label={t({ de: "Buchstaben", ru: "Буквы", en: "Letters", zh: "字母", hi: "अक्षर", es: "Letras", ar: "الحروف" })}
              value={settings.letterCase}
              onChange={(letterCase) => update({ letterCase })}
              options={[
                { value: "upper", label: a.upper },
                { value: "both", label: `${a.upper} ${a.lower}` },
                { value: "lower", label: a.lower },
              ]}
            />
          )}
          <Choice<WordTyping>
            label={`✍️ ${wordsTitle}`}
            value={settings.wordTyping}
            onChange={(wordTyping) => update({ wordTyping })}
            options={[
              {
                value: "spell",
                label: t({ de: "Ganzes Wort", ru: "Целое слово", en: "Whole word", zh: "整个词", hi: "पूरा शब्द", es: "Palabra entera", ar: "الكلمة كاملة" }),
              },
              {
                value: "first",
                label: t({
                  de: "Erster Buchstabe",
                  ru: "Первая буква",
                  en: "First letter",
                  zh: "第一个字母",
                  hi: "पहला अक्षर",
                  es: "Primera letra",
                  ar: "الحرف الأول",
                }),
              },
            ]}
          />
          <Choice<WordKind>
            label={t({ de: "Wörter", ru: "Слова", en: "Words", zh: "词语", hi: "शब्द", es: "Palabras", ar: "الكلمات" })}
            value={settings.wordKind}
            onChange={(wordKind) => update({ wordKind })}
            options={[
              {
                value: "nouns",
                label: t({ de: "🐻 Substantive", ru: "🐻 Предметы", en: "🐻 Things", zh: "🐻 事物", hi: "🐻 चीज़ें", es: "🐻 Cosas", ar: "🐻 أشياء" }),
              },
              { value: "all", label: all },
              { value: "colors", label: t({ de: "🎨 Farben", ru: "🎨 Цвета", en: "🎨 Colors", zh: "🎨 颜色", hi: "🎨 रंग", es: "🎨 Colores", ar: "🎨 ألوان" }) },
              {
                value: "actions",
                label: t({
                  de: "🦘 Tu-Wörter",
                  ru: "🦘 Слова-действия",
                  en: "🦘 Doing words",
                  zh: "🦘 动作词",
                  hi: "🦘 क्रिया-शब्द",
                  es: "🦘 Acciones",
                  ar: "🦘 حركات",
                }),
              },
            ]}
          />
          {/* Colours and doing words are short fixed lists, so the length only applies to the picture words. */}
          {pictureWords && (
            <Choice<WordLength>
              label={t({ de: "Wortlänge", ru: "Длина слова", en: "Word length", zh: "字母数", hi: "शब्द की लंबाई", es: "Longitud", ar: "طول الكلمة" })}
              value={settings.wordLength}
              onChange={(wordLength) => update({ wordLength })}
              options={[
                { value: "3", label: "3" },
                { value: "4", label: "4" },
                { value: "7", label: "7" },
              ]}
            />
          )}
        </div>
      }
      info={
        <>
          <p>
            {t({
              de: `Frei tippen: Jede Taste zeigt ihren Buchstaben groß mit einem Bild dazu, „${b.upper} wie ${word}“. Eine Zahl zeigt so viele Dinge – auf einmal, vorgezählt, Schritt für Schritt oder zum selbst Antippen.`,
              ru: `Свободный набор: каждая клавиша показывает свою букву крупно и картинку к ней, «${b.upper} как ${word}». Цифра показывает столько же вещей – сразу, с подсчётом вслух, по одной или чтобы нажимать самому.`,
              en: `Free typing: every key shows its letter big, with a picture, “${b.upper} is for ${word}”. A number shows that many things – all at once, counted aloud, step by step, or to tap and count.`,
              zh: `随便按：每个键都会显示大大的字母和一张图片，“${b.upper}——${word}”。数字会显示同样多的东西——一下子出现、跟着数、一步一步，或者自己点着数。`,
              hi: `आज़ाद टाइपिंग: हर बटन अपना अक्षर बड़ा दिखाता है, साथ में एक तस्वीर, “${b.upper} से ${word}”। कोई अंक उतनी ही चीज़ें दिखाता है – एक साथ, गिनकर, एक-एक करके या ख़ुद छूकर गिनने के लिए।`,
              es: `Teclear libre: cada tecla muestra su letra en grande con un dibujo, «${b.upper} de ${word}». Un número muestra tantas cosas: todas a la vez, contadas en voz alta, paso a paso o para tocarlas y contarlas.`,
              ar: `كتابة حرة: كل زر يعرض حرفه كبيرا مع صورة، «${b.upper}، ${word}». والرقم يعرض أشياء بعدده: كلها معا، أو مع العد بصوت عال، أو خطوة خطوة، أو ليلمسها الطفل ويعدها بنفسه.`,
            })}
          </p>
          <p>
            {t({
              de: "Zählen: Nur Zahlen kommen, jede mit so vielen Dingen. Eine Ziffer zeigt sich selbst, jede andere Taste bringt eine Zahl zufällig.",
              ru: "Считаем: появляются только цифры, каждая с таким же числом вещей. Цифра показывает саму себя, любая другая клавиша – случайную цифру.",
              en: "Counting: only numbers come, each with that many things. A digit shows itself, any other key brings a number by chance.",
              zh: "数一数：只出现数字，每个数字配上同样多的东西。按数字键就显示那个数字，按别的键会随机出现一个数字。",
              hi: "गिनती: सिर्फ़ अंक आते हैं, हर एक के साथ उतनी ही चीज़ें। अंक वाला बटन वही अंक दिखाता है, कोई और बटन कोई भी अंक ले आता है।",
              es: "Contar: solo salen números, cada uno con tantas cosas. Una cifra se muestra a sí misma; cualquier otra tecla trae un número al azar.",
              ar: "العدّ: تظهر الأرقام فقط، كل رقم مع أشياء بعدده. زر الرقم يعرض الرقم نفسه، وأي زر آخر يأتي برقم عشوائي.",
            })}
          </p>
          <p>
            {t({
              de: `Wo ist das ${b.upper}? Ein Buchstabe und sein Bild erscheinen, und das Kind sucht die Taste dafür.`,
              ru: `Где ${b.upper}? Появляются буква и её картинка, и ребёнок ищет нужную клавишу.`,
              en: `Where is the ${b.upper}? A letter and its picture appear, and the child looks for its key.`,
              zh: `${b.upper}在哪里？屏幕上出现一个字母和它的图片，孩子去找对应的键。`,
              hi: `${b.upper} कहाँ है? एक अक्षर और उसकी तस्वीर दिखती है, और बच्चा उसका बटन ढूँढता है।`,
              es: `¿Dónde está la ${b.upper}? Aparecen una letra y su dibujo, y hay que buscar su tecla.`,
              ar: `أين حرف ${b.upper}؟ يظهر حرف وصورته، ويبحث الطفل عن زره.`,
            })}
          </p>
          <p>
            {t({
              de: "Ganzes Wort: Ein Bild erscheint mit seinem Wort, und das Kind tippt es Buchstabe für Buchstabe. Erster Buchstabe: nur den Anfang zum Bild.",
              ru: "Целое слово: появляется картинка со своим словом, и ребёнок печатает его буква за буквой. Первая буква: только начало слова к картинке.",
              en: "Whole word: a picture appears with its word, and the child types it letter by letter. First letter: only the start of the picture's word.",
              zh: "整个词：出现一张图片和它的词语，孩子一个字母一个字母地打出它的拼音（不用打声调）。第一个字母：只打拼音的第一个字母。",
              hi: "पूरा शब्द: एक तस्वीर अपने शब्द के साथ आती है, और बच्चा उसे अक्षर-अक्षर टाइप करता है – मात्रा अपने अक्षर के साथ अपने आप आ जाती है। पहला अक्षर: सिर्फ़ शब्द की शुरुआत।",
              es: "Palabra entera: aparece un dibujo con su palabra, y se escribe letra a letra (los acentos no hacen falta). Primera letra: solo el comienzo de la palabra.",
              ar: "الكلمة كاملة: تظهر صورة مع كلمتها، ويكتبها الطفل حرفا حرفا. الحرف الأول: بداية الكلمة فقط.",
            })}
          </p>
          <p>
            {t({
              de: "Farben: Ein Farbwort wie „Rot“ tippen, und Dinge in dieser Farbe hüpfen herein. Tu-Wörter: „Hüpf“ oder „Tanz“ tippen, die Figur macht es vor, und das Kind macht mit.",
              ru: "Цвета: напечатать слово цвета, например «Красный», и вещи этого цвета запрыгивают на экран. Слова-действия: напечатать «Прыгай» или «Танцуй», фигурка показывает, а ребёнок повторяет.",
              en: "Colors: type a color word like “Red”, and things in that color hop in. Doing words: type “Hop” or “Dance”, the figure shows how, and the child joins in.",
              zh: "颜色：打出“红色”这样的颜色词，这种颜色的东西就会跳进来。动作词：打出“跳”或“跳舞”，小人先做一遍，孩子跟着做。",
              hi: "रंग: “लाल” जैसा कोई रंग टाइप करें, और उस रंग की चीज़ें उछलकर आती हैं। क्रिया-शब्द: “कूदो” या “नाचो” टाइप करें, आकृति करके दिखाती है, और बच्चा साथ में करता है।",
              es: "Colores: al escribir un color como «Rojo», entran saltando cosas de ese color. Acciones: al escribir «Salta» o «Baila», la figura lo hace y el peque lo imita.",
              ar: "الألوان: اكتبوا كلمة لون مثل «أحمر»، فتقفز أشياء بهذا اللون إلى الشاشة. الحركات: اكتبوا «قفز» أو «رقص»، فتؤدي الشخصية الحركة ويقلدها الطفل.",
            })}
          </p>
        </>
      }
      settings={
        <>
          <SettingsGroup title={t({ de: "Anzeige", ru: "Что видно", en: "Display", zh: "显示", hi: "दिखावट", es: "Pantalla", ar: "العرض" })}>
            <Choice<LettersSettings["theme"]>
              label={t({ de: "Bilder", ru: "Картинки", en: "Pictures", zh: "图片", hi: "तस्वीरें", es: "Dibujos", ar: "الصور" })}
              value={settings.theme}
              onChange={(theme) => update({ theme })}
              options={[{ value: "all", label: all }, ...pack.themes.map((th) => ({ value: th.id, label: `${th.emoji} ${th.label}` }))]}
            />
            <Toggle
              label={t({
                de: "Wort unter dem Bild anzeigen (nicht bei Wörter tippen)",
                ru: "Показывать слово под картинкой (кроме «Печатаем слова»)",
                en: "Show the word under the picture (not in Typing words)",
                zh: "在图片下显示词语（拼词语除外）",
                hi: "तस्वीर के नीचे शब्द दिखाएँ (शब्द टाइपिंग में नहीं)",
                es: "Mostrar la palabra bajo el dibujo (no en Escribir palabras)",
                ar: "عرض الكلمة تحت الصورة (إلا في كتابة كلمات)",
              })}
              checked={settings.showWord}
              onChange={(showWord) => update({ showWord })}
            />
          </SettingsGroup>

          <SettingsGroup title={`⌨️ ${freeTitle}`}>
            <Toggle
              label={t({
                de: "Nachspuren: Buchstabe aus Punkten, Finger oder Maus lässt Sterne erscheinen",
                ru: "Обводить: буква из точек, палец или мышка зажигает звёздочки",
                en: "Tracing: the letter in dots, a finger or the mouse makes stars appear",
                zh: "描一描：字母由点组成，手指或鼠标描过的地方出现星星",
                hi: "ट्रेस करना: बिंदुओं से बना अक्षर, उँगली या माउस से सितारे निकलते हैं",
                es: "Repasar: la letra de puntos, el dedo o el ratón hace salir estrellas",
                ar: "التتبع: حرف من نقاط، وتظهر نجوم حيث يمر الإصبع أو الفأرة",
              })}
              checked={settings.trace}
              onChange={(trace) => update({ trace })}
            />
            {play.letterCase === "both" && !settings.trace && (
              <Toggle
                label={t({
                  de: "Mama- und Baby-Buchstabe (mit Augen, an der Hand)",
                  ru: "Буква-мама и буква-малыш (с глазками, за ручку)",
                  en: "Mommy and baby letter (with eyes, holding hands)",
                  zh: "字母妈妈和字母宝宝（有眼睛，手拉手）",
                  hi: "माँ और बच्चा अक्षर (आँखों वाले, हाथ पकड़े)",
                  es: "Letra mamá y letra bebé (con ojos, de la mano)",
                  ar: "حرف الأم وحرف الصغير (بعيون، يدا بيد)",
                })}
                checked={settings.letterFamily}
                onChange={(letterFamily) => update({ letterFamily })}
              />
            )}
            {settings.speech && (
              <Choice<Announce>
                label={t({ de: "Ansage", ru: "Что звучит", en: "What is said", zh: "播报内容", hi: "क्या बोला जाए", es: "Qué se dice", ar: "ما يقال" })}
                value={settings.announce}
                onChange={(announce) => update({ announce })}
                options={[
                  { value: "letterAndWord", label: quote(pack.letterSentence(b, b.words[0]).replace(/[!！]$/, "")) },
                  { value: "word", label: quote(word) },
                  { value: "letter", label: quote(b.spoken) },
                ]}
              />
            )}
          </SettingsGroup>

          <SettingsGroup title={`⌨️ ${freeTitle} ${t({ de: "und", ru: "и", en: "and", zh: "和", hi: "और", es: "y", ar: "و" })} 🔢 ${countTitle}`}>
            <Choice<NumberReveal>
              label={t({ de: "Zahlen", ru: "Цифры", en: "Numbers", zh: "数字", hi: "अंक", es: "Números", ar: "الأرقام" })}
              value={settings.numbers}
              onChange={(numbers) => update({ numbers })}
              options={[
                {
                  value: "all",
                  label: t({
                    de: "🖼️ Alles sofort",
                    ru: "🖼️ Всё сразу",
                    en: "🖼️ All at once",
                    zh: "🖼️ 一下全出来",
                    hi: "🖼️ सब एक साथ",
                    es: "🖼️ Todo a la vez",
                    ar: "🖼️ كل شيء فورا",
                  }),
                },
                {
                  value: "count",
                  label: t({
                    de: "🗣️ Vorzählen",
                    ru: "🗣️ Считать вслух",
                    en: "🗣️ Counted aloud",
                    zh: "🗣️ 跟着数",
                    hi: "🗣️ गिनकर सुनाना",
                    es: "🗣️ Contar en voz alta",
                    ar: "🗣️ العد بصوت عال",
                  }),
                },
                {
                  value: "step",
                  label: t({
                    de: "👆 Schritt für Schritt",
                    ru: "👆 Шаг за шагом",
                    en: "👆 Step by step",
                    zh: "👆 一步一步",
                    hi: "👆 एक-एक करके",
                    es: "👆 Paso a paso",
                    ar: "👆 خطوة خطوة",
                  }),
                },
                {
                  value: "tap",
                  label: t({
                    de: "✋ Selbst zählen",
                    ru: "✋ Считать пальчиком",
                    en: "✋ Count by tapping",
                    zh: "✋ 自己点着数",
                    hi: "✋ ख़ुद गिनना",
                    es: "✋ Contar tocando",
                    ar: "✋ العد باللمس",
                  }),
                },
              ]}
            />
            {settings.numbers === "count" && (
              <Toggle
                label={t({
                  de: "Zählen nicht unterbrechen",
                  ru: "Не прерывать счёт",
                  en: "Don't interrupt counting",
                  zh: "数数时不打断",
                  hi: "गिनती बीच में न रुके",
                  es: "No interrumpir la cuenta",
                  ar: "عدم مقاطعة العد",
                })}
                checked={settings.finishCounting}
                onChange={(finishCounting) => update({ finishCounting })}
              />
            )}
          </SettingsGroup>

          <SettingsGroup title={`🔍 ${findTitle}`}>
            <Toggle
              label={
                touchKeys
                  ? t({
                      de: "Gesuchte Taste aufleuchten lassen, wenn es länger dauert",
                      ru: "Подсвечивать нужную клавишу, если поиск затянулся",
                      en: "Light up the wanted key when it takes a while",
                      zh: "找得久了，让要找的键亮起来",
                      hi: "देर लगे तो ढूँढा जा रहा बटन चमकाएँ",
                      es: "Iluminar la tecla buscada si tarda",
                      ar: "إضاءة الزر المطلوب إذا طال البحث",
                    })
                  : t({
                      de: "Taste auf einer kleinen Tastatur zeigen, wenn es länger dauert",
                      ru: "Показывать клавишу на маленькой клавиатуре, если поиск затянулся",
                      en: "Show the key on a small keyboard when it takes a while",
                      zh: "找得久了，在小键盘图上显示那个键",
                      hi: "देर लगे तो छोटे कीबोर्ड पर बटन दिखाएँ",
                      es: "Mostrar la tecla en un teclado pequeño si tarda",
                      ar: "إظهار الزر على لوحة مفاتيح صغيرة إذا طال البحث",
                    })
              }
              checked={settings.hints}
              onChange={(hints) => update({ hints })}
            />
          </SettingsGroup>

          <TouchKeysSetting value={settings.touchKeys} onChange={(touchKeys) => update({ touchKeys })} anyTouch={anyTouch} />
        </>
      }
    >
      {settings.mode === "find" ? (
        <FindPlay pack={pack} settings={play} />
      ) : settings.mode === "words" ? (
        <WordsPlay pack={pack} settings={play} />
      ) : (
        // Also for a mode saved before it was taken away (the Buchstaben-Zug).
        <LettersPlay pack={pack} settings={play} numbersOnly={settings.mode === "count"} />
      )}
    </GameShell>
  );
}
