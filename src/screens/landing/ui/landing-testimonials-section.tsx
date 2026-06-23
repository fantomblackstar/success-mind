import { SectionTitle } from "@/shared/ui";
import { LandingFeedbackGrid } from "./landing-feedback-grid";

export function LandingTestimonialsSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <SectionTitle className="mb-10 text-4xl md:text-5xl">What CEOs say</SectionTitle>
      <LandingFeedbackGrid />
    </section>
  );
}
