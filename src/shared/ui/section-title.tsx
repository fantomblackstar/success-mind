import { cn } from "@/shared/lib";

export const titleGradientTextClassName =
  "bg-gradient-to-r from-purple-900 via-purple-600 to-purple-300 bg-clip-text text-transparent";

export const titleGradientClassName = cn(
  titleGradientTextClassName,
  "text-center font-semibold tracking-tight",
);

export function SectionTitle({
  children,
  className,
  as: Component = "h2",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <Component className={cn(titleGradientClassName, "block w-full", className)}>
      {children}
    </Component>
  );
}
