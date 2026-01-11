import axios from 'axios';
import { ENV } from '../config/env';

/**
 * Sends a user query to the local Ollama instance and asks it to select an MCP tool.
 */
export async function getToolCallFromOllama(userMessage: string): Promise<{ tool: string; input: any }> {
    const systemPrompt = `
You are a tool routing assistant for a marketing automation system.

Your job:
- Read the user's natural-language request.
- Choose exactly ONE of the tools below.
- Return a SINGLE JSON object with the tool name and input.

Available tools:

1) "get_top_customers"
   {
     "region"?: string,
     "limit": number
   }

2) "get_segment_summary"
   Use this when the user asks for a SUMMARY or ANALYTICS on a segment.
   Input shape:
   {
     "category"?: string,
     "minDaysSinceOrder"?: number
   }

3) "create_campaign_draft"
   Use this when the user asks to DRAFT or WRITE an EMAIL or SMS, or mentions "draft", "email", "sms", or "message".
   Input shape:
   {
     "segmentDescription": string,
     "goal": string,
     "channel": "email" | "sms"
   }

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
            { role: "user", content: userMessage }
        ],
        options: {
            temperature: 0 // Deterministic output
        }
    };

    try {
        console.log(`[Ollama] Sending request to ${ENV.OLLAMA_HOST} (model: ${ENV.OLLAMA_MODEL})...`);
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
