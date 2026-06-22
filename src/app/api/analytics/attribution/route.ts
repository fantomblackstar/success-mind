import { apiError, apiSuccess } from "@/shared/lib/api-response";
import { isDashboardAuthenticated } from "@/shared/lib/session";
import { analyticsService } from "@server/modules/analytics/analytics-service";

export async function GET() {
  try {
    const ok = await isDashboardAuthenticated();
    if (!ok) return apiSuccess({ error: "Unauthorized" }, 401);
    return apiSuccess(await analyticsService.getAttribution());
  } catch (error) {
    return apiError(error);
  }
}
