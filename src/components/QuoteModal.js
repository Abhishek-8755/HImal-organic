"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { MessageCircle, Plus, Trash2, X } from "lucide-react";
import useFocusTrap from "@/lib/useFocusTrap";
import useScrollLock from "@/lib/useScrollLock";
import { buildWhatsAppLink, openWhatsApp } from "@/lib/whatsapp";

const EASE = [0.22, 1, 0.36, 1];
const FREQUENCIES = ["One-time", "Weekly", "Monthly"];

// Liquids (MOQ in litres, like ghee) get litres; everything else kg / quintal / ton
const unitsFor = (product) => (/\bL$/i.test(product.moq ?? "") ? ["litre", "kg"] : ["kg", "quintal", "ton"]);
const toItem = (product) => ({ slug: product.slug, name: product.name, moq: product.moq, quantity: "", unit: unitsFor(product)[0] });
// 10 digits, with an optional +91 / 91 / 0 in front
const validPhone = (value) => /^(?:\+?91|0)?\d{10}$/.test(value.replace(/[\s-]/g, ""));

// Base field style without a width; `input` adds full width for stacked fields
const field =
  "h-12 rounded-xl bg-white px-4 text-base text-ink ring-1 ring-forest/15 placeholder:text-earth/70 focus:outline-none focus:ring-2 focus:ring-moss aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-700";
const input = `${field} w-full`;

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-forest">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-red-800">
          {error}
        </p>
      )}
    </div>
  );
}

