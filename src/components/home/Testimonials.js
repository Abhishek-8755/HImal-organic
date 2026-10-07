"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, Quote } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import usePrefersReducedMotion from "@/lib/usePrefersReducedMotion";

// TODO: placeholder testimonials. Replace with real ones (with permission) before launch.
const TESTIMONIALS = [
  {
    quote: "The rajma cooks soft and creamy, and tastes like the ones my grandmother used to bring back from the hills.",
    name: "Ananya S.",
    role: "Home buyer, Delhi",
  },
  {
    quote: "We moved our kitchen to their red rice and millets. The quality is the same every month, and ordering on WhatsApp is easy.",
    name: "Rohit M.",
    role: "Restaurant owner, Dehradun",
  },
  {
    quote: "Our guests ask about the timur chutney every season. Getting it straight from the source makes all the difference.",
    name: "Kavita R.",
    role: "Homestay host, Mussoorie",
  },
];

const INTERVAL = 6000;

export default function Testimonials() {
  const reduceMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(null); // null = follow the reduced-motion setting
  const [paused, setPaused] = useState(false); // hover or keyboard focus inside
  const isPlaying = playing ?? !reduceMotion;

  useEffect(() => {
    if (!isPlaying || paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % TESTIMONIALS.length), INTERVAL);
    return () => clearInterval(id);
  }, [isPlaying, paused]);

  const go = (step) => setIndex((i) => (i + step + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <section
      className="section bg-white/40"
      aria-roledescription="carousel"
      aria-label="Customer testimonials"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setPaused(false)}
    >
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
        <Reveal className="flex flex-col justify-between gap-10 lg:col-span-4">
          <SectionHeading eyebrow="Kind words" title="Loved in kitchens big and small" />

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="grid size-12 place-items-center rounded-full text-forest ring-1 ring-forest/20 transition-colors hover:bg-forest hover:text-cream"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setPlaying(!isPlaying)}
              aria-label={isPlaying ? "Pause testimonials" : "Play testimonials"}
              className="grid size-12 place-items-center rounded-full bg-forest text-cream transition-colors hover:bg-moss"
            >
              {isPlaying ? <Pause className="size-5" aria-hidden="true" /> : <Play className="size-5" aria-hidden="true" />}
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="grid size-12 place-items-center rounded-full text-forest ring-1 ring-forest/20 transition-colors hover:bg-forest hover:text-cream"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
            <p className="ml-2 text-sm tabular-nums text-earth">
              {index + 1} / {TESTIMONIALS.length}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-8">
          {/* All quotes share one grid cell, so the box keeps the tallest quote's height */}
          <div
            className="grid rounded-[2rem] bg-cream p-8 ring-1 ring-forest/[0.06] md:p-12"
            aria-live={isPlaying && !paused ? "off" : "polite"}
          >
            {TESTIMONIALS.map((t, i) => {
              const active = i === index;
              return (
                <figure
                  key={t.name}
                  aria-hidden={!active}
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${TESTIMONIALS.length}`}
                  // The old quote fades out first, then the new one fades in, so they never overlap
                  className={`[grid-area:1/1] transition-[opacity,transform,visibility] ease-[var(--ease-soft)] ${
                    active
                      ? "visible translate-y-0 opacity-100 delay-300 duration-500"
                      : "invisible -translate-y-2 opacity-0 duration-300"
                  }`}
                >
                  <Quote className="size-10 text-moss" strokeWidth={1.5} aria-hidden="true" />
                  <blockquote className="mt-6 font-display text-2xl leading-snug text-forest md:text-[2.1rem]">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-8">
                    <span className="font-semibold text-forest">{t.name}</span>
                    <span className="text-earth"> · {t.role}</span>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
