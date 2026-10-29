import { useState } from "react";
import { GameShell } from "@/components/GameShell";
import { useGameSettings } from "@/lib/common";
import { useDevice } from "@/lib/device";
import { useAppLanguage, useT } from "@/lib/language";
import { ElevatorPlay } from "./ElevatorPlay";
import { titleIn } from "./phrases";
import { DEFAULT_ELEVATOR_SETTINGS, ELEVATOR_SETTINGS_KEY, type ElevatorSettings } from "./settings";
import { TRAIL_LEVELS } from "./trail/levels";
import { TrailPlay } from "./trail/TrailPlay";
import "./elevator.css";

/** The small tags on the cards: which levels ride the lift in the house, which walk through the world. */
const LIFT = { de: "🛗 Aufzug", ru: "🛗 Лифт", en: "🛗 Elevator", zh: "🛗 电梯", hi: "🛗 लिफ़्ट", es: "🛗 Ascensor", ar: "🛗 المصعد" };
const TRAIL = { de: "🚶 Laufen", ru: "🚶 Пешком", en: "🚶 Walking", zh: "🚶 走路", hi: "🚶 पैदल", es: "🚶 A pie", ar: "🚶 مشيا" };

/** "Kleine Abenteuer": the lift stories in the house and the trail levels through the world. */
export function ElevatorGame() {
  const [settings, update] = useGameSettings(ELEVATOR_SETTINGS_KEY, DEFAULT_ELEVATOR_SETTINGS);
  const device = useDevice();
  const t = useT();
  const { id: language } = useAppLanguage();
  // The story titles are German in the data and come in the app language from its phrasebook (`phrases.ts`).
  const title = (german: string) => titleIn(german, language);

  return (
    <GameShell
      title={t({
        de: "Kleine Abenteuer",
        ru: "Маленькие приключения",
        en: "Little Adventures",
        zh: "小小冒险",
        hi: "छोटे-छोटे रोमांच",
        es: "Pequeñas aventuras",
        ar: "مغامرات صغيرة",
      })}
      emoji="🧭"
      modes={[
        { id: "hunger", emoji: "🥞", title: title("Pfannkuchen"), kind: t(LIFT) },
        { id: "gutenacht", emoji: "🌙", title: title("Gute Nacht"), kind: t(LIFT) },
        { id: "pfuetzen", emoji: "🌧️", title: title("Pfützen"), kind: t(LIFT) },
        { id: "drachen", emoji: "🪁", title: title("Der Drachen"), kind: t(TRAIL) },
        { id: "ball", emoji: "⚽", title: title("Der Ball rollt weg"), kind: t(TRAIL) },
        { id: "ballon", emoji: "🎈", title: title("Der Luftballon"), kind: t(TRAIL) },
        { id: "lok", emoji: "🚂", title: title("Die kleine Lok"), kind: t(TRAIL) },
        { id: "katze", emoji: "🐈", title: title("Wo ist die Katze?"), kind: t(TRAIL) },
      ]}
      mode={settings.story}
      onMode={(story) => update({ story })}
      info={
        <>
          <p>
            {t({
              de: "Kleine Bildergeschichten von etwa 5 Minuten. Im Haus zeigt eine Denkblase, was das Kind als Nächstes braucht, und es fährt mit dem Aufzug in diesen Stock. Draußen läuft es einem Ding hinterher, das weggeflogen oder weggerollt ist, sammelt unterwegs Sachen in den Rucksack und nimmt an jedem Hindernis das, was hilft.",
              ru: "Маленькие истории в картинках, около 5 минут каждая. В доме облачко мыслей показывает, что ребёнку нужно дальше, и он едет на лифте на этот этаж. На улице он бежит за вещью, которая улетела или укатилась, по дороге собирает вещи в рюкзак и у каждого препятствия берёт то, что помогает.",
              en: "Little picture stories of about 5 minutes. In the house, a thought bubble shows what the child needs next, and the child rides the elevator to that floor. Outside, the child runs after something that flew or rolled away, collects things in the backpack on the way and at each obstacle takes what helps.",
              zh: "大约 5 分钟的小图画故事。在房子里，一个想法泡泡显示孩子接下来需要什么，孩子坐电梯去那一层。在外面，孩子追赶一个飞走或滚走的东西，路上把东西收进背包，遇到每个障碍时拿出能帮忙的那一样。",
              hi: "लगभग 5 मिनट की छोटी चित्र-कहानियाँ। घर में एक सोच का बुलबुला दिखाता है कि बच्चे को आगे क्या चाहिए, और बच्चा लिफ़्ट से उस मंज़िल पर जाता है। बाहर बच्चा किसी ऐसी चीज़ के पीछे दौड़ता है जो उड़ गई या लुढ़क गई, रास्ते में चीज़ें बैग में इकट्ठा करता है और हर रुकावट पर वह चीज़ लेता है जो मदद करे।",
              es: "Pequeñas historias con imágenes de unos 5 minutos. En la casa, una nube de pensamiento muestra qué necesita su peque a continuación, y sube en el ascensor a ese piso. Fuera, corre detrás de algo que se ha ido volando o rodando, recoge cosas en la mochila por el camino y en cada obstáculo toma lo que ayuda.",
              ar: "قصص مصورة صغيرة مدة كل منها نحو 5 دقائق. في البيت تظهر فقاعة تفكير ما يحتاجه الطفل بعد ذلك، فيركب المصعد إلى ذلك الطابق. وفي الخارج يجري وراء شيء طار أو تدحرج بعيدا، ويجمع في الطريق أشياء في حقيبة الظهر، وعند كل عقبة يأخذ ما يساعد.",
            })}
          </p>
          <p>
            {t({
              de: "Am Ende spielt „Nochmal“ dieselbe Geschichte noch einmal, „Weiter“ die nächste.",
              ru: "В конце «Ещё раз» играет ту же историю снова, «Дальше» — следующую.",
              en: "At the end, “Again” plays the same story once more, “Next” the next one.",
              zh: "结束时，“再来一次”重玩同一个故事，“下一个”玩下一个故事。",
              hi: "आख़िर में “फिर से” वही कहानी दोबारा चलाता है, “आगे” अगली कहानी।",
              es: "Al final, «Otra vez» vuelve a jugar la misma historia y «Siguiente», la próxima.",
              ar: "في النهاية يعيد زر «مرة أخرى» القصة نفسها، وزر «التالي» يبدأ القصة التالية.",
            })}
          </p>
          {!device.touchOnly && (
            <p>
              {t({
                de: "Leuchtet der große Knopf, drückt ihn die Leertaste (oder jede andere Taste). Im Haus holen 1–4 den Aufzug, Pfeil hoch und runter fahren einen Stock weiter; draußen nehmen 1–3 ein Ding aus dem offenen Rucksack, und an einer Weggabelung wählen 1 und 2 den Weg. Am Ende geht jede Taste zur nächsten Geschichte.",
                ru: "Когда большая кнопка светится, её нажимает пробел (или любая другая клавиша). В доме клавиши 1–4 вызывают лифт, стрелки вверх и вниз везут на этаж выше или ниже; на улице 1–3 достают вещь из открытого рюкзака, а на развилке 1 и 2 выбирают дорогу. В конце любая клавиша ведёт к следующей истории.",
                en: "When the big button lights up, the space bar presses it (or any other key). In the house, 1–4 call the elevator, the up and down arrows go one floor up or down; outside, 1–3 take something out of the open backpack, and at a fork 1 and 2 choose the way. At the end, any key goes to the next story.",
                zh: "大按钮亮起时，按空格键（或任意键）就能按下它。在房子里，1–4 叫电梯，上下方向键上一层或下一层；在外面，1–3 从打开的背包里拿出一样东西，在岔路口 1 和 2 选择走哪条路。结束时，按任意键进入下一个故事。",
                hi: "जब बड़ा बटन चमकता है, तो स्पेस बार (या कोई भी दूसरी कुंजी) उसे दबाती है। घर में 1–4 लिफ़्ट बुलाते हैं, ऊपर और नीचे के तीर एक मंज़िल ऊपर या नीचे ले जाते हैं; बाहर 1–3 खुले बैग से एक चीज़ निकालते हैं, और दोराहे पर 1 और 2 रास्ता चुनते हैं। आख़िर में कोई भी कुंजी अगली कहानी पर ले जाती है।",
                es: "Cuando el botón grande se ilumina, la barra espaciadora (o cualquier otra tecla) lo pulsa. En la casa, 1–4 llaman al ascensor y las flechas arriba y abajo suben o bajan un piso; fuera, 1–3 sacan algo de la mochila abierta, y en un cruce 1 y 2 eligen el camino. Al final, cualquier tecla lleva a la siguiente historia.",
                ar: "عندما يضيء الزر الكبير يضغطه مفتاح المسافة (أو أي مفتاح آخر). في البيت تستدعي المفاتيح 1–4 المصعد، وسهما الأعلى والأسفل يصعدان أو ينزلان طابقا واحدا؛ وفي الخارج تخرج المفاتيح 1–3 شيئا من حقيبة الظهر المفتوحة، وعند مفترق الطرق يختار 1 و2 الطريق. في النهاية يأخذ أي مفتاح إلى القصة التالية.",
              })}
            </p>
          )}
        </>
      }
    >
      <Stories settings={settings} />
    </GameShell>
  );
}

/** Plays the story picked on the start screen, and after it the one „Nochmal“ or „Weiter“ starts. */
function Stories({ settings }: { settings: ElevatorSettings }) {
  const language = useAppLanguage();
  const [run, setRun] = useState({ story: settings.story, n: 0 });
  const pick = (story: string) => setRun((r) => ({ story, n: r.n + 1 }));
  const level = TRAIL_LEVELS.find((l) => l.id === run.story);
  return level ? (
    <TrailPlay key={run.n} language={language} settings={settings} level={level} onPick={pick} />
  ) : (
    <ElevatorPlay key={run.n} language={language} settings={settings} story={run.story} onPick={pick} />
  );
}
