import { apiError, apiSuccess } from "@/shared/lib/api-response";
import { isDashboardAuthenticated } from "@/shared/lib/session";
import { analyticsService } from "@server/modules/analytics/analytics-service";

async function guard() {
  const ok = await isDashboardAuthenticated();
  if (!ok) {
    return apiSuccess({ error: "Unauthorized" }, 401);
  }
  return null;
}

export async function GET() {
  try {
    const denied = await guard();
    if (denied) return denied;
    return apiSuccess(await analyticsService.getOverview());
  } catch (error) {
    return apiError(error);
  }
}
