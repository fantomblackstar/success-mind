"use client";

import { useMemo } from "react";
import { FEEDBACK_ITEMS } from "@/shared/config/feedback";
import { FEEDBACK_SCROLL_SPEEDS } from "../lib/landing-constants";
import { splitIntoColumns } from "../lib/split-into-columns";
import { FeedbackScrollingColumn } from "./feedback-scrolling-column";

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
