"use client"

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"

export default function TaskProgressChart() {
  return (
    <Card className="max-w-xs">
      <CardHeader>
        <CardTitle>Task Progress</CardTitle>
        <CardDescription>
          A comparison of tasks assigned and to-do for this year and last year.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid auto-rows-min gap-2">
          <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
            28
            <span className="text-sm font-normal text-muted-foreground">
              tasks assigned
            </span>
          </div>
          <ChartContainer
            config={{
              assigned: {
                label: "Tasks Assigned",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="aspect-auto h-[32px] w-full"
          >
            <BarChart
              accessibilityLayer
              layout="vertical"
              margin={{
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
              }}
              data={[
                {
                  year: "2024",
                  assigned: 28,
                },
              ]}
            >
              <Bar
                dataKey="assigned"
                fill="var(--color-assigned)"
                radius={4}
                barSize={32}
              >
                <LabelList
                  position="insideLeft"
                  dataKey="year"
                  offset={8}
                  fontSize={12}
                  fill="white"
                />
              </Bar>
              <YAxis dataKey="year" type="category" tickCount={1} hide />
              <XAxis dataKey="assigned" type="number" hide />
            </BarChart>
          </ChartContainer>
        </div>
        <div className="grid auto-rows-min gap-2">
          <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
            15
            <span className="text-sm font-normal text-muted-foreground">
              tasks to do
            </span>
          </div>
          <ChartContainer
            config={{
              toDo: {
                label: "Tasks To Do",
                color: "hsl(var(--muted))",
              },
            }}
            className="aspect-auto h-[32px] w-full"
          >
            <BarChart
              accessibilityLayer
              layout="vertical"
              margin={{
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
              }}
              data={[
                {
                  year: "2023",
                  toDo: 15,
                },
              ]}
            >
              <Bar
                dataKey="toDo"
                fill="var(--color-toDo)"
                radius={4}
                barSize={32}
              >
                <LabelList
                  position="insideLeft"
                  dataKey="year"
                  offset={8}
                  fontSize={12}
                  fill="hsl(var(--muted-foreground))"
                />
              </Bar>
              <YAxis dataKey="year" type="category" tickCount={1} hide />
              <XAxis dataKey="toDo" type="number" hide />
            </BarChart>
          </ChartContainer>
        </div>
        <div className="grid auto-rows-min gap-2">
          <div className="text-sm font-normal text-muted-foreground">
            Notes: Keep track of the progress on tasks assigned and upcoming to-do items.
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
