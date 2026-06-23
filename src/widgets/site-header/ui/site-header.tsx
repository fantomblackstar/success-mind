import Link from "next/link";
import { LogOut } from "lucide-react";
import { Button, LinkButton } from "@/shared/ui";
import type { UserSessionPayload } from "@/shared/lib/session";
import { routes } from "@/shared/lib/routes";

function SuccessMindLogo() {
  return (
    <Link href={routes.home} className="flex items-center gap-2 text-lg font-semibold text-foreground">
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-purple-500 to-violet-400 text-base text-white">
        S
      </span>
      Success Mind
    </Link>
  );
}

export function SiteHeader({ user }: { user: UserSessionPayload | null }) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <SuccessMindLogo />
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden text-base text-zinc-400 sm:inline">Hi, {user.name}</span>
              <LinkButton href={routes.earlyAccess} variant="outline" size="default">
                Early Access
              </LinkButton>
              <form action={routes.api.funnelLogout} method="GET">
                <Button variant="ghost" size="icon" type="submit" aria-label="Logout">
                  <LogOut className="size-5" />
                </Button>
              </form>
            </>
          ) : (
            <LinkButton href={routes.login} variant="ghost">
              Login
            </LinkButton>
          )}
          {!user ? (
            <LinkButton
              href={routes.quiz(1)}
              className="bg-purple-600 hover:bg-purple-500"
            >
              Get early access
            </LinkButton>
          ) : null}
        </div>
      </div>
    </header>
  );
}
