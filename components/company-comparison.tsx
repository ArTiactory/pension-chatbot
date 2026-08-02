'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Globe } from 'lucide-react'

type Compare = {
  focus: string
  summary: string
  sources: { url: string; title: string }[]
}

export function CompanyComparison({ data }: { data: Compare }) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Globe className="size-4 text-accent" />
          <CardTitle className="text-base">השוואת קרנות פנסיה</CardTitle>
        </div>
        <CardDescription>
          חיפוש חי באינטרנט · דגש: {data.focus}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
          {data.summary}
        </p>
        {data.sources.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2 border-t border-border/60 pt-3">
            {data.sources.slice(0, 6).map((s, i) => (
              <a
                key={`${s.url}-${i}`}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex max-w-[200px] items-center gap-1 truncate rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <Globe className="size-3 shrink-0" />
                <span className="truncate">{s.title || s.url}</span>
              </a>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
