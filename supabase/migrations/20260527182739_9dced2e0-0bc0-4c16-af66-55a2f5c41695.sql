
-- ENUM para status do pet
CREATE TYPE public.pet_status AS ENUM ('perdido', 'encontrado', 'em_casa');

-- Tabela pets
CREATE TABLE public.pets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  especie TEXT NOT NULL,
  raca TEXT,
  cor TEXT,
  foto_url TEXT,
  status public.pet_status NOT NULL DEFAULT 'perdido',
  ultima_localizacao TEXT,
  data_desaparecimento DATE,
  descricao TEXT,
  recompensa NUMERIC(10,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.pets TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pets TO authenticated;
GRANT ALL ON public.pets TO service_role;

ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

-- Qualquer pessoa pode ver pets perdidos (para ajudar a achar)
CREATE POLICY "Pets perdidos sao publicos"
  ON public.pets FOR SELECT
  TO anon, authenticated
  USING (status = 'perdido' OR auth.uid() = user_id);

CREATE POLICY "Tutor insere seus pets"
  ON public.pets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Tutor atualiza seus pets"
  ON public.pets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Tutor apaga seus pets"
  ON public.pets FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER pets_set_updated_at
  BEFORE UPDATE ON public.pets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Storage bucket público para fotos de pets
INSERT INTO storage.buckets (id, name, public)
VALUES ('pet-photos', 'pet-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Policies: tutor sobe/atualiza/apaga apenas na própria pasta {user_id}/...
CREATE POLICY "Fotos de pets sao publicas"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'pet-photos');

CREATE POLICY "Tutor envia foto na sua pasta"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'pet-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Tutor atualiza sua foto"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'pet-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Tutor apaga sua foto"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'pet-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
