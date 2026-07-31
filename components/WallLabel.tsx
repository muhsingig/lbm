import type { Label } from '@/content/exhibition';

/**
 * A printed museum wall label — attribution, title, year, medium, floor —
 * uppercase and widely tracked, mounted under a hairline. It is the one thing
 * in this building that is set rather than lit, and it recurs on every floor.
 */
export function WallLabel({ label, className = '' }: { label: Label; className?: string }) {
  return (
    <figcaption className={`wall-label ${className}`}>
      {label.plate ? <p className="t-label mb-3 text-[var(--accent)]">{label.plate}</p> : null}

      <p className="t-label wall-label__attribution">{label.attribution}</p>
      <p className="t-label wall-label__title mt-1 italic">{label.title}</p>

      <div className="t-label wall-label__meta mt-4 space-y-1">
        {label.year ? <p>{label.year}</p> : null}
        <p>{label.medium}</p>
        <p>{label.floor}</p>
      </div>

      {label.note ? <p className="t-label wall-label__note mt-5 max-w-[36ch]">{label.note}</p> : null}
    </figcaption>
  );
}
