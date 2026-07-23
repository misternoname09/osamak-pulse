import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/saisie-donnees")({
  head: () => ({
    meta: [
      { title: "Saisie Données Terrain — OSAMAK" },
      { name: "description", content: "Formulaire de saisie terrain pour agents de santé OSAMAK." },
      { property: "og:title", content: "Saisie Données Terrain — OSAMAK" },
      { property: "og:description", content: "Formulaire de saisie terrain pour agents de santé OSAMAK." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SaisieDonneesPage,
});

function SaisieDonneesPage() {
  const [donneesSante, setDonneesSante] = useState("");
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("https://api.dify.ai/v1/workflows/run", {
        method: "POST",
        headers: {
          Authorization: "Bearer app-LGSZmJYt4J79PsGRtVQA344y",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: {
            query: question,
            donnees_sante: donneesSante,
          },
          response_mode: "blocking",
          user: "agent-sante",
        }),
      });

      if (!res.ok) throw new Error("http");

      const data = await res.json();
      const text = data?.data?.outputs?.text;
      setResult(typeof text === "string" ? text : "Aucune réponse reçue.");
    } catch {
      setError("❌ Erreur — réessayer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteLayout>
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-primary">
              🩸 Saisie Données Terrain
            </h1>
            <p className="mt-2 text-base md:text-lg text-muted-foreground">
              Agent santé — Données en temps réel
            </p>
          </div>

          <form
            onSubmit={submit}
            className="mt-8 md:mt-10 rounded-2xl bg-card border border-border p-5 md:p-6 shadow-sm space-y-5"
          >
            <div>
              <label
                htmlFor="donnees-sante"
                className="block text-sm font-semibold text-foreground"
              >
                Observations médicales
              </label>
              <textarea
                id="donnees-sante"
                value={donneesSante}
                onChange={(e) => setDonneesSante(e.target.value)}
                rows={6}
                placeholder="Ex: CNTS Dakar 23/07/2026 14h — Groupe O+ : 2 donneurs disponibles"
                className="mt-2 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="question"
                className="block text-sm font-semibold text-foreground"
              >
                Votre question
              </label>
              <input
                id="question"
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ex: Quel est le délai moyen pour trouver un donneur O+ à Dakar ?"
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                disabled={loading}
              />
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60 hover:bg-primary/90 transition"
              >
                {loading && (
                  <span className="inline-block w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                )}
                🩸 Générer la fiche
              </button>
            </div>
          </form>

          {loading && (
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span className="inline-block w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              ⏳ Génération en cours…
            </div>
          )}

          {error && (
            <div
              className="mt-6 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive px-4 py-3 text-sm"
              role="alert"
            >
              {error}
            </div>
          )}

          {result && !loading && (
            <div className="mt-6 rounded-xl bg-muted border border-border px-4 py-4 text-sm leading-relaxed text-foreground whitespace-pre-line">
              {result}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
