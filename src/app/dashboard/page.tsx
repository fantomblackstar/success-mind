import { redirect } from "next/navigation";
import { DashboardScreen } from "@/screens/dashboard";
import { isDashboardAuthenticated } from "@/shared/lib/session";
import { routes } from "@/shared/lib/routes";

export default async function DashboardPage() {
  const isAdmin = await isDashboardAuthenticated();
  if (!isAdmin) {
    redirect(routes.dashboardLogin);
  }

  return <DashboardScreen />;
}
