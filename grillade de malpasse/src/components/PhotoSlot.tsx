import Image from "next/image";
import { IconCamera } from "@/components/icons";

/**
 * Affiche la vraie photo si elle existe, sinon un emplacement clairement
 * marqué « À REMPLACER PAR UNE VRAIE PHOTO » (aucune image de stock trompeuse).
 */
export function PhotoSlot({
  src,
  alt,
  hint,
  className = "",
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  compact = false,
}: {
  src?: string | null;
  alt: string;
  hint?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  compact?: boolean;
}) {
  if (src) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }
  return (
    <div
      className={`placeholder-photo relative flex flex-col items-center justify-center gap-2 overflow-hidden border border-dashed border-amber-400/40 p-4 text-center ${className}`}
      role="img"
      aria-label={`Emplacement photo : ${alt}`}
    >
      <IconCamera className={compact ? "size-5 text-amber-400/80" : "size-8 text-amber-400/80"} />
      <span className={`font-display font-bold tracking-wide text-amber-400 uppercase ${compact ? "text-[0.65rem] leading-tight" : "text-sm"}`}>
        À remplacer par une vraie photo
      </span>
      {hint && !compact ? <span className="max-w-[28ch] text-xs text-muted">{hint}</span> : null}
    </div>
  );
}

