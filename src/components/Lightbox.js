"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import useFocusTrap from "@/lib/useFocusTrap";
import useScrollLock from "@/lib/useScrollLock";

const SWIPE = 50; // px a finger must travel to change image

// Full-screen image viewer. images: [{ src, alt, caption, width, height }].
// Render it inside <AnimatePresence> so it can fade out. Portalled to <body> so no
// parent layer (header, page fade) can paint over it.
export default function Lightbox({ images, startIndex = 0, onClose }) {
  const dialogRef = useRef(null);
  const swipeStart = useRef(null);
  const swiped = useRef(false);
  const [index, setIndex] = useState(startIndex);
  const [zoom, setZoom] = useState(null); // null, or the zoom origin as { x, y } in %
  const image = images[index];
  const many = images.length > 1;

  useScrollLock(true);
  useFocusTrap(dialogRef, true, onClose);

  const go = (step) => {
    setZoom(null);
    setIndex((i) => (i + step + images.length) % images.length);
  };

  // Arrow keys (Esc is handled by useFocusTrap)
  useEffect(() => {
    if (!many) return;
    const onKeyDown = (e) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  });

  // Start loading the next image so it shows at once
  useEffect(() => {
    if (!many) return;
    const next = new window.Image();
    next.src = images[(index + 1) % images.length].src;
  }, [index, images, many]);

  const originFrom = (e) => {
    const box = e.currentTarget.getBoundingClientRect();
    return { x: ((e.clientX - box.left) / box.width) * 100, y: ((e.clientY - box.top) / box.height) * 100 };
  };

  const onImageClick = (e) => {
    if (swiped.current) {
      swiped.current = false;
      return;
    }
    setZoom(zoom ? null : originFrom(e));
  };

  const onPointerDown = (e) => {
    if (e.pointerType !== "mouse") swipeStart.current = e.clientX;
  };
  const onPointerUp = (e) => {
    if (swipeStart.current === null) return;
    const dx = e.clientX - swipeStart.current;
    swipeStart.current = null;
    if (zoom || !many || Math.abs(dx) < SWIPE) return;
    swiped.current = true;
    go(dx < 0 ? 1 : -1);
  };

  const arrowClass =
    "absolute top-1/2 z-10 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-ink/60 text-cream ring-1 ring-cream/25 backdrop-blur transition-colors hover:bg-cream hover:text-forest md:size-14";

  return createPortal(
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[60] flex flex-col bg-ink/95 text-cream backdrop-blur-sm"
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close image viewer"
          className="order-last ml-auto grid size-12 place-items-center rounded-full ring-1 ring-cream/25 transition-colors hover:bg-cream hover:text-forest"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
        {many && (
          <p className="text-sm tabular-nums text-cream/80">
            {index + 1} / {images.length}
          </p>
        )}
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-24">
        {many && (
          <button type="button" onClick={() => go(-1)} aria-label="Previous image" className={`${arrowClass} left-3 md:left-6`}>
            <ChevronLeft className="size-6" aria-hidden="true" />
          </button>
        )}

        <motion.div
          key={image.src}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
          onClick={onImageClick}
          onPointerMove={(e) => zoom && e.pointerType === "mouse" && setZoom(originFrom(e))}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (swipeStart.current = null)}
          // As large as fits the screen (minus the side gutter and the top and bottom bars), at the image's
          // own aspect ratio. Sized from width/height, so it works for files with no intrinsic size (SVG).
          style={{
            width: `min(100vw - var(--gutter), (100svh - 10rem) * ${image.width} / ${image.height})`,
            aspectRatio: `${image.width} / ${image.height}`,
          }}
          className={`touch-pan-y overflow-hidden rounded-xl [--gutter:2rem] md:[--gutter:12rem] ${
            zoom ? "cursor-zoom-out" : "cursor-zoom-in"
          }`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="90vw"
            draggable={false}
            style={zoom ? { transform: "scale(2)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
            className="size-full select-none object-contain transition-transform duration-300 ease-out motion-reduce:transition-none"
          />
        </motion.div>

        {many && (
          <button type="button" onClick={() => go(1)} aria-label="Next image" className={`${arrowClass} right-3 md:right-6`}>
            <ChevronRight className="size-6" aria-hidden="true" />
          </button>
        )}
      </div>

      <p aria-live="polite" className="px-6 pb-6 pt-4 text-center text-sm text-cream/80 md:text-base">
        {image.caption}
        <span className="sr-only">
          {" "}
          (image {index + 1} of {images.length})
        </span>
      </p>
    </motion.div>,
    document.body
  );
}
