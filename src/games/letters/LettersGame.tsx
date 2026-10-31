import { useEffect } from "react";
import { GameShell } from "@/components/GameShell";
import { PlayOptions } from "@/components/PlayOptions";
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
  upgradeLegacyMode,
} from "./settings";
import { FindPlay } from "./FindPlay";
import { LettersPlay } from "./LettersPlay";
import { WordsPlay } from "./WordsPlay";

export function LettersGame() {
  const [saved, update] = useGameSettings(LETTERS_SETTINGS_KEY, DEFAULT_LETTERS_SETTINGS);
  // Zählen and „Wo ist das B?“ saved as ways to play of their own become the options they are now, once.
  const legacy = upgradeLegacyMode(saved);
  useEffect(() => {
    if (legacy) update(legacy);
  }, []);
  const settings: LettersSettings = legacy ? { ...saved, ...legacy } : saved;
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
  const freeTitle = t({
    de: "Frei tippen",
    ru: "Печатать что хочешь",
    en: "Free typing",
    zh: "随便按",
    hi: "आज़ाद टाइपिंग",
    es: "Teclear libre",
    ar: "كتابة حرة",
  });
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
  // Free typing: the keys on every touch screen, Wörter tippen only on tablets.
  const anyTouch = settings.mode === "free";
  const touchKeys = useTouchKeys(settings.touchKeys, anyTouch);
  const pictureWords = settings.wordKind === "nouns" || settings.wordKind === "all";
  /** Wörter tippen with the first letter only: a letter and its picture, and the child finds its key („Wo ist das B?“). */
  const findLetter = settings.mode === "words" && settings.wordTyping === "first";

  const showWord = (
    <Toggle
      label={t({
        de: "Wort unter dem Bild anzeigen",
        ru: "Показывать слово под картинкой",
        en: "Show the word under the picture",
        zh: "在图片下显示词语",
        hi: "तस्वीर के नीचे शब्द दिखाएँ",
        es: "Mostrar la palabra bajo el dibujo",
        ar: "عرض الكلمة تحت الصورة",
      })}
      checked={settings.showWord}
      onChange={(showWord) => update({ showWord })}
    />
  );

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
        { id: "words", emoji: "✍️", title: wordsTitle },
      ]}
      mode={settings.mode}
      onMode={(mode) => update({ mode: mode as LettersMode })}
      // Nothing to choose first: the card on the home page plays the way played last at once, and every option is
      // changed while playing (⚙️ held in the top left corner). The start screen shows only after ✕ or „Menü“.
      startMode={settings.mode}
    >
      {findLetter ? (
        // A new kind of pictures brings a new letter at once.
        <FindPlay key={settings.theme} pack={pack} settings={play} />
      ) : settings.mode === "words" ? (
        // New words to type bring a new word at once.
        <WordsPlay key={`${settings.wordKind}-${settings.wordLength}-${settings.theme}`} pack={pack} settings={play} />
      ) : (
        <LettersPlay pack={pack} settings={play} />
      )}
      <PlayOptions>
        <Choice<LettersMode>
          label={t({ de: "Spielart", en: "Way to play", zh: "玩法", hi: "खेलने का तरीका", es: "Modo de juego", ar: "طريقة اللعب", ru: "Как играем" })}
          value={settings.mode}
          onChange={(mode) => update({ mode })}
          options={[
            { value: "free", label: `⌨️ ${freeTitle}` },
            { value: "words", label: `✍️ ${wordsTitle}` },
          ]}
        />

        {settings.mode === "free" ? (
          <SettingsGroup title={`⌨️ ${freeTitle}`}>
            <Toggle
              label={t({
                de: "🔢 Nur Zahlen",
                en: "🔢 Only numbers",
                zh: "🔢 只有数字",
                hi: "🔢 सिर्फ़ अंक",
                es: "🔢 Solo números",
                ar: "🔢 أرقام فقط",
                ru: "🔢 Только цифры",
              })}
              checked={settings.numbersOnly}
              onChange={(numbersOnly) => update({ numbersOnly })}
            />
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
            {/* Step by step and by tapping, the digit waits for more presses anyway. */}
            {(settings.numbers === "all" || settings.numbers === "count") && (
              <Toggle
                label={t({
                  de: "Ziffer erst zeigen, wenn dieselbe Zahl gleich nochmal gedrückt wird",
                  en: "Show the digit only when the same number is pressed again right after",
                  zh: "马上再按一次同一个数字时才显示数字",
                  hi: "अंक तभी दिखाएँ, जब वही अंक तुरंत दोबारा दबाया जाए",
                  es: "Mostrar la cifra solo cuando se pulse enseguida otra vez el mismo número",
                  ar: "إظهار الرقم فقط عند الضغط على الرقم نفسه مرة أخرى فورًا",
                  ru: "Показывать цифру, только когда то же число сразу нажимают ещё раз",
                })}
                checked={settings.digitOnRepeat}
                onChange={(digitOnRepeat) => update({ digitOnRepeat })}
              />
            )}
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
            {!settings.numbersOnly && showWord}
            {!settings.numbersOnly && play.letterCase === "both" && !settings.trace && (
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
            {!settings.numbersOnly && settings.speech && (
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
        ) : (
          <SettingsGroup title={`✍️ ${wordsTitle}`}>
            <Choice<WordTyping>
              label={t({
                de: "Was tippen?",
                en: "What to type?",
                zh: "打什么？",
                hi: "क्या टाइप करें?",
                es: "¿Qué escribir?",
                ar: "ماذا نكتب؟",
                ru: "Что печатаем?",
              })}
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
            {findLetter ? (
              <>
                {showWord}
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
              </>
            ) : (
              <>
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
                    {
                      value: "colors",
                      label: t({ de: "🎨 Farben", ru: "🎨 Цвета", en: "🎨 Colors", zh: "🎨 颜色", hi: "🎨 रंग", es: "🎨 Colores", ar: "🎨 ألوان" }),
                    },
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
              </>
            )}
          </SettingsGroup>
        )}

        <SettingsGroup title={t({ de: "Anzeige", ru: "Что видно", en: "Display", zh: "显示", hi: "दिखावट", es: "Pantalla", ar: "العرض" })}>
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
          <Choice<LettersSettings["theme"]>
            label={t({ de: "Bilder", ru: "Картинки", en: "Pictures", zh: "图片", hi: "तस्वीरें", es: "Dibujos", ar: "الصور" })}
            value={settings.theme}
            onChange={(theme) => update({ theme })}
            options={[{ value: "all", label: all }, ...pack.themes.map((th) => ({ value: th.id, label: `${th.emoji} ${th.label}` }))]}
          />
        </SettingsGroup>

        <TouchKeysSetting value={settings.touchKeys} onChange={(touchKeys) => update({ touchKeys })} anyTouch={anyTouch} />
      </PlayOptions>
    </GameShell>
  );
}
