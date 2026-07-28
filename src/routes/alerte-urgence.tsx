import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Search, Radio, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/alerte-urgence")({
  head: () => ({
    meta: [
      { title: "Simulateur d'Alerte Urgence — OSAMAK" },
      { name: "description", content: "Simulez une alerte d'urgence pour trouver des donneurs compatibles." },
    ],
  }),
  component: AlerteUrgencePage,
});

function AlerteUrgencePage() {
  const [step, setStep] = useState<"form" | "scanning" | "success">("form");
  const [bloodType, setBloodType] = useState("");
  const [location, setLocation] = useState("");
  const [severity, setSeverity] = useState("Haute (Moins de 2h)");

  const handleLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bloodType || !location) return;
    
    setStep("scanning");
    
    // Simuler un scan de 4 secondes
    setTimeout(() => {
      setStep("success");
    }, 4000);
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 py-10 md:py-14">
        <header className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-semibold mb-4">
            <Radio className="w-4 h-4 animate-pulse" /> Simulateur d'Alerte
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Déclencher une alerte
          </h1>
          <p className="mt-2 text-muted-foreground">
            Simulez la recherche de donneurs compatibles dans un périmètre restreint.
          </p>
        </header>

        {step === "form" && (
          <form onSubmit={handleLaunch} className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Groupe Sanguin Recherché</label>
              <select 
                required 
                value={bloodType} 
                onChange={e => setBloodType(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-destructive/40"
              >
                <option value="">Sélectionnez un groupe</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Centre / Hôpital (Lieu de l'urgence)</label>
              <input 
                required 
                type="text" 
                value={location} 
                onChange={e => setLocation(e.target.value)}
                placeholder="Ex: Hôpital Principal de Dakar"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-destructive/40"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Niveau d'Urgence</label>
              <div className="flex flex-col md:flex-row gap-3">
                {["Critique (Immédiat)", "Haute (Moins de 2h)", "Moyenne (Aujourd'hui)"].map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSeverity(level)}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${severity === level ? 'bg-destructive text-destructive-foreground border-destructive shadow-md' : 'bg-background text-foreground border-border hover:border-destructive/30'}`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-destructive text-destructive-foreground font-bold hover:bg-destructive/90 transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-destructive/20"
            >
              <Radio className="w-5 h-5" /> Lancer l'Alerte aux Donneurs
            </button>
          </form>
        )}

        {step === "scanning" && (
          <div className="bg-card border border-border rounded-2xl p-12 shadow-sm flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
            <div className="relative w-32 h-32 flex items-center justify-center mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-destructive/20" />
              <div className="absolute inset-0 rounded-full border-4 border-destructive border-t-transparent animate-spin" />
              <div className="absolute inset-4 rounded-full border-4 border-primary/20" />
              <div className="absolute inset-4 rounded-full border-4 border-primary border-b-transparent animate-spin" style={{ animationDuration: '3s' }} />
              <Search className="w-10 h-10 text-destructive animate-pulse" />
            </div>
            <h2 className="text-xl font-bold mb-2">Scan en cours...</h2>
            <p className="text-muted-foreground text-sm">
              Recherche des donneurs <strong className="text-foreground">{bloodType}</strong> à proximité de <strong className="text-foreground">{location}</strong>...
            </p>
          </div>
        )}

        {step === "success" && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-10 text-center animate-in fade-in zoom-in slide-in-from-bottom-4">
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mb-3">Alerte Diffusée !</h2>
            <p className="text-emerald-800 dark:text-emerald-300 mb-6">
              L'urgence <strong>{severity}</strong> pour le groupe <strong>{bloodType}</strong> à <strong>{location}</strong> a été transmise avec succès.
            </p>
            <div className="bg-background rounded-xl p-4 border border-border mb-6 text-sm text-left shadow-sm max-w-md mx-auto">
              <div className="flex justify-between border-b border-border pb-2 mb-2">
                <span className="text-muted-foreground">Donneurs compatibles ciblés</span>
                <span className="font-bold">42</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2 mb-2">
                <span className="text-muted-foreground">Canaux utilisés</span>
                <span className="font-bold">SMS, WhatsApp, Notification Push</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rayon d'action</span>
                <span className="font-bold">5 km</span>
              </div>
            </div>
            <button
              onClick={() => setStep("form")}
              className="px-6 py-2.5 bg-background border border-border rounded-full text-sm font-semibold hover:bg-muted transition"
            >
              Lancer une nouvelle alerte
            </button>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
