import Link from "next/link";
import { type VariantProps } from "class-variance-authority";
import { buttonVariants } from "./button";
import { cn } from "@/shared/lib";

export function LinkButton({
  href,
  className,
  variant,
  size,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
} & VariantProps<typeof buttonVariants>) {
  return (
    <Link
      href={href}
      className={cn(buttonVariants({ variant, size }), className)}
    >
      {children}
    </Link>
  );
}
