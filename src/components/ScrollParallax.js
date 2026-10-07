"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import usePrefersReducedMotion from "@/lib/usePrefersReducedMotion";

// Moves its children `distance` px vertically over the first 1000px of page scroll.
// Positive moves down (slower than the page, feels far away); negative moves up.
export default function ScrollParallax({ children, distance, className = "" }) {
  const reduceMotion = usePrefersReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, reduceMotion ? 0 : distance]);

  return (
    <motion.div style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
