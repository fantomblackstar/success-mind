"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryState, parseAsInteger } from "nuqs";
import { Button } from "@/components/ui/button";
import { QUIZ_QUESTIONS } from "@/shared/config/quiz";
import { FunnelShell, OptionButton } from "@/widgets/funnel-shell/ui/funnel-shell";
import { getQuizAnswers, setQuizAnswer } from "@/shared/lib/quiz-storage";
import { trackEvent } from "@/shared/api/client";
import { useState } from "react";

export function QuizScreen() {
  const router = useRouter();
  const [step, setStep] = useQueryState("step", parseAsInteger.withDefault(1));
  const [selected, setSelected] = useState<string>("");

  const current = QUIZ_QUESTIONS[step - 1];

  useEffect(() => {
    if (step < 1 || step > 3) {
      setStep(1);
    }
  }, [step, setStep]);

  useEffect(() => {
    if (!current) return;
    const existing = getQuizAnswers().find((item) => item.questionId === current.id);
    setSelected(existing?.answer ?? "");
    trackEvent(`quiz_step_${step}` as "quiz_step_1");
  }, [step, current]);

  if (!current) return null;

  function goNext() {
    if (!selected) return;
    setQuizAnswer(current.id, selected);

    if (step >= 3) {
      trackEvent("quiz_complete");
      router.push("/email");
      return;
    }

    setStep(step + 1);
    setSelected("");
  }

  return (
    <FunnelShell
      title={current.question}
      subtitle="Pick one answer"
      step={`Step ${step} of 3`}
    >
      <div className="space-y-3">
        {current.options.map((option) => (
          <OptionButton
            key={option}
            selected={selected === option}
            onClick={() => setSelected(option)}
          >
            {option}
          </OptionButton>
        ))}
      </div>
      <div className="mt-6 flex gap-3">
        {step > 1 ? (
          <Button variant="outline" className="flex-1" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        ) : null}
        <Button
          className="flex-1 bg-purple-600 hover:bg-purple-500"
          disabled={!selected}
          onClick={goNext}
        >
          {step >= 3 ? "Continue" : "Next"}
        </Button>
      </div>
    </FunnelShell>
  );
}
