import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { WHATSAPP_URL } from "@/lib/site";
import { MapPin, Calendar, Search, MessageCircle, PawPrint } from "lucide-react";

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

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function Perdidos() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState("");
  const [especie, setEspecie] = useState("Todos");

  useEffect(() => {
    supabase
      .from("pets")
      .select("*")
      .eq("status", "perdido")
      .order("created_at", { ascending: false })
      .then(
        ({ data, error }) => {
          if (error) setFailed(true);
          setPets((data as Pet[]) ?? []);
          setLoading(false);
        },
        () => {
          setFailed(true);
          setLoading(false);
        },
      );
  }, []);

  const especies = useMemo(() => ["Todos", ...new Set(pets.map((p) => p.especie))], [pets]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return pets.filter((p) => {
      if (especie !== "Todos" && p.especie !== especie) return false;
      if (!q) return true;
      return [p.nome, p.raca, p.cor, p.ultima_localizacao, p.descricao].some((v) =>
        v?.toLowerCase().includes(q),
      );
    });
  }, [pets, query, especie]);

  return (
    <SiteLayout>
      <section className="mx-auto w-full max-w-7xl px-5 py-12 md:px-14 md:py-16">
        <h1 className="mb-3 text-3xl font-extrabold sm:text-4xl md:text-5xl">
          Pets <span className="gradient-text">perdidos</span> agora
        </h1>
        <p className="mb-8 text-muted-foreground md:mb-10">
          Viu algum deles? Ajude um tutor a reencontrar seu melhor amigo.
        </p>

        {!loading && pets.length > 0 && (
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center">
            <label className="relative md:max-w-sm md:flex-1">
              <span className="sr-only">Buscar</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nome, raça, bairro..."
                className="field pl-11"
              />
            </label>
            {especies.length > 2 && (
              <div
                className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:px-0 md:pb-0"
                role="group"
                aria-label="Filtrar por espécie"
              >
                {especies.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setEspecie(e)}
                    aria-pressed={especie === e}
                    className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      especie === e
                        ? "border-primary/50 bg-primary/15 text-blue-bright"
                        : "border-border text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass overflow-hidden rounded-3xl">
                <div className="aspect-[4/3] animate-pulse bg-muted/50" />
                <div className="space-y-3 p-6">
                  <div className="h-5 w-1/2 animate-pulse rounded-full bg-muted/60" />
                  <div className="h-4 w-3/4 animate-pulse rounded-full bg-muted/40" />
                </div>
              </div>
            ))}
          </div>
        ) : failed ? (
          <EmptyState
            title="Não foi possível carregar"
            text="Verifique sua conexão e tente novamente em alguns instantes."
          />
        ) : pets.length === 0 ? (
          <EmptyState
            title="Nenhum pet perdido no momento"
            text="Que bom! Se o seu sumiu, cadastre-o para começarmos a procurar."
            action
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Nada encontrado"
            text="Tente buscar por outro termo ou limpe os filtros."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
            {filtered.map((p) => (
              <article
                key={p.id}
                className="glass flex flex-col overflow-hidden rounded-3xl transition hover:-translate-y-1 hover:shadow-[0_16px_40px_oklch(0.66_0.18_255/0.2)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted/40">
                  {p.foto_url ? (
                    <img
                      src={p.foto_url}
                      alt={p.nome}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-primary/40">
                      <PawPrint className="h-16 w-16" />
                    </div>
                  )}
                  {p.recompensa ? (
                    <span className="absolute left-3 top-3 rounded-full bg-background/85 px-3 py-1 text-xs font-semibold text-blue-bright backdrop-blur">
                      Recompensa {brl.format(Number(p.recompensa))}
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className="mb-1 text-xl font-bold">{p.nome}</h3>
                  <p className="mb-3 text-sm text-muted-foreground">
                    {p.especie}
                    {p.raca ? ` · ${p.raca}` : ""}
                    {p.cor ? ` · ${p.cor}` : ""}
                  </p>
                  {p.descricao && (
                    <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{p.descricao}</p>
                  )}
                  <div className="mb-5 space-y-1.5 text-xs text-muted-foreground">
                    {p.ultima_localizacao && (
                      <div className="flex items-start gap-1.5">
                        <MapPin className="mt-px h-3.5 w-3.5 shrink-0" /> {p.ultima_localizacao}
                      </div>
                    )}
                    {p.data_desaparecimento && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 shrink-0" /> Desde{" "}
                        {formatDate(p.data_desaparecimento)}
                      </div>
                    )}
                  </div>
                  <a
                    href={`${WHATSAPP_URL}?text=${encodeURIComponent(`Olá! Acho que vi o pet ${p.nome} (${p.especie}) que está na lista de perdidos do Câmera Pet.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline mt-auto w-full px-5 py-2.5 text-sm"
                  >
                    <MessageCircle className="h-4 w-4" /> Vi este pet
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}

// "AAAA-MM-DD" vira data local (sem o deslocamento de fuso do new Date em UTC)
function formatDate(d: string) {
  const [y, m, day] = d.split("-").map(Number);
  return new Date(y, m - 1, day).toLocaleDateString("pt-BR");
}

function EmptyState({ title, text, action }: { title: string; text: string; action?: boolean }) {
  return (
    <div className="glass flex flex-col items-center rounded-3xl px-6 py-14 text-center sm:p-16">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-blue-bright">
        <PawPrint className="h-6 w-6" />
      </div>
      <h2 className="mb-2 text-xl font-bold">{title}</h2>
      <p className="max-w-sm text-sm text-muted-foreground">{text}</p>
      {action && (
        <Link
          to="/auth"
          className="btn-primary-glow mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          Cadastrar meu pet
        </Link>
      )}
    </div>
  );
}
