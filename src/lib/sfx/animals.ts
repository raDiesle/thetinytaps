// Animal sounds.

import { hiss, note } from "./core";

/** A little bird's chirp. */
export function playTweet() {
  note({ from: 2000, to: 3400, duration: 0.12, type: "sine", volume: 0.15 });
  note({ from: 2000, to: 3400, duration: 0.12, type: "sine", volume: 0.15, delay: 0.16 });
  note({ from: 2400, to: 3800, duration: 0.14, type: "sine", volume: 0.15, delay: 0.32 });
}

/** "Quak, quak!" */
export function playQuack() {
  [0, 0.25].forEach((delay) => note({ from: 520, to: 340, duration: 0.16, type: "sawtooth", volume: 0.2, lowpass: 1200, delay }));
}

/** "Wau, wau!" */
export function playBark() {
  [0, 0.3].forEach((delay) => note({ from: 420, to: 180, duration: 0.14, type: "square", volume: 0.15, lowpass: 900, delay }));
}

/** A mouse's tiny squeak. */
export function playSqueak() {
  note({ from: 2800, to: 3600, duration: 0.08, type: "sine", volume: 0.12 });
  note({ from: 3000, to: 3800, duration: 0.08, type: "sine", volume: 0.12, delay: 0.12 });
}

/** Quick little sniffs, for the hedgehog. */
export function playSniff() {
  [0, 0.12, 0.24, 0.5].forEach((delay) => note({ from: 1400, to: 900, duration: 0.05, type: "square", volume: 0.06, lowpass: 2000, delay }));
}

/** A soft buzz of tiny wings. */
export function playBuzz() {
  for (let i = 0; i < 8; i++) note({ from: 210, to: 240, duration: 0.08, type: "sawtooth", volume: 0.07, lowpass: 700, delay: i * 0.09 });
}

/** "Gurr, gurr" – a pigeon. */
export function playCoo() {
  [0, 0.4].forEach((delay) => note({ from: 300, to: 220, duration: 0.3, type: "sine", volume: 0.3, lowpass: 800, delay }));
}

/** "Miau!" – rises and falls. */
export function playMeow() {
  note({ from: 600, to: 900, duration: 0.18, type: "triangle", volume: 0.2 });
  note({ from: 900, to: 520, duration: 0.35, type: "triangle", volume: 0.2, delay: 0.17 });
}

/** "Oink, oink!" – two short grunts. */
export function playOink() {
  [0, 0.28].forEach((delay) => note({ from: 260, to: 180, duration: 0.14, type: "square", volume: 0.12, lowpass: 700, delay }));
}

/** "Mäh!" – a bleat: a quick wobble of short notes. */
export function playBaa() {
  for (let i = 0; i < 6; i++) note({ from: i % 2 ? 560 : 500, to: 470, duration: 0.09, type: "sawtooth", volume: 0.14, lowpass: 1500, delay: i * 0.08 });
}

/** "Gack, gack, gaaack!" – a hen. */
export function playCluck() {
  [0, 0.18, 0.36].forEach((delay, i) =>
    note({ from: 700, to: i === 2 ? 900 : 500, duration: i === 2 ? 0.26 : 0.1, type: "triangle", volume: 0.18, lowpass: 2000, delay }),
  );
}

/** "Kikeriki!" – the cock crows: three short notes and a long high one. */
export function playCrow() {
  [0, 0.14, 0.28].forEach((delay, i) => note({ from: 660 + i * 80, duration: 0.12, type: "sawtooth", volume: 0.12, lowpass: 2200, delay }));
  note({ from: 980, to: 820, duration: 0.6, type: "sawtooth", volume: 0.12, lowpass: 2200, delay: 0.44 });
}

/** A horse's whinny: a high, trembling note that falls. */
export function playNeigh() {
  for (let i = 0; i < 8; i++) note({ from: 900 - i * 60, to: 840 - i * 60, duration: 0.1, type: "triangle", volume: 0.16, delay: i * 0.08 });
}

/** "Schuhu!" – an owl, two soft low hoots. */
export function playHoot() {
  note({ from: 420, to: 380, duration: 0.25, type: "sine", volume: 0.3 });
  note({ from: 400, to: 340, duration: 0.5, type: "sine", volume: 0.3, delay: 0.35 });
}

/** "Quak, quak!" of a frog – lower and rounder than the duck. */
export function playCroak() {
  [0, 0.3].forEach((delay) => note({ from: 190, to: 140, duration: 0.16, type: "sawtooth", volume: 0.25, lowpass: 600, delay }));
}

/** "Roooar!" – a lion's yawn: a low growl that rises and sinks, soft enough for small ears. */
export function playRoar() {
  note({ from: 90, to: 150, duration: 0.35, type: "sawtooth", volume: 0.28, lowpass: 500 });
  note({ from: 150, to: 80, duration: 0.8, type: "sawtooth", volume: 0.28, lowpass: 500, delay: 0.3 });
  note({ from: 60, to: 45, duration: 0.9, type: "square", volume: 0.08, lowpass: 300, delay: 0.2 });
}

/** "Törööö!" – an elephant: a brassy note that climbs and holds. */
export function playTrumpet() {
  note({ from: 330, to: 620, duration: 0.25, type: "sawtooth", volume: 0.14, lowpass: 1800 });
  note({ from: 620, to: 560, duration: 0.7, type: "sawtooth", volume: 0.14, lowpass: 1800, delay: 0.22 });
  note({ from: 1240, to: 1120, duration: 0.6, type: "triangle", volume: 0.04, delay: 0.25 });
}

/** "Uh, uh, ah, ah!" – a monkey: short hoots that climb. */
export function playChatter() {
  for (let i = 0; i < 5; i++) note({ from: 420 + i * 70, to: 620 + i * 90, duration: 0.1, type: "triangle", volume: 0.18, delay: i * 0.13 });
}

