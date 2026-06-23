import { SiteHeader } from "@/widgets/site-header";
import {
  LandingCtaBand,
  LandingFeatures,
  LandingFeedbackGrid,
  LandingHero,
  LandingHowItWorks,
  LandingSessionInit,
  LandingStats,
} from "@/widgets/landing";
import { AuroraBackground } from "@/shared/ui/aceternity";
import { getUserSession } from "@/shared/lib/session";

export async function LandingScreen() {
  const user = await getUserSession();

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <SiteHeader user={user} />
      <LandingSessionInit />
      <AuroraBackground>
        <main>
          <LandingHero />
          <LandingStats />
          <LandingHowItWorks />
          <LandingFeatures />
          <section className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="mb-8 text-center text-3xl font-semibold">What founders say</h2>
            <LandingFeedbackGrid />
          </section>
          <LandingCtaBand />
        </main>
      </AuroraBackground>
    </div>
  );
}
