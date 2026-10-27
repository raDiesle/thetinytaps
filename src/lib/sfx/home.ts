// Sounds of home, people and nature: water, kitchen, bathroom, toys, weather.

import { PENTATONIC, hiss, note, voice } from "./core";

/** Raindrops: soft high plinks. */
export function playDrops() {
  [0, 0.22, 0.38, 0.6, 0.75].forEach((delay, i) =>
    note({ from: PENTATONIC[(i * 3) % PENTATONIC.length] * 2, duration: 0.15, type: "sine", volume: 0.12, delay }),
  );
}

/** "Mampf, mampf" – three soft crunchy bites. */
export function playMunch() {
  [0, 0.28, 0.56].forEach((delay) => {
    note({ from: 260, to: 140, duration: 0.1, type: "square", volume: 0.1, lowpass: 700, delay });
    note({ from: 900, to: 500, duration: 0.06, type: "triangle", volume: 0.08, delay: delay + 0.04 });
  });
}

/** "Bäh!" – a short, falling grumble, funny rather than sad. */
export function playYuck() {
  note({ from: 330, to: 200, duration: 0.35, type: "sawtooth", volume: 0.12, lowpass: 900 });
}

/** "Wuuusch!" – the toilet flushes: rushing water that swirls down, and a gurgle at the end. */
export function playFlush() {
  hiss({ from: 500, to: 1600, duration: 0.7, volume: 0.35, q: 0.8 });
  hiss({ from: 1600, to: 300, duration: 1.1, volume: 0.3, delay: 0.6, q: 0.8 });
  [1.4, 1.55, 1.7].forEach((delay, i) => note({ from: 220 + i * 60, to: 520 + i * 80, duration: 0.09, type: "sine", volume: 0.18, delay }));
}

/** "Plitsch, plätscher" – a little trickle into the potty: soft rushing and quick, falling drops. */
export function playTrickle() {
  hiss({ from: 2200, to: 1500, duration: 1.4, volume: 0.12, q: 1.5 });
  for (let i = 0; i < 10; i++) note({ from: 1500 - (i % 4) * 150, to: 1100 - (i % 4) * 120, duration: 0.06, type: "sine", volume: 0.08, delay: i * 0.13 });
}

/** "Ratsch!" – toilet paper torn off the roll. */
export function playRip() {
  hiss({ from: 3000, to: 1800, duration: 0.18, volume: 0.25, q: 1.2 });
  hiss({ from: 2400, to: 1200, duration: 0.12, volume: 0.2, delay: 0.16, q: 1.2 });
}

/** "Ssssss!" – warm air from a hair dryer, with the soft hum of its motor. */
export function playBlow() {
  hiss({ from: 1400, to: 1900, duration: 1.3, volume: 0.22, q: 0.6 });
  note({ from: 180, to: 200, duration: 1.2, type: "sawtooth", volume: 0.05, lowpass: 500 });
}

/** "Schrubb, schrubb!" – a toothbrush going back and forth. */
export function playScrub() {
  for (let i = 0; i < 6; i++) hiss({ from: i % 2 ? 3200 : 2400, duration: 0.13, volume: 0.2, delay: i * 0.17, q: 2 });
}

/** "Plitsch, platsch!" – splashing water, with a few drops after. */
export function playSplash() {
  [0, 0.3].forEach((delay) => hiss({ from: 1800, to: 500, duration: 0.35, volume: 0.3, delay, q: 0.9 }));
  [0.65, 0.8, 0.92].forEach((delay, i) => note({ from: PENTATONIC[(i * 2 + 3) % PENTATONIC.length] * 2, duration: 0.12, type: "sine", volume: 0.1, delay }));
}

/** "Tick, tack!" – a clock, high and low in turn. */
export function playTick() {
  [0, 0.4, 0.8, 1.2].forEach((delay, i) => note({ from: i % 2 ? 1300 : 1900, duration: 0.04, type: "square", volume: 0.07, lowpass: 3000, delay }));
}

/** "Hihihi!" – a child giggling: quick little notes that hop and fall. */
export function playGiggle() {
  [0, 0.13, 0.26, 0.39, 0.52].forEach((delay, i) => note({ from: 880 - i * 40, to: 1180 - i * 50, duration: 0.09, type: "triangle", volume: 0.16, delay }));
}

/** "Quietsch, quietsch!" – a swing's chain creaking forward and back. */
export function playCreak() {
  [0, 0.6].forEach((delay) => {
    note({ from: 520, to: 880, duration: 0.22, type: "sawtooth", volume: 0.05, lowpass: 1800, delay });
    note({ from: 820, to: 560, duration: 0.2, type: "sawtooth", volume: 0.04, lowpass: 1800, delay: delay + 0.24 });
  });
}

