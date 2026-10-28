import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, ShieldCheck, HeartHandshake, ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import sobreImg from "@/assets/sobre.webp";

export const Route = createFileRoute("/sobre")({
  head: () => ({ meta: [{ title: "Sobre — Câmera Pet" }] }),
  component: Sobre,
});

const values = [
  {
    Icon: Clock,
    title: "Rapidez",
    desc: "Cada hora conta. Nosso foco é reduzir o tempo até o reencontro.",
  },
  {
    Icon: ShieldCheck,
    title: "Tecnologia",
    desc: "Visão computacional aplicada a uma rede de câmeras urbanas.",
  },
  {
    Icon: HeartHandshake,
    title: "Comunidade",
    desc: "Tutores e vizinhos ajudando uns aos outros a encontrar seus pets.",
  },
];

function Sobre() {
  return (
    <SiteLayout>
      <section className="mx-auto w-full max-w-6xl px-5 py-12 md:px-14 md:py-20">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12">
          <div>
            <p className="eyebrow mb-5">Sobre nós</p>
            <h1 className="mb-6 text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
              Tecnologia a serviço do <span className="gradient-text">reencontro</span>.
            </h1>
            <p className="mb-4 leading-relaxed text-muted-foreground sm:text-lg">
              O Câmera Pet nasceu para reduzir o tempo entre um pet desaparecer e voltar para casa.
              Usamos IA de visão computacional integrada a uma rede de câmeras urbanas para varrer
              ruas em tempo real.
            </p>
            <p className="leading-relaxed text-muted-foreground sm:text-lg">
              Tutores cadastram fotos e características do animal; quando há um avistamento
              compatível, recebem alerta imediato com localização.
            </p>
          </div>
          <figure className="relative">
            <div className="animate-ring absolute -inset-8 rounded-full bg-[radial-gradient(circle,oklch(0.66_0.18_255/0.15)_0%,transparent_65%)]" />
            <img
              src={sobreImg}
              alt="Equipe do Câmera Pet reunida"
              width={1203}
              height={519}
              className="relative z-10 h-auto w-full rounded-3xl border border-primary/15 shadow-[0_24px_60px_oklch(0.1_0.04_265/0.6)]"
            />
            <figcaption className="relative z-10 mt-3 text-center text-sm text-muted-foreground">
              Nossa equipe
            </figcaption>
          </figure>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-3 md:mt-24 md:gap-5">
          {values.map(({ Icon, title, desc }) => (
            <div key={title} className="glass rounded-2xl p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-blue-bright">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mb-2 text-lg font-bold">{title}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <p className="text-muted-foreground">Quer falar com a gente ou propor uma parceria?</p>
          <Link to="/contato" className="btn-outline px-6 py-3">
            Entre em contato <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
