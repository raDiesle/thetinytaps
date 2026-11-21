// The Mac most sessions run on sits behind the company's Zscaler, which answers every request to ElevenLabs and Gemini
// with a page of its own (user decision, 21 November 2026: for good, never looked round). The paid scripts ask here
// before their first request – before any key is sent – and stop with the way that works: the queue, which a Claude
// cloud session makes with /paid-queue (root CLAUDE.md, „Working here“).

/**
 * Whether this network lets a request through to the service. A filter like Zscaler answers in its place with a page of
 * its own; the service itself answers a request without a key with 401 or 404, which is fine here. Sends no key.
 * @param {string} url
 */
export async function reachable(url) {
  try {
    const answer = await fetch(url, { signal: AbortSignal.timeout(15_000) });
    const text = await answer.text();
    return !/zscaler|website blocked/i.test(text);
  } catch {
    return false;
  }
}

/** @type {Map<string, Promise<boolean>>} */
const asked = new Map();

/**
 * Stops the script where the service can't be reached, naming the queue the work goes into instead. Asks once per run.
 * @param {string} service its name, for the message
 * @param {string} url a page of its API that answers without a key
 * @param {string} queue the file the approved work is written into on this computer
 */
export async function requireReachable(service, url, queue) {
  if (!asked.has(url)) asked.set(url, reachable(url));
  if (await asked.get(url)) return;
  console.error(
    `${service} can't be reached from this network (on the Mac Zscaler blocks it for good – never look for a way round it). ` +
      `Write the approved work into ${queue} instead, with what is left to do once it is made (\`after\`), commit and merge it: ` +
      "a Claude cloud session makes it with /paid-queue and finishes the work (root CLAUDE.md, „Working here“).",
  );
  process.exit(1);
}
