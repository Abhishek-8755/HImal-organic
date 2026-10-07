"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { categoryLabel } from "@/data/site";

// Marks the first case-insensitive match of `query` inside `text`
function Highlight({ text, query }) {
  const i = query ? text.toLowerCase().indexOf(query.toLowerCase()) : -1;
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-sm bg-turmeric/40 text-inherit">{text.slice(i, i + query.length)}</mark>
      {text.slice(i + query.length)}
    </>
  );
}

// mode "b2c": Enquire on WhatsApp. mode "b2b": shows MOQ and a Request Quote button.
// Optional: `highlight` marks a search match in the name; `onQuickView` adds a quick-view button.
export default function ProductCard({ product, mode = "b2c", onRequestQuote, onQuickView, highlight = "" }) {
  const [loaded, setLoaded] = useState(false);
  const href = `/products/${product.slug}${mode === "b2b" ? "?for=business" : ""}`;

  return (
    <article className="group relative flex h-full flex-col rounded-[1.5rem] bg-white/60 p-3 ring-1 ring-forest/[0.06] transition duration-500 ease-[var(--ease-soft)] hover:-translate-y-1.5 hover:bg-white hover:shadow-[0_24px_48px_-24px_rgb(31_61_43/0.35)]">
      <div
        className={`relative aspect-[4/3] overflow-hidden rounded-[1.1rem] sm:aspect-[4/5] ${
          loaded ? "bg-mist" : "animate-shimmer bg-[linear-gradient(110deg,var(--color-mist)_30%,#f4f7f2_50%,var(--color-mist)_70%)] bg-[length:200%_100%]"
        }`}
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          onLoad={() => setLoaded(true)}
          className="object-cover transition duration-700 ease-[var(--ease-soft)] group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-turmeric px-3 py-1 text-xs font-bold text-forest">
          Organic
        </span>
        {onQuickView && (
          <button
            type="button"
            onClick={() => onQuickView(product)}
            aria-label={`Quick view: ${product.name}`}
            className="absolute right-3 top-3 z-10 grid size-11 place-items-center rounded-full bg-cream/90 text-forest shadow-sm backdrop-blur transition hover:bg-forest hover:text-cream"
          >
            <Eye className="size-5" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-earth">
          {categoryLabel(product.category)}
        </p>
        <h3 className="mt-1.5 font-display text-[1.35rem] leading-snug text-forest">
          {/* The ::after overlay makes the whole card clickable without nesting buttons in a link */}
          <Link
            href={href}
            className="after:absolute after:inset-0 after:rounded-[1.5rem] after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-moss"
          >
            <Highlight text={product.name} query={highlight} />
          </Link>
        </h3>

        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Pack sizes">
          {product.packSizes.map((size) => (
            <li key={size} className="rounded-full px-2.5 py-1 text-xs font-medium text-earth ring-1 ring-forest/15">
              {size}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          {mode === "b2b" ? (
            <>
              <p className="text-sm text-earth">
                MOQ: <span className="font-semibold text-forest">{product.moq}</span>
              </p>
              <button
                type="button"
                onClick={() => onRequestQuote?.(product)}
                className="relative z-10 min-h-11 rounded-full bg-turmeric px-5 text-sm font-semibold text-forest transition-colors hover:bg-[#d39a1d]"
              >
                Request Quote
              </button>
            </>
          ) : (
            <a
              href={buildWhatsAppLink({ products: [product.name], message: "I'd like to enquire about this product." })}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-flex min-h-11 items-center gap-2 rounded-full bg-moss px-5 text-sm font-semibold text-white transition-colors hover:bg-forest"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              Enquire
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
