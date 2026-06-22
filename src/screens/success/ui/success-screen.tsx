"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FunnelShell } from "@/widgets/funnel-shell/ui/funnel-shell";

export function SuccessScreen() {
  return (
    <FunnelShell title="Thank you!" subtitle="Your plan is ready. We are happy to help you grow.">
      <Button asChild className="w-full bg-purple-600 hover:bg-purple-500">
        <Link href="/">Back to home</Link>
      </Button>
    </FunnelShell>
  );
}
