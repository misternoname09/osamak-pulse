import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OSAMAK — Urgences transfusionnelles au Sénégal" },
      { name: "description", content: "Trouvez un donneur de sang compatible en quelques minutes. Solution numérique vitale pour les urgences transfusionnelles au Sénégal." },
      { property: "og:title", content: "OSAMAK — Urgences transfusionnelles au Sénégal" },
      { property: "og:description", content: "Trouvez un donneur de sang compatible en quelques minutes. Solution numérique vitale pour les urgences transfusionnelles au Sénégal." },
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
      <DifyAgent />
    </SiteLayout>
  );
}

function DifyAgent() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleChange = (value: string) => {
    setQuery(value);
    if (value.trim()) setValidationError(null);
  };

  const ask = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!query.trim()) {
      setValidationError("Veuillez saisir une question avant d’interroger l’agent IA.");
      return;
    }
    setLoading(true);
    setError(null);
    setValidationError(null);
    setResult(null);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    let timedOut = false;
    const timeoutFlag = setTimeout(() => { timedOut = true; }, 10000);

    try {
      const res = await fetch("https://api.dify.ai/v1/workflows/run", {
        method: "POST",
        headers: {
          Authorization: "Bearer app-LGSZmJYt4J79PsGRtVQA344y",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: { query },
          response_mode: "blocking",
          user: "OSAMAK-" + Date.now(),
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      clearTimeout(timeoutFlag);
      if (!res.ok) throw new Error("http");
      const data = await res.json();
      const outputs = data?.data?.outputs;
      const text =
        typeof outputs === "string"
          ? outputs
          : outputs?.text ?? outputs?.answer ?? JSON.stringify(outputs, null, 2);
      setResult(text ?? "Aucune réponse reçue.");
    } catch {
      clearTimeout(timeout);
      clearTimeout(timeoutFlag);
      if (timedOut || controller.signal.aborted) {
        setError("La réponse prend trop de temps — réessayez");
      } else {
        setError("Service temporairement indisponible");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-20 bg-secondary/40">
      <div className="mx-auto max-w-3xl px-4">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold">
            <span>🤖</span> Agent IA OSAMAK
          </span>
          <h2 className="mt-3 text-2xl md:text-3xl font-bold">Consultez l'agent IA</h2>
          <p className="mt-2 text-muted-foreground text-sm">
            Posez une question sur OSAMAK et obtenez une réponse instantanée.
          </p>
        </div>

        <form onSubmit={ask} className="mt-8 rounded-2xl bg-card border border-border p-5 shadow-sm">
          <label htmlFor="dify-query" className="sr-only">Votre question</label>
          <textarea
            id="dify-query"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            rows={3}
            placeholder="question que repondre l'application"
            aria-invalid={!!validationError}
            aria-describedby={validationError ? "dify-error" : undefined}
            className={`w-full resize-none rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
              validationError ? "border-destructive" : "border-border"
            }`}
            disabled={loading}
          />
          {validationError && (
            <p id="dify-error" className="mt-2 text-sm text-destructive" role="alert">
              {validationError}
            </p>
          )}
          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50 hover:bg-primary/90 transition"
            >
              {loading && (
                <span className="inline-block w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
              )}
              Demander : 🤖Agent IA OSAMAK
            </button>
          </div>
        </form>

        {loading && (
          <div className="mt-5 flex items-center justify-center gap-3 text-sm text-muted-foreground">
            <span className="inline-block w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            Consultation de l'agent IA…
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive px-4 py-3 text-sm" role="alert">
            {error}
          </div>
        )}

        {result && !loading && (
          <div className="mt-5 rounded-xl bg-muted border border-border px-4 py-4 text-sm whitespace-pre-wrap leading-relaxed text-foreground">
            {result}
          </div>
        )}
      </div>
    </section>
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
