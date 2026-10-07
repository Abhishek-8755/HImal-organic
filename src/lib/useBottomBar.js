"use client";

import { useEffect } from "react";

let active = 0;

// Call with true while a component shows a bar fixed to the bottom of the screen.
// The floating WhatsApp button hides itself while any bar is showing
// (via html[data-bottom-bar], see WhatsAppButton.js).
export default function useBottomBar(showing) {
  useEffect(() => {
    if (!showing) return;
    active += 1;
    document.documentElement.dataset.bottomBar = "";
    return () => {
      active -= 1;
      if (active === 0) delete document.documentElement.dataset.bottomBar;
    };
  }, [showing]);
}
