"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";

// items: [{ question, answer }]. One panel is open at a time; `defaultOpen` is its index (-1 = none).
// Panels stay in the HTML; closed ones are collapsed to zero height and made inert.
export default function Accordion({ items, defaultOpen = -1, className = "" }) {
  const id = useId();
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`divide-y divide-forest/15 border-y border-forest/15 ${className}`}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.question}>
            <h3>
              <button
                type="button"
                id={`${id}-button-${i}`}
                aria-expanded={isOpen}
                aria-controls={`${id}-panel-${i}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left font-display text-xl text-forest md:text-2xl"
              >
                {item.question}
                <span
                  aria-hidden="true"
                  className={`grid size-10 shrink-0 place-items-center rounded-full ring-1 transition duration-500 ease-[var(--ease-soft)] motion-reduce:transition-none ${
                    isOpen ? "rotate-45 bg-forest text-cream ring-forest" : "text-forest ring-forest/20"
                  }`}
                >
                  <Plus className="size-5" />
                </span>
              </button>
            </h3>
            <div
              id={`${id}-panel-${i}`}
              role="region"
              aria-labelledby={`${id}-button-${i}`}
              inert={!isOpen}
              className={`grid transition-[grid-template-rows] duration-500 ease-[var(--ease-soft)] motion-reduce:transition-none ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="pb-6 pr-14 text-ink/75">{item.answer}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
