"use client";

import { useState } from "react";
import Image from "next/image";
import { Quote, RotateCw } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

// TODO: placeholder names, photos and bios. Replace with the real team (with permission).
const TEAM = [
  {
    name: "Meera Rawat",
    role: "Founder",
    image: "/images/about/team-1.svg",
    bio: "Grew up between terraced fields and her grandmother's kitchen. Started Himal Organic to bring that food to the cities without losing what made it special.",
  },
  {
    name: "Kunal Bisht",
    role: "Farmer partnerships",
    image: "/images/about/team-2.svg",
    bio: "Spends most weeks on the road between villages, meeting growers, planning the season's crops and making sure every family is paid on time.",
  },
  {
    name: "Asha Joshi",
    role: "Quality and food safety",
    image: "/images/about/team-3.svg",
    bio: "A food technologist who checks every batch before it is packed, and keeps the records that let us trace each pack back to its farm.",
  },
];

// Flips on hover (mouse), and on tap or Enter/Space via the button over the card
function FlipCard({ person }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="group relative perspective-distant">
      <div
        className={`relative aspect-[4/5] transition-transform duration-700 ease-[var(--ease-soft)] transform-3d group-hover:rotate-y-180 motion-reduce:transition-none ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front */}
        <div className="absolute inset-0 overflow-hidden rounded-[2rem] bg-mist ring-1 ring-forest/10 backface-hidden">
          <Image
            src={person.image}
            alt={`Portrait of ${person.name}`}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(0deg,rgb(31_61_43/0.92),rgb(31_61_43/0.6)_55%,transparent)] p-7 pt-24 text-cream">
            <h3 className="font-display text-3xl">{person.name}</h3>
            <p className="mt-1 text-cream/85">{person.role}</p>
          </div>
          <span
            aria-hidden="true"
            className="absolute right-5 top-5 grid size-11 place-items-center rounded-full bg-cream/85 text-forest backdrop-blur transition-transform duration-500 group-hover:rotate-180"
          >
            <RotateCw className="size-5" />
          </span>
        </div>

        {/* Back */}
        <div className="absolute inset-0 flex rotate-y-180 flex-col justify-between rounded-[2rem] bg-forest p-8 text-cream backface-hidden md:p-9">
          <Quote className="size-9 text-turmeric" strokeWidth={1.5} aria-hidden="true" />
          <p className="text-lg leading-relaxed text-cream/90">{person.bio}</p>
          <div aria-hidden="true">
            <p className="font-display text-2xl">{person.name}</p>
            <p className="text-sm text-cream/70">{person.role}</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-pressed={flipped}
        onClick={() => setFlipped(!flipped)}
        className="absolute inset-0 rounded-[2rem]"
      >
        <span className="sr-only">Show {person.name}&apos;s bio</span>
      </button>
    </div>
  );
}

export default function TeamCards() {
  return (
    <section className="section bg-mist">
      <div className="wrap">
        <Reveal>
          <SectionHeading eyebrow="The people behind it" title="Meet the team">
            The people who walk the fields, check every batch and answer your messages. Hover or tap a card to meet
            them.
          </SectionHeading>
        </Reveal>

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((person, i) => (
            <li key={person.name}>
              <Reveal delay={i * 0.08}>
                <FlipCard person={person} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
