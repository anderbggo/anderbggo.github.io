import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export type AlbumPhoto = {
  id: "posando" | "costa" | "sonrisa" | "manta" | "gafas";
  alt: string;
  caption?: string;
};

type AlbumLabels = {
  title: string;
  open: (description: string) => string;
  close: string;
  previous: string;
  next: string;
};

const sizes: Record<AlbumPhoto["id"], readonly [number, number]> = {
  posando: [768, 903],
  costa: [768, 1024],
  sonrisa: [768, 1024],
  manta: [1557, 768],
  gafas: [338, 317],
};

function photoUrl(id: AlbumPhoto["id"]) {
  return `/roko/photos/roko-${id}.webp`;
}

export default function PhotoAlbum({ photos, labels }: { photos: readonly AlbumPhoto[]; labels: AlbumLabels }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const current = openIndex !== null ? photos[openIndex] : null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (openIndex !== null && !dialog.open) dialog.showModal();
    if (openIndex === null && dialog.open) dialog.close();
  }, [openIndex]);

  const step = (delta: number) =>
    setOpenIndex((index) => (index === null ? index : (index + delta + photos.length) % photos.length));

  return (
    <section className="roko-album" aria-labelledby="roko-album-title">
      <h2 id="roko-album-title">{labels.title}</h2>
      <ul className="roko-album-grid">
        {photos.map((photo, index) => {
          const [width, height] = sizes[photo.id];
          return (
            <li key={photo.id} className={`roko-photo roko-photo--${photo.id}`}>
              <figure>
                <button type="button" onClick={() => setOpenIndex(index)} aria-label={labels.open(photo.caption ?? photo.alt)}>
                  <span className="roko-photo-print">
                    <img src={photoUrl(photo.id)} alt={photo.alt} width={width} height={height} loading="lazy" decoding="async" />
                  </span>
                </button>
                {photo.caption && <figcaption>{photo.caption}</figcaption>}
              </figure>
            </li>
          );
        })}
      </ul>

      <dialog
        ref={dialogRef}
        className="roko-lightbox"
        aria-label={current?.caption ?? current?.alt}
        onClose={() => setOpenIndex(null)}
        onCancel={(event) => {
          event.preventDefault();
          setOpenIndex(null);
        }}
        onClick={(event) => event.target === event.currentTarget && setOpenIndex(null)}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") step(1);
          if (event.key === "ArrowLeft") step(-1);
          if (event.key === "Escape") {
            event.preventDefault();
            setOpenIndex(null);
          }
        }}
      >
        {current && (
          <figure>
            <img src={photoUrl(current.id)} alt={current.alt} />
            {current.caption && <figcaption>{current.caption}</figcaption>}
          </figure>
        )}
        <button type="button" className="roko-lightbox-close" onClick={() => setOpenIndex(null)} aria-label={labels.close}>
          <X size={22} aria-hidden="true" />
        </button>
        <button type="button" className="roko-lightbox-prev" onClick={() => step(-1)} aria-label={labels.previous}>
          <ChevronLeft size={28} aria-hidden="true" />
        </button>
        <button type="button" className="roko-lightbox-next" onClick={() => step(1)} aria-label={labels.next}>
          <ChevronRight size={28} aria-hidden="true" />
        </button>
      </dialog>
    </section>
  );
}
