export const routes = {
  home: "/",
  login: "/login",
  email: "/email",
  earlyAccess: "/early-access",
  paywall: "/paywall",
  success: "/success",
  quiz: (step: number = 1) => `/quiz?step=${step}`,
  dashboard: "/dashboard",
  dashboardLogin: "/dashboard/login",
  api: {
    funnelSession: "/api/funnel/session",
    funnelEvents: "/api/funnel/events",
    funnelEmail: "/api/funnel/email",
    funnelLogin: "/api/funnel/login",
    funnelLogout: "/api/funnel/logout",
    funnelBuy: "/api/funnel/buy",
    dashboardLogin: "/api/dashboard/login",
    dashboardLogout: "/api/dashboard/logout",
    analyticsOverview: "/api/analytics/overview",
    analyticsConversions: "/api/analytics/conversions",
    analyticsBySource: "/api/analytics/by-source",
    analyticsAttribution: "/api/analytics/attribution",
  },
} as const;

export type AppRoute = (typeof routes)[keyof Omit<typeof routes, "quiz" | "api">];
