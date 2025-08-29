"use client";

import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A pie chart with categories and available units";

export function ChartPieLegend({ data }: any) {
  console.log(data, "productsData");

  // -------- Group by category and sum availableQuantity-------
  const categoryMap: Record<string, number> = {};
  data?.forEach((product: any) => {
    if (!categoryMap[product.category]) {
      categoryMap[product.category] = 0;
    }
    categoryMap[product.category] += product.availableQuantity;
  });

  // ------- Define a color palette -------
  const palette = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ];

  // ----- Convert to recharts-friendly chartData--------
  const chartData = Object.entries(categoryMap).map(
    ([category, units], index) => ({
      category,
      units,
      fill: palette[index % palette.length],
    })
  );

  // ------- Build chartConfig for legends---------
  const chartConfig: ChartConfig = {
    units: { label: "Available Units" },
    ...Object.fromEntries(
      chartData.map((item) => [
        item.category,
        { label: item.category, color: item.fill },
      ])
    ),
  };

  console.log(chartData, "chartData");

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Products by Category</CardTitle>
        <CardDescription>Available stock grouped by category</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <Pie data={chartData} dataKey="units" label nameKey="category" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend
              content={<ChartLegendContent nameKey="category" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