/** "Kraah!" – a parrot or a peacock: a raspy call, twice. */
export function playSquawk() {
  [0, 0.35].forEach((delay) => note({ from: 1100, to: 650, duration: 0.22, type: "sawtooth", volume: 0.1, lowpass: 2600, delay }));
}

/** "Schnapp, schnapp!" – a crocodile's jaw closing twice. */
export function playSnap() {
  [0.3, 1].forEach((delay) => {
    note({ from: 900, to: 180, duration: 0.07, type: "triangle", volume: 0.35, delay });
    note({ from: 140, to: 90, duration: 0.12, type: "sine", volume: 0.25, delay });
  });
}

/** "Blubb, blubb!" – bubbles wobbling up through the water. */
export function playBlub() {
  [0, 0.15, 0.32, 0.46].forEach((delay, i) => note({ from: 280 + i * 70, to: 820 + i * 140, duration: 0.1, type: "sine", volume: 0.22, delay }));
}

/** "Uuuuh!" – a whale's song: a long, low note that slides up and down. */
export function playWhale() {
  note({ from: 170, to: 300, duration: 0.8, type: "sine", volume: 0.3 });
  note({ from: 300, to: 140, duration: 1.1, type: "sine", volume: 0.3, delay: 0.7 });
  note({ from: 340, to: 600, duration: 0.8, type: "triangle", volume: 0.05 });
}

/** "Ki-ki-ki!" – a dolphin: quick clicks and a whistle that goes up and down. */
export function playDolphin() {
  for (let i = 0; i < 4; i++) note({ from: 2600, to: 2200, duration: 0.04, type: "square", volume: 0.04, lowpass: 4000, delay: i * 0.07 });
  note({ from: 1400, to: 2800, duration: 0.3, type: "sine", volume: 0.14, delay: 0.32 });
  note({ from: 2800, to: 1800, duration: 0.25, type: "sine", volume: 0.14, delay: 0.62 });
}

/** "Muh!" – a long, low moo. */
export function playMoo() {
  note({ from: 160, to: 120, duration: 0.9, type: "sawtooth", volume: 0.25, lowpass: 600 });
}

/** "Ssssss!" – a snake hissing, twice. */
export function playHiss() {
  [0, 0.55].forEach((delay) => hiss({ from: 5200, to: 4200, duration: 0.45, volume: 0.14, delay, q: 1.4 }));
}

/** "Tock-tock-tock!" – a woodpecker drumming on a tree: very fast, dry knocks that fade. */
export function playPeck() {
  for (let i = 0; i < 12; i++) note({ from: 900, to: 420, duration: 0.035, type: "triangle", volume: 0.3 - i * 0.018, delay: i * 0.055 });
}

/** "Kuckuck!" – a cuckoo: two soft notes, the second a third lower, twice. */
export function playCuckoo() {
  [0, 0.75].forEach((delay) => {
    note({ from: 784, to: 770, duration: 0.24, type: "sine", volume: 0.28, delay });
    note({ from: 622, to: 610, duration: 0.34, type: "sine", volume: 0.28, delay: delay + 0.3 });
  });
}

/** "Rrr … ha … ha … hatschi!" – a dinosaur's very soft roar, two breaths in, then a big sneeze. */
export function playSneeze() {
  note({ from: 110, to: 150, duration: 0.5, type: "sawtooth", volume: 0.12, lowpass: 420 });
  note({ from: 150, to: 100, duration: 0.4, type: "sawtooth", volume: 0.1, lowpass: 420, delay: 0.4 });
  [0.95, 1.3].forEach((delay, i) => {
    note({ from: 380 + i * 60, to: 520 + i * 80, duration: 0.25, type: "triangle", volume: 0.12, lowpass: 1400, delay });
    hiss({ from: 900, to: 1400, duration: 0.25, volume: 0.06, delay, q: 0.8 });
  });
  note({ from: 820, to: 300, duration: 0.18, type: "triangle", volume: 0.18, lowpass: 2000, delay: 1.75 });
  hiss({ from: 4200, to: 2200, duration: 0.45, volume: 0.32, delay: 1.78, q: 0.9 });
}

/** "Ha…" – one breath in before a sneeze; `size` from 0 (a mouse) to 1 (an elephant) makes it lower, longer and louder. */
export function playHa(size = 0.5) {
  const base = 1000 - 680 * size;
  note({ from: base, to: base * 1.4, duration: 0.22 + 0.14 * size, type: "triangle", volume: 0.07 + 0.08 * size, lowpass: 2600 - 1200 * size });
  hiss({ from: 1500 - 600 * size, to: 2200 - 800 * size, duration: 0.26 + 0.14 * size, volume: 0.03 + 0.05 * size, q: 0.8 });
}

/** "Hatschi!" – the sneeze itself: a tiny one from a mouse (`size` 0) up to an elephant's huge one (1). */
export function playHatschi(size = 0.5) {
  const base = 1300 - 920 * size;
  // "Hat…": a short note that drops.
  note({ from: base, to: base * 0.45, duration: 0.12 + 0.14 * size, type: "triangle", volume: 0.12 + 0.12 * size, lowpass: 2400 });
  // "…schi!": a rush of air, lower and longer for a big animal.
  hiss({ from: 5200 - 2600 * size, to: 2800 - 1500 * size, duration: 0.3 + 0.55 * size, volume: 0.15 + 0.2 * size, delay: 0.05, q: 0.9 });
  // Big animals rumble a little underneath.
  if (size > 0.5) note({ from: 220, to: 70, duration: 0.3 + 0.4 * size, type: "sawtooth", volume: 0.1 * size, lowpass: 420, delay: 0.04 });
}
