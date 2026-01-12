import axios from 'axios';
import { LLMProvider } from './types';
import { ENV } from '../../config/env';

export class OpenAIProvider implements LLMProvider {
    private apiKey: string;
    private model: string;

    constructor() {
        this.apiKey = ENV.OPENAI_API_KEY || '';
        this.model = ENV.OPENAI_MODEL || 'gpt-3.5-turbo';

        if (!this.apiKey) {
            console.warn("[OpenAIProvider] Warning: No OPENAI_API_KEY found in env.");
        }
    }

    async getToolCall(query: string): Promise<{ tool: string; input: any }> {
        if (!this.apiKey) {
            throw new Error("Missing OPENAI_API_KEY environment variable.");
        }

        const url = 'https://api.openai.com/v1/chat/completions';
        const payload = {
            model: this.model,
            messages: [
                { role: "system", content: this.getSystemPrompt() },
                { role: "user", content: query }
            ],
            temperature: 0
        };

        try {
            console.log(`[OpenAIProvider] Calling OpenAI (${this.model})...`);
            const response = await axios.post(url, payload, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            const content = response.data.choices[0].message.content;
            return this.parseJson(content);

        } catch (error: any) {
            console.error("[OpenAIProvider] API Error:", error.response?.data || error.message);
            throw error;
        }
    }

    private parseJson(content: string): { tool: string; input: any } {
        const cleanJson = content.replace(/```json/g, '').replace(/```/g, '').trim();
        try {
            return JSON.parse(cleanJson);
        } catch (e) {
            throw new Error(`Failed to parse JSON from OpenAI: ${(e as Error).message}`);
        }
    }

    private getSystemPrompt(): string {
        return `
You are a tool routing assistant.
Return ONLY valid JSON in format: { "tool": "...", "input": { ... } }

Tools:
- get_top_customers(region?, limit)
- get_segment_summary(category?, minDaysSinceOrder?)
- create_campaign_draft(segmentDescription, goal, channel, personalize?, maxCustomers?)
`;
    }
}
