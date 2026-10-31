import { Slider } from "@/components/SettingControls";
import { type Localized, useT } from "@/lib/language";
import { type Board, type BoardTask, COLLECT_GOALS, fieldCount, MAX_TASKS, rewardFromCatalog, taskFromCatalog } from "./board";
import { useTaskLabel } from "./BoardSheet";
import { MARKS, REWARDS, TASKS, THEMES } from "./catalog";
import { SlotChips } from "./Editor";
import { Thumb } from "./Gallery";
import { CHILD_NAME, COLORS, LOOK, NAME_EXAMPLE, Pick } from "./pageParts";
import { ItemPic, MarkPic, Pic, picture } from "./pictures";
import type { WizardStep } from "./Wizard";

/** The wizard's step of a board's tasks. */
const TASKS_LABEL: Localized = { de: "Aufgaben", en: "Tasks", zh: "任务", hi: "काम", es: "Tareas", ar: "المهام", ru: "Задачи" };
/** The wizard's step of a board's reward. */
const REWARD: Localized = { de: "Belohnung", en: "Reward", zh: "奖励", hi: "इनाम", es: "Premio", ar: "المكافأة", ru: "Награда" };

/** „Was kommt ins Feld?“: the mark a star field gets. */
const MARK_QUESTION: Localized = {
  de: "Was kommt ins Feld?",
  en: "What goes in the fields?",
  zh: "格子里放什么？",
  hi: "खानों में क्या आए?",
  es: "¿Qué va en las casillas?",
  ar: "ماذا نضع في الخانات؟",
  ru: "Что будет в клеточках?",
};

/** A board's own steps in the wizard, after the kind, the view and the Vorlage. */
export const BOARD_STEPS: WizardStep[] = [
  { id: "tasks", label: TASKS_LABEL },
  { id: "goal", label: REWARD },
  { id: "look", label: LOOK },
];

/**
 * One of a board's steps in the wizard, every choice as a picture: tasks, rewards and marks as big picture cards, the
 * colours as the board in each colour.
 */
