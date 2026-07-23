import { defineMcp } from "@lovable.dev/mcp-js";
import listBloodAvailability from "./tools/list-blood-availability";
import bloodCompatibility from "./tools/blood-compatibility";
import getContactInfo from "./tools/get-contact-info";

export default defineMcp({
  name: "osamak-mcp",
  title: "OSAMAK MCP",
  version: "0.1.0",
  instructions:
    "Outils publics OSAMAK : consulter la disponibilité du sang dans les centres partenaires au Sénégal, vérifier la compatibilité sanguine ABO/Rh, et récupérer les coordonnées du CNTS Dakar.",
  tools: [listBloodAvailability, bloodCompatibility, getContactInfo],
});
