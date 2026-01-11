import { handleRequest } from '../mcp/server';

async function runDemo() {
    console.log("=== DEMO: Error Handling Validation ===\n");

    // Case 1: Unknown Tool
    console.log("Case 1: Calling unknown tool 'delete_database'...");
    const error1 = await handleRequest('delete_database', {});
    console.log("Result:", JSON.stringify(error1, null, 2));

    console.log("\n-----------------------------------\n");

    // Case 2: Missing fields
    console.log("Case 2: Calling create_campaign_draft with missing fields...");
    const error2 = await handleRequest('create_campaign_draft', { channel: 'sms' }); // Missing segment/goal
    console.log("Result:", JSON.stringify(error2, null, 2));
}

runDemo().catch(console.error);
