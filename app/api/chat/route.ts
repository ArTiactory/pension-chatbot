import {
  streamText,
  convertToModelMessages,
  tool,
  stepCountIs,
  type UIMessage,
} from 'ai'
import { z } from 'zod'
import { SYSTEM_PROMPT, PENSION_MOCK_DATA } from '@/lib/pension'
import { brain } from '@/lib/openrouter'

export const maxDuration = 60

// ----- Helpers -------------------------------------------------------------

function buildProjection(opts: {
  currentAge: number
  retirementAge: number
  startingBalance: number
  segments: { fromAge: number; toAge: number; monthlySalary: number }[]
  contributionRate: number // fraction of salary saved to pension, e.g. 0.185
  annualReturn: number // real annual return fraction, e.g. 0.04
}) {
  const {
    currentAge,
    retirementAge,
    startingBalance,
    segments,
    contributionRate,
    annualReturn,
  } = opts

  const salaryAt = (age: number) => {
    const seg = segments.find((s) => age >= s.fromAge && age < s.toAge)
    if (seg) return seg.monthlySalary
    return segments.length ? segments[segments.length - 1].monthlySalary : 0
  }

  const points: {
    age: number
    year: number
    balance: number
    contributions: number
  }[] = []
  const baseYear = new Date().getFullYear()
  let balance = startingBalance
  let contributions = 0

  points.push({
    age: currentAge,
    year: baseYear,
    balance: Math.round(balance),
    contributions: Math.round(contributions),
  })

  for (let age = currentAge; age < retirementAge; age++) {
    const annualContribution = salaryAt(age) * 12 * contributionRate
    balance = balance * (1 + annualReturn) + annualContribution
    contributions += annualContribution
    points.push({
      age: age + 1,
      year: baseYear + (age + 1 - currentAge),
      balance: Math.round(balance),
      contributions: Math.round(contributions),
    })
  }

  const conversionFactor = 200 // typical annuity factor
  const monthlyPension = Math.round(balance / conversionFactor)

  return { points, finalBalance: Math.round(balance), monthlyPension }
}

// ----- Tools ---------------------------------------------------------------

