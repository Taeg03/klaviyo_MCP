import { handleRequest } from '../mcp/server';

async function runDemo() {
    console.log("=== DEMO: Segment Summary ===\n");

    const input1 = { category: "outerwear" };
    console.log("Input 1:", JSON.stringify(input1));
    const result1 = await handleRequest('get_segment_summary', input1);
    console.log("Result 1:", JSON.stringify(result1, null, 2));

    console.log("\n-----------------------------------\n");

    const input2 = { minDaysSinceOrder: 30 };
    console.log("Input 2:", JSON.stringify(input2));
    const result2 = await handleRequest('get_segment_summary', input2);
    console.log("Result 2:", JSON.stringify(result2, null, 2));
}

runDemo().catch(console.error);
