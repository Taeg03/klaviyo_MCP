import { handleRequest } from '../mcp/server';

async function runDemo() {
    console.log("=== DEMO: Shop Assistant Flow ===\n");

    // 1. User asks: "Who are our top VIPs in NY?"
    console.log("User: Who are our top VIPs in NY?");
    console.log("Assistant: Calling get_top_customers...");

    const topCustomers = await handleRequest('get_top_customers', {
        region: 'NY',
        limit: 3
    });
    console.log("Result:", JSON.stringify(topCustomers, null, 2));

    console.log("\n-----------------------------------\n");

    // 2. User asks: "Draft an email to these NY VIPs offering early access."
    console.log("User: Draft an email to these NY VIPs offering early access.");
    console.log("Assistant: Calling create_campaign_draft...");

    const draft = await handleRequest('create_campaign_draft', {
        segmentDescription: "Top VIPs in New York",
        goal: "offer early access to new collection",
        channel: "email"
    });

    console.log("Result:", JSON.stringify(draft, null, 2));
}

runDemo().catch(console.error);
