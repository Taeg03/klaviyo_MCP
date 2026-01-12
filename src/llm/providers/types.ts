export interface LLMProvider {
    /**
     * Sends a prompt to the LLM and expects a tool call JSON response.
     */
    getToolCall(query: string): Promise<{ tool: string; input: any }>;
}
