"use client";

import { useEffect } from "react";
import { routes } from "@/shared/lib/routes";

export function LandingSessionInit() {
  useEffect(() => {
    fetch(routes.api.funnelSession, { method: "POST" }).catch(console.error);
    fetch(routes.api.funnelEvents, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ step: "landing_view" }),
    }).catch(console.error);
  }, []);

  return null;
}