export function BoardStep({ step, board, onChange }: { step: string; board: Board; onChange: (board: Board) => void }) {
  const t = useT();
  const taskLabel = useTaskLabel();
  const change = (patch: Partial<Board>) => onChange({ ...board, ...patch });
  const fields = fieldCount(board, new Date());
  const setTask = (taskId: string, patch: Partial<BoardTask>) =>
    change({ tasks: board.tasks.map((task) => (task.id === taskId ? { ...task, ...patch } : task)) });
  const toggleTask = (catalogId: string) => {
    const own = board.tasks.find((task) => task.catalog === catalogId);
    if (own) change({ tasks: board.tasks.filter((task) => task !== own) });
    else if (board.tasks.length < MAX_TASKS) change({ tasks: [...board.tasks, taskFromCatalog(catalogId)] });
  };

  if (step === "tasks")
    return (
      <>
        <h2>
          {board.kind === "collect"
            ? t({
                de: "Wofür gibt es Sterne?",
                en: "What are the stars for?",
                zh: "做什么能得星星？",
                hi: "सितारे किस बात के लिए मिलेंगे?",
                es: "¿Para qué son las estrellas?",
                ar: "مقابل ماذا تُمنح النجوم؟",
                ru: "За что звёзды?",
              })
            : t({
                de: "Was soll klappen?",
                en: "What should go well?",
                zh: "希望做到什么？",
                hi: "क्या अच्छे से होना चाहिए?",
                es: "¿Qué debería salir bien?",
                ar: "ما الذي نريد أن ينجح؟",
                ru: "Что должно получаться?",
              })}
        </h2>
        {board.tasks.length > 0 && board.kind !== "collect" && (
          <ul className="rw-wizard-tasks">
            {board.tasks.map((task) => (
              <li key={task.id}>
                <span className="rw-wizard-task">
                  <span aria-hidden>
                    <ItemPic item={task} />
                  </span>{" "}
                  {taskLabel(task) ||
                    t({ de: "Eigene Aufgabe", en: "Own task", zh: "自定义任务", hi: "अपना काम", es: "Tarea propia", ar: "مهمة خاصة", ru: "Своя задача" })}
                </span>
                <SlotChips task={task} onChange={(patch) => setTask(task.id, patch)} />
              </li>
            ))}
          </ul>
        )}
        <div className="rw-picks rw-picks-tiles" role="group" aria-label={t(TASKS_LABEL)}>
          {TASKS.map((task) => {
            const on = board.tasks.some((own) => own.catalog === task.id);
            return (
              <Pick
                key={task.id}
                selected={on}
                disabled={!on && board.tasks.length >= MAX_TASKS}
                onClick={() => toggleTask(task.id)}
                emoji={<ItemPic item={{ emoji: task.emoji, catalog: task.id }} />}
                label={t(task.label)}
              />
            );
          })}
        </div>
        <p className="setting-note">
          {t({
            de: "Am besten eine bis drei Aufgaben, eine davon leicht – antippen nimmt sie dazu oder wieder weg. Zähne putzen bekommt morgens ☀️ und abends 🌙 je einen Stern – das Spiel „Zähne putzen“ setzt beide von selbst. Eigene Aufgaben gibt es danach unter „Gestalten“.",
            en: "One to three tasks work best, one of them easy – a tap adds a task or takes it away. Brushing teeth gets a star in the morning ☀️ and one in the evening 🌙 – the game “Brushing Teeth” fills in both by itself. Your own tasks can be added later under “Design”.",
            zh: "最好一到三个任务，其中一个要简单——点一下就添加或移除。刷牙早上 ☀️ 和晚上 🌙 各得一颗星——游戏“刷牙”会自动填上。自定义任务之后可在“设计”里添加。",
            hi: "एक से तीन काम सबसे अच्छे रहते हैं, उनमें से एक आसान – टैप करने से काम जुड़ता या हटता है। दाँत साफ़ करने पर सुबह ☀️ और शाम 🌙 एक-एक सितारा मिलता है – „दाँत साफ़ करना“ खेल दोनों अपने-आप भर देता है। अपने काम बाद में „डिज़ाइन“ में जोड़ें।",
            es: "Lo mejor son de una a tres tareas, una de ellas fácil; al tocar una, se añade o se quita. Lavarse los dientes recibe una estrella por la mañana ☀️ y otra por la noche 🌙: el juego «Lavarse los dientes» pone las dos solo. Las tareas propias se añaden después en «Diseñar».",
            ar: "الأفضل من مهمة إلى ثلاث مهام، إحداها سهلة – النقر يضيف المهمة أو يزيلها. تنظيف الأسنان له نجمة صباحًا ☀️ ونجمة مساءً 🌙 – ولعبة «تنظيف الأسنان» تضعهما تلقائيًا. يمكن إضافة مهام خاصة لاحقًا في «تصميم».",
            ru: "Лучше всего одна–три задачи, одна из них лёгкая – касание добавляет задачу или убирает её. За чистку зубов – по звезде утром ☀️ и вечером 🌙: игра «Чистим зубы» ставит обе сама. Свои задачи можно добавить потом в разделе «Оформление».",
          })}
        </p>
      </>
    );

  if (step === "goal")
    return (
      <>
        <h2>
          {t({
            de: "Worauf freut ihr euch?",
            en: "What are you looking forward to?",
            zh: "你们期待什么？",
            hi: "किस बात का इंतज़ार है?",
            es: "¿Qué les hace ilusión?",
            ar: "ما الذي تتطلعون إليه؟",
            ru: "Чему будете радоваться?",
          })}
        </h2>
        <div className="rw-picks rw-picks-tiles" role="group" aria-label={t(REWARD)}>
          <Pick
            selected={!board.reward}
            onClick={() => change({ reward: null })}
            emoji={<Pic src={picture("fest")} emoji="🎉" />}
            label={t({
              de: "Nur zusammen freuen",
              en: "Just celebrate together",
              zh: "一起开心就好",
              hi: "बस साथ में खुशी मनाएँ",
              es: "Solo alegrarse juntos",
              ar: "نفرح معًا فقط",
              ru: "Просто порадоваться вместе",
            })}
          />
          {REWARDS.map((reward) => (
            <Pick
              key={reward.id}
              selected={board.reward?.catalog === reward.id}
              onClick={() => change({ reward: rewardFromCatalog(reward.id) })}
              emoji={<ItemPic item={{ emoji: reward.emoji, catalog: reward.id }} kind="reward" />}
              label={t(reward.label)}
            />
          ))}
        </div>
        {board.kind === "collect" && (
          <div
            className="rw-chips"
            role="group"
            aria-label={t({
              de: "Sterne bis zur Belohnung",
              en: "Stars until the reward",
              zh: "得到奖励需要的星星",
              hi: "इनाम तक सितारे",
              es: "Estrellas hasta el premio",
              ar: "النجوم حتى المكافأة",
              ru: "Звёзд до награды",
            })}
          >
            {COLLECT_GOALS.map((n) => (
              <button
                key={n}
                type="button"
                className={n === board.goal ? "selected" : undefined}
                aria-pressed={n === board.goal}
                onClick={() => change({ goal: n })}
              >
                {n} ⭐
              </button>
            ))}
          </div>
        )}
        {(board.kind === "week" || board.kind === "month") && fields > 1 && (
          <Slider
            label={
              board.kind === "week"
                ? t({
                    de: "Sterne in der Woche bis zur Belohnung",
                    en: "Stars in the week until the reward",
                    zh: "每周得到奖励需要的星星",
                    hi: "इनाम तक हफ़्ते के सितारे",
                    es: "Estrellas por semana hasta el premio",
                    ar: "نجوم الأسبوع حتى المكافأة",
                    ru: "Звёзд за неделю до награды",
                  })
                : t({
                    de: "Sterne im Monat bis zur Belohnung",
                    en: "Stars in the month until the reward",
                    zh: "每月得到奖励需要的星星",
                    hi: "इनाम तक महीने के सितारे",
                    es: "Estrellas por mes hasta el premio",
                    ar: "نجوم الشهر حتى المكافأة",
                    ru: "Звёзд за месяц до награды",
                  })
            }
            value={Math.min(board.goal, fields)}
            min={1}
            max={fields}
            format={(n) =>
              n === fields
                ? t({ de: `${n} (alle)`, en: `${n} (all)`, zh: `${n}（全部）`, hi: `${n} (सभी)`, es: `${n} (todas)`, ar: `${n} (الكل)`, ru: `${n} (все)` })
                : String(n)
            }
            onChange={(goal) => change({ goal })}
          />
        )}
        {board.kind === "day" && (
          <p className="setting-note">
            {t({
              de: "Gefeiert wird, wenn alle Aufgaben des Tages ihren Stern haben.",
              en: "The party comes when every task of the day has its star.",
              zh: "当天所有任务都得到星星时，就一起庆祝。",
              hi: "जब दिन के सभी कामों को सितारा मिल जाए, तब जश्न होता है।",
              es: "Se celebra cuando todas las tareas del día tienen su estrella.",
              ar: "نحتفل عندما تحصل كل مهام اليوم على نجمتها.",
              ru: "Праздник – когда у всех задач дня есть звезда.",
            })}
          </p>
        )}
        <p className="setting-note">
          {t({
            de: "Kleine freuen sich am meisten über Zeit zusammen – und über eine Belohnung, die bald kommt.",
            en: "Little ones are happiest about time together – and about a reward that comes soon.",
            zh: "小孩子最开心的是一起度过的时光——还有很快就能得到的奖励。",
            hi: "छोटे बच्चे सबसे ज़्यादा साथ बिताए समय से खुश होते हैं – और ऐसे इनाम से जो जल्दी मिले।",
            es: "Lo que más alegra a los pequeños es el tiempo juntos, y un premio que llegue pronto.",
            ar: "يفرح الصغار أكثر ما يفرحون بالوقت معًا – وبمكافأة تأتي قريبًا.",
            ru: "Малыши больше всего радуются времени вместе – и награде, которая будет скоро.",
          })}
        </p>
      </>
    );

  return (
    <>
      <h2>
        {t({
          de: "Für wen ist die Tafel?",
          en: "Who is the chart for?",
          zh: "这张奖励表是给谁的？",
          hi: "यह चार्ट किसके लिए है?",
          es: "¿Para quién es la tabla?",
          ar: "لمن هذه اللوحة؟",
          ru: "Для кого таблица?",
        })}
      </h2>
      <label className="rw-input">
        <span>{t(CHILD_NAME)}</span>
        <input type="text" value={board.childName} maxLength={24} placeholder={t(NAME_EXAMPLE)} onChange={(e) => change({ childName: e.target.value })} />
      </label>
      <h3 className="rw-wizard-sub">{t(MARK_QUESTION)}</h3>
      <div className="rw-picks rw-picks-tiles" role="group" aria-label={t(MARK_QUESTION)}>
        {MARKS.map((mark) => (
          <Pick
            key={mark.id}
            selected={mark.id === board.mark}
            onClick={() => change({ mark: mark.id })}
            emoji={<MarkPic mark={mark} />}
            label={t(mark.label)}
          />
        ))}
      </div>
      <h3 className="rw-wizard-sub">{t(COLORS)}</h3>
      <div className="rw-picks rw-picks-small" role="group" aria-label={t(COLORS)}>
        {THEMES.map((theme) => (
          <Pick
            key={theme.id}
            selected={theme.id === board.theme}
            onClick={() => change({ theme: theme.id })}
            picture={<Thumb board={{ ...board, theme: theme.id }} />}
            label={t(theme.label)}
          />
        ))}
      </div>
    </>
  );
}
