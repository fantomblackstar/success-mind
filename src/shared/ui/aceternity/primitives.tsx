"use client";

import { motion } from "framer-motion";
import { cn } from "@/shared/lib";

export function AuroraBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-1/4 top-0 h-96 w-96 rounded-full bg-purple-600/30 blur-[100px]" />
        <div className="absolute right-0 top-20 h-80 w-80 rounded-full bg-violet-500/20 blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-[100px]" />
      </div>
      {children}
    </div>
  );
}

export function TextGenerateEffect({ words }: { words: string }) {
  const tokens = words.split(" ");
  return (
    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
      {tokens.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08 }}
          className="mr-2 inline-block"
        >
          {word}
        </motion.span>
      ))}
    </h1>
  );
}

export function MovingBorderButton({
  children,
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "relative inline-flex overflow-hidden rounded-full p-[1px] focus:outline-none",
        className,
      )}
      {...props}
    >
      <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#a855f7_0%,#581c87_50%,#a855f7_100%)]" />
      <span className="relative inline-flex h-full w-full items-center justify-center rounded-full bg-purple-600 px-8 py-3 text-sm font-medium text-white backdrop-blur-xl">
        {children}
      </span>
    </button>
  );
}

export function GlowingCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group relative rounded-2xl border border-white/10 bg-zinc-900/70 p-5 transition hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition group-hover:opacity-100 bg-gradient-to-br from-purple-500/10 to-transparent" />
      <div className="relative">{children}</div>
    </div>
  );
}

export function SpotlightSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-950/80 via-zinc-900 to-purple-950/80 p-10">
      <div className="pointer-events-none absolute -left-20 top-0 h-40 w-40 rounded-full bg-purple-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-violet-400/20 blur-3xl" />
      <div className="relative">{children}</div>
    </div>
  );
}
