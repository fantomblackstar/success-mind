export const PRICING_TIERS = [
  {
    id: "starter",
    name: "Starter",
    price: 10,
    recommended: false,
    features: ["AI chat", "Daily tips", "Goal tracking"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 1,
    promoLabel: "Now — $1",
    recommended: true,
    features: ["All Starter features", "Founder playbooks", "Priority answers", "Team sharing"],
  },
] as const;
