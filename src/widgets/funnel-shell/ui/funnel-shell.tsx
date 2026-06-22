import { cn } from "@/lib/utils";

export function FunnelShell({
  title,
  subtitle,
  step,
  children,
}: {
  title: string;
  subtitle?: string;
  step?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-lg flex-col justify-center px-4 py-12">
      {step ? (
        <p className="mb-4 text-center text-xs uppercase tracking-widest text-purple-400">
          {step}
        </p>
      ) : null}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/80 p-8 shadow-2xl shadow-purple-950/20">
        <h1 className="text-center text-2xl font-semibold text-white">{title}</h1>
        {subtitle ? (
          <p className="mt-2 text-center text-sm text-zinc-400">{subtitle}</p>
        ) : null}
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}

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
        "w-full rounded-xl border px-4 py-3 text-left text-sm transition",
        selected
          ? "border-purple-500 bg-purple-500/20 text-white"
          : "border-white/10 bg-zinc-950/50 text-zinc-300 hover:border-purple-500/50",
      )}
    >
      {children}
    </button>
  );
}
