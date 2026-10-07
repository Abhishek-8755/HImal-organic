"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import Logo from "@/components/Logo";
import useFocusTrap from "@/lib/useFocusTrap";
import useScrollLock from "@/lib/useScrollLock";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { AUDIENCE_LINKS, CONTACT, NAV_LINKS } from "@/data/site";

const EASE = [0.22, 1, 0.36, 1];

// Pages with a dark hero: the header uses cream text and a forest bar
const DARK_PAGES = ["/b2b"];

function isActive(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

// dark: on a forest background (dark pages, mobile menu). large: the mobile menu size.
function AudienceToggle({ pathname, layoutId, dark = false, large = false, onNavigate }) {
  const pad = large ? "px-6 py-3 text-base" : "px-4 py-2 text-sm";
  return (
    <div className="flex rounded-full bg-current/5 p-1 ring-1 ring-current/15">
      {AUDIENCE_LINKS.map((link) => {
        const active = isActive(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`relative whitespace-nowrap rounded-full font-semibold transition-colors ${pad} ${
              active ? (dark ? "text-forest" : "text-cream") : "opacity-80 hover:opacity-100"
            }`}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className={`absolute inset-0 rounded-full ${dark ? "bg-turmeric" : "bg-forest"}`}
                transition={{ duration: 0.45, ease: EASE }}
              />
            )}
            <span className="relative">{link.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const dark = DARK_PAGES.some((page) => isActive(pathname, page));

  useScrollLock(menuOpen);

  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    if (Math.abs(y - previous) < 4) return;
    setHidden(y > previous && y > 160);
  });

  const visible = !hidden || menuOpen;

  // --header-h is the visible header height (0 while hidden), for sticky bars below it
  useEffect(() => {
    const el = headerRef.current;
    const update = () =>
      document.documentElement.style.setProperty("--header-h", `${visible ? el.offsetHeight : 0}px`);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [visible]);

  const closeMenu = () => setMenuOpen(false);

  // Mobile menu: focus the first item, keep Tab inside, close on Esc
  useFocusTrap(menuRef, menuOpen, closeMenu, menuButtonRef);

  return (
    <>
      <motion.header
        ref={headerRef}
        animate={{ y: visible ? "0%" : "-100%" }}
        transition={{ duration: 0.4, ease: EASE }}
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,color] duration-300 ${
          dark ? "text-cream" : "text-forest"
        } ${
          scrolled
            ? dark
              ? "bg-forest/85 shadow-[0_1px_0_rgb(246_241_231/0.1)] backdrop-blur-md"
              : "bg-cream/80 shadow-[0_1px_0_rgb(31_61_43/0.08)] backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="wrap flex h-[4.5rem] items-center justify-between gap-6 lg:h-20">
          <Logo />

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-6 xl:gap-8">
              {NAV_LINKS.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={`relative whitespace-nowrap py-2 text-[0.95rem] font-medium transition-colors ${
                        active ? "opacity-100" : "opacity-75 hover:opacity-100"
                      }`}
                    >
                      {link.label}
                      {active && (
                        <motion.span
                          layoutId="nav-underline"
                          className={`absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full ${dark ? "bg-turmeric" : "bg-moss"}`}
                          transition={{ duration: 0.45, ease: EASE }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            {/* Hidden from 1024 to 1279px, where the nav links need the room (B2C/B2B are links there) */}
            <div className="hidden md:block lg:hidden xl:block">
              <AudienceToggle pathname={pathname} layoutId="audience-pill" dark={dark} />
            </div>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label="Open menu"
              className="grid size-11 place-items-center rounded-full ring-1 ring-current/20 transition-colors hover:bg-current/10 lg:hidden"
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Outside the header: a transformed parent would trap this fixed overlay inside it */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            data-lenis-prevent
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-forest text-cream lg:hidden"
          >
            <div className="wrap flex h-[4.5rem] shrink-0 items-center justify-between">
              <Logo onClick={closeMenu} />
              <button
                type="button"
                onClick={closeMenu}
                aria-label="Close menu"
                className="grid size-11 place-items-center rounded-full ring-1 ring-cream/25 transition-colors hover:bg-cream/10"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <nav aria-label="Mobile" className="wrap flex-1 pt-8">
              <ul className="space-y-1">
                {NAV_LINKS.map((link, i) => {
                  const active = isActive(pathname, link.href);
                  return (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, y: 28 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.25 + i * 0.05, ease: EASE }}
                    >
                      <Link
                        href={link.href}
                        onClick={closeMenu}
                        aria-current={active ? "page" : undefined}
                        className="group flex items-baseline gap-4 py-1.5 font-display text-[2.6rem] leading-tight"
                      >
                        <span aria-hidden="true" className="w-7 font-sans text-sm text-cream/50">
                          0{i + 1}
                        </span>
                        <span className={active ? "italic text-turmeric" : "transition-colors group-hover:text-turmeric"}>
                          {link.label}
                        </span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="wrap flex flex-col gap-5 pb-10 pt-10"
            >
              <AudienceToggle pathname={pathname} layoutId="audience-pill-mobile" dark large onNavigate={closeMenu} />
              <a
                href={buildWhatsAppLink({ message: "I'd like to know more about your products." })}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream/80 underline-offset-4 hover:text-cream hover:underline"
              >
                WhatsApp {CONTACT.phone}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
