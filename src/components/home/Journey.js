"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { Microscope, Package, Sprout, Truck } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import Stepper from "@/components/Stepper";
import usePrefersReducedMotion from "@/lib/usePrefersReducedMotion";

const STEPS = [
  { Icon: Sprout, title: "Farm", text: "Grown in small hill fields by partner farmers.", tone: "bg-mist text-forest" },
  { Icon: Microscope, title: "Quality Check", text: "Every batch is cleaned, sorted and checked.", tone: "bg-white/70 text-forest" },
  { Icon: Package, title: "Packaging", text: "Packed hygienically to lock in freshness.", tone: "bg-turmeric/20 text-forest" },
  { Icon: Truck, title: "Delivery", text: "Shipped to homes and businesses across India.", tone: "bg-forest text-cream" },
];

const heading = <SectionHeading eyebrow="Farm to table" title="From our farms to your table" />;

// Phones, tablets and reduced motion: a plain row of steps
function SimpleJourney({ className = "" }) {
  return (
    <section className={`section ${className}`}>
      <div className="wrap">
        <Reveal>{heading}</Reveal>
        <Stepper steps={STEPS} className="mt-14" />
      </div>
    </section>
  );
}

// Desktop: the section pins while the step cards slide sideways and a progress line fills
function PinnedJourney() {
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const [distance, setDistance] = useState(0);
  const [step, setStep] = useState(0);

  // How far the track must slide so the last card ends at the right edge
  useEffect(() => {
    const measure = () => setDistance(Math.max(0, trackRef.current.scrollWidth - viewportRef.current.clientWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewportRef.current);
    observer.observe(trackRef.current);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  // Cards line up at progress 0, 1/3, 2/3 and 1, so round to the nearest one
  useMotionValueEvent(scrollYProgress, "change", (p) => setStep(Math.round(p * (STEPS.length - 1))));

  return (
    // One pixel of scroll moves the cards one pixel sideways
    <section ref={sectionRef} className="relative" style={{ height: distance ? `calc(100svh + ${distance}px)` : "300vh" }}>
      <div ref={viewportRef} className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <div className="wrap flex items-end justify-between gap-8">
          {heading}
          <p className="pb-2 font-display text-2xl tabular-nums text-forest" aria-hidden="true">
            0{step + 1}
            <span className="text-earth"> / 0{STEPS.length}</span>
          </p>
        </div>

        <motion.ol ref={trackRef} style={{ x }} className="bleed-x mt-12 flex w-max gap-6">
          {STEPS.map(({ Icon, title, text, tone }, i) => (
            <li
              key={title}
              className={`relative flex h-[min(52vh,30rem)] w-[30rem] shrink-0 flex-col justify-between overflow-hidden rounded-[2rem] p-10 ${tone}`}
            >
              <Icon
                aria-hidden="true"
                strokeWidth={0.75}
                className="absolute -bottom-12 -right-10 size-72 opacity-[0.08]"
              />
              <div className="relative flex items-start justify-between">
                {/* Outline digits: the stroke needs a real colour, since currentColor is transparent here */}
                <span
                  aria-hidden="true"
                  className={`font-display text-8xl leading-none text-transparent ${
                    tone.includes("bg-forest")
                      ? "[-webkit-text-stroke:1.5px_var(--color-cream)]"
                      : "[-webkit-text-stroke:1.5px_var(--color-forest)]"
                  }`}
                >
                  0{i + 1}
                </span>
                <span className="grid size-16 place-items-center rounded-full bg-current/10">
                  <Icon className="size-7" strokeWidth={1.5} aria-hidden="true" />
                </span>
              </div>
              <div className="relative">
                <h3 className="font-display text-4xl">
                  <span className="sr-only">Step {i + 1}: </span>
                  {title}
                </h3>
                <p className="mt-3 max-w-xs text-lg opacity-80">{text}</p>
              </div>
            </li>
          ))}
        </motion.ol>

        <div className="wrap mt-12" aria-hidden="true">
          <div className="relative h-0.5 rounded-full bg-forest/15">
            <motion.div style={{ scaleX: scrollYProgress }} className="absolute inset-0 origin-left rounded-full bg-moss" />
          </div>
          <div className="mt-4 grid grid-cols-4 text-sm">
            {STEPS.map(({ title }, i) => (
              <span key={title} className={i <= step ? "font-semibold text-forest" : "text-earth"}>
                {title}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Journey() {
  const reduceMotion = usePrefersReducedMotion();
  if (reduceMotion) return <SimpleJourney />;
  return (
    <>
      <SimpleJourney className="lg:hidden" />
      <div className="hidden lg:block">
        <PinnedJourney />
      </div>
    </>
  );
}
