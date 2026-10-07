"use client";

import { useId, useState } from "react";
import { Leaf, Pause, Play } from "lucide-react";
import usePrefersReducedMotion from "@/lib/usePrefersReducedMotion";

const RING_TEXT = "100% ORGANIC • HIMAL ORGANIC • 100% ORGANIC • HIMAL ORGANIC • ";

// Circular text seal that turns slowly, with a pause button. Still with reduced motion.
export default function TrustSeal() {
  const ringId = useId();
  const reduceMotion = usePrefersReducedMotion();
  const [paused, setPaused] = useState(false);

  return (
    <div className="relative size-72 md:size-96">
      {/* Static rings behind the seal */}
      <div aria-hidden="true" className="absolute -inset-5 rounded-full border border-dashed border-forest/15 md:-inset-10" />
      <div aria-hidden="true" className="absolute -inset-20 hidden rounded-full border border-forest/10 md:block" />

      <svg
        aria-hidden="true"
        viewBox="0 0 200 200"
        className={`relative size-full animate-spin drop-shadow-[0_30px_40px_rgb(31_61_43/0.25)] [animation-duration:40s] motion-reduce:animate-none ${
          paused ? "[animation-play-state:paused]" : ""
        }`}
      >
        <defs>
          <path id={ringId} d="M100 100 m-74 0 a74 74 0 1 1 148 0 a74 74 0 1 1 -148 0" />
        </defs>
        <circle cx="100" cy="100" r="99" className="fill-forest" />
        <circle cx="100" cy="100" r="92" fill="none" strokeWidth="0.75" strokeDasharray="1.5 3" className="stroke-cream/40" />
        <circle cx="100" cy="100" r="58" fill="none" strokeWidth="0.75" className="stroke-cream/30" />
        <text className="fill-cream font-sans text-[11.5px] font-semibold">
          <textPath href={`#${ringId}`} textLength="463" lengthAdjust="spacing">
            {RING_TEXT}
          </textPath>
        </text>
      </svg>

      {/* The centre stays still while the ring turns */}
      <div aria-hidden="true" className="absolute inset-[26%] grid place-items-center rounded-full bg-turmeric text-forest">
        <Leaf className="size-1/2" strokeWidth={1.25} />
      </div>

      {!reduceMotion && (
        <button
          type="button"
          onClick={() => setPaused(!paused)}
          aria-label={paused ? "Play seal animation" : "Pause seal animation"}
          className="absolute bottom-1 right-1 grid size-11 place-items-center rounded-full bg-cream text-forest shadow-lg shadow-forest/15 ring-1 ring-forest/15 transition-colors hover:bg-forest hover:text-cream md:bottom-4 md:right-4"
        >
          {paused ? <Play className="size-4" aria-hidden="true" /> : <Pause className="size-4" aria-hidden="true" />}
        </button>
      )}
    </div>
  );
}
