import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MessageCircle, Copy, Check, Send } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { toast } from "sonner";
import { sendContact } from "@/lib/contact.functions";
import { PHONE_DISPLAY, WHATSAPP_URL } from "@/lib/site";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Câmera Pet" },
      { name: "description", content: "Fale com a equipe Câmera Pet pelo WhatsApp ou formulário." },
      { property: "og:title", content: "Contato — Câmera Pet" },
      {
        property: "og:description",
        content: "Fale com a equipe Câmera Pet pelo WhatsApp ou formulário.",
      },
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
      <section className="mx-auto w-full max-w-6xl px-5 py-12 md:px-14 md:py-20">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-12">
          <div>
            <h1 className="mb-3 text-3xl font-extrabold sm:text-4xl md:text-5xl">
              Fale com a gente
            </h1>
            <p className="mb-8 text-muted-foreground md:mb-10">
              Dúvidas, parcerias com prefeituras ou ajuda com seu cadastro.
            </p>

            <div className="glass rounded-3xl p-6 sm:p-8">
              <p className="mb-2 text-sm font-medium text-muted-foreground">WhatsApp / Celular</p>
              <p className="mb-5 select-all whitespace-nowrap font-display text-[clamp(1rem,5vw,1.5rem)] font-extrabold tracking-tight">
                {PHONE_DISPLAY}
              </p>
              <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary-glow inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-primary-foreground sm:px-6 sm:text-base"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
                <button
                  type="button"
                  onClick={copy}
                  className="btn-outline px-5 py-3 text-sm sm:px-6 sm:text-base"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copiado" : "Copiar"}
                </button>
              </div>
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            className="glass space-y-5 rounded-3xl p-6 sm:p-8 lg:self-start"
          >
            <h2 className="text-xl font-bold">Envie uma mensagem</h2>
            <Field
              label="Nome"
              name="nome"
              autoComplete="name"
              placeholder="Seu nome"
              maxLength={120}
            />
            <Field
              label="E-mail"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="voce@email.com"
              maxLength={200}
            />
            <div>
              <label htmlFor="contato-msg" className="mb-2 block text-sm font-medium">
                Mensagem
              </label>
              <textarea
                id="contato-msg"
                required
                rows={5}
                name="msg"
                maxLength={4000}
                placeholder="Como podemos ajudar?"
                className="field resize-y"
              />
            </div>
            <button
              disabled={sending}
              className="btn-primary-glow inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-4 font-semibold text-primary-foreground disabled:opacity-60"
            >
              <Send className="h-4 w-4" /> {sending ? "Enviando..." : "Enviar mensagem"}
            </button>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}

function Field({
  label,
  name,
  ...props
}: { label: string; name: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = `contato-${name}`;
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      <input required id={id} name={name} {...props} className="field" />
    </div>
  );
}
