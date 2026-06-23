"use client";

import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { Badge, Card, CardContent, CardHeader, CardTitle, SectionTitle } from "@/shared/ui";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/shared/ui";
import type { Attribution } from "../lib/dashboard-types";
import { sourceColor } from "../lib/dashboard-types";
import { countAttributionBySource } from "../lib/dashboard-utils";

const chartConfig = {
  firstTouch: { label: "First touch", color: "#a855f7" },
  lastTouch: { label: "Last touch", color: "#6366f1" },
} satisfies ChartConfig;

function buildAttributionChartData(attribution: Attribution[]) {
  const first = countAttributionBySource(attribution, "firstTouchSource");
  const last = countAttributionBySource(attribution, "lastTouchSource");
  const sources = Array.from(new Set([...Object.keys(first), ...Object.keys(last)]));

  return sources.map((source) => ({
    source,
    firstTouch: first[source] ?? 0,
    lastTouch: last[source] ?? 0,
  }));
}

function formatTouchDate(value: string) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function DashboardAttributionPanel({
  attribution,
}: {
  attribution: Attribution[];
}) {
  const chartData = buildAttributionChartData(attribution);

  return (
    <div className="space-y-6">
      <Card className="border-purple-500/10 bg-zinc-900/80">
        <CardHeader>
          <CardTitle className="text-white">First touch vs last touch</CardTitle>
          <p className="text-sm text-zinc-400">
            Where users first registered vs their most recent visit source (remarketing)
          </p>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="source"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#a1a1aa", fontSize: 12 }}
              />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: "#a1a1aa", fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="firstTouch" fill="var(--color-firstTouch)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="lastTouch" fill="var(--color-lastTouch)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div>
          <SectionTitle as="h2" className="text-left text-2xl md:text-3xl">
            Registered users
          </SectionTitle>
          <p className="mt-2 text-sm text-zinc-400">
            First and last touch source with timestamps
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {attribution.map((user, index) => (
          <motion.div
            key={user.email}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.35 }}
          >
            <Card className="border-purple-500/10 bg-zinc-900/70 transition-colors hover:border-purple-500/30">
              <CardContent className="space-y-4 pt-6">
                <div>
                  <p className="font-semibold text-white">{user.name}</p>
                  <p className="text-sm text-zinc-500">{user.email}</p>
                </div>

                <div className="space-y-3">
                  <div className="rounded-lg border border-purple-500/10 bg-zinc-950/40 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs uppercase tracking-wide text-zinc-500">
                        First touch
                      </span>
                      <Badge
                        className="capitalize"
                        style={{
                          backgroundColor: `${sourceColor(user.firstTouchSource)}22`,
                          color: sourceColor(user.firstTouchSource),
                          borderColor: `${sourceColor(user.firstTouchSource)}55`,
                        }}
                      >
                        {user.firstTouchSource}
                      </Badge>
                    </div>
                    <p className="mt-2 text-xs text-zinc-400">
                      {formatTouchDate(user.firstTouchAt)}
                    </p>
                  </div>

                  <div className="rounded-lg border border-purple-500/10 bg-zinc-950/40 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs uppercase tracking-wide text-zinc-500">
                        Last touch
                      </span>
                      <Badge
                        variant="secondary"
                        className="capitalize"
                        style={{
                          backgroundColor: `${sourceColor(user.lastTouchSource)}22`,
                          color: sourceColor(user.lastTouchSource),
                          borderColor: `${sourceColor(user.lastTouchSource)}55`,
                        }}
                      >
                        {user.lastTouchSource}
                      </Badge>
                    </div>
                    <p className="mt-2 text-xs text-zinc-400">
                      {formatTouchDate(user.lastTouchAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        </div>
      </div>
    </div>
  );
}
