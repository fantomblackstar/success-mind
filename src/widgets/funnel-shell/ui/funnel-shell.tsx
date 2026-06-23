import { cn, cardHoverBorder } from "@/shared/lib";
import { SectionTitle } from "@/shared/ui";

export function FunnelShell({
  title,
  subtitle,
  step,
  wide = false,
  children,
}: {
  title: string;
  subtitle?: string;
  step?: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "mx-auto flex min-h-[70vh] w-full flex-col justify-center px-4 py-12",
        wide ? "max-w-5xl" : "max-w-xl",
      )}
    >
      {step ? (
        <p className="mb-4 text-center text-sm uppercase tracking-widest text-purple-400">
          {step}
        </p>
      ) : null}
      <div
        className={cn(
          cardHoverBorder,
          "rounded-xl bg-zinc-900/80 p-10 shadow-2xl shadow-purple-950/20",
        )}
      >
        <SectionTitle as="h1" className="text-3xl md:text-4xl">
          {title}
        </SectionTitle>
        {subtitle ? (
          <p className="mt-3 text-center text-base text-zinc-400">{subtitle}</p>
        ) : null}
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
