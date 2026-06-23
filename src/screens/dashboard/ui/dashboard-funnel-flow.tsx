"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import type { Overview } from "../lib/dashboard-types";
import { buildConnectorChain, buildFunnelFlowData } from "../lib/dashboard-utils";

  const CONNECTOR_INNER_WIDTH = 48;
  const CONNECTOR_SLOT = "w-[56px] shrink-0 px-1";

function FlowConnector({
  index,
  fromHeight,
  toHeight,
}: {
  index: number;
  fromHeight: number;
  toHeight: number;
}) {
  const rightTop = fromHeight - toHeight;

  return (
    <div
      className={`${CONNECTOR_SLOT} self-end`}
      style={{ height: fromHeight }}
      aria-hidden="true"
    >
      <svg
        width={CONNECTOR_INNER_WIDTH}
        height={fromHeight}
        viewBox={`0 0 ${CONNECTOR_INNER_WIDTH} ${fromHeight}`}
        className="block overflow-visible"
      >
        <defs>
          <linearGradient id={`flow-connector-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(168,85,247,0.55)" />
            <stop offset="100%" stopColor="rgba(109,40,217,0.25)" />
          </linearGradient>
        </defs>
        <motion.path
          d={`M 0 0 L 0 ${fromHeight} L ${CONNECTOR_INNER_WIDTH} ${fromHeight} L ${CONNECTOR_INNER_WIDTH} ${rightTop} Z`}
          fill={`url(#flow-connector-${index})`}
          initial={{ opacity: 0, scaleX: 0.4 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "left center" }}
        />
      </svg>
    </div>
  );
}

function FunnelColumn({
  step,
  index,
}: {
  step: ReturnType<typeof buildFunnelFlowData>[number];
  index: number;
}) {
  return (
    <motion.div
      className="flex min-w-0 flex-1 flex-col items-center"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
    >
      <div
        className="relative flex w-full flex-col overflow-hidden rounded-xl border border-purple-500/30 bg-gradient-to-b from-purple-600/30 to-purple-950/50 shadow-[0_0_40px_rgba(168,85,247,0.12)]"
        style={{ height: step.heightPx }}
      >
        <motion.div
          className="absolute inset-x-0 bottom-0 bg-purple-500/20"
          initial={{ height: 0 }}
          animate={{ height: "100%" }}
          transition={{ delay: 0.2 + index * 0.08, duration: 0.8 }}
        />
        <div className="relative z-10 flex h-full flex-col items-center justify-end px-2 pb-3 pt-3">
          <p className="text-xl font-bold tabular-nums text-white md:text-2xl">
            {step.count.toLocaleString()}
          </p>
          <p className="mt-1 text-center text-xs font-medium text-purple-200">
            {step.shortLabel}
          </p>
          {index > 0 ? (
            <p className="mt-1.5 text-[10px] text-zinc-500">−{step.dropOff}% drop</p>
          ) : (
            <p className="mt-1.5 text-[10px] text-zinc-500">{step.retention}% of top</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function DashboardFunnelFlow({ overview }: { overview: Overview }) {
  const flow = buildFunnelFlowData(overview.steps);
  const connectors = buildConnectorChain(flow);

  return (
    <Card className="overflow-hidden border-purple-500/10 bg-zinc-900/80">
      <CardHeader>
        <CardTitle className="text-white">Funnel flow</CardTitle>
        <p className="text-sm text-zinc-400">
          Connectors chain the real drop — each bridge starts where the previous one ended
        </p>
      </CardHeader>
      <CardContent>
        <div className="hidden w-full lg:block">
          <div className="flex w-full items-end gap-0">
            {flow.map((step, index) => {
              const connector = connectors[index];

              return (
                <Fragment key={step.key}>
                  <FunnelColumn step={step} index={index} />
                  {connector ? (
                    <FlowConnector
                      index={index}
                      fromHeight={connector.fromHeight}
                      toHeight={connector.toHeight}
                    />
                  ) : null}
                </Fragment>
              );
            })}
          </div>

          <div className="mt-2 flex w-full gap-0">
            {flow.map((step, index) => {
              const next = flow[index + 1];

              return (
                <Fragment key={`${step.key}-caption`}>
                  <p className="min-w-0 flex-1 text-center text-xs text-zinc-500">
                    {step.label}
                  </p>
                  {next ? (
                    <p
                      className={`${CONNECTOR_SLOT} text-center text-xs font-medium text-purple-300/80`}
                    >
                      −{step.dropOffToNext}%
                    </p>
                  ) : null}
                </Fragment>
              );
            })}
          </div>
        </div>

        <div className="mt-2 grid gap-3 lg:hidden">
          {flow.map((step, index) => {
            const next = flow[index + 1];

            return (
              <div
                key={step.key}
                className="flex items-center justify-between rounded-lg border border-purple-500/10 bg-zinc-950/50 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-white">{step.label}</p>
                  <p className="text-sm text-zinc-500">{step.count.toLocaleString()} users</p>
                </div>
                {next ? (
                  <span className="text-sm font-medium text-purple-300">
                    −{step.dropOffToNext}% →
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
