import Link from "next/link";
import { cn, cardHoverBorder } from "@/shared/lib";
import { routes } from "@/shared/lib/routes";
import { SectionTitle } from "@/shared/ui";
import { ctaClassName } from "../lib/landing-constants";

export function LandingCtaBand() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-20">
      <div
        className={cn(
          cardHoverBorder,
          "rounded-xl bg-gradient-to-r from-purple-950 to-zinc-900 p-12 text-center md:p-14",
        )}
      >
        <SectionTitle className="text-4xl md:text-5xl">Ready to start?</SectionTitle>
        <p className="mt-4 text-base text-zinc-400 md:text-lg">
          Join founders using AI guidance every day.
        </p>
        <Link href={routes.quiz(1)} className={cn("mt-10", ctaClassName)}>
          Get early access
        </Link>
      </div>
    </section>
  );
}
