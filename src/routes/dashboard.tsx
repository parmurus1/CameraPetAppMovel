import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Plus, Trash2, LogOut, Pencil, X } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Meu painel — Câmera Pet" }] }),
  component: Dashboard,
});

type Pet = {
  id: string;
  user_id: string;
  nome: string;
  especie: string;
  raca: string | null;
  cor: string | null;
  foto_url: string | null;
  status: "perdido" | "encontrado" | "em_casa";
  ultima_localizacao: string | null;
  data_desaparecimento: string | null;
  descricao: string | null;
  recompensa: number | null;
};

type Status = "perdido" | "encontrado" | "em_casa";
const empty: {
  nome: string; especie: string; raca: string; cor: string; status: Status;
  ultima_localizacao: string; data_desaparecimento: string; descricao: string; recompensa: string;
} = {
  nome: "", especie: "Cachorro", raca: "", cor: "", status: "perdido",
  ultima_localizacao: "", data_desaparecimento: "", descricao: "", recompensa: "",
};

function Dashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Pet | null>(null);
  const [form, setForm] = useState(empty);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (!s) navigate({ to: "/auth" });
    });
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate({ to: "/auth" });
      else setSession(data.session);
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const load = async () => {
    if (!session) return;
    setLoading(true);
    const { data, error } = await supabase.from("pets").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setPets((data as Pet[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { if (session) load(); }, [session]);

  const openCreate = () => { setEditing(null); setForm(empty); setFile(null); setShowForm(true); };
  const openEdit = (p: Pet) => {
    setEditing(p);
    setForm({
      nome: p.nome, especie: p.especie, raca: p.raca ?? "", cor: p.cor ?? "", status: p.status,
      ultima_localizacao: p.ultima_localizacao ?? "",
      data_desaparecimento: p.data_desaparecimento ?? "",
      descricao: p.descricao ?? "",
      recompensa: p.recompensa != null ? String(p.recompensa) : "",
    });
    setFile(null);
    setShowForm(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    setSaving(true);
    try {
      let foto_url = editing?.foto_url ?? null;
      if (file) {
        const ext = file.name.split(".").pop();
        const path = `${session.user.id}/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("pet-photos").upload(path, file);
        if (upErr) throw upErr;
        foto_url = supabase.storage.from("pet-photos").getPublicUrl(path).data.publicUrl;
      }
      const payload = {
        user_id: session.user.id,
        nome: form.nome,
        especie: form.especie,
        raca: form.raca || null,
        cor: form.cor || null,
        status: form.status,
        ultima_localizacao: form.ultima_localizacao || null,
        data_desaparecimento: form.data_desaparecimento || null,
        descricao: form.descricao || null,
        recompensa: form.recompensa ? Number(form.recompensa) : null,
        foto_url,
      };
      if (editing) {
        const { error } = await supabase.from("pets").update(payload).eq("id", editing.id);
        if (error) throw error;
        toast.success("Pet atualizado!");
      } else {
        const { error } = await supabase.from("pets").insert(payload);
        if (error) throw error;
        toast.success("Pet cadastrado!");
      }
      setShowForm(false);
      load();
    } catch (err: any) {
      toast.error(err.message ?? "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Apagar este pet?")) return;
    const { error } = await supabase.from("pets").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Pet removido.");
    load();
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  if (!session) return null;

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 py-12 md:px-14">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold md:text-5xl">Meu painel</h1>
            <p className="mt-2 text-sm text-muted-foreground">{session.user.email}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={openCreate} className="btn-primary-glow inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground">
              <Plus className="h-4 w-4" /> Cadastrar pet
            </button>
            <button onClick={logout} className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-medium text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4" /> Sair
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Carregando...</p>
        ) : pets.length === 0 ? (
          <div className="glass rounded-3xl p-16 text-center">
            <p className="mb-6 text-muted-foreground">Você ainda não cadastrou nenhum pet.</p>
            <button onClick={openCreate} className="btn-primary-glow inline-flex items-center gap-2 rounded-full px-7 py-4 font-semibold text-primary-foreground">
              <Plus className="h-4 w-4" /> Cadastrar primeiro pet
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pets.map((p) => (
              <article key={p.id} className="glass overflow-hidden rounded-3xl">
                <div className="aspect-[4/3] overflow-hidden bg-muted/40">
                  {p.foto_url ? <img src={p.foto_url} alt={p.nome} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-6xl">🐾</div>}
                </div>
                <div className="p-6">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <h3 className="text-xl font-bold">{p.nome}</h3>
                    <StatusBadge status={p.status} />
                  </div>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {p.especie}{p.raca ? ` · ${p.raca}` : ""}
                  </p>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(p)} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:bg-primary/10">
                      <Pencil className="h-3.5 w-3.5" /> Editar
                    </button>
                    <button onClick={() => remove(p.id)} className="inline-flex items-center gap-1.5 rounded-full border border-destructive/40 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-3.5 w-3.5" /> Apagar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm" onClick={() => setShowForm(false)}>
            <form onClick={(e) => e.stopPropagation()} onSubmit={save} className="glass max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-8">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-extrabold">{editing ? "Editar pet" : "Novo pet"}</h2>
                <button type="button" onClick={() => setShowForm(false)} className="rounded-full p-2 text-muted-foreground hover:bg-primary/10"><X className="h-5 w-5" /></button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Nome *" value={form.nome} onChange={(v) => setForm({ ...form, nome: v })} required />
                <Select label="Espécie *" value={form.especie} onChange={(v) => setForm({ ...form, especie: v })} options={["Cachorro", "Gato", "Pássaro", "Outro"]} />
                <Input label="Raça" value={form.raca} onChange={(v) => setForm({ ...form, raca: v })} />
                <Input label="Cor" value={form.cor} onChange={(v) => setForm({ ...form, cor: v })} />
                <Select label="Status" value={form.status} onChange={(v) => setForm({ ...form, status: v as any })} options={[["perdido", "Perdido"], ["encontrado", "Encontrado"], ["em_casa", "Em casa"]]} />
                <Input label="Recompensa (R$)" type="number" value={form.recompensa} onChange={(v) => setForm({ ...form, recompensa: v })} />
                <Input label="Última localização" value={form.ultima_localizacao} onChange={(v) => setForm({ ...form, ultima_localizacao: v })} className="md:col-span-2" />
                <Input label="Data do desaparecimento" type="date" value={form.data_desaparecimento} onChange={(v) => setForm({ ...form, data_desaparecimento: v })} />
                <div>
                  <label className="mb-2 block text-sm font-medium">Foto</label>
                  <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    className="w-full rounded-full border border-border bg-background/60 px-4 py-3 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-primary/15 file:px-3 file:py-1 file:text-blue-bright" />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium">Descrição</label>
                  <textarea rows={3} value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                    className="w-full rounded-2xl border border-border bg-background/60 px-5 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
              <button disabled={saving} className="btn-primary-glow mt-6 w-full rounded-full px-7 py-4 font-semibold text-primary-foreground disabled:opacity-60">
                {saving ? "Salvando..." : editing ? "Salvar alterações" : "Cadastrar pet"}
              </button>
            </form>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    perdido: { label: "Perdido", cls: "bg-destructive/20 text-destructive" },
    encontrado: { label: "Encontrado", cls: "bg-cyan/20 text-cyan" },
    em_casa: { label: "Em casa", cls: "bg-primary/20 text-blue-bright" },
  };
  const m = map[status] ?? map.perdido;
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${m.cls}`}>{m.label}</span>;
}

function Input({ label, value, onChange, className = "", ...rest }: { label: string; value: string; onChange: (v: string) => void; className?: string } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) {
  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-medium">{label}</label>
      <input {...rest} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-full border border-border bg-background/60 px-5 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: Array<string | [string, string]> }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-full border border-border bg-background/60 px-5 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
        {options.map((o) => {
          const [v, l] = Array.isArray(o) ? o : [o, o];
          return <option key={v} value={v} className="bg-background">{l}</option>;
        })}
      </select>
    </div>
  );
}
