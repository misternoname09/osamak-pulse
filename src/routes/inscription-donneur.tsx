import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Heart, User, Phone, Mail, Droplet, MapPin, Calendar, CheckCircle2, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/inscription-donneur")({
  head: () => ({
    meta: [
      { title: "Inscription donneur — OSAMAK" },
      { name: "description", content: "Inscrivez-vous comme donneur de sang OSAMAK et aidez à sauver des vies au Sénégal." },
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
  const [prefilled, setPrefilled] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("osamak.prefill");
      if (!raw) return;
      const data = JSON.parse(raw) as { birthYear?: string };
      if (data.birthYear) {
        setForm((f) => ({ ...f, birthYear: data.birthYear ?? f.birthYear }));
        setPrefilled(true);
      }
      sessionStorage.removeItem("osamak.prefill");
    } catch { /* ignore */ }
  }, []);

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
    
    if (Object.keys(e).length > 0) {
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
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
      /* ignore */
    }
    setSubmitted({ ref, name: form.fullName.trim() });
    setForm(INITIAL);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <SiteLayout>
      <section className="relative overflow-hidden bg-primary/5 pt-16 pb-32">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="mx-auto max-w-3xl px-4 relative z-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 rounded-full bg-background border border-primary/20 text-primary px-4 py-1.5 text-sm font-bold shadow-sm mb-6">
            <Heart className="w-4 h-4 fill-primary" /> Devenez Héros
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Rejoignez le réseau des <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Donneurs OSAMAK</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Inscrivez-vous pour être alerté immédiatement lorsqu'un patient proche de vous a un besoin urgent de votre groupe sanguin.
          </p>
          <div className="inline-flex">
            <Link to="/eligibilite" className="inline-flex items-center gap-2 text-sm font-bold text-accent bg-accent/10 px-5 py-2.5 rounded-full hover:bg-accent/20 transition-colors">
              🧪 Faire le test d'éligibilité d'abord
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-20 relative z-20 -mt-16">
        {prefilled && !submitted && (
          <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-700 font-medium flex items-center gap-3 shadow-sm animate-in fade-in">
            <CheckCircle2 className="w-6 h-6 shrink-0" /> Formulaire pré-rempli grâce à votre test d'éligibilité.
          </div>
        )}

        {submitted ? (
          <div className="rounded-[2rem] border border-border bg-card/80 backdrop-blur-xl p-10 text-center shadow-2xl animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>
            <h2 className="text-3xl font-black mb-4">Merci {submitted.name} !</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Votre inscription est validée. Vous faites désormais partie du réseau solidaire OSAMAK.
            </p>
            <div className="bg-background rounded-2xl p-6 border border-border inline-block text-left mb-8">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Votre Numéro de Donneur</div>
              <div className="text-2xl font-mono font-bold text-primary">{submitted.ref}</div>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => setSubmitted(null)}
                className="inline-flex items-center justify-center rounded-xl bg-secondary text-secondary-foreground px-6 py-3 font-bold hover:bg-secondary/80 transition-colors"
              >
                Inscrire un proche
              </button>
              <Link to="/" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-3 font-bold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all">
                Retour à l'accueil <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="rounded-[2rem] bg-card/80 backdrop-blur-xl border border-border/50 p-8 shadow-2xl space-y-8 animate-in fade-in duration-700">
            
            <div className="space-y-6">
              <h3 className="text-xl font-bold border-b border-border pb-2">Informations Personnelles</h3>
              <Field label="Nom complet *" error={errors.fullName} htmlFor="fullName" icon={<User className="w-5 h-5 text-muted-foreground" />}>
                <input
                  id="fullName" type="text" value={form.fullName} onChange={(e) => update("fullName", e.target.value)}
                  className={inputCls(!!errors.fullName)} placeholder="Ex: Aminata Diop" autoComplete="name"
                />
              </Field>

              <div className="grid gap-6 md:grid-cols-2">
                <Field label="Téléphone *" error={errors.phone} htmlFor="phone" icon={<Phone className="w-5 h-5 text-muted-foreground" />}>
                  <input
                    id="phone" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)}
                    className={inputCls(!!errors.phone)} placeholder="+221 77 123 45 67" autoComplete="tel"
                  />
                </Field>
                <Field label="Email (optionnel)" error={errors.email} htmlFor="email" icon={<Mail className="w-5 h-5 text-muted-foreground" />}>
                  <input
                    id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)}
                    className={inputCls(!!errors.email)} placeholder="aminata@example.sn" autoComplete="email"
                  />
                </Field>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold border-b border-border pb-2">Profil Médical & Géographique</h3>
              <div className="grid gap-6 md:grid-cols-3">
                <Field label="Groupe sanguin *" error={errors.bloodGroup} htmlFor="bloodGroup" icon={<Droplet className="w-5 h-5 text-primary" />}>
                  <select
                    id="bloodGroup" value={form.bloodGroup} onChange={(e) => update("bloodGroup", e.target.value)}
                    className={inputCls(!!errors.bloodGroup)}
                  >
                    <option value="">— Sélectionnez —</option>
                    {BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </Field>
                <Field label="Ville *" error={errors.city} htmlFor="city" icon={<MapPin className="w-5 h-5 text-accent" />}>
                  <select
                    id="city" value={form.city} onChange={(e) => update("city", e.target.value)}
                    className={inputCls(!!errors.city)}
                  >
                    <option value="">— Sélectionnez —</option>
                    {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Année de naissance *" error={errors.birthYear} htmlFor="birthYear" icon={<Calendar className="w-5 h-5 text-muted-foreground" />}>
                  <input
                    id="birthYear" type="number" inputMode="numeric" min={1900} max={new Date().getFullYear() - 18}
                    value={form.birthYear} onChange={(e) => update("birthYear", e.target.value)}
                    className={inputCls(!!errors.birthYear)} placeholder="Ex: 1995"
                  />
                </Field>
              </div>
            </div>

            <div className="bg-background border border-border rounded-2xl p-6">
              <label className="flex items-start gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => update("consent", e.target.checked)}
                  className="mt-1 h-5 w-5 accent-primary rounded cursor-pointer"
                />
                <span className="text-sm leading-relaxed font-medium">
                  Je consens à rejoindre le fichier des donneurs OSAMAK. J'accepte d'être contacté(e) par SMS ou appel en cas d'urgence transfusionnelle compatible avec mon groupe sanguin dans ma zone géographique.
                </span>
              </label>
              {errors.consent && (
                <p className="mt-3 text-sm text-destructive font-bold" role="alert">{errors.consent}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-5 rounded-full bg-primary text-primary-foreground font-extrabold text-xl hover:bg-primary/90 hover:scale-[1.02] transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-3"
            >
              <Heart className="w-6 h-6 fill-primary-foreground" /> Valider mon inscription
            </button>
            <p className="text-xs text-muted-foreground text-center font-medium">
              Vos données sont sécurisées. (Mode démo : stockage local uniquement).
            </p>
          </form>
        )}
      </section>
    </SiteLayout>
  );
}

function inputCls(hasError: boolean) {
  return `w-full rounded-xl border-2 bg-background pl-12 pr-4 py-3.5 font-medium focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all ${
    hasError ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"
  }`;
}

function Field({ label, htmlFor, error, icon, children }: { label: string; htmlFor: string; error?: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block font-bold mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {icon}
        </div>
        {children}
      </div>
      {error && <p className="mt-2 text-sm text-destructive font-bold" role="alert">{error}</p>}
    </div>
  );
}
