// Kept apart from the page's code and importing nothing: the shelf's ring calendar uses it, and must not pull the
// Belohnungstafel's code into the home page's chunk.

/** Router state that opens „Belohnungstafel & Zeitplan“ straight in its editor (the shelf's ring calendar). */
export const OPEN_EDITOR = { editor: true } as const;

/** The router state `OPEN_EDITOR` is: `navigate("/tagesplan/", { state: OPEN_EDITOR })`. */
export type OpenEditorState = typeof OPEN_EDITOR;

/** Whether a page's router state asks for the editor: the wizard where nothing is made yet, else „Gestalten“. */
export const opensEditor = (state: unknown): boolean => typeof state === "object" && state !== null && (state as Partial<OpenEditorState>).editor === true;
