"use client";

import { QUIZ_STEP_COUNT } from "@/shared/config/quiz";

const QUIZ_KEY = "success_mind_quiz";

export interface StoredQuizAnswer {
  questionId: string;
  answer: string;
}

export function getQuizAnswers(): StoredQuizAnswer[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(sessionStorage.getItem(QUIZ_KEY) || "[]");
  } catch {
    return [];
  }
}

export function setQuizAnswer(questionId: string, answer: string) {
  const current = getQuizAnswers().filter((item) => item.questionId !== questionId);
  current.push({ questionId, answer });
  sessionStorage.setItem(QUIZ_KEY, JSON.stringify(current));
}

export function isQuizComplete() {
  return getQuizAnswers().length >= QUIZ_STEP_COUNT;
}

export function clearQuizAnswers() {
  sessionStorage.removeItem(QUIZ_KEY);
}

export function setBuyFlag() {
  sessionStorage.setItem("success_mind_buy", "1");
}

export function hasBuyFlag() {
  return sessionStorage.getItem("success_mind_buy") === "1";
}
