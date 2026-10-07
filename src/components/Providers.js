"use client";

import { MotionConfig } from "framer-motion";
import { ReactLenis } from "lenis/react";
import usePrefersReducedMotion from "@/lib/usePrefersReducedMotion";

export default function Providers({ children }) {
  const reduceMotion = usePrefersReducedMotion();

  return (
    // "user" turns off transform and layout animations when the OS asks for reduced motion
    <MotionConfig reducedMotion="user">
      {/* Root Lenis drives window scrolling; read it anywhere with useLenis() */}
      {!reduceMotion && <ReactLenis root options={{ lerp: 0.1 }} />}
      {children}
    </MotionConfig>
  );
}
