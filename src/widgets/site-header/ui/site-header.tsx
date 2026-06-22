import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/shared/ui/link-button";
import type { UserSessionPayload } from "@/shared/lib/session";

function SuccessMindLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-violet-400 text-sm text-white">
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
              <span className="hidden text-sm text-zinc-400 sm:inline">Hi, {user.name}</span>
              <form action="/api/funnel/logout" method="GET">
                <Button variant="ghost" size="sm" type="submit">
                  Logout
                </Button>
              </form>
            </>
          ) : (
            <LinkButton href="/login" variant="ghost" size="sm">
              Login
            </LinkButton>
          )}
          <LinkButton
            href="/quiz?step=1"
            size="sm"
            className="bg-purple-600 hover:bg-purple-500"
          >
            Get Early Access
          </LinkButton>
        </div>
      </div>
    </header>
  );
}
