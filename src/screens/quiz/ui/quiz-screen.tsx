"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryState, parseAsInteger } from "nuqs";
import { Button } from "@/shared/ui";
import { QUIZ_QUESTIONS, QUIZ_STEP_COUNT } from "@/shared/config/quiz";
import { FunnelShell, OptionButton } from "@/widgets/funnel-shell";
import { getQuizAnswers, setQuizAnswer } from "@/shared/lib/quiz-storage";
import { trackEvent } from "@/shared/api/client";
import { routes } from "@/shared/lib/routes";
import { useState } from "react";

export function QuizScreen() {
  const router = useRouter();
  const [step, setStep] = useQueryState("step", parseAsInteger.withDefault(1));
  const [selected, setSelected] = useState<string>("");

  const current = QUIZ_QUESTIONS[step - 1];

  useEffect(() => {
    if (step < 1 || step > QUIZ_STEP_COUNT) {
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

    if (step >= QUIZ_STEP_COUNT) {
      trackEvent("quiz_complete");
      router.push(routes.email);
      return;
    }

    setStep(step + 1);
    setSelected("");
  }

  return (
    <FunnelShell
      title={current.question}
      subtitle="One answer"
      step={`Step ${step} of ${QUIZ_STEP_COUNT}`}
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
          <Button variant="outline" size="lg" className="flex-1" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        ) : null}
        <Button
          size="lg"
          className="flex-1 bg-purple-600 hover:bg-purple-500"
          disabled={!selected}
          onClick={goNext}
        >
          {step >= QUIZ_STEP_COUNT ? "Continue" : "Next"}
        </Button>
      </div>
    </FunnelShell>
  );
}
