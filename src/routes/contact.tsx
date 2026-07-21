import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — OSAMAK" },
      { name: "description", content: "Contactez l'équipe OSAMAK au Centre National de Transfusion Sanguine, Dakar, Sénégal." },
      { property: "og:title", content: "Contact — OSAMAK" },
      { property: "og:description", content: "Envoyez-nous un message pour toute question sur les urgences transfusionnelles." },
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

  const input =
    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition";

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16 grid gap-10 md:grid-cols-2">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Contactez-nous</h1>
          <p className="mt-3 text-muted-foreground">
            Une question, un partenariat, ou une urgence à signaler ? Notre équipe vous répond rapidement.
          </p>

          <div className="mt-8 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-semibold">Adresse</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Centre National de Transfusion Sanguine<br />
              Dakar, Sénégal
            </p>
            <div className="mt-4 pt-4 border-t border-border text-sm">
              <p className="text-muted-foreground">Email : <span className="text-foreground">contact@osamak.sn</span></p>
              <p className="text-muted-foreground mt-1">Urgences : <span className="text-primary font-semibold">+221 33 000 00 00</span></p>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom complet</label>
            <input
              required
              className={input}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              maxLength={100}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">E-mail</label>
            <input
              required
              type="email"
              className={input}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              maxLength={255}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Téléphone</label>
            <input
              required
              type="tel"
              className={input}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              maxLength={30}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea
              required
              rows={5}
              className={input}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              maxLength={1000}
            />
          </div>
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold shadow hover:bg-primary/90 transition"
          >
            Envoyer le message
          </button>
          {sent && (
            <p className="text-sm text-success font-medium text-center">
              ✓ Merci ! Votre message a bien été envoyé.
            </p>
          )}
        </form>
      </section>
    </SiteLayout>
  );
}
