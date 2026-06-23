"use client";

import { motion } from "framer-motion";
import { cn } from "@/shared/lib";
import { titleGradientTextClassName } from "@/shared/ui/section-title";

export function HeroAnimatedTitle({
  words,
  gradientWords = [],
  className,
  wordDelay = 0.18,
  duration = 0.9,
}: {
  words: string[];
  gradientWords?: string[];
  className?: string;
  wordDelay?: number;
  duration?: number;
}) {
  const gradientSet = new Set(gradientWords);

  return (
    <h1 className={className}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: index * wordDelay,
            duration,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={cn(
            "mr-[0.28em] inline-block last:mr-0",
            gradientSet.has(word) && titleGradientTextClassName,
          )}
        >
          {word}
        </motion.span>
      ))}
    </h1>
  );
}
