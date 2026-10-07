"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import usePrefersReducedMotion from "@/lib/usePrefersReducedMotion";

// An image that drifts slower than the page inside an overflow-hidden frame.
// Size and round the frame with className (e.g. "aspect-[4/5] rounded-[2rem]").
export default function ParallaxImage({ src, alt, sizes, preload = false, className = "" }) {
  const ref = useRef(null);
  const reduceMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // The image is 30% taller than the frame, so moving it ±10% of its height never shows an edge
  const y = useTransform(scrollYProgress, [0, 1], reduceMotion ? ["0%", "0%"] : ["-10%", "10%"]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="absolute inset-x-0 -inset-y-[15%]">
        <Image src={src} alt={alt} fill sizes={sizes} preload={preload} className="object-cover" />
      </motion.div>
    </div>
  );
}