/** "Rauschel" – wind in the leaves of a tree: soft high noise swelling and fading. */
export function playLeaves() {
  [0, 0.35, 0.7].forEach((delay, i) => hiss({ from: 2600 + i * 400, to: 3600, duration: 0.6, volume: 0.1, delay, q: 0.8 }));
}

/** "Plopp" – something soft drops into a basket. */
export function playPlop() {
  note({ from: 260, to: 90, duration: 0.2, type: "sine", volume: 0.3 });
}

/** "Tock!" – wood knocking on wood; a higher `pitch` for small things. */
export function playKnock(pitch = 700) {
  note({ from: pitch, to: pitch * 0.5, duration: 0.08, type: "triangle", volume: 0.3 });
  note({ from: 160, to: 70, duration: 0.12, type: "sine", volume: 0.25 });
}

/** "Plumps" – something soft or hollow falls over, like a paper roll or a carton. */
export function playThump() {
  note({ from: 150, to: 55, duration: 0.22, type: "sine", volume: 0.4 });
  hiss({ from: 700, to: 300, duration: 0.15, volume: 0.12, q: 0.7 });
}

/** "Klong!" – a tin or a bottle hits something. */
export function playClonk() {
  note({ from: 640, to: 600, duration: 0.45, type: "triangle", volume: 0.16 });
  note({ from: 1710, duration: 0.3, type: "sine", volume: 0.06 });
  note({ from: 140, to: 70, duration: 0.1, type: "sine", volume: 0.2 });
}

/** "Rassel" – cereal shaking in its box as it falls over. */
export function playRustle() {
  for (let i = 0; i < 5; i++) hiss({ from: 4200, duration: 0.08, volume: 0.12, delay: i * 0.06, q: 1.5 });
  note({ from: 140, to: 60, duration: 0.2, type: "sine", volume: 0.3, delay: 0.05 });
}

/** "Fiiiiep!" – a whistling kettle: steam hisses, then the whistle rises and wobbles. */
export function playKettle() {
  hiss({ from: 2500, to: 3200, duration: 1.4, volume: 0.1, q: 1.2 });
  for (let i = 0; i < 6; i++) note({ from: 1180 + i * 40, to: 1240 + i * 40, duration: 0.2, type: "sine", volume: 0.1, delay: 0.3 + i * 0.18 });
  note({ from: 1400, to: 1480, duration: 0.5, type: "sine", volume: 0.12, delay: 1.38 });
}

/** "Brutzel, brutzel!" – an egg sizzling in the pan: crackling hiss with tiny pops. */
export function playSizzle() {
  hiss({ from: 5000, to: 4200, duration: 1.3, volume: 0.12, q: 0.7 });
  for (let i = 0; i < 9; i++)
    note({ from: 2600 + (i % 3) * 400, to: 1800, duration: 0.03, type: "triangle", volume: 0.07, delay: 0.1 + i * 0.13 + (i % 2) * 0.04 });
}

/** "Knack!" – an egg cracked on the rim of a bowl: a dry snap, then the egg plops in. */
export function playCrack() {
  note({ from: 2400, to: 1200, duration: 0.04, type: "square", volume: 0.12, lowpass: 5000 });
  hiss({ from: 3000, duration: 0.05, volume: 0.2, q: 2 });
  note({ from: 300, to: 110, duration: 0.18, type: "sine", volume: 0.25, delay: 0.22 });
}

/** "Wrrrrr!" – a hand mixer whirring, rising as it speeds up and falling as it stops. */
export function playWhirr() {
  note({ from: 160, to: 260, duration: 0.6, type: "sawtooth", volume: 0.08, lowpass: 900 });
  note({ from: 320, to: 520, duration: 0.6, type: "square", volume: 0.03, lowpass: 1400 });
  hiss({ from: 1800, to: 2600, duration: 0.6, volume: 0.06, q: 1 });
}

/** "Gluck, gluck" – milk poured from a bottle. */
export function playGlug() {
  [0, 0.2, 0.38].forEach((delay, i) => note({ from: 260 + i * 40, to: 520 + i * 60, duration: 0.12, type: "sine", volume: 0.22, delay }));
  hiss({ from: 900, to: 700, duration: 0.6, volume: 0.06, q: 0.8 });
}

/** "Ffffff" – a child blowing: a soft breath of air that fades. */
export function playPuff() {
  hiss({ from: 1300, to: 800, duration: 0.6, volume: 0.2, q: 0.6 });
}

/** "Knirsch, knirsch" – footsteps or a shovel in fresh snow: short, dry, muffled crunches. */
export function playCrunch() {
  for (let i = 0; i < 4; i++) {
    hiss({ from: 1800, to: 900, duration: 0.14, volume: 0.22, delay: i * 0.32, q: 0.8 });
    hiss({ from: 3600, duration: 0.06, volume: 0.08, delay: i * 0.32 + 0.03, q: 2 });
  }
}

