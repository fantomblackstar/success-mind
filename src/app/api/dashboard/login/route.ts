import { NextRequest } from "next/server";
import { dashboardLoginSchema } from "@/shared/lib/schemas";
import { apiError, apiSuccess } from "@/shared/lib/api-response";
import { setDashboardAuth } from "@/shared/lib/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = dashboardLoginSchema.parse(body);

    const expectedUser = process.env.DASHBOARD_USER;
    const expectedPassword = process.env.DASHBOARD_PASSWORD;

    if (!expectedUser || !expectedPassword) {
      return apiSuccess({ error: "Dashboard auth is not configured" }, 500);
    }

    if (username !== expectedUser || password !== expectedPassword) {
      return apiSuccess({ error: "Invalid credentials" }, 401);
    }

    await setDashboardAuth();
    return apiSuccess({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
