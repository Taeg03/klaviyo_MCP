import { handleRequest } from '../mcp/server';

async function runCli() {
    const args = process.argv.slice(2);

    if (args.length < 2) {
        console.error("Usage: ts-node src/demo/cli.ts <tool_name> <json_input>");
        process.exit(1);
    }

    const toolName = args[0];
    const inputJson = args[1];

    let input: any;
    try {
        input = JSON.parse(inputJson);
    } catch (e) {
        console.error("Error: Invalid JSON input string.");
        process.exit(1);
    }

    console.log(`=== CLI Test: ${toolName} ===`);
    console.log(`Input:`, input);

    try {
        const result = await handleRequest(toolName, input);
        console.log("Result:", JSON.stringify(result, null, 2));
    } catch (err) {
        console.error("Runtime Error:", err);
    }
}

runCli().catch(console.error);
