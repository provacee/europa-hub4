-- ============================================================
-- EUROPA HUB v2 — Teams & Invitations Migration
-- Executa al SQL Editor de Supabase DESPRÉS de supabase-setup.sql
-- ============================================================

-- ── Equips ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS teams (
  id          text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name        text NOT NULL,
  description text DEFAULT '',
  season      text DEFAULT '',
  color       text DEFAULT '#022E91',
  created_by  text DEFAULT '',
  created_at  timestamptz DEFAULT now()
);

-- Equip per defecte (totes les dades existents hi van)
INSERT INTO teams (id, name, description, season, created_by)
VALUES ('default', 'CE Europa — Primer Equip', '', '2025-26', 'system')
ON CONFLICT (id) DO NOTHING;

-- ── Membres d'equip ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS team_members (
  id         text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  team_id    text NOT NULL,
  user_id    text NOT NULL,
  added_at   timestamptz DEFAULT now(),
  CONSTRAINT team_members_unique UNIQUE (team_id, user_id)
);

-- Afegir tots els usuaris existents a l'equip per defecte
INSERT INTO team_members (team_id, user_id)
SELECT 'default', id FROM app_users
ON CONFLICT (team_id, user_id) DO NOTHING;

-- ── Invitacions ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS invitations (
  id             text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  team_id        text NOT NULL DEFAULT 'default',
  player_id      text DEFAULT '',
  player_name    text NOT NULL,
  player_surname text NOT NULL,
  email          text NOT NULL,
  role           text DEFAULT 'player',
  token          text UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  status         text DEFAULT 'pending',
  created_by     text DEFAULT '',
  created_at     timestamptz DEFAULT now(),
  expires_at     timestamptz DEFAULT (now() + interval '7 days')
);

-- ── Afegir team_id a totes les taules d'entitat ─────────────
ALTER TABLE players        ADD COLUMN IF NOT EXISTS team_id text DEFAULT 'default';
ALTER TABLE trainings      ADD COLUMN IF NOT EXISTS team_id text DEFAULT 'default';
ALTER TABLE videos         ADD COLUMN IF NOT EXISTS team_id text DEFAULT 'default';
ALTER TABLE tasks          ADD COLUMN IF NOT EXISTS team_id text DEFAULT 'default';
ALTER TABLE wellness       ADD COLUMN IF NOT EXISTS team_id text DEFAULT 'default';
ALTER TABLE selections     ADD COLUMN IF NOT EXISTS team_id text DEFAULT 'default';
ALTER TABLE scouting       ADD COLUMN IF NOT EXISTS team_id text DEFAULT 'default';
ALTER TABLE tactical_plays ADD COLUMN IF NOT EXISTS team_id text DEFAULT 'default';

-- Assignar l'equip per defecte a tots els registres existents
UPDATE players        SET team_id = 'default' WHERE team_id IS NULL OR team_id = '';
UPDATE trainings      SET team_id = 'default' WHERE team_id IS NULL OR team_id = '';
UPDATE videos         SET team_id = 'default' WHERE team_id IS NULL OR team_id = '';
UPDATE tasks          SET team_id = 'default' WHERE team_id IS NULL OR team_id = '';
UPDATE wellness       SET team_id = 'default' WHERE team_id IS NULL OR team_id = '';
UPDATE selections     SET team_id = 'default' WHERE team_id IS NULL OR team_id = '';
UPDATE scouting       SET team_id = 'default' WHERE team_id IS NULL OR team_id = '';
UPDATE tactical_plays SET team_id = 'default' WHERE team_id IS NULL OR team_id = '';

-- ── RLS ─────────────────────────────────────────────────────
ALTER TABLE teams        DISABLE ROW LEVEL SECURITY;
ALTER TABLE team_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE invitations  DISABLE ROW LEVEL SECURITY;

-- ── Verificació ─────────────────────────────────────────────
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' ORDER BY table_name;
