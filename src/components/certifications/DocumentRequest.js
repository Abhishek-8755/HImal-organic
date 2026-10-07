"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, FileText, MessageCircle } from "lucide-react";
import Reveal from "@/components/Reveal";
import { buildWhatsAppLink, openWhatsApp } from "@/lib/whatsapp";

const DOCUMENTS = ["Organic Certificate", "Lab Report", "Product Specification"];

// "Request documents" banner for B2B buyers: pick documents, then send the request on WhatsApp
export default function DocumentRequest() {
  const [chosen, setChosen] = useState([]);
  const [error, setError] = useState(false);
  const [sent, setSent] = useState(null); // the WhatsApp details last opened, for "Open WhatsApp again"

  const toggle = (doc) => {
    setError(false);
    setChosen((list) => (list.includes(doc) ? list.filter((d) => d !== doc) : [...list, doc]));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!chosen.length) return setError(true);
    const details = {
      message: `I'd like to request these documents:\n${chosen.map((doc) => `- ${doc}`).join("\n")}`,
    };
    openWhatsApp(details);
    setSent(details);
  };

  return (
    <section id="request-documents" className="section">
      <div className="wrap">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-forest px-7 py-14 text-cream md:px-14 md:py-20">
            <FileText
              aria-hidden="true"
              strokeWidth={0.6}
              className="pointer-events-none absolute -bottom-16 -right-12 size-96 text-cream/[0.05]"
            />

            <div className="relative grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-10">
              <div className="lg:col-span-6">
                <p className="eyebrow text-turmeric">For business buyers</p>
                <h2 className="mt-4 font-display text-h2">Need documents for your vendor file?</h2>
                <p className="mt-5 max-w-lg text-lg text-cream/80">
                  Pick what you need and send the request on WhatsApp. Prefer a form, email or a call? Use the contact
                  page instead.
                </p>
              </div>

              <form onSubmit={onSubmit} noValidate className="lg:col-span-6">
                <fieldset>
                  <legend className="text-sm font-semibold text-cream/80">Documents you need</legend>
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {DOCUMENTS.map((doc) => {
                      const on = chosen.includes(doc);
                      return (
                        <label
                          key={doc}
                          className={`inline-flex min-h-12 cursor-pointer select-none items-center gap-2 rounded-full px-5 font-semibold transition-colors has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-turmeric ${
                            on ? "bg-turmeric text-forest" : "text-cream ring-1 ring-cream/30 hover:bg-cream/10"
                          }`}
                        >
                          <input type="checkbox" checked={on} onChange={() => toggle(doc)} className="sr-only" />
                          {on ? (
                            <Check className="size-4" aria-hidden="true" />
                          ) : (
                            <FileText className="size-4" aria-hidden="true" />
                          )}
                          {doc}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
                {error && (
                  <p role="alert" className="mt-3 text-sm font-medium text-turmeric">
                    Pick at least one document.
                  </p>
                )}

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    className="inline-flex min-h-13 items-center gap-2.5 whitespace-nowrap rounded-full bg-cream px-6 font-semibold text-forest transition-colors hover:bg-turmeric sm:px-7"
                  >
                    <MessageCircle className="size-5" aria-hidden="true" />
                    Request on WhatsApp
                  </button>
                  <Link
                    href="/contact"
                    className="group inline-flex min-h-13 items-center gap-2 whitespace-nowrap rounded-full px-6 font-semibold text-cream ring-1 ring-cream/30 transition-colors hover:bg-cream/10 sm:px-7"
                  >
                    Contact page
                    <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>

                <div role="status">
                  {sent && (
                    <p className="mt-6 rounded-2xl bg-cream/10 p-5 text-cream/90 ring-1 ring-cream/15">
                      Your request is ready in WhatsApp. Tap Send there to reach our team.{" "}
                      <a
                        href={buildWhatsAppLink(sent)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-turmeric underline underline-offset-4"
                      >
                        Open WhatsApp again
                      </a>
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
