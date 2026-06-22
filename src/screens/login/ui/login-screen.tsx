import { redirect } from "next/navigation";
import Link from "next/link";
import { FunnelShell } from "@/widgets/funnel-shell/ui/funnel-shell";
import { UserLoginForm } from "@/features/user-login/ui/user-login-form";
import { getUserSession } from "@/shared/lib/session";
import { Button } from "@/components/ui/button";

export async function LoginScreen() {
  const user = await getUserSession();
  if (user) redirect("/early-access");

  return (
    <FunnelShell title="Welcome back" subtitle="Enter your email to continue">
      <UserLoginForm />
      <Button asChild variant="link" className="mt-4 w-full text-purple-300">
        <Link href="/quiz?step=1">New here? Get Early Access</Link>
      </Button>
    </FunnelShell>
  );
}
