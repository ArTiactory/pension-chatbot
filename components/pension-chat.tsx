'use client'

import { useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation'
import {
  Message,
  MessageContent,
  MessageResponse,
} from '@/components/ai-elements/message'
import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  PromptInputActionMenu,
  PromptInputActionMenuTrigger,
  PromptInputActionMenuContent,
  PromptInputActionAddAttachments,
  PromptInputSubmit,
  type PromptInputMessage,
} from '@/components/ai-elements/prompt-input'
import { PensionPieChart } from '@/components/pension-pie-chart'
import { PensionProjectionChart } from '@/components/pension-projection-chart'
import { PositionSummary } from '@/components/position-summary'
import { CompanyComparison } from '@/components/company-comparison'
import { ShieldCheck, Sparkles } from 'lucide-react'

const SUGGESTIONS = [
  'מה התנאים של קרנות הפנסיה בארץ',
  'תשיג לי הנחה',
  'אני בן 35, מרוויח 18,000 ש"ח וצברתי 220,000 ש"ח בדמי ניהול 2.5% מהפקדה ו-0.25% מצבירה. איפה אני עומד ביחס לשוק?',
  'בנה לי תחזית פנסיה עד גיל 67',
]

function Spinner() {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-cyan-400 font-mono font-bold">
      <span className="size-2 animate-bounce rounded-full bg-cyan-400 [animation-delay:-0.3s]" />
      <span className="size-2 animate-bounce rounded-full bg-cyan-400 [animation-delay:-0.15s]" />
      <span className="size-2 animate-bounce rounded-full bg-cyan-400" />
    </span>
  )
}

export function PensionChat() {
  const [input, setInput] = useState('')
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  })

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text?.trim())
    const hasFiles = Boolean(message.files?.length)
    if (!hasText && !hasFiles) return

    sendMessage({
      text: message.text || 'צירפתי קובץ דוח פנסיה, אנא נתח אותו.',
      files: message.files,
    })
    setInput('')
  }

  const isBusy = status === 'streaming' || status === 'submitted'

  return (
    <div className="flex h-full flex-col bg-background text-foreground">
      <Conversation className="flex-1">
        <ConversationContent className="mx-auto w-full max-w-3xl">
          {messages.length === 0 ? (
            <ConversationEmptyState
              className="h-full"
              icon={<ShieldCheck className="size-12 text-[#00f3ff] drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]" />}
              title="יועץ הפנסיה החכם"
              description="ספר לי על מצב הפנסיה שלך, או העלה דוח פנסיה (PDF / תמונה / טקסט), ואנתח את מצבך, אבנה תחזית ואמצא לך את הקרן המשתלמת ביותר."
            >
              <div className="mt-2 grid w-full max-w-xl gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => sendMessage({ text: s })}
                    className="rounded-lg border border-[rgba(0,243,255,0.3)] bg-[rgba(4,7,14,0.75)] p-3 text-right text-sm font-semibold text-[#e0faff] transition-all hover:border-[#00f3ff] hover:bg-[rgba(0,243,255,0.08)] hover:shadow-[0_0_15px_rgba(0,243,255,0.2)]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </ConversationEmptyState>
          ) : (
            messages.map((message) => {
              // Ensure Text & File parts appear FIRST (above), and Tool Components appear SECOND (below)!
              const textParts = message.parts.filter(
                (p) => p.type === 'text' || p.type === 'file'
              )
              const toolParts = message.parts.filter((p) =>
                p.type.startsWith('tool-')
              )
              const orderedParts = [...textParts, ...toolParts]

              return (
                <Message from={message.role} key={message.id}>
                  <MessageContent>
                    {orderedParts.map((part, i) => {
                      const key = `${message.id}-${i}`
                      switch (part.type) {
                        case 'text':
                          return (
                            <MessageResponse key={key}>
                              {part.text}
                            </MessageResponse>
                          )

                        case 'file':
                          if (part.mediaType?.startsWith('image/')) {
                            return (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                key={key}
                                src={part.url || '/placeholder.svg'}
                                alt={part.filename || 'קובץ מצורף'}
                                className="max-h-60 rounded-lg border border-[rgba(0,243,255,0.3)]"
                              />
                            )
                          }
                          return (
                            <div
                              key={key}
                              className="rounded-lg border border-[rgba(0,243,255,0.3)] bg-[rgba(0,243,255,0.05)] px-3 py-2 text-xs text-[#6b8a96]"
                            >
                              {part.filename || 'קובץ מצורף'}
                            </div>
                          )

                        case 'tool-analyzePosition':
                          if (part.state === 'output-available' && part.output) {
                            return (
                              <PositionSummary
                                key={key}
                                data={part.output as never}
                              />
                            )
                          }
                          return <Spinner key={key} />

                        case 'tool-currentBreakdown':
                          if (part.state === 'output-available' && part.output) {
                            const out = part.output as {
                              title: string
                              slices: { label: string; value: number }[]
                            }
                            return (
                              <PensionPieChart
                                key={key}
                                title={out.title}
                                slices={out.slices}
                              />
                            )
                          }
                          return <Spinner key={key} />

                        case 'tool-projectFuture':
                          if (part.state === 'output-available' && part.output) {
                            const out = part.output as {
                              points: never[]
                              finalBalance: number
                              monthlyPension: number
                            }
                            return (
                              <PensionProjectionChart
                                key={key}
                                points={out.points}
                                finalBalance={out.finalBalance}
                                monthlyPension={out.monthlyPension}
                              />
                            )
                          }
                          return <Spinner key={key} />

                        case 'tool-comparePensionCompanies':
                          if (part.state === 'output-available' && part.output) {
                            return (
                              <CompanyComparison
                                key={key}
                                data={part.output as never}
                              />
                            )
                          }
                          return (
                            <div
                              key={key}
                              className="flex items-center gap-2 text-sm text-[#00f3ff] font-semibold"
                            >
                              <Sparkles className="size-4 animate-pulse text-[#ff00ea]" />
                              פונה לחברות הפנסיה בישראל לקבלת הצעות מחיר...
                            </div>
                          )

                        default:
                          return null
                      }
                    })}
                  </MessageContent>
                </Message>
              )
            })
          )}
          {status === 'submitted' && (
            <Message from="assistant">
              <MessageContent>
                <Spinner />
              </MessageContent>
            </Message>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="mx-auto w-full max-w-3xl px-4 pb-4">
        <PromptInput
          onSubmit={handleSubmit}
          accept="image/*,application/pdf,text/plain"
          multiple
          globalDrop
          className="rounded-2xl border border-[rgba(0,243,255,0.3)] bg-[rgba(4,7,14,0.75)] backdrop-blur shadow-[0_0_20px_rgba(0,243,255,0.08)]"
        >
          <PromptInputBody>
            <PromptInputTextarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="כתוב הודעה או העלה דוח פנסיה..."
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              <PromptInputActionMenu>
                <PromptInputActionMenuTrigger />
                <PromptInputActionMenuContent>
                  <PromptInputActionAddAttachments label="העלאת דוח / תמונה / קובץ" />
                </PromptInputActionMenuContent>
              </PromptInputActionMenu>
            </PromptInputTools>
            <PromptInputSubmit
              status={status}
              disabled={isBusy && status !== 'streaming'}
            />
          </PromptInputFooter>
        </PromptInput>
        <p className="mt-2 text-center text-xs text-[#6b8a96]">
          המידע הוא להכוונה כללית בלבד בהתאם לחוקי הפנסיה בישראל ואינו תחליף לייעוץ
          פנסיוני מורשה.
        </p>
      </div>
    </div>
  )
}
