import { FunnelShell } from "@/widgets/funnel-shell";
import { DashboardLoginForm } from "@/features/dashboard-auth";

export function DashboardLoginScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md">
        <FunnelShell title="Dashboard login" subtitle="Analytics access">
          <DashboardLoginForm />
        </FunnelShell>
      </div>
    </div>
  );
}
