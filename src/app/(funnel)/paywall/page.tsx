import { redirect } from "next/navigation";
import { PaywallScreen } from "@/screens/paywall/ui/paywall-screen";
import { getUserSession } from "@/shared/lib/session";

export default async function PaywallPage() {
  const user = await getUserSession();
  if (!user) redirect("/email");

  return <PaywallScreen />;
}
