import { GameShell } from "@/components/GameShell";
import { Choice } from "@/components/SettingControls";
import { useGameSettings } from "@/lib/common";
import { useDevice } from "@/lib/device";
import { type Localized, useT } from "@/lib/language";
import { SOCK_TEXTS } from "./content";
import { SocksPlay } from "./SocksPlay";
import { DEFAULT_SOCKS_SETTINGS, SOCKS_SETTINGS_KEY, type SockMode, type StartPairs } from "./settings";
import "./socks.css";

/** The game's name, on its start screen and in the browser tab. */
export const SOCKS_TITLE: Localized = {
  de: "Socken-Paare",
  en: "Sock Pairs",
  zh: "袜子配对",
  hi: "मोज़ों के जोड़े",
  es: "Pares de calcetines",
  ar: "أزواج الجوارب",
  ru: "Пары носочков",
};

export function SocksGame() {
  const t = useT();
  const { pairs } = t(SOCK_TEXTS);
  const [settings, update] = useGameSettings(SOCKS_SETTINGS_KEY, DEFAULT_SOCKS_SETTINGS);
  const device = useDevice();

  return (
    <GameShell
      title={t(SOCKS_TITLE)}
      emoji="🧦"
      modes={[
        { id: "colors", emoji: "🌈", title: t({ de: "Farben", en: "Colors", zh: "颜色", hi: "रंग", es: "Colores", ar: "ألوان", ru: "Цвета" }) },
        { id: "patterns", emoji: "⭐", title: t({ de: "Muster", en: "Patterns", zh: "花纹", hi: "डिज़ाइन", es: "Dibujos", ar: "نقوش", ru: "Узоры" }) },
      ]}
      mode={settings.mode}
      onMode={(mode) => update({ mode: mode as SockMode })}
      level={
        <Choice<StartPairs>
          label={t({ de: "Am Anfang", en: "To start", zh: "开始时", hi: "शुरुआत में", es: "Al principio", ar: "في البداية", ru: "Для начала" })}
          value={settings.pairs}
          onChange={(pairs) => update({ pairs })}
          options={[
            { value: "2", label: pairs(2) },
            { value: "3", label: pairs(3) },
            { value: "4", label: pairs(4) },
          ]}
        />
      }
      info={
        <>
          <p>
            {t({
              de: "Die Waschmaschine ist voll. Ein Tipp startet sie, dann purzeln die Socken auf den Boden. Eine Socke antippen hebt sie hoch und lässt ihren Ton klingen; ihre Partnerin dazu, und beide hüpfen an die Wäscheleine. Eine andere Socke ist nie falsch: Die erste geht einfach zurück.",
              en: "The washing machine is full. One tap starts it, then the socks tumble onto the floor. Tapping a sock lifts it and plays its note; tap its partner too, and both hop onto the clothesline. Another sock is never wrong: the first one simply goes back down.",
              zh: "洗衣机装满了。点一下就会启动，袜子随后滚落到地上。点一只袜子，它会被举起来并响起它的音；再点它的另一只，两只就一起跳到晾衣绳上。点到别的袜子也从来不算错：第一只只是回到原处。",
              hi: "वॉशिंग मशीन भरी हुई है। एक टैप से वह चलने लगती है, फिर मोज़े ज़मीन पर गिर पड़ते हैं। किसी मोज़े पर टैप करने से वह ऊपर उठता है और उसकी धुन बजती है; फिर उसके जोड़ीदार पर, और दोनों उछलकर रस्सी पर टँग जाते हैं। कोई दूसरा मोज़ा कभी ग़लत नहीं होता: पहला बस वापस नीचे चला जाता है।",
              es: "La lavadora está llena. Un toque la pone en marcha y los calcetines caen al suelo. Al tocar un calcetín, se levanta y suena su nota; luego su pareja, y los dos saltan al tendedero. Otro calcetín nunca es un error: el primero simplemente vuelve a bajar.",
              ar: "الغسالة ممتلئة. لمسة واحدة تشغّلها، ثم تتدحرج الجوارب على الأرض. لمس جورب يرفعه ويُسمع نغمته؛ ثم لمس شريكه، فيقفز الاثنان إلى حبل الغسيل. الجورب الآخر ليس خطأً أبدًا: الأول يعود ببساطة إلى الأسفل.",
              ru: "Стиральная машина полна. Одно касание запускает её, и носочки высыпаются на пол. Касание носочка поднимает его, и звучит его нота; к нему его пару – и оба прыгают на верёвку. Другой носочек никогда не ошибка: первый просто возвращается обратно.",
            })}
          </p>
          <p>
            {t({
              de: "„Farben“: jedes Paar hat seine Farbe. „Muster“: jedes Paar hat sein Muster in nur drei Farben. „Weiter“ bringt ein Paar mehr.",
              en: "“Colors”: every pair has its own color. “Patterns”: every pair has its own pattern in only three colors. “Next” adds one more pair.",
              zh: "“颜色”：每双袜子颜色不同。“花纹”：每双袜子花纹不同，只用三种颜色。“继续”会多加一双。",
              hi: "“रंग”: हर जोड़े का अपना रंग है। “डिज़ाइन”: हर जोड़े का अपना डिज़ाइन है, सिर्फ़ तीन रंगों में। “आगे” एक जोड़ा और जोड़ देता है।",
              es: "«Colores»: cada par tiene su color. «Dibujos»: cada par tiene su dibujo, en solo tres colores. «Siguiente» añade un par más.",
              ar: "«ألوان»: لكل زوج لونه. «نقوش»: لكل زوج نقشه، بثلاثة ألوان فقط. «التالي» يضيف زوجًا آخر.",
              ru: "«Цвета»: у каждой пары свой цвет. «Узоры»: у каждой пары свой узор всего в трёх цветах. «Дальше» добавляет ещё одну пару.",
            })}
          </p>
          {!device.touchOnly && (
            <p>
              {t({
                de: "Mit der Tastatur: jede Taste startet die Waschmaschine. Dann wählen Pfeiltasten eine Socke, Leertaste oder Enter nimmt sie, 1–9 direkt.",
                en: "With a keyboard: any key starts the washing machine. Then the arrow keys pick a sock, Space or Enter takes it, 1–9 directly.",
                zh: "用键盘：按任意键启动洗衣机。然后用方向键选袜子，空格键或回车键拿起它，1–9 直接选。",
                hi: "कीबोर्ड से: कोई भी कुंजी वॉशिंग मशीन चला देती है। फिर तीर वाली कुंजियाँ मोज़ा चुनती हैं, स्पेस या एंटर उसे उठाता है, 1–9 सीधे।",
                es: "Con teclado: cualquier tecla pone en marcha la lavadora. Después, las flechas eligen un calcetín, la barra espaciadora o Enter lo toma, 1–9 directamente.",
                ar: "بلوحة المفاتيح: أي مفتاح يشغّل الغسالة. ثم تختار الأسهم جوربًا، ومفتاح المسافة أو Enter يأخذه، و1–9 مباشرة.",
                ru: "С клавиатуры: любая клавиша запускает стиральную машину. Потом стрелки выбирают носочек, пробел или Enter берёт его, 1–9 сразу.",
              })}
            </p>
          )}
        </>
      }
    >
      <SocksPlay settings={settings} />
    </GameShell>
  );
}
