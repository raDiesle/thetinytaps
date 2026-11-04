/**
 * What shows while a page's own code is still loading (the `Suspense` of App.tsx; on a slow network a game tapped
 * before its code was fetched ahead): a sheet of paper with the paw track coming and going after a moment (`.boot` in
 * base.css), the same as a built page shows before the app starts (`BOOT_WAIT` in tools/pageStart.ts) – never an
 * empty screen.
 */
export function PageLoading() {
  return (
    <div className="boot" aria-busy="true">
      <div className="boot-wait" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
