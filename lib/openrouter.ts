import { createOpenRouter } from '@openrouter/ai-sdk-provider'

export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY_2,
})

// Main reasoning model that powers the pension agent.
// Using Mistral 7B (free tier on OpenRouter)
export const brain = openrouter.languageModel('mistralai/mistral-7b-instruct:free')

// Web search model for fetching pension company information.
export const webModel = openrouter.languageModel('mistralai/mistral-7b-instruct:free')
