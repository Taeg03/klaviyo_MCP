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
    channel: 'email' | 'sms'
}) {
    console.log('[MCP] create_campaign_draft called with:', args);

    if (!args.segmentDescription || !args.goal || !args.channel) {
        return { error: "Missing required fields: segmentDescription, goal, channel (email|sms)" };
    }

    const draft = generateCampaignDraft(args.segmentDescription, args.goal, args.channel);
    return draft;
}
