"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/shared/ui";
import { Button } from "@/shared/ui";
import { LinkButton } from "@/shared/ui";
import { PRICING_TIERS } from "@/shared/config/pricing";
import { FunnelShell } from "@/widgets/funnel-shell";
import { apiFetch, trackEvent } from "@/shared/api/client";
import { cn, cardHoverBorder } from "@/shared/lib";
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
    router.push(routes.earlyAccess);
  }

  return (
    <FunnelShell
      wide
      title="Pick a plan"
    >
      <div className="grid gap-6 md:grid-cols-2">
        {PRICING_TIERS.map((tier) => (
          <div
            key={tier.id}
            className={cn(
              "flex flex-col rounded-lg border p-8 transition-colors duration-200",
              tier.recommended
                ? "border-purple-500 bg-purple-500/10 hover:border-primary"
                : cn(cardHoverBorder, "bg-zinc-950/40"),
            )}
          >
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {tier.recommended ? (
                <Badge className="bg-purple-600 text-sm">Recommended</Badge>
              ) : null}
              {"promoLabel" in tier && tier.promoLabel ? (
                <Badge variant="secondary" className="border border-purple-400/40 bg-purple-500/20 text-sm text-purple-100">
                  {tier.promoLabel}
                </Badge>
              ) : null}
            </div>
            <h3 className="text-2xl font-semibold text-white">{tier.name}</h3>
            <p className="mt-2 text-4xl font-bold text-purple-300">
              ${tier.price}
              <span className="text-lg font-medium text-zinc-400">/mo</span>
            </p>
            <ul className="mt-6 flex-1 space-y-3 text-base text-zinc-300">
              {tier.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
            <Button
              size="lg"
              className="mt-8 w-full bg-purple-600 hover:bg-purple-500"
              onClick={() => handleBuy(tier.id)}
            >
              Buy
            </Button>
          </div>
        ))}
      </div>
      <LinkButton href={routes.home} variant="link" className="mt-6 w-full text-zinc-400">
        Back to home
      </LinkButton>
    </FunnelShell>
  );
}
