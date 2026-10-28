import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Camera,
  Bot,
  BellRing,
  MapPin,
  Search,
  PawPrint,
  ScanSearch,
  ArrowRight,
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import cachorro from "@/assets/cachorro.webp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Câmera Pet — Ache seu pet com IA e câmeras urbanas" },
      {
        name: "description",
        content:
          "Reencontre seu pet usando reconhecimento por IA em câmeras da cidade. Cadastre, alerte e localize em tempo real.",
      },
    ],
  }),
  component: Home,
});

const features = [
  {
    Icon: Camera,
    title: "Câmeras inteligentes",
    desc: "Integramos com câmeras públicas para varredura em tempo real.",
  },
  {
    Icon: Bot,
    title: "Reconhecimento por IA",
    desc: "Algoritmos de visão computacional identificam seu pet com precisão.",
  },
  {
    Icon: BellRing,
    title: "Alertas instantâneos",
    desc: "Notificações imediatas quando seu animal for avistado.",
  },
  {
    Icon: MapPin,
    title: "Mapa de avistamentos",
    desc: "Visualize registros no mapa interativo da cidade.",
  },
];

const steps = [
  {
    Icon: PawPrint,
    title: "Cadastre seu pet",
    desc: "Envie fotos e características do animal no seu painel de tutor.",
  },
  {
    Icon: ScanSearch,
    title: "A IA procura",
    desc: "Nossa rede de câmeras urbanas varre as ruas buscando um avistamento compatível.",
  },
  {
    Icon: BellRing,
    title: "Receba o alerta",
    desc: "Quando encontramos um provável match, você é avisado com a localização.",
  },
];

function Home() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="mx-auto flex w-full max-w-7xl flex-col items-center gap-10 px-5 pb-16 pt-10 md:flex-row md:justify-between md:px-14 md:pb-24 md:pt-20">
        <div className="max-w-xl">
          <div className="eyebrow mb-6">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-cyan" />
            IA + Câmeras urbanas
          </div>
          <h1 className="mb-5 text-[2.15rem] font-extrabold leading-[1.1] sm:text-5xl lg:text-6xl">
            Ache pets perdidos com <span className="gradient-text">IA</span> e câmeras pela cidade.
          </h1>
          <p className="mb-8 text-base font-light leading-relaxed text-muted-foreground sm:text-lg md:mb-10">
            Ajudamos tutores a reencontrar seus animais de estimação usando reconhecimento de imagem
            em tempo real.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/perdidos"
              className="btn-primary-glow inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 font-semibold text-primary-foreground"
            >
              <Search className="h-4 w-4" /> Ver pets perdidos
            </Link>
            <Link to="/auth" className="btn-outline px-7 py-4">
              Cadastrar meu pet
            </Link>
          </div>
        </div>

        <div className="relative shrink-0">
          <div className="animate-ring absolute -inset-8 rounded-full bg-[radial-gradient(circle,oklch(0.66_0.18_255/0.15)_0%,transparent_65%)]" />
          <img
            src={cachorro}
            alt="Ilustração de um cachorro ao lado de uma câmera e de um celular mostrando o mapa de avistamentos"
            width={880}
            height={908}
            fetchPriority="high"
            className="animate-float relative z-10 h-auto w-[260px] max-w-full sm:w-[340px] md:w-[400px] lg:w-[440px]"
            style={{ filter: "drop-shadow(0 24px 60px oklch(0.66 0.18 255 / 0.3))" }}
          />
        </div>
      </section>

      {/* Recursos */}
      <section className="mx-auto w-full max-w-7xl px-5 pb-20 md:px-14 md:pb-28">
        <SectionTitle eyebrow="Recursos" title="Tecnologia pensada para o reencontro" />
        <div className="grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-4">
          {features.map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="flex gap-4 rounded-2xl border border-primary/10 bg-card/60 p-5 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_16px_40px_oklch(0.66_0.18_255/0.15)] sm:block sm:p-7"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-blue-bright sm:mb-4 sm:h-12 sm:w-12">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="mb-1.5 text-base font-bold sm:mb-2">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Como funciona */}
      <section className="mx-auto w-full max-w-7xl px-5 pb-20 md:px-14 md:pb-28">
        <SectionTitle eyebrow="Como funciona" title="Três passos até seu pet voltar para casa" />
        <ol className="grid gap-4 md:grid-cols-3 md:gap-5">
          {steps.map(({ Icon, title, desc }, i) => (
            <li key={title} className="glass relative overflow-hidden rounded-2xl p-6 sm:p-7">
              <span className="pointer-events-none absolute right-5 top-3 select-none font-display text-7xl font-extrabold leading-none text-primary/10">
                {i + 1}
              </span>
              <div className="relative">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-cyan text-primary-foreground shadow-[0_6px_20px_oklch(0.66_0.18_255/0.35)]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-lg font-bold">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Chamada final */}
      <section className="mx-auto w-full max-w-7xl px-5 pb-20 md:px-14 md:pb-28">
        <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/20 via-card to-cyan/10 p-8 sm:p-12">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan/20 blur-3xl" />
          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <h2 className="mb-3 text-2xl font-extrabold sm:text-3xl">Seu pet sumiu?</h2>
              <p className="text-muted-foreground">
                Cadastre agora e coloque a rede de câmeras para procurar por ele. Quanto antes,
                maiores as chances.
              </p>
            </div>
            <Link
              to="/auth"
              className="btn-primary-glow inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full px-7 py-4 font-semibold text-primary-foreground sm:w-auto"
            >
              Cadastrar meu pet <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-8 md:mb-10">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-bright">
        {eyebrow}
      </p>
      <h2 className="text-2xl font-extrabold sm:text-3xl md:text-4xl">{title}</h2>
    </div>
  );
}
