import { audioContext } from "@/lib/sfx";
import type { Energy } from "../library/types";

// Soft, endless adventure music made on the fly: a bass line and a marimba
// melody on the pentatonic scale, so it never sounds wrong. Calm moments play
// fewer, quieter notes; lively ones add a light shaker.

const BPM = 100;
const BEAT = 60 / BPM;
// C major pentatonic over two octaves, and roots of C – G – A minor – F.
const SCALE = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99, 880.0];
const ROOTS = [130.81, 98.0, 110.0, 87.31];
// A little tune in scale steps, one per eighth note; -1 is a rest.
const TUNE = [4, -1, 5, 4, 2, -1, 3, 4, 5, -1, 7, 5, 4, -1, 2, -1, 3, -1, 4, 3, 1, -1, 2, 3, 4, -1, 2, 1, 0, -1, -1, -1];

export class Music {
  private timer: ReturnType<typeof setInterval> | null = null;
  private nextAt = 0;
  private eighth = 0;
  private gain: GainNode | null = null;
  private quiet = false;
  energy: Energy = "medium";

  start() {
    const ac = audioContext();
    if (!ac || this.timer) return;
    this.gain = ac.createGain();
    this.gain.gain.value = this.quiet ? 0 : 0.5;
    this.gain.connect(ac.destination);
    this.nextAt = ac.currentTime + 0.1;
    this.timer = setInterval(() => this.schedule(), 50);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    const g = this.gain;
    if (g) {
      g.gain.setTargetAtTime(0, g.context.currentTime, 0.1);
      setTimeout(() => g.disconnect(), 600);
    }
    this.gain = null;
  }

  /** 0..1, e.g. lower while the guide speaks. */
  setVolume(volume: number) {
    if (this.gain) this.gain.gain.setTargetAtTime(volume * 0.5, this.gain.context.currentTime, 0.3);
  }

  /** Stops the music at once (true), and it goes on from there (false); for the stop dance. */
  hush(quiet: boolean) {
    if (quiet === this.quiet) return;
    this.quiet = quiet;
    if (this.gain) this.gain.gain.setTargetAtTime(quiet ? 0 : 0.5, this.gain.context.currentTime, quiet ? 0.01 : 0.03);
  }

  private schedule() {
    const ac = audioContext();
    if (!ac || !this.gain) return;
    if (this.quiet) {
      // Nothing new while quiet; the tune waits where it stopped.
      this.nextAt = Math.max(this.nextAt, ac.currentTime + 0.05);
      return;
    }
    while (this.nextAt < ac.currentTime + 0.25) {
      this.play(ac, this.nextAt, this.eighth);
      this.nextAt += BEAT / 2;
      this.eighth++;
    }
  }

  private play(ac: AudioContext, at: number, eighth: number) {
    const calm = this.energy === "calm";
    const lively = this.energy === "lively";
    const bar = Math.floor(eighth / 8) % ROOTS.length;
    if (eighth % 4 === 0) this.tone(ac, at, ROOTS[bar], "triangle", calm ? 0.14 : 0.2, BEAT * 1.8);
    if (!calm && eighth % 4 === 2) this.tone(ac, at, ROOTS[bar] * 1.5, "triangle", 0.1, BEAT * 0.8);
    const step = TUNE[eighth % TUNE.length];
    if (step >= 0 && (!calm || eighth % 2 === 0)) {
      this.tone(ac, at, SCALE[step], "sine", calm ? 0.08 : 0.12, BEAT * 1.2);
      this.tone(ac, at, SCALE[step] * 2, "sine", 0.025, BEAT * 0.5);
    }
    if (lively) this.shaker(ac, at, eighth % 2 === 0 ? 0.05 : 0.025);
  }

  private tone(ac: AudioContext, at: number, freq: number, type: OscillatorType, volume: number, duration: number) {
    const osc = ac.createOscillator();
    const env = ac.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    env.gain.setValueAtTime(0, at);
    env.gain.linearRampToValueAtTime(volume, at + 0.01);
    env.gain.exponentialRampToValueAtTime(0.0008, at + duration);
    osc.connect(env).connect(this.gain!);
    osc.start(at);
    osc.stop(at + duration + 0.05);
  }

  private shaker(ac: AudioContext, at: number, volume: number) {
    const length = Math.floor(ac.sampleRate * 0.05);
    const buffer = ac.createBuffer(1, length, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length);
    const src = ac.createBufferSource();
    src.buffer = buffer;
    const filter = ac.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 6000;
    const env = ac.createGain();
    env.gain.value = volume;
    src.connect(filter).connect(env).connect(this.gain!);
    src.start(at);
  }
}
