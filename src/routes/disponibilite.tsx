import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { BloodCentersMap } from "@/components/BloodCentersMap";

export const Route = createFileRoute("/disponibilite")({
  head: () => ({
    meta: [
      { title: "Disponibilité du sang — OSAMAK" },
      { name: "description", content: "Consultez la disponibilité du sang par groupe et par zone dans les centres partenaires du Sénégal." },
      { property: "og:title", content: "Disponibilité du sang — OSAMAK" },
      { property: "og:description", content: "Groupe sanguin, zone, délai moyen et statut de disponibilité en temps réel." },
    ],
  }),
  component: DisponibilitePage,
});

type Item = {
  group: string;
  zone: string;
  delay: string;
  available: boolean;
};

const DATA: Item[] = [
  { group: "O+", zone: "CNTS Dakar", delay: "2–3h", available: true },
  { group: "A+", zone: "Hôpital Principal Dakar", delay: "4h", available: true },
  { group: "AB-", zone: "Thiès", delay: "6h", available: false },
  { group: "B+", zone: "Hôpital Fann", delay: "3h", available: true },
  { group: "O-", zone: "Saint-Louis", delay: "5h", available: true },
  { group: "A-", zone: "Kaolack", delay: "4h", available: true },
];

const FILTERS = ["Tous", "O+", "A+", "B+", "AB-"] as const;
type Filter = (typeof FILTERS)[number];

function DisponibilitePage() {
  const [filter, setFilter] = useState<Filter>("Tous");
  const items = filter === "Tous" ? DATA : DATA.filter((d) => d.group === filter);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <header className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Disponibilité du sang
          </h1>
          <p className="mt-3 text-muted-foreground">
            Consultez en temps réel la disponibilité par groupe sanguin dans les centres partenaires au Sénégal.
          </p>
        </header>

        <div className="mt-8 flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const active = f === filter;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={
                  "px-4 py-2 rounded-full text-sm font-semibold border transition " +
                  (active
                    ? "bg-primary text-primary-foreground border-primary shadow"
                    : "bg-card text-foreground border-border hover:border-primary/50")
                }
              >
                {f}
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <article
              key={i}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-extrabold text-lg">
                    {it.group}
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">Groupe sanguin</div>
                    <div className="font-semibold">{it.group}</div>
                  </div>
                </div>
                <span
                  className={
                    "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold " +
                    (it.available
                      ? "bg-success/15 text-success"
                      : "bg-destructive/10 text-destructive")
                  }
                >
                  <span className={"w-2 h-2 rounded-full " + (it.available ? "bg-success" : "bg-destructive")} />
                  {it.available ? "Disponible" : "Indisponible"}
                </span>
              </div>
              <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-muted-foreground text-xs uppercase tracking-wide">Zone</dt>
                  <dd className="mt-1 font-medium">{it.zone}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs uppercase tracking-wide">Délai moyen</dt>
                  <dd className="mt-1 font-medium">{it.delay}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>

        {items.length === 0 && (
          <p className="mt-8 text-center text-muted-foreground">Aucun résultat pour ce filtre.</p>
        )}

        <div className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight">Carte des centres de don</h2>
          <p className="mt-2 text-muted-foreground">
            Visualisez les centres de don de sang à Dakar et leurs disponibilités.
          </p>
          <BloodCentersMap />
        </div>
      </section>
    </SiteLayout>
  );
}
