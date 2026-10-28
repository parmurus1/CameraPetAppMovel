import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Calendar } from "lucide-react";

export const Route = createFileRoute("/perdidos")({
  head: () => ({ meta: [{ title: "Pets perdidos — Câmera Pet" }] }),
  component: Perdidos,
});

type Pet = {
  id: string;
  nome: string;
  especie: string;
  raca: string | null;
  cor: string | null;
  foto_url: string | null;
  ultima_localizacao: string | null;
  data_desaparecimento: string | null;
  descricao: string | null;
  recompensa: number | null;
};

function Perdidos() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("pets").select("*").eq("status", "perdido").order("created_at", { ascending: false })
      .then(({ data }) => { setPets((data as Pet[]) ?? []); setLoading(false); });
  }, []);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-14">
        <h1 className="mb-3 text-4xl font-extrabold md:text-5xl">
          Pets <span className="gradient-text">perdidos</span> agora
        </h1>
        <p className="mb-12 text-muted-foreground">Viu algum deles? Ajude um tutor a reencontrar seu melhor amigo.</p>

        {loading ? (
          <p className="text-muted-foreground">Carregando...</p>
        ) : pets.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center">
            <p className="text-muted-foreground">Nenhum pet perdido cadastrado no momento. 🐾</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pets.map((p) => (
              <article key={p.id} className="glass overflow-hidden rounded-3xl transition hover:-translate-y-1 hover:shadow-[0_16px_40px_oklch(0.66_0.18_255/0.2)]">
                <div className="aspect-[4/3] overflow-hidden bg-muted/40">
                  {p.foto_url ? (
                    <img src={p.foto_url} alt={p.nome} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-6xl">🐾</div>
                  )}
                </div>
                <div className="p-6">
                  <div className="mb-3 flex items-baseline justify-between gap-2">
                    <h3 className="text-xl font-bold">{p.nome}</h3>
                    {p.recompensa ? (
                      <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-blue-bright">
                        R$ {Number(p.recompensa).toFixed(2)}
                      </span>
                    ) : null}
                  </div>
                  <p className="mb-3 text-sm text-muted-foreground">
                    {p.especie}{p.raca ? ` · ${p.raca}` : ""}{p.cor ? ` · ${p.cor}` : ""}
                  </p>
                  {p.descricao && <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{p.descricao}</p>}
                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    {p.ultima_localizacao && (
                      <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {p.ultima_localizacao}</div>
                    )}
                    {p.data_desaparecimento && (
                      <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Desde {new Date(p.data_desaparecimento).toLocaleDateString("pt-BR")}</div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
