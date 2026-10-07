"use client";

import { useEffect } from "react";
import { useLenis } from "lenis/react";

// Stops page scrolling while an overlay (menu, modal, drawer, lightbox) is open.
export default function useScrollLock(locked) {
  const lenis = useLenis();

  useEffect(() => {
    if (!locked) return;
    const html = document.documentElement;
    const previous = html.style.overflow;
    lenis?.stop();
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = previous;
      lenis?.start();
    };
  }, [locked, lenis]);
}
