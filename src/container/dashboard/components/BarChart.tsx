"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { useMemo } from "react";

export const description = "A bar chart";

const chartConfig = {
  users: {
    label: "Users Added",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ChartBarDefault({ data: users }: any) {
  const chartData = useMemo(() => {
    const today = new Date();
    const last7Days: { day: string; users: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const day = d.toLocaleDateString("en-US", { weekday: "short" });
      last7Days.push({ day, users: 0 });
    }

    //------------------ Count users per day
    users.forEach((user) => {
      const created = new Date(user.createdAt);
      const day = created.toLocaleDateString("en-US", { weekday: "short" });

      const match = last7Days.find((d) => d.day === day);
      if (match) {
        match.users += 1;
      }
    });

    return last7Days;
  }, [users]);

  const todayCount = chartData[6]?.users ?? 0;
  const yesterdayCount = chartData[5]?.users ?? 0;

  let trend = 0;
  if (yesterdayCount === 0 && todayCount > 0) {
    trend = 100;
  } else if (yesterdayCount > 0) {
    trend = ((todayCount - yesterdayCount) / yesterdayCount) * 100;
  }

  const isUp = trend >= 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users Joined</CardTitle>
        <CardDescription>Last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            
            <Bar dataKey="users" fill="var(--color-users)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div
          className={`flex gap-2 leading-none font-medium ${
            isUp ? "text-green-600" : "text-red-600"
          }`}
        >
          {isUp ? "Trending up" : "Trending down"} by{" "}
          {Math.abs(trend).toFixed(1)}% today{" "}
          {isUp ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
        </div>
        <div className="text-muted-foreground leading-none">
          Showing daily registrations for the last 7 days
        </div>
      </CardFooter>
    </Card>
  );
}
