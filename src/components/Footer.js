import Link from "next/link";
import Logo from "@/components/Logo";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "@/components/icons/SocialIcons";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { CATEGORIES, CONTACT, NAV_LINKS, SITE, SOCIAL } from "@/data/site";

const SOCIAL_LINKS = [
  { href: SOCIAL.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: SOCIAL.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: SOCIAL.youtube, label: "YouTube", Icon: YoutubeIcon },
];

function Column({ title, children }) {
  return (
    <div>
      <h2 className="eyebrow text-turmeric">{title}</h2>
      <ul className="mt-5 space-y-3 text-cream/80">{children}</ul>
    </div>
  );
}

const linkClass = "transition-colors hover:text-cream";

export default function Footer() {
  // Static export: the year is fixed when the site is built
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-forest text-cream">
      <div className="relative">
        {/* Large outline wordmark, sized to fit the width, in the space above the bottom bar */}
        <p
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-4 select-none whitespace-nowrap text-center font-display text-[clamp(2.5rem,10.2vw,9.25rem)] font-semibold leading-none text-transparent [-webkit-text-stroke:1px_rgb(246_241_231/0.14)] lg:bottom-6"
        >
          HIMAL ORGANIC
        </p>

        <div className="wrap relative grid gap-12 pb-28 pt-20 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr] lg:pb-56 lg:pt-24">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-5 text-cream/80">{SITE.tagline}</p>
            <p className="mt-3 text-sm text-cream/60">
              Grains, pulses, spices, dairy and snacks from Himalayan farms, for homes and businesses.
            </p>
            <ul className="mt-7 flex gap-3">
              {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    className="grid size-11 place-items-center rounded-full ring-1 ring-cream/20 transition duration-300 hover:-translate-y-1 hover:bg-cream/10 hover:ring-cream/40"
                  >
                    <Icon className="size-5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <Column title="Explore">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </Column>

          <Column title="Products">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/b2c?category=${c.slug}`} className={linkClass}>
                  {c.label}
                </Link>
              </li>
            ))}
          </Column>

          <Column title="Get in touch">
            <li>
              <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className={linkClass}>
                {CONTACT.phone}
              </a>
            </li>
            <li>
              <a href={buildWhatsAppLink()} target="_blank" rel="noopener noreferrer" className={linkClass}>
                WhatsApp us
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT.email}`} className={linkClass}>
                {CONTACT.email}
              </a>
            </li>
            <li className="text-cream/60">{CONTACT.address}</li>
            <li className="text-cream/60">{CONTACT.hours}</li>
          </Column>
        </div>
      </div>

      {/* Extra bottom padding on mobile keeps the floating WhatsApp button off this text */}
      <div className="relative border-t border-cream/10">
        <div className="wrap flex flex-col gap-2 py-6 pb-24 text-sm text-cream/60 sm:flex-row sm:justify-between md:pb-6">
          <p>
            © {year} {SITE.name}. All rights reserved.
          </p>
          <p>Grown with care in the Himalayas.</p>
        </div>
      </div>
    </footer>
  );
}
