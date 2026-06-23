"use client";

import Link from "next/link";
import { routes } from "@/shared/lib/routes";
import { BackgroundGradientAnimation } from "@/shared/ui/aceternity";
import { HeroAnimatedTitle } from "@/shared/ui";
import { ctaClassName } from "../lib/landing-constants";

export function LandingHero() {
  return (
    <BackgroundGradientAnimation
      containerClassName="min-h-[88vh]"
      className="flex min-h-[88vh] w-full flex-col items-center justify-center"
    >
      <section className="relative w-full px-4 py-10 text-center">
        <p className="mb-5 text-base uppercase tracking-[0.2em] text-purple-300 md:text-lg">
          AI business assistant
        </p>
        <HeroAnimatedTitle
          words={["Reach", "your", "goals", "3x", "faster", "with", "100+", "founders"]}
          gradientWords={["3x", "faster"]}
          wordDelay={0.2}
          duration={1}
          className="mx-auto max-w-5xl text-center text-5xl font-bold leading-tight text-white md:text-7xl"
        />
        <p className="mx-auto mt-8 max-w-2xl text-lg text-zinc-400 md:text-xl">
          Daily guidance from your AI mentor.
        </p>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Link href={routes.quiz(1)} className={ctaClassName}>
            Get started
          </Link>
        </div>
      </section>
    </BackgroundGradientAnimation>
  );
}
