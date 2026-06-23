"use client";

import { cn } from "@/shared/lib";
import { useEffect, useRef, useState } from "react";

export function BackgroundGradientAnimation({
  gradientBackgroundStart = "rgb(2, 2, 4)",
  gradientBackgroundEnd = "rgb(10, 2, 16)",
  firstColor = "76, 29, 149",
  secondColor = "91, 33, 168",
  thirdColor = "107, 33, 168",
  pointerColor = "126, 34, 206",
  size = "42%",
  blendingValue = "hard-light",
  children,
  className,
  interactive = true,
  containerClassName,
  showBottomMask = true,
}: {
  gradientBackgroundStart?: string;
  gradientBackgroundEnd?: string;
  firstColor?: string;
  secondColor?: string;
  thirdColor?: string;
  pointerColor?: string;
  size?: string;
  blendingValue?: string;
  children?: React.ReactNode;
  className?: string;
  interactive?: boolean;
  containerClassName?: string;
  showBottomMask?: boolean;
}) {
  const interactiveRef = useRef<HTMLDivElement>(null);
  const pointerState = useRef({ curX: 0, curY: 0, tgX: 0, tgY: 0 });
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    document.body.style.setProperty("--gradient-background-start", gradientBackgroundStart);
    document.body.style.setProperty("--gradient-background-end", gradientBackgroundEnd);
    document.body.style.setProperty("--first-color", firstColor);
    document.body.style.setProperty("--second-color", secondColor);
    document.body.style.setProperty("--third-color", thirdColor);
    document.body.style.setProperty("--pointer-color", pointerColor);
    document.body.style.setProperty("--size", size);
    document.body.style.setProperty("--blending-value", blendingValue);
  }, [
    blendingValue,
    firstColor,
    gradientBackgroundEnd,
    gradientBackgroundStart,
    pointerColor,
    secondColor,
    size,
    thirdColor,
  ]);

  useEffect(() => {
    if (!interactive) return;

    let frameId = 0;

    const animate = () => {
      const state = pointerState.current;
      state.curX += (state.tgX - state.curX) / 20;
      state.curY += (state.tgY - state.curY) / 20;

      if (interactiveRef.current) {
        interactiveRef.current.style.transform = `translate(${Math.round(state.curX)}px, ${Math.round(state.curY)}px)`;
      }

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [interactive]);

  useEffect(() => {
    setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));
  }, []);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    pointerState.current.tgX = event.clientX - rect.left;
    pointerState.current.tgY = event.clientY - rect.top;
  };

  return (
    <div
      className={cn(
        "relative left-0 top-0 w-full overflow-hidden bg-[linear-gradient(40deg,var(--gradient-background-start),var(--gradient-background-end))]",
        containerClassName,
      )}
      onMouseMove={interactive ? handleMouseMove : undefined}
    >
      <svg className="hidden">
        <defs>
          <filter id="blurMe">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div className={cn("relative z-10", className)}>{children}</div>

      <div
        className={cn(
          "gradients-container pointer-events-none absolute inset-0 z-0 h-full w-full blur-lg",
          isSafari ? "blur-2xl" : "[filter:url(#blurMe)_blur(40px)]",
        )}
      >
        <div
          className={cn(
            "absolute animate-first opacity-100",
            "top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] h-[var(--size)] w-[var(--size)] [transform-origin:center_center]",
            "[background:radial-gradient(circle_at_center,_rgba(var(--first-color),_0.8)_0,_rgba(var(--first-color),_0)_50%)_no-repeat]",
            "[mix-blend-mode:var(--blending-value)]",
          )}
        />
        <div
          className={cn(
            "absolute animate-second opacity-100",
            "top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] h-[var(--size)] w-[var(--size)] [transform-origin:calc(50%-400px)]",
            "[background:radial-gradient(circle_at_center,_rgba(var(--second-color),_0.8)_0,_rgba(var(--second-color),_0)_50%)_no-repeat]",
            "[mix-blend-mode:var(--blending-value)]",
          )}
        />
        <div
          className={cn(
            "absolute animate-third opacity-100",
            "top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] h-[var(--size)] w-[var(--size)] [transform-origin:calc(50%+400px)]",
            "[background:radial-gradient(circle_at_center,_rgba(var(--third-color),_0.8)_0,_rgba(var(--third-color),_0)_50%)_no-repeat]",
            "[mix-blend-mode:var(--blending-value)]",
          )}
        />

        {interactive ? (
          <div
            ref={interactiveRef}
            className={cn(
              "absolute -top-1/2 -left-1/2 h-full w-full opacity-70",
              "[background:radial-gradient(circle_at_center,_rgba(var(--pointer-color),_0.8)_0,_rgba(var(--pointer-color),_0)_50%)_no-repeat]",
              "[mix-blend-mode:var(--blending-value)]",
            )}
          />
        ) : null}
      </div>

      {showBottomMask ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5]">
          <div className="h-32 bg-gradient-to-t from-zinc-950 from-15% via-zinc-950/70 to-transparent" />
          <div className="h-px bg-zinc-950" />
        </div>
      ) : null}
    </div>
  );
}
