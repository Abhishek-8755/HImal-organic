"use client";

import { motion } from "framer-motion";

// Fades its children in with a 24px rise the first time they scroll into view.
export default function Reveal({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      data-reveal
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
