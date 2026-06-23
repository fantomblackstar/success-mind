"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import type { Overview } from "../lib/dashboard-types";
import { buildFunnelFlowData } from "../lib/dashboard-utils";

function FlowConnector({
  index,
  fromScale,
  toScale,
  rate,
}: {
  index: number;
  fromScale: number;
  toScale: number;
  rate: number;
}) {
  return (
    <div className="relative mx-1 hidden h-24 w-10 shrink-0 items-center lg:flex">
      <svg viewBox="0 0 40 96" className="h-full w-full overflow-visible" aria-hidden="true">
        <defs>
          <linearGradient id={`flow-connector-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(168,85,247,0.55)" />
            <stop offset="100%" stopColor="rgba(109,40,217,0.25)" />
          </linearGradient>
        </defs>
        <motion.path
          d={`M 0 ${48 - fromScale * 18} C 20 ${48 - fromScale * 18}, 20 ${48 - toScale * 18}, 40 ${48 - toScale * 18} L 40 ${48 + toScale * 18} C 20 ${48 + toScale * 18}, 20 ${48 + fromScale * 18}, 0 ${48 + fromScale * 18} Z`}
          fill={`url(#flow-connector-${index})`}
          initial={{ opacity: 0, scaleX: 0.4 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "left center" }}
        />
      </svg>
      <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-medium text-purple-300/80">
        {rate}%
      </span>
    </div>
  );
}

export function DashboardFunnelFlow({ overview }: { overview: Overview }) {
  const flow = buildFunnelFlowData(overview.steps);

  return (
    <Card className="overflow-hidden border-purple-500/10 bg-zinc-900/80">
      <CardHeader>
        <CardTitle className="text-white">Funnel flow</CardTitle>
        <p className="text-sm text-zinc-400">
          Volume narrows from landing to purchase — wider blocks mean more users at that step
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto pb-4">
          <div className="flex min-w-[920px] items-end px-2 py-6">
            {flow.map((step, index) => {
              const next = flow[index + 1];
              const conversionRate =
                step.count > 0 && next
                  ? Math.round((next.count / step.count) * 100)
                  : 0;

              return (
                <div key={step.key} className="flex flex-1 items-end">
                  <motion.div
                    className="relative flex flex-1 flex-col items-center"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08, duration: 0.5 }}
                  >
                    <div
                      className="relative flex w-full max-w-[140px] flex-col items-center justify-end rounded-xl border border-purple-500/30 bg-gradient-to-b from-purple-600/30 to-purple-950/50 px-3 pb-4 pt-6 shadow-[0_0_40px_rgba(168,85,247,0.12)]"
                      style={{
                        minHeight: `${Math.round(120 + step.scale * 120)}px`,
                      }}
                    >
                      <motion.div
                        className="absolute inset-x-3 top-3 rounded-md bg-purple-500/20"
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(step.retention, 8)}%` }}
                        transition={{ delay: 0.2 + index * 0.08, duration: 0.8 }}
                      />
                      <p className="relative z-10 text-2xl font-bold tabular-nums text-white">
                        {step.count.toLocaleString()}
                      </p>
                      <p className="relative z-10 mt-1 text-center text-xs font-medium text-purple-200">
                        {step.shortLabel}
                      </p>
                      {index > 0 ? (
                        <p className="relative z-10 mt-2 text-[10px] text-zinc-500">
                          −{step.dropOff}% drop
                        </p>
                      ) : (
                        <p className="relative z-10 mt-2 text-[10px] text-zinc-500">
                          {step.retention}% of top
                        </p>
                      )}
                    </div>
                    <p className="mt-3 hidden text-center text-xs text-zinc-500 lg:block">
                      {step.label}
                    </p>
                  </motion.div>

                  {next ? (
                    <FlowConnector
                      index={index}
                      fromScale={step.scale}
                      toScale={next.scale}
                      rate={conversionRate}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-2 grid gap-3 lg:hidden">
          {flow.map((step, index) => {
            const next = flow[index + 1];
            const conversionRate =
              step.count > 0 && next
                ? Math.round((next.count / step.count) * 100)
                : null;

            return (
              <div
                key={step.key}
                className="flex items-center justify-between rounded-lg border border-purple-500/10 bg-zinc-950/50 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-white">{step.label}</p>
                  <p className="text-sm text-zinc-500">{step.count.toLocaleString()} users</p>
                </div>
                {conversionRate !== null ? (
                  <span className="text-sm font-medium text-purple-300">{conversionRate}% →</span>
                ) : null}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
