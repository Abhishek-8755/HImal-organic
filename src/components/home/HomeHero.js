import { existsSync } from "node:fs";
import { join } from "node:path";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ScrollParallax from "@/components/ScrollParallax";
import HeroVisual from "@/components/home/HeroVisual";
import { FarMountains, FrontMountains, MidMountains } from "@/components/home/HeroMountains";

// Checked at build time: drop a model at public/models/hero.glb and the 3D hero uses it
const HERO_MODEL = existsSync(join(process.cwd(), "public/models/hero.glb")) ? "/models/hero.glb" : null;

// Warm sky inside the arch, behind the floating produce
function ArchSky() {
  return (
    <svg aria-hidden="true" viewBox="0 0 600 760" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
      <defs>
        <linearGradient id="arch-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F8F2E7" />
          <stop offset="0.6" stopColor="#F4E3BF" />
          <stop offset="1" stopColor="#EED29A" />
        </linearGradient>
        <radialGradient id="arch-glow">
          <stop offset="0" stopColor="#F2C14E" stopOpacity="0.6" />
          <stop offset="1" stopColor="#F2C14E" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="600" height="760" fill="url(#arch-sky)" />
      <circle cx="300" cy="340" r="290" fill="url(#arch-glow)" />
      <g fill="none" stroke="#E0A526" strokeOpacity="0.22" strokeWidth="1.5">
        <circle cx="300" cy="340" r="170" />
        <circle cx="300" cy="340" r="225" strokeDasharray="2 8" />
      </g>
      <circle cx="300" cy="340" r="118" fill="#EDB53A" />
      <g stroke="#1F3D2B" strokeOpacity="0.4" strokeWidth="2.5" fill="none" strokeLinecap="round">
        <path d="M110 150 q8 -8 16 0 q8 -8 16 0" />
        <path d="M160 118 q6 -6 12 0 q6 -6 12 0" />
      </g>
      <path
        d="M0 640 L80 600 L150 618 L240 560 L310 596 L400 540 L480 590 L560 566 L600 580 V760 H0 Z"
        fill="#DCE4D6"
      />
      <g fill="#FBF8F1">
        <path d="M240 560 L224 574 L234 571 L241 578 L249 571 L258 574 Z" />
        <path d="M400 540 L382 556 L393 552 L401 560 L410 552 L420 556 Z" />
      </g>
    </svg>
  );
}

// Layers, back to front: far + mid mountains, arch, front mountains, mist, text.
// The entrance uses CSS animations (not JS), so the headline shows on first paint.
export default function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden bg-[linear-gradient(180deg,var(--color-cream)_0%,#F6EEDD_70%,#F2E8D2_100%)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-10 size-[44rem] rounded-full bg-turmeric/15 blur-3xl"
      />
      <FarMountains />
      <MidMountains />

      <div className="wrap relative grid min-h-svh items-center gap-14 pb-28 pt-28 lg:grid-cols-12 lg:gap-10 lg:pb-24 lg:pt-32">
        <div className="relative z-20 lg:col-span-7">
          <p className="eyebrow animate-rise">Pure · Organic · Himalayan</p>
          <h1 className="mt-6 animate-rise font-display text-display text-forest [animation-delay:120ms]">
            Pure Organic Food, Straight from the <em className="text-moss">Himalayas</em>
          </h1>
          <p className="mt-7 max-w-xl animate-rise text-lg text-ink/75 [animation-delay:240ms] md:text-xl">
            Grains, pulses, spices and snacks from Himalayan farms, for your home kitchen or your business.
          </p>
          <div className="mt-10 flex animate-rise flex-wrap gap-3 [animation-delay:360ms]">
            <Link
              href="/b2c"
              className="group inline-flex min-h-13 items-center gap-2.5 rounded-full bg-forest px-7 font-semibold text-cream transition-colors hover:bg-pine"
            >
              Shop for Home
              <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/b2b"
              className="inline-flex min-h-13 items-center rounded-full bg-cream/60 px-7 font-semibold text-forest ring-1 ring-forest/25 backdrop-blur-sm transition-colors hover:bg-cream hover:ring-forest/40"
            >
              Bulk Orders
            </Link>
          </div>
        </div>

        <div className="relative z-10 animate-rise [animation-delay:200ms] lg:col-span-5">
          <ScrollParallax distance={-90}>
            <div className="relative mx-auto aspect-[600/760] w-full max-w-[20rem] sm:max-w-sm lg:max-w-[28rem]">
              {/* Arch: corner radii are half the width, as % of a 600x760 box */}
              <div className="absolute inset-0 overflow-hidden rounded-b-[2rem] rounded-tl-[50%_39.5%] rounded-tr-[50%_39.5%] shadow-[0_40px_80px_-40px_rgb(31_61_43/0.45)] ring-1 ring-forest/10">
                <ArchSky />
              </div>
              <HeroVisual modelUrl={HERO_MODEL} />
            </div>
          </ScrollParallax>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-[15]">
        <FrontMountains />
        {/* Mist that fades the hills into the next section */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(180deg,transparent,var(--color-cream))]" />
      </div>
    </section>
  );
}
