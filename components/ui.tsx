"use client";

import Image from "next/image";
import { useEffect, type ReactNode } from "react";
import { Star, X } from "lucide-react";

export function PageHeading({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {action && <div className="page-heading-action">{action}</div>}
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  size = "regular",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "regular" | "wide";
}) {
  useEffect(() => {
    if (!open) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className={`modal-panel${size === "wide" ? " modal-panel-wide" : ""}`} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button className="icon-button modal-close" type="button" onClick={onClose} aria-label="Close dialog"><X size={19} /></button>
        </div>
        {children}
      </section>
    </div>
  );
}

export function Rating({ value, onChange, label = "Rate this outfit" }: { value?: number; onChange: (value: number) => void; label?: string }) {
  return (
    <div className="rating-control" role="group" aria-label={label}>
      {[1, 2, 3, 4, 5].map((score) => (
        <button key={score} type="button" aria-label={`${score} star${score > 1 ? "s" : ""}`} aria-pressed={value === score} onClick={() => onChange(score)}>
          <Star size={20} fill={value && score <= value ? "currentColor" : "none"} strokeWidth={1.7} />
        </button>
      ))}
      {value ? <span className="rating-caption">{value}/5</span> : null}
    </div>
  );
}

export function ItemImage({ src, alt, className = "", sizes = "(max-width: 680px) 46vw, 240px" }: { src: string; alt: string; className?: string; sizes?: string }) {
  return (
    <div className={`image-frame ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} className="cover-image" />
    </div>
  );
}
