import { cn, cardHoverBorder } from "@/shared/lib";

export function OptionButton({
  selected,
  onClick,
  children,
}: {
  selected?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-lg border px-5 py-4 text-left text-base transition",
        selected
          ? "border-purple-500 bg-purple-500/20 text-white"
          : cn(cardHoverBorder, "bg-zinc-950/50 text-zinc-300"),
      )}
    >
      {children}
    </button>
  );
}
