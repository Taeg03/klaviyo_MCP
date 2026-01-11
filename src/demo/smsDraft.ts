import { handleRequest } from '../mcp/server';

async function runDemo() {
    console.log("=== DEMO: SMS Campaign Draft ===\n");

    const input = {
        channel: "sms",
        segmentDescription: "Lapsed VIPs on the West Coast",
        goal: "reactivate them with a time-limited offer"
    };

    console.log("Input:", JSON.stringify(input, null, 2));
    console.log("Assistant: Calling create_campaign_draft...");

    const result = await handleRequest('create_campaign_draft', input);
    console.log("Result:", JSON.stringify(result, null, 2));
}

runDemo().catch(console.error);
