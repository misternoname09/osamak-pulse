import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";

export function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const navLink =
    "px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors";
  const activeCls = "text-primary";

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur border-b border-border">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="text-2xl" aria-hidden>🩸</span>
            <span className="text-primary tracking-tight">OSAMAK</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/" className={navLink} activeProps={{ className: activeCls }} activeOptions={{ exact: true }}>Accueil</Link>
            <Link to="/disponibilite" className={navLink} activeProps={{ className: activeCls }}>Disponibilité sang</Link>
            <Link to="/assistant" className={navLink} activeProps={{ className: activeCls }}>Assistant IA</Link>
            <Link to="/saisie-donnees" className={navLink} activeProps={{ className: activeCls }}>Saisie terrain</Link>
            <Link to="/contact" className={navLink} activeProps={{ className: activeCls }}>Contact</Link>
          </nav>
          <button
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-border"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            <span className="block w-5 h-0.5 bg-foreground relative before:content-[''] before:absolute before:-top-1.5 before:left-0 before:w-5 before:h-0.5 before:bg-foreground after:content-[''] after:absolute after:top-1.5 after:left-0 after:w-5 after:h-0.5 after:bg-foreground" />
          </button>
        </div>
        {open && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="px-4 py-2 flex flex-col">
              <Link to="/" className={navLink} onClick={() => setOpen(false)} activeProps={{ className: activeCls }} activeOptions={{ exact: true }}>Accueil</Link>
              <Link to="/disponibilite" className={navLink} onClick={() => setOpen(false)} activeProps={{ className: activeCls }}>Disponibilité sang</Link>
              <Link to="/assistant" className={navLink} onClick={() => setOpen(false)} activeProps={{ className: activeCls }}>Assistant IA</Link>
              <Link to="/contact" className={navLink} onClick={() => setOpen(false)} activeProps={{ className: activeCls }}>Contact</Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border bg-secondary/50 mt-16">
        <div className="mx-auto max-w-6xl px-4 py-10 grid gap-6 md:grid-cols-3 text-sm">
          <div>
            <div className="flex items-center gap-2 font-bold text-base">
              <span className="text-xl">🩸</span>
              <span className="text-primary">OSAMAK</span>
            </div>
            <p className="mt-2 text-muted-foreground">
              Sauver des vies grâce à une mise en relation rapide entre patients et donneurs.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Contact</h4>
            <p className="text-muted-foreground">Centre National de Transfusion Sanguine</p>
            <p className="text-muted-foreground">Dakar, Sénégal</p>
            <p className="text-muted-foreground">contact@osamak.sn</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Mentions légales</h4>
            <p className="text-muted-foreground">© {new Date().getFullYear()} OSAMAK. Tous droits réservés.</p>
            <p className="text-muted-foreground">Conditions d'utilisation · Politique de confidentialité</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
