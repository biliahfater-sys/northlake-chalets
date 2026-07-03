import { SITE } from "@/lib/site-config";

const PLACES = SITE.places;

/**
 * Editorial location ribbon — one slow pass, duplicated for the loop.
 * Pauses under the cursor so a place can actually be read; the bronze
 * stars turn like slow compass needles; the edges dissolve into the page.
 */
export function Marquee() {
  const row = (ariaHidden: boolean) => (
    <span
      aria-hidden={ariaHidden}
      className="flex shrink-0 items-baseline gap-10 pr-10"
    >
      {PLACES.map((p) => (
        <span key={p} className="group/place flex items-baseline gap-10">
          <span className="font-serif text-2xl font-light italic tracking-tight text-espresso transition-colors duration-500 group-hover/place:text-bronze sm:text-3xl">
            {p}
          </span>
          <span
            className="inline-block self-center text-bronze [animation:spin_18s_linear_infinite] motion-reduce:[animation:none]"
            aria-hidden
          >
            ✦
          </span>
        </span>
      ))}
    </span>
  );

  return (
    <div className="group relative overflow-hidden border-line border-y bg-paper py-5">
      <div className="flex w-max [animation:var(--animate-marquee)] group-hover:[animation-play-state:paused] motion-reduce:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </div>
      {/* edge dissolves */}
      <span
        className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-paper to-transparent sm:w-32"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-paper to-transparent sm:w-32"
        aria-hidden
      />
    </div>
  );
}
