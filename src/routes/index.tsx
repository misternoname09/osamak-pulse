import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OSAMAK — Urgences transfusionnelles au Sénégal" },
      { name: "description", content: "Trouvez un donneur de sang compatible en quelques minutes. Solution numérique vitale pour les urgences transfusionnelles au Sénégal." },
      { property: "og:title", content: "OSAMAK — Sauver des vies, plus vite" },
      { property: "og:description", content: "Mise en relation rapide entre patients et donneurs compatibles au Sénégal." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <SiteLayout>
      <Hero />
      <Stats />
      <HowItWorks />
    </SiteLayout>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      <div className="mx-auto max-w-6xl px-4 py-20 md:py-28 grid gap-10 md:grid-cols-2 items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Urgences transfusionnelles
          </span>
          <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Trouvez un donneur compatible en <span className="text-primary">quelques minutes</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-xl">
            Une solution numérique vitale pour les urgences transfusionnelles au Sénégal.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold shadow-lg shadow-primary/25 hover:bg-primary/90 transition">
              S'inscrire comme donneur
            </button>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-md bg-accent text-accent-foreground px-6 py-3 text-sm font-semibold hover:bg-accent/90 transition"
            >
              Signaler une urgence
            </Link>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-square max-w-md mx-auto rounded-3xl bg-gradient-to-br from-primary to-accent p-1 shadow-2xl">
            <div className="w-full h-full rounded-3xl bg-card flex items-center justify-center">
              <div className="text-center p-8">
                <div className="text-8xl">🩸</div>
                <p className="mt-4 text-2xl font-bold text-primary">OSAMAK</p>
                <p className="mt-2 text-sm text-muted-foreground">Chaque minute compte</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    { value: "12 000", label: "urgences transfusionnelles par an au Sénégal" },
    { value: "35%", label: "des donneurs refusés pour inéligibilité médicale" },
    { value: "2–3 h", label: "de délai moyen pour trouver un donneur à Dakar" },
  ];
  return (
    <section className="py-16 md:py-20 bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center">Une réalité qui appelle à agir</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map((s) => (
            <div key={s.label} className="rounded-2xl bg-card border border-border p-8 text-center shadow-sm">
              <div className="text-4xl md:text-5xl font-extrabold text-primary">{s.value}</div>
              <p className="mt-3 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "1", t: "Inscription rapide", d: "Créez votre profil donneur en moins de 2 minutes." },
    { n: "2", t: "Notification ciblée", d: "Recevez une alerte si votre groupe sanguin est nécessaire près de chez vous." },
    { n: "3", t: "Don sécurisé", d: "Rendez-vous au centre partenaire le plus proche en toute confidentialité." },
  ];
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center">Comment ça marche</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="rounded-2xl border border-border p-6">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                {s.n}
              </div>
              <h3 className="mt-4 font-semibold text-lg">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
