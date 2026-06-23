"use client";

import { LinkButton } from "@/shared/ui";
import { FunnelShell } from "@/widgets/funnel-shell";
import { routes } from "@/shared/lib/routes";

export function SuccessScreen() {
  return (
    <FunnelShell title="Thank you!" subtitle="Your plan is ready. We are happy to help you grow.">
      <LinkButton href={routes.home} className="w-full bg-purple-600 hover:bg-purple-500">
        Back to home
      </LinkButton>
    </FunnelShell>
  );
}
