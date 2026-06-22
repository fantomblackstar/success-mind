import { NextRequest } from "next/server";
import { funnelService } from "@server/modules/funnel/funnel-service";
import {
  createSessionId,
  getFunnelSessionId,
  getUtmFromCookies,
  setFunnelSessionId,
  setUtmCookie,
} from "@/shared/lib/session";
import { apiError, apiSuccess } from "@/shared/lib/api-response";
import { parseUtmFromSearchParams } from "@/shared/lib/utm";
import type { FunnelStep } from "@server/common/types";

export async function POST(request: NextRequest) {
  try {
    let sessionId = await getFunnelSessionId();
    if (!sessionId) {
      sessionId = createSessionId();
      await setFunnelSessionId(sessionId);
    }

    const referrer = request.headers.get("referer");
    const url = new URL(request.url);
    const utm = parseUtmFromSearchParams(url.searchParams, referrer);
    await setUtmCookie(utm);

    await funnelService.trackEvent({
      sessionId,
      step: "landing_view",
      utm,
    });

    return apiSuccess({ sessionId, utm });
  } catch (error) {
    return apiError(error);
  }
}

export async function trackFunnelStep(
  step: FunnelStep,
  metadata?: Record<string, unknown>,
  isReturningUser?: boolean,
  userId?: string,
) {
  const sessionId = (await getFunnelSessionId()) ?? createSessionId();
  const utm = await getUtmFromCookies();

  await funnelService.trackEvent({
    sessionId,
    step,
    utm,
    metadata,
    isReturningUser,
    userId,
  });
}
