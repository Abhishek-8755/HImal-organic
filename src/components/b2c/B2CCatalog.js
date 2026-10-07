"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { ArrowUpDown, ChevronDown, Search, X } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import QuickViewDrawer from "@/components/b2c/QuickViewDrawer";
import { CATEGORIES, categoryLabel } from "@/data/site";

const EASE = [0.22, 1, 0.36, 1];
const TYPES = [
  { value: "all", label: "All" },
  { value: "raw", label: "Raw" },
  { value: "processed", label: "Processed" },
];
const SORTS = [
  { value: "az", label: "A to Z" },
  { value: "newest", label: "Newest" },
];
const isCategory = (slug) => CATEGORIES.some((c) => c.slug === slug);

// Reads ?category= from the URL. It renders nothing, so wrapping only this in
// <Suspense> keeps the full product grid in the static HTML.
function CategoryFromUrl({ onChange }) {
  const slug = useSearchParams().get("category");
  useEffect(() => {
    onChange(isCategory(slug) ? slug : "all");
  }, [slug, onChange]);
  return null;
}

function writeCategoryToUrl(slug) {
  const url = new URL(window.location.href);
  if (slug === "all") url.searchParams.delete("category");
  else url.searchParams.set("category", slug);
  window.history.replaceState(null, "", `${url.pathname}${url.search}`);
}

