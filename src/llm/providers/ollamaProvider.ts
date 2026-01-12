import axios from 'axios';
import { LLMProvider } from './types';
import { ENV } from '../../config/env';

export class OllamaProvider implements LLMProvider {
    async getToolCall(query: string): Promise<{ tool: string; input: any }> {
        const systemPrompt = `
You are a tool routing assistant for a marketing automation system.

Your job:
- Read the user's natural-language request.
- Choose exactly ONE of the tools below.
- Return a SINGLE JSON object with the tool name and input.

Available tools:

1) "get_top_customers"
   Input shape:
   {
     "region"?: string,
     "limit": number
   }

2) "get_segment_summary"
   Input shape:
   {
     "category"?: string,
     "minDaysSinceOrder"?: number
   }

3) "create_campaign_draft"
   Input shape:
   {
     "segmentDescription": string,
     "goal": string,
     "channel": "email" | "sms",
     "personalize"?: boolean,
     "maxCustomers"?: number
   }
   Make sure to set "personalize": true if the user mentions "personalize", "tailor", "variants", or asks for specific customer drafts.

IMPORTANT DECISION RULES:
- If the user asks to "draft", "write", "email", or "sms", you MUST choose "create_campaign_draft".
- Do NOT chain multiple tools.
- Do NOT output more than one JSON object.
- Do NOT include any explanation, markdown, or text outside the JSON.

OUTPUT FORMAT:
Return ONLY a single JSON object in this exact form:

{
  "tool": "<tool_name>",
  "input": { ... }
}
`;

        const payload = {
            model: ENV.OLLAMA_MODEL,
            stream: false,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: query }
            ],
            options: {
                temperature: 0
            }
        };

        try {
            console.log(`[OllamaProvider] Sending request to ${ENV.OLLAMA_HOST} (model: ${ENV.OLLAMA_MODEL})...`);
            const response = await axios.post(`${ENV.OLLAMA_HOST}/api/chat`, payload);

            const content = response.data?.message?.content;

            if (!content) {
                throw new Error("Empty response from Ollama");
            }

            // Clean up potential markdown formatting (```json ... ```)
            const cleanJson = content.replace(/```json/g, '').replace(/```/g, '').trim();

            try {
                const parsed = JSON.parse(cleanJson);
                if (!parsed.tool || !parsed.input) {
                    throw new Error("Missing 'tool' or 'input' fields in LLM response");
                }
                return parsed;
            } catch (parseError) {
                console.error("Failed to parse LLM Output:", cleanJson);
                throw new Error(`Invalid JSON from LLM: ${(parseError as Error).message}`);
            }

        } catch (error: any) {
            console.error("Ollama API Error:", error.message);
            if (error.code === 'ECONNREFUSED') {
                throw new Error(`Could not connect to Ollama at ${ENV.OLLAMA_HOST}. Is it running?`);
            }
            throw error;
        }
    }
}
