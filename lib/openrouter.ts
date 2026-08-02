import { createOpenRouter } from '@openrouter/ai-sdk-provider'

export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY_2,
})

// Main reasoning model that powers the pension agent.
// Using OpenAI GPT-OSS 20B (free tier on OpenRouter)
export const brain = openrouter.languageModel('openai/gpt-oss-20b:free')

// Web search model for fetching pension company information.
export const webModel = openrouter.languageModel('openai/gpt-oss-20b:free')
