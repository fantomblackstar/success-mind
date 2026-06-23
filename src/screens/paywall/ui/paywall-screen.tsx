"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/shared/ui";
import { Button } from "@/shared/ui";
import { LinkButton } from "@/shared/ui";
import { PRICING_TIERS } from "@/shared/config/pricing";
import { FunnelShell } from "@/widgets/funnel-shell";
import { apiFetch, trackEvent } from "@/shared/api/client";
import { cn } from "@/shared/lib";
import { routes } from "@/shared/lib/routes";

export function PaywallScreen() {
  const router = useRouter();

  useEffect(() => {
    trackEvent("paywall_view");
  }, []);

  async function handleBuy(tier: "starter" | "pro") {
    await apiFetch(routes.api.funnelBuy, {
      method: "POST",
      body: JSON.stringify({ tier }),
    });
    sessionStorage.setItem("success_mind_buy", "1");
    router.push(routes.success);
  }

  return (
    <FunnelShell
      title="Choose your plan"
      subtitle="Pick the plan that fits your goals"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {PRICING_TIERS.map((tier) => (
          <div
            key={tier.id}
            className={cn(
              "rounded-xl border p-4",
              tier.recommended
                ? "border-purple-500 bg-purple-500/10"
                : "border-white/10 bg-zinc-950/40",
            )}
          >
            {tier.recommended ? (
              <Badge className="mb-3 bg-purple-600">Recommended</Badge>
            ) : null}
            <h3 className="text-lg font-semibold text-white">{tier.name}</h3>
            <p className="mt-1 text-2xl font-bold text-purple-300">
              ${tier.price}/mo
            </p>
            <ul className="mt-4 space-y-2 text-sm text-zinc-400">
              {tier.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
            <Button
              className="mt-6 w-full bg-purple-600 hover:bg-purple-500"
              onClick={() => handleBuy(tier.id)}
            >
              Buy
            </Button>
          </div>
        ))}
      </div>
      <LinkButton href={routes.home} variant="link" className="mt-4 w-full text-zinc-400">
        Back to home
      </LinkButton>
    </FunnelShell>
  );
}
