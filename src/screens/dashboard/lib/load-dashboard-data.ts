import { apiFetch } from "@/shared/api/client";
import { routes } from "@/shared/lib/routes";
import type {
  Attribution,
  Conversion,
  Overview,
  SourceAnalytics,
} from "./dashboard-types";
import { mergeSourceAnalytics, normalizeAttributionSources } from "./dashboard-utils";

type SourceApiRow = {
  _id: string;
  steps: { step: string; count: number }[];
  total: number;
};

export type DashboardData = {
  overview: Overview;
  conversions: Conversion[];
  sources: SourceAnalytics[];
  attribution: Attribution[];
};

export async function loadDashboardData(): Promise<DashboardData> {
  const [overview, conversions, sourceRows, attribution] = await Promise.all([
    apiFetch<Overview>(routes.api.analyticsOverview),
    apiFetch<Conversion[]>(routes.api.analyticsConversions),
    apiFetch<SourceApiRow[]>(routes.api.analyticsBySource),
    apiFetch<Attribution[]>(routes.api.analyticsAttribution),
  ]);

  return {
    overview,
    conversions,
    sources: mergeSourceAnalytics(
      sourceRows.map((row) => ({
        source: row._id || "unknown",
        steps: row.steps,
        total: row.total,
      })),
    ),
    attribution: normalizeAttributionSources(attribution),
  };
}
