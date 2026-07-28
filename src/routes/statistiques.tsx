import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Activity, Heart, Users, AlertTriangle, TrendingUp, Droplets, Info } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell,
  ReferenceLine,
} from "recharts";

export const Route = createFileRoute("/statistiques")({
  head: () => ({
    meta: [
      { title: "Statistiques et Pénuries — OSAMAK" },
      { name: "description", content: "Consultez les statistiques du don de sang et les pénuries actuelles au Sénégal." },
    ],
  }),
  component: StatistiquesPage,
});

const monthlyData = [
  { name: "Jan", dons: 1200 },
  { name: "Fév", dons: 1150 },
  { name: "Mar", dons: 1400 },
  { name: "Avr", dons: 980 },
  { name: "Mai", dons: 1050 },
  { name: "Juin", dons: 1350 },
  { name: "Juil", dons: 850 },
];

const bloodStockData = [
  { group: "O+", stock: 85, ideal: 100 },
  { group: "A+", stock: 75, ideal: 100 },
  { group: "B+", stock: 60, ideal: 100 },
  { group: "AB+", stock: 90, ideal: 100 },
  { group: "O-", stock: 15, ideal: 100 }, // Pénurie critique
  { group: "A-", stock: 25, ideal: 100 },
  { group: "B-", stock: 30, ideal: 100 },
  { group: "AB-", stock: 45, ideal: 100 },
];

