import { useState } from "react";

/** True on tablets and phones: every pointer is a finger. A touch laptop or an iPad with trackpad doesn't count. */
export function touchOnly() {
  return matchMedia("(any-pointer: coarse)").matches && !matchMedia("(any-pointer: fine)").matches;
}

/** False on a computer with only mouse or trackpad: no finger can reach the screen. */
export function hasTouch() {
  return matchMedia("(any-pointer: coarse)").matches;
}

export interface Device {
  touchOnly: boolean;
  hasTouch: boolean;
}

/**
 * How the child can play on this device, read once: options that need a
 * keyboard are hidden on tablets and phones, on-screen keys on plain computers.
 */
export function useDevice(): Device {
  const [device] = useState<Device>(() => ({ touchOnly: touchOnly(), hasTouch: hasTouch() }));
  return device;
}
