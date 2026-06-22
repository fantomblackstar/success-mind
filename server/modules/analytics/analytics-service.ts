import { connectDB } from "../../database/connection";
import { FunnelEventModel } from "../../database/models/funnel-event-model";
import { UserModel } from "../../database/models/user-model";

const FUNNEL_STEPS = [
  "landing_view",
  "quiz_step_1",
  "quiz_step_2",
  "quiz_step_3",
  "quiz_complete",
  "email_capture",
  "paywall_view",
  "buy_click",
  "early_access_view",
] as const;

export const analyticsService = {
  async getOverview() {
    await connectDB();

    const counts = await Promise.all(
      FUNNEL_STEPS.map(async (step) => ({
        step,
        count: await FunnelEventModel.countDocuments({ step }),
      })),
    );

    const totalUsers = await UserModel.countDocuments();
    const entered = counts.find((c) => c.step === "landing_view")?.count ?? 0;

    return {
      entered,
      quizComplete: counts.find((c) => c.step === "quiz_complete")?.count ?? 0,
      emailCapture: counts.find((c) => c.step === "email_capture")?.count ?? 0,
      paywallView: counts.find((c) => c.step === "paywall_view")?.count ?? 0,
      buyClick: counts.find((c) => c.step === "buy_click")?.count ?? 0,
      earlyAccess: counts.find((c) => c.step === "early_access_view")?.count ?? 0,
      totalUsers,
      steps: counts,
    };
  },

  async getConversions() {
    await connectDB();

    const stepCounts = await FunnelEventModel.aggregate([
      { $group: { _id: "$step", count: { $sum: 1 } } },
    ]);

    const map = Object.fromEntries(stepCounts.map((s) => [s._id, s.count]));

    const pairs = [
      { from: "landing_view", to: "quiz_step_1", label: "Landing → Quiz" },
      { from: "quiz_complete", to: "email_capture", label: "Quiz → Email" },
      { from: "email_capture", to: "paywall_view", label: "Email → Paywall" },
      { from: "paywall_view", to: "buy_click", label: "Paywall → Buy" },
    ];

    return pairs.map((pair) => {
      const fromCount = map[pair.from] ?? 0;
      const toCount = map[pair.to] ?? 0;
      const rate = fromCount > 0 ? Math.round((toCount / fromCount) * 100) : 0;
      return { ...pair, fromCount, toCount, rate };
    });
  },

  async getBySource() {
    await connectDB();

    return FunnelEventModel.aggregate([
      {
        $group: {
          _id: { source: "$source", step: "$step" },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.source",
          steps: { $push: { step: "$_id.step", count: "$count" } },
          total: { $sum: "$count" },
        },
      },
      { $sort: { total: -1 } },
    ]);
  },

  async getAttribution() {
    await connectDB();

    return UserModel.find()
      .sort({ lastTouchAt: -1 })
      .select("email name firstTouchSource firstTouchAt lastTouchSource lastTouchAt")
      .lean();
  },
};
