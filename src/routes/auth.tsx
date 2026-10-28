import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Entrar — Câmera Pet" }] }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/dashboard` },
        });
        if (error) throw error;
        toast.success("Conta criada! Confirme seu e-mail para entrar.");
        setMode("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bem-vindo de volta!");
        navigate({ to: "/dashboard" });
      }
    } catch (err: any) {
      toast.error(err.message ?? "Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteLayout>
      <section className="mx-auto flex max-w-md flex-col px-6 py-20 md:px-0">
        <div className="glass rounded-3xl p-8">
          <h1 className="mb-2 text-3xl font-extrabold">
            {mode === "login" ? "Entrar" : "Criar conta"}
          </h1>
          <p className="mb-8 text-sm text-muted-foreground">
            {mode === "login" ? "Acesse seu painel de tutor." : "Cadastre-se para registrar seus pets."}
          </p>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">E-mail</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-full border border-border bg-background/60 px-5 py-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Senha</label>
              <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-full border border-border bg-background/60 px-5 py-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </div>
            <button disabled={loading} className="btn-primary-glow w-full rounded-full px-7 py-4 font-semibold text-primary-foreground disabled:opacity-60">
              {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "login" ? "Não tem conta?" : "Já tem conta?"}{" "}
            <button onClick={() => setMode(mode === "login" ? "register" : "login")} className="font-medium text-blue-bright hover:underline">
              {mode === "login" ? "Cadastre-se" : "Entrar"}
            </button>
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
