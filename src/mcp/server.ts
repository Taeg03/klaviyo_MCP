import {
    get_top_customers,
    get_segment_summary,
    create_campaign_draft
} from './tools';

export async function handleRequest(toolName: string, input: any) {
    try {
        switch (toolName) {
            case 'get_top_customers':
                return await get_top_customers(input);
            case 'get_segment_summary':
                return await get_segment_summary(input);
            case 'create_campaign_draft':
                return await create_campaign_draft(input);
            default:
                return { error: `Unknown tool: ${toolName}` };
        }
    } catch (err: any) {
        return { error: `Tool execution failed: ${err.message}` };
    }
}

// Simple CLI wrapper for verification (only runs if executed directly)
if (require.main === module) {
    const tool = process.argv[2];
    const inputJson = process.argv[3];

    if (!tool || !inputJson) {
        console.error("Usage: ts-node src/mcp/server.ts <tool_name> <json_input>");
        process.exit(1);
    }

    try {
        const input = JSON.parse(inputJson);
        handleRequest(tool, input).then(result => {
            console.log(JSON.stringify(result, null, 2));
        });
    } catch (e) {
        console.error("Invalid JSON input");
    }
}
