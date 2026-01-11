import express from 'express';
import { getToolCallFromOllama } from '../llm/ollamaClient';
import { handleRequest } from '../mcp/server';
import path from 'path';
import { ENV } from '../config/env'; // Ensure env is loaded

// Initialize Express
const app = express();
app.use(express.json());

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, '..', '..', 'public')));

// API Endpoint for Agent
app.post('/api/agent', async (req, res) => {
    const { query } = req.body;

    if (!query || typeof query !== 'string' || !query.trim()) {
        res.status(400).json({ error: "Query is required and must be a non-empty string." });
        return;
    }

    console.log(`[Web] Received query: "${query}"`);

    try {
        // 1. Get tool decision from LLM
        const toolDecision = await getToolCallFromOllama(query);
        console.log(`[Web] Tool decision: ${toolDecision.tool}`);

        // 2. Execute MCP tool
        const result = await handleRequest(toolDecision.tool, toolDecision.input);
        console.log(`[Web] Tool executed successfully.`);

        // 3. Return combined response
        res.json({
            query,
            toolDecision,
            result
        });

    } catch (error: any) {
        console.error(`[Web] Error processing request:`, error);
        res.status(500).json({
            error: error.message || "Internal Server Error",
            details: error.response?.data || "No additional details"
        });
    }
});

// Start Server
const PORT = ENV.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Web UI listening on http://localhost:${PORT}`);
});
