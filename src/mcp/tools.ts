import { KlaviyoClient } from '../klaviyo';
import { generateCampaignDraft } from '../logic/campaignDraft';
import { calculateAverageLTV, summarizeRegionBreakdown } from '../logic/summarize';

/**
 * Tool: get_top_customers
 * Description: Retrieves top customers by lifetime value, optionally filtered by region.
 */
export async function get_top_customers(args: { region?: string; limit?: number }) {
    console.log('[MCP] get_top_customers called with:', args);
    const customers = await KlaviyoClient.getTopCustomers({
        region: args.region,
        limit: args.limit
    });

    return {
        count: customers.length,
        customers: customers.map(c => ({
            name: c.name,
            email: c.email,
            ltv: c.lifetimeValue,
            region: c.region
        }))
    };
}

/**
 * Tool: get_segment_summary
 * Description: Get summary metrics for a specific category or customer group.
 */
export async function get_segment_summary(args: { category?: string; minDaysSinceOrder?: number }) {
    console.log('[MCP] get_segment_summary called with:', args);

    // If filtered by category
    if (args.category) {
        const summary = await KlaviyoClient.summarizeByCategory({ category: args.category });
        return summary;
    }

    // If filtered by "lapsed" (time since last order)
    if (args.minDaysSinceOrder) {
        const customers = await KlaviyoClient.getCustomersByLastOrder({ minDays: args.minDaysSinceOrder });
        return {
            segment: `Inactive for > ${args.minDaysSinceOrder} days`,
            count: customers.length,
            averageLTV: calculateAverageLTV(customers),
            regionBreakdown: summarizeRegionBreakdown(customers)
        };
    }

    return { error: "Please provide 'category' or 'minDaysSinceOrder'" };
}

/**
 * Tool: create_campaign_draft
 * Description: Generates a marketing campaign draft (email/SMS) for a given segment logic.
 */
export async function create_campaign_draft(args: {
    segmentDescription: string;
    goal: string;
    channel: 'email' | 'sms';
    personalize?: boolean;
    maxCustomers?: number;
}) {
    console.log('[MCP] create_campaign_draft called with:', args);

    if (!args.segmentDescription || !args.goal || !args.channel) {
        return { error: "Missing required fields: segmentDescription, goal, channel (email|sms)" };
    }

    // 1. Generate Base Draft
    const draft = generateCampaignDraft(args.segmentDescription, args.goal, args.channel);

    // 2. If personalization requested, fetch customers and generate variants
    if (args.personalize) {
        // Simple logic: fetch top customers filtered by region if region is mentioned in segment description
        // For hackathon simplicity, catching "NY" or "CA" etc. in description is a bonus, 
        // but let's just grab top N customers for now or filter if we can guess region.

        let regionFilter: string | undefined;
        // Basic heuristic extraction for demo
        if (args.segmentDescription.match(/\b(NY|New York)\b/i)) regionFilter = 'NY';
        if (args.segmentDescription.match(/\b(CA|California)\b/i)) regionFilter = 'CA';

        const limit = args.maxCustomers || 3;
        const customers = await KlaviyoClient.getTopCustomers({ region: regionFilter, limit });

        if (customers.length > 0) {
            console.log(`[MCP] Generating personalized variants for ${customers.length} customers...`);
            const variants = await require('../llm/personalization').generatePersonalizedDrafts(
                draft.subjectLine,
                draft.body,
                args.goal,
                customers
            );
            return {
                ...draft,
                personalizedVariants: variants
            };
        }
    }

    return draft;
}
