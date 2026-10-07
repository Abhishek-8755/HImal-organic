import ParallaxImage from "@/components/ParallaxImage";

const WORDS = ["Rooted", "in", "the", "Himalayas"];

// Each word slides up out of a mask on page load. CSS (not JS), so it plays before
// hydration; globals.css turns it off with reduced motion.
function WordReveal() {
  return (
    <>
      <span className="sr-only">{WORDS.join(" ")}</span>
      <span aria-hidden="true">
        {WORDS.map((word, i) => (
          <span key={word}>
            {/* Vertical padding keeps descenders and the italic overhang inside the mask */}
            <span className="-my-[0.12em] inline-block overflow-hidden px-[0.04em] py-[0.12em] align-bottom">
              <span
                className={`inline-block animate-word ${i === WORDS.length - 1 ? "italic text-moss" : ""}`}
                style={{ animationDelay: `${150 + i * 110}ms` }}
              >
                {word}
              </span>
            </span>{" "}
          </span>
        ))}
      </span>
    </>
  );
}

export default function AboutHero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 top-0 -z-10 size-[44rem] rounded-full bg-turmeric/15 blur-3xl"
      />
      <div className="wrap grid items-center gap-14 pb-20 pt-32 lg:grid-cols-12 lg:gap-10 lg:pb-28 lg:pt-40">
        <div className="lg:col-span-7">
          <p className="eyebrow animate-rise">Our story</p>
          <h1 className="mt-6 font-display text-display text-forest">
            <WordReveal />
          </h1>
          {/* TODO: replace with the client's real founder story */}
          <div className="mt-8 max-w-xl animate-rise space-y-5 text-lg text-ink/75 [animation-delay:600ms] md:text-xl">
            <p>
              Himal Organic began at a kitchen table in a small hill village, stacked with sacks of rajma, red rice
              and mandua. Our founder grew up on food grown the slow way: terraced fields, farmyard manure, seeds
              saved from last year&apos;s harvest and water straight from mountain springs.
            </p>
            <p>
              When that food grew hard to find in the cities, we went back to the families who still farm this way.
              Today we bring their harvest to your kitchen, with nothing added and nothing taken away.
            </p>
          </div>
        </div>

        <div className="animate-rise [animation-delay:300ms] lg:col-span-5">
          <ParallaxImage
            src="/images/about/story.svg"
            alt="Terraced fields below snow-capped Himalayan peaks at sunrise"
            sizes="(min-width: 1024px) 34vw, (min-width: 640px) 28rem, 100vw"
            preload
            className="mx-auto aspect-[4/5] w-full max-w-md rounded-b-[2rem] rounded-t-full shadow-[0_40px_80px_-40px_rgb(31_61_43/0.45)] ring-1 ring-forest/10"
          />
        </div>
      </div>
    </section>
  );
}
