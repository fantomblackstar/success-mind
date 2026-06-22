"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FunnelShell } from "@/widgets/funnel-shell/ui/funnel-shell";
import { EmailForm } from "@/features/submit-email/ui/email-form";
import { isQuizComplete } from "@/shared/lib/quiz-storage";
import { trackEvent } from "@/shared/api/client";

export function EmailCaptureScreen() {
  const router = useRouter();

  useEffect(() => {
    if (!isQuizComplete()) {
      router.replace("/quiz?step=1");
      return;
    }
    trackEvent("email_capture");
  }, [router]);

  return (
    <FunnelShell
      title="Almost there"
      subtitle="Tell us your name and email to continue"
      step="Step 4 of 4"
    >
      <EmailForm />
    </FunnelShell>
  );
}
