import { connectDB } from "../../database/connection";
import { FunnelEventModel } from "../../database/models/funnel-event-model";
import type { FunnelStep, UtmPayload } from "../../common/types";

export const funnelService = {
  async trackEvent(input: {
    sessionId: string;
    step: FunnelStep;
    utm: UtmPayload;
    userId?: string;
    metadata?: Record<string, unknown>;
    isReturningUser?: boolean;
  }) {
    await connectDB();

    return FunnelEventModel.create({
      sessionId: input.sessionId,
      userId: input.userId || undefined,
      step: input.step,
      source: input.utm.source,
      utmSource: input.utm.utmSource,
      utmMedium: input.utm.utmMedium,
      utmCampaign: input.utm.utmCampaign,
      metadata: input.metadata ?? {},
      isReturningUser: input.isReturningUser ?? false,
    });
  },
};
