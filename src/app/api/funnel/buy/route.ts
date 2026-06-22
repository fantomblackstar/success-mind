import { NextRequest } from "next/server";
import { buyClickSchema } from "@/shared/lib/schemas";
import { apiError, apiSuccess } from "@/shared/lib/api-response";
import {
  getFunnelSessionId,
  getUserSession,
  getUtmFromCookies,
} from "@/shared/lib/session";
import { funnelService } from "@server/modules/funnel/funnel-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tier } = buyClickSchema.parse(body);
    const session = await getUserSession();
    const sessionId = (await getFunnelSessionId()) ?? crypto.randomUUID();
    const utm = await getUtmFromCookies();

    await funnelService.trackEvent({
      sessionId,
      step: "buy_click",
      utm,
      userId: session?.userId,
      metadata: { tier },
      isReturningUser: false,
    });

    return apiSuccess({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
