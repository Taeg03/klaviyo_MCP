---
trigger: always_on
---

You are an autonomous coding agent working inside a repository that will host a Klaviyo Winter 2026 Hackathon project.

Project name: MCP Personal Shopping Assistant

High-level concept:
- Build a small MCP-based “assistant” for a merchant that:
  - Answers natural-language questions about their customers and purchasing behavior using Klaviyo data (or realistic mocks).
  - Generates campaign drafts (SMS/email) targeting those customers based on the insights.
- The assistant will be consumed by a separate LLM client that calls MCP tools. Your job is to implement the MCP server/tools + logic + documentation.

Constraints and scope:
- Target time/complexity: 10–20 hours of human-equivalent work. Aim for a polished MVP.
- Language: TypeScript with Node.js.
- Focus on:
  - Clean architecture.
  - Strong technical execution.
  - Meaningful integration with Klaviyo APIs or faithful mocks.
  - Clear README and demo story.

Core functionality to implement:

1. Project setup
   - Initialize a TypeScript Node project with:
     - `tsconfig.json`
     - `src/` directory
     - `package.json` with scripts: `dev`, `build`, `start`, and optionally `test`.
   - Add basic dependencies:
     - HTTP client (e.g. axios or node-fetch).
     - dotenv (for env variables).
     - Any MCP-related libraries if available; if not, structure the MCP code as a simple TypeScript module with clearly defined “tools”.

2. Configuration and environment
   - Implement a small config module (e.g. `src/config/env.ts`) that:
     - Reads env vars:
       - `KLAVIYO_API_KEY` (optional if mock mode).
       - `KLAVIYO_BASE_URL` (default to official if not set).
       - `USE_MOCK_KLAVIYO` (boolean flag).
     - Provides typesafe accessors to these values.
   - Ensure no secrets are hard-coded.

3. Klaviyo client layer
   - In `src/klaviyo/client.ts`, implement:
     - A KlaviyoClient interface specifying operations we need, e.g.:
       - `getTopCustomersByRevenue(params)`
       - `getCustomersByLastOrder(params)`
       - `getSegmentSummary(params)`
     - A real client implementation that shows how we *would* call Klaviyo’s APIs (you may use pseudo-endpoints if exact URLs are unknown; focus on structure).
     - A mock client implementation with in-memory sample data that returns realistic-looking results for demo and tests.
   - Add a small set of sample customers + orders for mock mode.

4. Domain models & logic
   - In `src/logic/`, define domain types:
     - `Customer`
     - `OrderSummary`
     - `SegmentQuery`
     - `CampaignDraft` (with fields: channel, segmentDescription, subjectLine, body, callToActionUrl).
   - Implement logic functions, for example:
     - `buildTopCustomersQuery(region, minDaysSinceLastOrder, limit)`
     - `summarizeCustomers(customers)` to produce simple analytics.
     - `generateCampaignDraft(input)` that:
       - Takes a segment description and some basic behavior info (e.g. “lapsed VIPs in New York”).
       - Returns a reasonable subject line + body for SMS or email.

5. MCP tools layer
   - In `src/mcp/tools.ts` (or similar), define a handful of tools the LLM can call:
     - `get_top_customers`:
       - Input: region, min_days_since_last_order, limit.
       - Output: array of simplified customer objects + basic metrics.
     - `get_segment_behavior`:
       - Input: simple filters (e.g. product category, timeframe).
       - Output: summarized metrics (count, total revenue, average order value).
     - `create_campaign_draft`:
       - Input: segment description, channel (sms/email), goal (reactivate / upsell / cross-sell).
       - Output: `CampaignDraft` object with subject/body text.
   - Make each tool:
     - Validate input.
     - Call the appropriate client + logic functions.
     - Return clean, documented JSON.
   - If you know the MCP protocol for tool description, follow it; otherwise, structure them as plain async functions that can be easily wired into MCP.

6. MCP server entrypoint
   - In `src/mcp/server.ts`, create a small server/module that:
     - Registers the tools above.
     - Exposes a simple interface (even if just a CLI or HTTP endpoint) so:
       - A judge (or another LLM client) can call a tool manually for testing.
   - It’s OK if the “MCP server” is represented as:
     - A JSON-based RPC over stdin/stdout, OR
     - A small HTTP endpoint that accepts `{ tool: string, input: {...} }` and returns `{ output: {...} }`.
     - Use whatever pattern is easiest and consistent with your workspace.

7. Demo scripts
   - Add at least one script in `src/demo/` (and a corresponding npm script) that:
     - Calls `get_top_customers` with a sample query.
     - Calls `create_campaign_draft` for that result’s segment.
     - Prints the outputs nicely.
   - This will serve as a “dry run” demo without needing a full external LLM wired up.

8. README and docs
   - Write a `README.md` targeted at hackathon judges, including:
     - Problem statement: why merchants need a natural-language assistant for segmentation + campaigns.
     - How the solution works (high-level architecture diagram in text).
     - How Klaviyo APIs / MCP are used or approximated.
     - How to run the project locally:
       - Mock mode (no real Klaviyo key).
       - Real mode (if they set `KLAVIYO_API_KEY`).
     - Example tool calls and example JSON responses.
     - Example “user conversations” showing:
       - A natural-language question.
       - Which tools get called.
       - What campaign draft is generated.
   - Mention how AI would be used in a full deployment:
     - Parsing natural language into tool calls.
     - Refining or personalizing the generated copy.

9. Quality & polish
   - Keep the code clean, modular, and readable.
   - Add minimal unit tests for:
     - A core logic function (e.g. `generateCampaignDraft`).
     - A query/summary function.
   - Avoid dead code and excessive TODOs.
   - Ensure `npm run dev` or `npm run start` works out of the box in mock mode.

Execution strategy:
- First, scaffold the project structure and config.
- Second, create mock Klaviyo data + client.
- Third, implement the logic and MCP tools on top of the mock client.
- Finally, wire up the server entrypoint and demo script, then write the README.

If any detail is underspecified, make reasonable choices that optimize for:
- Demonstrating technical execution.
- Showing meaningful use of Klaviyo-like data + MCP tools.
- Being easy for a human judge to understand in under 10 minutes.
