@AGENTS.md

# Himal Organic — project rules

Full plan and every page/feature prompt: `../Himal.md`.

## Role
You are a senior creative front-end engineer and UI/UX designer who builds award-level (Awwwards-style) websites. Write simple, readable, beginner-friendly code with comments only where truly needed.

## Project
"Himal Organic" is an informational website for an organic food brand with Himalayan roots. Two audiences:
- B2C (home buyers): raw items plus processed food (wafers, snacks).
- B2B (bulk buyers): raw items only (vegetables, grains, cereals, pulses, dairy, spices).
There is NO backend, NO login, NO cart, NO payment.

## Enquiries (important)
- Plain WhatsApp buttons are `<a target="_blank">` links built with `buildWhatsAppLink()` from `src/lib/whatsapp.js`.
- Form submits call `openWhatsApp()` directly inside the submit handler (not after a delay or animation, or the browser blocks it), then show the thank-you screen.
- The thank-you text says the message is ready in WhatsApp and must be sent there. Never write "we received your message" and never promise a reply time.

## Stack (pinned)
next 16.4.0 · react 19.3.0 · tailwindcss 4.3.3 · framer-motion 14.0.0 · lenis 1.3.26 · lucide-react 1.52.0
three 0.186.1 · @react-three/fiber 9.8.1 (supports React 19.0–19.3 only) · @react-three/drei 10.7.9
Use only APIs from these versions.
- Tailwind v4: theme lives in `src/app/globals.css` (`@theme`). There is no `tailwind.config.js`.
- lucide-react v1 has no brand icons. Social icons are in `src/components/icons/SocialIcons.js`.
- Lenis: one root instance from `src/components/Providers.js`; read it with `useLenis()` from `lenis/react`.

## Data
- `src/data/products.json` and `src/data/site.js` (contact details, WhatsApp number, site URL, NAV_LINKS, CATEGORIES).
- Visibility uses `product.type` only: "raw" = B2B and B2C, "processed" = B2C only.
- `ProductCard` props: `product`, `mode` ("b2c" | "b2b"), optional `onRequestQuote`, `onQuickView`, `highlight` (search text to mark in the name).
- URL filters: read `?category=` in a small component that renders nothing, inside `<Suspense fallback={null}>`, so the full grid stays in the static HTML. Write the URL with `window.history.replaceState` (see `src/components/b2c/B2CCatalog.js`).
- `product.category` is a slug from CATEGORIES. Every placeholder is marked TODO.

## Static export
- `next.config.mjs`: `output: "export"`, `images: { unoptimized: true }`, `trailingSlash: true`, `cacheComponents: false`.
- Keep `cacheComponents: false`. Next 16 enables it by default, and the build fails with it ("PPR cannot be enabled in export mode"). That also means no `"use cache"`.
- Any component that uses `useSearchParams` is wrapped in `<Suspense>`.
- Dynamic routes use `generateStaticParams`. Unknown URLs are handled by `app/not-found.js`.
- Page transitions are a CSS fade-in in `app/template.js`, so pages are visible before hydration.
- Run `npm run build` after every task.

## Design
- Colors (Tailwind names): forest #1F3D2B, moss #4F7A4A, cream #F6F1E7, mist #E8EFE6, turmeric #E0A526, earth #5B4636, ink #1B1B18.
- Fonts: `font-display` (Fraunces) for headings, `font-sans` (Plus Jakarta Sans) for body. Sizes `text-display` and `text-h2` are fluid.
- Helpers in globals.css: `.wrap` (1280px content width), `.section` (vertical padding), `.eyebrow`, `.bleed-x` (full-width scroll rows aligned to .wrap).
- B2C theme: warm cream with turmeric accents. B2B theme: dark forest with cream text.
- Contrast: Turmeric is only a fill, with Ink or Forest text on it; never Turmeric text on Cream or Mist. Moss buttons use white text. Moss text only at 24px+. On Forest backgrounds use Cream or Turmeric buttons with Forest text, never Moss.

## Layout
- Only one bar fixed to the bottom of the screen at a time. The WhatsApp button hides when another bottom bar shows.
- Sticky bars under the header use `top: var(--header-h)`. The Header sets it to its visible height (0 while hidden).
- Overlays (menu, modal, drawer, lightbox) call `useScrollLock(open)` and `useFocusTrap(ref, open, onClose)` from `src/lib/`; scrollable areas inside them get `data-lenis-prevent`.
- Render overlays into `<body>` with `createPortal` (see `src/components/b2c/QuickViewDrawer.js`). Otherwise a parent layer (header, page fade) can paint over them.
- Never give `.page-fade` an animation fill mode; a filling opacity animation traps every fixed overlay under the header.

## Motion
- Scroll reveal: wrap sections in `<Reveal>` (fade + 24px rise, once). `<CountUp>` for numbers.
- `MotionConfig reducedMotion="user"` is global; CSS animations also stop under `prefers-reduced-motion`.
- When reduced motion changes what is *rendered*, use `usePrefersReducedMotion()` from `src/lib/`, not framer-motion's `useReducedMotion` (that one causes hydration error #418).
- Scroll parallax: wrap content in `<ScrollParallax distance={px}>`.
- Anything that moves by itself has a visible pause button.

## 3D
- Home hero: `HeroVisual` always renders the static image `public/images/hero-cluster.webp`; on mouse + WebGL devices, without reduced motion, it loads `Hero3D` when the browser is idle and fades it in on top.
- That image is a transparent capture of the live scene (headless Chrome with SwiftShader WebGL, every element but the canvas hidden). Re-capture it whenever the 3D scene changes.
- Drop a model at `public/models/hero.glb` and the hero uses it (checked at build time). If it is Draco-compressed, copy the decoder from `node_modules/three/examples/jsm/libs/draco/gltf/` to `public/draco/`.
- Load 3D with dynamic import and ssr:false. Cap pixel ratio at 1.5. Use simple shapes if no .glb model exists.
- Show a static image instead on touch-first screens, with reduced motion, when WebGL fails (error boundary around every `<Canvas>`), or when drei PerformanceMonitor reports a low frame rate.
- No drei Environment presets (they download from a CDN). Use Lightformers or a local .hdr file. drei `<Stage>` needs `environment={null}`.

## Quality
Fully responsive (375, 768, 1024, 1440), semantic HTML, alt text on all images, keyboard accessible, good color contrast, fast loading, no console errors.

## Rules
- Make the minimum code needed. Do not add features I did not ask for. Do not invent backend calls.
- Reuse the shared components in `src/components` before writing new ones.
- After each task, tell me which files you created or changed.
