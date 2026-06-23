"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import type { Overview } from "../lib/dashboard-types";

const METRICS = [
  { key: "entered", label: "Entered funnel", field: "entered" as const },
  { key: "quiz", label: "Completed quiz", field: "quizComplete" as const },
  { key: "email", label: "Email captured", field: "emailCapture" as const },
  { key: "buy", label: "Reached buy", field: "buyClick" as const },
  { key: "users", label: "Registered users", field: "totalUsers" as const },
];

export function DashboardMetricCards({ overview }: { overview: Overview }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {METRICS.map((metric, index) => (
        <motion.div
          key={metric.key}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.06, duration: 0.4 }}
        >
          <Card className="border-purple-500/10 bg-zinc-900/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                {metric.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold tabular-nums text-purple-300">
                {overview[metric.field].toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
