import { createOpenRouter } from '@openrouter/ai-sdk-provider'

export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY_2,
})

// Main reasoning model that powers the pension agent.
export const brain = openrouter.languageModel('openai/gpt-oss-120b:free')

// Web search model for fetching pension company information.
export const webModel = openrouter.languageModel('openai/gpt-oss-120b:free')
