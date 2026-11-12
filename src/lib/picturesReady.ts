/** The longest a book or a page waits for the new page's pictures to be decoded before it moves. */
const PICTURES_WAIT = 800;

/**
 * Resolves once every picture on the page is loaded and decoded, or after `PICTURES_WAIT`: a menu's pictures
 * (`CardPicture`) that came only while a book flew or a page turned had an old phone draw the page again mid-motion.
 */
export function picturesReady() {
  const pictures = [...document.querySelectorAll<HTMLImageElement>("#root img")].map((img) => img.decode().catch(() => undefined));
  return Promise.race([Promise.all(pictures), new Promise((resolve) => setTimeout(resolve, PICTURES_WAIT))]);
}
