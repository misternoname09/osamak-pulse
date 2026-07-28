import { Link } from "@tanstack/react-router";
import { useState, type ReactNode, useEffect } from "react";
import { Menu, X, Droplet } from "lucide-react";

export function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLink = "relative px-4 py-2 text-sm font-bold text-foreground/70 rounded-full transition-all duration-300 hover:text-primary hover:bg-primary/5";
  const activeCls = "text-primary bg-primary/10 ring-1 ring-primary/20 shadow-sm";

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
      {/* Floating Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "py-2 md:py-4" : "py-4 md:py-6"
        }`}
      >
        <div
          className={`mx-auto px-4 sm:px-6 transition-all duration-500 max-w-7xl`}
        >
          <div
            className={`flex items-center justify-between transition-all duration-500 rounded-full border border-border/50 bg-background/70 backdrop-blur-2xl shadow-xl shadow-black/5 ${
              scrolled ? "h-14 px-4" : "h-16 px-6"
            }`}
          >
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-rose-400 p-[2px] shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-shadow">
                <div className="w-full h-full bg-background rounded-full flex items-center justify-center">
                  <Droplet className="w-5 h-5 text-primary fill-primary group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                OSAMAK
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link to="/" className={navLink} activeProps={{ className: activeCls }} activeOptions={{ exact: true }}>Accueil</Link>
              <Link to="/disponibilite" className={navLink} activeProps={{ className: activeCls }}>Disponibilité</Link>
              <Link to="/eligibilite" className={navLink} activeProps={{ className: activeCls }}>Éligibilité</Link>
              <Link to="/compatibilite" className={navLink} activeProps={{ className: activeCls }}>Compatibilité</Link>
              <Link to="/alerte-urgence" className={navLink} activeProps={{ className: activeCls }}>Alertes</Link>
              <Link to="/statistiques" className={navLink} activeProps={{ className: activeCls }}>Stats</Link>
              <Link to="/assistant" className={navLink} activeProps={{ className: activeCls }}>Assistant IA</Link>
            </nav>

            {/* CTA Contact (Desktop) */}
            <div className="hidden lg:flex items-center">
              <Link
                to="/contact"
                className="px-5 py-2 rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105 hover:-translate-y-0.5 transition-all duration-300"
              >
                Contact
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-colors"
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        <div
          className={`lg:hidden absolute top-full left-4 right-4 mt-2 transition-all duration-300 transform origin-top ${
            open ? "scale-y-100 opacity-100 pointer-events-auto" : "scale-y-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="bg-background/90 backdrop-blur-3xl border border-border rounded-3xl p-4 shadow-2xl flex flex-col gap-1">
            {[
              { to: "/", label: "Accueil", exact: true },
              { to: "/disponibilite", label: "Disponibilité" },
              { to: "/eligibilite", label: "Éligibilité" },
              { to: "/compatibilite", label: "Compatibilité" },
              { to: "/alerte-urgence", label: "Alerte Urgence" },
              { to: "/statistiques", label: "Statistiques" },
              { to: "/assistant", label: "Assistant IA" },
              { to: "/contact", label: "Contact" },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                activeOptions={link.exact ? { exact: true } : undefined}
                className="px-4 py-3 text-base font-bold text-foreground/80 rounded-2xl transition-all hover:bg-primary/10 hover:text-primary hover:pl-6"
                activeProps={{ className: "bg-primary/10 text-primary" }}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Spacer to push content below the floating header */}
      <div className="h-[90px]" />

      <main className="flex-1 w-full relative z-0">
        {children}
      </main>

      <footer className="relative mt-20 overflow-hidden bg-foreground text-background">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="mx-auto max-w-7xl px-6 py-16 lg:py-24 relative z-10 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 font-bold mb-6 group inline-flex">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Droplet className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-2xl tracking-tight text-white">OSAMAK</span>
            </Link>
            <p className="text-background/70 max-w-sm leading-relaxed text-lg">
              Sauver des vies grâce à une mise en relation immédiate, fiable et intelligente entre patients et donneurs de sang au Sénégal.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Réseau CNTS</h4>
            <ul className="space-y-3 text-background/70">
              <li><Link to="/disponibilite" className="hover:text-primary transition-colors">Centres Partenaires</Link></li>
              <li><Link to="/eligibilite" className="hover:text-primary transition-colors">Test d'Éligibilité</Link></li>
              <li><Link to="/alerte-urgence" className="hover:text-primary transition-colors">Urgences Vitales</Link></li>
              <li><Link to="/statistiques" className="hover:text-primary transition-colors">Tableau de bord</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Contact & Support</h4>
            <ul className="space-y-3 text-background/70">
              <li className="flex items-center gap-2">📍 Dakar, Sénégal</li>
              <li className="flex items-center gap-2">📞 +221 33 869 18 18</li>
              <li className="flex items-center gap-2">✉️ contact@osamak.sn</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-background/10">
          <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-background/50">
            <p>© {new Date().getFullYear()} OSAMAK. Tous droits réservés.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
              <a href="#" className="hover:text-white transition-colors">Conditions Générales</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
