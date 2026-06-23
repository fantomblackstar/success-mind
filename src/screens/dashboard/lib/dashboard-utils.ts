import type { Overview } from "./dashboard-types";
import { FUNNEL_FLOW_STEPS } from "./dashboard-types";

export function getStepCount(
  steps: Overview["steps"] | undefined,
  stepKey: string,
) {
  return steps?.find((item) => item.step === stepKey)?.count ?? 0;
}

export function buildFunnelFlowData(steps: Overview["steps"] | undefined) {
  const flowSteps = FUNNEL_FLOW_STEPS.map((step) => ({
    ...step,
    count: getStepCount(steps, step.key),
  }));

  const maxCount = Math.max(flowSteps[0]?.count ?? 1, 1);

  return flowSteps.map((step, index) => {
    const prevCount = index > 0 ? flowSteps[index - 1]!.count : step.count;
    const dropOff =
      index > 0 && prevCount > 0
        ? Math.round(((prevCount - step.count) / prevCount) * 100)
        : 0;
    const retention = maxCount > 0 ? Math.round((step.count / maxCount) * 100) : 0;
    const scale = Math.max(step.count / maxCount, 0.28);

    return {
      ...step,
      dropOff,
      retention,
      scale,
    };
  });
}

export function countAttributionBySource(
  attribution: { firstTouchSource: string; lastTouchSource: string }[],
  field: "firstTouchSource" | "lastTouchSource",
) {
  return attribution.reduce<Record<string, number>>((acc, user) => {
    const source = user[field] || "unknown";
    acc[source] = (acc[source] ?? 0) + 1;
    return acc;
  }, {});
}
