import { SiteHeader } from "@/widgets/site-header";
import { getUserSession } from "@/shared/lib/session";
import { LandingCommunityGlobe } from "./landing-community-globe";
import { LandingCtaBand } from "./landing-cta-band";
import { LandingHero } from "./landing-hero";
import { LandingHowItWorks } from "./landing-how-it-works";
import { LandingSessionInit } from "./landing-session-init";
import { LandingStats } from "./landing-stats";
import { LandingTestimonialsSection } from "./landing-testimonials-section";

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
        <LandingTestimonialsSection />
        <LandingCtaBand />
      </main>
    </div>
  );
}
