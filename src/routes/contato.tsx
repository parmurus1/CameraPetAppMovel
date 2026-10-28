import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MessageCircle, Copy, Check } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { toast } from "sonner";
import { sendContact } from "@/lib/contact.functions";

const PHONE_DISPLAY = "+55 11 95832-0147";
const PHONE_DIGITS = "5511958320147";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Câmera Pet" },
      { name: "description", content: "Fale com a equipe Câmera Pet pelo WhatsApp ou formulário." },
      { property: "og:title", content: "Contato — Câmera Pet" },
      { property: "og:description", content: "Fale com a equipe Câmera Pet pelo WhatsApp ou formulário." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Contato,
});

function Contato() {
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PHONE_DISPLAY);
      setCopied(true);
      toast.success("Número copiado!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Não deu para copiar. Selecione o número e copie manualmente.");
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setSending(true);
    try {
      await sendContact({
        data: {
          nome: String(fd.get("nome") ?? ""),
          email: String(fd.get("email") ?? ""),
          mensagem: String(fd.get("msg") ?? ""),
        },
      });
      toast.success("Mensagem enviada! Retornaremos em breve.");
      form.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao enviar.");
    } finally {
      setSending(false);
    }
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-2xl px-6 py-20 md:px-14">
        <h1 className="mb-3 text-4xl font-extrabold md:text-5xl">Fale com a gente</h1>
        <p className="mb-10 text-muted-foreground">Dúvidas, parcerias com prefeituras ou ajuda com seu cadastro.</p>

        <div className="glass mb-8 rounded-3xl p-8">
          <p className="mb-2 text-sm font-medium text-muted-foreground">WhatsApp / Celular</p>
          <p className="mb-5 select-all font-display text-2xl font-extrabold tracking-tight md:text-3xl">{PHONE_DISPLAY}</p>
          <div className="flex flex-wrap gap-3">
            <a
              href={`https://wa.me/${PHONE_DIGITS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary-glow inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-primary-foreground"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-6 py-3 font-semibold text-blue-bright transition-colors hover:bg-primary/10"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copiado" : "Copiar número"}
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="glass space-y-5 rounded-3xl p-8">
          <Field label="Nome" name="nome" placeholder="Seu nome" maxLength={120} />
          <Field label="E-mail" name="email" type="email" placeholder="voce@email.com" maxLength={200} />
          <div>
            <label className="mb-2 block text-sm font-medium">Mensagem</label>
            <textarea required rows={5} name="msg" maxLength={4000} placeholder="Como podemos ajudar?"
              className="w-full rounded-2xl border border-border bg-background/60 px-5 py-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
          <button disabled={sending} className="btn-primary-glow w-full rounded-full px-7 py-4 font-semibold text-primary-foreground disabled:opacity-60">
            {sending ? "Enviando..." : "Enviar mensagem"}
          </button>
        </form>
      </section>
    </SiteLayout>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>
      <input required {...props}
        className="w-full rounded-full border border-border bg-background/60 px-5 py-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
    </div>
  );
}
