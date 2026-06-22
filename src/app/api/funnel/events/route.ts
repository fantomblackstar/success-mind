import { NextRequest } from "next/server";
import { trackEventSchema } from "@/shared/lib/schemas";
import { apiError, apiSuccess } from "@/shared/lib/api-response";
import { getFunnelSessionId, getUtmFromCookies } from "@/shared/lib/session";
import { funnelService } from "@server/modules/funnel/funnel-service";
import type { FunnelStep } from "@server/common/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = trackEventSchema.parse(body);
    const sessionId = (await getFunnelSessionId()) ?? crypto.randomUUID();
    const utm = await getUtmFromCookies();

    await funnelService.trackEvent({
      sessionId,
      step: parsed.step as FunnelStep,
      utm,
      metadata: parsed.metadata,
    });

    return apiSuccess({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
