-- ============================================================
-- EUROPA HUB v2 — Staff, Foto i Fitxa Federativa
-- Executa al SQL Editor de Supabase
-- ============================================================

-- Noves columnes a la taula players
ALTER TABLE players ADD COLUMN IF NOT EXISTS photo_url  text DEFAULT '';
ALTER TABLE players ADD COLUMN IF NOT EXISTS doc_url    text DEFAULT '';
ALTER TABLE players ADD COLUMN IF NOT EXISTS person_type text DEFAULT 'player'; -- 'player' | 'staff'

-- ── Storage Buckets (fer des del Dashboard de Supabase) ─────
-- 1. Vés a Storage → New Bucket
-- 2. Crea "player-photos" (marca Public)
-- 3. Crea "player-docs"   (marca Public)
--
-- Opcionalment, política permissiva per a anon (sense RLS):
-- INSERT INTO storage.buckets (id, name, public) VALUES ('player-photos', 'player-photos', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('player-docs',   'player-docs',   true);
