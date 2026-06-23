import { cn, cardHoverBorder } from "@/shared/lib";
import { SectionTitle } from "@/shared/ui";
import { HOW_IT_WORKS_STEPS } from "../lib/landing-constants";

export function LandingHowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <SectionTitle className="text-3xl md:text-4xl">How it works</SectionTitle>
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {HOW_IT_WORKS_STEPS.map((step, index) => (
          <div
            key={step.title}
            className={cn(cardHoverBorder, "rounded-lg bg-zinc-900/50 p-7 text-left")}
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-purple-600/20 text-lg font-semibold text-purple-300">
              {index + 1}
            </div>
            <h3 className="text-xl font-semibold text-white md:text-2xl">{step.title}</h3>
            <p className="mt-3 text-base leading-relaxed text-zinc-400 md:text-lg">
              {step.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
