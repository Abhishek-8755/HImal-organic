import { BugOff, FlaskConical, PackageCheck, ScanBarcode, Shovel, Sprout, Truck } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import Stepper from "@/components/Stepper";
import TrustSeal from "@/components/certifications/TrustSeal";
import CertificateShowcase from "@/components/certifications/CertificateShowcase";
import DocumentRequest from "@/components/certifications/DocumentRequest";

// TODO: every certificate below is a placeholder. Keep only certificates the client actually
// holds, and replace each field: badge = the certifier's logo (with permission), image = the
// scanned certificate, width/height = that image's size in pixels.
// Food sold as organic in India needs NPOP or PGS-India certification and the Jaivik Bharat logo.
const CERTIFICATES = [
  {
    title: "Organic Certification", // TODO
    issuer: "TODO: NPOP-accredited certification body",
    validity: "TODO: valid until",
    badge: "/images/certificates/badge-organic.svg",
    image: "/images/certificates/organic.svg",
    width: 800,
    height: 1100,
  },
  {
    title: "FSSAI Food Licence", // TODO
    issuer: "Food Safety and Standards Authority of India",
    validity: "TODO: licence number and expiry",
    badge: "/images/certificates/badge-food-safety.svg",
    image: "/images/certificates/food-safety.svg",
    width: 800,
    height: 1100,
  },
  {
    title: "ISO 22000 Food Safety", // TODO
    issuer: "TODO: certification body",
    validity: "TODO: valid until",
    badge: "/images/certificates/badge-quality.svg",
    image: "/images/certificates/quality.svg",
    width: 800,
    height: 1100,
  },
  {
    title: "Lab Test Report", // TODO
    issuer: "TODO: NABL-accredited laboratory",
    validity: "TODO: report date",
    badge: "/images/certificates/badge-lab-report.svg",
    image: "/images/certificates/lab-report.svg",
    width: 800,
    height: 1100,
  },
];

// TODO: confirm each checkpoint matches what the client really does.
const STANDARDS = [
  { Icon: Shovel, title: "Soil Testing", text: "Farm soil is tested before a field joins our network, and again every season." },
  { Icon: BugOff, title: "Pesticide-Free Check", text: "Samples from every batch are screened for pesticide residue before packing." },
  { Icon: PackageCheck, title: "Hygienic Packaging", text: "Cleaned and sealed in food-grade packs in a hygienic unit, away from moisture." },
  { Icon: ScanBarcode, title: "Batch Traceability", text: "A batch code on each pack traces it back to the farm and the harvest date." },
];

const PROCESS = [
  { icon: <Sprout />, title: "Farm", text: "Grown on certified partner farms without synthetic inputs." },
  { icon: <FlaskConical />, title: "Lab", text: "Samples from each lot are tested for residue and purity." },
  { icon: <PackageCheck />, title: "Pack", text: "Cleaned, sorted and sealed in food-grade packs." },
  { icon: <Truck />, title: "Dispatch", text: "Shipped with batch records for full traceability." },
];

export const metadata = {
  title: "Certifications",
  description:
    "The organic certification, food safety licence and lab reports behind Himal Organic, and how every batch is tested and traced.",
};

export default function CertificationsPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-56 -z-10 size-[44rem] rounded-full bg-turmeric/15 blur-3xl"
        />
        <div className="wrap grid items-center gap-20 pb-20 pt-32 lg:grid-cols-12 lg:gap-10 lg:pb-28 lg:pt-40">
          <div className="lg:col-span-7">
            <p className="eyebrow animate-rise">Certifications</p>
            <h1 className="mt-6 animate-rise font-display text-display text-forest [animation-delay:120ms]">
              Proof of <em className="text-moss">Purity</em>
            </h1>
            <p className="mt-7 max-w-xl animate-rise text-lg text-ink/75 [animation-delay:240ms] md:text-xl">
              Anyone can print &ldquo;organic&rdquo; on a pack. We back ours with certification, lab testing and batch
              records, and we&apos;re happy to share them with you.
            </p>
          </div>
          <div className="flex animate-rise justify-center [animation-delay:200ms] lg:col-span-5">
            <TrustSeal />
          </div>
        </div>
      </section>

      <section id="certificates" className="section pt-0 lg:pt-0">
        <div className="wrap">
          <Reveal>
            <SectionHeading eyebrow="Our certificates" title="Checked by people who don't work for us">
              Open any certificate to see it in full.
            </SectionHeading>
          </Reveal>
          <CertificateShowcase certificates={CERTIFICATES} />
        </div>
      </section>

      <section className="section bg-mist">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-5">
            <SectionHeading eyebrow="Our quality standards" title="Four checkpoints, every batch">
              Certificates show the system works. These checks keep it working, season after season.
            </SectionHeading>
          </Reveal>
          <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {STANDARDS.map(({ Icon, title, text }, i) => (
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

      <section className="section">
        <div className="wrap">
          <Reveal>
            <SectionHeading eyebrow="Quality process" title="From field to dispatch" />
          </Reveal>
          <Stepper steps={PROCESS} className="mt-14" />
        </div>
      </section>

      <DocumentRequest />
    </>
  );
}
