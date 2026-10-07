"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import QuoteModal from "@/components/QuoteModal";
import useBottomBar from "@/lib/useBottomBar";

const QuoteContext = createContext(null);
export const useQuote = () => useContext(QuoteContext);

// B2B page state: the "Add to quote" basket and the quote modal.
// catalog: the products a buyer can add inside the modal (raw items only).
export default function QuoteProvider({ catalog, children }) {
  const [selected, setSelected] = useState([]);
  const [modal, setModal] = useState(null); // { products, id } while open

  const value = useMemo(
    () => ({
      selected,
      isSelected: (product) => selected.some((p) => p.slug === product.slug),
      toggle: (product) =>
        setSelected((list) =>
          list.some((p) => p.slug === product.slug) ? list.filter((p) => p.slug !== product.slug) : [...list, product]
        ),
      // A new id per opening gives a fresh form, even if the last one is still animating out
      openQuote: (products = []) => setModal({ products, id: Date.now() }),
    }),
    [selected]
  );

  const showBasket = selected.length > 0 && !modal;
  useBottomBar(showBasket);
  const count = `${selected.length} ${selected.length === 1 ? "product" : "products"} selected`;

  return (
    <QuoteContext.Provider value={value}>
      {children}

      {/* Floating basket: the WhatsApp button steps aside while it shows */}
      <AnimatePresence>
        {showBasket && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex justify-center px-4"
          >
            <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-cream p-1.5 pl-5 text-forest shadow-[0_20px_50px_-12px_rgb(0_0_0/0.5)] ring-1 ring-forest/10">
              <p className="text-sm font-semibold" aria-live="polite">
                {count}
              </p>
              <button
                type="button"
                onClick={() => setModal({ products: selected, id: Date.now() })}
                className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-forest px-5 text-sm font-semibold text-cream transition-colors hover:bg-pine"
              >
                Get Quote
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setSelected([])}
                aria-label="Clear selection"
                className="grid size-11 place-items-center rounded-full transition-colors hover:bg-forest/10"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modal && (
          <QuoteModal
            key={modal.id}
            products={modal.products}
            catalog={catalog}
            onClose={() => setModal(null)}
            // Sent products leave the basket
            onSuccess={(slugs) => setSelected((list) => list.filter((p) => !slugs.includes(p.slug)))}
          />
        )}
      </AnimatePresence>
    </QuoteContext.Provider>
  );
}
