# MCP Personal Shopping Assistant 🛍️
> **A Klaviyo Hackathon Project (Winter 2026)**

## 1. Project Overview
**The Problem:** E-commerce merchants spend hours jumping between analytics dashboards to find customer segments and separate tools to write marketing copy. It’s a disconnected, manual workflow.

**The Solution:** The **MCP Personal Shopping Assistant** is a backend service designed for LLMs. It bridges the gap between *data* and *action*. Instead of clicking through menus, a merchant can simply ask: *"Who are my top paying customers in New York, and can you draft a 'VIP early access' SMS for them?"*

**What It Does:**
*   Queries deep customer insights (LTV, last order date, favorite categories).
*   Summarizes segment behavior instantly.
*   Generates ready-to-send marketing campaign drafts (Email or SMS) tailored to that specific audience.

---

## 2. Why This Matters
*   **For Marketers:** dramatically reduces the "time-to-campaign" by automating the research-to-draft loop.
*   **For Teams:** enables non-technical users to query complex data using natural language.
*   **Impact:** A single conversation can replace SQL queries, dashboard filtering, and copywriting sessions.

---

## 3. How It Works
The project implements the **Model Context Protocol (MCP)**, allowing any MCP-compliant LLM client to "see" and "use" our tools.

```mermaid
graph TD
    User[Merchant / LLM Client] -->|Natural Language| MCP
    subgraph "MCP Shopping Assistant"
        MCP[MCP Server] -->|Router| Tools
        Tools -->|Query| Logic[Business Logic & Analytics]
        Logic -->|Draft| Gen[Campaign Generator]
        
        Logic -.->|Read Data| Client{Klaviyo Client}
        Client -->|Option A| Mock[Mock Data (In-Memory)]
        Client -->|Option B| Real[Real Klaviyo API]
    end
```

### Core Components
*   **MCP Server**: Entry point handling tool requests.
*   **Domain Logic**: Type-safe business rules for calculating LTV and segmenting users.
*   **Draft Engine**: A template-based system that contextualizes marketing copy based on segment data.
*   **Dual-Mode Client**: seamless switching between a rich **Mock Dataset** (for testing/judging) and the real **Klaviyo API**.

---

## 4. Setup Instructions

### Prerequisites
*   Node.js (v18 or higher)
*   npm

### Installation
1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment (Optional):
    ```bash
    # The project runs in Mock Mode by default, so no API key is needed!
    cp .env.example .env
    ```

---

## 5. Usage & Demos (How to Test)
We have provided one-command demo scripts so you can verify the functionality immediately without needing an external LLM client setup.

### 🏁 Quick Start: The "VIP Flow"
Run the full end-to-end flow: finding top customers and drafting their campaign.
```bash
npm run demo:top
```
*Output: Lists 3 VIP customers in NY and prints a generated email draft.*

### 📊 Segment Analytics
See how the assistant summarizes data for specific categories (e.g., "outerwear") or lapsed users.
```bash
npm run demo:summary
```

### 📱 SMS Campaign Generation
Test the specific SMS drafting logic for a target group.
```bash
npm run demo:sms
```

### 🛠️ CLI Harness / Custom Testing
Want to poke at the tools directly? Use our CLI harness to pass any JSON input to any tool.
```bash
# Syntax: npm run demo:cli -- <tool_name> <json_input>

# Example: Find top 2 customers in California
npm run demo:cli -- get_top_customers "{\"region\":\"CA\",\"limit\":2}"
```

---

## 6. LLM-Powered Natural Language Demo 🤖

**New!** This project now includes an "Agent Mode" that connects to a local/private LLM (via [Ollama](https://ollama.ai)) to understand natural language and execute the correct tools automatically.

### Prerequisites for Agent Demo
1.  **Ollama** running locally or on a network server.
2.  **Mistral 7B** model installed (`ollama pull mistral:7b-instruct`).
3.  **Tailscale** (optional): If your Ollama instance is on a private network, ensure you are connected.

### Configuration
Update your `.env` file if your Ollama instance is not at `localhost:11434`.
```env
OLLAMA_HOST=http://tailscale_ip:11434
OLLAMA_MODEL=mistral:7b-instruct
```

### Usage
Ask the agent anything in plain English!

```bash
# Find VIPs
npm run demo:agent -- "find top VIP customers in California who haven't ordered in 60 days"

# Analytics
npm run demo:agent -- "summarize outerwear fans in New York who haven't bought recently"

# Creative Drafting
npm run demo:agent -- "draft an email to lapsed VIPs on the west coast with an early access offer"
```

**How it works:**
1.  The TS script sends your query to the private Ollama endpoint.
2.  The LLM (Mistral) decides which tool to call and extracts the parameters as JSON.
3.  The MCP server executes the tool and returns the result.


---

## 7. Web UI (Optional Front-End Demo) 🖥️
We also provide a modern, local web interface for judges to interact with the assistant visually.

### Setup & Run
1.  Install dependencies (if not already done):
    ```bash
    npm install
    ```
2.  Start the web server:
    ```bash
    npm run web:dev
    ```
3.  Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### Features
-   Clean, internal-tool style interface.
-   Type natural language queries directly.
-   View the **JSON Tool Decision** (what the LLM chose) side-by-side with the **MCP Result**.

---

## 8. Available Tools (API Reference)
The following tools are exposed to the LLM:

| Tool Name | Input | Description |
| :--- | :--- | :--- |
| `get_top_customers` | `{ region?, limit? }` | Returns highest LTV customers, optionally filtered by state. |
| `get_segment_summary` | `{ category?, minDays? }` | Aggregates metrics (count, avg LTV) for a category or filtered list. |
| `create_campaign_draft` | `{ segment, goal, channel }` | Generates potential subject lines and body copy for Email/SMS. |

---

## License
ISC
