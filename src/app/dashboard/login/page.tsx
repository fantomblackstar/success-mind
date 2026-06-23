import { redirect } from "next/navigation";
import { DashboardLoginScreen } from "@/screens/dashboard-login";
import { isDashboardAuthenticated } from "@/shared/lib/session";
import { routes } from "@/shared/lib/routes";

export default async function DashboardLoginPage() {
  const isAdmin = await isDashboardAuthenticated();
  if (isAdmin) {
    redirect(routes.dashboard);
  }

  return <DashboardLoginScreen />;
}
