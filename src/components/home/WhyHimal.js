import { Handshake, Leaf, ShieldCheck, Sprout } from "lucide-react";
import CountUp from "@/components/CountUp";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

// TODO: confirm every claim below with the client before launch.
const REASONS = [
  { Icon: Leaf, title: "100% Organic", text: "Grown without synthetic fertilisers or pesticides." },
  { Icon: Sprout, title: "Farm Fresh", text: "Harvested in season and packed close to the farm." },
  { Icon: ShieldCheck, title: "No Chemicals", text: "No artificial colours, polish or preservatives." },
  { Icon: Handshake, title: "Fair to Farmers", text: "Bought directly from hill farmers at fair prices." },
];

// TODO: placeholder numbers. Replace with the client's real figures.
const STATS = [
  { value: 500, suffix: "+", label: "Farmers" },
  { value: 50, suffix: "+", label: "Products" },
  { value: 100, suffix: "%", label: "Organic" },
];

export default function WhyHimal() {
  return (
    <section className="section bg-mist">
      <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-5">
          <SectionHeading eyebrow="Our promise" title="Why Himal Organic">
            Food the way the hills have always grown it: slowly, in small fields, and close to nature.
          </SectionHeading>

          <dl className="mt-12 grid grid-cols-3 gap-4 border-t border-forest/15 pt-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <dt className="text-sm text-earth">{stat.label}</dt>
                <dd className="order-first font-display text-4xl text-forest md:text-5xl">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
          {REASONS.map(({ Icon, title, text }, i) => (
            <li key={title}>
              <Reveal delay={i * 0.08} className="h-full">
                <div className="h-full rounded-[1.75rem] bg-cream/80 p-7 transition duration-500 ease-[var(--ease-soft)] hover:-translate-y-1 hover:bg-cream md:p-8">
                  <span className="grid size-14 place-items-center rounded-full bg-forest text-cream">
                    <Icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <h3 className="mt-8 font-display text-2xl text-forest">{title}</h3>
                  <p className="mt-2 text-ink/75">{text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