const getStockColor = (stock: number) => {
  if (stock < 20) return "#ef4444"; // red-500 (critique)
  if (stock < 40) return "#f97316"; // orange-500 (alerte)
  if (stock < 70) return "#eab308"; // yellow-500 (moyen)
  return "#10b981"; // emerald-500 (optimal)
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover text-popover-foreground border border-border shadow-xl rounded-xl p-4 animate-in zoom-in-95 duration-200">
        <p className="font-bold mb-2 flex items-center gap-2">
          {label} <Droplets className="w-4 h-4 text-primary" />
        </p>
        <div className="space-y-1">
          <p className="text-sm">
            <span className="text-muted-foreground">Volume : </span>
            <span className="font-semibold">{payload[0].value} poches</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

function StatistiquesPage() {
  return (
    <SiteLayout>
      {/* Hero Section avec un beau dégradé */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background pt-16 pb-12 border-b border-border/50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="mx-auto max-w-6xl px-4 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <header className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-primary/20 text-primary text-sm font-bold mb-6 shadow-sm">
              <Activity className="w-4 h-4" /> Observatoire National
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              L'impact de la communauté <span className="text-primary">OSAMAK</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Visualisez en temps réel l'état des réserves de sang et découvrez comment chaque don fait la différence dans les hôpitaux sénégalais.
            </p>
          </header>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        {/* Section KPIs très visuelle */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-100 fill-mode-both">
          
          <div className="group relative overflow-hidden bg-card rounded-3xl p-6 ring-1 ring-border shadow-lg shadow-black/5 hover:shadow-xl hover:ring-primary/50 transition-all duration-300">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Heart className="w-24 h-24 text-primary" />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-muted-foreground mb-1">Vies Sauvées</h3>
              <div className="text-4xl font-extrabold text-foreground mb-2">2,543</div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold">
                <TrendingUp className="w-3.5 h-3.5" /> +12% ce mois
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-card rounded-3xl p-6 ring-1 ring-border shadow-lg shadow-black/5 hover:shadow-xl hover:ring-accent/50 transition-all duration-300">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Users className="w-24 h-24 text-accent" />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-muted-foreground mb-1">Donneurs Actifs</h3>
              <div className="text-4xl font-extrabold text-foreground mb-2">14,208</div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold">
                Prêts à intervenir
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-destructive/5 rounded-3xl p-6 ring-1 ring-destructive/20 shadow-lg shadow-destructive/5 hover:shadow-xl hover:ring-destructive/50 transition-all duration-300">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <AlertTriangle className="w-24 h-24 text-destructive" />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-destructive/20 text-destructive rounded-2xl flex items-center justify-center mb-6 animate-pulse">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-destructive/80 mb-1">Urgences Actuelles</h3>
              <div className="text-4xl font-extrabold text-destructive mb-2">42</div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-bold">
                En attente de sang
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-card rounded-3xl p-6 ring-1 ring-border shadow-lg shadow-black/5 hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Activity className="w-24 h-24 text-foreground" />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-muted text-foreground rounded-2xl flex items-center justify-center mb-6">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-muted-foreground mb-1">Délai Moyen</h3>
              <div className="text-4xl font-extrabold text-foreground mb-2">1h 45m</div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold">
                <TrendingUp className="w-3.5 h-3.5" /> -30 min (rapide)
              </div>
            </div>
          </div>

        </div>

        {/* Section Graphiques */}
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200 fill-mode-both">
          
          {/* Bar Chart: Stocks avec alerte visuelle */}
          <div className="bg-card rounded-[2rem] p-8 ring-1 ring-border shadow-xl shadow-black/5">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
              <div>
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                  Niveau des Stocks <span className="px-3 py-1 rounded-full bg-muted text-xs font-semibold">Temps Réel</span>
                </h2>
                <p className="text-muted-foreground max-w-xl">
                  État actuel des réserves dans les hôpitaux partenaires. Les groupes en dessous de la ligne rouge sont en <strong>pénurie critique</strong>.
                </p>
              </div>
              
              {/* Légende ergonomique */}
              <div className="flex flex-wrap gap-3 bg-background border border-border p-3 rounded-2xl text-xs font-medium">
                <div className="flex items-center gap-2 px-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Optimal</div>
                <div className="flex items-center gap-2 px-2"><div className="w-3 h-3 rounded-full bg-yellow-500"></div> Moyen</div>
                <div className="flex items-center gap-2 px-2"><div className="w-3 h-3 rounded-full bg-orange-500"></div> Alerte</div>
                <div className="flex items-center gap-2 px-2"><div className="w-3 h-3 rounded-full bg-red-500"></div> Critique</div>
              </div>
            </div>

            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bloodStockData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
                  <XAxis dataKey="group" axisLine={false} tickLine={false} tick={{ fontSize: 14, fontWeight: 700, fill: 'currentColor' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'currentColor' }} opacity={0.6} />
                  <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip />} />
                  <ReferenceLine y={20} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: 'Seuil Critique', fill: '#ef4444', fontSize: 12, fontWeight: 600 }} />
                  <Bar dataKey="stock" radius={[8, 8, 8, 8]} barSize={40}>
                    {bloodStockData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getStockColor(entry.stock)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Alerte textuelle contextuelle */}
            <div className="mt-8 bg-destructive/5 border border-destructive/20 rounded-2xl p-4 flex gap-4 items-start">
              <div className="p-2 bg-destructive/10 rounded-full text-destructive shrink-0">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-destructive">Urgence O- et A-</h4>
                <p className="text-sm text-destructive/80 mt-1">
                  Les réserves de sang O- et A- sont actuellement en deçà du seuil critique. Si vous êtes de l'un de ces groupes, votre don peut sauver une vie immédiatement.
                </p>
              </div>
            </div>
          </div>

          {/* Area Chart: Evolution avec dégradé premium */}
          <div className="bg-card rounded-[2rem] p-8 ring-1 ring-border shadow-xl shadow-black/5">
            <h2 className="text-2xl font-bold mb-2">Évolution des Dons (2026)</h2>
            <p className="text-muted-foreground mb-8">
              Tendance mensuelle des poches de sang collectées grâce aux donneurs de la plateforme.
            </p>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorDonsPremium" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e11d48" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 13, fontWeight: 500, fill: 'currentColor' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'currentColor' }} opacity={0.6} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="dons" 
                    stroke="#e11d48" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorDonsPremium)" 
                    activeDot={{ r: 6, fill: "#e11d48", stroke: "white", strokeWidth: 3 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </section>
    </SiteLayout>
  );
}
