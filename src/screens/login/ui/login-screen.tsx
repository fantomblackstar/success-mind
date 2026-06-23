import { redirect } from "next/navigation";
import { FunnelShell } from "@/widgets/funnel-shell";
import { UserLoginForm } from "@/features/user-login";
import { LinkButton } from "@/shared/ui";
import { getUserSession } from "@/shared/lib/session";
import { routes } from "@/shared/lib/routes";

export async function LoginScreen() {
  const user = await getUserSession();
  if (user) redirect(routes.earlyAccess);

  return (
    <FunnelShell title="Welcome back" subtitle="Sign in with email">
      <UserLoginForm />
      <LinkButton href={routes.quiz(1)} variant="link" className="mt-4 w-full text-purple-300">
        New here? Join waitlist
      </LinkButton>
    </FunnelShell>
  );
}
