"use client";

import { useMemo, useState } from "react";
import PillGroup from "@/components/PillGroup";
import ProductCard from "@/components/ProductCard";
import ProductGrid from "@/components/ProductGrid";
import { useQuote } from "@/components/b2b/QuoteProvider";

// products: raw items only. categories: the categories that have at least one of them.
export default function B2BCatalog({ products, categories }) {
  const { isSelected, toggle, openQuote } = useQuote();
  const [category, setCategory] = useState("all");

  const visible = useMemo(
    () => products.filter((p) => category === "all" || p.category === category).sort((a, b) => a.name.localeCompare(b.name)),
    [products, category]
  );

  return (
    <>
      <PillGroup
        label="Category"
        options={[{ value: "all", label: "All" }, ...categories.map((c) => ({ value: c.slug, label: c.label }))]}
        value={category}
        onChange={setCategory}
        layoutId="b2b-category-pill"
        pillClass="bg-turmeric"
        activeText="text-forest"
        idleText="text-cream/80 hover:text-cream"
        className="no-scrollbar -mx-5 mt-10 flex snap-x gap-1 overflow-x-auto px-5 md:-mx-8 md:px-8 lg:mx-0 lg:flex-wrap lg:px-0"
      />
      <p className="mt-6 text-cream/70" aria-live="polite">
        Showing <span className="font-semibold text-cream">{visible.length}</span> of {products.length} products · tick
        “Add to quote” on several to ask for them together.
      </p>
      <ProductGrid
        className="mt-6"
        columns={3}
        products={visible}
        renderCard={(product) => (
          <ProductCard
            product={product}
            mode="b2b"
            selected={isSelected(product)}
            onToggleSelect={toggle}
            onRequestQuote={(p) => openQuote([p])}
          />
        )}
      />
    </>
  );
}
