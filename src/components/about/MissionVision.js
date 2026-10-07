import { Mountain, Target } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

// TODO: confirm the mission and vision wording with the client.
const CARDS = [
  {
    Icon: Target,
    eyebrow: "Our mission",
    title: "Honest food, fairly grown",
    text: "To bring chemical-free food from Himalayan farms to Indian kitchens, and to pay the hill families who grow it a fair price, on time.",
    dark: false,
  },
  {
    Icon: Mountain,
    eyebrow: "Our vision",
    title: "Hills that thrive on organic farming",
    text: "A future where every family can trust the label on their food, and every hill farm can make a good living by growing it the natural way.",
    dark: true,
  },
];

export default function MissionVision() {
  return (
    <section className="section pt-0 lg:pt-0">
      <div className="wrap">
        <Reveal>
          <SectionHeading eyebrow="What drives us" title="Our mission and vision" />
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {CARDS.map(({ Icon, eyebrow, title, text, dark }, i) => (
            <Reveal key={title} delay={i * 0.1} className="h-full">
              <article
                className={`group relative flex h-full min-h-[22rem] flex-col justify-between overflow-hidden rounded-[2rem] p-8 md:min-h-[26rem] md:p-12 ${
                  dark ? "bg-forest text-cream" : "bg-mist text-forest"
                }`}
              >
                <Icon
                  aria-hidden="true"
                  strokeWidth={0.75}
                  className={`absolute -bottom-12 -right-10 size-72 transition-transform duration-700 ease-[var(--ease-soft)] group-hover:-translate-y-2 group-hover:rotate-[-4deg] ${
                    dark ? "text-cream/[0.07]" : "text-forest/[0.07]"
                  }`}
                />
                <span
                  className={`relative grid size-16 place-items-center rounded-full ${
                    dark ? "bg-turmeric text-forest" : "bg-forest text-cream"
                  }`}
                >
                  <Icon className="size-7" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <div className="relative mt-12">
                  <p className={`eyebrow ${dark ? "text-turmeric" : ""}`}>{eyebrow}</p>
                  <h3 className="mt-3 font-display text-3xl md:text-4xl">{title}</h3>
                  <p className={`mt-4 max-w-md text-lg ${dark ? "text-cream/80" : "text-ink/75"}`}>{text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
