import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import sobreImg from "@/assets/sobre.png";

export const Route = createFileRoute("/sobre")({
  head: () => ({ meta: [{ title: "Sobre — Câmera Pet" }] }),
  component: Sobre,
});

function Sobre() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-6 py-20 md:px-14">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h1 className="mb-6 text-4xl font-extrabold leading-tight md:text-5xl">
              Tecnologia a serviço do <span className="gradient-text">reencontro</span>.
            </h1>
            <p className="mb-4 text-lg leading-relaxed text-muted-foreground">
              O Câmera Pet nasceu para reduzir o tempo entre um pet desaparecer e voltar para casa. Usamos IA de visão
              computacional integrada a uma rede de câmeras urbanas para varrer ruas em tempo real.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Tutores cadastram fotos e características do animal; quando há um avistamento compatível, recebem alerta
              imediato com localização.
            </p>
          </div>
          <div className="relative">
            <div className="animate-ring absolute -inset-8 rounded-full bg-[radial-gradient(circle,oklch(0.66_0.18_255/0.15)_0%,transparent_65%)]" />
            <img src={sobreImg} alt="Sobre" className="relative z-10 w-full rounded-3xl" />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
