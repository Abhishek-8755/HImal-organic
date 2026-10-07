import Link from "next/link";
import { ArrowUpRight, Building2, House } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

const CARDS = [
  {
    href: "/b2c",
    eyebrow: "For your home",
    title: "Home Buyers",
    text: "Everyday organic staples and hill snacks in family pack sizes. Browse, pick, and enquire on WhatsApp.",
    Icon: House,
    dark: false,
  },
  {
    href: "/b2b",
    eyebrow: "For your business",
    title: "Bulk & Wholesale",
    text: "Raw grains, pulses, spices and dairy in bulk for restaurants, hotels, retailers and caterers.",
    Icon: Building2,
    dark: true,
  },
];

export default function AudienceSplit() {
  return (
    <section className="section">
      <div className="wrap">
        <Reveal>
          <SectionHeading eyebrow="Two ways to shop" title="Who are you shopping for?" />
        </Reveal>

        {/* Desktop: the hovered (or focused) card grows to 60% and the other shrinks to 40% */}
        <Reveal delay={0.1} className="mt-12 flex flex-col gap-5 md:flex-row">
          {CARDS.map(({ href, eyebrow, title, text, Icon, dark }) => (
            <Link
              key={href}
              href={href}
              className={`group relative flex min-h-[22rem] flex-col justify-between overflow-hidden rounded-[2rem] p-8 transition-[flex-grow,transform] duration-700 ease-[var(--ease-soft)] md:min-h-[28rem] md:min-w-0 md:flex-1 md:p-10 md:hover:flex-[1.5] md:focus-visible:flex-[1.5] ${
                dark ? "bg-forest text-cream" : "bg-turmeric/20 text-forest"
              }`}
            >
              <Icon
                aria-hidden="true"
                strokeWidth={1}
                className={`absolute -bottom-10 -right-8 size-64 transition-transform duration-700 ease-[var(--ease-soft)] group-hover:-translate-y-2 group-hover:rotate-[-4deg] ${
                  dark ? "text-cream/[0.07]" : "text-forest/[0.07]"
                }`}
              />
              <div className="relative">
                <p className={`eyebrow ${dark ? "text-turmeric" : ""}`}>{eyebrow}</p>
                <h3 className="mt-4 font-display text-4xl md:text-5xl">{title}</h3>
                <p className={`mt-4 max-w-sm text-lg ${dark ? "text-cream/80" : "text-ink/75"}`}>{text}</p>
              </div>
              <span
                aria-hidden="true"
                className={`relative grid size-14 place-items-center rounded-full transition-transform duration-500 ease-[var(--ease-soft)] group-hover:rotate-45 ${
                  dark ? "bg-turmeric text-forest" : "bg-forest text-cream"
                }`}
              >
                <ArrowUpRight className="size-6" />
              </span>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
