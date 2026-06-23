"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/shared/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui";
import { apiFetch } from "@/shared/api/client";
import { routes } from "@/shared/lib/routes";

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
  const router = useRouter();
  const [overview, setOverview] = useState<Overview | null>(null);
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [attribution, setAttribution] = useState<Attribution[]>([]);

  useEffect(() => {
    Promise.all([
      apiFetch<Overview>(routes.api.analyticsOverview),
      apiFetch<Conversion[]>(routes.api.analyticsConversions),
      apiFetch<Attribution[]>(routes.api.analyticsAttribution),
    ])
      .then(([overviewData, conversionData, attributionData]) => {
        setOverview(overviewData);
        setConversions(conversionData);
        setAttribution(attributionData);
      })
      .catch((error) => {
        console.error(error);
        router.replace(routes.dashboardLogin);
      });
  }, [router]);

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
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white">Analytics Dashboard</h1>
          <p className="mt-2 text-zinc-400">Funnel performance and attribution overview</p>
        </div>
        <form action={routes.api.dashboardLogout} method="GET">
          <Button variant="outline" size="icon" type="submit" aria-label="Admin logout">
            <LogOut className="size-5" />
          </Button>
        </form>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label} className="bg-zinc-900/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">{card.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-300">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-zinc-900/80">
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

      <Card className="bg-zinc-900/80">
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
