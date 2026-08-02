'use client'

import { Pie, PieChart, Cell } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart'

type Slice = { label: string; value: number }

const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
]

export function PensionPieChart({
  title,
  slices,
}: {
  title: string
  slices: Slice[]
}) {
  const data = slices.map((s, i) => ({
    name: s.label,
    value: s.value,
    fill: COLORS[i % COLORS.length],
  }))

  const config: ChartConfig = Object.fromEntries(
    slices.map((s, i) => [
      s.label,
      { label: s.label, color: COLORS[i % COLORS.length] },
    ])
  )

  const total = slices.reduce((sum, s) => sum + s.value, 0)

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>פילוח המצב הפנסיוני הנוכחי</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="mx-auto aspect-square max-h-[280px]">
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name) => (
                    <div className="flex w-full items-center justify-between gap-3">
                      <span className="text-muted-foreground">{name}</span>
                      <span className="font-mono font-medium">
                        {Number(value).toLocaleString('he-IL')}
                        {total > 0
                          ? ` (${Math.round((Number(value) / total) * 100)}%)`
                          : ''}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              strokeWidth={2}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="name" />}
              className="flex-wrap gap-x-4 gap-y-1"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
