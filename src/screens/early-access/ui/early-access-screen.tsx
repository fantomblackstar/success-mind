"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LinkButton } from "@/shared/ui";
import { FunnelShell } from "@/widgets/funnel-shell";
import { EARLY_ACCESS_MESSAGE } from "@/shared/config/early-access";
import { trackEvent } from "@/shared/api/client";
import { routes } from "@/shared/lib/routes";

export function EarlyAccessScreen({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  useEffect(() => {
    trackEvent("early_access_view");
  }, []);

  return (
    <FunnelShell title={EARLY_ACCESS_MESSAGE.title}>
      <div className="space-y-4 text-center text-zinc-300">
        <p>
          Hi <span className="text-white">{name}</span>, {EARLY_ACCESS_MESSAGE.body}{" "}
          <span className="font-semibold text-purple-300">{EARLY_ACCESS_MESSAGE.date}</span>.
        </p>
        <p className="text-sm text-zinc-400">
          {EARLY_ACCESS_MESSAGE.footer} <span className="text-zinc-200">{email}</span>
        </p>
        <LinkButton href={routes.home} className="w-full bg-purple-600 hover:bg-purple-500">
          Back to home
        </LinkButton>
      </div>
    </FunnelShell>
  );
}

export function EarlyAccessGuard({
  name,
  email,
}: {
  name?: string;
  email?: string;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!name || !email) {
      router.replace(routes.login);
    }
  }, [name, email, router]);

  if (!name || !email) return null;
  return <EarlyAccessScreen name={name} email={email} />;
}
