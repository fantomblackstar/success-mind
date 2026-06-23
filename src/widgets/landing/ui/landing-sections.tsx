"use client";

import Link from "next/link";
import { useEffect } from "react";
import { FEEDBACK_ITEMS } from "@/shared/config/feedback";
import { GlowingCard } from "@/shared/ui/aceternity";
import { cn } from "@/shared/lib";
import { routes } from "@/shared/lib/routes";

export function LandingFeedbackGrid() {
  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
      {FEEDBACK_ITEMS.map((item) => (
        <GlowingCard
          key={item.name}
          className={cn(
            "mb-4 break-inside-avoid",
            item.height === "tall" && "min-h-[220px]",
            item.height === "medium" && "min-h-[180px]",
            item.height === "short" && "min-h-[140px]",
          )}
        >
          <p className="text-sm leading-relaxed text-zinc-300">
            &ldquo;{item.quote}&rdquo;
          </p>
          <div className="mt-4">
            <p className="font-medium text-white">{item.name}</p>
            <p className="text-xs text-purple-300">{item.role}</p>
          </div>
        </GlowingCard>
      ))}
    </div>
  );
}

export function LandingHero() {
  return (
    <section className="relative px-4 pb-20 pt-16 text-center">
      <p className="mb-4 text-sm uppercase tracking-[0.2em] text-purple-300">
        AI co-founder for CEOs and founders
      </p>
      <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight text-white sm:text-6xl">
        Build success <span className="text-purple-400">3x faster</span> with an
        AI trained on 100+ top founders
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
        Success Mind helps you make better business choices every day. Simple
        advice. Strong results.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          href={routes.quiz(1)}
          className="rounded-full bg-purple-600 px-8 py-3 text-sm font-medium text-white transition hover:bg-purple-500"
        >
          Start Your Success Journey
        </Link>
      </div>
    </section>
  );
}

export function LandingStats() {
  const stats = [
    { value: "3x", label: "Faster decisions" },
    { value: "100+", label: "Founder minds" },
    { value: "24/7", label: "AI partner" },
  ];

  return (
    <section className="mx-auto grid max-w-4xl grid-cols-1 gap-4 px-4 py-8 sm:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 text-center"
        >
          <p className="text-3xl font-bold text-purple-300">{stat.value}</p>
          <p className="mt-2 text-sm text-zinc-400">{stat.label}</p>
        </div>
      ))}
    </section>
  );
}

export function LandingFeatures() {
  const items = [
    {
      title: "Smart strategy",
      text: "Get clear next steps for growth, team, and focus.",
    },
    {
      title: "Founder knowledge",
      text: "Learn from patterns shared by successful leaders.",
    },
    {
      title: "Daily momentum",
      text: "Stay on track with simple plans you can act on fast.",
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-center text-3xl font-semibold text-white">
        Why leaders choose Success Mind
      </h2>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <GlowingCard key={item.title}>
            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-3 text-sm text-zinc-400">{item.text}</p>
          </GlowingCard>
        ))}
      </div>
    </section>
  );
}

export function LandingHowItWorks() {
  const steps = [
    "Share your goals",
    "AI learns from founder playbooks",
    "Reach success with clear action",
  ];

  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <h2 className="text-center text-2xl font-semibold text-white">
        How it works
      </h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={step}
            className="rounded-xl border border-white/10 p-4 text-center"
          >
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-purple-600/20 text-purple-300">
              {index + 1}
            </div>
            <p className="text-sm text-zinc-300">{step}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function LandingCtaBand() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <div className="rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-950 to-zinc-900 p-10 text-center">
        <h2 className="text-3xl font-semibold text-white">Ready to grow?</h2>
        <p className="mt-3 text-zinc-400">
          Join founders who use AI to move faster.
        </p>
        <Link
          href={routes.quiz(1)}
          className="mt-8 inline-flex rounded-full bg-purple-600 px-8 py-3 text-sm font-medium text-white hover:bg-purple-500"
        >
          Get Early Access
        </Link>
      </div>
    </section>
  );
}

export function LandingSessionInit() {
  useEffect(() => {
    fetch(routes.api.funnelSession, { method: "POST" }).catch(console.error);
    fetch(routes.api.funnelEvents, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ step: "landing_view" }),
    }).catch(console.error);
  }, []);

  return null;
}
