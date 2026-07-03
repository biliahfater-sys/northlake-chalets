"use client";

import { BackgroundVideo } from "@/components/media/background-video";
import { Embers } from "@/components/media/embers";
import { Reveal } from "@/components/motion/reveal";
import { RiseLines } from "@/components/motion/text-rise";
import { ContactForm } from "@/features/contact/contact-form";
import { useI18n } from "@/lib/i18n";
import { VIDEO } from "@/lib/media";

/** Final chapter — the fireside enquiry. */
export function Contact() {
  const { t } = useI18n();
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-pine-deep text-cream"
    >
      <BackgroundVideo
        src={VIDEO.firepit1080}
        srcMobile={VIDEO.firepit720}
        poster={VIDEO.firepitPoster}
      />
      <span
        className="absolute inset-0 z-[1] bg-gradient-to-b from-pine-deep via-pine-deep/55 to-pine-deep/90"
        aria-hidden
      />
      <Embers className="z-[2]" />
      <span className="grain-overlay z-[2]" aria-hidden />
      <span
        className="light-bloom -bottom-32 -left-32 absolute z-[2] h-[30rem] w-[30rem] opacity-70"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-[92rem] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-44">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,34rem)] lg:gap-24">
          <div className="flex flex-col justify-center">
            <Reveal direction="none">
              <span className="eyebrow flex items-center gap-3 text-gold-soft">
                <span className="h-px w-10 bg-gold-soft/50" aria-hidden />
                {t.contact.eyebrow}
              </span>
            </Reveal>
            <h2 className="mt-6 max-w-xl font-serif text-[clamp(2.6rem,5.8vw,5.4rem)] font-light leading-[1.02] tracking-[-0.03em]">
              <RiseLines
                delay={0.1}
                lines={[
                  t.contact.hA,
                  <span key="accent">
                    {t.contact.hB}{" "}
                    <em className="italic text-gold-soft">{t.contact.hAccent}</em>
                  </span>,
                ]}
              />
            </h2>
            <Reveal delay={0.2}>
              <p className="mt-8 max-w-md text-pretty text-lg leading-relaxed text-cream-dim">
                {t.contact.sub}
              </p>
            </Reveal>

            <div className="mt-14 max-w-md">
              <span className="rule-line bg-cream/15" aria-hidden />
              {t.contact.assurances.map((a, i) => (
                <Reveal key={a.title} delay={0.25 + i * 0.08} direction="none">
                  <div className="grid grid-cols-[7rem_1fr] items-baseline gap-4 border-cream/12 border-b py-5">
                    <span className="text-[0.68rem] uppercase tracking-[0.22em] text-gold-soft">
                      {a.title}
                    </span>
                    <p className="text-sm leading-relaxed text-cream-faint">
                      {a.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.15} className="lg:py-6">
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
