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
    <Card className="border-[rgba(0,243,255,0.3)] bg-[rgba(4,7,14,0.85)] text-[#e0faff] shadow-[0_0_25px_rgba(0,243,255,0.1)] backdrop-blur-md">
      <CardHeader className="pb-3 border-b border-[rgba(0,243,255,0.2)]">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Building2 className="size-5 text-[#00f3ff] drop-shadow-[0_0_8px_#00f3ff]" />
            <CardTitle className="text-base font-extrabold text-[#e0faff] tracking-wide">
              {includesDiscount
                ? 'הצעות מחיר מוזלות לאחר מיקוח'
                : 'השוואת תעריפי פנסיה בישראל'}
            </CardTitle>
          </div>
          {includesDiscount ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(255,0,234,0.15)] px-3 py-1 text-xs font-bold text-[#ff00ea] border border-[rgba(255,0,234,0.4)] shadow-[0_0_10px_rgba(255,0,234,0.2)]">
              <Tag className="size-3" />
              תעריף מיוחד לאחר מיקוח
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(0,243,255,0.1)] px-3 py-1 text-xs font-bold text-[#00f3ff] border border-[rgba(0,243,255,0.25)]">
              תעריף שוק סטנדרטי
            </span>
          )}
        </div>
        <CardDescription className="text-xs text-[#6b8a96] font-semibold">
          {includesDiscount
            ? 'תוצאות משא ומתן תחרותי מול חברות הפנסיה המובילות'
            : 'נתוני שוק מעודכנים מול חברות הפנסיה המובילות'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2.5 pt-4">
        <div className="grid gap-2.5 sm:grid-cols-2">
          {providers.map((p) => (
            <div
              key={p.id || p.name}
              className={`rounded-xl border p-3.5 transition-all ${
                includesDiscount
                  ? 'border-[rgba(255,0,234,0.35)] bg-[rgba(255,0,234,0.06)] shadow-[0_0_15px_rgba(255,0,234,0.1)]'
                  : 'border-[rgba(0,243,255,0.25)] bg-[rgba(0,243,255,0.03)]'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-[rgba(0,243,255,0.15)]">
                <span className="font-extrabold text-sm text-[#e0faff]">{p.name}</span>
                <span className="inline-flex items-center gap-1 text-xs text-amber-400 font-bold">
                  <Star className="size-3 fill-amber-400" />
                  {p.serviceRating}
                </span>
              </div>

              <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[#6b8a96] block text-[11px] font-bold">דמי ניהול מהפקדה:</span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="font-extrabold text-[#00f3ff] text-sm drop-shadow-[0_0_5px_rgba(0,243,255,0.4)]">
                      {p.depositFee}%
                    </span>
                    {includesDiscount && p.originalDepositFee > p.depositFee && (
                      <span className="text-[10px] text-[#6b8a96] line-through">
                        {p.originalDepositFee}%
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-[#6b8a96] block text-[11px] font-bold">דמי ניהול מצבירה:</span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="font-extrabold text-[#00f3ff] text-sm drop-shadow-[0_0_5px_rgba(0,243,255,0.4)]">
                      {p.accumulationFee}%
                    </span>
                    {includesDiscount && p.originalAccumulationFee > p.accumulationFee && (
                      <span className="text-[10px] text-[#6b8a96] line-through">
                        {p.originalAccumulationFee}%
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {includesDiscount && p.notes && (
                <p className="mt-2.5 text-[11px] text-[#ff00ea] font-bold border-t border-[rgba(255,0,234,0.2)] pt-2 flex items-center gap-1">
                  <Sparkles className="size-3 shrink-0 text-[#ff00ea]" />
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
