'use client'

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
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
  type ChartConfig,
} from '@/components/ui/chart'

type Point = {
  age: number
  year: number
  balance: number
  contributions: number
}

const config: ChartConfig = {
  balance: { label: 'צבירה צפויה', color: 'var(--chart-1)' },
  contributions: { label: 'סך ההפקדות', color: 'var(--chart-2)' },
}

function shekel(n: number) {
  if (n >= 1_000_000) return `₪${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1000) return `₪${Math.round(n / 1000)}K`
  return `₪${n}`
}

export function PensionProjectionChart({
  points,
  finalBalance,
  monthlyPension,
}: {
  points: Point[]
  finalBalance: number
  monthlyPension: number
}) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">תחזית הפנסיה העתידית</CardTitle>
        <CardDescription>
          צבירה צפויה עד גיל הפרישה לפי ההנחות שהזנת
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-6">
          <div>
            <p className="text-xs text-muted-foreground">צבירה צפויה בפרישה</p>
            <p className="font-mono text-xl font-semibold text-foreground">
              ₪{finalBalance.toLocaleString('he-IL')}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">קצבה חודשית משוערת</p>
            <p className="font-mono text-xl font-semibold text-primary">
              ₪{monthlyPension.toLocaleString('he-IL')}
            </p>
          </div>
        </div>
        <ChartContainer config={config} className="h-[260px] w-full">
          <AreaChart data={points} margin={{ left: 4, right: 4, top: 8 }}>
            <defs>
              <linearGradient id="fillBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-balance)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--color-balance)" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="fillContrib" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-contributions)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-contributions)" stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="age"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(v) => `גיל ${v}`}
              reversed
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={48}
              tickFormatter={(v) => shekel(Number(v))}
              orientation="right"
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => {
                    const p = payload?.[0]?.payload as Point | undefined
                    return p ? `גיל ${p.age} · ${p.year}` : ''
                  }}
                  formatter={(value, name) => (
                    <div className="flex w-full items-center justify-between gap-3">
                      <span className="text-muted-foreground">
                        {config[name as keyof typeof config]?.label ?? name}
                      </span>
                      <span className="font-mono font-medium">
                        ₪{Number(value).toLocaleString('he-IL')}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Area
              dataKey="contributions"
              type="monotone"
              fill="url(#fillContrib)"
              stroke="var(--color-contributions)"
              strokeWidth={2}
            />
            <Area
              dataKey="balance"
              type="monotone"
              fill="url(#fillBalance)"
              stroke="var(--color-balance)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
