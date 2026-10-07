"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import { ZoomIn } from "lucide-react";
import Lightbox from "@/components/Lightbox";
import Reveal from "@/components/Reveal";
import Tilt from "@/components/Tilt";

// certificates: [{ title, issuer, validity, badge, image, width, height }]
export default function CertificateShowcase({ certificates }) {
  const [open, setOpen] = useState(null); // index of the certificate in the lightbox

  const images = certificates.map((c) => ({
    src: c.image,
    alt: `${c.title} certificate`,
    caption: `${c.title} · ${c.issuer}`,
    width: c.width,
    height: c.height,
  }));

  return (
    <>
      <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {certificates.map((c, i) => (
          <li key={c.title}>
            <Reveal delay={i * 0.08} className="h-full">
              <article className="flex h-full flex-col rounded-[1.75rem] bg-white/60 p-3 ring-1 ring-forest/[0.06]">
                <Tilt max={10} glare className="rounded-[1.25rem]">
                  <div className="grid aspect-square place-items-center rounded-[1.25rem] bg-mist transform-3d">
                    {/* Lifted off the tile, so it floats while the card tilts */}
                    <Image
                      src={c.badge}
                      alt={`${c.title} badge`}
                      width={240}
                      height={240}
                      className="w-1/2 translate-z-10 drop-shadow-[0_16px_20px_rgb(31_61_43/0.25)]"
                    />
                  </div>
                </Tilt>
                <div className="flex flex-1 flex-col px-3 pb-3 pt-6">
                  <h3 className="font-display text-2xl text-forest">{c.title}</h3>
                  <dl className="mb-6 mt-4 space-y-2 text-sm">
                    <div>
                      <dt className="text-earth">Issued by</dt>
                      <dd className="font-medium text-ink/85">{c.issuer}</dd>
                    </div>
                    <div>
                      <dt className="text-earth">Validity</dt>
                      <dd className="font-medium text-ink/85">{c.validity}</dd>
                    </div>
                  </dl>
                  <button
                    type="button"
                    onClick={() => setOpen(i)}
                    className="mt-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-forest px-5 font-semibold text-cream transition-colors hover:bg-pine"
                  >
                    <ZoomIn className="size-4" aria-hidden="true" />
                    View certificate
                  </button>
                </div>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {open !== null && <Lightbox images={images} startIndex={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </>
  );
}
