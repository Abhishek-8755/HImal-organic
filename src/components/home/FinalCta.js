import Link from "next/link";
import { MessageCircle } from "lucide-react";
import Reveal from "@/components/Reveal";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export default function FinalCta() {
  return (
    <section className="section">
      <div className="wrap">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-forest px-7 py-16 text-cream md:px-16 md:py-24">
            {/* Mountain outline decoration */}
            <svg
              aria-hidden="true"
              viewBox="0 0 600 240"
              className="pointer-events-none absolute -bottom-2 right-0 w-[min(100%,46rem)] text-cream/10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M0 240 L110 120 L160 160 L260 40 L330 120 L380 90 L470 170 L520 130 L600 200" />
              <path d="M0 240 L140 170 L210 200 L300 120 L380 180 L450 150 L600 230" />
            </svg>

            <div className="relative max-w-2xl">
              <p className="eyebrow text-turmeric">Let&apos;s talk</p>
              <h2 className="mt-4 font-display text-h2">Have a question or a bulk order?</h2>
              <p className="mt-5 text-lg text-cream/80">
                Message us on WhatsApp and we&apos;ll help you choose the right products and pack sizes.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href={buildWhatsAppLink({ message: "I'd like to know more about your products." })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-13 items-center gap-2.5 rounded-full bg-turmeric px-7 font-semibold text-forest transition-colors hover:bg-cream"
                >
                  <MessageCircle className="size-5" aria-hidden="true" />
                  Chat on WhatsApp
                </a>
                <Link
                  href="/contact"
                  className="inline-flex min-h-13 items-center rounded-full px-7 font-semibold text-cream ring-1 ring-cream/30 transition-colors hover:bg-cream/10"
                >
                  Other ways to reach us
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
