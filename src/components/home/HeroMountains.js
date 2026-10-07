import ScrollParallax from "@/components/ScrollParallax";

// Three mountain ranges across the bottom of the hero. Each one moves at its own speed
// on scroll: the farthest moves most, so it feels deepest. Lower on the left to keep
// clear of the headline and buttons.
const layer = "absolute inset-x-0 bottom-0 h-[38vh] min-h-[15rem] max-h-[24rem]";
const svg = "absolute inset-0 size-full";

export function FarMountains() {
  return (
    <ScrollParallax distance={170} className={layer}>
      <svg aria-hidden="true" viewBox="0 0 1440 360" preserveAspectRatio="none" className={svg}>
        <path
          d="M0 300 L140 276 L260 290 L390 250 L500 272 L620 226 L720 248 L830 170 L920 208 L1020 110 L1110 168 L1210 70 L1300 140 L1385 96 L1440 120 V360 H0 Z"
          fill="#D3DECF"
        />
        <g fill="#FBF8F1">
          <path d="M1020 110 L996 132 L1008 128 L1020 138 L1032 127 L1045 132 Z" />
          <path d="M1210 70 L1182 98 L1197 92 L1210 104 L1223 92 L1239 99 Z" />
          <path d="M1385 96 L1365 114 L1376 111 L1386 119 L1397 110 L1407 114 Z" />
          <path d="M830 170 L812 188 L822 185 L831 193 L840 185 L850 188 Z" />
        </g>
      </svg>
    </ScrollParallax>
  );
}

export function MidMountains() {
  return (
    <ScrollParallax distance={110} className={layer}>
      <svg aria-hidden="true" viewBox="0 0 1440 360" preserveAspectRatio="none" className={svg}>
        <path
          d="M0 326 C 150 308 280 300 420 306 C 580 312 680 262 820 238 C 960 214 1040 220 1170 170 C 1290 124 1370 128 1440 120 V360 H0 Z"
          fill="#A3BA9C"
        />
      </svg>
    </ScrollParallax>
  );
}

// Sits in front of the arch, so the arch looks rooted in the hills
export function FrontMountains() {
  return (
    <ScrollParallax distance={50} className={layer}>
      <svg aria-hidden="true" viewBox="0 0 1440 360" preserveAspectRatio="none" className={svg}>
        <path
          d="M0 346 C 200 336 360 328 520 330 C 640 332 700 250 820 200 C 920 160 1060 150 1200 152 C 1320 154 1400 150 1440 148 V360 H0 Z"
          fill="#5F8A58"
        />
        <g fill="none" stroke="#7FA176" strokeWidth="2.5" opacity="0.7" vectorEffect="non-scaling-stroke">
          <path d="M600 352 C 700 330 760 266 880 230 C 1000 196 1200 196 1440 196" />
          <path d="M760 358 C 860 330 940 292 1060 270 C 1200 248 1320 250 1440 250" />
          <path d="M980 364 C 1080 346 1180 326 1280 316 C 1350 310 1400 306 1440 304" />
        </g>
      </svg>
    </ScrollParallax>
  );
}
