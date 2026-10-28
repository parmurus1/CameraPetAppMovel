import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  nome: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  mensagem: z.string().trim().min(1).max(4000),
});

export const sendContact = createServerFn({ method: "POST" })
  .inputValidator((data) => schema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Simple rate limit: max 5 messages per e-mail in the last 10 minutes
    const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin
      .from("contact_submissions")
      .select("id", { count: "exact", head: true })
      .eq("email", data.email)
      .gte("created_at", since);
    if ((count ?? 0) >= 5) throw new Error("Muitas mensagens. Tente novamente em alguns minutos.");
    const { error } = await supabaseAdmin.from("contact_submissions").insert(data);
    if (error) throw new Error("Não foi possível enviar sua mensagem.");
    return { ok: true };
  });
