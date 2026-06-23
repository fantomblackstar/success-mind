import Link from "next/link";
import { routes } from "@/shared/lib/routes";

export function SuccessMindLogo() {
  return (
    <Link href={routes.home} className="flex items-center gap-2 text-lg font-semibold text-foreground">
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-purple-500 to-violet-400 text-base text-white">
        S
      </span>
      Success Mind
    </Link>
  );
}
