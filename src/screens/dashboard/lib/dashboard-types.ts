export type Overview = {
  entered: number;
  quizComplete: number;
  emailCapture: number;
  paywallView: number;
  buyClick: number;
  earlyAccess: number;
  totalUsers: number;
  steps: { step: string; count: number }[];
};

export type Conversion = {
  label: string;
  from: string;
  to: string;
  fromCount: number;
  toCount: number;
  rate: number;
};

export type SourceAnalytics = {
  source: string;
  steps: { step: string; count: number }[];
  total: number;
};

export type Attribution = {
  email: string;
  name: string;
  firstTouchSource: string;
  firstTouchAt: string;
  lastTouchSource: string;
  lastTouchAt: string;
};

export const FUNNEL_FLOW_STEPS = [
  { key: "landing_view", label: "Landing", shortLabel: "Landing" },
  { key: "quiz_step_1", label: "Quiz step 1", shortLabel: "Step 1" },
  { key: "quiz_step_2", label: "Quiz step 2", shortLabel: "Step 2" },
  { key: "email_capture", label: "Submit email", shortLabel: "Email" },
  { key: "buy_click", label: "Buy", shortLabel: "Buy" },
] as const;

export const SOURCE_COLORS: Record<string, string> = {
  google: "#a855f7",
  facebook: "#6366f1",
  direct: "#22d3ee",
  twitter: "#38bdf8",
  linkedin: "#818cf8",
  unknown: "#71717a",
};

export function sourceColor(source: string) {
  return SOURCE_COLORS[source.toLowerCase()] ?? SOURCE_COLORS.unknown;
}
