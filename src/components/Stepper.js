"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import usePrefersReducedMotion from "@/lib/usePrefersReducedMotion";

// Shared step timeline: <Stepper steps={[...]} variant="line" | "draw" />
export default function Stepper({ variant = "line", ...props }) {
  return variant === "draw" ? <DrawStepper {...props} /> : <LineStepper {...props} />;
}

// variant "line": 4 columns on desktop with a horizontal line,
// a vertical list on smaller screens. The line fills as the section scrolls into view
// and each step lights up when the fill reaches it.
// tone: "light" (cream pages) or "dark" (forest pages). iconBg must match the section
// background, so the icons cover the line behind them.
// Each step: { title, text } plus either `icon` (an element like <Truck />, which works
// from Server Components) or `Icon` (a component, only from Client Components).
function LineStepper({ steps, tone = "light", iconBg = "bg-cream", className = "" }) {
  const ref = useRef(null);
  const reduceMotion = usePrefersReducedMotion();
  const [track, setTrack] = useState(null);
  const [reached, setReached] = useState(-1);
  const dark = tone === "dark";

  // The line runs from the centre of the first icon to the centre of the last one
  useEffect(() => {
    const measure = () => {
      const box = ref.current.getBoundingClientRect();
      const icons = ref.current.querySelectorAll("[data-step-icon]");
      const centre = (el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top };
      };
      const a = centre(icons[0]);
      const b = centre(icons[icons.length - 1]);
      const vertical = Math.abs(b.y - a.y) > Math.abs(b.x - a.x);
      setTrack(
        vertical
          ? { vertical, style: { left: a.x - 1, top: a.y, width: 2, height: b.y - a.y } }
          : { vertical, style: { left: a.x, top: a.y - 1, width: b.x - a.x, height: 2 } }
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 55%"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => setReached(Math.floor(p * (steps.length - 1) + 0.001)));
  const lit = (i) => reduceMotion || i <= reached;

  return (
    <div ref={ref} className={`relative ${className}`}>
      {track && (
        <div aria-hidden="true" className={`absolute rounded-full ${dark ? "bg-cream/15" : "bg-forest/15"}`} style={track.style}>
          <motion.div
            className={`absolute inset-0 rounded-full ${dark ? "bg-turmeric" : "bg-moss"} ${
              track.vertical ? "origin-top" : "origin-left"
            }`}
            style={track.vertical ? { scaleY: reduceMotion ? 1 : scrollYProgress } : { scaleX: reduceMotion ? 1 : scrollYProgress }}
          />
        </div>
      )}
      <ol className="relative grid gap-10 lg:grid-cols-4">
        {steps.map(({ Icon, icon, title, text }, i) => (
          <li key={title} className="grid grid-cols-[4rem_1fr] items-start gap-5 lg:block">
            <span
              data-step-icon
              className={`relative grid size-16 place-items-center rounded-full ring-1 transition-colors duration-500 ${
                lit(i)
                  ? dark
                    ? "bg-turmeric text-forest ring-turmeric"
                    : "bg-forest text-cream ring-forest"
                  : dark
                    ? `${iconBg} text-cream ring-cream/25`
                    : `${iconBg} text-forest ring-forest/20`
              }`}
            >
              <span aria-hidden="true" className="[&>svg]:size-7 [&>svg]:stroke-[1.5]">
                {icon ?? <Icon />}
              </span>
            </span>
            <div className="lg:mt-7">
              <p className={`eyebrow ${dark ? "text-turmeric" : ""}`}>Step 0{i + 1}</p>
              <h3 className={`mt-2 font-display text-[1.75rem] ${dark ? "text-cream" : "text-forest"}`}>{title}</h3>
              <p className={`mt-2 max-w-[16rem] ${dark ? "text-cream/75" : "text-ink/75"}`}>{text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

// variant "draw" (cream sections): a vertical line that draws itself (SVG pathLength) as you
// scroll, its tip held at 65% of the screen height. Steps alternate left and right of the
// line on desktop and stack beside it on smaller screens; each dot lights up when the line
// reaches it. Each step: { title, text }, e.g. a year and one line.
function DrawStepper({ steps, className = "" }) {
  const ref = useRef(null);
  const lineRef = useRef(null);
  const reduceMotion = usePrefersReducedMotion();
  const [line, setLine] = useState(null); // position, plus where each dot sits along it (0 to 1)
  const [reached, setReached] = useState(-1);

  // The line runs from the centre of the first dot to the centre of the last one
  useEffect(() => {
    const measure = () => {
      const box = ref.current.getBoundingClientRect();
      const dots = [...ref.current.querySelectorAll("[data-step-dot]")].map((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top };
      });
      const first = dots[0];
      const length = dots[dots.length - 1].y - first.y;
      setLine({
        style: { left: first.x - 1, top: first.y, height: length },
        stops: dots.map((d) => (d.y - first.y) / length),
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({ target: lineRef, offset: ["start 65%", "end 65%"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (line) setReached(line.stops.filter((stop) => stop <= p + 0.001).length - 1);
  });
  const lit = (i) => reduceMotion || i <= reached;

  return (
    <div ref={ref} className={`relative ${className}`}>
      <svg
        ref={lineRef}
        aria-hidden="true"
        viewBox="0 0 2 100"
        preserveAspectRatio="none"
        className="absolute w-0.5"
        style={line?.style ?? { top: 0, left: 0, height: 0 }}
      >
        <line x1="1" y1="0" x2="1" y2="100" strokeWidth="2" className="stroke-forest/15" />
        <motion.line
          x1="1"
          y1="0"
          x2="1"
          y2="100"
          strokeWidth="2"
          className="stroke-moss"
          style={{ pathLength: reduceMotion ? 1 : scrollYProgress }}
        />
      </svg>
      <ol className="relative space-y-12 lg:space-y-6">
        {steps.map(({ title, text }, i) => {
          const right = i % 2 === 1;
          return (
            <li key={title} className="grid grid-cols-[1.5rem_1fr] items-start gap-x-6 lg:grid-cols-[1fr_3rem_1fr] lg:gap-x-10">
              <span
                data-step-dot
                className={`col-start-1 row-start-1 mt-4 size-4 justify-self-center rounded-full border-2 shadow-[0_0_0_6px_var(--color-cream)] transition duration-500 md:mt-[1.375rem] lg:col-start-2 ${
                  lit(i) ? "scale-125 border-moss bg-moss" : "border-forest/30 bg-cream"
                }`}
              />
              <div className={`col-start-2 row-start-1 ${right ? "lg:col-start-3" : "lg:col-start-1 lg:text-right"}`}>
                <h3 className="font-display text-5xl leading-none text-forest md:text-6xl">{title}</h3>
                <p className={`mt-4 max-w-sm text-lg text-ink/75 ${right ? "" : "lg:ml-auto"}`}>{text}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
