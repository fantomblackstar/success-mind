"use client";

import { useEffect, useRef, useState } from "react";

export function CountUp({
  end,
  suffix = "",
  prefix = "",
  duration = 800,
  className,
  active,
}: {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  /** When set, animation runs only after this becomes true (e.g. section scroll). */
  active?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (active === false) return;

    const shouldUseObserver = active === undefined;

    const runAnimation = () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;

      const from = 1;
      const startTime = performance.now();
      setValue(from);

      const tick = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.max(from, Math.round(from + (end - from) * eased)));

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
    };

    if (!shouldUseObserver) {
      if (active) runAnimation();
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || hasAnimated.current) return;
        if (entry.intersectionRatio < 0.5) return;

        observer.disconnect();
        runAnimation();
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: "0px 0px -12% 0px",
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [active, duration, end]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
