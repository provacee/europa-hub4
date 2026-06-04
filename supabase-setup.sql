-- ============================================================
-- EUROPA HUB v2 — Supabase Database Setup
-- Executa aquest SQL al SQL Editor del teu projecte Supabase
-- supabase.com → Project → SQL Editor → New query → Paste → Run
-- ============================================================

-- Taula d'usuaris de l'aplicació (auth propi, no Supabase Auth)
CREATE TABLE IF NOT EXISTS app_users (
  id          text PRIMARY KEY,
  name        text NOT NULL,
  username    text UNIQUE NOT NULL,
  password    text NOT NULL,
  role        text NOT NULL,
  avatar      text DEFAULT '',
  player_id   text DEFAULT NULL
);

-- Jugadors
CREATE TABLE IF NOT EXISTS players (
  id        text PRIMARY KEY,
  name      text NOT NULL,
  surname   text NOT NULL,
  position  text DEFAULT '',
  foot      text DEFAULT 'D',
  number    integer DEFAULT 0,
  dob       text DEFAULT '',
  phone     text DEFAULT '',
  email     text DEFAULT '',
  notes     text DEFAULT ''
);

-- Sessions d'entrenament
CREATE TABLE IF NOT EXISTS trainings (
  id         text PRIMARY KEY,
  title      text NOT NULL,
  date       text NOT NULL,
  tasks      jsonb DEFAULT '[]'
);

-- Vídeos VEO
CREATE TABLE IF NOT EXISTS videos (
  id          text PRIMARY KEY,
  title       text NOT NULL,
  category    text DEFAULT 'attack',
  description text DEFAULT '',
  url         text DEFAULT '',
  date        text NOT NULL
);

-- Tasques de staff
CREATE TABLE IF NOT EXISTS tasks (
  id          text PRIMARY KEY,
  title       text NOT NULL,
  description text DEFAULT '',
  assigned_to text DEFAULT '',
  due_date    text DEFAULT '',
  status      text DEFAULT 'todo',
  comments    jsonb DEFAULT '[]'
);

-- Wellness (una entrada per jugador per dia)
CREATE TABLE IF NOT EXISTS wellness (
  id         text PRIMARY KEY,
  player_id  text NOT NULL,
  date       text NOT NULL,
  sleep      float DEFAULT 7,
  fatigue    integer DEFAULT 5,
  soreness   integer DEFAULT 5,
  condition  integer DEFAULT 7,
  physio     boolean DEFAULT false,
  comments   text DEFAULT '',
  CONSTRAINT wellness_player_date_unique UNIQUE (player_id, date)
);

-- Convocatòria activa (registre únic amb id='active')
CREATE TABLE IF NOT EXISTS selections (
  id                   text PRIMARY KEY DEFAULT 'active',
  rival                text DEFAULT '',
  match_date           text DEFAULT '',
  match_time           text DEFAULT '',
  venue                text DEFAULT '',
  meeting_point        text DEFAULT '',
  meeting_time         text DEFAULT '',
  team                 text DEFAULT '',
  observations         text DEFAULT '',
  published            boolean DEFAULT false,
  selected_players     jsonb DEFAULT '[]',
  not_selected_players jsonb DEFAULT '[]',
  updated_at           timestamptz DEFAULT now()
);

-- Scouting
CREATE TABLE IF NOT EXISTS scouting (
  id       text PRIMARY KEY,
  name     text NOT NULL,
  club     text DEFAULT '',
  age      integer DEFAULT 0,
  position text DEFAULT '',
  tag      text DEFAULT 'observed',
  notes    text DEFAULT ''
);

-- Jugades tàctiques
CREATE TABLE IF NOT EXISTS tactical_plays (
  id          text PRIMARY KEY,
  name        text NOT NULL,
  category    text DEFAULT '',
  description text DEFAULT '',
  mode        text DEFAULT 'solo',
  positions   jsonb DEFAULT '[]',
  drawings    jsonb DEFAULT '[]'
);

-- Permisos per rol
CREATE TABLE IF NOT EXISTS permissions (
  role  text PRIMARY KEY,
  perms jsonb DEFAULT '{}'
);

-- ── Row Level Security ──────────────────────────────────────
-- L'aplicació gestiona la seva pròpia autenticació.
-- Desactivem RLS per simplificar (eina interna de confiança).
-- Si vols seguretat addicional, activa RLS i crea polítiques.

ALTER TABLE app_users     DISABLE ROW LEVEL SECURITY;
ALTER TABLE players       DISABLE ROW LEVEL SECURITY;
ALTER TABLE trainings     DISABLE ROW LEVEL SECURITY;
ALTER TABLE videos        DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks         DISABLE ROW LEVEL SECURITY;
ALTER TABLE wellness      DISABLE ROW LEVEL SECURITY;
ALTER TABLE selections    DISABLE ROW LEVEL SECURITY;
ALTER TABLE scouting      DISABLE ROW LEVEL SECURITY;
ALTER TABLE tactical_plays DISABLE ROW LEVEL SECURITY;
ALTER TABLE permissions   DISABLE ROW LEVEL SECURITY;

-- ── Verificació ─────────────────────────────────────────────
-- Hauries de veure totes les taules creades:
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
