import { createOpenRouter } from '@openrouter/ai-sdk-provider'

const openRouterApiKey =
  process.env.OPENROUTER_API_KEY_2 ?? process.env.OPENROUTER_API_KEY

if (!openRouterApiKey) {
  throw new Error(
    'OpenRouter is not configured. Set OPENROUTER_API_KEY_2 or OPENROUTER_API_KEY.',
  )
}

export const openrouter = createOpenRouter({
  apiKey: openRouterApiKey,
})

// Main reasoning model that powers the pension agent.
// Using OpenAI GPT-OSS 20B (free tier on OpenRouter)
export const brain = openrouter.languageModel('openai/gpt-oss-20b:free')

// Web search model for fetching pension company information.
export const webModel = openrouter.languageModel('openai/gpt-oss-20b:free')
