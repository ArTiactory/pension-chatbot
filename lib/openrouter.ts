import { createOpenRouter } from '@openrouter/ai-sdk-provider'

export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY_2,
})

// Main reasoning model that powers the pension agent.
// Using OpenAI GPT-4 Turbo for strong reasoning and Hebrew support
export const brain = openrouter.languageModel('openai/gpt-4-turbo')

// Web search model for fetching pension company information.
export const webModel = openrouter.languageModel('openai/gpt-4-turbo')
