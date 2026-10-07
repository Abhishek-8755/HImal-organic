"use client";

import { Component, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useInView } from "framer-motion";
import usePrefersReducedMotion from "@/lib/usePrefersReducedMotion";

const Hero3D = dynamic(() => import("@/components/home/Hero3D"), { ssr: false });

// If WebGL or the scene crashes, show the static image instead
class SceneErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function canRun3D() {
  const mouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const saveData = navigator.connection?.saveData === true;
  let webgl = false;
  try {
    const canvas = document.createElement("canvas");
    webgl = !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    webgl = false;
  }
  return mouse && !saveData && webgl;
}

// The static render is always in the HTML. On capable desktops the live 3D scene
// loads after the page is idle and fades in on top; anything else keeps the image.
export default function HeroVisual({ modelUrl }) {
  const ref = useRef(null);
  const inView = useInView(ref);
  const reduceMotion = usePrefersReducedMotion();
  const [eligible, setEligible] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (reduceMotion || !canRun3D()) return;
    // Wait until the browser is idle so 3D never competes with the first paint
    const idle = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 1200));
    const cancel = window.cancelIdleCallback ?? clearTimeout;
    const id = idle(() => setEligible(true), { timeout: 2500 });
    return () => cancel(id);
  }, [reduceMotion]);

  const show3D = eligible && !failed && !reduceMotion;
  const fallback = () => setFailed(true);

  return (
    <div ref={ref} className="absolute -inset-x-[12%] -inset-y-[6%]">
      {/* Static render of the same scene (regenerate it if the 3D scene changes) */}
      <Image
        src="/images/hero-cluster.webp"
        alt="A sack of red rice, a jar of ghee, garlic and kidney beans floating in front of a Himalayan sun"
        fill
        preload
        sizes="(min-width: 1024px) 40vw, 26rem"
        className={`object-contain transition-opacity duration-700 motion-safe:animate-float ${
          show3D && ready ? "opacity-0" : "opacity-100"
        }`}
      />
      {show3D && (
        <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}>
          <SceneErrorBoundary onError={fallback}>
            <Hero3D modelUrl={modelUrl} active={inView} onReady={() => setReady(true)} onFallback={fallback} />
          </SceneErrorBoundary>
        </div>
      )}
    </div>
  );
}
