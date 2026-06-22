import { redirect } from "next/navigation";
import { FunnelShell } from "@/widgets/funnel-shell/ui/funnel-shell";
import { UserLoginForm } from "@/features/user-login/ui/user-login-form";
import { LinkButton } from "@/shared/ui/link-button";
import { getUserSession } from "@/shared/lib/session";

export async function LoginScreen() {
  const user = await getUserSession();
  if (user) redirect("/early-access");

  return (
    <FunnelShell title="Welcome back" subtitle="Enter your email to continue">
      <UserLoginForm />
      <LinkButton href="/quiz?step=1" variant="link" className="mt-4 w-full text-purple-300">
        New here? Get Early Access
      </LinkButton>
    </FunnelShell>
  );
}
