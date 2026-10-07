import {
  ArrowRight,
  BadgePercent,
  CalendarSync,
  ChefHat,
  ClipboardCheck,
  FileText,
  Handshake,
  Hotel,
  MessageCircle,
  ShieldCheck,
  Store,
  Truck,
  UtensilsCrossed,
} from "lucide-react";
import products from "@/data/products.json";
import { CATEGORIES } from "@/data/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import CountUp from "@/components/CountUp";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import Stepper from "@/components/Stepper";
import B2BCatalog from "@/components/b2b/B2BCatalog";
import QuoteProvider from "@/components/b2b/QuoteProvider";
import RequestQuoteButton from "@/components/b2b/RequestQuoteButton";

export const metadata = {
  title: "Wholesale & Bulk Orders",
  description:
    "Bulk organic grains, pulses, spices, vegetables and dairy from Himalayan farms for restaurants, hotels, retailers and caterers. Request a quote on WhatsApp.",
};

// B2B shows raw items only
const RAW = products.filter((p) => p.type === "raw");
const RAW_CATEGORIES = CATEGORIES.filter((c) => RAW.some((p) => p.category === c.slug));
const MIN_MOQ_KG = Math.min(...RAW.filter((p) => /kg$/.test(p.moq)).map((p) => parseFloat(p.moq)));

const HERO_CHIPS = [
  { Icon: BadgePercent, label: "Bulk Pricing" },
  { Icon: CalendarSync, label: "Regular Supply" },
  { Icon: Truck, label: "Pan-India Delivery" },
];

const STATS = [
  { value: RAW.length, suffix: "", label: "Raw products in bulk" },
  { value: RAW_CATEGORIES.length, suffix: "", label: "Product categories" },
  { value: 500, suffix: "+", label: "Partner farmers" }, // TODO: placeholder, confirm with client
];

// TODO: confirm these promises with the client before launch
const BENEFITS = [
  { Icon: BadgePercent, title: "Bulk Pricing", text: "Better rates as your order size grows." },
  { Icon: ShieldCheck, title: "Consistent Quality", text: "Every batch is cleaned, sorted and checked before dispatch." },
  { Icon: CalendarSync, title: "Reliable Supply", text: "Weekly or monthly deliveries you can plan your menu around." },
  { Icon: ClipboardCheck, title: "Quality Assurance", text: "Certificates and lab reports shared on request." },
];

const AUDIENCES = [
  { Icon: UtensilsCrossed, title: "Restaurants", text: "Staples and spices for busy kitchens." },
  { Icon: Hotel, title: "Hotels", text: "Pantry supplies for in-house dining." },
  { Icon: Store, title: "Retailers", text: "Organic stock for your shelves." },
  { Icon: ChefHat, title: "Caterers", text: "Large quantities for events." },
];

// Icons as elements: this is a Server Component, and components can't be passed to the client Stepper
const STEPS = [
  { icon: <MessageCircle />, title: "Enquiry", text: "Tell us what you need and how much." },
  { icon: <FileText />, title: "Quote", text: "We share prices, minimum orders and timelines." },
  { icon: <Handshake />, title: "Confirmation", text: "Confirm the order and the delivery schedule." },
  { icon: <Truck />, title: "Delivery", text: "Packed in bulk and shipped to your city." },
];

const glass = "rounded-[1.75rem] bg-forest/50 ring-1 ring-cream/10 backdrop-blur-md";

