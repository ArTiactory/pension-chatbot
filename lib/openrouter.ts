import { createOpenRouter } from '@openrouter/ai-sdk-provider'

export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY_2,
})

// Main reasoning model that powers the pension agent.
export const brain = openrouter.chat('openai/gpt-oss-120b:free')

// Web-enabled model for live company comparison (Perplexity Sonar via OpenRouter).
export const webModel = openrouter.chat('perplexity/sonar')
