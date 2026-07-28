import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Send, MapPin, Phone, Mail, Clock, MessageSquare, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — OSAMAK" },
      { name: "description", content: "Contactez l'équipe OSAMAK au Centre National de Transfusion Sanguine, Dakar, Sénégal." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  const inputCls = "w-full rounded-2xl border-2 border-border bg-background px-5 py-4 font-medium focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all";

  return (
    <SiteLayout>
      {/* Hero Premium */}
      <section className="relative overflow-hidden bg-primary/5 pt-16 pb-24 border-b border-border/50">
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2" />
        <div className="mx-auto max-w-6xl px-4 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 rounded-full bg-background border border-primary/20 text-primary px-4 py-1.5 text-sm font-bold shadow-sm mb-6">
            <MessageSquare className="w-4 h-4" /> Support & Partenariat
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Contactez l'équipe <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">OSAMAK</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Une question sur le don de sang, un partenariat hospitalier, ou une urgence à signaler ? Notre équipe du Centre National de Transfusion Sanguine vous répond au plus vite.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 -mt-16 relative z-20">
        <div className="grid gap-12 lg:grid-cols-5 items-start">
          
          {/* Informations de contact (Left) */}
          <div className="lg:col-span-2 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            <div className="bg-card border border-border p-8 rounded-[2rem] shadow-xl shadow-primary/5">
              <h2 className="text-2xl font-bold mb-8">Coordonnées</h2>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Siège CNTS</h3>
                    <p className="text-muted-foreground">Centre National de Transfusion Sanguine<br />Avenue Cheikh Anta Diop, Dakar</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Ligne d'Urgence</h3>
                    <p className="font-mono text-lg font-bold text-accent">+221 33 800 00 00</p>
                    <p className="text-xs font-semibold text-muted-foreground mt-1">Disponible 24h/24 et 7j/7</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Email</h3>
                    <a href="mailto:contact@osamak.sn" className="text-emerald-600 font-bold hover:underline">contact@osamak.sn</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border p-6 rounded-[2rem] shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h3 className="font-bold">Heures d'ouverture</h3>
                <p className="text-sm text-muted-foreground">Lundi - Samedi : 08h00 - 18h00</p>
              </div>
            </div>
          </div>

          {/* Formulaire (Right) */}
          <div className="lg:col-span-3">
            <form onSubmit={onSubmit} className="rounded-[2rem] bg-card/80 backdrop-blur border border-border p-8 md:p-10 shadow-2xl animate-in fade-in zoom-in-95 duration-700 delay-200">
              <h2 className="text-2xl font-bold mb-8">Envoyez-nous un message</h2>
              
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block font-bold mb-2 text-sm text-muted-foreground uppercase tracking-wide">Nom complet *</label>
                    <input
                      required className={inputCls} value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-2 text-sm text-muted-foreground uppercase tracking-wide">Téléphone *</label>
                    <input
                      required type="tel" className={inputCls} value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="Ex: +221 77..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-2 text-sm text-muted-foreground uppercase tracking-wide">Email *</label>
                  <input
                    required type="email" className={inputCls} value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="votre.email@exemple.sn"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-2 text-sm text-muted-foreground uppercase tracking-wide">Message *</label>
                  <textarea
                    required rows={6} className={`${inputCls} resize-none`} value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Comment pouvons-nous vous aider ?"
                  />
                </div>

                {sent && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 p-4 rounded-xl font-bold text-center flex items-center justify-center gap-2 animate-in zoom-in">
                    <CheckCircle2 className="w-5 h-5" /> Votre message a bien été envoyé !
                  </div>
                )}

                <button
                  type="submit"
                  disabled={sent}
                  className="w-full py-5 rounded-full bg-primary text-primary-foreground font-extrabold text-lg hover:bg-primary/90 hover:scale-[1.02] transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
                >
                  <Send className="w-5 h-5" /> Envoyer le message
                </button>
              </div>
            </form>
          </div>

        </div>
      </section>
    </SiteLayout>
  );
}
