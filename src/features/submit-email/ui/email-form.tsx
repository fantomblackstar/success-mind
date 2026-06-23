"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui";
import { Input } from "@/shared/ui";
import { Label } from "@/shared/ui";
import {
  emailFormSchema,
  type EmailFormValues,
} from "@/shared/lib/schemas";
import { apiFetch } from "@/shared/api/client";
import { getQuizAnswers } from "@/shared/lib/quiz-storage";
import { routes } from "@/shared/lib/routes";

export function EmailForm() {
  const router = useRouter();
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: { name: "", email: "" },
  });

  async function onSubmit(values: EmailFormValues) {
    try {
      const result = await apiFetch<{ isReturning: boolean }>(routes.api.funnelEmail, {
        method: "POST",
        body: JSON.stringify({
          ...values,
          quizAnswers: getQuizAnswers(),
        }),
      });

      if (result.isReturning) {
        router.push(routes.earlyAccess);
      } else {
        router.push(routes.paywall);
      }
    } catch (error) {
      form.setError("email", {
        message: error instanceof Error ? error.message : "Something went wrong",
      });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Your name</Label>
        <Input id="name" placeholder="John" {...form.register("name")} />
        {form.formState.errors.name ? (
          <p className="text-sm text-red-400">{form.formState.errors.name.message}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="you@company.com" {...form.register("email")} />
        {form.formState.errors.email ? (
          <p className="text-sm text-red-400">{form.formState.errors.email.message}</p>
        ) : null}
      </div>
      <Button
        type="submit"
        className="w-full bg-purple-600 hover:bg-purple-500"
        disabled={form.formState.isSubmitting}
      >
        Continue
      </Button>
    </form>
  );
}
