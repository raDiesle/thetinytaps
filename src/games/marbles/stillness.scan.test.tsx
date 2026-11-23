// Which parts of each machine still change from one frame to the next – a tool, not a check, run only when asked:
//   KETTEN_SCAN=1 bun test src/games/marbles/stillness.scan.test.tsx   (LEVELS=garden,building to pick, CTX=1 for context)
// Every machine is a pure function of its seconds, so it renders each level with a stand-in MachineStage at a moment and
// one frame later and lists the tags that differ. The lines after the end (duration + 4 s and + 20 s) are what never
// comes to rest – each one kept an old phone painting in every frame (perf, November 2026). The stand-in replaces
// MachineStage for the whole test process, so it is mocked inside the test, which runs only with KETTEN_SCAN.
import { mock, test } from "bun:test";
import type { ComponentProps, FunctionComponent, ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as real from "./MachineStage";
import type { LevelProps } from "./level";
import { VIEW_W } from "./level";

const g = globalThis as { __T?: number };
/** The stand-in: draws the machine at `__T` seconds, its back and front layers round it, with no clock, camera or tap. */
function Stand({ machine, back, front, children }: ComponentProps<typeof real.MachineStage>): ReactNode {
  const T = g.__T ?? 0;
  const cam = machine.cameraTarget(T);
  const seen = (x0: number, x1: number) => x1 >= cam - VIEW_W / 2 && x0 <= cam + 1.5 * VIEW_W;
  const b = typeof back === "function" ? back(T, seen) : back;
  const f = typeof front === "function" ? front(T, seen) : front;
  return (
    <div>
      {b?.map((l, i) => (
        <svg key={`b${i}`}>{l.content}</svg>
      ))}
      <svg>{children(T, seen)}</svg>
      {f?.map((l, i) => (
        <svg key={`f${i}`}>{l.content}</svg>
      ))}
    </div>
  );
}
const stand = () => mock.module("./MachineStage", () => ({ ...real, MachineStage: Stand }));

const LEVELS = (process.env.LEVELS ?? "machine,kitchen,garden,building,circus,space,light,bath,farm,night,tidy").split(",");
const noop = () => {};
/** Each machine's length in seconds (CLAUDE.md, How long a level lasts). */
const DURATIONS: Record<string, number> = {
  machine: 59.4,
  kitchen: 60.1,
  garden: 61.3,
  building: 60.1,
  circus: 59.2,
  space: 60.6,
  light: 59.3,
  bath: 58.9,
  farm: 59.5,
  night: 61.3,
  tidy: 59.5,
};
test.skipIf(!process.env.KETTEN_SCAN)(
  "scan: what still changes from frame to frame",
  async () => {
    stand();
    for (const id of LEVELS) {
      const name = `${id[0].toUpperCase()}${id.slice(1)}Level`;
      const mod = await import(`./${name}`);
      const Level = mod[name] as FunctionComponent<LevelProps>;
      const props: LevelProps = { sound: noop, say: noop, onDone: noop, onGoal: noop, watch: false };
      const at = (T: number) => {
        g.__T = T;
        return renderToStaticMarkup(<Level {...props} />).match(/<[^>]+>/g) ?? [];
      };
      const D = DURATIONS[id] ?? 60;
      const lines: string[] = [];
      for (const T of [0.3 * D, 0.55 * D, 0.8 * D, 0.97 * D, D + 4, D + 20]) {
        const a = at(T);
        const b = at(T + 1 / 60);
        const c = at(T + 0.5);
        if (a.length !== b.length) {
          lines.push(`  ${T.toFixed(1)}s: structure changes (${a.length} → ${b.length})`);
          if (process.env.CTX) {
            const nm = (x: string) => x.split(" ")[0];
            const i = a.findIndex((x, k) => nm(x) !== nm(b[k] ?? ""));
            lines.push(
              "  ctx: " +
                a
                  .slice(i - 4, i + 4)
                  .map((x) => x.slice(0, 100))
                  .join(" "),
            );
          }
          continue;
        }
        const diff = a.map((x, i) => (x !== b[i] && b[i] !== c[i] ? b[i] : null)).filter((x): x is string => !!x);
        if (process.env.CTX && T > D) {
          const i = a.findIndex((x, k) => x !== b[k]);
          if (i >= 0)
            lines.push(
              "  ctx: " +
                a
                  .slice(i - 3, i + 6)
                  .map((x) => x.slice(0, 90))
                  .join(" "),
            );
        }
        lines.push(
          `  ${T.toFixed(1)}s: ${diff.length}${
            diff.length
              ? ` | ${diff
                  .slice(0, 8)
                  .map((d) => d.slice(0, 110))
                  .join(" | ")}`
              : ""
          }`,
        );
      }
      console.log(`${id}\n${lines.join("\n")}`);
    }
  },
  120000,
);
