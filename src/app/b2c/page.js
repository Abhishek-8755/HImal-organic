import Link from "next/link";
import { ArrowRight } from "lucide-react";
import products from "@/data/products.json";
import B2CCatalog from "@/components/b2c/B2CCatalog";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "Shop for Home",
  description:
    "Organic grains, pulses, spices, dairy, wafers and snacks from Himalayan farms, in family pack sizes. Browse and enquire on WhatsApp.",
};

export default function B2CPage() {
  return (
    <>
      {/* B2C shows every product: raw and processed */}
      <B2CCatalog products={products} />

      <section className="wrap pb-20 lg:pb-28">
        <Reveal>
          <Link
            href="/b2b"
            className="group flex flex-col gap-6 rounded-[2rem] bg-forest px-8 py-10 text-cream transition-transform duration-500 ease-[var(--ease-soft)] hover:-translate-y-1 md:flex-row md:items-center md:justify-between md:px-12"
          >
            <div>
              <p className="eyebrow text-turmeric">For businesses</p>
              <p className="mt-3 font-display text-3xl md:text-4xl">Buying in bulk? Visit our business section.</p>
            </div>
            <span className="inline-flex min-h-13 shrink-0 items-center gap-2.5 self-start rounded-full bg-turmeric px-7 font-semibold text-forest md:self-auto">
              Bulk orders
              <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </Reveal>
      </section>
    </>
  );
}
