"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/shared/lib/routes";
import { loadDashboardData } from "../lib/load-dashboard-data";
import type {
  Attribution,
  Conversion,
  Overview,
  SourceAnalytics,
} from "../lib/dashboard-types";
import { DashboardAttributionPanel } from "./dashboard-attribution-panel";
import { DashboardConversionChart } from "./dashboard-conversion-chart";
import { DashboardFunnelFlow } from "./dashboard-funnel-flow";
import { DashboardHeader } from "./dashboard-header";
import { DashboardMetricCards } from "./dashboard-metric-cards";
import { DashboardSkeleton } from "./dashboard-skeleton";
import { DashboardSourceChart } from "./dashboard-source-chart";

export function DashboardScreen() {
  const router = useRouter();
  const [overview, setOverview] = useState<Overview | null>(null);
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [sources, setSources] = useState<SourceAnalytics[]>([]);
  const [attribution, setAttribution] = useState<Attribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = useCallback(
    async ({ refresh = false }: { refresh?: boolean } = {}) => {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      try {
        const data = await loadDashboardData();
        setOverview(data.overview);
        setConversions(data.conversions);
        setSources(data.sources);
        setAttribution(data.attribution);
      } catch (error) {
        console.error(error);
        router.replace(routes.dashboardLogin);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [router],
  );

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const handleRefresh = useCallback(() => {
    void fetchData({ refresh: true });
  }, [fetchData]);

  if (isLoading && !overview) {
    return (
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-10">
        <DashboardHeader onRefresh={handleRefresh} isRefreshing />
        <DashboardSkeleton />
      </div>
    );
  }

  if (!overview) {
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10">
      <DashboardHeader onRefresh={handleRefresh} isRefreshing={isRefreshing} />
      <DashboardMetricCards overview={overview} />
      <DashboardFunnelFlow overview={overview} />
      <div className="grid gap-6 xl:grid-cols-2">
        <DashboardConversionChart conversions={conversions} />
        <DashboardSourceChart sources={sources} />
      </div>
      <DashboardAttributionPanel attribution={attribution} />
    </div>
  );
}
