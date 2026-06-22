import { FunnelShell } from "@/widgets/funnel-shell/ui/funnel-shell";
import { DashboardLoginForm } from "@/features/dashboard-auth/ui/dashboard-login-form";

export function DashboardLoginScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md">
        <FunnelShell title="Dashboard login" subtitle="Sign in to view analytics">
          <DashboardLoginForm />
        </FunnelShell>
      </div>
    </div>
  );
}
