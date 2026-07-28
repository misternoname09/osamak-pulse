import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent, useEffect } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { CheckCircle2, XCircle, AlertCircle, ArrowRight, ShieldQuestion } from "lucide-react";

export const Route = createFileRoute("/eligibilite")({
  head: () => ({
    meta: [
      { title: "Test d'éligibilité — OSAMAK" },
      { name: "description", content: "Vérifiez rapidement si vous pouvez donner votre sang avec le test d'éligibilité OSAMAK." },
    ],
  }),
  component: EligibilitePage,
});

type FormState = {
  age: string;
  weight: string;
  gender: "female" | "male" | "";
  hasInfection: "yes" | "no" | "";
  isPregnantOrPostpartum: "yes" | "no" | "";
  hasRecentSurgeryTattoo: "yes" | "no" | "";
  hasChronicDisease: "yes" | "no" | "";
  takesRegularMeds: "yes" | "no" | "";
  malariaZoneTravel: "yes" | "no" | "";
  highRiskBehavior: "yes" | "no" | "";
  lastDonationMonths: string;
};

const INITIAL: FormState = {
  age: "",
  weight: "",
  gender: "",
  hasInfection: "",
  isPregnantOrPostpartum: "",
  hasRecentSurgeryTattoo: "",
  hasChronicDisease: "",
  takesRegularMeds: "",
  malariaZoneTravel: "",
  highRiskBehavior: "",
  lastDonationMonths: "",
};

type Result =
  | { status: "eligible"; title: string; message: string; icon: React.ReactNode; color: string; bg: string; borderColor: string }
  | { status: "temporary"; title: string; reasons: string[]; delay: string; icon: React.ReactNode; color: string; bg: string; borderColor: string }
  | { status: "ineligible"; title: string; reasons: string[]; icon: React.ReactNode; color: string; bg: string; borderColor: string }
  | null;

