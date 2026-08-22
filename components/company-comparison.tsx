'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Building2, Sparkles, Star, Tag } from 'lucide-react'

type Provider = {
  id: string
  name: string
  depositFee: number
  accumulationFee: number
  originalDepositFee: number
  originalAccumulationFee: number
  serviceRating: number
  notes?: string
}

type Compare = {
  focus: string
  includesDiscount: boolean
  providers: Provider[]
}

export function CompanyComparison({ data }: { data: Compare }) {
  const { includesDiscount, providers } = data || {}

  if (!providers || providers.length === 0) {
    return null
  }

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Building2 className="size-5 text-primary" />
            <CardTitle className="text-base font-semibold">
              {includesDiscount
                ? 'הצעות מחיר מוזלות לאחר מיקוח'
                : 'השוואת תעריפי פנסיה בישראל'}
            </CardTitle>
          </div>
          {includesDiscount ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Tag className="size-3" />
              תעריף מיוחד לאחר מיקוח
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
              תעריף שוק סטנדרטי
            </span>
          )}
        </div>
        <CardDescription className="text-xs">
          {includesDiscount
            ? 'הדמיית מו"מ ומיקוח מול חברות הפנסיה המובילות'
            : 'נתוני שוק מעודכנים מול חברות הפנסיה המובילות'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2.5">
        <div className="grid gap-2.5 sm:grid-cols-2">
          {providers.map((p) => (
            <div
              key={p.id || p.name}
              className={`rounded-xl border p-3 transition-colors ${
                includesDiscount
                  ? 'border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/10'
                  : 'border-border/60 bg-card'
              }`}
            >
              <div className="flex items-center justify-between pb-1.5 border-b border-border/40">
                <span className="font-semibold text-sm text-foreground">{p.name}</span>
                <span className="inline-flex items-center gap-1 text-xs text-amber-500 font-medium">
                  <Star className="size-3 fill-amber-500" />
                  {p.serviceRating}
                </span>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[11px]">דמי ניהול מהפקדה:</span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="font-bold text-foreground">{p.depositFee}%</span>
                    {includesDiscount && p.originalDepositFee > p.depositFee && (
                      <span className="text-[10px] text-muted-foreground line-through">
                        {p.originalDepositFee}%
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[11px]">דמי ניהול מצבירה:</span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="font-bold text-foreground">{p.accumulationFee}%</span>
                    {includesDiscount && p.originalAccumulationFee > p.accumulationFee && (
                      <span className="text-[10px] text-muted-foreground line-through">
                        {p.originalAccumulationFee}%
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {includesDiscount && p.notes && (
                <p className="mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium border-t border-emerald-500/20 pt-1.5 flex items-center gap-1">
                  <Sparkles className="size-3 shrink-0" />
                  {p.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
