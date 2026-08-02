'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarClock, Coins, PiggyBank, TrendingUp } from 'lucide-react'

type Analysis = {
  age: number
  retirementAge: number
  monthlySalary: number
  currentBalance: number
  managementFeeDeposit: number
  managementFeeBalance: number
  fundName: string | null
  yearsToRetirement: number
  benchmarkFees: { deposit: number; balance: number }
  feeVerdict: string
  expectedAnnualContribution: number
}

const feeBadge: Record<string, string> = {
  גבוהים: 'bg-destructive/15 text-destructive border-destructive/30',
  בינוניים: 'bg-chart-4/15 text-chart-4 border-chart-4/30',
  תחרותיים: 'bg-chart-3/15 text-chart-3 border-chart-3/30',
}

export function PositionSummary({ data }: { data: Analysis }) {
  const stats = [
    {
      icon: CalendarClock,
      label: 'שנים עד הפרישה',
      value: `${data.yearsToRetirement}`,
    },
    {
      icon: PiggyBank,
      label: 'יתרה צבורה',
      value: `₪${data.currentBalance.toLocaleString('he-IL')}`,
    },
    {
      icon: Coins,
      label: 'הפקדה שנתית צפויה',
      value: `₪${data.expectedAnnualContribution.toLocaleString('he-IL')}`,
    },
    {
      icon: TrendingUp,
      label: 'דמי ניהול מצבירה',
      value: `${data.managementFeeBalance}%`,
    },
  ]

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base">סיכום מצב פנסיוני</CardTitle>
            <CardDescription>
              {data.fundName ? data.fundName : 'הקרן שלך'} · גיל {data.age}
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className={feeBadge[data.feeVerdict] ?? ''}
          >
            דמי ניהול {data.feeVerdict}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-lg border border-border/60 bg-muted/40 p-3"
            >
              <s.icon className="mb-1.5 size-4 text-primary" />
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="font-mono text-sm font-semibold text-foreground">
                {s.value}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-lg bg-secondary/60 p-3 text-xs text-secondary-foreground leading-relaxed">
          דמי ניהול בקרנות ברירת מחדל נעים סביב{' '}
          <span className="font-mono">{data.benchmarkFees.deposit}%</span> מהפקדה
          ו-<span className="font-mono">{data.benchmarkFees.balance}%</span>{' '}
          מצבירה. דמי הניהול שלך:{' '}
          <span className="font-mono">{data.managementFeeDeposit}%</span> מהפקדה
          ו-<span className="font-mono">{data.managementFeeBalance}%</span>{' '}
          מצבירה.
        </div>
      </CardContent>
    </Card>
  )
}
