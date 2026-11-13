import { Fragment, useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { MenuTop } from "@/components/MenuTop";
import { allPictures, type GalleryPicture, KIND_TITLES, PICTURE_SOURCES, type PictureSet, type PictureShelf, shelvesOf } from "@/content/pictureGallery";
import { useTitle } from "@/lib/title";
import "@/styles/ideas.css";
import "@/styles/pictures.css";

/** How big the pictures stand in the lists. */
const SIZES = { s: "klein", m: "mittel", l: "groß" } as const;
type Size = keyof typeof SIZES;

/** A set with a picture whose name matches every word typed. */
const matches = (set: PictureSet, words: string[]) => words.every((w) => set.members.some((m) => m.picture.path.toLowerCase().includes(w)));

/**
 * Hidden page for grown-ups, reached from /management/: every picture of the app at once, by game, story and set –
 * a picture with its second frame, its line drawing or its other halves side by side – so they can be checked without
 * playing every game to its scene (user request, November 2026). A tap shows a picture big, with its set and its
 * file's path to name in feedback; ← and → go through all pictures shown. „Bewegung zeigen“ fades the frames as the
 * games do. The pictures and how they belong together come from `content/pictureGallery.ts`.
 */
export function PicturesPage() {
  useTitle("Alle Bilder");
  const shelves = useMemo(() => shelvesOf(allPictures()), []);
  const [source, setSource] = useState("");
  const [query, setQuery] = useState("");
  const [moving, setMoving] = useState(false);
  const [size, setSize] = useState<Size>("m");
  const [open, setOpen] = useState<GalleryPicture>();

  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const shown = shelves
    .filter((shelf) => !source || shelf.source === source)
    .map((shelf) => ({
      ...shelf,
      stories: shelf.stories.map((s) => ({ ...s, sets: s.sets.filter((set) => matches(set, words)) })).filter((s) => s.sets.length),
    }))
    .filter((shelf) => shelf.stories.length > 0);
  const flat = shown.flatMap((shelf) => shelf.stories.flatMap((s) => s.sets.flatMap((set) => set.members.map((m) => m.picture))));
  const setOf = new Map(
    shelves.flatMap((shelf) => shelf.stories.flatMap((s) => s.sets.flatMap((set) => set.members.map((m) => [m.picture.path, set] as const)))),
  );
  const counts = new Map<string, number>();
  for (const shelf of shelves) counts.set(shelf.source, (counts.get(shelf.source) ?? 0) + shelf.count);
  const total = [...counts.values()].reduce((a, b) => a + b, 0);
  const sets = shown.reduce((n, shelf) => n + shelf.stories.reduce((m, s) => m + s.sets.length, 0), 0);

  return (
    <main className="home ideas pics" data-size={size}>
      <MenuTop to="/management/" back="Management" />
      <h1>Alle Bilder</h1>
      <p className="home-subtitle">
        {total} Bilder aus allen Spielen auf einer Seite. Was zusammengehört, steht nebeneinander: ein Bild mit seinem zweiten Frame, seiner Linie zum Ausmalen
        oder seinen anderen Hälften. Antippen zeigt ein Bild groß, mit seinem Pfad für Rückmeldungen.
      </p>

      <nav className="ideas-contents" aria-label="Spiele">
        <button type="button" className="pics-chip" aria-pressed={!source} onClick={() => setSource("")}>
          Alle <small>{total}</small>
        </button>
        {[...counts].map(([id, count]) => (
          <button key={id} type="button" className="pics-chip" aria-pressed={source === id} onClick={() => setSource(source === id ? "" : id)}>
            {PICTURE_SOURCES[id]?.title ?? id} <small>{count}</small>
          </button>
        ))}
      </nav>

      <div className="pics-tools">
        <input
          type="search"
          placeholder="Name suchen, z. B. angry oder linie"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Name suchen"
        />
        <label>
          <input type="checkbox" checked={moving} onChange={(e) => setMoving(e.target.checked)} /> Bewegung zeigen
        </label>
        <span className="pics-sizes" role="group" aria-label="Größe">
          {(Object.keys(SIZES) as Size[]).map((s) => (
            <button key={s} type="button" className="pics-chip" aria-pressed={size === s} onClick={() => setSize(s)}>
              {SIZES[s]}
            </button>
          ))}
        </span>
        <span className="pics-count">
          {flat.length} Bilder in {sets} Gruppen
        </span>
      </div>

      {shown.length === 0 && <p className="ideas-panel">Kein Bild passt zu „{query}“.</p>}
      {shown.map((shelf) => (
        <Shelf key={`${shelf.source} ${shelf.kind}`} shelf={shelf} moving={moving} onOpen={setOpen} />
      ))}

      {open && <Viewer picture={open} set={setOf.get(open.path)} all={flat} onShow={setOpen} />}
    </main>
  );
}

/** One game's pictures of one kind, story by story. */
function Shelf({ shelf, moving, onOpen }: { shelf: PictureShelf; moving: boolean; onOpen: (p: GalleryPicture) => void }) {
  const source = PICTURE_SOURCES[shelf.source];
  return (
    <section className="ideas-panel pics-shelf">
      <h2>
        {source?.title ?? shelf.source} <small>· {KIND_TITLES[shelf.kind]}</small>
        {source?.hrefs.map((href) => (
          <Link key={href} to={href} className="pics-play">
            {href === "/" ? "Regal" : href} ↗
          </Link>
        ))}
      </h2>
      {shelf.stories.map((story) => (
        <Fragment key={story.key}>
          {(shelf.stories.length > 1 || story.key) && <h3>{story.key ? `${story.key} (${story.sets.length})` : `Einzelne Bilder (${story.sets.length})`}</h3>}
          <div className="pics-grid">
            {story.sets.map((set) => (
              <SetCard key={set.base} set={set} moving={moving} onOpen={onOpen} />
            ))}
          </div>
        </Fragment>
      ))}
    </section>
  );
}

/** A set of pictures that belong together, in one frame; a single picture alone. */
function SetCard({ set, moving, onOpen }: { set: PictureSet; moving: boolean; onOpen: (p: GalleryPicture) => void }) {
  const [first, ...rest] = set.members;
  const frame = rest.find((m) => m.frame);
  return (
    <figure className="pics-set" data-many={set.members.length > 1 || undefined}>
      <div className="pics-row">
        {moving && frame && (
          <button type="button" className="pics-tile pics-moving" onClick={() => onOpen(first.picture)} title="Beide Frames im Wechsel, wie im Spiel">
            <img src={first.picture.url} alt="" loading="lazy" decoding="async" />
            <img className="pics-fade" src={frame.picture.url} alt="" loading="lazy" decoding="async" />
            <span className="pics-role">▶ im Wechsel</span>
          </button>
        )}
        {set.members.map((m) => (
          <button key={m.picture.path} type="button" className="pics-tile" onClick={() => onOpen(m.picture)} title={m.picture.path}>
            <img src={m.picture.url} alt={m.picture.stem} loading="lazy" decoding="async" />
            {m.role && <span className="pics-role">{m.role}</span>}
          </button>
        ))}
      </div>
      <figcaption>{set.base}</figcaption>
    </figure>
  );
}

/** One picture big, with its set below and its path; ← → go through every picture shown, Esc closes. */
function Viewer({ picture, set, all, onShow }: { picture: GalleryPicture; set?: PictureSet; all: GalleryPicture[]; onShow: (p?: GalleryPicture) => void }) {
  const [natural, setNatural] = useState("");
  const [copied, setCopied] = useState(false);
  const index = all.findIndex((p) => p.path === picture.path);
  const step = (by: number) => all.length && onShow(all[(index + by + all.length) % all.length]);
  const role = set?.members.find((m) => m.picture.path === picture.path)?.role;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onShow(undefined);
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
  useEffect(() => {
    setNatural("");
    setCopied(false);
  }, [picture]);

  return (
    <div className="pics-viewer" role="dialog" aria-modal aria-label={picture.stem}>
      <button type="button" className="pics-close" aria-label="Schließen" onClick={() => onShow(undefined)}>
        ✕
      </button>
      <button type="button" className="pics-step" data-side="left" aria-label="Voriges Bild" onClick={() => step(-1)}>
        ‹
      </button>
      <img
        className="pics-big"
        src={picture.url}
        alt={picture.stem}
        onLoad={(e) => setNatural(`${e.currentTarget.naturalWidth} × ${e.currentTarget.naturalHeight}`)}
      />
      <button type="button" className="pics-step" data-side="right" aria-label="Nächstes Bild" onClick={() => step(1)}>
        ›
      </button>
      <div className="pics-info">
        <p>
          <code>{picture.path}</code>
          <button
            type="button"
            className="pics-chip"
            onClick={() =>
              navigator.clipboard?.writeText(picture.path).then(
                () => setCopied(true),
                () => setCopied(false),
              )
            }
          >
            {copied ? "kopiert ✓" : "Pfad kopieren"}
          </button>
        </p>
        <p>{[role, natural, `${index + 1} von ${all.length}`].filter(Boolean).join(" · ")}</p>
        {set && set.members.length > 1 && (
          <div className="pics-siblings">
            {set.members.map((m) => (
              <button key={m.picture.path} type="button" className="pics-tile" aria-pressed={m.picture.path === picture.path} onClick={() => onShow(m.picture)}>
                <img src={m.picture.url} alt={m.picture.stem} />
                <span className="pics-role">{m.role || "Bild"}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