function EligibilitePage() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [result, setResult] = useState<Result>(null);

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
    setResult(null);
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};

    const age = Number(form.age);
    if (!form.age || age < 18 || age > 65) e.age = "L'âge requis est entre 18 et 65 ans.";

    const weight = Number(form.weight);
    if (!form.weight || weight < 50) e.weight = "Le poids minimum requis est de 50 kg.";

    if (!form.gender) e.gender = "Veuillez sélectionner votre sexe.";
    if (!form.hasInfection) e.hasInfection = "Réponse requise.";
    if (!form.hasRecentSurgeryTattoo) e.hasRecentSurgeryTattoo = "Réponse requise.";
    if (!form.hasChronicDisease) e.hasChronicDisease = "Réponse requise.";
    if (!form.takesRegularMeds) e.takesRegularMeds = "Réponse requise.";
    if (!form.malariaZoneTravel) e.malariaZoneTravel = "Réponse requise.";
    if (!form.highRiskBehavior) e.highRiskBehavior = "Réponse requise.";

    if (form.gender === "female" && !form.isPregnantOrPostpartum) {
      e.isPregnantOrPostpartum = "Réponse requise.";
    }

    if (form.lastDonationMonths) {
      const months = Number(form.lastDonationMonths);
      if (months < 0) e.lastDonationMonths = "Valeur invalide.";
    }

    setErrors(e);
    
    if (Object.keys(e).length > 0) {
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
    return Object.keys(e).length === 0;
  };

  const computeResult = (): Result => {
    const age = Number(form.age);
    const weight = Number(form.weight);
    const lastDonation = Number(form.lastDonationMonths) || Infinity;
    const minInterval = form.gender === "female" ? 4 : 3;

    const permanent: string[] = [];
    const temporary: string[] = [];

    if (age < 18 || age > 65) permanent.push("L'âge doit être compris entre 18 et 65 ans.");
    if (weight < 50) permanent.push("Le poids minimum est de 50 kg.");
    if (form.hasChronicDisease === "yes") permanent.push("Maladie chronique — avis médical nécessaire.");
    if (form.takesRegularMeds === "yes") permanent.push("Traitement médical en cours — consulter le CNTS.");
    if (form.highRiskBehavior === "yes") permanent.push("Comportement à risque — exclusion définitive ou temporaire selon critères CNTS.");

    if (form.hasInfection === "yes") temporary.push("Infection, rhume ou fièvre en cours — attendre la guérison complète (2 semaines).");
    if (form.isPregnantOrPostpartum === "yes") temporary.push("Grossesse ou post-partum — attendre 6 mois après l'accouchement.");
    if (form.hasRecentSurgeryTattoo === "yes") temporary.push("Chirurgie, tatouage ou piercing récent — délai de 4 mois.");
    if (form.malariaZoneTravel === "yes") temporary.push("Séjour récent en zone de paludisme — délai de 4 mois.");
    if (lastDonation < minInterval) temporary.push(`Délai insuffisant depuis le dernier don (minimum ${minInterval} mois).`);

    if (permanent.length > 0) {
      return {
        status: "ineligible",
        title: "Contre-indication au don",
        reasons: permanent,
        icon: <XCircle className="w-16 h-16" />,
        color: "text-destructive",
        bg: "bg-destructive/10",
        borderColor: "border-destructive/30"
      };
    }

    if (temporary.length > 0) {
      return {
        status: "temporary",
        title: "Temporairement non éligible",
        reasons: temporary,
        delay: "Reportez votre don et consultez un professionnel de santé si besoin.",
        icon: <AlertCircle className="w-16 h-16" />,
        color: "text-amber-600",
        bg: "bg-amber-500/10",
        borderColor: "border-amber-500/30"
      };
    }

    return {
      status: "eligible",
      title: "Félicitations, vous êtes éligible !",
      message: "Ce test est une indication. L'éligibilité finale sera confirmée par le questionnaire médical et l'entretien avec le personnel du CNTS le jour du don.",
      icon: <CheckCircle2 className="w-16 h-16" />,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
      borderColor: "border-emerald-500/30"
    };
  };

  const onSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    if (!validate()) return;
    const r = computeResult();
    setResult(r);
    
    // Auto-scroll au résultat
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);

    if (r?.status === "eligible") {
      try {
        const birthYear = new Date().getFullYear() - Number(form.age);
        sessionStorage.setItem(
          "osamak.prefill",
          JSON.stringify({ birthYear: String(birthYear), gender: form.gender }),
        );
      } catch { /* ignore */ }
    }
  };

  return (
    <SiteLayout>
      {/* Hero Premium */}
      <section className="relative overflow-hidden bg-primary/5 pt-16 pb-12">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="mx-auto max-w-4xl px-4 text-center relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 rounded-full bg-background border border-primary/20 text-primary px-4 py-1.5 text-sm font-bold shadow-sm mb-6">
            <ShieldQuestion className="w-4 h-4" /> Évaluation Rapide
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Test d'éligibilité au don
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez en moins de 2 minutes si vous pouvez donner votre sang aujourd'hui. Vos réponses sont strictement confidentielles.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 relative z-20 -mt-8">
        {result && (
          <div className={`mb-12 rounded-[2rem] border-2 p-8 text-center shadow-2xl animate-in zoom-in-95 duration-500 ${result.bg} ${result.borderColor} ${result.color} bg-background/80 backdrop-blur`}>
            <div className="flex justify-center mb-6">{result.icon}</div>
            <h2 className="text-3xl font-black mb-4">{result.title}</h2>
            
            {result.status === "eligible" && (
              <>
                <p className="text-lg font-medium mb-8 text-muted-foreground">{result.message}</p>
                <Link
                  to="/inscription-donneur"
                  className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-8 py-4 text-lg font-bold shadow-xl shadow-primary/30 hover:bg-primary/90 hover:scale-105 transition-all duration-300"
                >
                  M'inscrire maintenant <ArrowRight className="w-5 h-5" />
                </Link>
              </>
            )}
            
            {result.status === "temporary" && (
              <div className="max-w-md mx-auto text-left bg-background rounded-2xl p-6 border border-amber-500/20 shadow-sm">
                <ul className="space-y-3 font-medium">
                  {result.reasons.map((r, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 p-4 bg-amber-500/10 rounded-xl font-bold text-center">
                  {result.delay}
                </div>
                <button onClick={() => setResult(null)} className="mt-6 w-full py-3 rounded-full border-2 border-amber-500 text-amber-600 font-bold hover:bg-amber-500/10 transition-colors">
                  Refaire le test
                </button>
              </div>
            )}
            
            {result.status === "ineligible" && (
              <div className="max-w-md mx-auto text-left bg-background rounded-2xl p-6 border border-destructive/20 shadow-sm">
                <ul className="space-y-3 font-medium">
                  {result.reasons.map((r, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => setResult(null)} className="mt-6 w-full py-3 rounded-full border-2 border-destructive text-destructive font-bold hover:bg-destructive/10 transition-colors">
                  Refaire le test
                </button>
              </div>
            )}
          </div>
        )}

        {!result && (
          <form onSubmit={onSubmit} noValidate className="space-y-8 animate-in fade-in duration-700">
            {/* Profil de base */}
            <div className="bg-card border border-border p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-6">1. Votre profil</h3>
              <div className="grid gap-6 md:grid-cols-3">
                <Field label="Âge *" error={errors.age} htmlFor="age">
                  <input
                    id="age" type="number" inputMode="numeric" min={18} max={65}
                    value={form.age} onChange={(e) => update("age", e.target.value)}
                    className={inputCls(!!errors.age)} placeholder="Ex: 25"
                  />
                </Field>
                <Field label="Poids (kg) *" error={errors.weight} htmlFor="weight">
                  <input
                    id="weight" type="number" inputMode="numeric" min={30}
                    value={form.weight} onChange={(e) => update("weight", e.target.value)}
                    className={inputCls(!!errors.weight)} placeholder="Ex: 65"
                  />
                </Field>
                <Field label="Sexe *" error={errors.gender} htmlFor="gender">
                  <select
                    id="gender" value={form.gender}
                    onChange={(e) => update("gender", e.target.value as FormState["gender"])}
                    className={inputCls(!!errors.gender)}
                  >
                    <option value="">— Sélectionnez —</option>
                    <option value="female">Femme</option>
                    <option value="male">Homme</option>
                  </select>
                </Field>
              </div>
            </div>

            {/* Questions de santé */}
            <h3 className="text-xl font-bold mt-12 mb-4 px-2">2. Questionnaire médical</h3>
            
            <YesNoCard
              label="Avez-vous actuellement un rhume, une fièvre ou une infection ?"
              value={form.hasInfection} onChange={(v) => update("hasInfection", v)} error={errors.hasInfection}
            />

            {form.gender === "female" && (
              <YesNoCard
                label="Êtes-vous enceinte ou avez-vous accouché il y a moins de 6 mois ?"
                value={form.isPregnantOrPostpartum} onChange={(v) => update("isPregnantOrPostpartum", v)} error={errors.isPregnantOrPostpartum}
              />
            )}

            <YesNoCard
              label="Avez-vous subi une chirurgie, un tatouage ou un piercing dans les 4 derniers mois ?"
              value={form.hasRecentSurgeryTattoo} onChange={(v) => update("hasRecentSurgeryTattoo", v)} error={errors.hasRecentSurgeryTattoo}
            />

            <YesNoCard
              label="Souffrez-vous d'une maladie chronique (diabète, hypertension, asthme sévère, etc.) ?"
              value={form.hasChronicDisease} onChange={(v) => update("hasChronicDisease", v)} error={errors.hasChronicDisease}
            />

            <YesNoCard
              label="Prenez-vous des médicaments de façon régulière ?"
              value={form.takesRegularMeds} onChange={(v) => update("takesRegularMeds", v)} error={errors.takesRegularMeds}
            />

            <YesNoCard
              label="Avez-vous voyagé dans les 4 derniers mois dans une zone où le paludisme est présent ?"
              value={form.malariaZoneTravel} onChange={(v) => update("malariaZoneTravel", v)} error={errors.malariaZoneTravel}
            />

            <YesNoCard
              label="Avez-vous eu des comportements sexuels à risque dans les 4 derniers mois ?"
              value={form.highRiskBehavior} onChange={(v) => update("highRiskBehavior", v)} error={errors.highRiskBehavior}
            />

            <div className="bg-card border border-border p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold mb-4">Dernier don</h3>
              <Field
                label="Depuis combien de mois avez-vous fait votre dernier don de sang ? (laissez vide si c'est votre premier don)"
                error={errors.lastDonationMonths} htmlFor="lastDonationMonths"
              >
                <input
                  id="lastDonationMonths" type="number" inputMode="numeric" min={0}
                  value={form.lastDonationMonths} onChange={(e) => update("lastDonationMonths", e.target.value)}
                  className={inputCls(!!errors.lastDonationMonths)} placeholder="Ex: 6"
                />
              </Field>
            </div>

            <div className="pt-8">
              <button
                type="submit"
                className="w-full py-5 rounded-full bg-primary text-primary-foreground font-extrabold text-xl hover:bg-primary/90 hover:scale-[1.02] transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-3"
              >
                Vérifier mon résultat <ArrowRight className="w-6 h-6" />
              </button>
              <p className="text-sm text-muted-foreground text-center mt-6 px-4">
                Ce test est donné à titre indicatif. Seul l'entretien médical avec un médecin du CNTS validera définitivement votre aptitude au don.
              </p>
            </div>
          </form>
        )}
      </section>
    </SiteLayout>
  );
}

function YesNoCard({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: "yes" | "no" | "";
  onChange: (v: "yes" | "no") => void;
  error?: string;
}) {
  return (
    <div className={`bg-card border-2 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 ${error ? "border-destructive/50 bg-destructive/5" : "border-border/50"}`}>
      <h3 className="text-lg font-bold mb-5 leading-snug">{label}</h3>
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onChange("yes")}
          className={`py-4 rounded-2xl border-2 font-bold text-lg transition-all ${value === "yes" ? "border-destructive bg-destructive/10 text-destructive" : "border-border bg-background text-foreground hover:border-border/80"}`}
        >
          Oui
        </button>
        <button
          type="button"
          onClick={() => onChange("no")}
          className={`py-4 rounded-2xl border-2 font-bold text-lg transition-all ${value === "no" ? "border-emerald-500 bg-emerald-500/10 text-emerald-600" : "border-border bg-background text-foreground hover:border-border/80"}`}
        >
          Non
        </button>
      </div>
      {error && <p className="mt-3 text-sm text-destructive flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</p>}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return `w-full rounded-2xl border-2 bg-background px-5 py-4 font-medium focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all ${
    hasError ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"
  }`;
}

function Field({ label, htmlFor, error, children }: { label: string; htmlFor: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block font-bold mb-2">
        {label}
      </label>
      {children}
      {error && <p className="mt-2 text-sm text-destructive flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {error}</p>}
    </div>
  );
}
