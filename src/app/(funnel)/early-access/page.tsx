import { redirect } from "next/navigation";
import { EarlyAccessGuard } from "@/screens/early-access";
import { getUserSession } from "@/shared/lib/session";
import { routes } from "@/shared/lib/routes";

export default async function EarlyAccessPage() {
  const user = await getUserSession();
  if (!user) redirect(routes.login);

  return <EarlyAccessGuard name={user.name} email={user.email} />;
}
