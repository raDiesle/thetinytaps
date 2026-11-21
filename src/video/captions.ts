// Chapter marks and subtitles of a recorded video (idea Y-26): the video page notes when each part of the story begins
// and when each recorded line starts, and turns them into the chapter list for YouTube's description and an .srt file.

/** A part of the video beginning: `at` seconds after the recording started. */
export interface Chapter {
  at: number;
  title: string;
}

/** A recorded line said: from `at` seconds for `seconds`. */
export interface SaidLine {
  at: number;
  seconds: number;
  text: string;
}

/** YouTube shows chapters only when each is at least this long … */
export const MIN_CHAPTER_SECONDS = 10;
/** … and there are at least this many, the first at 0:00. */
export const MIN_CHAPTERS = 3;

/** How long chapter `i` of `list` lasts in a video of `length` seconds. */
const lengthOf = (list: readonly Chapter[], i: number, length: number) => (list[i + 1]?.at ?? length) - list[i].at;

/**
 * The chapters as YouTube takes them: the first at 0:00 (the still frame before the play belongs to it), the same title
 * twice in a row once, and a chapter shorter than `MIN_CHAPTER_SECONDS` joined to the one before (the first to the one
 * after), their titles joined with „ · “, so no part is lost from the list.
 */
export function chapterList(marks: readonly Chapter[], length: number): Chapter[] {
  const list: Chapter[] = [];
  for (const mark of [...marks].sort((a, b) => a.at - b.at)) {
    if (mark.at >= length) continue;
    if (list.at(-1)?.title === mark.title) continue;
    list.push({ ...mark });
  }
  if (list.length === 0) return list;
  list[0].at = 0;
  for (;;) {
    if (list.length < 2) break;
    const short = list.findIndex((_, i) => lengthOf(list, i, length) < MIN_CHAPTER_SECONDS);
    if (short < 0) break;
    const first = short === 0 ? 0 : short - 1;
    list.splice(first, 2, { at: list[first].at, title: `${list[first].title} · ${list[first + 1].title}` });
  }
  return list;
}

/** Seconds as YouTube writes them in a description: „0:07“, „12:30“, „1:02:03“. */
export function stamp(seconds: number) {
  const whole = Math.floor(seconds);
  const h = Math.floor(whole / 3600);
  const m = Math.floor((whole % 3600) / 60);
  const s = String(whole % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
}

/** The chapters as lines for the description, „0:00 Time to go“. */
export const chapterText = (list: readonly Chapter[]) => list.map((c) => `${stamp(c.at)} ${c.title}`).join("\n");

/** Seconds as an .srt time, „00:01:02,345“. */
function srtTime(seconds: number) {
  const ms = Math.max(0, Math.round(seconds * 1000));
  const two = (n: number) => String(n).padStart(2, "0");
  return `${two(Math.floor(ms / 3_600_000))}:${two(Math.floor(ms / 60_000) % 60)}:${two(Math.floor(ms / 1000) % 60)},${String(ms % 1000).padStart(3, "0")}`;
}

/**
 * The lines said as an .srt file: each shows while it is said, ending early where the next one starts (a line cut off by
 * the next step) and never after the video's end.
 */
export function srt(lines: readonly SaidLine[], length: number) {
  const sorted = [...lines].filter((l) => l.at < length && l.text.trim()).sort((a, b) => a.at - b.at);
  return sorted
    .map((line, i) => {
      const end = Math.min(line.at + line.seconds, sorted[i + 1]?.at ?? length, length);
      return `${i + 1}\n${srtTime(line.at)} --> ${srtTime(end)}\n${line.text.trim()}\n`;
    })
    .join("\n");
}
