import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/inscription-donneur")({
  head: () => ({
    meta: [
      { title: "Inscription donneur — OSAMAK" },
      { name: "description", content: "Inscrivez-vous comme donneur de sang OSAMAK et aidez à sauver des vies au Sénégal." },
      { property: "og:title", content: "Inscription donneur — OSAMAK" },
      { property: "og:description", content: "Devenez donneur de sang OSAMAK au Sénégal." },
    ],
  }),
  component: InscriptionDonneurPage,
});

type FormState = {
  fullName: string;
  phone: string;
  email: string;
  bloodGroup: string;
  city: string;
  birthYear: string;
  consent: boolean;
};

const INITIAL: FormState = {
  fullName: "",
  phone: "",
  email: "",
  bloodGroup: "",
  city: "",
  birthYear: "",
  consent: false,
};

const BLOOD_GROUPS = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];
const CITIES = ["Dakar", "Thiès", "Saint-Louis", "Kaolack", "Ziguinchor", "Touba", "Autre"];

function InscriptionDonneurPage() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitted, setSubmitted] = useState<null | { ref: string; name: string }>(null);

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.fullName.trim() || form.fullName.trim().length < 2) e.fullName = "Nom complet requis.";
    if (!/^(\+?221)?\s?[0-9\s]{7,15}$/.test(form.phone.trim())) e.phone = "Numéro invalide (ex. +221 77 123 45 67).";
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "Email invalide.";
    if (!BLOOD_GROUPS.includes(form.bloodGroup)) e.bloodGroup = "Sélectionnez votre groupe sanguin.";
    if (!form.city) e.city = "Sélectionnez votre ville.";
    const year = Number(form.birthYear);
    const nowY = new Date().getFullYear();
    if (!year || year < 1900 || year > nowY - 18) e.birthYear = "Vous devez avoir au moins 18 ans.";
    if (!form.consent) e.consent = "Vous devez accepter d'être contacté.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    if (!validate()) return;

    const ref = "OSA-" + Date.now().toString(36).toUpperCase();
    try {
      const existing = JSON.parse(localStorage.getItem("osamak.donors") || "[]");
      existing.push({ ...form, ref, createdAt: new Date().toISOString() });
      localStorage.setItem("osamak.donors", JSON.stringify(existing));
    } catch {
      /* ignore storage errors */
    }
    setSubmitted({ ref, name: form.fullName.trim() });
    setForm(INITIAL);
  };

  return (
    <SiteLayout>
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-2xl px-4">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold">
              🩸 Devenez donneur
            </span>
            <h1 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight">
              Inscription donneur OSAMAK
            </h1>
            <p className="mt-3 text-muted-foreground">
              Rejoignez le réseau OSAMAK et recevez une alerte quand votre groupe sanguin est nécessaire près de chez vous.
            </p>
            <div className="mt-4">
              <Link to="/eligibilite" className="inline-flex items-center text-sm font-semibold text-accent hover:underline">
                🧪 Faire le test d'éligibilité avant de s'inscrire
              </Link>
            </div>

          </div>

          {submitted ? (
            <div className="mt-10 rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center">
              <div className="text-4xl">✅</div>
              <h2 className="mt-3 text-xl font-bold text-primary">Merci {submitted.name} !</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Votre inscription a été enregistrée. Référence : <span className="font-mono font-semibold">{submitted.ref}</span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Un membre du CNTS vous contactera pour valider votre éligibilité au don.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => setSubmitted(null)}
                  className="inline-flex items-center rounded-md bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:bg-primary/90"
                >
                  Inscrire un autre donneur
                </button>
                <Link to="/" className="inline-flex items-center rounded-md bg-accent text-accent-foreground px-5 py-2.5 text-sm font-semibold hover:bg-accent/90">
                  Retour à l'accueil
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="mt-10 rounded-2xl bg-card border border-border p-6 shadow-sm space-y-5">
              <Field label="Nom complet *" error={errors.fullName} htmlFor="fullName">
                <input
                  id="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  className={inputCls(!!errors.fullName)}
                  placeholder="Aminata Diop"
                  autoComplete="name"
                />
              </Field>

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Téléphone *" error={errors.phone} htmlFor="phone">
                  <input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className={inputCls(!!errors.phone)}
                    placeholder="+221 77 123 45 67"
                    autoComplete="tel"
                  />
                </Field>
                <Field label="Email (optionnel)" error={errors.email} htmlFor="email">
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className={inputCls(!!errors.email)}
                    placeholder="aminata@example.sn"
                    autoComplete="email"
                  />
                </Field>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <Field label="Groupe sanguin *" error={errors.bloodGroup} htmlFor="bloodGroup">
                  <select
                    id="bloodGroup"
                    value={form.bloodGroup}
                    onChange={(e) => update("bloodGroup", e.target.value)}
                    className={inputCls(!!errors.bloodGroup)}
                  >
                    <option value="">—</option>
                    {BLOOD_GROUPS.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Ville *" error={errors.city} htmlFor="city">
                  <select
                    id="city"
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                    className={inputCls(!!errors.city)}
                  >
                    <option value="">—</option>
                    {CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Année de naissance *" error={errors.birthYear} htmlFor="birthYear">
                  <input
                    id="birthYear"
                    type="number"
                    inputMode="numeric"
                    min={1900}
                    max={new Date().getFullYear() - 18}
                    value={form.birthYear}
                    onChange={(e) => update("birthYear", e.target.value)}
                    className={inputCls(!!errors.birthYear)}
                    placeholder="1995"
                  />
                </Field>
              </div>

              <div>
                <label className="flex items-start gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={(e) => update("consent", e.target.checked)}
                    className="mt-1 h-4 w-4 accent-primary"
                  />
                  <span className="text-muted-foreground">
                    J'accepte d'être contacté par OSAMAK / CNTS en cas d'urgence transfusionnelle correspondant à mon groupe sanguin.
                  </span>
                </label>
                {errors.consent && (
                  <p className="mt-1 text-sm text-destructive" role="alert">{errors.consent}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold shadow-lg shadow-primary/25 hover:bg-primary/90 transition"
              >
                🩸 Valider mon inscription
              </button>
              <p className="text-xs text-muted-foreground text-center">
                Vos données sont enregistrées localement dans cette démo. Aucun envoi vers un serveur tiers.
              </p>
            </form>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

function inputCls(hasError: boolean) {
  return `w-full rounded-xl border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
    hasError ? "border-destructive" : "border-border"
  }`;
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium mb-1.5">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-sm text-destructive" role="alert">{error}</p>
      )}
    </div>
  );
}
