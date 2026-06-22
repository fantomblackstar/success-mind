import { redirect } from "next/navigation";
import { EarlyAccessGuard } from "@/screens/early-access/ui/early-access-screen";
import { getUserSession } from "@/shared/lib/session";

export default async function EarlyAccessPage() {
  const user = await getUserSession();
  if (!user) redirect("/login");

  return <EarlyAccessGuard name={user.name} email={user.email} />;
}
