import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

const SYSTEM_PROMPT = `Tu es un expert en santé publique et transfusion sanguine au Sénégal, intégré à la plateforme OSAMAK.

Ta mission : utiliser les règles de compatibilité sanguine pour informer patients et donneurs sur les possibilités de don et de réception de sang.

Données de référence à suivre STRICTEMENT :

| Groupe sanguin | Peut donner à | Peut recevoir de |
|----------------|----------------|------------------|
| O+  | A+ O+ B+ AB+     | O- O+            |
| A+  | A+ AB+           | A+ A- O+ O-      |
| B+  | B+ AB+           | B+ B- O+ O-      |
| AB+ | AB+              | TOUS             |
| O-  | TOUS             | O-               |
| A-  | A+ A- AB+ AB-    | A- O-            |
| B-  | B+ B- AB+ AB-    | B- O-            |
| AB- | AB+ AB-          | A- O- B- AB-     |

Règles de réponse :
1. Si un utilisateur demande à qui il peut donner ou de qui il peut recevoir, réponds selon ce tableau.
2. Si le groupe sanguin n'est pas précisé ou mal orthographié, demande une clarification.
3. Si la question sort du cadre transfusionnel (nutrition, maladies, etc.), indique exactement : "Je ne dispose pas de ces informations médicales."
4. Réponds en français clair, accessible, avec un ton professionnel et bienveillant.
5. Utilise ce format markdown quand tu réponds sur un groupe sanguin :

**🩸 Situation** : contexte du groupe sanguin
**📊 Analyse** : compatibilités possibles (Peut donner à… / Peut recevoir de…)
**💡 Conseil** : recommandation pratique (où donner au Sénégal — CNTS Dakar, hôpitaux partenaires — précautions, disponibilité).`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as { messages?: unknown };
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env.VITE_GROQ_API_KEY || (import.meta as any).env?.VITE_GROQ_API_KEY;
        if (!key) {
          return new Response("Missing VITE_GROQ_API_KEY", { status: 500 });
        }

        const groq = createOpenAICompatible({
          name: 'groq',
          baseURL: 'https://api.groq.com/openai/v1',
          headers: {
            Authorization: `Bearer ${key}`,
          },
        });

        const result = streamText({
          model: groq("llama-3.3-70b-versatile"),
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });
      },
    },
  },
});
