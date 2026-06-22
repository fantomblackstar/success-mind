"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiFetch } from "@/shared/api/client";

type Overview = {
  entered: number;
  quizComplete: number;
  emailCapture: number;
  paywallView: number;
  buyClick: number;
  earlyAccess: number;
  totalUsers: number;
};

type Conversion = {
  label: string;
  fromCount: number;
  toCount: number;
  rate: number;
};

type Attribution = {
  email: string;
  name: string;
  firstTouchSource: string;
  lastTouchSource: string;
  lastTouchAt: string;
};

export function DashboardScreen() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [attribution, setAttribution] = useState<Attribution[]>([]);

  useEffect(() => {
    Promise.all([
      apiFetch<Overview>("/api/analytics/overview"),
      apiFetch<Conversion[]>("/api/analytics/conversions"),
      apiFetch<Attribution[]>("/api/analytics/attribution"),
    ])
      .then(([overviewData, conversionData, attributionData]) => {
        setOverview(overviewData);
        setConversions(conversionData);
        setAttribution(attributionData);
      })
      .catch(console.error);
  }, []);

  const cards = overview
    ? [
        { label: "Entered funnel", value: overview.entered },
        { label: "Completed quiz", value: overview.quizComplete },
        { label: "Email captured", value: overview.emailCapture },
        { label: "Paywall views", value: overview.paywallView },
        { label: "Buy clicks", value: overview.buyClick },
        { label: "Early access views", value: overview.earlyAccess },
        { label: "Total users", value: overview.totalUsers },
      ]
    : [];

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <div>
        <h1 className="text-3xl font-semibold text-white">Analytics Dashboard</h1>
        <p className="mt-2 text-zinc-400">Funnel performance and attribution overview</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label} className="border-white/10 bg-zinc-900/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">{card.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-300">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-white/10 bg-zinc-900/80">
        <CardHeader>
          <CardTitle className="text-white">Step conversions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Step</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {conversions.map((row) => (
                <TableRow key={row.label}>
                  <TableCell>{row.label}</TableCell>
                  <TableCell>{row.fromCount}</TableCell>
                  <TableCell>{row.toCount}</TableCell>
                  <TableCell>{row.rate}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-zinc-900/80">
        <CardHeader>
          <CardTitle className="text-white">First touch / Last touch attribution</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>First touch</TableHead>
                <TableHead>Last touch</TableHead>
                <TableHead>Last visit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attribution.map((row) => (
                <TableRow key={row.email}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.firstTouchSource}</TableCell>
                  <TableCell>{row.lastTouchSource}</TableCell>
                  <TableCell>{new Date(row.lastTouchAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
