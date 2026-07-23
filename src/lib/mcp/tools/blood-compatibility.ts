import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

const GROUPS = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"] as const;
type Group = (typeof GROUPS)[number];

const CAN_RECEIVE_FROM: Record<Group, Group[]> = {
  "O-": ["O-"],
  "O+": ["O-", "O+"],
  "A-": ["O-", "A-"],
  "A+": ["O-", "O+", "A-", "A+"],
  "B-": ["O-", "B-"],
  "B+": ["O-", "O+", "B-", "B+"],
  "AB-": ["O-", "A-", "B-", "AB-"],
  "AB+": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
};

const CAN_DONATE_TO: Record<Group, Group[]> = {
  "O-": ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"],
  "O+": ["O+", "A+", "B+", "AB+"],
  "A-": ["A+", "A-", "AB+", "AB-"],
  "A+": ["A+", "AB+"],
  "B-": ["B+", "B-", "AB+", "AB-"],
  "B+": ["B+", "AB+"],
  "AB-": ["AB+", "AB-"],
  "AB+": ["AB+"],
};

export default defineTool({
  name: "blood_compatibility",
  title: "Blood compatibility",
  description:
    "Return ABO/Rh donor-recipient compatibility for a blood group: who they can receive from and who they can donate to.",
  inputSchema: {
    group: z.enum(GROUPS).describe("Blood group, e.g. O+, A-, AB+."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ group }) => {
    const result = {
      group,
      canReceiveFrom: CAN_RECEIVE_FROM[group],
      canDonateTo: CAN_DONATE_TO[group],
    };
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      structuredContent: result,
    };
  },
});
