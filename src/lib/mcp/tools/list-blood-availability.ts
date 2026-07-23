import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

type Item = { group: string; zone: string; delay: string; available: boolean };

const DATA: Item[] = [
  { group: "O+", zone: "CNTS Dakar", delay: "2–3h", available: true },
  { group: "A+", zone: "Hôpital Principal Dakar", delay: "4h", available: true },
  { group: "AB-", zone: "Thiès", delay: "6h", available: false },
  { group: "B+", zone: "Hôpital Fann", delay: "3h", available: true },
  { group: "O-", zone: "Saint-Louis", delay: "5h", available: true },
  { group: "A-", zone: "Kaolack", delay: "4h", available: true },
];

export default defineTool({
  name: "list_blood_availability",
  title: "List blood availability",
  description:
    "List current blood availability across OSAMAK partner centers in Senegal (CNTS Dakar, Hôpital Principal, Fann, Thiès, Saint-Louis, Kaolack). Optionally filter by blood group.",
  inputSchema: {
    group: z
      .enum(["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"])
      .optional()
      .describe("Optional blood group filter."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ group }) => {
    const items = group ? DATA.filter((d) => d.group === group) : DATA;
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { items },
    };
  },
});
