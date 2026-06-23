import { connectDB } from "../server/database/connection";
import { UserModel } from "../server/database/models/user-model";
import { FunnelEventModel } from "../server/database/models/funnel-event-model";

async function seed() {
  const startedAt = Date.now();
  console.log("[seed] Starting database seed...");

  await connectDB();
  console.log("[seed] Connected to MongoDB");

  const deletedUsers = await UserModel.deleteMany({});
  const deletedEvents = await FunnelEventModel.deleteMany({});
  console.log(
    `[seed] Cleared collections (${deletedUsers.deletedCount} users, ${deletedEvents.deletedCount} events)`,
  );

  console.log("[seed] Inserting demo users...");
  const users = await UserModel.insertMany([
    {
      email: "sarah@scaleflow.io",
      name: "Sarah Chen",
      firstTouchSource: "google",
      firstTouchAt: new Date("2026-06-01T10:30:00Z"),
      lastTouchSource: "google",
      lastTouchAt: new Date("2026-06-01T10:45:00Z"),
      quizAnswers: [
        { questionId: "goal", answer: "Grow sales" },
        { questionId: "help", answer: "Strategy" },
      ],
    },
    {
      email: "marcus@buildright.co",
      name: "Marcus Webb",
      firstTouchSource: "facebook",
      firstTouchAt: new Date("2026-06-05T14:00:00Z"),
      lastTouchSource: "direct",
      lastTouchAt: new Date("2026-06-18T09:15:00Z"),
      quizAnswers: [
        { questionId: "goal", answer: "Build a team" },
        { questionId: "help", answer: "Leadership" },
      ],
    },
    {
      email: "elena@novapay.com",
      name: "Elena Rossi",
      firstTouchSource: "google",
      firstTouchAt: new Date("2026-06-10T08:20:00Z"),
      lastTouchSource: "facebook",
      lastTouchAt: new Date("2026-06-20T16:40:00Z"),
      quizAnswers: [
        { questionId: "goal", answer: "Find focus" },
        { questionId: "help", answer: "Marketing" },
      ],
    },
  ]);
  console.log(`[seed] Created ${users.length} users`);

  const events = [
    "landing_view",
    "quiz_step_1",
    "quiz_step_2",
    "quiz_complete",
    "email_capture",
    "paywall_view",
    "buy_click",
    "early_access_view",
    "user_login",
  ] as const;

  console.log(`[seed] Creating registered-user funnel events (${events.length} steps per user)...`);
  let registeredEventCount = 0;

  for (const user of users) {
    console.log(`[seed]   → ${user.email}`);
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
      registeredEventCount += 1;
    }
  }

  console.log(`[seed] Created ${registeredEventCount} registered-user events`);

  const anonymousFunnel: { step: (typeof events)[number]; count: number }[] = [
    { step: "landing_view", count: 48 },
    { step: "quiz_step_1", count: 30 },
    { step: "quiz_step_2", count: 22 },
    { step: "quiz_complete", count: 20 },
    { step: "email_capture", count: 11 },
    { step: "paywall_view", count: 9 },
    { step: "buy_click", count: 4 },
    { step: "early_access_view", count: 5 },
  ];

  const trafficSources = ["google", "facebook", "direct"] as const;
  const anonymousTotal = anonymousFunnel.reduce((sum, item) => sum + item.count, 0);

  console.log(`[seed] Creating anonymous funnel events (${anonymousTotal} total)...`);

  let anonymousEventCount = 0;

  for (const { step, count } of anonymousFunnel) {
    console.log(`[seed]   → ${step}: ${count} events`);
    for (let index = 0; index < count; index += 1) {
      const source = trafficSources[index % trafficSources.length];
      await FunnelEventModel.create({
        sessionId: `anon-${step}-${index}`,
        step,
        source,
        utmSource: source,
        isReturningUser: false,
        metadata: {},
      });
      anonymousEventCount += 1;
    }
  }

  const elapsedMs = Date.now() - startedAt;
  console.log("[seed] Done.");
  console.log(
    `[seed] Summary: ${users.length} users, ${registeredEventCount + anonymousEventCount} funnel events (${registeredEventCount} registered + ${anonymousEventCount} anonymous) in ${(elapsedMs / 1000).toFixed(1)}s`,
  );
  process.exit(0);
}

seed().catch((error) => {
  console.error("[seed] Failed:", error);
  process.exit(1);
});