// Pill buttons with one active background that slides between them
function PillGroup({ label, options, value, onChange, layoutId, className = "", pillClass, activeText, idleText }) {
  return (
    <div role="group" aria-label={label} className={className}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            className={`relative shrink-0 snap-start whitespace-nowrap rounded-full px-2.5 py-2.5 text-sm font-semibold transition-colors sm:px-4 ${
              active ? activeText : idleText
            }`}
          >
            {active && (
              <motion.span layoutId={layoutId} className={`absolute inset-0 rounded-full ${pillClass}`} transition={{ duration: 0.45, ease: EASE }} />
            )}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function EmptyState({ onClear }) {
  return (
    <div className="flex flex-col items-center py-20 text-center">
      <svg aria-hidden="true" viewBox="0 0 200 140" className="w-48">
        <ellipse cx="100" cy="128" rx="70" ry="8" fill="#1F3D2B" opacity=".08" />
        <path d="M30 66 C 34 108 66 124 100 124 C 134 124 166 108 170 66 Z" fill="#E8EFE6" stroke="#1F3D2B" strokeOpacity=".2" strokeWidth="2" />
        <ellipse cx="100" cy="66" rx="70" ry="12" fill="#F6F1E7" stroke="#1F3D2B" strokeOpacity=".2" strokeWidth="2" />
        <path d="M118 46 C 128 30 148 26 160 34 C 150 48 132 52 118 46 Z" fill="#4F7A4A" />
        <path d="M70 40 q-6 -10 0 -20 M88 34 q-6 -10 0 -20" stroke="#5B4636" strokeOpacity=".35" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </svg>
      <h2 className="mt-6 font-display text-3xl text-forest">Nothing matches yet</h2>
      <p className="mt-2 max-w-sm text-ink/75">Try a different word, or clear the filters to see everything.</p>
      <button
        type="button"
        onClick={onClear}
        className="mt-7 inline-flex min-h-12 items-center rounded-full bg-forest px-7 font-semibold text-cream transition-colors hover:bg-moss"
      >
        Clear filters
      </button>
    </div>
  );
}

export default function B2CCatalog({ products }) {
  const lenis = useLenis();
  const barRef = useRef(null);
  const resultsRef = useRef(null);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState(""); // query after a 200ms pause in typing
  const [category, setCategory] = useState("all");
  const [type, setType] = useState("all");
  const [sort, setSort] = useState("az");
  const [quickView, setQuickView] = useState(null);

  useEffect(() => {
    const id = setTimeout(() => setSearch(query.trim()), 200);
    return () => clearTimeout(id);
  }, [query]);

  const visible = useMemo(() => {
    const q = search.toLowerCase();
    const list = products.filter(
      (p) =>
        (category === "all" || p.category === category) &&
        (type === "all" || p.type === type) &&
        (!q || p.name.toLowerCase().includes(q))
    );
    return list.sort((a, b) => (sort === "newest" ? b.addedOn.localeCompare(a.addedOn) : a.name.localeCompare(b.name)));
  }, [products, category, type, sort, search]);

  // After a filter change, bring the top of the results back into view if it is under the bars
  const revealResults = () =>
    requestAnimationFrame(() => {
      const results = resultsRef.current.getBoundingClientRect().top;
      const header = document.querySelector("header")?.offsetHeight ?? 0;
      const covered = header + barRef.current.offsetHeight + 16; // header comes back when scrolling up
      if (results >= covered) return;
      const target = window.scrollY + results - covered;
      if (lenis) lenis.scrollTo(target);
      else window.scrollTo({ top: target, behavior: "smooth" });
    });

  const chooseCategory = (slug) => {
    setCategory(slug);
    writeCategoryToUrl(slug);
    revealResults();
  };
  const chooseType = (value) => {
    setType(value);
    revealResults();
  };
  const clearFilters = () => {
    setQuery("");
    setSearch("");
    setType("all");
    chooseCategory("all");
  };

  const filtered = category !== "all" || type !== "all" || search;
  const count = `${visible.length} ${visible.length === 1 ? "product" : "products"}`;

  return (
    <>
      <Suspense fallback={null}>
        <CategoryFromUrl onChange={setCategory} />
      </Suspense>

      {/* Hero strip */}
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,var(--color-cream),#F4E7CC)] pb-14 pt-32 lg:pb-16 lg:pt-40">
        <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-20 size-[36rem] rounded-full bg-turmeric/20 blur-3xl" />
        <svg
          aria-hidden="true"
          viewBox="0 0 600 160"
          className="pointer-events-none absolute bottom-0 right-0 w-[min(100%,44rem)] text-forest/10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M0 160 L110 70 L160 100 L260 20 L330 80 L380 55 L470 120 L520 90 L600 140" />
          <path d="M0 160 L140 110 L210 130 L300 70 L380 120 L450 100 L600 160" />
        </svg>

        <div className="wrap relative">
          <p className="eyebrow animate-rise">For your home</p>
          <h1 className="mt-4 animate-rise font-display text-display text-forest [animation-delay:100ms]">Shop the Goodness</h1>
          <p className="mt-5 max-w-xl animate-rise text-lg text-ink/75 [animation-delay:200ms]">
            Everyday organic staples and hill snacks, picked and packed for home kitchens. Choose what you like and
            enquire on WhatsApp.
          </p>

          <div className="relative mt-9 max-w-xl animate-rise [animation-delay:300ms]">
            <label htmlFor="product-search" className="sr-only">
              Search products
            </label>
            <Search aria-hidden="true" className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-earth" />
            <input
              id="product-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search rajma, ghee, millet…"
              autoComplete="off"
              className="h-14 w-full rounded-full bg-white/80 pl-13 pr-14 text-base text-ink shadow-[0_12px_32px_-20px_rgb(31_61_43/0.4)] ring-1 ring-forest/15 placeholder:text-earth/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-moss [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full text-forest transition-colors hover:bg-forest/10"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Sticky filter bar: follows the header as it hides and comes back */}
      <div
        ref={barRef}
        className="sticky top-[var(--header-h)] z-30 border-b border-forest/10 bg-cream/85 backdrop-blur-md transition-[top] duration-400 ease-[var(--ease-soft)]"
      >
        <div className="wrap flex flex-col gap-3 py-3 xl:flex-row xl:items-center xl:justify-between xl:gap-6">
          <PillGroup
            label="Category"
            options={[{ value: "all", label: "All" }, ...CATEGORIES.map((c) => ({ value: c.slug, label: c.label }))]}
            value={category}
            onChange={chooseCategory}
            layoutId="category-pill"
            pillClass="bg-forest"
            activeText="text-cream"
            idleText="text-forest/80 hover:text-forest"
            className="no-scrollbar -mx-5 flex snap-x gap-1 overflow-x-auto px-5 md:-mx-8 md:px-8 xl:mx-0 xl:px-0"
          />
          <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
            <PillGroup
              label="Type"
              options={TYPES}
              value={type}
              onChange={chooseType}
              layoutId="type-pill"
              pillClass="bg-white shadow-sm"
              activeText="text-forest"
              idleText="text-forest/70 hover:text-forest"
              className="flex rounded-full bg-forest/[0.06] p-1"
            />
            <div className="relative">
              <label htmlFor="product-sort" className="sr-only">
                Sort products
              </label>
              <select
                id="product-sort"
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  revealResults();
                }}
                className="h-11 cursor-pointer appearance-none rounded-full bg-white/70 pl-8 pr-8 text-sm sm:pl-9 sm:pr-9 font-semibold text-forest ring-1 ring-forest/15 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-moss"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <ArrowUpDown aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-forest" />
              <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-forest" />
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <section ref={resultsRef} className="wrap scroll-mt-40 pb-20 pt-8 lg:pb-28" aria-label="Products">
        <div className="flex min-h-11 flex-wrap items-center justify-between gap-3">
          <p className="text-earth" aria-live="polite">
            Showing <span className="font-semibold text-forest">{count}</span>
            {category !== "all" && <> in {categoryLabel(category)}</>}
            {search && <> for “{search}”</>}
          </p>
          {filtered && (
            <button type="button" onClick={clearFilters} className="font-semibold text-forest underline underline-offset-4 hover:text-moss">
              Clear filters
            </button>
          )}
        </div>

        {visible.length === 0 ? (
          <EmptyState onClear={clearFilters} />
        ) : (
          <ul className="relative mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {/* initial={false}: cards in the static HTML are visible straight away */}
            <AnimatePresence initial={false} mode="popLayout">
              {visible.map((product, i) => (
                <motion.li
                  key={product.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.45, ease: EASE, delay: Math.min(i, 8) * 0.03 }}
                >
                  <ProductCard product={product} mode="b2c" highlight={search} onQuickView={setQuickView} />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </section>

      <AnimatePresence>
        {quickView && <QuickViewDrawer key={quickView.slug} product={quickView} onClose={() => setQuickView(null)} />}
      </AnimatePresence>
    </>
  );
}
