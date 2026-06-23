"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { FEEDBACK_ITEMS, type FeedbackItem } from "@/shared/config/feedback";
import {
  GLOBE_EARLY_ACCESS_REQUESTS,
  GLOBE_USER_MARKERS,
} from "@/shared/lib/globe-markers";
import { GlowingCard } from "@/shared/ui/aceternity";
import { CountUp } from "@/shared/ui/count-up";
import type { GlobeMarker } from "@/shared/ui/aceternity/globe-3d";
import { cn, cardHoverBorder } from "@/shared/lib";
import { BackgroundGradientAnimation } from "@/shared/ui/aceternity";
import { HeroAnimatedTitle, SectionTitle } from "@/shared/ui";
import { routes } from "@/shared/lib/routes";

const Globe3D = dynamic(
  () => import("@/shared/ui/aceternity/globe-3d").then((module) => module.Globe3D),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[500px] items-center justify-center text-zinc-500 md:h-[560px]">
        Loading globe...
      </div>
    ),
  },
);

const ctaClassName =
  "inline-flex rounded-md bg-purple-600 px-10 py-4 text-base font-semibold text-white transition hover:bg-purple-500";

const HOW_IT_WORKS_STEPS = [
  {
    title: "Share your goals",
    text: "Tell us what you want to achieve.",
  },
  {
    title: "Founder wisdom",
    text: "Answers from 100+ proven playbooks.",
  },
  {
    title: "Daily guidance",
    text: "Clear next steps every day.",
  },
  {
    title: "Move faster",
    text: "Turn ambition into action.",
  },
] as const;

function FeedbackCard({ item }: { item: FeedbackItem }) {
  return (
    <GlowingCard className="w-full">
      <p className="text-sm leading-relaxed text-zinc-300 md:text-base">
        &ldquo;{item.quote}&rdquo;
      </p>
      <div className="mt-4">
        <p className="text-base font-medium text-white">{item.name}</p>
        <p className="text-xs text-purple-300 md:text-sm">{item.role}</p>
      </div>
    </GlowingCard>
  );
}

function FeedbackMasonryColumn({
  items,
  keyPrefix,
}: {
  items: FeedbackItem[];
  keyPrefix: string;
}) {
  return (
    <div className="flex flex-col gap-4 pb-4">
      {items.map((item) => (
        <div key={`${keyPrefix}-${item.name}`} className="break-inside-avoid">
          <FeedbackCard item={item} />
        </div>
      ))}
    </div>
  );
}

function FeedbackScrollingColumn({
  items,
  animationClass,
  keyPrefix,
}: {
  items: FeedbackItem[];
  animationClass: string;
  keyPrefix: string;
}) {
  return (
    <div className={cn("min-w-0 flex-1", animationClass)}>
      <FeedbackMasonryColumn items={items} keyPrefix={`${keyPrefix}-a`} />
      <div aria-hidden="true">
        <FeedbackMasonryColumn items={items} keyPrefix={`${keyPrefix}-b`} />
      </div>
    </div>
  );
}

function splitIntoColumns(items: FeedbackItem[], columns: number) {
  return Array.from({ length: columns }, (_, columnIndex) =>
    items.filter((_, index) => index % columns === columnIndex),
  );
}

const FEEDBACK_SCROLL_SPEEDS = [
  "animate-feedback-scroll-fast",
  "animate-feedback-scroll-medium",
  "animate-feedback-scroll-slow",
] as const;

export function LandingFeedbackGrid() {
  const columns = useMemo(() => splitIntoColumns(FEEDBACK_ITEMS, 3), []);

  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-zinc-950 via-zinc-950/80 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />

      <div className="relative hidden h-[680px] overflow-hidden md:block md:h-[760px]">
        <div className="flex gap-5">
          {columns.map((columnItems, index) => (
            <FeedbackScrollingColumn
              key={FEEDBACK_SCROLL_SPEEDS[index]}
              items={columnItems}
              animationClass={FEEDBACK_SCROLL_SPEEDS[index]}
              keyPrefix={`col-${index}`}
            />
          ))}
        </div>
      </div>

      <div className="relative h-[680px] overflow-hidden md:hidden">
        <FeedbackScrollingColumn
          items={FEEDBACK_ITEMS}
          animationClass="animate-feedback-scroll-medium"
          keyPrefix="mobile"
        />
      </div>
    </div>
  );
}

export function LandingHero() {
  return (
    <BackgroundGradientAnimation
      containerClassName="hero-gradient-slow min-h-[88vh]"
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

export function LandingStats() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || entry.intersectionRatio < 0.2) return;
        setInView(true);
        observer.disconnect();
      },
      {
        threshold: [0, 0.2, 0.35, 0.5],
        rootMargin: "0px 0px -10% 0px",
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const stats = [
    {
      end: 3,
      suffix: "x",
      label: "Faster progress",
    },
    {
      end: 100,
      suffix: "+",
      label: "Founder playbooks",
    },
    {
      end: 24,
      suffix: "/7",
      label: "Always available",
    },
  ];

  return (
    <section ref={sectionRef} className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-10 text-center">
        <SectionTitle className="text-4xl md:text-5xl">By the numbers</SectionTitle>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={cn(cardHoverBorder, "rounded-lg bg-zinc-900/60 p-8 text-center")}
          >
            <CountUp
              end={stat.end}
              suffix={stat.suffix}
              duration={800}
              active={inView}
              className="block text-4xl font-bold md:text-5xl tabular-nums"
            />
            <p className="mt-3 text-base text-zinc-400 md:text-lg">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

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

export function LandingCommunityGlobe() {
  const markers = useMemo<GlobeMarker[]>(
    () =>
      GLOBE_USER_MARKERS.map((marker) => ({
        lat: marker.lat,
        lng: marker.lng,
        label: marker.label,
      })),
    [],
  );

  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="text-center">
        <SectionTitle className="text-4xl md:text-5xl">Join the waitlist</SectionTitle>
        <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-400 md:text-lg">
          {GLOBE_EARLY_ACCESS_REQUESTS} CEOs already applied worldwide.
        </p>
      </div>

      <div className="relative mx-auto mt-10 max-w-4xl">
        <Globe3D
          markers={markers}
          className="h-[480px] md:h-[540px]"
          config={{
            autoRotateSpeed: 0.4,
            showAtmosphere: true,
            atmosphereColor: "#a855f7",
            atmosphereIntensity: 0.3,
            markerSize: 0.034,
          }}
        />
      </div>
    </section>
  );
}

export function LandingCtaBand() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-20">
      <div className={cn(cardHoverBorder, "rounded-xl bg-gradient-to-r from-purple-950 to-zinc-900 p-12 text-center md:p-14")}>
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
