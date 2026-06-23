import type { FeedbackItem } from "@/shared/config/feedback";
import { cn } from "@/shared/lib";
import { FeedbackMasonryColumn } from "./feedback-masonry-column";

export function FeedbackScrollingColumn({
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
