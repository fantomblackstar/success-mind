import type { FeedbackItem } from "@/shared/config/feedback";
import { GlowingCard } from "@/shared/ui/aceternity";

export function FeedbackCard({ item }: { item: FeedbackItem }) {
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
