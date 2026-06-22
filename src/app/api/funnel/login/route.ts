import { NextRequest } from "next/server";
import { loginFormSchema } from "@/shared/lib/schemas";
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
    const { email } = loginFormSchema.parse(body);

    const user = await usersService.findByEmail(email);
    if (!user) {
      return apiSuccess({ found: false });
    }

    const utm = await getUtmFromCookies();
    await usersService.updateLastTouch(user._id.toString(), utm);

    await setUserSession({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
    });

    const sessionId = (await getFunnelSessionId()) ?? crypto.randomUUID();
    await funnelService.trackEvent({
      sessionId,
      step: "user_login",
      utm,
      userId: user._id.toString(),
      isReturningUser: true,
    });

    return apiSuccess({
      found: true,
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
