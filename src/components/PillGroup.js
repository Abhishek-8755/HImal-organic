"use client";

import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

// Pill buttons with one active background that slides between them.
// options: [{ value, label }]. Give each group its own layoutId.
export default function PillGroup({ label, options, value, onChange, layoutId, className = "", pillClass, activeText, idleText }) {
  return (
    <div role="group" aria-label={label} className={className}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            className={`relative shrink-0 snap-start whitespace-nowrap rounded-full px-2.5 py-2.5 text-sm font-semibold transition-colors sm:px-4 ${
              active ? activeText : idleText
            }`}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className={`absolute inset-0 rounded-full ${pillClass}`}
                transition={{ duration: 0.45, ease: EASE }}
              />
            )}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
