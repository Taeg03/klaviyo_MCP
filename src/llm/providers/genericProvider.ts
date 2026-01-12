import axios from 'axios';
import { LLMProvider } from './types';
import { ENV } from '../../config/env';

/**
 * Generic Provider: Connects to any REST endpoint (e.g., LM Studio, VLLM)
 * expecting a compatible chat/completions format or similar.
 * 
 * NOTE: For simplicity, this assumes an OpenAI-compatible /v1/chat/completions schema,
 * which many local runners (LM Studio, LocalAI) support.
 */
export class GenericProvider implements LLMProvider {
    private apiUrl: string;

    constructor() {
        this.apiUrl = ENV.LLM_API_URL || 'http://localhost:1234/v1/chat/completions';
    }

    async getToolCall(query: string): Promise<{ tool: string; input: any }> {
        const systemPrompt = this.getSystemPrompt();

        const payload = {
            model: ENV.OLLAMA_MODEL, // Or passed via env
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: query }
            ],
            temperature: 0
        };

        try {
            console.log(`[GenericProvider] POST ${this.apiUrl}`);
            const response = await axios.post(this.apiUrl, payload);

            // Adjust based on actual API response structure. 
            // Assuming OpenAI-like: choices[0].message.content
            const content = response.data?.choices?.[0]?.message?.content ||
                response.data?.message?.content; // fallback

            if (!content) throw new Error("Empty response from LLM API");

            return this.parseJson(content);

        } catch (error: any) {
            console.error("[GenericProvider] Error:", error.message);
            throw error;
        }
    }

    private parseJson(content: string): { tool: string; input: any } {
        const cleanJson = content.replace(/```json/g, '').replace(/```/g, '').trim();
        try {
            const parsed = JSON.parse(cleanJson);
            if (!parsed.tool || !parsed.input) throw new Error("Missing tool/input");
            return parsed;
        } catch (e) {
            throw new Error(`Failed to parse JSON: ${(e as Error).message}`);
        }
    }

    private getSystemPrompt(): string {
        // Reuse the logic/prompt from existing system
        return `
You are a tool routing assistant. Choose ONE tool.
Available tools:
1) get_top_customers { region?, limit }
2) get_segment_summary { category?, minDaysSinceOrder? }
3) create_campaign_draft { segmentDescription, goal, channel, personalize?, maxCustomers? }

OUTPUT ONLY JSON: { "tool": "...", "input": { ... } }
`;
    }
}
