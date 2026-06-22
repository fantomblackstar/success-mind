import { z } from "zod";

export const emailFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
});

export const loginFormSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

export const dashboardLoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type EmailFormValues = z.infer<typeof emailFormSchema>;
export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type DashboardLoginValues = z.infer<typeof dashboardLoginSchema>;

export const submitEmailApiSchema = emailFormSchema.extend({
  quizAnswers: z
    .array(
      z.object({
        questionId: z.string(),
        answer: z.string(),
      }),
    )
    .optional(),
});

export const trackEventSchema = z.object({
  step: z.string(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const buyClickSchema = z.object({
  tier: z.enum(["starter", "pro"]),
});
