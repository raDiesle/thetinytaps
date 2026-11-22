import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { evaluate, launchChrome, open, siteUrl } from "./chrome";

// `bun run video intro` / `bun run video outro` – makes the YouTube videos' intro or outro (src/video) as an MP4 file,
// frame by frame: headless Chrome opens its page with `?render`, shows each frame at its exact second and takes a picture
// of it, the page renders its sound without playing it (an OfflineAudioContext; Chrome is muted besides), and ffmpeg
// joins both. Every run gives the same video, sharp at 1920 × 1080, never dropping a frame as a screen recording can.
//
//   bun run video intro                      builds the site and serves it
//   bun run video intro --url http://localhost:3000   uses a running dev server instead
//   bun run video outro --ziel /zaehne/ --sprache en  the outro whose code leads to that game, in that language
//                     (default: the home page, in the browser's language)
//   bun run video outro --variante regal     the outro's other way: the shelf instead of the games' pictures
//   --fps 30          frames per second (default 60)
//   --shots 0.9,2.8   only pictures of these seconds, as PNG, to look at (no video)
//   --out <folder>    where the files go (default video-out/, not in git)

/** The videos this tool can make, by name: the page that draws them. */
const VIDEOS: Record<string, string> = { intro: "/management/video-intro/", outro: "/management/video-outro/" };

const args = process.argv.slice(2);
const option = (name: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const name = args.find((a, i) => !a.startsWith("--") && !args[i - 1]?.startsWith("--")) ?? "intro";
const path = VIDEOS[name];
if (!path) throw new Error(`Unknown video „${name}“: ${Object.keys(VIDEOS).join(", ")}`);
const fps = Number(option("fps") ?? 60);
const shots = option("shots")
  ?.split(",")
  .map(Number)
  .filter((n) => Number.isFinite(n));
/** The outro's choices, passed on to its page; they also name the file. */
const target = option("ziel");
const language = option("sprache");
const variant = option("variante");
const query = new URLSearchParams({ render: "" });
if (target) query.set("ziel", target);
if (language) query.set("sprache", language);
if (variant) query.set("variante", variant);
const fileName = [name, variant, target?.replaceAll("/", ""), language].filter(Boolean).join("-");
const outDir = option("out") ?? join(import.meta.dir, "..", "video-out");
mkdirSync(outDir, { recursive: true });

const site = await siteUrl({ url: option("url") });
const { cdp, stop } = await launchChrome({ width: 1920, height: 1080, scale: 1 });

/** A picture of the page as it is now. */
const capture = async () => Buffer.from((await cdp.send<{ data: string }>("Page.captureScreenshot", { format: "png" })).data, "base64");

/** Shows the frame at second `t`: the page draws it and waits for it to be painted. */
const seek = (t: number) => evaluate(cdp, `window.__video.seek(${t})`);

try {
  await cdp.send("Page.enable");
  await cdp.send("Emulation.setDeviceMetricsOverride", { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
  await open(cdp, `${site.url}${path}?${query}`);
  // The page's code may still be loading after the load event (a lazy page): wait for its handle.
  for (let tries = 0; tries < 100 && !(await evaluate<boolean>(cdp, "!!window.__video")); tries++) await Bun.sleep(100);
  const seconds = await evaluate<number>(cdp, "window.__video.seconds");

  if (shots) {
    for (const t of shots) {
      await seek(t);
      const file = join(outDir, `${fileName}-${t.toFixed(2)}s.png`);
      writeFileSync(file, await capture());
      console.log(file);
    }
  } else {
    const wav = join(outDir, `${fileName}.wav`);
    writeFileSync(wav, Buffer.from(await evaluate<string>(cdp, "window.__video.sound()"), "base64"));
    const mp4 = join(outDir, `${fileName}.mp4`);
    const ffmpeg = Bun.spawn(
      [
        "ffmpeg",
        "-y",
        "-loglevel",
        "error",
        "-f",
        "image2pipe",
        "-framerate",
        String(fps),
        "-i",
        "-",
        "-i",
        wav,
        "-c:v",
        "libx264",
        "-preset",
        "slow",
        "-crf",
        "14",
        "-pix_fmt",
        "yuv420p",
        "-c:a",
        "aac",
        "-b:a",
        "256k",
        // As loud as YouTube plays everything, so the intro is neither drowned nor too loud beside the video.
        "-af",
        "loudnorm=I=-16:TP=-1.5:LRA=11",
        "-movflags",
        "+faststart",
        "-shortest",
        mp4,
      ],
      { stdin: "pipe", stdout: "inherit", stderr: "inherit" },
    );
    const frames = Math.round(seconds * fps);
    for (let frame = 0; frame < frames; frame++) {
      await seek(frame / fps);
      ffmpeg.stdin.write(await capture());
      if (frame % fps === 0) process.stdout.write(`\r${name}: ${(frame / fps).toFixed(0)} / ${seconds} s`);
    }
    await ffmpeg.stdin.end();
    if ((await ffmpeg.exited) !== 0) throw new Error("ffmpeg failed.");
    rmSync(wav);
    console.log(`\r${mp4} (${frames} frames at ${fps} fps)`);
  }
} finally {
  stop();
  site.stop();
}
