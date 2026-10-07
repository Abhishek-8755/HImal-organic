"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import usePrefersReducedMotion from "@/lib/usePrefersReducedMotion";

const SPRING = { stiffness: 220, damping: 22, mass: 0.6 };

// Tilts its child in 3D towards the mouse, up to `max` degrees, with an optional moving glare.
// Mouse only: touch, pen and reduced motion get a still card. Give it a rounded-* class
// so the glare follows the corners.
export default function Tilt({ children, max = 6, glare = false, className = "" }) {
  const reduceMotion = usePrefersReducedMotion();
  // Pointer position inside the box, 0 to 1 on each axis
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), SPRING);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), SPRING);
  const glareOpacity = useSpring(0, SPRING);
  const glareX = useTransform(px, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(py, [0, 1], ["0%", "100%"]);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgb(255 255 255 / 0.55), transparent 55%)`;

  const onPointerMove = (e) => {
    if (reduceMotion || e.pointerType !== "mouse") return;
    const box = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - box.left) / box.width);
    py.set((e.clientY - box.top) / box.height);
    glareOpacity.set(1);
  };

  const reset = () => {
    px.set(0.5);
    py.set(0.5);
    glareOpacity.set(0);
  };

  return (
    <div onPointerMove={onPointerMove} onPointerLeave={reset} className={`perspective-midrange ${className}`}>
      <motion.div style={{ rotateX, rotateY }} className="relative h-full rounded-[inherit] transform-3d">
        {children}
        {glare && (
          <motion.div
            aria-hidden="true"
            style={{ background: glareBackground, opacity: glareOpacity }}
            className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-soft-light"
          />
        )}
      </motion.div>
    </div>
  );
}
