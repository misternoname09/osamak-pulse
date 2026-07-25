import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/eligibilite")({
  head: () => ({
    meta: [
      { title: "Test d'éligibilité — OSAMAK" },
      { name: "description", content: "Vérifiez rapidement si vous pouvez donner votre sang avec le test d'éligibilité OSAMAK." },
      { property: "og:title", content: "Test d'éligibilité — OSAMAK" },
      { property: "og:description", content: "Vérifiez rapidement si vous pouvez donner votre sang." },
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
  | { status: "eligible"; title: string; message: string; icon: string }
  | { status: "temporary"; title: string; reasons: string[]; delay: string; icon: string }
  | { status: "ineligible"; title: string; reasons: string[]; icon: string }
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
    if (!form.age || age < 18 || age > 65) e.age = "Âge requis : entre 18 et 65 ans.";

    const weight = Number(form.weight);
    if (!form.weight || weight < 50) e.weight = "Poids minimum requis : 50 kg.";

    if (!form.gender) e.gender = "Sélectionnez votre sexe.";
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
        icon: "🚫",
      };
    }

    if (temporary.length > 0) {
      return {
        status: "temporary",
        title: "Temporairement non éligible",
        reasons: temporary,
        delay: "Reportez votre don et consultez un professionnel de santé si besoin.",
        icon: "⏸️",
      };
    }

    return {
      status: "eligible",
      title: "Vous semblez éligible au don de sang",
      message: "Ce test est une indication. L'éligibilité finale sera confirmée par le questionnaire médical et l'entretien avec le personnel du CNTS le jour du don.",
      icon: "✅",
    };
  };

  const onSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    if (!validate()) return;
    const r = computeResult();
    setResult(r);
    if (r?.status === "eligible") {
      try {
        const birthYear = new Date().getFullYear() - Number(form.age);
        sessionStorage.setItem(
          "osamak.prefill",
          JSON.stringify({ birthYear: String(birthYear), gender: form.gender }),
        );
      } catch { /* ignore */ }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <SiteLayout>
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-2xl px-4">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold">
              🩸 Test rapide
            </span>
            <h1 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-primary">
              Suis-je éligible au don de sang ?
            </h1>
            <p className="mt-3 text-muted-foreground">
              Répondez à quelques questions pour connaître votre éligibilité indicative.
            </p>
          </div>

          {result && (
            <div
              className={`mt-8 rounded-2xl border p-6 text-center ${
                result.status === "eligible"
                  ? "border-success/30 bg-success/10"
                  : result.status === "temporary"
                  ? "border-amber-500/30 bg-amber-500/10"
                  : "border-destructive/30 bg-destructive/10"
              }`}
            >
              <div className="text-4xl">{result.icon}</div>
              <h2
                className={`mt-3 text-xl font-bold ${
                  result.status === "eligible"
                    ? "text-success"
                    : result.status === "temporary"
                    ? "text-amber-700"
                    : "text-destructive"
                }`}
              >
                {result.title}
              </h2>
              {result.status === "eligible" && (
                <p className="mt-2 text-sm text-muted-foreground">{result.message}</p>
              )}
              {result.status === "temporary" && (
                <>
                  <ul className="mt-3 text-sm text-left list-disc pl-5 space-y-1 text-muted-foreground">
                    {result.reasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                  <p className="mt-3 text-sm font-medium text-amber-700">{result.delay}</p>
                </>
              )}
              {result.status === "ineligible" && (
                <ul className="mt-3 text-sm text-left list-disc pl-5 space-y-1 text-muted-foreground">
                  {result.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              )}
              {result.status === "eligible" && (
                <div className="mt-6">
                  <Link
                    to="/inscription-donneur"
                    className="inline-flex items-center rounded-md bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:bg-primary/90 transition"
                  >
                    S'inscrire comme donneur →
                  </Link>
                </div>
              )}
            </div>
          )}

          <form onSubmit={onSubmit} noValidate className="mt-10 rounded-2xl bg-card border border-border p-6 shadow-sm space-y-6">
            <div className="grid gap-5 md:grid-cols-3">
              <Field label="Âge *" error={errors.age} htmlFor="age">
                <input
                  id="age"
                  type="number"
                  inputMode="numeric"
                  min={18}
                  max={65}
                  value={form.age}
                  onChange={(e) => update("age", e.target.value)}
                  className={inputCls(!!errors.age)}
                  placeholder="25"
                />
              </Field>
              <Field label="Poids (kg) *" error={errors.weight} htmlFor="weight">
                <input
                  id="weight"
                  type="number"
                  inputMode="numeric"
                  min={30}
                  value={form.weight}
                  onChange={(e) => update("weight", e.target.value)}
                  className={inputCls(!!errors.weight)}
                  placeholder="65"
                />
              </Field>
              <Field label="Sexe *" error={errors.gender} htmlFor="gender">
                <select
                  id="gender"
                  value={form.gender}
                  onChange={(e) => update("gender", e.target.value as FormState["gender"])}
                  className={inputCls(!!errors.gender)}
                >
                  <option value="">—</option>
                  <option value="female">Femme</option>
                  <option value="male">Homme</option>
                </select>
              </Field>
            </div>

            <YesNoGroup
              label="Avez-vous actuellement un rhume, une fièvre ou une infection ?"
              value={form.hasInfection}
              onChange={(v) => update("hasInfection", v)}
              error={errors.hasInfection}
              name="hasInfection"
            />

            {form.gender === "female" && (
              <YesNoGroup
                label="Êtes-vous enceinte ou avez-vous accouché il y a moins de 6 mois ?"
                value={form.isPregnantOrPostpartum}
                onChange={(v) => update("isPregnantOrPostpartum", v)}
                error={errors.isPregnantOrPostpartum}
                name="isPregnantOrPostpartum"
              />
            )}

            <YesNoGroup
              label="Avez-vous subi une chirurgie, un tatouage ou un piercing dans les 4 derniers mois ?"
              value={form.hasRecentSurgeryTattoo}
              onChange={(v) => update("hasRecentSurgeryTattoo", v)}
              error={errors.hasRecentSurgeryTattoo}
              name="hasRecentSurgeryTattoo"
            />

            <YesNoGroup
              label="Souffrez-vous d'une maladie chronique (diabète, hypertension, asthme sévère, etc.) ?"
              value={form.hasChronicDisease}
              onChange={(v) => update("hasChronicDisease", v)}
              error={errors.hasChronicDisease}
              name="hasChronicDisease"
            />

            <YesNoGroup
              label="Prenez-vous des médicaments de façon régulière ?"
              value={form.takesRegularMeds}
              onChange={(v) => update("takesRegularMeds", v)}
              error={errors.takesRegularMeds}
              name="takesRegularMeds"
            />

            <YesNoGroup
              label="Avez-vous voyagé dans les 4 derniers mois dans une zone où le paludisme est présent ?"
              value={form.malariaZoneTravel}
              onChange={(v) => update("malariaZoneTravel", v)}
              error={errors.malariaZoneTravel}
              name="malariaZoneTravel"
            />

            <YesNoGroup
              label="Avez-vous eu des comportements sexuels à risque dans les 4 derniers mois ?"
              value={form.highRiskBehavior}
              onChange={(v) => update("highRiskBehavior", v)}
              error={errors.highRiskBehavior}
              name="highRiskBehavior"
            />

            <Field
              label="Depuis combien de mois avez-vous fait votre dernier don de sang ? (laisser vide si jamais)"
              error={errors.lastDonationMonths}
              htmlFor="lastDonationMonths"
            >
              <input
                id="lastDonationMonths"
                type="number"
                inputMode="numeric"
                min={0}
                value={form.lastDonationMonths}
                onChange={(e) => update("lastDonationMonths", e.target.value)}
                className={inputCls(!!errors.lastDonationMonths)}
                placeholder="Ex: 6"
              />
            </Field>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold shadow-lg shadow-primary/25 hover:bg-primary/90 transition"
            >
              🩸 Vérifier mon éligibilité
            </button>

            <p className="text-xs text-muted-foreground text-center">
              Ce test ne remplace pas l'entretien médical obligatoire avant tout don. Les critères peuvent varier selon les règles du CNTS.
            </p>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}

function YesNoGroup({
  label,
  name,
  value,
  onChange,
  error,
}: {
  label: string;
  name: string;
  value: "yes" | "no" | "";
  onChange: (v: "yes" | "no") => void;
  error?: string;
}) {
  return (
    <fieldset>
      <legend className="block text-sm font-medium mb-3">{label}</legend>
      <div className="flex gap-4">
        <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="radio"
            name={name}
            value="yes"
            checked={value === "yes"}
            onChange={() => onChange("yes")}
            className="h-4 w-4 accent-primary"
          />
          Oui
        </label>
        <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="radio"
            name={name}
            value="no"
            checked={value === "no"}
            onChange={() => onChange("no")}
            className="h-4 w-4 accent-primary"
          />
          Non
        </label>
      </div>
      {error && <p className="mt-1 text-sm text-destructive" role="alert">{error}</p>}
    </fieldset>
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
