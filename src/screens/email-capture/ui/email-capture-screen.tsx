"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FunnelShell } from "@/widgets/funnel-shell";
import { EmailForm } from "@/features/submit-email";
import { isQuizComplete } from "@/shared/lib/quiz-storage";
import { trackEvent } from "@/shared/api/client";
import { routes } from "@/shared/lib/routes";

export function EmailCaptureScreen() {
  const router = useRouter();

  useEffect(() => {
    if (!isQuizComplete()) {
      router.replace(routes.quiz(1));
      return;
    }
    trackEvent("email_capture");
  }, [router]);

  return (
    <FunnelShell
      title="Almost there"
      subtitle="Name and email to continue"
    >
      <EmailForm />
    </FunnelShell>
  );
}
