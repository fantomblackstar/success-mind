import { SiteHeader } from "@/widgets/site-header";
import { SectionTitle } from "@/shared/ui";
import {
  LandingCommunityGlobe,
  LandingCtaBand,
  LandingFeedbackGrid,
  LandingHero,
  LandingHowItWorks,
  LandingSessionInit,
  LandingStats,
} from "@/widgets/landing";
import { getUserSession } from "@/shared/lib/session";

export async function LandingScreen() {
  const user = await getUserSession();

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <SiteHeader user={user} />
      <LandingSessionInit />
      <main>
        <LandingHero />
        <LandingStats />
        <LandingHowItWorks />
        <LandingCommunityGlobe />
        <section className="mx-auto max-w-6xl px-4 py-16">
          <SectionTitle className="mb-10 text-4xl md:text-5xl">What CEOs say</SectionTitle>
          <LandingFeedbackGrid />
        </section>
        <LandingCtaBand />
      </main>
    </div>
  );
}