const tools = {
  analyzePosition: tool({
    description:
      'מסכם את מצב הפנסיה של המשתמש ביחס לגילו ומחזיר אבני דרך מספריות. השתמש כשיש מספיק נתונים (גיל, שכר, צבירה, דמי ניהול).',
    inputSchema: z.object({
      age: z.number().describe('גיל נוכחי'),
      retirementAge: z.number().describe('גיל פרישה מתוכנן'),
      monthlySalary: z.number().describe('שכר חודשי ברוטו בש"ח'),
      currentBalance: z.number().describe('יתרה צבורה נוכחית בש"ח'),
      managementFeeDeposit: z
        .number()
        .describe('דמי ניהול מהפקדה באחוזים, למשל 4 עבור 4%'),
      managementFeeBalance: z
        .number()
        .describe('דמי ניהול מצבירה באחוזים לשנה, למשל 0.3'),
      fundName: z.string().nullable().describe('שם קרן/חברת הפנסיה אם ידוע'),
    }),
    execute: async (input) => {
      const yearsToRetirement = Math.max(0, input.retirementAge - input.age)
      const benchmark = { deposit: 1.5, balance: 0.15 }
      const feeVerdict =
        input.managementFeeDeposit > 3 || input.managementFeeBalance > 0.25
          ? 'גבוהים'
          : input.managementFeeDeposit > 2 || input.managementFeeBalance > 0.2
            ? 'בינוניים'
            : 'תחרותיים'
      return {
        ...input,
        yearsToRetirement,
        benchmarkFees: benchmark,
        feeVerdict,
        expectedAnnualContribution: Math.round(
          input.monthlySalary * 12 * 0.185
        ),
      }
    },
  }),

  currentBreakdown: tool({
    description:
      'מחזיר נתונים לגרף עוגה של פילוח המצב הפנסיוני הנוכחי של המשתמש (רכיבי החיסכון/הפקדה). השתמש כדי להמחיש את ההרכב הנוכחי.',
    inputSchema: z.object({
      slices: z
        .array(
          z.object({
            label: z.string().describe('שם הרכיב, למשל "תגמולי עובד"'),
            value: z.number().describe('ערך בש"ח או באחוזים'),
          })
        )
        .describe(
          'רכיבי הפילוח, למשל תגמולי עובד, תגמולי מעסיק, פיצויים, רכיב ביטוחי, דמי ניהול'
        ),
      title: z.string().describe('כותרת הגרף'),
    }),
    execute: async (input) => input,
  }),

  projectFuture: tool({
    description:
      'בונה תחזית צבירה עתידית עד גיל הפרישה לפי הנחות שכר בתקופות שונות ותשואה משוערת, ומחזיר נקודות לגרף קו/שטח. בקש מהמשתמש הנחות שכר לפי תקופות לפני השימוש.',
    inputSchema: z.object({
      currentAge: z.number(),
      retirementAge: z.number(),
      startingBalance: z.number().describe('יתרה צבורה נוכחית בש"ח'),
      contributionRatePercent: z
        .number()
        .describe('אחוז ההפרשה הכולל מהשכר, ברירת מחדל 18.5'),
      annualReturnPercent: z
        .number()
        .describe('תשואה ריאלית שנתית משוערת באחוזים, למשל 4'),
      salarySegments: z
        .array(
          z.object({
            fromAge: z.number(),
            toAge: z.number(),
            monthlySalary: z.number().describe('שכר חודשי ברוטו בתקופה'),
          })
        )
        .describe('הנחות שכר לפי תקופות גיל עד גיל הפרישה'),
    }),
    execute: async (input) => {
      const result = buildProjection({
        currentAge: input.currentAge,
        retirementAge: input.retirementAge,
        startingBalance: input.startingBalance,
        segments: input.salarySegments,
        contributionRate: input.contributionRatePercent / 100,
        annualReturn: input.annualReturnPercent / 100,
      })
      return {
        points: result.points,
        finalBalance: result.finalBalance,
        monthlyPension: result.monthlyPension,
        assumptions: {
          contributionRatePercent: input.contributionRatePercent,
          annualReturnPercent: input.annualReturnPercent,
        },
      }
    },
  }),

  comparePensionCompanies: tool({
    description:
      'פונה לחברות הפנסיה בישראל ומחזיר השוואת תעריפים. הפעל עם includesDiscount: true אך ורק אם המשתמש ביקש הנחה/מיקוח במפורש.',
    inputSchema: z.object({
      focus: z
        .string()
        .optional()
        .describe('דגש ההשוואה'),
      includesDiscount: z
        .boolean()
        .default(false)
        .describe(
          'True אך ורק אם המשתמש ביקש במפורש הנחה או מיקוח. אחרת False.'
        ),
    }),
    execute: async ({ focus, includesDiscount }) => {
      // Simulate real-time interaction delay with Israeli pension companies (~8 seconds)
      await new Promise((resolve) => setTimeout(resolve, 8000))

      const providers = PENSION_MOCK_DATA.providers.map((p) => ({
        id: p.id,
        name: p.name,
        depositFee: includesDiscount ? p.discountedDepositFee : p.standardDepositFee,
        accumulationFee: includesDiscount ? p.discountedAccumulationFee : p.standardAccumulationFee,
        originalDepositFee: p.standardDepositFee,
        originalAccumulationFee: p.standardAccumulationFee,
        serviceRating: p.serviceRating,
        notes: includesDiscount ? p.notes : undefined,
      }))

      return {
        focus: focus || (includesDiscount ? 'הנחות ומיקוח מול חברות הפנסיה' : 'השוואת מחירי שוק סטנדרטיים'),
        includesDiscount: Boolean(includesDiscount),
        providers,
      }
    },
  }),
}

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json()

    let modelMessages
    try {
      modelMessages = await convertToModelMessages(messages)
    } catch {
      modelMessages = messages.map((m: any) => ({
        role: m.role,
        content:
          typeof m.content === 'string'
            ? m.content
            : Array.isArray(m.parts)
              ? m.parts.map((p: any) => p.text || '').join('')
              : '',
      }))
    }

    const result = streamText({
      model: brain,
      system: SYSTEM_PROMPT,
      messages: modelMessages,
      tools,
      maxTokens: 2000,
      stopWhen: stepCountIs(8),
    })

    return result.toUIMessageStreamResponse({
      onError: (error) => {
        const errorMsg = error instanceof Error ? error.message : JSON.stringify(error)
        console.error('[v0] OpenRouter stream error:', errorMsg)
        return `OpenRouter Error: ${errorMsg}`
      },
    })
  } catch (err: any) {
    console.error('API Chat Route Error:', err)
    return new Response(
      JSON.stringify({ error: err?.message || String(err) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
