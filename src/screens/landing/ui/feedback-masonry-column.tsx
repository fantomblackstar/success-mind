import type { FeedbackItem } from "@/shared/config/feedback";
import { FeedbackCard } from "./feedback-card";

export function FeedbackMasonryColumn({
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
