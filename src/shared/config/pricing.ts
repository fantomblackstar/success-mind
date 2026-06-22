export const PRICING_TIERS = [
  {
    id: "starter",
    name: "Starter",
    price: 49,
    recommended: false,
    features: ["AI chat", "Daily tips", "Goal tracking"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 99,
    recommended: true,
    features: [
      "Everything in Starter",
      "Founder playbooks",
      "Priority answers",
      "Team sharing",
    ],
  },
] as const;
