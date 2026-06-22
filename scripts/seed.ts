import { connectDB } from "../server/database/connection";
import { UserModel } from "../server/database/models/user-model";
import { FunnelEventModel } from "../server/database/models/funnel-event-model";

async function seed() {
  await connectDB();

  await UserModel.deleteMany({});
  await FunnelEventModel.deleteMany({});

  const users = await UserModel.insertMany([
    {
      email: "sarah@scaleflow.io",
      name: "Sarah Chen",
      firstTouchSource: "google",
      firstTouchAt: new Date("2026-06-01"),
      lastTouchSource: "google",
      lastTouchAt: new Date("2026-06-01"),
      quizAnswers: [
        { questionId: "goal", answer: "Grow sales" },
        { questionId: "team", answer: "2–10 people" },
        { questionId: "help", answer: "Strategy" },
      ],
    },
    {
      email: "marcus@buildright.co",
      name: "Marcus Webb",
      firstTouchSource: "facebook",
      firstTouchAt: new Date("2026-06-05"),
      lastTouchSource: "direct",
      lastTouchAt: new Date("2026-06-18"),
      quizAnswers: [
        { questionId: "goal", answer: "Build a team" },
        { questionId: "team", answer: "10+ people" },
        { questionId: "help", answer: "Leadership" },
      ],
    },
    {
      email: "elena@novapay.com",
      name: "Elena Rossi",
      firstTouchSource: "google",
      firstTouchAt: new Date("2026-06-10"),
      lastTouchSource: "facebook",
      lastTouchAt: new Date("2026-06-20"),
      quizAnswers: [
        { questionId: "goal", answer: "Find focus" },
        { questionId: "team", answer: "Just me" },
        { questionId: "help", answer: "Marketing" },
      ],
    },
  ]);

  const events = [
    "landing_view",
    "quiz_step_1",
    "quiz_step_2",
    "quiz_step_3",
    "quiz_complete",
    "email_capture",
    "paywall_view",
    "buy_click",
    "early_access_view",
    "user_login",
  ] as const;

  for (const user of users) {
    for (const step of events) {
      await FunnelEventModel.create({
        sessionId: `seed-${user._id}`,
        userId: user._id,
        step,
        source: user.lastTouchSource,
        utmSource: user.lastTouchSource,
        isReturningUser: step === "user_login" || step === "early_access_view",
        metadata: step === "buy_click" ? { tier: "pro" } : {},
      });
    }
  }

  console.log(`Seeded ${users.length} users and funnel events`);
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
