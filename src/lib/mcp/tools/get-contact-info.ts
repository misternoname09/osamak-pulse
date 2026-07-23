import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "get_contact_info",
  title: "Get OSAMAK contact info",
  description:
    "Return the public contact information for OSAMAK and the Centre National de Transfusion Sanguine (CNTS) in Dakar, Senegal.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const info = {
      organization: "OSAMAK",
      partner: "Centre National de Transfusion Sanguine (CNTS)",
      address: "CNTS, Avenue Pasteur, Dakar, Sénégal",
      city: "Dakar",
      country: "Sénégal",
      website: "https://osamak-pulse.lovable.app",
    };
    return {
      content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
      structuredContent: info,
    };
  },
});
