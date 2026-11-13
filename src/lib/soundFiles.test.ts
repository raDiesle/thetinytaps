import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";

// The animal calls made with ElevenLabs (src/lib/sounds/README.md, „Made with ElevenLabs“) need no quality: they stay
// mono at 22.05 kHz and 32 kbit/s, a few KB each, so they never weigh on a phone's download (user request, November 2026).

const dir = new URL("./sounds/", import.meta.url);

/** The files listed in the README's table of sounds made with ElevenLabs. */
const generated = () => {
  const readme = readFileSync(new URL("README.md", dir), "utf8");
  const section = readme.slice(readme.indexOf("## Made with ElevenLabs"));
  return [...section.matchAll(/^\| `([\w-]+\.mp3)`/gm)].map((m) => m[1]!);
};

/** Sample rate, bit rate and channels of the first MPEG audio frame with sound: after an ID3v2 tag and LAME's Info frame. */
const header = (bytes: Uint8Array) => {
  let at = 0;
  if (bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) at = 10 + ((bytes[6]! << 21) | (bytes[7]! << 14) | (bytes[8]! << 7) | bytes[9]!);
  const read = () => {
    while (!(bytes[at] === 0xff && (bytes[at + 1]! & 0xe0) === 0xe0)) at++;
    const mpeg1 = ((bytes[at + 1]! >> 3) & 3) === 3;
    const rates = mpeg1 ? [44100, 48000, 32000] : [22050, 24000, 16000];
    const kbitRates = mpeg1
      ? [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320]
      : [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160];
    const sampleRate = rates[(bytes[at + 2]! >> 2) & 3]!;
    const kbits = kbitRates[bytes[at + 2]! >> 4]!;
    const length = Math.floor(((mpeg1 ? 144_000 : 72_000) * kbits) / sampleRate) + ((bytes[at + 2]! >> 1) & 1);
    return { sampleRate, kbits, mono: bytes[at + 3]! >> 6 === 3, length };
  };
  let frame = read();
  const text = new TextDecoder("latin1").decode(bytes.subarray(at, at + frame.length));
  if (text.includes("Info") || text.includes("Xing")) {
    at += frame.length;
    frame = read();
  }
  const { length: _, ...format } = frame;
  return format;
};

test("the ElevenLabs animal calls are listed and stay small: mono, 22.05 kHz, 32 kbit/s", () => {
  const files = generated();
  expect(files.length).toBeGreaterThan(0);
  for (const file of files) {
    const bytes = new Uint8Array(readFileSync(new URL(file, dir)));
    expect(header(bytes), file).toEqual({ sampleRate: 22050, kbits: 32, mono: true });
    expect(bytes.length, file).toBeLessThan(12_000);
  }
});
