import { Choice, SettingsGroup, Slider, Toggle } from "@/components/SettingControls";
import { useT } from "@/lib/language";
import { type Board, type BoardTask, COLLECT_GOALS, fieldCount, MAX_TASKS, newId, rewardFromCatalog, taskFromCatalog } from "./board";
import { useBoardTitle, useRewardLabel, useTaskLabel } from "./BoardSheet";
import { DAY_NAMES, MARKS, REWARDS, SLOTS, TASK_BY_ID, TASKS, THEMES } from "./catalog";
import { ItemPic } from "./pictures";

/**
 * How often a day a task gets a star: chips for morning, noon and evening, each its own field; none on means once a
 * day. Brushing teeth comes with morning and evening on.
 */
export function SlotChips({ task, onChange }: { task: BoardTask; onChange: (patch: Partial<BoardTask>) => void }) {
  const t = useT();
  const on = task.slots ?? [];
  return (
    <div
      className="rw-chips rw-slot-chips"
      role="group"
      aria-label={t({
        de: "Wann am Tag?",
        en: "When in the day?",
        zh: "一天中什么时候？",
        hi: "दिन में कब?",
        es: "¿Cuándo durante el día?",
        ar: "متى خلال اليوم؟",
        ru: "Когда в течение дня?",
      })}
    >
      <button type="button" className={on.length === 0 ? "selected" : undefined} aria-pressed={on.length === 0} onClick={() => onChange({ slots: undefined })}>
        {t({ de: "1× am Tag", en: "1× a day", zh: "每天1次", hi: "दिन में 1 बार", es: "1× al día", ar: "مرة في اليوم", ru: "1× в день" })}
      </button>
      {SLOTS.map((slot) => {
        const has = on.includes(slot.id);
        const slots = has ? on.filter((s) => s !== slot.id) : SLOTS.map((s) => s.id).filter((s) => s === slot.id || on.includes(s));
        return (
          <button
            key={slot.id}
            type="button"
            className={has ? "selected" : undefined}
            aria-pressed={has}
            onClick={() => onChange({ slots: slots.length ? slots : undefined })}
          >
            {slot.emoji} {t(slot.label)}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Everything a grown-up can change on a board, live under the board's preview:
 * name and heading (the kind is the row of views above the board), tasks (from pictures or their own), weekdays, goal,
 * reward, mark and colours – and starting over or removing the board.
 */
export function Editor({
  board,
  onChange,
  onStartOver,
  onRemove,
}: {
  board: Board;
  onChange: (patch: Partial<Board>) => void;
  onStartOver: () => void;
  /** Missing when it is the only board. */
  onRemove?: () => void;
}) {
  const t = useT();
  const taskLabel = useTaskLabel();
  const rewardLabel = useRewardLabel();
  const autoTitle = useBoardTitle()({ ...board, title: "" });
  const fields = fieldCount(board, new Date());
  const unused = TASKS.filter((task) => !board.tasks.some((own) => own.catalog === task.id));

  const setTask = (id: string, patch: Partial<BoardTask>) => onChange({ tasks: board.tasks.map((task) => (task.id === id ? { ...task, ...patch } : task)) });
  const move = (index: number, by: number) => {
    const tasks = [...board.tasks];
    const [task] = tasks.splice(index, 1);
    tasks.splice(index + by, 0, task);
    onChange({ tasks });
  };
  const addTask = (task: BoardTask) => board.tasks.length < MAX_TASKS && onChange({ tasks: [...board.tasks, task] });

  return (
    <section className="settings rw-editor">
      <SettingsGroup
        title={t({
          de: "Name und Überschrift",
          en: "Name and heading",
          zh: "名字和标题",
          hi: "नाम और शीर्षक",
          es: "Nombre y título",
          ar: "الاسم والعنوان",
          ru: "Имя и заголовок",
        })}
      >
        <label className="rw-input">
          <span>
            {t({
              de: "Name des Kindes (steht in der Überschrift, bleibt auf diesem Gerät)",
              en: "Child’s name (shown in the heading, stays on this device)",
              zh: "孩子的名字（显示在标题里，只保存在本设备上）",
              hi: "बच्चे का नाम (शीर्षक में दिखेगा, इसी डिवाइस पर रहेगा)",
              es: "Nombre del peque (aparece en el título y se queda en este dispositivo)",
              ar: "اسم الطفل (يظهر في العنوان ويبقى على هذا الجهاز)",
              ru: "Имя ребёнка (стоит в заголовке, хранится только на этом устройстве)",
            })}
          </span>
          <input
            type="text"
            value={board.childName}
            maxLength={24}
            placeholder={t({
              de: "z. B. Lena",
              en: "e.g. Emma",
              zh: "例如：小美",
              hi: "जैसे: मीरा",
              es: "p. ej., Lucía",
              ar: "مثلًا: ليلى",
              ru: "например, Лена",
            })}
            onChange={(e) => onChange({ childName: e.target.value })}
          />
        </label>
        <label className="rw-input">
          <span>{t({ de: "Überschrift", en: "Heading", zh: "标题", hi: "शीर्षक", es: "Título", ar: "العنوان", ru: "Заголовок" })}</span>
          <input type="text" value={board.title} maxLength={40} placeholder={autoTitle} onChange={(e) => onChange({ title: e.target.value })} />
        </label>
      </SettingsGroup>

      <SettingsGroup
        title={
          board.kind === "collect"
            ? t({
                de: "Wofür gibt es Sterne?",
                en: "What are the stars for?",
                zh: "做什么能得星星？",
                hi: "सितारे किस बात के लिए मिलते हैं?",
                es: "¿Por qué se ganan estrellas?",
                ar: "على ماذا تُعطى النجوم؟",
                ru: "За что даются звёзды?",
              })
            : t({ de: "Aufgaben", en: "Tasks", zh: "任务", hi: "काम", es: "Tareas", ar: "المهام", ru: "Задания" })
        }
      >
        <ol className="rw-tasks">
          {board.tasks.map((task, i) => {
            const catalog = task.catalog ? TASK_BY_ID.get(task.catalog) : undefined;
            return (
              <li key={task.id} className="rw-task-edit">
                <input
                  type="text"
                  className="rw-emoji-input"
                  value={task.emoji}
                  maxLength={8}
                  aria-label={t({
                    de: "Bild (Emoji)",
                    en: "Picture (emoji)",
                    zh: "图片（表情符号）",
                    hi: "तस्वीर (इमोजी)",
                    es: "Imagen (emoji)",
                    ar: "صورة (إيموجي)",
                    ru: "Картинка (эмодзи)",
                  })}
                  onChange={(e) => setTask(task.id, { emoji: e.target.value })}
                />
                <input
                  type="text"
                  className="rw-label-input"
                  value={task.label ?? ""}
                  maxLength={32}
                  placeholder={
                    catalog
                      ? t(catalog.label)
                      : t({
                          de: "Was soll klappen?",
                          en: "What should go well?",
                          zh: "要做到什么？",
                          hi: "क्या करना है?",
                          es: "¿Qué debe salir bien?",
                          ar: "ما الذي نريده أن ينجح؟",
                          ru: "Что должно получиться?",
                        })
                  }
                  aria-label={t({
                    de: "Wort zur Aufgabe",
                    en: "Words for the task",
                    zh: "任务名称",
                    hi: "काम का नाम",
                    es: "Nombre de la tarea",
                    ar: "اسم المهمة",
                    ru: "Название задания",
                  })}
                  onChange={(e) => setTask(task.id, { label: e.target.value || undefined })}
                />
                <span className="rw-task-buttons">
                  <button
                    type="button"
                    disabled={i === 0}
                    aria-label={t({ de: "Nach oben", en: "Move up", zh: "上移", hi: "ऊपर", es: "Subir", ar: "إلى الأعلى", ru: "Выше" })}
                    onClick={() => move(i, -1)}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={i === board.tasks.length - 1}
                    aria-label={t({ de: "Nach unten", en: "Move down", zh: "下移", hi: "नीचे", es: "Bajar", ar: "إلى الأسفل", ru: "Ниже" })}
                    onClick={() => move(i, 1)}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    aria-label={t({
                      de: `${taskLabel(task)} entfernen`,
                      en: `Remove ${taskLabel(task)}`,
                      zh: `删除“${taskLabel(task)}”`,
                      hi: `${taskLabel(task)} हटाएँ`,
                      es: `Quitar ${taskLabel(task)}`,
                      ar: `إزالة ${taskLabel(task)}`,
                      ru: `Убрать: ${taskLabel(task)}`,
                    })}
                    onClick={() => onChange({ tasks: board.tasks.filter((own) => own.id !== task.id) })}
                  >
                    ✕
                  </button>
                </span>
                {board.kind !== "collect" && <SlotChips task={task} onChange={(patch) => setTask(task.id, patch)} />}
                {catalog?.linked && board.kind !== "collect" && (
                  <span className="rw-linked">
                    <Toggle
                      label={
                        catalog.linked === "teeth"
                          ? t({
                              de: "Stern kommt von selbst, wenn im Spiel „Zähne putzen“ fertig geputzt ist",
                              en: "The star comes by itself when brushing is finished in the game “Brushing Teeth”",
                              zh: "在游戏“刷牙”里刷完牙，星星会自动出现",
                              hi: "खेल “दाँत साफ़ करना” में ब्रश पूरा होते ही सितारा अपने-आप आता है",
                              es: "La estrella llega sola al terminar el cepillado en el juego «Lavarse los dientes»",
                              ar: "تأتي النجمة وحدها عند انتهاء التنظيف في لعبة «تنظيف الأسنان»",
                              ru: "Звезда появляется сама, когда в игре «Чистим зубы» зубы почищены",
                            })
                          : t({
                              de: "Stern kommt von selbst, wenn im Spiel „Aufs Töpfchen“ ein Haken getippt ist",
                              en: "The star comes by itself when a tick is tapped in the game “Potty Time”",
                              zh: "在游戏“坐便盆”里点了勾，星星会自动出现",
                              hi: "खेल “पॉटी पर चलो” में सही का निशान लगते ही सितारा अपने-आप आता है",
                              es: "La estrella llega sola al tocar una marca en el juego «Al orinal»",
                              ar: "تأتي النجمة وحدها عند النقر على علامة في لعبة «إلى النونية»",
                              ru: "Звезда появляется сама, когда в игре «На горшок» отмечена галочка",
                            })
                      }
                      checked={!!task.linked}
                      onChange={(on) => setTask(task.id, { linked: on ? catalog.linked : undefined })}
                    />
                  </span>
                )}
              </li>
            );
          })}
        </ol>
        {board.tasks.length === 0 && (
          <p className="setting-note">
            {t({
              de: "Noch keine Aufgabe – unten eine antippen.",
              en: "No task yet – tap one below.",
              zh: "还没有任务——点一下下面的任务。",
              hi: "अभी कोई काम नहीं – नीचे किसी एक पर टैप करें।",
              es: "Aún no hay tareas: toque una abajo.",
              ar: "لا توجد مهمة بعد – انقروا على واحدة في الأسفل.",
              ru: "Заданий пока нет – выберите одно ниже.",
            })}
          </p>
        )}
        <p className="setting-note">
          {t({
            de: "Für Zwei- und Dreijährige am besten eine bis drei Aufgaben, eine davon leicht – so gibt es bald den ersten Stern. Etwas Bestimmtes („Zähne putzen“) statt „lieb sein“.",
            en: "For two- and three-year-olds one to three tasks work best, one of them easy – so the first star comes soon. Something specific (“brush teeth”) rather than “be good”.",
            zh: "两三岁的孩子最好只有一到三项任务，其中一项简单些——这样很快就能得到第一颗星。要具体（“刷牙”），不要笼统（“要乖”）。",
            hi: "दो-तीन साल के बच्चों के लिए एक से तीन काम सबसे अच्छे हैं, उनमें से एक आसान – ताकि पहला सितारा जल्दी मिले। कुछ ठोस (“दाँत साफ़ करना”), न कि “अच्छे से रहना”।",
            es: "Para peques de dos y tres años, lo mejor son de una a tres tareas, una de ellas fácil: así llega pronto la primera estrella. Algo concreto («lavarse los dientes») en lugar de «portarse bien».",
            ar: "للأطفال في سن الثانية والثالثة يُفضَّل من مهمة إلى ثلاث، إحداها سهلة – فتأتي النجمة الأولى سريعًا. شيء محدد («تنظيف الأسنان») بدل «التصرّف بلطف».",
            ru: "Для двух- и трёхлеток лучше всего одно–три задания, одно из них лёгкое, – так первая звезда появится скоро. Что-то конкретное («чистить зубы»), а не «вести себя хорошо».",
          })}
        </p>
        {board.tasks.length < MAX_TASKS && (
          <div
            className="rw-chips"
            role="group"
            aria-label={t({
              de: "Aufgabe dazu",
              en: "Add a task",
              zh: "添加任务",
              hi: "काम जोड़ें",
              es: "Añadir tarea",
              ar: "إضافة مهمة",
              ru: "Добавить задание",
            })}
          >
            {unused.map((task) => (
              <button key={task.id} type="button" onClick={() => addTask(taskFromCatalog(task.id))}>
                + <ItemPic item={{ emoji: task.emoji, catalog: task.id }} /> {t(task.label)}
              </button>
            ))}
            <button type="button" onClick={() => addTask({ id: newId(), emoji: "⭐", label: "" })}>
              + ✏️ {t({ de: "Eigene Aufgabe", en: "Own task", zh: "自定义任务", hi: "अपना काम", es: "Tarea propia", ar: "مهمة خاصة", ru: "Своё задание" })}
            </button>
          </div>
        )}
      </SettingsGroup>

      {(board.kind === "week" || board.kind === "month") && (
        <SettingsGroup title={t({ de: "Tage", en: "Days", zh: "哪几天", hi: "दिन", es: "Días", ar: "الأيام", ru: "Дни" })}>
          <div
            className="rw-chips"
            role="group"
            aria-label={t({ de: "Wochentage", en: "Weekdays", zh: "星期", hi: "हफ़्ते के दिन", es: "Días de la semana", ar: "أيام الأسبوع", ru: "Дни недели" })}
          >
            {t(DAY_NAMES).map((name, i) => {
              const on = board.days.includes(i);
              return (
                <button
                  key={name}
                  type="button"
                  className={on ? "selected" : undefined}
                  aria-pressed={on}
                  // At least one day stays.
                  onClick={() => onChange({ days: on ? (board.days.length > 1 ? board.days.filter((d) => d !== i) : board.days) : [...board.days, i].sort() })}
                >
                  {name}
                </button>
              );
            })}
          </div>
          <p className="setting-note">
            {t({
              de: "Zum Beispiel nur Kita-Tage, oder ohne die Tage bei Oma. Die Woche beginnt jeden Montag von selbst neu, der Monat an jedem Ersten.",
              en: "For example only daycare days, or without the days at Grandma’s. The week starts afresh by itself every Monday, the month on the first.",
              zh: "例如只选上幼儿园的日子，或去掉在奶奶家的日子。每周一自动开始新的一周，每月一号开始新的一个月。",
              hi: "जैसे सिर्फ़ प्लेस्कूल वाले दिन, या दादी के घर वाले दिनों के बिना। हफ़्ता हर सोमवार अपने-आप नए सिरे से शुरू होता है, महीना हर पहली तारीख़ को।",
              es: "Por ejemplo, solo los días de guardería, o sin los días en casa de la abuela. La semana empieza de nuevo cada lunes, y el mes, cada día uno.",
              ar: "مثلًا أيام الحضانة فقط، أو دون الأيام عند الجدّة. يبدأ الأسبوع من جديد تلقائيًا كل يوم اثنين، والشهر في أوله.",
              ru: "Например, только дни садика или без дней у бабушки. Неделя сама начинается заново каждый понедельник, месяц – каждое первое число.",
            })}
          </p>
        </SettingsGroup>
      )}

      <SettingsGroup
        title={t({
          de: "Ziel und Belohnung",
          en: "Goal and reward",
          zh: "目标和奖励",
          hi: "लक्ष्य और इनाम",
          es: "Meta y premio",
          ar: "الهدف والمكافأة",
          ru: "Цель и награда",
        })}
      >
        {board.kind === "collect" && (
          <Choice
            label={t({
              de: "Felder bis zur Belohnung",
              en: "Fields to the reward",
              zh: "到奖励的格数",
              hi: "इनाम तक खाने",
              es: "Casillas hasta el premio",
              ar: "الخانات حتى المكافأة",
              ru: "Клеток до награды",
            })}
            value={String(board.goal)}
            onChange={(goal) => onChange({ goal: Number(goal) })}
            options={COLLECT_GOALS.map((n) => ({ value: String(n), label: String(n) }))}
          />
        )}
        {(board.kind === "week" || board.kind === "month") && fields > 1 && (
          <Slider
            label={
              board.kind === "week"
                ? t({
                    de: "Sterne in der Woche bis zur Belohnung",
                    en: "Stars in a week for the reward",
                    zh: "一周内拿到奖励所需的星星",
                    hi: "इनाम के लिए हफ़्ते में सितारे",
                    es: "Estrellas por semana hasta el premio",
                    ar: "نجوم الأسبوع حتى المكافأة",
                    ru: "Звёзд за неделю до награды",
                  })
                : t({
                    de: "Sterne im Monat bis zur Belohnung",
                    en: "Stars in a month for the reward",
                    zh: "一个月内拿到奖励所需的星星",
                    hi: "इनाम के लिए महीने में सितारे",
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
            onChange={(goal) => onChange({ goal })}
          />
        )}
        {board.kind === "day" && (
          <p className="setting-note">
            {t({
              de: "Gefeiert wird, wenn alle Aufgaben des Tages ihren Stern haben.",
              en: "There’s a party when every task of the day has its star.",
              zh: "当天所有任务都得到星星时就庆祝。",
              hi: "जब दिन के सभी कामों को सितारा मिल जाए, तब जश्न होता है।",
              es: "Se celebra cuando todas las tareas del día tienen su estrella.",
              ar: "نحتفل عندما تحصل كل مهام اليوم على نجمتها.",
              ru: "Праздник – когда у всех заданий дня есть звезда.",
            })}
          </p>
        )}
        <div
          className="rw-chips"
          role="group"
          aria-label={t({ de: "Belohnung", en: "Reward", zh: "奖励", hi: "इनाम", es: "Premio", ar: "المكافأة", ru: "Награда" })}
        >
          <button type="button" className={board.reward ? undefined : "selected"} aria-pressed={!board.reward} onClick={() => onChange({ reward: null })}>
            🎉{" "}
            {t({
              de: "Nur zusammen freuen",
              en: "Just celebrate together",
              zh: "一起开心就好",
              hi: "बस साथ में खुशी मनाना",
              es: "Solo alegrarse en familia",
              ar: "الفرح معًا فقط",
              ru: "Просто порадоваться вместе",
            })}
          </button>
          {REWARDS.map((reward) => {
            const on = board.reward?.catalog === reward.id;
            return (
              <button
                key={reward.id}
                type="button"
                className={on ? "selected" : undefined}
                aria-pressed={on}
                onClick={() => onChange({ reward: rewardFromCatalog(reward.id) })}
              >
                <ItemPic item={{ emoji: reward.emoji, catalog: reward.id }} kind="reward" /> {t(reward.label)}
              </button>
            );
          })}
        </div>
        {board.reward && (
          <div className="rw-task-edit">
            <input
              type="text"
              className="rw-emoji-input"
              value={board.reward.emoji}
              maxLength={8}
              aria-label={t({
                de: "Bild der Belohnung (Emoji)",
                en: "Reward picture (emoji)",
                zh: "奖励图片（表情符号）",
                hi: "इनाम की तस्वीर (इमोजी)",
                es: "Imagen del premio (emoji)",
                ar: "صورة المكافأة (إيموجي)",
                ru: "Картинка награды (эмодзи)",
              })}
              onChange={(e) => onChange({ reward: { ...board.reward, emoji: e.target.value } })}
            />
            <input
              type="text"
              className="rw-label-input"
              value={board.reward.label ?? ""}
              maxLength={32}
              placeholder={rewardLabel(board.reward)}
              aria-label={t({
                de: "Eigene Worte für die Belohnung",
                en: "Own words for the reward",
                zh: "奖励的自定义文字",
                hi: "इनाम के लिए अपने शब्द",
                es: "Palabras propias para el premio",
                ar: "كلمات خاصة للمكافأة",
                ru: "Свои слова для награды",
              })}
              onChange={(e) => onChange({ reward: { emoji: board.reward?.emoji ?? "🎁", catalog: board.reward?.catalog, label: e.target.value || undefined } })}
            />
          </div>
        )}
        <p className="setting-note">
          {t({
            de: "Am meisten freuen sich Kleine über Zeit zusammen: Spielplatz, ein Buch, backen. Die Belohnung kommt bald – bei Zweijährigen lieber nach wenigen Sternen als nach einer ganzen Woche.",
            en: "Little ones love time together most: the playground, a book, baking. The reward comes soon – for two-year-olds better after a few stars than after a whole week.",
            zh: "小孩子最喜欢一起度过的时光：游乐场、一本书、一起烤点心。奖励要来得快——两岁的孩子最好几颗星就兑现，而不是等一整周。",
            hi: "छोटे बच्चे सबसे ज़्यादा साथ बिताए समय से खुश होते हैं: पार्क, एक किताब, साथ में केक बनाना। इनाम जल्दी आए – दो साल के बच्चों के लिए पूरे हफ़्ते के बजाय कुछ सितारों के बाद।",
            es: "Lo que más alegra a los peques es el tiempo en familia: el parque, un cuento, hornear. El premio llega pronto: con dos años, mejor tras pocas estrellas que tras una semana entera.",
            ar: "أكثر ما يُفرح الصغار هو الوقت معًا: حديقة الألعاب، كتاب، الخَبز. تأتي المكافأة قريبًا – للطفل في عمر السنتين بعد نجوم قليلة أفضل من أسبوع كامل.",
            ru: "Больше всего малыши радуются времени вместе: площадка, книжка, выпечка. Награда приходит скоро – у двухлеток лучше после нескольких звёзд, чем после целой недели.",
          })}
        </p>
      </SettingsGroup>

      <SettingsGroup title={t({ de: "Aussehen", en: "Look", zh: "外观", hi: "रूप", es: "Aspecto", ar: "المظهر", ru: "Внешний вид" })}>
        <Choice
          label={t({
            de: "Was kommt ins Feld?",
            en: "What goes in a field?",
            zh: "格子里放什么？",
            hi: "खाने में क्या आए?",
            es: "¿Qué va en la casilla?",
            ar: "ماذا يوضع في الخانة؟",
            ru: "Что ставить в клетку?",
          })}
          value={board.mark}
          onChange={(mark) => onChange({ mark })}
          options={MARKS.map((m) => ({ value: m.id, label: `${m.emoji} ${t(m.label)}` }))}
        />
        <Choice
          label={t({ de: "Farben", en: "Colours", zh: "颜色", hi: "रंग", es: "Colores", ar: "الألوان", ru: "Цвета" })}
          value={board.theme}
          onChange={(theme) => onChange({ theme })}
          options={THEMES.map((th) => ({ value: th.id, label: t(th.label) }))}
        />
      </SettingsGroup>

      <SettingsGroup
        title={t({ de: "Neu anfangen", en: "Start over", zh: "重新开始", hi: "फिर से शुरू करें", es: "Empezar de nuevo", ar: "البدء من جديد", ru: "Начать заново" })}
      >
        <p className="setting-note">
          {board.kind === "collect"
            ? t({
                de: "Leert den Weg für die nächste Runde. Sterne verschwinden sonst nie – auch nicht nach einem schlechten Tag.",
                en: "Clears the path for the next round. Otherwise stars never disappear – not even after a bad day.",
                zh: "清空这条路，开始下一轮。除此之外，星星永远不会消失——哪怕某天过得不顺。",
                hi: "अगले दौर के लिए रास्ता खाली करता है। वरना सितारे कभी नहीं हटते – बुरे दिन के बाद भी नहीं।",
                es: "Vacía el camino para la siguiente ronda. Por lo demás, las estrellas nunca desaparecen, ni siquiera tras un mal día.",
                ar: "يُفرغ الطريق للجولة التالية. وفيما عدا ذلك لا تختفي النجوم أبدًا – ولا حتى بعد يوم سيئ.",
                ru: "Очищает дорожку для следующего круга. В остальном звёзды никогда не исчезают – даже после плохого дня.",
              })
            : t({
                de: "Nimmt die Sterne dieser Woche weg, z. B. nach dem Ausprobieren. Sterne verschwinden sonst nie – auch nicht nach einem schlechten Tag.",
                en: "Removes this week’s stars, e.g. after trying it out. Otherwise stars never disappear – not even after a bad day.",
                zh: "清除本周的星星，例如试用之后。除此之外，星星永远不会消失——哪怕某天过得不顺。",
                hi: "इस हफ़्ते के सितारे हटाता है, जैसे आज़माने के बाद। वरना सितारे कभी नहीं हटते – बुरे दिन के बाद भी नहीं।",
                es: "Quita las estrellas de esta semana, p. ej., después de probar. Por lo demás, las estrellas nunca desaparecen, ni siquiera tras un mal día.",
                ar: "يزيل نجوم هذا الأسبوع، مثلًا بعد التجربة. وفيما عدا ذلك لا تختفي النجوم أبدًا – ولا حتى بعد يوم سيئ.",
                ru: "Убирает звёзды этой недели, например после пробы. В остальном звёзды никогда не исчезают – даже после плохого дня.",
              })}
        </p>
        <div className="rw-chips">
          <button
            type="button"
            onClick={() =>
              window.confirm(
                t({
                  de: "Alle Sterne dieser Tafel wegnehmen?",
                  en: "Remove all stars from this chart?",
                  zh: "清除这张奖励表上的所有星星吗？",
                  hi: "इस चार्ट के सभी सितारे हटाएँ?",
                  es: "¿Quitar todas las estrellas de esta tabla?",
                  ar: "إزالة كل نجوم هذه اللوحة؟",
                  ru: "Убрать все звёзды из этой таблицы?",
                }),
              ) && onStartOver()
            }
          >
            🔄{" "}
            {t({
              de: "Sterne wegnehmen und neu anfangen",
              en: "Remove stars and start over",
              zh: "清除星星，重新开始",
              hi: "सितारे हटाकर फिर से शुरू करें",
              es: "Quitar las estrellas y empezar de nuevo",
              ar: "إزالة النجوم والبدء من جديد",
              ru: "Убрать звёзды и начать заново",
            })}
          </button>
          {onRemove && (
            <button
              type="button"
              onClick={() =>
                window.confirm(
                  t({
                    de: "Diese Tafel ganz löschen?",
                    en: "Delete this chart completely?",
                    zh: "彻底删除这张奖励表吗？",
                    hi: "यह चार्ट पूरी तरह मिटाएँ?",
                    es: "¿Borrar esta tabla por completo?",
                    ar: "حذف هذه اللوحة نهائيًا؟",
                    ru: "Удалить эту таблицу полностью?",
                  }),
                ) && onRemove()
              }
            >
              🗑️{" "}
              {t({
                de: "Diese Tafel löschen",
                en: "Delete this chart",
                zh: "删除这张奖励表",
                hi: "यह चार्ट मिटाएँ",
                es: "Borrar esta tabla",
                ar: "حذف هذه اللوحة",
                ru: "Удалить эту таблицу",
              })}
            </button>
          )}
        </div>
      </SettingsGroup>
    </section>
  );
}
