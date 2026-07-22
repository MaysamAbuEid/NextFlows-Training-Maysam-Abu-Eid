import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  {
    name: "my_first_mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "welcome_message",
        description: "A simple welcome tool to test the MCP server",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              minLength: 1,
              description: "The name of the person to greet",
            },
          },
          required: ["name"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "welcome_message") {
    const args = request.params.arguments;
    const name = args?.name;

    if (!name || name.trim() === "") {
      throw new Error("Validation Error: Name cannot be empty or just spaces!");
    }

    return {
      content: [
        {
          type: "text",
          text: `Hello ${name}! Your MCP server is up and running successfully.`,
        },
      ],
    };
  }
  throw new Error("Tool not found");
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Server running on stdio for Maysam");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});