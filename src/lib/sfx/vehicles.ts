// Vehicles and machines: engines, horns, sirens, bells, rockets, robots, the lift.

import { hiss, note } from "./core";

/** A low "brumm brumm" for diggers and trucks. */
export function playEngine() {
  note({ from: 60, to: 95, duration: 0.6, type: "sawtooth", volume: 0.35, lowpass: 400 });
  note({ from: 95, to: 55, duration: 0.8, type: "sawtooth", volume: 0.35, lowpass: 400, delay: 0.5 });
}

/** Three short beeps, like a truck backing up. */
export function playBeeps() {
  [0, 0.35, 0.7].forEach((delay) => note({ from: 988, duration: 0.2, type: "square", volume: 0.08, delay }));
}

/** A jackhammer: fast, buzzy pulses. */
export function playRattle() {
  for (let i = 0; i < 14; i++) note({ from: 140, duration: 0.05, type: "square", volume: 0.12, lowpass: 900, delay: i * 0.07 });
}

/** Helicopter blades: slow, low thumps. */
export function playRotor() {
  for (let i = 0; i < 10; i++) note({ from: 90, to: 60, duration: 0.1, type: "sawtooth", volume: 0.3, lowpass: 300, delay: i * 0.12 });
}

/** A low rumble of something heavy rolling or tumbling. */
export function playRumble() {
  [0, 0.2, 0.42, 0.6].forEach((delay, i) => note({ from: 110 - i * 10, to: 70, duration: 0.18, type: "triangle", volume: 0.35, delay }));
}

/** A rising hum, like a light switching on. */
export function playHum() {
  note({ from: 220, to: 660, duration: 0.5, type: "sine", volume: 0.2 });
  note({ from: 880, duration: 0.4, type: "sine", volume: 0.12, delay: 0.45 });
}

/** Ritsch, ratsch: a saw going back and forth. */
export function playSaw() {
  [0, 0.25, 0.5, 0.75].forEach((delay, i) =>
    note({ from: i % 2 ? 520 : 300, to: i % 2 ? 300 : 520, duration: 0.2, type: "sawtooth", volume: 0.08, lowpass: 1800, delay }),
  );
}

/** "Tüt, tüt!" – a car horn, two notes at once. */
export function playHonk() {
  [0, 0.3].forEach((delay) => {
    note({ from: 392, duration: 0.22, type: "square", volume: 0.1, lowpass: 1400, delay });
    note({ from: 494, duration: 0.22, type: "square", volume: 0.08, lowpass: 1400, delay });
  });
}

/** "Tschu-tschu!" – a steam whistle: two soft chords, the second one longer. */
export function playWhistle() {
  [
    { delay: 0, duration: 0.3 },
    { delay: 0.4, duration: 0.8 },
  ].forEach(({ delay, duration }) => {
    note({ from: 587, to: 622, duration, type: "triangle", volume: 0.16, delay });
    note({ from: 740, to: 784, duration, type: "triangle", volume: 0.12, delay });
    note({ from: 880, to: 932, duration, type: "sine", volume: 0.08, delay });
  });
}

/** "Tatütata" – two alternating siren notes, soft enough for small ears. */
export function playSiren() {
  [0, 0.4, 0.8, 1.2].forEach((delay, i) => note({ from: i % 2 ? 587 : 440, duration: 0.36, type: "triangle", volume: 0.18, delay }));
}

/** "Bim, bam" – church bells, low and ringing out. */
export function playBells() {
  [0, 0.6, 1.2].forEach((delay, i) => {
    const base = i % 2 ? 330 : 392;
    note({ from: base, duration: 1.2, type: "sine", volume: 0.25, delay });
    note({ from: base * 2.4, duration: 0.6, type: "sine", volume: 0.06, delay });
  });
}

/** "Kling, kling" – a bicycle bell. */
export function playRing() {
  [0, 0.16].forEach((delay) => {
    note({ from: 2200, duration: 0.3, type: "sine", volume: 0.12, delay });
    note({ from: 3300, duration: 0.2, type: "sine", volume: 0.05, delay });
  });
}

