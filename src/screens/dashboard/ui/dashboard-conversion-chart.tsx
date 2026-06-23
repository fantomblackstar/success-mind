"use client";

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/shared/ui";
import type { Conversion } from "../lib/dashboard-types";

const chartConfig = {
  rate: { label: "Conversion", color: "#a855f7" },
  toCount: { label: "Users", color: "#7c3aed" },
} satisfies ChartConfig;

export function DashboardConversionChart({
  conversions,
}: {
  conversions: Conversion[];
}) {
  const data = conversions.map((row) => ({
    name: row.label,
    rate: row.rate,
    toCount: row.toCount,
    fromCount: row.fromCount,
  }));

  return (
    <Card className="border-purple-500/10 bg-zinc-900/80">
      <CardHeader>
        <CardTitle className="text-white">Step conversions</CardTitle>
        <p className="text-sm text-zinc-400">
          How effectively users move between funnel stages
        </p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[320px] w-full">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 48 }}>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              angle={-18}
              textAnchor="end"
              height={70}
              interval={0}
              tick={{ fill: "#a1a1aa", fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#a1a1aa", fontSize: 12 }}
              unit="%"
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name, item) => {
                    if (name === "rate") {
                      return [`${value}%`, "Conversion rate"];
                    }
                    return [value, name];
                  }}
                  labelFormatter={(label, payload) => {
                    const row = payload?.[0]?.payload as (typeof data)[number] | undefined;
                    if (!row) return label;
                    return `${label} · ${row.fromCount} → ${row.toCount} users`;
                  }}
                />
              }
            />
            <Bar dataKey="rate" radius={[6, 6, 0, 0]}>
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={`rgba(168, 85, 247, ${0.35 + (entry.rate / 100) * 0.65})`}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
