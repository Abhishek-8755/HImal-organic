"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// For dialogs (menu, drawer, modal, lightbox). While `open`: focuses the first item,
// keeps Tab inside `ref`, calls onClose on Esc, and on close gives focus back to
// `returnFocusRef` (or to whatever had focus when it opened).
export default function useFocusTrap(ref, open, onClose, returnFocusRef) {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const returnTo = returnFocusRef?.current ?? document.activeElement;
    const items = () => [...ref.current.querySelectorAll(FOCUSABLE)];
    items()[0]?.focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape") return onCloseRef.current();
      if (e.key !== "Tab") return;
      const list = items();
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      returnTo?.focus?.();
    };
  }, [open, ref, returnFocusRef]);
}
