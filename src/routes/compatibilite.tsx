import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { ArrowDown, Droplet } from "lucide-react";

export const Route = createFileRoute("/compatibilite")({
  head: () => ({
    meta: [
      { title: "Animation des Compatibilités — OSAMAK" },
      { name: "description", content: "Découvrez graphiquement les compatibilités sanguines." },
    ],
  }),
  component: CompatibilitePage,
});

const rules: Record<string, { donneA: string[]; recoitDe: string[] }> = {
  "O+": { donneA: ["O+", "A+", "B+", "AB+"], recoitDe: ["O+", "O-"] },
  "A+": { donneA: ["A+", "AB+"], recoitDe: ["A+", "A-", "O+", "O-"] },
  "B+": { donneA: ["B+", "AB+"], recoitDe: ["B+", "B-", "O+", "O-"] },
  "AB+": { donneA: ["AB+"], recoitDe: ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"] },
  "O-": { donneA: ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"], recoitDe: ["O-"] },
  "A-": { donneA: ["A+", "A-", "AB+", "AB-"], recoitDe: ["A-", "O-"] },
  "B-": { donneA: ["B+", "B-", "AB+", "AB-"], recoitDe: ["B-", "O-"] },
  "AB-": { donneA: ["AB+", "AB-"], recoitDe: ["AB-", "A-", "B-", "O-"] },
};

function CompatibilitePage() {
  const [activeType, setActiveType] = useState<string>("O+");

  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl px-4 py-10 md:py-14">
        <header className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
            <Droplet className="w-4 h-4" /> Compatibilités Sanguines
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Comprendre le Don de Sang
          </h1>
          <p className="mt-2 text-muted-foreground">
            Sélectionnez un groupe sanguin pour voir les transferts possibles.
          </p>
        </header>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {Object.keys(rules).map(type => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`w-14 h-14 rounded-full font-bold text-lg transition-all duration-300 flex items-center justify-center shadow-sm ${
                activeType === type
                  ? "bg-primary text-primary-foreground scale-110 shadow-primary/30"
                  : "bg-card border border-border text-foreground hover:border-primary/50"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Section DONNE A */}
          <div className="bg-card border border-border rounded-3xl p-6 relative overflow-hidden flex flex-col items-center">
            <h2 className="font-bold text-xl mb-8">Peut DONNER à</h2>
            <div className="relative flex justify-center w-full mb-8">
              <div className="w-20 h-20 bg-primary text-primary-foreground rounded-full flex flex-col items-center justify-center font-bold text-2xl z-10 shadow-xl">
                {activeType}
                <Droplet className="w-5 h-5 opacity-50" />
              </div>
            </div>
            <div className="flex justify-center w-full relative h-20 mb-4">
               {/* Lignes animées */}
               <div className="absolute top-0 bottom-0 border-l-2 border-dashed border-primary/30" />
               <ArrowDown className="absolute bottom-0 text-primary/50 w-6 h-6 animate-bounce" />
            </div>
            <div className="flex flex-wrap justify-center gap-4 w-full relative z-10">
              {rules[activeType].donneA.map(target => (
                <div key={target} className="w-16 h-16 bg-background border-2 border-primary/20 rounded-2xl flex items-center justify-center font-bold text-xl text-primary shadow-sm animate-in zoom-in duration-300">
                  {target}
                </div>
              ))}
            </div>
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/5 to-transparent -z-10 pointer-events-none" />
          </div>

          {/* Section RECOIT DE */}
          <div className="bg-card border border-border rounded-3xl p-6 relative overflow-hidden flex flex-col items-center">
            <h2 className="font-bold text-xl mb-8">Peut RECEVOIR de</h2>
            <div className="flex flex-wrap justify-center gap-4 w-full relative z-10 mb-4">
              {rules[activeType].recoitDe.map(source => (
                <div key={source} className="w-16 h-16 bg-background border-2 border-accent/20 rounded-2xl flex items-center justify-center font-bold text-xl text-accent shadow-sm animate-in zoom-in duration-300">
                  {source}
                </div>
              ))}
            </div>
            <div className="flex justify-center w-full relative h-20 mb-8">
               <div className="absolute top-0 bottom-0 border-l-2 border-dashed border-accent/30" />
               <ArrowDown className="absolute bottom-0 text-accent/50 w-6 h-6 animate-bounce" />
            </div>
            <div className="relative flex justify-center w-full">
              <div className="w-20 h-20 bg-accent text-accent-foreground rounded-full flex flex-col items-center justify-center font-bold text-2xl z-10 shadow-xl">
                {activeType}
                <Droplet className="w-5 h-5 opacity-50" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-accent/5 to-transparent -z-10 pointer-events-none" />
          </div>
        </div>

      </section>
    </SiteLayout>
  );
}
