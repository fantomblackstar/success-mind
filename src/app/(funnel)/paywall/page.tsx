import { redirect } from "next/navigation";
import { PaywallScreen } from "@/screens/paywall";
import { getUserSession } from "@/shared/lib/session";
import { routes } from "@/shared/lib/routes";

export default async function PaywallPage() {
  const user = await getUserSession();
  if (!user) redirect(routes.email);

  return <PaywallScreen />;
}
