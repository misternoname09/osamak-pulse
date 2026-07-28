import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Stethoscope, FileText, Send, Loader2, Bot, AlertTriangle, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/saisie-donnees")({
  head: () => ({
    meta: [
      { title: "Portail Médical (Agents) — OSAMAK" },
      { name: "description", content: "Interface réservée aux professionnels de santé pour la saisie et l'analyse des données de transfusion sanguine." },
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
    if (loading || (!donneesSante.trim() && !question.trim())) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const prompt = `En tant qu'assistant médical IA du CNTS (Centre National de Transfusion Sanguine du Sénégal), analyse les observations médicales suivantes de l'agent de santé, et réponds à sa question avec rigueur et précision.
Observations : ${donneesSante || "Aucune observation fournie."}
Question de l'agent : ${question}`;

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY || "VOTRE_CLE_API_GROQ_ICI"}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }]
        }),
      });

      if (!res.ok) throw new Error("Erreur de l'API");
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content || "Aucune réponse générée.";
      setResult(text);
    } catch {
      setError("La connexion au serveur d'analyse a échoué. Veuillez vérifier votre réseau interne.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full rounded-2xl border-2 border-border bg-background px-5 py-4 font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all";

  return (
    <SiteLayout>
      <div className="bg-emerald-500/5 min-h-[calc(100vh-64px)] py-12 md:py-20 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="mx-auto max-w-4xl px-4 relative z-10">
          <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 px-4 py-1.5 text-sm font-bold shadow-sm mb-6">
              <ShieldCheck className="w-4 h-4" /> Accès Sécurisé — Professionnels de Santé
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Portail Médical <span className="text-emerald-600">Agents CNTS</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Saisissez les observations cliniques et interrogez le modèle prédictif pour optimiser la gestion des stocks de sang.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              <form onSubmit={submit} className="rounded-[2rem] bg-card/90 backdrop-blur-xl border border-border p-8 shadow-2xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                
                <div>
                  <label htmlFor="donnees-sante" className="flex items-center gap-2 font-bold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                    <FileText className="w-4 h-4 text-emerald-500" /> Observations Terrain
                  </label>
                  <textarea
                    id="donnees-sante" value={donneesSante} onChange={(e) => setDonneesSante(e.target.value)}
                    rows={6} disabled={loading}
                    placeholder="Saisissez les données d'affluence, l'état des stocks ou les remarques cliniques (ex: 'Rupture imminente de culots O- au CHU de Fann')."
                    className={`${inputCls} resize-none`}
                  />
                </div>

                <div>
                  <label htmlFor="question" className="flex items-center gap-2 font-bold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                    <Stethoscope className="w-4 h-4 text-emerald-500" /> Requête d'Analyse
                  </label>
                  <input
                    id="question" type="text" value={question} onChange={(e) => setQuestion(e.target.value)}
                    disabled={loading}
                    placeholder="Ex: Quel protocole appliquer pour anticiper ce besoin ?"
                    className={inputCls}
                  />
                </div>

                <button
                  type="submit" disabled={loading || (!donneesSante.trim() && !question.trim())}
                  className="w-full py-4 rounded-xl bg-emerald-600 text-white font-extrabold text-lg hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:shadow-none"
                >
                  {loading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Traitement en cours...</>
                  ) : (
                    <><Send className="w-5 h-5" /> Générer l'analyse IA</>
                  )}
                </button>
              </form>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              {result ? (
                <div className="bg-emerald-950 text-emerald-50 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
                  <div className="flex items-center gap-3 border-b border-emerald-800 pb-4 mb-6">
                    <div className="w-10 h-10 bg-emerald-800 rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5 text-emerald-300" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-emerald-100">Rapport d'Analyse</h3>
                      <div className="text-xs text-emerald-400 font-semibold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Généré par l'IA OSAMAK
                      </div>
                    </div>
                  </div>
                  <div className="prose prose-invert prose-emerald text-sm leading-relaxed max-w-none whitespace-pre-wrap">
                    {result}
                  </div>
                </div>
              ) : error ? (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-[2rem] p-8 shadow-lg flex flex-col items-center justify-center text-center h-full min-h-[300px]">
                  <AlertTriangle className="w-12 h-12 mb-4 text-destructive/80" />
                  <h3 className="text-xl font-bold mb-2">Analyse échouée</h3>
                  <p className="text-sm font-medium opacity-80">{error}</p>
                </div>
              ) : (
                <div className="bg-card border border-dashed border-border rounded-[2rem] p-8 shadow-sm flex flex-col items-center justify-center text-center h-full min-h-[400px] text-muted-foreground">
                  <FileText className="w-16 h-16 mb-4 opacity-20" />
                  <h3 className="text-xl font-bold mb-2 text-foreground">En attente de données</h3>
                  <p className="text-sm max-w-xs mx-auto">
                    Le rapport d'analyse s'affichera ici une fois les observations soumises au système.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