/** "Ping!" – a submarine's sonar, with a soft echo. */
export function playPing() {
  note({ from: 1480, duration: 0.6, type: "sine", volume: 0.22 });
  note({ from: 1480, duration: 0.5, type: "sine", volume: 0.07, delay: 0.45 });
}

/** Three hammer knocks. */
export function playKnocks() {
  [0, 0.18, 0.36].forEach((delay) => note({ from: 220, to: 120, duration: 0.09, type: "triangle", volume: 0.4, delay }));
}

/** "Wuuusch!" – a rocket lifts off: a deep rumble and a rush that climbs higher and higher. */
export function playLaunch() {
  note({ from: 70, to: 48, duration: 1.4, type: "sawtooth", volume: 0.3, lowpass: 300 });
  note({ from: 160, to: 1100, duration: 1.2, type: "triangle", volume: 0.12, delay: 0.25 });
  note({ from: 320, to: 1800, duration: 1, type: "sine", volume: 0.06, delay: 0.45 });
}

/** "Wiu, wiu!" – the ufo's beam: a note that slides up and down three times. */
export function playBeam() {
  [0, 0.36, 0.72].forEach((delay, i) => {
    note({ from: 500 + i * 60, to: 1100 + i * 60, duration: 0.18, type: "sine", volume: 0.15, delay });
    note({ from: 1100 + i * 60, to: 600 + i * 60, duration: 0.16, type: "sine", volume: 0.15, delay: delay + 0.18 });
  });
}

/** "Bip, bop, bip!" – a robot talking in short square beeps. */
export function playRobot() {
  [880, 660, 990, 520].forEach((freq, i) => note({ from: freq, duration: 0.1, type: "square", volume: 0.07, lowpass: 2500, delay: i * 0.14 }));
}

/** "Bliep, blop!" – a little alien: a wobbly voice going up, down and up again. */
export function playAlien() {
  note({ from: 600, to: 1300, duration: 0.18, type: "triangle", volume: 0.16 });
  note({ from: 1100, to: 500, duration: 0.2, type: "triangle", volume: 0.16, delay: 0.22 });
  note({ from: 700, to: 1500, duration: 0.14, type: "triangle", volume: 0.14, delay: 0.46 });
}

/** "Rrrring!" – a fire station's alarm bell: fast, bright strokes. */
export function playAlarm() {
  for (let i = 0; i < 12; i++) {
    note({ from: 1320, duration: 0.09, type: "triangle", volume: 0.1, delay: i * 0.08 });
    note({ from: 2640, duration: 0.06, type: "sine", volume: 0.04, delay: i * 0.08 });
  }
}

/** "Ssssch" – sliding lift doors. */
export function playSlide() {
  hiss({ from: 900, to: 600, duration: 0.5, volume: 0.08, q: 0.7 });
}

/** "Wuuumm" – a lift humming up or down for `seconds`. */
export function playLift(seconds: number, up: boolean) {
  note({ from: up ? 110 : 140, to: up ? 140 : 110, duration: seconds, type: "triangle", volume: 0.18, lowpass: 500 });
}

/** "Tschu-tschu, tüüt!" – a train rolls in: rhythmic chuffs that slow down, then its two-tone horn. */
export function playTrain() {
  [0, 0.2, 0.42, 0.68].forEach((delay, i) => hiss({ from: 1100, to: 650, duration: 0.15, volume: 0.28 - i * 0.04, delay, q: 1.2 }));
  [370, 466].forEach((from, i) => note({ from, duration: 0.7, type: "triangle", volume: i ? 0.12 : 0.16, delay: 1 }));
}

/** "Wuuuusch!" – a jet takes off: a deep roar that swells and rushes higher and higher. */
export function playJet() {
  hiss({ from: 350, to: 2600, duration: 1.8, volume: 0.3, q: 0.7 });
  note({ from: 80, to: 150, duration: 1.6, type: "sawtooth", volume: 0.12, lowpass: 500 });
}
