import { GameShell } from "@/components/GameShell";
import { useLanguages } from "@/components/LanguageSetting";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { TouchKeysSetting } from "@/components/TouchKeyboard";
import { useGameSettings } from "@/lib/common";
import { useT } from "@/lib/language";
import { DEFAULT_WORDS_SETTINGS, WORDS_SETTINGS_KEY, type PictureReveal, type WordCase, type WordLength, type WordsMode, type WordsSettings } from "./settings";
import { WordsPlay } from "./WordsPlay";

export function WordsGame() {
  const [settings, update] = useGameSettings(WORDS_SETTINGS_KEY, DEFAULT_WORDS_SETTINGS);
  const languages = useLanguages();
  const pack = languages.language.pack;
  const t = useT();

  return (
    <GameShell
      title={t({ de: "Wörter tippen", ru: "Печатаем слова" })}
      emoji="✍️"
      modes={[
        { id: "spell", emoji: "✍️", title: t({ de: "Ganzes Wort", ru: "Целое слово" }) },
        { id: "first", emoji: "🐻", title: t({ de: "Erster Buchstabe", ru: "Первая буква" }) },
        { id: "colors", emoji: "🎨", title: t({ de: "Farben", ru: "Цвета" }) },
        { id: "actions", emoji: "🦘", title: t({ de: "Tu-Wörter", ru: "Слова-действия" }) },
      ]}
      mode={settings.mode}
      onMode={(mode) => update({ mode: mode as WordsMode })}
      level={
        // Colours and doing words are short fixed lists, so the length only applies to the picture words.
        <Choice<WordLength>
          label={t({ de: "Wortlänge", ru: "Длина слова" })}
          value={settings.length}
          onChange={(length) => update({ length })}
          options={[
            { value: "short", label: t({ de: "Bär", ru: "Кот" }) },
            { value: "medium", label: t({ de: "Hund", ru: "Лиса" }) },
            { value: "long", label: t({ de: "Giraffe", ru: "Корова" }) },
          ]}
        />
      }
      info={
        <>
          <p>
            {t({
              de: "Ganzes Wort: Ein Bild erscheint mit seinem Wort, und das Kind tippt es Buchstabe für Buchstabe. Erster Buchstabe: nur den Anfang zum Bild.",
              ru: "Целое слово: появляется картинка со своим словом, и ребёнок печатает его буква за буквой. Первая буква: только начало слова к картинке.",
            })}
          </p>
          <p>
            {t({
              de: "Farben: Ein Farbwort wie „Rot“ tippen, und Dinge in dieser Farbe hüpfen herein. Tu-Wörter: „Hüpf“ oder „Tanz“ tippen, die Figur macht es vor, und das Kind macht mit.",
              ru: "Цвета: напечатать слово цвета, например «Красный», и вещи этого цвета запрыгивают на экран. Слова-действия: напечатать «Прыгай» или «Танцуй», фигурка показывает, а ребёнок повторяет.",
            })}
          </p>
        </>
      }
      settings={
        <>
          <SettingsGroup title={t({ de: "Wörter", ru: "Слова" })}>
            <Choice<WordsSettings["theme"]>
              label={t({ de: "Bilder", ru: "Картинки" })}
              value={settings.theme}
              onChange={(theme) => update({ theme })}
              options={[
                { value: "all", label: t({ de: "🌈 Alle", ru: "🌈 Все" }) },
                ...pack.themes.map((th) => ({ value: th.id, label: `${th.emoji} ${th.label}` })),
              ]}
            />
            <p className="setting-note">
              {t({
                de: "Wortlänge und Bilder gelten für „Ganzes Wort“ und „Erster Buchstabe“.",
                ru: "Длина слова и картинки – для «Целого слова» и «Первой буквы».",
              })}
            </p>
          </SettingsGroup>

          <SettingsGroup title={t({ de: "Anzeige", ru: "Что видно" })}>
            <Choice<WordCase>
              label={t({ de: "Schrift", ru: "Буквы" })}
              value={settings.letterCase}
              onChange={(letterCase) => update({ letterCase })}
              options={[
                { value: "upper", label: t({ de: "BÄR", ru: "КОТ" }) },
                { value: "word", label: t({ de: "Bär", ru: "Кот" }) },
                { value: "lower", label: t({ de: "bär", ru: "кот" }) },
              ]}
            />
            <Choice<PictureReveal>
              label={t({ de: "Bild", ru: "Картинка" })}
              value={settings.picture}
              onChange={(picture) => update({ picture })}
              options={[
                { value: "now", label: t({ de: "Gleich zeigen", ru: "Сразу" }) },
                { value: "puzzle", label: t({ de: "🧩 Baut sich auf", ru: "🧩 Собирается по кусочкам" }) },
                { value: "end", label: t({ de: "Erst am Ende", ru: "Только в конце" }) },
              ]}
            />
            <p className="setting-note">
              {t({
                de: "Beim ersten Buchstaben ist das Bild immer gleich da – es ist der einzige Hinweis.",
                ru: "В «Первой букве» картинка видна сразу – это единственная подсказка.",
              })}
            </p>
          </SettingsGroup>

          <SettingsGroup title={t({ de: "Verhalten", ru: "Игра" })}>
            <Toggle
              label={t({
                de: "Jede Taste schreibt den nächsten Buchstaben (für die Kleinsten)",
                ru: "Любая клавиша пишет следующую букву (для самых маленьких)",
              })}
              checked={settings.anyKey}
              onChange={(anyKey) => update({ anyKey })}
            />
          </SettingsGroup>

          <TouchKeysSetting value={settings.touchKeys} onChange={(touchKeys) => update({ touchKeys })} />
        </>
      }
    >
      <WordsPlay pack={pack} second={languages.second?.pack ?? null} settings={settings} />
    </GameShell>
  );
}
