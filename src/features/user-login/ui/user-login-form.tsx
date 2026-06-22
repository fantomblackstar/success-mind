"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginFormSchema, type LoginFormValues } from "@/shared/lib/schemas";
import { apiFetch } from "@/shared/api/client";

export function UserLoginForm() {
  const router = useRouter();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      const result = await apiFetch<{ found: boolean }>("/api/funnel/login", {
        method: "POST",
        body: JSON.stringify(values),
      });

      if (!result.found) {
        form.setError("email", {
          message: "No account yet. Click Get Early Access to start.",
        });
        return;
      }

      router.push("/early-access");
    } catch {
      form.setError("email", {
        message: "No account yet. Click Get Early Access to start.",
      });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
        Login
      </Button>
    </form>
  );
}
