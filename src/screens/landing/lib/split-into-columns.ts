import type { FeedbackItem } from "@/shared/config/feedback";

export function splitIntoColumns(items: FeedbackItem[], columns: number) {
  return Array.from({ length: columns }, (_, columnIndex) =>
    items.filter((_, index) => index % columns === columnIndex),
  );
}
