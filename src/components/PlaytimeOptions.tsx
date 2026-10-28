import { Choice, SettingsGroup, Slider } from "@/components/SettingControls";
import type { TargetLanguageId } from "@/content/targetLanguages";
import { type Localized, useAppLanguage, useT } from "@/lib/language";
import {
  EXTRA_MINUTES,
  GAMES_RANGE,
  MINUTES_RANGE,
  morePlaytime,
  type PlaytimeLimit,
  resetPlaytime,
  usePlaytimeSettings,
  usePlaytimeState,
} from "@/lib/playtime";

/** A count with its word in one language, by the language's plural rule (Intl.PluralRules); "#" stands for the number. */
type PluralForms = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };

/** Minutes in each language: 5 Min., 5 мин., Arabic دقيقة واحدة / دقيقتان / 3 دقائق / 11 دقيقة. */
const MINUTES: Localized<PluralForms> = {
  de: { other: "# Min." },
  ru: { other: "# мин." },
  en: { other: "# min" },
  zh: { other: "# 分钟" },
  hi: { other: "# मिनट" },
  es: { other: "# min" },
  ar: { one: "دقيقة واحدة", two: "دقيقتان", few: "# دقائق", other: "# دقيقة" },
};

/** Games in each language: 1 Spiel / 2 Spiele, 1 игра / 2 игры / 5 игр, لعبة واحدة / لعبتان / 3 ألعاب / 11 لعبة. */
const GAMES: Localized<PluralForms> = {
  de: { one: "# Spiel", other: "# Spiele" },
  ru: { one: "# игра", few: "# игры", other: "# игр" },
  en: { one: "# game", other: "# games" },
  zh: { other: "# 局" },
  hi: { other: "# खेल" },
  es: { one: "# juego", other: "# juegos" },
  ar: { one: "لعبة واحدة", two: "لعبتان", few: "# ألعاب", other: "# لعبة" },
};

/** `n` with its word in `id`, or in German where the language has none (its plural rule then is German's too). */
function counted(n: number, forms: Localized<PluralForms>, id: TargetLanguageId) {
  const lang = forms[id] ? id : "de";
  const own = forms[lang] ?? forms.de;
  return (own[new Intl.PluralRules(lang).select(n)] ?? own.other).replace("#", String(n));
}

/**
 * The play time for all games, for the grown-up: no limit, minutes or a number of
 * games per day, each set with a slider; what was played today, and when it is
 * over a little more or a fresh start. On the home page and on the lock over the menus.
 */