/** "Kling-kling" – sleigh bells jingling in a quick rhythm over the swish of the runners. */
export function playSleigh() {
  hiss({ from: 2500, to: 1200, duration: 1.4, volume: 0.06, q: 0.6 });
  for (let i = 0; i < 8; i++) {
    const delay = i * 0.17;
    note({ from: 2350, to: 2300, duration: 0.12, type: "sine", volume: 0.09, delay });
    note({ from: 3140, to: 3100, duration: 0.1, type: "triangle", volume: 0.04, delay: delay + 0.02 });
  }
}

/** "Knister, knack" – a fire crackling: small random pops over a soft roar. */
export function playCrackle() {
  hiss({ from: 400, to: 250, duration: 1.4, volume: 0.1, q: 0.5 });
  for (let i = 0; i < 10; i++) hiss({ from: 2000 + Math.random() * 3000, duration: 0.03, volume: 0.2, delay: Math.random() * 1.3, q: 3 });
}

/** "Uaaah!" – a sleepy yawn: a soft voice that rises a little, then sinks slowly. */
export function playYawn() {
  note({ from: 330, to: 440, duration: 0.35, type: "triangle", volume: 0.14, lowpass: 900 });
  note({ from: 440, to: 220, duration: 1, type: "triangle", volume: 0.14, lowpass: 900, delay: 0.3 });
}

/** "Bumbum, bumbum" – a heart heard through the stethoscope: two soft, low thumps, twice. */
export function playHeartbeat() {
  [0, 0.75].forEach((delay) => {
    note({ from: 70, to: 45, duration: 0.18, type: "sine", volume: 0.55, delay });
    note({ from: 62, to: 40, duration: 0.16, type: "sine", volume: 0.4, delay: delay + 0.22 });
  });
}

/** "Wusch, wusch, schleuder!" – a washing machine: water sloshing round in the drum, the motor rising into a short spin. */
export function playWash() {
  [0, 0.55, 1.1].forEach((delay) => hiss({ from: 600, to: 1500, duration: 0.5, volume: 0.22, delay, q: 0.9 }));
  note({ from: 70, to: 160, duration: 2.2, type: "sawtooth", volume: 0.07, lowpass: 400 });
  hiss({ from: 900, to: 2400, duration: 0.8, volume: 0.14, delay: 1.5, q: 1.2 });
}

/** "Wäää, wäää!" – a small child crying: three sobbing wails that fall, a quick breath in between. */
export function playCry() {
  [0, 0.62, 1.24].forEach((delay, i) => {
    const top = 640 - i * 30;
    note({ from: top, to: top * 0.72, duration: 0.5, type: "sawtooth", volume: 0.1, lowpass: 1500, delay });
    note({ from: top * 2, to: top * 1.44, duration: 0.5, type: "triangle", volume: 0.05, delay });
    hiss({ from: 1600, to: 2400, duration: 0.1, volume: 0.06, delay: delay + 0.5, q: 1.5 });
  });
}

/** "Hahaha!" – a child laughing: bright little bursts that hop down, a little different every time. */
export function playLaugh() {
  const base = 560 + Math.random() * 80;
  [0, 0.15, 0.3, 0.45, 0.62].forEach((delay, i) => {
    const pitch = base * (1 - i * 0.05);
    note({ from: pitch * 1.15, to: pitch, duration: 0.11, type: "sawtooth", volume: 0.09, lowpass: 2200, delay });
    note({ from: pitch * 2.3, to: pitch * 2, duration: 0.11, type: "triangle", volume: 0.05, delay });
    hiss({ from: 2000, duration: 0.07, volume: 0.04, delay: delay + 0.02, q: 1 });
  });
}

/** „Mmmh!“ – a child humming because something tastes good: a closed-mouth hum that rises and falls. */
export function playYum() {
  voice({ pitch: [330, 420, 440, 340], vowels: [[260, 900]], duration: 0.8, volume: 0.6 });
}

/** „Aua!“ – a small child that got hurt: a high "a" gliding into "u", then a falling "a". */
export function playAua() {
  const [a, u]: [number, number][] = [
    [1000, 1650],
    [460, 1000],
  ];
  voice({ pitch: [430, 560, 520, 470], vowels: [a, a, u, u], duration: 0.38, volume: 0.9 });
  voice({ pitch: [500, 420, 330], vowels: [a, a, a], duration: 0.42, volume: 0.9, delay: 0.36 });
}

/** "Krach!" – something breaks: a hard bang, then pieces clattering down. */
export function playCrash() {
  note({ from: 160, to: 45, duration: 0.35, type: "sine", volume: 0.45 });
  hiss({ from: 2600, to: 600, duration: 0.45, volume: 0.35, q: 0.5 });
  [0.12, 0.2, 0.31, 0.38, 0.5, 0.63].forEach((delay, i) => {
    const pitch = 900 + ((i * 377) % 700);
    note({ from: pitch, to: pitch * 0.6, duration: 0.07, type: "triangle", volume: 0.18, delay });
  });
}
