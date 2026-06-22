"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  dashboardLoginSchema,
  type DashboardLoginValues,
} from "@/shared/lib/schemas";
import { apiFetch } from "@/shared/api/client";

export function DashboardLoginForm() {
  const router = useRouter();
  const form = useForm<DashboardLoginValues>({
    resolver: zodResolver(dashboardLoginSchema),
    defaultValues: { username: "", password: "" },
  });

  async function onSubmit(values: DashboardLoginValues) {
    try {
      await apiFetch("/api/dashboard/login", {
        method: "POST",
        body: JSON.stringify(values),
      });
      router.push("/dashboard");
    } catch {
      form.setError("password", { message: "Invalid username or password" });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" {...form.register("username")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...form.register("password")} />
        {form.formState.errors.password ? (
          <p className="text-sm text-red-400">{form.formState.errors.password.message}</p>
        ) : null}
      </div>
      <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-500">
        Sign in
      </Button>
    </form>
  );
}
