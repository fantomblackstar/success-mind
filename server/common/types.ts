export type FunnelStep =
  | "landing_view"
  | "cta_click"
  | "quiz_step_1"
  | "quiz_step_2"
  | "quiz_step_3"
  | "quiz_complete"
  | "email_capture"
  | "user_login"
  | "paywall_view"
  | "buy_click"
  | "early_access_view";

export interface UtmPayload {
  source: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export interface QuizAnswer {
  questionId: string;
  answer: string;
}
