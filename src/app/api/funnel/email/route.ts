import { NextRequest } from "next/server";
import { submitEmailApiSchema } from "@/shared/lib/schemas";
import { apiError, apiSuccess } from "@/shared/lib/api-response";
import {
  getFunnelSessionId,
  getUtmFromCookies,
  setUserSession,
} from "@/shared/lib/session";
import { usersService } from "@server/modules/users/users-service";
import { funnelService } from "@server/modules/funnel/funnel-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = submitEmailApiSchema.parse(body);
    const utm = await getUtmFromCookies();
    const sessionId = (await getFunnelSessionId()) ?? crypto.randomUUID();

    const existing = await usersService.findByEmail(parsed.email);

    if (existing) {
      await usersService.updateLastTouch(existing._id.toString(), utm);

      await setUserSession({
        userId: existing._id.toString(),
        email: existing.email,
        name: existing.name,
      });

      await funnelService.trackEvent({
        sessionId,
        step: "email_capture",
        utm,
        userId: existing._id.toString(),
        isReturningUser: true,
      });

      return apiSuccess({
        isReturning: true,
        user: {
          id: existing._id.toString(),
          email: existing.email,
          name: existing.name,
        },
      });
    }

    const user = await usersService.createUser({
      email: parsed.email,
      name: parsed.name,
      utm,
      quizAnswers: parsed.quizAnswers,
    });

    await setUserSession({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
    });

    await funnelService.trackEvent({
      sessionId,
      step: "email_capture",
      utm,
      userId: user._id.toString(),
      isReturningUser: false,
    });

    return apiSuccess({
      isReturning: false,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    return apiError(error);
  }
}
