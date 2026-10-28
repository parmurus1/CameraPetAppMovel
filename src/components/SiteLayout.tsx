import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, LogIn, LayoutDashboard, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { NAV_ITEMS, PHONE_DISPLAY, WHATSAPP_URL } from "@/lib/site";
import logo from "@/assets/logo.webp";
import cidade from "@/assets/cidade.webp";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    return () => sub.subscription.unsubscribe();
  }, []);

  // Fecha o menu ao trocar de página
  useEffect(() => setMenuOpen(false), [path]);

  // Trava a rolagem da página e permite fechar com Esc enquanto o menu está aberto
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const account = session
    ? { to: "/dashboard", label: "Meu painel", Icon: LayoutDashboard }
    : { to: "/auth", label: "Entrar", Icon: LogIn };

  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      {/* Fundo escurecido atrás do menu mobile (fora do header: o backdrop-blur dele prenderia o fixed) */}
      {menuOpen && (
        <div
          aria-hidden
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm animate-in fade-in md:hidden"
        />
      )}

      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 md:h-20 md:px-14">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2.5 whitespace-nowrap font-display text-lg font-extrabold leading-none tracking-tight md:text-xl"
          >
            <img
              src={logo}
              alt=""
              width={40}
              height={42}
              className="h-9 w-auto shrink-0 drop-shadow-[0_0_8px_oklch(0.66_0.18_255)] md:h-10"
            />
            Câmera Pet
          </Link>

          {/* Navegação desktop */}
          <nav aria-label="Principal" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {NAV_ITEMS.map((n) => (
                <li key={n.to}>
                  <Link
                    to={n.to}
                    aria-current={path === n.to ? "page" : undefined}
                    className={`block whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      path === n.to
                        ? "bg-primary/15 text-blue-bright"
                        : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                    }`}
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
              <li className="ml-3">
                <Link
                  to={account.to}
                  className="btn-primary-glow inline-flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold text-primary-foreground"
                >
                  <account.Icon className="h-4 w-4" /> {account.label}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Botão do menu mobile */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            className="-mr-1 inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/60 text-foreground transition-colors hover:bg-primary/10 md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Menu mobile */}
        {menuOpen && (
          <nav
            id="mobile-menu"
            aria-label="Principal"
            className="absolute inset-x-0 top-full border-b border-border/40 bg-background px-5 pb-6 pt-3 shadow-2xl animate-in fade-in slide-in-from-top-2 md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {NAV_ITEMS.map((n) => (
                <li key={n.to}>
                  <Link
                    to={n.to}
                    aria-current={path === n.to ? "page" : undefined}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-medium transition-colors ${
                      path === n.to
                        ? "bg-primary/15 text-blue-bright"
                        : "text-foreground/90 hover:bg-primary/10"
                    }`}
                  >
                    {n.label}
                    {path === n.to && <span className="h-1.5 w-1.5 rounded-full bg-cyan" />}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              to={account.to}
              className="btn-primary-glow mt-4 flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 font-semibold text-primary-foreground"
            >
              <account.Icon className="h-4 w-4" /> {account.label}
            </Link>
          </nav>
        )}
      </header>

      <main className="flex-1 overflow-x-clip">{children}</main>

      <footer className="relative mt-auto overflow-hidden border-t border-border/40 bg-background">
        <img
          src={cidade}
          alt=""
          aria-hidden
          loading="lazy"
          className="pointer-events-none absolute bottom-0 left-1/2 w-[1100px] max-w-none -translate-x-1/2 opacity-[0.1] md:w-full md:max-w-[1900px]"
          style={{
            filter: "saturate(0) brightness(0.8) sepia(1) hue-rotate(200deg)",
            maskImage: "linear-gradient(to top, black 15%, transparent 75%)",
            WebkitMaskImage: "linear-gradient(to top, black 15%, transparent 75%)",
          }}
        />
        <div className="relative mx-auto grid w-full max-w-7xl gap-x-6 gap-y-10 px-5 pb-10 pt-14 grid-cols-2 md:grid-cols-[1.6fr_1fr_1fr] md:px-14">
          <div className="col-span-2 md:col-span-1">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 font-display text-lg font-extrabold"
            >
              <img src={logo} alt="" width={32} height={34} className="h-8 w-auto" />
              Câmera Pet
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Reencontrando pets perdidos com inteligência artificial e câmeras urbanas.
            </p>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-blue-bright">
              Navegação
            </p>
            <ul className="space-y-2.5 text-sm">
              {NAV_ITEMS.map((n) => (
                <li key={n.to}>
                  <Link
                    to={n.to}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-blue-bright">
              Contato
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <MessageCircle className="h-4 w-4 shrink-0" /> {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <Link
                  to="/contato"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Enviar mensagem
                </Link>
              </li>
              <li>
                <Link
                  to={account.to}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {session ? "Meu painel" : "Cadastrar meu pet"}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="relative border-t border-border/30">
          <p className="mx-auto w-full max-w-7xl px-5 py-6 text-center text-xs text-muted-foreground md:px-14">
            © {new Date().getFullYear()} Câmera Pet — Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
