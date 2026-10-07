"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";
import usePrefersReducedMotion from "@/lib/usePrefersReducedMotion";

const format = (n) => Math.round(n).toLocaleString("en-IN");

// Counts from 0 to `value` once, when scrolled into view.
// The final number is in the HTML, so it still shows without JavaScript.
export default function CountUp({ value, suffix = "", duration = 1.8 }) {
  const ref = useRef(null);
  const numberRef = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = numberRef.current;
    if (reduceMotion) {
      el.textContent = format(value);
      return;
    }
    if (!inView) {
      el.textContent = format(0);
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (n) => (el.textContent = format(n)),
    });
    return () => controls.stop();
  }, [inView, reduceMotion, value, duration]);

  return (
    <span ref={ref}>
      <span className="sr-only">
        {format(value)}
        {suffix}
      </span>
      <span aria-hidden="true" className="tabular-nums">
        <span ref={numberRef}>{format(value)}</span>
        {suffix}
      </span>
    </span>
  );
}
