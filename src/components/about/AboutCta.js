import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";

export default function AboutCta() {
  return (
    <section className="section">
      <div className="wrap">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-forest px-7 py-16 text-cream md:px-16 md:py-24">
            {/* Rising sun decoration */}
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-72 -right-56 size-[30rem] md:-bottom-40 md:-right-10">
              <div className="absolute inset-0 rounded-full ring-1 ring-cream/10" />
              <div className="absolute inset-12 rounded-full ring-1 ring-cream/10" />
              <div className="absolute inset-24 rounded-full bg-turmeric/20" />
            </div>

            <div className="relative max-w-2xl">
              <p className="eyebrow text-turmeric">Say hello</p>
              <h2 className="mt-4 font-display text-h2">Want to know more about our farms?</h2>
              <p className="mt-5 text-lg text-cream/80">
                Ask us about our growers, our process or a product you love. We&apos;re always happy to talk about
                the hills.
              </p>
              <Link
                href="/contact"
                className="group mt-10 inline-flex min-h-13 items-center gap-2.5 rounded-full bg-turmeric px-7 font-semibold text-forest transition-colors hover:bg-cream"
              >
                Get in touch
                <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
