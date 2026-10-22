import { useMemo } from "react";
import type { LevelProps } from "./level";
import { cameraOn, timeline } from "./machineKit";
import { MachineStage, TapHint } from "./MachineStage";

// Placeholder until the machine is built.
function build() {
  const { at, sorted } = timeline();
  at(1, { done: true });
  return { events: sorted(), duration: 1, cameraTarget: () => cameraOn(1600, 0) };
}

export function BuildingLevel(props: LevelProps) {
  const machine = useMemo(build, []);
  return (
    <MachineStage machine={machine} label="building" {...props}>
      {(t) => <TapHint t={t} x={800} y={450} />}
    </MachineStage>
  );
}
