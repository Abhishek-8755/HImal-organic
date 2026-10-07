"use client";

import { useState } from "react";
import { Bean, Droplets, HandHeart, Shovel } from "lucide-react";
import Accordion from "@/components/Accordion";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

// TODO: confirm every claim below with the client before launch.
const PILLARS = [
  {
    Icon: Shovel,
    title: "Soil",
    line: "Living soil, never synthetic fertiliser.",
    detail: "Our partner farms feed their fields with compost and farmyard manure, rotate crops and let the land rest, so the soil stays rich year after year.",
  },
  {
    Icon: Bean,
    title: "Seeds",
    line: "Native seeds, saved season to season.",
    detail: "We grow hill varieties like red rice, rajma and mandua from open-pollinated seed that farmers save from each harvest. Nothing genetically modified.",
  },
  {
    Icon: HandHeart,
    title: "Farmers",
    line: "Small hill families, paid fairly.",
    detail: "We buy directly from the people who grow the food, agree the price before sowing, and pay on time, so organic farming stays worth their while.",
  },
  {
    Icon: Droplets,
    title: "Purity",
    line: "Nothing added, nothing taken away.",
    detail: "Every batch is cleaned, sorted and tested, then packed without polish, colour or preservatives. What reaches you is exactly what left the farm.",
  },
];

// Phones and tablets: the shared Accordion
const accordionItems = PILLARS.map(({ title, line, detail }) => ({
  question: title,
  answer: (
    <>
      <p className="font-semibold text-forest">{line}</p>
      <p className="mt-2">{detail}</p>
    </>
  ),
}));

export default function PromiseCards() {
  const [active, setActive] = useState(0);

  return (
    <section className="section bg-mist">
      <div className="wrap">
        <Reveal>
          <SectionHeading eyebrow="Our organic promise" title="Four things we never compromise on">
            Organic is more than skipping pesticides. It starts in the soil and ends at your door.
          </SectionHeading>
        </Reveal>

        <Reveal delay={0.1}>
          <Accordion items={accordionItems} defaultOpen={0} className="mt-12 lg:hidden" />

          {/* Desktop: hovering, clicking or focusing a card expands it while the others shrink */}
          <ul className="mt-14 hidden h-[30rem] gap-4 lg:flex">
            {PILLARS.map(({ Icon, title, line, detail }, i) => {
              const isActive = active === i;
              return (
                <li
                  key={title}
                  onMouseEnter={() => setActive(i)}
                  className={`relative flex min-w-0 flex-col justify-between overflow-hidden rounded-[2rem] p-7 transition-[flex-grow,background-color,color] duration-700 ease-[var(--ease-soft)] motion-reduce:transition-none xl:p-9 ${
                    isActive ? "flex-[2.2] bg-forest text-cream" : "flex-1 bg-cream/80 text-forest"
                  }`}
                >
                  <Icon
                    aria-hidden="true"
                    strokeWidth={0.75}
                    className={`absolute -bottom-10 -right-10 size-64 transition-opacity duration-700 ${
                      isActive ? "text-cream/[0.08]" : "text-forest/[0.06]"
                    }`}
                  />
                  <div className="relative flex items-start justify-between gap-4">
                    <span aria-hidden="true" className="font-display text-2xl tabular-nums opacity-60">
                      0{i + 1}
                    </span>
                    <span
                      className={`grid size-14 shrink-0 place-items-center rounded-full transition-colors duration-700 ${
                        isActive ? "bg-turmeric text-forest" : "bg-forest text-cream"
                      }`}
                    >
                      <Icon className="size-6" strokeWidth={1.5} aria-hidden="true" />
                    </span>
                  </div>

                  <div className="relative">
                    <h3 className="font-display text-3xl xl:text-4xl">
                      {/* The ::after overlay makes the whole card clickable */}
                      <button
                        type="button"
                        aria-expanded={isActive}
                        aria-controls={`promise-${i}`}
                        onClick={() => setActive(i)}
                        onFocus={() => setActive(i)}
                        className="text-left after:absolute after:inset-0 after:rounded-[2rem] after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-moss"
                      >
                        {title}
                      </button>
                    </h3>
                    {/* Closed cards collapse this to zero height, so every title sits at the bottom.
                        Fixed width, so the text does not re-wrap while the card grows. */}
                    <div
                      id={`promise-${i}`}
                      inert={!isActive}
                      className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-soft)] motion-reduce:transition-none ${
                        isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="w-[19rem] overflow-hidden xl:w-[24rem]">
                        <p className="mt-3 text-lg font-semibold">{line}</p>
                        <p className="mt-2 text-cream/80">{detail}</p>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