// Shared bulk-quote form (B2B page, Product Detail). Render inside <AnimatePresence>.
// products: prefilled items; catalog: products that can be added; onSuccess(slugs) runs after sending.
export default function QuoteModal({ products = [], catalog = [], onClose, onSuccess }) {
  const panelRef = useRef(null);
  const doneRef = useRef(null);
  useScrollLock(true);
  useFocusTrap(panelRef, true, onClose);

  const [form, setForm] = useState({ business: "", contact: "", phone: "", city: "", frequency: FREQUENCIES[0] });
  const [items, setItems] = useState(() => products.map(toItem));
  const [errors, setErrors] = useState({});
  const [sentLink, setSentLink] = useState(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const setItem = (slug, key, value) => setItems((list) => list.map((it) => (it.slug === slug ? { ...it, [key]: value } : it)));
  const addable = catalog.filter((p) => !items.some((it) => it.slug === p.slug));

  const validate = () => {
    const e = {};
    if (!form.business.trim()) e.business = "Please enter your business name.";
    if (!form.contact.trim()) e.contact = "Please enter a contact person.";
    if (!validPhone(form.phone)) e.phone = "Enter a 10-digit phone number.";
    if (items.length === 0) e.items = "Add at least one product.";
    items.forEach((it) => {
      if (!(Number(it.quantity) > 0)) e[`qty-${it.slug}`] = "Enter a quantity.";
    });
    if (!form.city.trim()) e.city = "Please enter the delivery city.";
    return e;
  };

  const submit = (event) => {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    // Focus the first field with a problem, in form order
    const order = ["business", "contact", "phone", "items", ...items.map((it) => `qty-${it.slug}`), "city"];
    const first = order.find((key) => found[key]);
    if (first) {
      document.getElementById(first === "items" ? "quote-add" : `quote-${first}`)?.focus();
      return;
    }

    const details = {
      name: form.contact.trim(),
      phone: form.phone.trim(),
      type: "Business",
      message: [
        "I'd like a bulk quote for:",
        ...items.map((it) => `• ${it.name}: ${it.quantity} ${it.unit}`),
        "",
        `Business: ${form.business.trim()}`,
        `Delivery city: ${form.city.trim()}`,
        `Frequency: ${form.frequency}`,
      ].join("\n"),
    };
    // Opened directly in the submit handler so the browser does not block the new tab
    openWhatsApp(details);
    setSentLink(buildWhatsAppLink(details));
    onSuccess?.(items.map((it) => it.slug));
    requestAnimationFrame(() => doneRef.current?.focus());
  };

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6">
      <motion.div
        aria-hidden="true"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]"
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-title"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="relative flex max-h-[100svh] w-full flex-col overflow-hidden rounded-t-[2rem] bg-cream text-ink shadow-2xl sm:max-h-[90vh] sm:max-w-2xl sm:rounded-[2rem]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-forest/10 px-6 py-5 sm:px-8">
          <div>
            <p className="eyebrow">Bulk order</p>
            <h2 id="quote-title" className="mt-1 font-display text-3xl text-forest">
              Request a quote
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-11 shrink-0 place-items-center rounded-full text-forest ring-1 ring-forest/15 transition-colors hover:bg-forest hover:text-cream"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        {sentLink ? (
          <div className="flex flex-col items-center px-6 py-12 text-center sm:px-10">
            <svg viewBox="0 0 52 52" className="size-20 text-moss" aria-hidden="true">
              <motion.circle
                cx="26"
                cy="26"
                r="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, ease: EASE }}
              />
              <motion.path
                d="M15 27 l7 7 l15 -16"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.45, ease: EASE }}
              />
            </svg>
            <h3 ref={doneRef} tabIndex={-1} className="mt-6 font-display text-3xl text-forest focus:outline-none">
              Almost done
            </h3>
            <p className="mt-3 max-w-sm text-lg text-ink/80">
              Your quote request is ready in WhatsApp. Tap Send there to reach our team.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={sentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-moss px-6 font-semibold text-white transition-colors hover:bg-forest"
              >
                <MessageCircle className="size-5" aria-hidden="true" />
                Open WhatsApp again
              </a>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex min-h-12 items-center rounded-full px-6 font-semibold text-forest ring-1 ring-forest/25 transition-colors hover:bg-forest/5"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form noValidate onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
            <div data-lenis-prevent className="flex-1 space-y-6 overflow-y-auto px-6 py-6 sm:px-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="quote-business" label="Business name" error={errors.business}>
                  <input id="quote-business" className={input} value={form.business} onChange={set("business")} autoComplete="organization" aria-invalid={!!errors.business} aria-describedby={errors.business ? "quote-business-error" : undefined} />
                </Field>
                <Field id="quote-contact" label="Contact person" error={errors.contact}>
                  <input id="quote-contact" className={input} value={form.contact} onChange={set("contact")} autoComplete="name" aria-invalid={!!errors.contact} aria-describedby={errors.contact ? "quote-contact-error" : undefined} />
                </Field>
                <Field id="quote-phone" label="Phone (WhatsApp)" error={errors.phone}>
                  <input id="quote-phone" type="tel" inputMode="tel" className={input} value={form.phone} onChange={set("phone")} autoComplete="tel" placeholder="98765 43210" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "quote-phone-error" : undefined} />
                </Field>
                <Field id="quote-city" label="Delivery city" error={errors.city}>
                  <input id="quote-city" className={input} value={form.city} onChange={set("city")} autoComplete="address-level2" aria-invalid={!!errors.city} aria-describedby={errors.city ? "quote-city-error" : undefined} />
                </Field>
              </div>

              <fieldset>
                <legend className="text-sm font-semibold text-forest">Products and quantities</legend>
                {items.length > 0 && (
                  <ul className="mt-3 space-y-3">
                    {items.map((it) => {
                      const err = errors[`qty-${it.slug}`];
                      return (
                        <li key={it.slug} className="rounded-2xl bg-white/70 p-4 ring-1 ring-forest/10">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-forest">{it.name}</p>
                              {it.moq && <p className="text-sm text-earth">Minimum order: {it.moq}</p>}
                            </div>
                            <button
                              type="button"
                              onClick={() => setItems((list) => list.filter((x) => x.slug !== it.slug))}
                              aria-label={`Remove ${it.name}`}
                              className="grid size-10 shrink-0 place-items-center rounded-full text-earth transition-colors hover:bg-forest/10 hover:text-forest"
                            >
                              <Trash2 className="size-4" aria-hidden="true" />
                            </button>
                          </div>
                          <div className="mt-3 flex gap-2">
                            <label htmlFor={`quote-qty-${it.slug}`} className="sr-only">
                              Quantity of {it.name}
                            </label>
                            <input
                              id={`quote-qty-${it.slug}`}
                              type="number"
                              min="0"
                              step="any"
                              inputMode="decimal"
                              placeholder="Quantity"
                              value={it.quantity}
                              onChange={(e) => setItem(it.slug, "quantity", e.target.value)}
                              aria-invalid={!!err}
                              aria-describedby={err ? `quote-qty-${it.slug}-error` : undefined}
                              className={`${field} min-w-0 flex-1`}
                            />
                            <label htmlFor={`quote-unit-${it.slug}`} className="sr-only">
                              Unit for {it.name}
                            </label>
                            <select
                              id={`quote-unit-${it.slug}`}
                              value={it.unit}
                              onChange={(e) => setItem(it.slug, "unit", e.target.value)}
                              className={`${field} w-32 shrink-0 cursor-pointer`}
                            >
                              {unitsFor(it).map((u) => (
                                <option key={u}>{u}</option>
                              ))}
                            </select>
                          </div>
                          {err && (
                            <p id={`quote-qty-${it.slug}-error`} className="mt-1.5 text-sm font-medium text-red-800">
                              {err}
                            </p>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}

                {addable.length > 0 && (
                  <div className="relative mt-3">
                    <label htmlFor="quote-add" className="sr-only">
                      Add a product
                    </label>
                    <Plus aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-forest" />
                    <select
                      id="quote-add"
                      value=""
                      onChange={(e) => {
                        const product = catalog.find((p) => p.slug === e.target.value);
                        if (product) setItems((list) => [...list, toItem(product)]);
                      }}
                      aria-invalid={!!errors.items}
                      aria-describedby={errors.items ? "quote-add-error" : undefined}
                      className={`${input} cursor-pointer pl-10 font-semibold text-forest`}
                    >
                      <option value="" disabled>
                        {items.length ? "Add another product" : "Add a product"}
                      </option>
                      {addable.map((p) => (
                        <option key={p.slug} value={p.slug}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {errors.items && (
                  <p id="quote-add-error" className="mt-1.5 text-sm font-medium text-red-800">
                    {errors.items}
                  </p>
                )}
              </fieldset>

              <fieldset>
                <legend className="text-sm font-semibold text-forest">How often?</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {FREQUENCIES.map((f) => (
                    <label key={f} className="cursor-pointer">
                      <input
                        type="radio"
                        name="quote-frequency"
                        value={f}
                        checked={form.frequency === f}
                        onChange={set("frequency")}
                        className="peer sr-only"
                      />
                      <span className="inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold text-forest ring-1 ring-forest/20 transition-colors peer-checked:bg-forest peer-checked:text-cream peer-checked:ring-forest peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-moss">
                        {f}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className="flex flex-col gap-2 border-t border-forest/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <p className="text-sm text-earth">Opens WhatsApp with your details filled in.</p>
              <button
                type="submit"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-forest px-7 font-semibold text-cream transition-colors hover:bg-pine"
              >
                <MessageCircle className="size-5" aria-hidden="true" />
                Send on WhatsApp
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>,
    document.body
  );
}
