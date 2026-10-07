"use client";

import { AnimatePresence, motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

const COLUMNS = {
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
};

// Responsive product grid (3 or 4 columns at most). When the list changes, cards fade
// out, the rest slide into place and new ones fade in with a short stagger.
export default function ProductGrid({ products, renderCard, columns = 4, className = "" }) {
  return (
    <ul className={`relative grid gap-5 ${COLUMNS[columns]} ${className}`}>
      {/* initial={false}: cards in the static HTML are visible straight away */}
      <AnimatePresence initial={false} mode="popLayout">
        {products.map((product, i) => (
          <motion.li
            key={product.slug}
            layout
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
            transition={{ duration: 0.45, ease: EASE, delay: Math.min(i, 8) * 0.03 }}
          >
            {renderCard(product)}
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
