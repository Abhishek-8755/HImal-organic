import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

export default function FeaturedProducts({ products }) {
  return (
    <section className="section bg-white/40">
      <div className="wrap">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Featured" title="Fresh from the hills">
            A few favourites from this season&apos;s harvest.
          </SectionHeading>
          <Link
            href="/b2c"
            className="group inline-flex min-h-11 items-center gap-2 font-semibold text-forest underline-offset-4 hover:underline"
          >
            Shop all products
            <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, i) => (
            <li key={product.slug}>
              <Reveal delay={(i % 4) * 0.08} className="h-full">
                <ProductCard product={product} mode="b2c" />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
