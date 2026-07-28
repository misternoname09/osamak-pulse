import { createFileRoute } from "@tanstack/react-router";
import { useState, lazy, Suspense, useEffect } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { MapPin, Search, Activity, Clock, Droplet, CheckCircle2, XCircle } from "lucide-react";
import { getCntsCenters } from "@/lib/cnts.functions";

const BloodCentersMap = lazy(() =>
  import("@/components/BloodCentersMap").then((m) => ({ default: m.BloodCentersMap }))
);

function MapWrapper() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="h-full w-full bg-muted animate-pulse flex items-center justify-center text-muted-foreground font-semibold">Chargement de la carte...</div>;
  }

  return (
    <Suspense fallback={<div className="h-full w-full bg-muted animate-pulse flex items-center justify-center text-muted-foreground font-semibold">Chargement de la carte...</div>}>
      <BloodCentersMap hideList={true} />
    </Suspense>
  );
}

export const Route = createFileRoute("/disponibilite")({
  head: () => ({
    meta: [
      { title: "Disponibilité du sang — OSAMAK" },
      { name: "description", content: "Consultez la disponibilité du sang par groupe et par zone dans les centres partenaires du Sénégal." },
    ],
  }),
  loader: () => getCntsCenters(),
  component: DisponibilitePage,
});

type Item = {
  group: string;
  zone: string;
  delay: string;
  available: boolean;
  region: string;
};

const FILTERS = ["Tous", "O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"] as const;
type Filter = (typeof FILTERS)[number];

const MOCK_GROUPS = ["O+", "A+", "AB-", "B+", "O-", "A-", "AB+", "B-"];

function DisponibilitePage() {
  const data = Route.useLoaderData();
  const [filter, setFilter] = useState<Filter>("Tous");

  const allItems: Item[] = data.centers.map((c, i) => ({
    group: MOCK_GROUPS[i % MOCK_GROUPS.length],
    zone: c.name,
    delay: c.delay || "Non spécifié",
    available: c.status === "Disponible",
    region: c.region || "Sénégal",
  }));

  const items = filter === "Tous" ? allItems : allItems.filter((d) => d.group === filter);

  return (
    <SiteLayout>
      {/* Hero Premium */}
      <section className="bg-primary/5 border-b border-border/50 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 flex flex-col md:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-background border border-primary/20 text-primary px-3 py-1 text-xs font-bold shadow-sm mb-4">
              <MapPin className="w-4 h-4" /> Carte des Centres
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Disponibilité du Sang
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-xl">
              Localisez les centres de transfusion et vérifiez la disponibilité de votre groupe sanguin en temps réel au Sénégal.
            </p>
          </div>
          
          <div className="flex bg-background border border-border p-2 rounded-2xl shadow-sm">
            <div className="px-6 py-3 border-r border-border">
              <div className="text-2xl font-black text-primary">14</div>
              <div className="text-xs font-semibold text-muted-foreground">Centres Actifs</div>
            </div>
            <div className="px-6 py-3">
              <div className="text-2xl font-black text-emerald-600">85%</div>
              <div className="text-xs font-semibold text-muted-foreground">Taux de couverture</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8 items-start animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
          
          {/* Left Sidebar: List & Filters */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card border border-border rounded-3xl p-6 shadow-xl shadow-black/5">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" /> Filtrer par Groupe
              </h3>
              <div className="flex flex-wrap gap-2">
                {FILTERS.map((f) => {
                  const active = f === filter;
                  return (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                        active
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105"
                          : "bg-background border border-border text-foreground hover:border-primary/50 hover:bg-primary/5"
                      }`}
                    >
                      {f}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {items.length === 0 ? (
                <div className="bg-card border border-dashed border-border rounded-3xl p-8 text-center text-muted-foreground">
                  Aucun résultat trouvé pour ce filtre.
                </div>
              ) : (
                items.map((it, i) => (
                  <article
                    key={i}
                    className="group rounded-3xl border border-border bg-card p-5 shadow-sm hover:shadow-xl hover:ring-2 hover:ring-primary/20 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-xl shadow-inner group-hover:scale-110 transition-transform">
                          {it.group}
                        </div>
                        <div>
                          <div className="font-bold leading-tight">{it.zone}</div>
                          <div className="text-xs font-semibold text-muted-foreground flex items-center flex-wrap gap-x-3 gap-y-1 mt-1">
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {it.region}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Délai: {it.delay}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div
                      className={`w-full py-2 px-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-colors ${
                        it.available
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : "bg-destructive/10 text-destructive border border-destructive/20"
                      }`}
                    >
                      {it.available ? (
                        <><CheckCircle2 className="w-4 h-4" /> Stock Disponible</>
                      ) : (
                        <><XCircle className="w-4 h-4" /> Rupture de Stock</>
                      )}
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>

          {/* Right Side: Map */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-[2rem] shadow-2xl shadow-black/10 overflow-hidden relative group">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-background/90 backdrop-blur border border-border px-4 py-2 rounded-full shadow-lg font-bold text-sm flex items-center gap-2 pointer-events-none">
                <Activity className="w-4 h-4 text-primary animate-pulse" /> 
                Réseau OSAMAK en direct
              </div>
              {/* Le conteneur de la carte est ajusté ici pour avoir une belle hauteur */}
              <div className="h-[600px] lg:h-[800px] w-full">
                <MapWrapper />
              </div>
            </div>
          </div>

        </div>
      </section>
    </SiteLayout>
  );
}
