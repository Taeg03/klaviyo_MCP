import axios from 'axios';
import { ENV } from '../config/env';
import { Customer } from '../logic/customer';

export interface PersonalizedVariant {
    email: string;
    name: string;
    subjectLine: string;
    body: string;
    rationale?: string;
}

export async function generatePersonalizedDrafts(
    baseSubject: string,
    baseBody: string,
    goal: string,
    customers: Customer[]
): Promise<PersonalizedVariant[]> {
    const systemPrompt = `
You are an email marketing copy assistant. You receive a base campaign subject and body, plus a list of customers and their shopping habits.

For each customer, lightly personalize the subject and body to better fit their behavior (e.g., mention their favorite category, reference their last order value, or offer a discount if they buy on sale).

Do not change the overall goal.

OUTPUT FORMAT:
Return ONLY a valid JSON object with a "variants" array.
Example:
{
  "variants": [
    { "email": "...", "name": "...", "subjectLine": "...", "body": "...", "rationale": "Why you made these changes" }
  ]
}
`;

    const userPayload = {
        baseSubject,
        baseBody,
        goal,
        customers: customers.map(c => ({
            name: c.name,
            email: c.email,
            region: c.region, // Keep region for context
            ltv: c.lifetimeValue,
            favoriteCategory: c.favoriteCategory,
            lastOrderDate: c.lastOrderDate,
            lastOrderValue: c.lastOrderValue,
            oftenBuysOnSale: c.oftenBuysOnSale
        }))
    };

    const payload = {
        model: ENV.OLLAMA_MODEL,
        stream: false,
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: JSON.stringify(userPayload) }
        ],
        options: {
            temperature: 0.7 // Slight creativity for copywriting
        }
    };

    try {
        console.log(`[Personalization] Generating drafts for ${customers.length} customers...`);
        const response = await axios.post(`${ENV.OLLAMA_HOST}/api/chat`, payload);
        const content = response.data?.message?.content;

        if (!content) throw new Error("Empty response from LLM");

        const cleanJson = content.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);

        if (!Array.isArray(parsed.variants)) {
            throw new Error("LLM response missing 'variants' array");
        }

        return parsed.variants;

    } catch (error: any) {
        console.error("[Personalization] Failed:", error.message);
        return []; // Fail gracefully by returning empty variants
    }
}
