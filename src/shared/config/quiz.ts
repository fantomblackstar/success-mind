export const QUIZ_QUESTIONS = [
  {
    id: "goal",
    question: "Your biggest goal right now?",
    options: ["Grow sales", "Build a team", "Find focus"],
  },
  {
    id: "help",
    question: "Need help with?",
    options: ["Strategy", "Marketing", "Leadership"],
  },
] as const;

export const QUIZ_STEP_COUNT = QUIZ_QUESTIONS.length;
