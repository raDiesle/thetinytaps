import { dayKey, weekOf, type Daytime, type WeekLog } from "./daytime";

const DAY_NAMES = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const SLOTS: { daytime: Daytime; icon: string; label: string }[] = [
  { daytime: "morning", icon: "☀️", label: "morgens" },
  { daytime: "evening", icon: "🌙", label: "abends" },
];

/**
 * The week from Monday to Sunday, a sun and a moon for every day. Each
 * brushing finished puts a star there; the one just earned pops in.
 */
export function Week({ log, today, now }: { log: WeekLog; today: Date; now: Daytime }) {
  const todayKey = dayKey(today);
  return (
    <ol className="teeth-week" aria-label="Diese Woche">
      {weekOf(today).map((day, i) => {
        const key = dayKey(day);
        const done = log[key] ?? [];
        return (
          <li key={key} className={`teeth-day${key === todayKey ? " today" : ""}`}>
            <span className="teeth-day-name">{DAY_NAMES[i]}</span>
            {SLOTS.map(({ daytime, icon, label }) => {
              const star = done.includes(daytime);
              const fresh = star && key === todayKey && daytime === now;
              return (
                <span
                  key={daytime}
                  className={`teeth-slot${star ? " star" : ""}${fresh ? " fresh" : ""}`}
                  aria-label={`${DAY_NAMES[i]} ${label}: ${star ? "geputzt" : "noch nicht"}`}
                >
                  {star ? "⭐" : icon}
                </span>
              );
            })}
          </li>
        );
      })}
    </ol>
  );
}
