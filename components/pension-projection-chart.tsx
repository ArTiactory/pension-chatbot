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
  balance: { label: 'צבירה צפויה', color: '#00f3ff' },
  contributions: { label: 'סך ההפקדות', color: '#ff00ea' },
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
    <Card className="border border-border/80 bg-card text-card-foreground shadow-sm">
      <CardHeader className="pb-2 border-b border-border/40">
        <CardTitle className="text-base font-extrabold">תחזית הפנסיה העתידית</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          צבירה צפויה עד גיל הפרישה לפי ההנחות שהזנת
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="mb-4 flex flex-wrap gap-6">
          <div>
            <p className="text-xs text-muted-foreground font-bold">צבירה צפויה בפרישה</p>
            <p className="font-mono text-xl font-extrabold text-[#00f3ff] drop-shadow-[0_0_8px_rgba(0,243,255,0.4)]">
              ₪{finalBalance.toLocaleString('he-IL')}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-bold">קצבה חודשית משוערת</p>
            <p className="font-mono text-xl font-extrabold text-[#ff00ea] drop-shadow-[0_0_8px_rgba(255,0,234,0.4)]">
              ₪{monthlyPension.toLocaleString('he-IL')}
            </p>
          </div>
        </div>
        <ChartContainer config={config} className="h-[260px] w-full">
          <AreaChart data={points} margin={{ left: 4, right: 4, top: 8 }}>
            <defs>
              <linearGradient id="fillBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#00f3ff" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="fillContrib" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff00ea" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ff00ea" stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="age"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12, fontWeight: 700 }}
              tickFormatter={(v) => `גיל ${v}`}
              reversed
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={48}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12, fontWeight: 700 }}
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
                      <span className="text-muted-foreground font-bold">
                        {config[name as keyof typeof config]?.label ?? name}
                      </span>
                      <span className="font-mono font-extrabold text-foreground">
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
              stroke="#ff00ea"
              strokeWidth={2.5}
            />
            <Area
              dataKey="balance"
              type="monotone"
              fill="url(#fillBalance)"
              stroke="#00f3ff"
              strokeWidth={2.5}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
