"use client";

import { useEffect, useRef, useState } from "react";
import { cn, cardHoverBorder } from "@/shared/lib";
import { CountUp } from "@/shared/ui/count-up";
import { SectionTitle } from "@/shared/ui";

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