export function PlaytimeOptions() {
  const t = useT();
  const [settings, update] = usePlaytimeSettings();
  const { played, over } = usePlaytimeState();
  const playedMinutes = Math.floor(played.ms / 60_000);
  const { id } = useAppLanguage();
  const minutes = (n: number) => counted(n, MINUTES, id);
  const games = (n: number) => counted(n, GAMES, id);

  return (
    <section className="settings">
      <SettingsGroup
        title={t({
          de: "Spielzeit für alle Spiele",
          ru: "Время игры для всех игр",
          en: "Play time for all games",
          zh: "所有游戏的游戏时间",
          hi: "सभी खेलों के लिए खेलने का समय",
          es: "Tiempo de juego para todos los juegos",
          ar: "وقت اللعب لكل الألعاب",
        })}
      >
        <Choice<PlaytimeLimit>
          label={t({
            de: "Grenze pro Tag",
            ru: "Ограничение в день",
            en: "Limit per day",
            zh: "每天的限制",
            hi: "रोज़ की सीमा",
            es: "Límite por día",
            ar: "الحد اليومي",
          })}
          value={settings.by}
          onChange={(by) => update({ by })}
          options={[
            {
              value: "none",
              label: t({ de: "∞ Ohne", ru: "∞ Без ограничения", en: "∞ None", zh: "∞ 不限制", hi: "∞ कोई सीमा नहीं", es: "∞ Sin límite", ar: "∞ بلا حد" }),
            },
            { value: "time", label: t({ de: "⏱️ Minuten", ru: "⏱️ Минуты", en: "⏱️ Minutes", zh: "⏱️ 分钟", hi: "⏱️ मिनट", es: "⏱️ Minutos", ar: "⏱️ دقائق" }) },
            { value: "games", label: t({ de: "🎲 Spiele", ru: "🎲 Игры", en: "🎲 Games", zh: "🎲 局数", hi: "🎲 खेल", es: "🎲 Juegos", ar: "🎲 ألعاب" }) },
          ]}
        />
        {settings.by === "time" && (
          <Slider
            label={t({
              de: "Minuten pro Tag",
              ru: "Минут в день",
              en: "Minutes per day",
              zh: "每天分钟数",
              hi: "रोज़ के मिनट",
              es: "Minutos por día",
              ar: "دقائق في اليوم",
            })}
            value={settings.minutes}
            {...MINUTES_RANGE}
            format={minutes}
            onChange={(m) => update({ minutes: m })}
          />
        )}
        {settings.by === "games" && (
          <>
            <Slider
              label={t({
                de: "Spiele pro Tag",
                ru: "Игр в день",
                en: "Games per day",
                zh: "每天局数",
                hi: "रोज़ के खेल",
                es: "Juegos por día",
                ar: "ألعاب في اليوم",
              })}
              value={settings.games}
              {...GAMES_RANGE}
              format={games}
              onChange={(g) => update({ games: g })}
            />
            <p className="setting-note">
              {t({
                de: "Jedes gestartete Spiel zählt, auch „Nochmal“ und „Weiter“ am Ende. Das letzte läuft bis zu seinem Ende. Spiele ohne Ende (z. B. Tiere, Buchstaben) laufen, bis ihr sie beendet – dafür passt die Grenze in Minuten besser.",
                ru: "Считается каждая начатая игра, и «Ещё раз» и «Дальше» в конце тоже. Последняя идёт до своего конца. Игры без конца (например, «Что нужно зверюшке?», «Буквы и цифры») идут, пока вы их не закончите, – для них лучше подходит ограничение в минутах.",
                en: "Every game started counts, “Again” and “Next” at the end too. The last one runs to its end. Games without an end (e.g. “What Does the Animal Need?”, “Letters & Numbers”) run until you end them – for those, a limit in minutes fits better.",
                zh: "每开始一局都算一次，结束时的“再来一次”和“下一个”也算。最后一局会玩到结束。没有结尾的游戏（例如“小动物要什么？”“字母和数字”）会一直玩到您结束为止——这类游戏更适合按分钟限制。",
                hi: "हर शुरू किया गया खेल गिना जाता है, आख़िर में “फिर से” और “आगे” भी। आख़िरी खेल अपने अंत तक चलता है। बिना अंत वाले खेल (जैसे “जानवर को क्या चाहिए?”, “अक्षर और अंक”) तब तक चलते हैं जब तक आप उन्हें बंद न करें – उनके लिए मिनटों की सीमा बेहतर है।",
                es: "Cuenta cada juego que se empieza, también «Otra vez» y «Siguiente» al final. El último sigue hasta su final. Los juegos sin final (p. ej., «¿Qué necesita el animal?», «Letras y números») siguen hasta que usted los termine; para ellos va mejor el límite en minutos.",
                ar: "تُحتسب كل لعبة تبدأ، وكذلك «مرة أخرى» و«التالي» في النهاية. تستمر اللعبة الأخيرة حتى نهايتها. أما الألعاب التي ليس لها نهاية (مثل «ماذا يحتاج الحيوان؟» و«الحروف والأرقام») فتستمر حتى تنهوها – ويناسبها الحد بالدقائق أكثر.",
              })}
            </p>
          </>
        )}
        {settings.by !== "none" && (
          <p className="setting-note">
            {t({
              de: "Danach sagt das Spiel „Gute Nacht“, und kein Menü startet mehr ein Spiel – bis ein Erwachsener ⏳ unten drei Sekunden gedrückt hält und hier mehr Zeit gibt.",
              ru: "Потом игра говорит «Спокойной ночи», и ни одно меню больше не запускает игру – пока взрослый не удержит ⏳ внизу три секунды и не добавит здесь времени.",
              en: "Then the game says “Good night”, and no menu starts a game anymore – until a grown-up holds ⏳ at the bottom for three seconds and gives more time here.",
              zh: "之后游戏会说“晚安”，任何菜单都不能再开始游戏——直到大人按住下方的 ⏳ 三秒，并在这里增加时间。",
              hi: "उसके बाद खेल “शुभ रात्रि” कहता है, और कोई भी मेन्यू खेल शुरू नहीं करता – जब तक कोई बड़ा नीचे ⏳ को तीन सेकंड दबाए रखकर यहाँ और समय न दे।",
              es: "Después el juego dice «Buenas noches» y ningún menú vuelve a iniciar un juego, hasta que un adulto mantenga pulsado ⏳ abajo tres segundos y dé aquí más tiempo.",
              ar: "بعد ذلك تقول اللعبة «ليلة سعيدة»، ولا تبدأ أي قائمة لعبة بعد الآن – حتى يضغط شخص بالغ على ⏳ في الأسفل ثلاث ثوانٍ ويضيف هنا مزيدًا من الوقت.",
            })}
          </p>
        )}
        <p className="playtime-status">
          <span>
            {t({
              de: `Heute gespielt: ${minutes(playedMinutes)}, ${games(played.games)}`,
              ru: `Сегодня сыграно: ${minutes(playedMinutes)}, ${games(played.games)}`,
              en: `Played today: ${minutes(playedMinutes)}, ${games(played.games)}`,
              zh: `今天已玩：${minutes(playedMinutes)}，${games(played.games)}`,
              hi: `आज खेले: ${minutes(playedMinutes)}, ${games(played.games)}`,
              es: `Jugado hoy: ${minutes(playedMinutes)}, ${games(played.games)}`,
              ar: `اللعب اليوم: ${minutes(playedMinutes)}، ${games(played.games)}`,
            })}
            {over &&
              t({
                de: " – die Spielzeit ist vorbei",
                ru: " – время игры закончилось",
                en: " – play time is over",
                zh: "——游戏时间结束了",
                hi: " – खेलने का समय ख़त्म हो गया",
                es: " – se acabó el tiempo de juego",
                ar: " – انتهى وقت اللعب",
              })}
          </span>
          {over && (
            <button type="button" onClick={morePlaytime}>
              + {settings.by === "time" ? minutes(EXTRA_MINUTES) : games(1)}
            </button>
          )}
          {(played.ms > 0 || played.games > 0) && (
            <button type="button" onClick={resetPlaytime}>
              ↺{" "}
              {t({
                de: "Heute von vorn",
                ru: "Сегодня заново",
                en: "Start today over",
                zh: "今天重新计时",
                hi: "आज का समय फिर से",
                es: "Empezar hoy de nuevo",
                ar: "بدء اليوم من جديد",
              })}
            </button>
          )}
        </p>
      </SettingsGroup>
    </section>
  );
}
