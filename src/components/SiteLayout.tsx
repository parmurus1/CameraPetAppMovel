import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import logo from "@/assets/logo.png";
import cidade from "@/assets/cidade.png";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    return () => sub.subscription.unsubscribe();
  }, []);

  const navItems = [
    { to: "/", label: "Início" },
    { to: "/perdidos", label: "Pets perdidos" },
    { to: "/sobre", label: "Sobre" },
    { to: "/contato", label: "Contato" },
  ];

  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-border/40 bg-background/70 px-4 py-3 backdrop-blur-xl md:px-14 md:py-4">
        <Link to="/" className="flex shrink-0 items-center gap-2 whitespace-nowrap font-display text-lg font-extrabold leading-none tracking-tight md:gap-3 md:text-xl">
          <img src={logo} alt="Logo Câmera Pet" className="h-9 w-9 shrink-0 object-contain drop-shadow-[0_0_8px_oklch(0.66_0.18_255)] md:h-10 md:w-10" />
          Câmera Pet
        </Link>
        <nav className="-mx-4 w-full overflow-x-auto px-4 md:mx-0 md:w-auto md:overflow-visible md:px-0">
          <ul className="flex w-max items-center gap-1 md:w-auto">
            {navItems.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  className={`block whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-colors md:px-4 ${
                    path === n.to
                      ? "bg-primary/15 text-blue-bright"
                      : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                  }`}
                >
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              {session ? (
                <Link
                  to="/dashboard"
                  className="ml-1 block whitespace-nowrap rounded-full bg-primary/15 px-4 py-2 text-sm font-medium text-blue-bright hover:bg-primary/25 md:ml-2"
                >
                  Meu painel
                </Link>
              ) : (
                <Link
                  to="/auth"
                  className="ml-1 block whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-primary/10 hover:text-foreground md:ml-2"
                >
                  Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </header>


      <main className="flex-1">{children}</main>

      <footer className="relative mt-auto overflow-hidden border-t border-border/40 bg-background">
        <div className="relative h-[180px]">
          <img
            src={cidade}
            alt="Cidade ilustrada"
            className="absolute bottom-0 left-1/2 w-full max-w-[1900px] -translate-x-1/2 opacity-30"
            style={{ filter: "saturate(0) brightness(0.6) sepia(1) hue-rotate(200deg)" }}
          />
          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs tracking-wider text-muted-foreground">
            © 2026 Câmera Pet — Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
