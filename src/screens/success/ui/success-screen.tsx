"use client";

import { LinkButton } from "@/shared/ui/link-button";
import { FunnelShell } from "@/widgets/funnel-shell/ui/funnel-shell";

export function SuccessScreen() {
  return (
    <FunnelShell title="Thank you!" subtitle="Your plan is ready. We are happy to help you grow.">
      <LinkButton href="/" className="w-full bg-purple-600 hover:bg-purple-500">
        Back to home
      </LinkButton>
    </FunnelShell>
  );
}
