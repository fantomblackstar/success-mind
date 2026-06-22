import { SiteHeader } from "@/widgets/site-header/ui/site-header";
import { getUserSession } from "@/shared/lib/session";

export default async function FunnelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserSession();

  return (
    <div className="min-h-screen bg-zinc-950">
      <SiteHeader user={user} />
      <main>{children}</main>
    </div>
  );
}
