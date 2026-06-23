"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/shared/ui";
import type { SourceAnalytics } from "../lib/dashboard-types";
import { sourceColor } from "../lib/dashboard-types";

const chartConfig = {
  landing: { label: "Landing", color: "#a855f7" },
  quiz: { label: "Quiz", color: "#7c3aed" },
  email: { label: "Email", color: "#6366f1" },
  buy: { label: "Buy", color: "#22d3ee" },
} satisfies ChartConfig;

function normalizeSourceRows(rows: SourceAnalytics[]) {
  return rows.map((row) => {
    const get = (step: string) =>
      row.steps.find((item) => item.step === step)?.count ?? 0;

    return {
      source: row.source || "unknown",
      landing: get("landing_view"),
      quiz:
        get("quiz_step_1") +
        get("quiz_step_2") +
        get("quiz_complete"),
      email: get("email_capture"),
      buy: get("buy_click"),
      total: row.total,
    };
  });
}

export function DashboardSourceChart({ sources }: { sources: SourceAnalytics[] }) {
  const data = normalizeSourceRows(sources);

  return (
    <Card className="border-purple-500/10 bg-zinc-900/80">
      <CardHeader>
        <CardTitle className="text-white">Traffic by source</CardTitle>
        <p className="text-sm text-zinc-400">
          Funnel activity split by UTM / source (google, facebook, direct, etc.)
        </p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[340px] w-full">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="source"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#a1a1aa", fontSize: 12 }}
            />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "#a1a1aa", fontSize: 12 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend wrapperStyle={{ color: "#d4d4d8", fontSize: 12 }} />
            <Bar dataKey="landing" stackId="a" fill="var(--color-landing)" radius={[0, 0, 0, 0]} />
            <Bar dataKey="quiz" stackId="a" fill="var(--color-quiz)" />
            <Bar dataKey="email" stackId="a" fill="var(--color-email)" />
            <Bar dataKey="buy" stackId="a" fill="var(--color-buy)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartContainer>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((row) => (
            <div
              key={row.source}
              className="rounded-lg border border-purple-500/10 bg-zinc-950/50 p-4"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: sourceColor(row.source) }}
                />
                <p className="font-medium capitalize text-white">{row.source}</p>
              </div>
              <p className="mt-2 text-2xl font-bold tabular-nums text-purple-300">
                {row.total.toLocaleString()}
              </p>
              <p className="text-xs text-zinc-500">total funnel events</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
