"use client";

import { useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, X } from "lucide-react";
import useFocusTrap from "@/lib/useFocusTrap";
import useScrollLock from "@/lib/useScrollLock";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { categoryLabel } from "@/data/site";

const EASE = [0.22, 1, 0.36, 1];

// Right-side product preview. Render it inside <AnimatePresence> so it can slide out.
// Portalled to <body> so no parent layer (header, page fade) can paint over it.
export default function QuickViewDrawer({ product, onClose }) {
  const panelRef = useRef(null);
  useScrollLock(true);
  useFocusTrap(panelRef, true, onClose);

  return createPortal(
    <div className="fixed inset-0 z-[60]">
      <motion.div
        aria-hidden="true"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
      />
      <motion.aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-view-title"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.5, ease: EASE }}
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-cream shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-forest/10 px-6 py-4">
          <p className="eyebrow">Quick view</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close quick view"
            className="grid size-11 place-items-center rounded-full text-forest ring-1 ring-forest/15 transition-colors hover:bg-forest hover:text-cream"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div data-lenis-prevent className="flex-1 overflow-y-auto px-6 py-6">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-mist">
            <Image src={product.images[0]} alt={product.name} fill sizes="28rem" className="object-cover" />
            <span className="absolute left-3 top-3 rounded-full bg-turmeric px-3 py-1 text-xs font-bold text-forest">
              Organic
            </span>
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-earth">
            {categoryLabel(product.category)}
          </p>
          <h2 id="quick-view-title" className="mt-1.5 font-display text-3xl text-forest">
            {product.name}
          </h2>
          <p className="mt-3 text-ink/75">{product.description}</p>

          {product.benefits?.length > 0 && (
            <ul className="mt-5 space-y-1.5 text-sm text-ink/80">
              {product.benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-2">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-moss" />
                  {benefit}
                </li>
              ))}
            </ul>
          )}

          <h3 className="mt-6 text-sm font-semibold text-forest">Pack sizes</h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {product.packSizes.map((size) => (
              <li key={size} className="rounded-full px-3 py-1.5 text-sm font-medium text-earth ring-1 ring-forest/15">
                {size}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3 border-t border-forest/10 px-6 py-5">
          <a
            href={buildWhatsAppLink({ products: [product.name], message: "I'd like to enquire about this product." })}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-moss px-6 font-semibold text-white transition-colors hover:bg-forest"
          >
            <MessageCircle className="size-5" aria-hidden="true" />
            Enquire on WhatsApp
          </a>
          <Link
            href={`/products/${product.slug}`}
            className="group inline-flex min-h-11 items-center justify-center gap-2 font-semibold text-forest underline-offset-4 hover:underline"
          >
            View full details
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </motion.aside>
    </div>,
    document.body
  );
}
