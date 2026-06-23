import { LogOut, RefreshCw } from "lucide-react";
import { cn } from "@/shared/lib";
import { routes } from "@/shared/lib/routes";
import { Button, SectionTitle } from "@/shared/ui";

export function DashboardHeader({
  onRefresh,
  isRefreshing = false,
}: {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <SectionTitle as="h1" className="text-left text-3xl md:text-4xl">
          Funnel analytics
        </SectionTitle>
        <p className="mt-2 text-zinc-400">
          Conversions, traffic sources, and attribution in one view
        </p>
      </div>
      <div className="flex items-center gap-2">
        {onRefresh ? (
          <Button
            variant="outline"
            size="icon"
            type="button"
            aria-label="Refresh analytics"
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("size-5", isRefreshing && "animate-spin")} />
          </Button>
        ) : null}
        <form action={routes.api.dashboardLogout} method="GET">
          <Button variant="outline" size="icon" type="submit" aria-label="Admin logout">
            <LogOut className="size-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
