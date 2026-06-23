import { cn } from "@/shared/lib";

export function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-zinc-800/80", className)}
      {...props}
    />
  );
}
