import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, Bot, BellRing, MapPin, Search } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import cachorro from "@/assets/cachorro.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Câmera Pet — Ache seu pet com IA e câmeras urbanas" },
      { name: "description", content: "Reencontre seu pet usando reconhecimento por IA em câmeras da cidade. Cadastre, alerte e localize em tempo real." },
    ],
  }),
  component: Home,
});

const features = [
  { Icon: Camera, title: "Câmeras inteligentes", desc: "Integramos com câmeras públicas para varredura em tempo real." },
  { Icon: Bot, title: "Reconhecimento por IA", desc: "Algoritmos de visão computacional identificam seu pet com precisão." },
  { Icon: BellRing, title: "Alertas instantâneos", desc: "Notificações imediatas quando seu animal for avistado." },
  { Icon: MapPin, title: "Mapa de avistamentos", desc: "Visualize registros no mapa interativo da cidade." },
];

function Home() {
  return (
    <SiteLayout>
      <section className="mx-auto flex max-w-7xl flex-col items-center gap-10 px-6 py-16 md:flex-row md:justify-between md:px-14 md:py-24">
        <div className="max-w-xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-medium uppercase tracking-widest text-blue-bright">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-cyan" />
            IA + Câmeras urbanas
          </div>
          <h1 className="mb-5 text-4xl font-extrabold leading-tight md:text-6xl">
            Ache pets perdidos com <span className="gradient-text">IA</span> e câmeras pela cidade.
          </h1>
          <p className="mb-10 text-lg font-light leading-relaxed text-muted-foreground">
            Ajudamos tutores a reencontrar seus animais de estimação usando reconhecimento de imagem em tempo real.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/perdidos"
              className="btn-primary-glow inline-flex items-center gap-2 rounded-full px-7 py-4 font-semibold text-primary-foreground"
            >
              <Search className="h-4 w-4" /> Ver pets perdidos
            </Link>
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-7 py-4 font-semibold text-blue-bright transition-colors hover:bg-primary/10"
            >
              Cadastrar meu pet
            </Link>
          </div>
        </div>

        <div className="relative flex-shrink-0">
          <div className="animate-ring absolute -inset-8 rounded-full bg-[radial-gradient(circle,oklch(0.66_0.18_255/0.15)_0%,transparent_65%)]" />
          <img
            src={cachorro}
            alt="Cachorro feliz"
            className="animate-float relative z-10 w-[320px] max-w-full md:w-[440px]"
            style={{ filter: "drop-shadow(0 24px 60px oklch(0.66 0.18 255 / 0.3))" }}
          />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-6 pb-24 md:grid-cols-2 md:px-14 lg:grid-cols-4">
        {features.map(({ Icon, title, desc }) => (
          <div
            key={title}
            className="group rounded-2xl border border-primary/10 bg-card/60 p-7 backdrop-blur-sm transition-all hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_16px_40px_oklch(0.66_0.18_255/0.15)]"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-blue-bright">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mb-2 text-base font-bold">{title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
          </div>
        ))}
      </section>
    </SiteLayout>
  );
}
