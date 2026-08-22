import { createOpenRouter } from '@openrouter/ai-sdk-provider'

const openRouterApiKey =
  process.env.OPENROUTER_API_KEY_2 ||
  process.env.OPENROUTER_API_KEY_2_2 ||
  process.env.OPENROUTER_API_KEY

if (!openRouterApiKey) {
  throw new Error(
    'OpenRouter is not configured. Set OPENROUTER_API_KEY_2 or OPENROUTER_API_KEY_2_2.',
  )
}

export const openrouter = createOpenRouter({
  apiKey: openRouterApiKey,
})

// Main reasoning model that powers the pension agent.
// Using Gemma 4 26B A4B (free tier on OpenRouter)
export const brain = openrouter.languageModel('google/gemma-4-26b-a4b-it:free')

// Web search model for fetching pension company information.
export const webModel = openrouter.languageModel('google/gemma-4-26b-a4b-it:free')
