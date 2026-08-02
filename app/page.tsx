import { PensionChat } from '@/components/pension-chat'
import { ThemeToggle } from '@/components/theme-toggle'
import { ShieldCheck, TrendingUp, Search, PieChart } from 'lucide-react'

const FEATURES = [
  { icon: PieChart, label: 'ניתוח מצב פנסיוני' },
  { icon: TrendingUp, label: 'תחזית עתידית' },
  { icon: Search, label: 'השוואת קרנות' },
]

export default function Page() {
  return (
    <main className="flex h-dvh flex-col bg-background">
      <header className="border-b border-border/60 bg-card/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h1 className="text-sm font-semibold leading-tight text-foreground">
                יועץ הפנסיה החכם
              </h1>
              <p className="text-xs text-muted-foreground">
                ניתוח, אופטימיזציה והשוואת פנסיה — לפי חוקי ישראל
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <nav className="hidden items-center gap-1 sm:flex">
              {FEATURES.map((f) => (
                <span
                  key={f.label}
                  className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground"
                >
                  <f.icon className="size-3.5 text-primary" />
                  {f.label}
                </span>
              ))}
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="min-h-0 flex-1">
        <PensionChat />
      </div>
    </main>
  )
}
