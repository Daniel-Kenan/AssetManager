"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "Individual and team contributions chart"

const chartData = [
    { date: "2024-04-01", individual: 5, team: 20 },
    { date: "2024-04-02", individual: 3, team: 18 },
    { date: "2024-04-03", individual: 7, team: 25 },
    { date: "2024-04-04", individual: 6, team: 22 },
    { date: "2024-04-05", individual: 8, team: 30 },
    { date: "2024-04-06", individual: 4, team: 24 },
    { date: "2024-04-07", individual: 5, team: 20 },
    { date: "2024-04-08", individual: 6, team: 28 },
    { date: "2024-04-09", individual: 3, team: 18 },
    { date: "2024-04-10", individual: 7, team: 26 },
    { date: "2024-05-01", individual: 10, team: 35 },
    { date: "2024-05-02", individual: 9, team: 30 },
    { date: "2024-05-03", individual: 8, team: 28 },
    { date: "2024-05-04", individual: 7, team: 32 },
    { date: "2024-05-05", individual: 11, team: 40 },
    { date: "2024-05-06", individual: 5, team: 22 },
    { date: "2024-05-07", individual: 6, team: 25 },
    { date: "2024-05-08", individual: 8, team: 27 },
    { date: "2024-05-09", individual: 7, team: 26 },
    { date: "2024-05-10", individual: 9, team: 30 },
    { date: "2024-06-01", individual: 12, team: 40 },
    { date: "2024-06-02", individual: 8, team: 35 },
    { date: "2024-06-03", individual: 7, team: 32 },
    { date: "2024-06-04", individual: 9, team: 38 },
    { date: "2024-06-05", individual: 10, team: 42 },
    { date: "2024-06-06", individual: 6, team: 28 },
    { date: "2024-06-07", individual: 8, team: 30 },
    { date: "2024-06-08", individual: 9, team: 35 },
    { date: "2024-06-09", individual: 7, team: 33 },
    { date: "2024-06-10", individual: 11, team: 45 },
  ];
  
const chartConfig = {
  individual: {
    label: "Individual Contribution",
    color: "hsl(var(--chart-1))",
  },
  team: {
    label: "Team Contribution",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function Component() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("individual")

  const total = React.useMemo(
    () => ({
      individual: chartData.reduce((acc, curr) => acc + curr.individual, 0),
      team: chartData.reduce((acc, curr) => acc + curr.team, 0),
    }),
    []
  )

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Contributions Overview</CardTitle>
          <CardDescription>
            Showing individual and team contributions over the last 3 months
          </CardDescription>
        </div>
        <div className="flex">
          {["individual", "team"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
