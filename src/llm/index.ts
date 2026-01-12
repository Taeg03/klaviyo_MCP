import { ENV } from '../config/env';
import { LLMProvider } from './providers/types';
import { OllamaProvider } from './providers/ollamaProvider';
import { OpenAIProvider } from './providers/openaiProvider';
import { GenericProvider } from './providers/genericProvider';

let currentProvider: LLMProvider | null = null;

function getProvider(): LLMProvider {
    if (currentProvider) return currentProvider;

    const providerName = ENV.LLM_PROVIDER.toLowerCase();

    console.log(`[LLM Factory] Initializing provider: ${providerName}`);

    switch (providerName) {
        case 'openai':
            currentProvider = new OpenAIProvider();
            break;
        case 'http':
        case 'generic':
            currentProvider = new GenericProvider();
            break;
        case 'ollama':
        default:
            currentProvider = new OllamaProvider();
            break;
    }

    return currentProvider;
}

/**
 * Main entry point for LLM interactions.
 * Delegates to the configured provider.
 */
export async function getToolCallFromLLM(query: string): Promise<{ tool: string; input: any }> {
    const provider = getProvider();
    return provider.getToolCall(query);
}
