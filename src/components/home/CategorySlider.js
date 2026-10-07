"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Bean, Carrot, Cookie, Flame, Milk, Popcorn, Soup, Wheat } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { CATEGORIES } from "@/data/site";

const ICONS = {
  vegetables: Carrot,
  grains: Wheat,
  cereals: Soup,
  pulses: Bean,
  dairy: Milk,
  spices: Flame,
  snacks: Popcorn,
  wafers: Cookie,
};

// Lets a mouse drag the row sideways. Touch and trackpads already scroll natively.
function useDragScroll(ref) {
  useEffect(() => {
    const el = ref.current;
    let startX = 0;
    let startLeft = 0;
    let dragging = false;
    let moved = false;

    const onDown = (e) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      dragging = true;
      moved = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
    };
    const onMove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 5) {
        moved = true;
        el.dataset.dragging = "true"; // turns off snapping while dragging
      }
      if (moved) el.scrollLeft = startLeft - dx;
    };
    const onUp = () => {
      dragging = false;
      delete el.dataset.dragging;
    };
    // A drag should not count as a click on the card under the pointer
    const onClick = (e) => {
      if (!moved) return;
      e.preventDefault();
      e.stopPropagation();
      moved = false;
    };

    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    el.addEventListener("click", onClick, true);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      el.removeEventListener("click", onClick, true);
    };
  }, [ref]);
}

export default function CategorySlider({ counts }) {
  const rowRef = useRef(null);
  useDragScroll(rowRef);

  const scrollByCard = (direction) =>
    rowRef.current.scrollBy({ left: direction * rowRef.current.clientWidth * 0.75, behavior: "smooth" });

  return (
    <section className="section pt-0 lg:pt-0">
      <div className="wrap">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Categories" title="Browse by category" />
          <div className="flex items-center gap-3">
            {[-1, 1].map((direction) => {
              const Arrow = direction < 0 ? ArrowLeft : ArrowRight;
              return (
                <button
                  key={direction}
                  type="button"
                  onClick={() => scrollByCard(direction)}
                  aria-label={direction < 0 ? "Scroll categories left" : "Scroll categories right"}
                  className="hidden size-12 place-items-center rounded-full text-forest ring-1 ring-forest/20 transition-colors hover:bg-forest hover:text-cream md:grid"
                >
                  <Arrow className="size-5" aria-hidden="true" />
                </button>
              );
            })}
          </div>
        </Reveal>
      </div>

      {/* Full-width row; .bleed-x lines the first card up with the page content */}
      <Reveal delay={0.1}>
        <ul
          ref={rowRef}
          data-lenis-prevent-horizontal
          className="bleed-x no-scrollbar mt-10 flex cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto pb-4 select-none active:cursor-grabbing data-[dragging]:snap-none"
        >
          {CATEGORIES.map(({ slug, label }) => {
            const Icon = ICONS[slug];
            const count = counts[slug] ?? 0;
            return (
              <li key={slug} className="shrink-0 snap-start">
                <Link
                  href={`/b2c?category=${slug}`}
                  draggable={false}
                  className="group flex h-full w-44 flex-col rounded-[1.5rem] bg-white/60 p-5 ring-1 ring-forest/[0.06] transition duration-500 ease-[var(--ease-soft)] hover:-translate-y-1 hover:bg-white hover:shadow-[0_20px_40px_-24px_rgb(31_61_43/0.35)] md:w-52 md:p-6"
                >
                  <span className="grid size-14 place-items-center rounded-full bg-mist text-forest transition-colors duration-500 group-hover:bg-forest group-hover:text-cream">
                    <Icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="mt-8 font-display text-2xl text-forest">{label}</span>
                  <span className="mt-1 text-sm text-earth">
                    {count} {count === 1 ? "product" : "products"}
                  </span>
                </Link>
              </li>
            );
          })}
          <li className="shrink-0 snap-start">
            <Link
              href="/b2c"
              draggable={false}
              className="group flex h-full w-44 flex-col justify-between rounded-[1.5rem] bg-forest p-5 text-cream transition duration-500 ease-[var(--ease-soft)] hover:-translate-y-1 md:w-52 md:p-6"
            >
              <span className="font-display text-2xl">View all products</span>
              <ArrowRight
                className="size-6 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </li>
        </ul>
      </Reveal>
    </section>
  );
}