function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-forest pb-20 pt-32 lg:pb-28 lg:pt-40">
      {/* Static grain + warm glow + mountain lines */}
      <div aria-hidden="true" className="grain pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-soft-light" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 size-[44rem] rounded-full bg-turmeric/15 blur-3xl" />
      <svg
        aria-hidden="true"
        viewBox="0 0 600 160"
        className="pointer-events-none absolute bottom-0 left-0 w-[min(100%,52rem)] text-cream/10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M0 160 L110 70 L160 100 L260 20 L330 80 L380 55 L470 120 L520 90 L600 140" />
        <path d="M0 160 L140 110 L210 130 L300 70 L380 120 L450 100 L600 160" />
      </svg>

      <div className="wrap relative grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <p className="eyebrow animate-rise text-turmeric">For businesses</p>
          <h1 className="mt-5 animate-rise font-display text-display text-cream [animation-delay:100ms]">
            Wholesale Organic Supply for Businesses
          </h1>
          <p className="mt-6 max-w-xl animate-rise text-lg text-cream/80 [animation-delay:200ms] md:text-xl">
            Raw grains, pulses, spices, vegetables and dairy from Himalayan farms, supplied in bulk to kitchens and stores
            across India.
          </p>
          <ul className="mt-7 flex animate-rise flex-wrap gap-2 [animation-delay:260ms]">
            {HERO_CHIPS.map(({ Icon, label }) => (
              <li key={label} className="inline-flex items-center gap-2 rounded-full bg-cream/[0.06] px-4 py-2 text-sm font-semibold text-cream ring-1 ring-cream/20">
                <Icon className="size-4 text-turmeric" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex animate-rise flex-wrap gap-3 [animation-delay:340ms]">
            <RequestQuoteButton className="inline-flex min-h-13 items-center rounded-full bg-turmeric px-7 font-semibold text-forest transition-colors hover:bg-cream" />
            <a
              href="#catalog"
              className="group inline-flex min-h-13 items-center gap-2 rounded-full px-7 font-semibold text-cream ring-1 ring-cream/30 transition-colors hover:bg-cream/10"
            >
              Browse catalog
              <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        <div className="animate-rise [animation-delay:240ms] lg:col-span-5">
          <div className={`${glass} p-8 md:p-10`}>
            <p className="eyebrow text-turmeric">At a glance</p>
            <dl className="mt-6 divide-y divide-cream/10">
              {STATS.map((stat) => (
                <div key={stat.label} className="flex items-baseline justify-between gap-6 py-5 first:pt-0">
                  <dt className="text-cream/75">{stat.label}</dt>
                  <dd className="font-display text-5xl text-cream">
                    <CountUp value={stat.value} suffix={stat.suffix} />
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-2 rounded-2xl bg-cream/[0.06] px-5 py-4 text-sm text-cream/80">
              Minimum orders start at <span className="font-semibold text-cream">{MIN_MOQ_KG} kg</span>, depending on the product.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function B2BPage() {
  return (
    <QuoteProvider catalog={RAW}>
      <div className="bg-pine text-cream">
        <Hero />

        {/* Benefits */}
        <section className="section">
          <div className="wrap">
            <Reveal>
              <SectionHeading tone="dark" eyebrow="Why buy from us" title="Built for regular, reliable supply" />
            </Reveal>
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {BENEFITS.map(({ Icon, title, text }, i) => (
                <li key={title}>
                  <Reveal delay={i * 0.08} className="h-full">
                    <div className={`${glass} h-full p-7 transition duration-500 hover:-translate-y-1 hover:ring-turmeric/40`}>
                      <span className="grid size-14 place-items-center rounded-full bg-turmeric text-forest">
                        <Icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
                      </span>
                      <h3 className="mt-8 font-display text-2xl">{title}</h3>
                      <p className="mt-2 text-cream/75">{text}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Catalog */}
        <section id="catalog" className="section scroll-mt-20 pt-0 lg:pt-0">
          <div className="wrap">
            <Reveal>
              <SectionHeading tone="dark" eyebrow="Wholesale catalog" title="Raw organic produce, in bulk">
                Every product below is available for bulk orders. Prices depend on quantity and how often you order.
              </SectionHeading>
            </Reveal>
            <B2BCatalog products={RAW} categories={RAW_CATEGORIES} />
          </div>
        </section>

        {/* Who we serve */}
        <section className="section bg-forest">
          <div className="wrap">
            <Reveal>
              <SectionHeading tone="dark" eyebrow="Who we serve" title="Kitchens and stores of every size" />
            </Reveal>
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {AUDIENCES.map(({ Icon, title, text }, i) => (
                <li key={title}>
                  <Reveal delay={i * 0.08} className="h-full">
                    {/* Hover glow */}
                    <div className="group h-full rounded-[1.75rem] bg-pine/60 p-7 ring-1 ring-cream/10 transition duration-500 hover:bg-pine hover:shadow-[0_0_60px_-12px_rgb(224_165_38/0.45)] hover:ring-turmeric/50">
                      <Icon
                        className="size-10 text-turmeric transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      <h3 className="mt-8 font-display text-2xl">{title}</h3>
                      <p className="mt-2 text-cream/75">{text}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* How bulk ordering works */}
        <section className="section">
          <div className="wrap">
            <Reveal>
              <SectionHeading tone="dark" eyebrow="How it works" title="How bulk ordering works" />
            </Reveal>
            <Stepper steps={STEPS} tone="dark" iconBg="bg-pine" className="mt-14" />
          </div>
        </section>

        {/* Final call to action */}
        <section className="section pt-0 lg:pt-0">
          <div className="wrap">
            <Reveal>
              <div className="relative overflow-hidden rounded-[2.5rem] bg-turmeric px-7 py-16 text-forest md:px-16 md:py-20">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 600 240"
                  className="pointer-events-none absolute -bottom-2 right-0 w-[min(100%,40rem)] text-forest/15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M0 240 L110 120 L160 160 L260 40 L330 120 L380 90 L470 170 L520 130 L600 200" />
                </svg>
                <div className="relative max-w-2xl">
                  <h2 className="font-display text-h2">Ready to stock up?</h2>
                  <p className="mt-5 text-lg">
                    Tell us the products and quantities you need. We&apos;ll reply on WhatsApp with prices and delivery
                    options.
                  </p>
                  <div className="mt-10 flex flex-wrap gap-3">
                    <RequestQuoteButton className="inline-flex min-h-13 items-center rounded-full bg-forest px-7 font-semibold text-cream transition-colors hover:bg-pine" />
                    <a
                      href={buildWhatsAppLink({ type: "Business", message: "I'd like to discuss a bulk order." })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-13 items-center gap-2 rounded-full px-7 font-semibold text-forest ring-1 ring-forest/30 transition-colors hover:bg-forest/10"
                    >
                      <MessageCircle className="size-5" aria-hidden="true" />
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </QuoteProvider>
  );
}
