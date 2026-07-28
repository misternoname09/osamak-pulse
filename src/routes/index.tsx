import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent, useRef, useEffect } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Heart, Activity, Clock, ShieldCheck, MapPin, Send, Bot, User, ArrowRight, Droplets } from "lucide-react";

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

function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-20 pb-32 lg:pt-32 lg:pb-40">
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 text-primary px-4 py-1.5 text-sm font-bold shadow-sm mb-6">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            Urgences Transfusionnelles
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Chaque goutte compte. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Sauvez une vie.
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
            Trouvez un donneur compatible en quelques minutes au Sénégal. OSAMAK connecte instantanément les patients aux donneurs volontaires lors des urgences vitales.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/alerte-urgence"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-8 py-4 text-base font-bold shadow-xl shadow-primary/30 hover:bg-primary/90 hover:scale-105 transition-all duration-300"
            >
              <Activity className="w-5 h-5" /> Signaler une Urgence
            </Link>
            <Link
              to="/inscription-donneur"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary text-secondary-foreground border border-border px-8 py-4 text-base font-bold hover:bg-secondary/80 hover:shadow-md transition-all duration-300"
            >
              <Heart className="w-5 h-5 text-primary" /> Devenir Donneur
            </Link>
          </div>
        </div>

        {/* Visual Graphic */}
        <div className="relative hidden lg:block animate-in fade-in zoom-in-95 duration-1000 delay-200 fill-mode-both">
          <div className="relative w-full aspect-square max-w-[500px] mx-auto">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-[3rem] rotate-3 scale-105" />
            <div className="absolute inset-0 bg-card border border-border rounded-[3rem] shadow-2xl p-8 flex flex-col justify-between overflow-hidden">
              <div className="flex justify-between items-start">
                <div className="bg-primary/10 text-primary p-4 rounded-2xl">
                  <Droplets className="w-10 h-10" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black">O+</div>
                  <div className="text-sm font-semibold text-emerald-500">Donneur Universel (PRBC)</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-background rounded-2xl p-4 flex items-center gap-4 border border-border shadow-sm">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">Compatibilité Vérifiée</div>
                    <div className="text-xs text-muted-foreground">Algorithme de matching actif</div>
                  </div>
                </div>
                <div className="bg-background rounded-2xl p-4 flex items-center gap-4 border border-border shadow-sm">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">Géolocalisation Rapide</div>
                    <div className="text-xs text-muted-foreground">Recherche dans un rayon de 5km</div>
                  </div>
                </div>
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
    { value: "12 000+", label: "urgences transfusionnelles / an", icon: Activity, color: "text-primary", bg: "bg-primary/10" },
    { value: "35%", label: "donneurs refusés (inéligibilité)", icon: ShieldCheck, color: "text-accent", bg: "bg-accent/10" },
    { value: "2–3 h", label: "délai moyen d'attente actuel", icon: Clock, color: "text-orange-500", bg: "bg-orange-500/10" },
  ];
  return (
    <section className="py-20 relative bg-secondary/30 border-y border-border/50">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold">Une réalité qui appelle à l'action</h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            Le manque de sang dans nos hôpitaux est une urgence de chaque instant. OSAMAK digitalise la chaîne de solidarité.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((s, i) => (
            <div key={i} className="group bg-card border border-border rounded-3xl p-8 text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className={`mx-auto w-16 h-16 ${s.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <s.icon className={`w-8 h-8 ${s.color}`} />
              </div>
              <div className="text-4xl lg:text-5xl font-black mb-3">{s.value}</div>
              <p className="text-sm font-medium text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", t: "Inscription rapide", d: "Créez votre profil donneur en moins de 2 minutes, en toute sécurité.", icon: User },
    { n: "02", t: "Notification ciblée", d: "Recevez une alerte SMS si votre groupe sanguin est nécessaire près de chez vous.", icon: Activity },
    { n: "03", t: "Don sécurisé", d: "Rendez-vous au centre partenaire le plus proche pour sauver une vie.", icon: Heart },
  ];
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Le cycle du don simplifié</h2>
          <p className="text-lg text-muted-foreground">Une démarche fluide pour encourager la solidarité.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Ligne connectrice (desktop) */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-primary/10 via-primary to-primary/10 -z-10" />
          
          {steps.map((s, i) => (
            <div key={i} className="relative flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-3xl bg-background border-4 border-card flex items-center justify-center shadow-xl shadow-primary/10 mb-6 relative z-10 group hover:scale-105 transition-transform">
                <s.icon className="w-10 h-10 text-primary" />
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-foreground text-background font-bold rounded-full flex items-center justify-center text-xs shadow-sm">
                  {s.n}
                </div>
              </div>
              <h3 className="font-bold text-xl mb-3">{s.t}</h3>
              <p className="text-muted-foreground text-sm max-w-xs">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DifyAgent() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<{role: "user"|"ai", text: string}[]>([
    { role: "ai", text: "Bonjour ! Je suis l'assistant médical IA d'OSAMAK. Posez-moi vos questions sur le don de sang, les compatibilités (ex: 'Qui peut recevoir du A- ?') ou votre éligibilité." }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const ask = async (e: FormEvent) => {
    e.preventDefault();
    if (loading || !query.trim()) return;

    const userMessage = query.trim();
    setQuery("");
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY || "VOTRE_CLE_API_GROQ_ICI"}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { 
              role: "system", 
              content: `Tu es un expert en santé publique et transfusion sanguine au Sénégal, intégré à la plateforme OSAMAK. Ta mission : utiliser les règles de compatibilité sanguine pour informer patients et donneurs sur les possibilités de don et de réception de sang. Sois très concis, chaleureux, et va droit au but. Réponds toujours en 2 ou 3 phrases maximum. Formatte le texte joliment.` 
            },
            { role: "user", content: userMessage }
          ]
        }),
      });

      if (!res.ok) throw new Error("Erreur API");
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content || "Désolé, je n'ai pas pu générer de réponse.";
      setMessages(prev => [...prev, { role: "ai", text }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "ai", text: "⚠️ Oups, je suis temporairement indisponible. Veuillez réessayer plus tard." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-card border-t border-border/50">
      <div className="mx-auto max-w-4xl px-4 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold mb-6">
            <Bot className="w-4 h-4" /> Intelligence Artificielle
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Un doute ? Posez la question à notre Assistant</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Qu'il s'agisse de règles de compatibilité, du délai de récupération après un don, ou de l'adresse du centre le plus proche, notre IA médicale vous répond en un clin d'œil.
          </p>
          <ul className="space-y-4 mb-8">
            {["Qui peut donner du sang à un patient O+ ?", "Combien de temps faut-il attendre entre deux dons ?", "Puis-je donner mon sang si j'ai eu le paludisme ?"].map((q, i) => (
              <li key={i} className="flex items-center gap-3 text-sm font-medium">
                <ArrowRight className="w-4 h-4 text-primary" /> {q}
              </li>
            ))}
          </ul>
        </div>

        {/* Interface Chat style iMessage/Modern */}
        <div className="bg-background border border-border rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[500px]">
          <div className="bg-muted px-6 py-4 border-b border-border flex items-center gap-4">
            <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-sm">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm">Assistant OSAMAK</div>
              <div className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> En ligne
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, i) => (
              <div key={i} className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm shadow-sm ${
                  msg.role === "user" 
                  ? "bg-primary text-primary-foreground rounded-br-none" 
                  : "bg-card border border-border text-foreground rounded-bl-none"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex w-full justify-start">
                <div className="max-w-[80%] bg-card border border-border rounded-2xl rounded-bl-none px-5 py-4 shadow-sm flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-card border-t border-border">
            <form onSubmit={ask} className="relative flex items-center">
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Écrivez votre message..."
                disabled={loading}
                className="w-full bg-background border border-border rounded-full pl-5 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button 
                type="submit" 
                disabled={loading || !query.trim()}
                className="absolute right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center disabled:opacity-50 hover:bg-primary/90 transition"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
