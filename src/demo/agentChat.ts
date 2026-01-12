import { getToolCallFromLLM } from '../llm'; // Use factory
import { handleRequest } from '../mcp/server';

async function runAgent() {
    const query = process.argv.slice(2).join(" ");

    if (!query) {
        console.log("Usage: npm run demo:agent -- \"<your natural language query>\"");
        console.log("Example: npm run demo:agent -- \"Find me top VIP customers in California\"");
        process.exit(1);
    }

    console.log("=== User Query ===");
    console.log(query);
    console.log("\n... Thinking (calling Ollama) ...\n");

    try {
        // 1. Get tool call from LLM (Abstracted)
        const decision = await getToolCallFromLLM(query);

        console.log("=== LLM Tool Decision ===");
        console.log(`Tool: ${decision.tool}`);
        console.log("Input:");
        console.log(JSON.stringify(decision.input, null, 2));
        console.log("\n... Executing MCP Tool ...\n");

        // 2. Execute MCP Tool
        const result = await handleRequest(decision.tool, decision.input);

        console.log("=== MCP Result ===");
        console.log(JSON.stringify(result, null, 2));

    } catch (error: any) {
        console.error("\n!!! Agent Error !!!");
        console.error(error.message);
        process.exit(1);
    }
}

runAgent().catch(console.error);
