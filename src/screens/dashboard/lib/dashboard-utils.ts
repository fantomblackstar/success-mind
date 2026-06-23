import type { Attribution, Overview, SourceAnalytics } from "./dashboard-types";
import { FUNNEL_FLOW_STEPS } from "./dashboard-types";
import { normalizeStoredSource } from "@/shared/lib/utm";

export function getStepCount(
  steps: Overview["steps"] | undefined,
  stepKey: string,
) {
  return steps?.find((item) => item.step === stepKey)?.count ?? 0;
}

const BASE_COLUMN_HEIGHT = 176;
const MIN_COLUMN_HEIGHT = 120;
/** How much of the real step drop is reflected in column height (rest is shown on connectors). */
const COLUMN_DROP_DAMPING = 0.3;

export function buildFunnelFlowData(steps: Overview["steps"] | undefined) {
  const flowSteps = FUNNEL_FLOW_STEPS.map((step) => ({
    ...step,
    count: getStepCount(steps, step.key),
  }));

  const firstCount = Math.max(flowSteps[0]?.count ?? 1, 1);
  let previousHeight = BASE_COLUMN_HEIGHT;

  return flowSteps.map((step, index) => {
    const prevCount = index > 0 ? flowSteps[index - 1]!.count : step.count;
    const nextStep = flowSteps[index + 1];

    let heightPx = BASE_COLUMN_HEIGHT;

    if (index > 0) {
      const prevStepCount = flowSteps[index - 1]!.count;
      const actualRatio = prevStepCount > 0 ? step.count / prevStepCount : 1;

      if (actualRatio >= 1) {
        heightPx = previousHeight;
      } else {
        const visualRatio = 1 - (1 - actualRatio) * COLUMN_DROP_DAMPING;
        heightPx = Math.max(
          MIN_COLUMN_HEIGHT,
          Math.round(previousHeight * visualRatio),
        );
      }
    }

    previousHeight = heightPx;

    const dropOff =
      index > 0 && prevCount > 0
        ? Math.round(((prevCount - step.count) / prevCount) * 100)
        : 0;
    const retention =
      firstCount > 0 ? Math.round((step.count / firstCount) * 100) : 0;
    const dropOffToNext =
      nextStep && step.count > 0
        ? Math.round(((step.count - nextStep.count) / step.count) * 100)
        : 0;
    const conversionToNext =
      nextStep && step.count > 0
        ? Math.round((nextStep.count / step.count) * 100)
        : 0;

    return {
      ...step,
      dropOff,
      dropOffToNext,
      conversionToNext,
      retention,
      heightPx,
    };
  });
}

/** Exact taper height for the connector right edge (real drop between two steps). */
export function getConnectorToHeight(fromHeight: number, fromCount: number, toCount: number) {
  if (fromCount <= 0) return 0;
  return Math.round(fromHeight * (toCount / fromCount));
}

export type FunnelFlowStep = ReturnType<typeof buildFunnelFlowData>[number];

export type FunnelConnectorSegment = {
  fromHeight: number;
  toHeight: number;
};

/** Chain connector heights: each segment's left equals the previous segment's right. */
export function buildConnectorChain(flow: FunnelFlowStep[]): FunnelConnectorSegment[] {
  if (flow.length < 2) return [];

  const connectors: FunnelConnectorSegment[] = [];
  let flowHeight = flow[0]!.heightPx;

  for (let index = 0; index < flow.length - 1; index += 1) {
    const step = flow[index]!;
    const next = flow[index + 1]!;
    const fromHeight = flowHeight;
    const toHeight = getConnectorToHeight(fromHeight, step.count, next.count);

    connectors.push({ fromHeight, toHeight });
    flowHeight = toHeight;
  }

  return connectors;
}

export function countAttributionBySource(
  attribution: { firstTouchSource: string; lastTouchSource: string }[],
  field: "firstTouchSource" | "lastTouchSource",
) {
  return attribution.reduce<Record<string, number>>((acc, user) => {
    const source = normalizeStoredSource(user[field] || "unknown");
    acc[source] = (acc[source] ?? 0) + 1;
    return acc;
  }, {});
}

export function mergeSourceAnalytics(rows: SourceAnalytics[]): SourceAnalytics[] {
  const merged = new Map<string, SourceAnalytics>();

  for (const row of rows) {
    const source = normalizeStoredSource(row.source);
    const existing = merged.get(source);

    if (!existing) {
      merged.set(source, {
        source,
        steps: row.steps.map((step) => ({ ...step })),
        total: row.total,
      });
      continue;
    }

    existing.total += row.total;

    for (const step of row.steps) {
      const target = existing.steps.find((item) => item.step === step.step);
      if (target) {
        target.count += step.count;
      } else {
        existing.steps.push({ ...step });
      }
    }
  }

  return Array.from(merged.values()).sort((a, b) => b.total - a.total);
}

export function normalizeAttributionSources(attribution: Attribution[]): Attribution[] {
  return attribution.map((user) => ({
    ...user,
    firstTouchSource: normalizeStoredSource(user.firstTouchSource),
    lastTouchSource: normalizeStoredSource(user.lastTouchSource),
  }));
}
