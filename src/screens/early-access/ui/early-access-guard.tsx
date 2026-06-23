"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/shared/lib/routes";
import { EarlyAccessScreen } from "./early-access-screen";

export function EarlyAccessGuard({
  name,
  email,
}: {
  name?: string;
  email?: string;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!name || !email) {
      router.replace(routes.login);
    }
  }, [name, email, router]);

  if (!name || !email) return null;
  return <EarlyAccessScreen name={name} email={email} />;
}
