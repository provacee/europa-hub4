/* ============================================================
   EUROPA HUB v2 — Core JS
   Auth · Data · Routing · Utilities
   ============================================================ */
'use strict';

// ── Default Data ───────────────────────────────────────────

const DEFAULT_USERS = [
  { id:'u1', name:'Admin Europa',       username:'admin',    password:'admin123',    role:'administrator',      avatar:'AE', player_id: null },
  { id:'u2', name:'Marc Puigdomènech',  username:'director', password:'director123', role:'sporting_director',  avatar:'MP', player_id: null },
  { id:'u3', name:'Jordi Vilà',         username:'coach',    password:'coach123',    role:'coach',              avatar:'JV', player_id: null },
  { id:'u4', name:'Alex Martínez',      username:'player',   password:'player123',   role:'player',             avatar:'AM', player_id: 'p4'  },
  { id:'u5', name:'Marta Solà',         username:'comm',     password:'comm123',     role:'communication',      avatar:'MS', player_id: null },
  { id:'u6', name:'Pau Ferrer',         username:'office',   password:'office123',   role:'office',             avatar:'PF', player_id: null },
  { id:'u7', name:'Rosa Camps',         username:'member',   password:'member123',   role:'member',             avatar:'RC', player_id: null },
];

const DEFAULT_ROLES = {
  administrator:     { label:'Administrador',      color:'red'    },
  sporting_director: { label:'Director Esportiu',  color:'blue'   },
  coach:             { label:'Entrenador/a',        color:'blue'   },
  staff:             { label:'Staff tècnic',        color:'purple' },
  player:            { label:'Jugador/a',           color:'green'  },
  communication:     { label:'Comunicació',         color:'yellow' },
  office:            { label:'Oficina',             color:'gray'   },
  member:            { label:'Soci',                color:'gray'   },
};

const DEFAULT_PERMISSIONS = {
  administrator:     { home:true,  squad:true,  tactical:true,  training:true,  veo:true,  tasks:true,  wellness:true,  selection:true,  sporting2:true,  scouting:true,  communication:true,  office:true,  members:true,  admin:true,  teams:true,  invite:true,  staff_view:false },
  sporting_director: { home:true,  squad:true,  tactical:true,  training:true,  veo:true,  tasks:true,  wellness:true,  selection:true,  sporting2:true,  scouting:true,  communication:false, office:false, members:false, admin:false, teams:true,  invite:true,  staff_view:false },
  coach:             { home:true,  squad:true,  tactical:true,  training:true,  veo:true,  tasks:true,  wellness:true,  selection:true,  sporting2:false, scouting:false,  communication:false, office:false, members:false, admin:false, teams:false, invite:true,  staff_view:false },
  staff:             { home:true,  squad:false, tactical:true,  training:true,  veo:true,  tasks:true,  wellness:false, selection:false, sporting2:false, scouting:false,  communication:false, office:false, members:false, admin:false, teams:false, staff_view:true  },
  player:            { home:true,  squad:false, tactical:false, training:false, veo:false, tasks:false, wellness:false, selection:false, sporting2:true,  scouting:false,  communication:false, office:false, members:false, admin:false, teams:false, staff_view:false },
  communication:     { home:true,  squad:false, tactical:false, training:false, veo:false, tasks:false, wellness:false, selection:false, sporting2:false, scouting:false,  communication:true,  office:false, members:false, admin:false, teams:false, staff_view:false },
  office:            { home:true,  squad:false, tactical:false, training:false, veo:false, tasks:false, wellness:false, selection:false, sporting2:false, scouting:false,  communication:false, office:true,  members:false, admin:false, teams:false, staff_view:false },
  member:            { home:true,  squad:false, tactical:false, training:false, veo:false, tasks:false, wellness:false, selection:false, sporting2:false, scouting:false,  communication:false, office:false, members:true,  admin:false, teams:false, staff_view:false },
};

const DEFAULT_PLAYERS = [
  { id:'p1',  name:'Marc',    surname:'Puigdomènech', position:'Porter',          foot:'D', number:1,  dob:'1996-03-12', phone:'600111001', email:'marc@ceeuropa.cat',   notes:'' },
  { id:'p2',  name:'Joan',    surname:'Espinosa',     position:'Defensa Central', foot:'D', number:4,  dob:'1998-07-22', phone:'600111002', email:'joan@ceeuropa.cat',   notes:'' },
  { id:'p3',  name:'Carles',  surname:'Mas',          position:'Defensa Central', foot:'E', number:5,  dob:'1999-02-14', phone:'600111003', email:'carles@ceeuropa.cat', notes:'' },
  { id:'p4',  name:'Àlex',    surname:'Ribera',       position:'Lateral Dret',    foot:'D', number:2,  dob:'2000-11-03', phone:'600111004', email:'alex@ceeuropa.cat',   notes:'' },
  { id:'p5',  name:'Sergi',   surname:'Fonts',        position:'Lateral Esquerre',foot:'E', number:3,  dob:'2001-05-17', phone:'600111005', email:'sergi@ceeuropa.cat',  notes:'' },
  { id:'p6',  name:'David',   surname:'Bartra',       position:'Migcampista',     foot:'D', number:6,  dob:'1997-09-08', phone:'600111006', email:'david@ceeuropa.cat',  notes:'' },
  { id:'p7',  name:'Miquel',  surname:'Coll',         position:'Migcampista',     foot:'E', number:8,  dob:'1999-04-25', phone:'600111007', email:'miquel@ceeuropa.cat', notes:'' },
  { id:'p8',  name:'Pau',     surname:'Sistach',      position:'Migcampista',     foot:'D', number:10, dob:'2000-01-30', phone:'600111008', email:'pau@ceeuropa.cat',    notes:'' },
  { id:'p9',  name:'Oriol',   surname:'Valls',        position:'Extrem Dret',     foot:'D', number:7,  dob:'2001-08-19', phone:'600111009', email:'oriol@ceeuropa.cat',  notes:'' },
  { id:'p10', name:'Gerard',  surname:'Lluch',        position:'Extrem Esquerre', foot:'E', number:11, dob:'2002-03-06', phone:'600111010', email:'gerard@ceeuropa.cat', notes:'' },
  { id:'p11', name:'Arnau',   surname:'Torra',        position:'Davanter',        foot:'D', number:9,  dob:'1998-12-22', phone:'600111011', email:'arnau@ceeuropa.cat',  notes:'' },
  { id:'p12', name:'Nil',     surname:'Solé',         position:'Migcampista',     foot:'E', number:14, dob:'2003-06-11', phone:'600111012', email:'nil@ceeuropa.cat',    notes:'' },
  { id:'p13', name:'Ferran',  surname:'Puig',         position:'Defensa Central', foot:'D', number:15, dob:'2001-10-04', phone:'600111013', email:'ferran@ceeuropa.cat', notes:'' },
  { id:'p14', name:'Ignasi',  surname:'Monfort',      position:'Davanter',        foot:'D', number:19, dob:'2000-07-29', phone:'600111014', email:'ignasi@ceeuropa.cat', notes:'' },
  { id:'p15', name:'Xavier',  surname:'Castells',     position:'Porter',          foot:'D', number:13, dob:'1997-02-18', phone:'600111015', email:'xavier@ceeuropa.cat', notes:'' },
  { id:'p16', name:'Roger',   surname:'Domènech',     position:'Lateral Dret',    foot:'D', number:22, dob:'2002-09-01', phone:'600111016', email:'roger@ceeuropa.cat',  notes:'' },
];

const DEFAULT_TRAININGS = [
  { id:'t1', date:'2026-06-14', title:'Sessió 14 Juny 2026',
    tasks:[
      { name:'Rondo',        duration:15, notes:'4v2, zona petita', team:'all' },
      { name:'Finalització', duration:25, notes:'Tirs a porta amb pressió', team:'A' },
      { name:'Partit reduït',duration:30, notes:'5v5 a 2 tocs', team:'all' },
    ]},
  { id:'t2', date:'2026-06-11', title:'Sessió 11 Juny 2026',
    tasks:[
      { name:'Activació',    duration:10, notes:'Escalfament dinàmic', team:'all' },
      { name:'Pressing alt', duration:20, notes:'4-3-3 pressing', team:'all' },
      { name:'Joc de posició',duration:35, notes:'7v7 en zona mitja', team:'B' },
    ]},
];

const DEFAULT_VIDEOS = [
  { id:'v1', title:'Pressing Alt 4-3-3',  category:'attack',     description:'Activació pressing en sortida rival', url:'https://youtube.com', date:'2026-06-01' },
  { id:'v2', title:'Bloc Baix Compacte',  category:'defence',    description:'Organització defensiva 4-4-2 pla',   url:'https://youtube.com', date:'2026-05-28' },
  { id:'v3', title:'Transició Ràpida',    category:'transition', description:'Contraatac des de defensa',          url:'https://youtube.com', date:'2026-05-20' },
  { id:'v4', title:'Córner Ofensiu 1',    category:'set_pieces', description:'Jugada ensajada córner costat dret', url:'https://youtube.com', date:'2026-05-15' },
];

const DEFAULT_TASKS = [
  { id:'tk1', title:"Anàlisi rival proper",    description:'Preparar informe tàctic CF Badalona', assignedTo:'u3', dueDate:'2026-06-13', status:'in_progress', comments:[] },
  { id:'tk2', title:'Llista de convocatòria',  description:"Enviar llista als jugadors",          assignedTo:'u3', dueDate:'2026-06-12', status:'todo',        comments:[] },
  { id:'tk3', title:"Pla d'entrenament",       description:'Sessió dilluns-dimecres-divendres',   assignedTo:'u2', dueDate:'2026-06-15', status:'todo',        comments:[] },
];

const DEFAULT_WELLNESS = {
  p1: [{ date:'2026-06-04', sleep:7, fatigue:3, soreness:2, condition:8, physio:false, comments:'' }],
  p4: [{ date:'2026-06-04', sleep:6, fatigue:5, soreness:6, condition:6, physio:true,  comments:'Molèstia bessó esquerre' }],
  p8: [{ date:'2026-06-04', sleep:8, fatigue:2, soreness:1, condition:9, physio:false, comments:'' }],
};

const DEFAULT_SQUAD_SELECTION = {
  id: 'active',
  rival: '', match_date: '', match_time: '', venue: '',
  meeting_point: '', meeting_time: '', team: '', observations: '',
  published: false,
  selected:    ['p1','p2','p3','p4','p5','p6','p7','p8','p9','p10','p11'],
  notSelected: ['p12','p13','p14','p15','p16'],
};

const DEFAULT_SCOUTING = [
  { id:'s1', name:'Biel Noguera', club:'FC Barcelona B',   age:19, position:'Migcampista', tag:'interesting', notes:'' },
  { id:'s2', name:'Dani Camara',  club:"CE L'Hospitalet",  age:22, position:'Davanter',    tag:'priority',    notes:'Golejador' },
  { id:'s3', name:'Marc Giralt',  club:'UE Cornellà',      age:21, position:'Lateral Dret',tag:'observed',    notes:'' },
];

const DEFAULT_TACTICAL_PLAYS = [
  { id:'tp1', name:"Córner Ofensiu 1", category:'Corners',  description:'Jugada córner costat dret', mode:'solo',  positions:[], drawings:[] },
  { id:'tp2', name:'Pressing 4-3-3',   category:'Pressing', description:'Activació pressing alt',    mode:'solo',  positions:[], drawings:[] },
];

// ── Database Layer ──────────────────────────────────────────
// DB, initDB i loadTeamData estan definits a js/db.js

// ── Team State ──────────────────────────────────────────────
let currentTeamId = 'default';
let currentTeam   = { id:'default', name:'CE Europa' };

async function initTeam() {
  if (!USE_SUPABASE) {
    const myTeams = DB.myTeams();
    if (!myTeams || myTeams.length === 0) {
      currentTeamId = null;
      currentTeam   = null;
      return;
    }
    const savedId   = lsGet('eh_current_team');
    const savedTeam = myTeams.find(t => t.id === savedId);
    const team      = savedTeam || myTeams[0];
    currentTeamId   = team.id;
    currentTeam     = team;
    loadEntityDataFromLocalStorage();
    return;
  }

  const myTeams = DB.myTeams();

  /* Si no té cap equip, no l'assignem automàticament */
  if (!myTeams || myTeams.length === 0) {
    currentTeamId = null;
    currentTeam   = null;
    return;
  }

  const savedId   = lsGet('eh_current_team');
  const savedTeam = myTeams.find(t => t.id === savedId);
  await switchTeam(savedTeam || myTeams[0]);
}

async function switchTeam(team) {
  currentTeamId = team.id;
  currentTeam   = team;
  lsSet('eh_current_team', team.id);
  await loadTeamData(team.id);
}

// ── Auth ───────────────────────────────────────────────────

let currentUser = null;

function login(username, password) {
  const user = DB.users().find(u => u.username === username && u.password === password);
  if (!user) return false;
  currentUser = user;
  lsSet('eh_session', user.id);
  return true;
}

function logout() {
  currentUser   = null;
  currentTeamId = 'default';
  currentTeam   = null;
  localStorage.removeItem('eh_session');
  localStorage.removeItem('eh_current_team');
  window.location.reload();
}

function restoreSession() {
  const id = lsGet('eh_session');
  if (!id) return false;
  const user = DB.users().find(u => u.id === id);
  if (!user) return false;
  currentUser = user;
  return true;
}

function can(perm) {
  if (!currentUser) return false;
  // 1. Per-user override (màxima prioritat)
  const overrides = (lsGet('eh_user_perms') || {})[currentUser.id];
  if (overrides && overrides.hasOwnProperty(perm)) return !!overrides[perm];
  // 2. Permisos del rol a la BD
  const dbPerms = (DB.permissions()[currentUser.role] || {});
  if (dbPerms.hasOwnProperty(perm)) return !!dbPerms[perm];
  // 3. Fallback als permisos per defecte (evita problemes si Supabase no té el rol)
  return !!(DEFAULT_PERMISSIONS[currentUser.role] || {})[perm];
}

function saveUserPerm(userId, perm, value) {
  const all = lsGet('eh_user_perms') || {};
  if (!all[userId]) all[userId] = {};
  all[userId][perm] = value;
  lsSet('eh_user_perms', all);
}

function getUserEffectivePerms(userId) {
  const user = DB.users().find(u => u.id === userId);
  if (!user) return {};
  const rolePerms = DB.permissions()[user.role] || {};
  const overrides = (lsGet('eh_user_perms') || {})[userId] || {};
  return { ...rolePerms, ...overrides };
}

function joinViaLink() {
  const input = document.getElementById('invite-link-input');
  const link  = input?.value?.trim();
  if (!link) return toast('Enganxa un enllaç d\'invitació', 'error');
  const match = link.match(/#invite-(.+)/) || link.match(/invite[/-](.+)/);
  if (!match) return toast('Enllaç no vàlid. Ha de contenir #invite-TOKEN', 'error');
  window.location.hash = `invite-${match[1].trim()}`;
  window.location.reload();
}

function deleteMessage(msgId) {
  lsSet('eh_messages', getMessages().filter(m => m.id !== msgId));
  navigate('messaging');
}

// ── Router ─────────────────────────────────────────────────

let currentPage = 'desktop';

function navigate(page) {
  currentPage = page;
  renderApp();
}

function closeWindow() {
  currentPage = 'desktop';
  renderApp();
}

// ── Toast ──────────────────────────────────────────────────

function toast(msg, type='info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  const icons = { success:'✓', error:'✕', info:'ℹ' };
  const colors = { success:'var(--green)', error:'var(--brand)', info:'var(--blue)' };
  el.innerHTML = `<span style="color:${colors[type]};font-weight:700">${icons[type]}</span> ${msg}`;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

// ── Helpers ────────────────────────────────────────────────

function uid() { return 'id_' + Math.random().toString(36).slice(2,9); }

function formatDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('ca-ES', { day:'2-digit', month:'short', year:'numeric' });
}

function roleBadge(role) {
  const r = DEFAULT_ROLES[role] || { label: role, color:'gray' };
  return `<span class="badge badge-${r.color}">${r.label}</span>`;
}

function tagBadge(tag) {
  const map    = { observed:'badge-gray', interesting:'badge-yellow', priority:'badge-red', signed:'badge-green' };
  const labels = { observed:'Observat', interesting:'Interessant', priority:'Prioritari', signed:'Fitxat' };
  return `<span class="badge ${map[tag]||'badge-gray'}">${labels[tag]||tag}</span>`;
}

function positionBadge(pos) {
  return `<span class="badge badge-blue">${pos}</span>`;
}

function calcAge(dob) {
  const b = new Date(dob), n = new Date();
  let age = n.getFullYear() - b.getFullYear();
  if (n < new Date(n.getFullYear(), b.getMonth(), b.getDate())) age--;
  return age;
}

function scoreColor(v, max=10) {
  const r = v/max;
  if (r >= .7) return 'score-high';
  if (r >= .4) return 'score-mid';
  return 'score-low';
}

// ── Icons ──────────────────────────────────────────────────

const ICONS = {
  home:`<path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/>`,
  settings:`<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>`,
  users:`<circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/><path d="M16 3.13a4 4 0 010 7.75M21 21v-2a4 4 0 00-3-3.87"/>`,
  shield:`<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`,
  tactical:`<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="2" fill="currentColor" stroke="none"/><circle cx="15.5" cy="8.5" r="2" fill="currentColor" stroke="none"/><circle cx="12" cy="15" r="2" fill="currentColor" stroke="none"/><path d="M8.5 8.5 Q10 11 12 15"/><path d="M15.5 8.5 Q14 11 12 15"/><line x1="8.5" y1="8.5" x2="15.5" y2="8.5" stroke-dasharray="2 2"/>`,
  training:`<path d="M6 4v8"/><path d="M18 4v8"/><path d="M3 8h18"/><circle cx="6" cy="3" r="1" fill="currentColor" stroke="none"/><circle cx="6" cy="13" r="1" fill="currentColor" stroke="none"/><circle cx="18" cy="3" r="1" fill="currentColor" stroke="none"/><circle cx="18" cy="13" r="1" fill="currentColor" stroke="none"/><path d="M5 19h14M8 19v-3h8v3"/>`,
  video:`<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>`,
  tasks:`<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>`,
  wellness:`<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>`,
  selection:`<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M9 16l2 2 4-4"/>`, /* calendari + check */
  scouting:`<circle cx="6" cy="14" r="3.5"/><circle cx="18" cy="14" r="3.5"/><rect x="9.5" y="12.5" width="5" height="3" rx=".5"/><path d="M9.5 14h-1m7 0h1"/><path d="M11 14v-4.5a1 1 0 012 0V14"/><path d="M13 7.5l2-3M11 7.5l-2-3"/>`,
  comm:`<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>`,
  office:`<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>`,
  member:`<rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="12" r="2.5"/><path d="M13 10h5M13 14h3"/>`,
  admin:`<circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/>`,
  plus:`<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>`,
  edit:`<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>`,
  trash:`<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>`,
  logout:`<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>`,
  email:`<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>`,
  badge:`<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 7V5a2 2 0 00-4 0v2M8 7V5a2 2 0 014 0v2M12 12v3M10 14h4"/>`,
  msg:`<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/><line x1="9" y1="10" x2="15" y2="10"/><line x1="9" y1="14" x2="13" y2="14"/>`,
  check:`<polyline points="20 6 9 17 4 12"/>`,
  close:`<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>`,
  play:`<polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/>`,
  publish:`<path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/>`,
  chart:`<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>`,
  arrow:`<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>`,
  line:`<line x1="5" y1="19" x2="19" y2="5"/>`,
  eraser:`<path d="M20 20H7L3 16l11-11 7 7-1.5 1.5"/><path d="M6.5 17.5l3-3"/>`,
  undo:`<polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 00-4-4H4"/>`,
  move:`<polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/><polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/>`,
};

function ico(name) {
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0">${ICONS[name]||''}</svg>`;
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

// ── Render shell ───────────────────────────────────────────

// ── TEAM SELECTOR ──────────────────────────────────────────

function renderTeamSelector() {
  const myTeams = DB.myTeams();
  return `
  <div style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:var(--bg);padding:24px">
    <div style="width:100%;max-width:420px">
      <div style="text-align:center;margin-bottom:32px">
        <img src="assets/escut.svg" style="width:60px;margin:0 auto 16px" alt="CE Europa">
        <div style="font-family:var(--font-display);font-size:1.8rem;letter-spacing:.08em;text-transform:uppercase;color:var(--brand)">Selecciona l'equip</div>
        <div style="font-size:.8rem;color:var(--text3);margin-top:4px">Benvingut/da, ${currentUser?.name?.split(' ')[0]}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px" id="team-list">
        ${myTeams.map(t => `
        <div onclick="handleTeamSelect('${t.id}')" style="cursor:pointer;padding:16px 18px;background:var(--bg);border:2px solid var(--border);border-radius:10px;display:flex;align-items:center;gap:14px;transition:border-color .15s"
          onmouseover="this.style.borderColor='var(--brand)'" onmouseout="this.style.borderColor='var(--border)'">
          <div style="width:40px;height:40px;border-radius:8px;background:${t.color||'#022E91'};display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <img src="assets/escut.svg" style="width:26px;filter:brightness(0) invert(1)" alt="">
          </div>
          <div>
            <div style="font-weight:600;font-size:.9rem">${t.name}</div>
            ${t.season ? `<div style="font-size:.75rem;color:var(--text3)">${t.season}</div>` : ''}
          </div>
          <span style="margin-left:auto;color:var(--text3)">→</span>
        </div>`).join('')}
      </div>
      ${can('teams') ? `
      <div style="margin-top:20px;text-align:center">
        <button class="btn btn-ghost btn-sm" onclick="_squadTab='teams';navigate('squad')" style="font-size:.78rem">
          ${ico('plus')} Crear nou equip
        </button>
      </div>` : ''}
      <div style="margin-top:24px;text-align:center">
        <button onclick="logout()" style="font-size:.75rem;color:var(--text3);background:none;border:none;cursor:pointer">Tancar sessió</button>
      </div>
    </div>
  </div>
  <div id="toast-container"></div>`;
}

function bindTeamSelector() {
  window.handleTeamSelect = async (teamId) => {
    const team = DB.teams().find(t => t.id === teamId);
    if (!team) return;
    document.getElementById('team-list').style.opacity = '.5';
    document.getElementById('team-list').style.pointerEvents = 'none';
    await switchTeam(team);
    renderApp();
  };
}

// ── INVITE ACCEPT ──────────────────────────────────────────

function renderInviteAccept(inv, token) {
  if (!inv) return `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg)">
      <div style="text-align:center;max-width:380px;padding:24px">
        <div style="font-size:2.5rem;margin-bottom:12px">❌</div>
        <div style="font-family:var(--font-display);font-size:1.4rem;color:var(--brand);text-transform:uppercase">Invitació no vàlida</div>
        <div style="color:var(--text3);font-size:.875rem;margin-top:8px">L'enllaç és incorrecte, ja ha estat usat o ha caducat (7 dies).</div>
        <button onclick="window.location.hash='';window.location.reload()" class="btn btn-primary" style="margin-top:20px">Anar al login</button>
      </div>
    </div>`;

  if (inv.status === 'accepted') return `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg)">
      <div style="text-align:center;max-width:380px;padding:24px">
        <div style="font-size:2.5rem;margin-bottom:12px">✅</div>
        <div style="font-family:var(--font-display);font-size:1.4rem;color:var(--brand);text-transform:uppercase">Compte ja activat</div>
        <div style="color:var(--text3);font-size:.875rem;margin-top:8px">Aquest compte ja ha estat activat. Inicia sessió normalment.</div>
        <button onclick="window.location.hash='';window.location.reload()" class="btn btn-primary" style="margin-top:20px">Iniciar sessió</button>
      </div>
    </div>`;

  return `
  <div style="min-height:100vh;display:flex;background:var(--bg)">
    <div style="flex:1;background:var(--brand);display:flex;align-items:center;justify-content:center;padding:40px">
      <div style="text-align:center;position:relative;z-index:1">
        <img src="assets/escut.svg" style="width:80px;margin:0 auto 20px;filter:brightness(0) invert(1)" alt="CE Europa">
        <div style="font-family:var(--font-display);font-size:2.8rem;letter-spacing:.08em;color:#fff;text-transform:uppercase;line-height:1">EUROPA<br>HUB</div>
        <div style="color:rgba(255,255,255,.6);font-size:.875rem;margin-top:12px">Plataforma digital interna<br>Club Esportiu Europa</div>
      </div>
    </div>
    <div style="width:460px;display:flex;align-items:center;justify-content:center;padding:40px;border-left:1px solid var(--border)">
      <div style="width:100%;max-width:340px">
        <div style="font-family:var(--font-display);font-size:1.6rem;letter-spacing:.07em;text-transform:uppercase;color:var(--brand);margin-bottom:4px">Activa el teu compte</div>
        <div style="color:var(--text3);font-size:.8125rem;margin-bottom:8px">
          Hola, <strong>${inv.player_name} ${inv.player_surname}</strong>. Has estat convidat/da com a
          <strong>${DEFAULT_ROLES[inv.role]?.label || inv.role}</strong>.
          Defineix les teves credencials per accedir a l'equip.
        </div>
        <div style="padding:8px 12px;background:var(--brand-dim);border:1px solid var(--brand-dim);border-radius:8px;font-size:.75rem;color:var(--brand);margin-bottom:16px">
          Un cop activat el compte tindràs accés exclusiu a la base de dades de l'equip, compartida amb tots els membres.
        </div>
        <div id="invite-error" style="display:none;padding:8px 12px;background:var(--red-dim);border:1px solid rgba(192,2,14,.2);border-radius:6px;color:var(--red);font-size:.78rem;margin-bottom:12px"></div>
        <div style="display:flex;flex-direction:column;gap:12px">
          <div class="form-group">
            <label class="form-label">Nom d'usuari</label>
            <input class="form-input" id="inv-username" placeholder="nom_usuari" value="${inv.player_name.toLowerCase().replace(/\s+/g,'')}">
          </div>
          <div class="form-group">
            <label class="form-label">Contrasenya</label>
            <input class="form-input" type="password" id="inv-password" placeholder="Mínim 6 caràcters">
          </div>
          <div class="form-group">
            <label class="form-label">Confirma la contrasenya</label>
            <input class="form-input" type="password" id="inv-password2" placeholder="Repeteix la contrasenya">
          </div>
          <button class="btn btn-primary" style="margin-top:4px;padding:10px;font-size:.875rem;letter-spacing:.03em" onclick="submitInviteAccept('${token}')">
            Activar compte →
          </button>
        </div>
      </div>
    </div>
  </div>
  <div id="toast-container"></div>`;
}

function bindInviteAccept(token) {
  window.submitInviteAccept = async (tk) => {
    const username  = document.getElementById('inv-username').value.trim();
    const password  = document.getElementById('inv-password').value;
    const password2 = document.getElementById('inv-password2').value;
    const errEl = document.getElementById('invite-error');
    const showErr = (msg) => { errEl.textContent = msg; errEl.style.display = 'block'; };

    if (!username) { showErr('El nom d\'usuari és obligatori'); return; }
    if (password.length < 6) { showErr('La contrasenya ha de tenir almenys 6 caràcters'); return; }
    if (password !== password2) { showErr('Les contrasenyes no coincideixen'); return; }
    const existing = DB.users().find(u => u.username === username);
    if (existing) { showErr('Aquest nom d\'usuari ja existeix'); return; }

    errEl.style.display = 'none';
    try {
      const newUser = await DB.acceptInvitation(tk, { username, password });
      toast('Compte activat correctament! Inicia sessió.', 'success');
      setTimeout(() => { window.location.hash = ''; window.location.reload(); }, 1500);
    } catch(e) {
      showErr(e.message || 'Error en activar el compte');
    }
  };
}

// ── NO TEAM STATE ──────────────────────────────────────────

function renderNoTeam() {
  return `
  <div class="loading-screen">
    <div class="loading-bg"></div>
    <img src="assets/escut.svg" class="loading-logo" alt="CE Europa" style="opacity:.6;filter:none">
    <div style="position:relative;z-index:1;text-align:center;max-width:340px;padding:0 24px">
      <div style="font-family:var(--font-display);font-size:1.5rem;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.85);margin-bottom:10px">
        Sense equip assignat
      </div>
      <div style="font-size:.8rem;color:rgba(255,255,255,.4);line-height:1.6;margin-bottom:28px">
        El teu compte encara no pertany a cap equip.<br>
        Demana a un administrador que t'afegeixi o utilitza un enllaç d'invitació.
      </div>
      <button onclick="logout()" style="
        background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);
        color:rgba(255,255,255,.7);padding:10px 22px;border-radius:10px;
        font-family:var(--font);font-size:.8rem;cursor:pointer;
        transition:all .15s ease;
      " onmouseover="this.style.background='rgba(255,255,255,.16)'" onmouseout="this.style.background='rgba(255,255,255,.1)'">
        Tancar sessió
      </button>
    </div>
  </div>
  <div id="toast-container"></div>`;
}

// ── RENDER APP ─────────────────────────────────────────────

function renderApp() {
  const root = document.getElementById('app');
  if (!currentUser) {
    root.innerHTML = renderLogin();
    bindLogin();
    return;
  }
  const isDesktop = currentPage === 'desktop';
  root.innerHTML = `
    <div class="desktop">
      <div class="desktop-overlay"></div>
<div class="desktop-clock">
        <div class="clock-time" id="desktop-clock-time"></div>
        <div class="clock-date" id="desktop-clock-date"></div>
      </div>
      <div class="desktop-team-label">
        <img src="assets/escut.svg" alt="CE Europa">
        <span class="desktop-team-name">${currentTeam?.name || 'CE Europa'}</span>
      </div>
      ${isDesktop ? renderWidgets() : ''}
      ${isDesktop ? `` : `
      <div class="app-window">
        ${renderWindowBar()}
        <div class="window-body" id="page-body">
          ${renderPage()}
        </div>
      </div>`}
      ${renderTaskbar()}
    </div>
    <div id="toast-container"></div>
  `;
  bindNav();
  bindPageEvents();
  startClock();
  applySettings();
  applyTheme();
  if (currentPage === 'desktop') fetchWeather();
}

const GRADIENT_WALLS = {
  'gradient-dark':   'linear-gradient(135deg,#060d1c 0%,#0a1628 100%)',
  'gradient-blue':   'linear-gradient(135deg,#03071e 0%,#023e8a 100%)',
  'gradient-sky':    'linear-gradient(135deg,#0d1b3e 0%,#1a3a6e 50%,#0d2b55 100%)',
  'gradient-abyss':  'linear-gradient(160deg,#010d1e 0%,#0a2040 60%,#001233 100%)',
};

function applySettings() {
  const accent    = lsGet('eh_accent')    || '#2563eb';
  const wallpaper = lsGet('eh_wallpaper') || null;
  const r = parseInt(accent.slice(1,3),16);
  const g = parseInt(accent.slice(3,5),16);
  const b = parseInt(accent.slice(5,7),16);
  document.documentElement.style.setProperty('--brand',      accent);
  document.documentElement.style.setProperty('--brand-mid',  `rgba(${r},${g},${b},.85)`);
  document.documentElement.style.setProperty('--brand-glow', `rgba(${r},${g},${b},.35)`);
  document.documentElement.style.setProperty('--brand-dim',  `rgba(${r},${g},${b},.12)`);
  _applyWallpaper(wallpaper);
}

const DEFAULT_WALLPAPER = 'assets/grada.jpg';

function _applyWallpaper(val) {
  const desktop = document.querySelector('.desktop');
  if (!desktop) return;
  desktop.removeAttribute('style');
  if (!val) {
    desktop.style.cssText = `background:#060d1c url('${DEFAULT_WALLPAPER}') center/cover no-repeat`;
  } else if (val === 'camp') {
    desktop.style.cssText = `background:#060d1c url('assets/camp.jpg') center/cover no-repeat`;
  } else if (GRADIENT_WALLS[val]) {
    desktop.style.cssText = `background:${GRADIENT_WALLS[val]}`;
  } else {
    desktop.style.cssText = `background:#060d1c url('${val}') center/cover no-repeat`;
  }
}

function saveAccent(color) {
  lsSet('eh_accent', color);
  applySettings();
  document.querySelectorAll('.settings-accent-item').forEach(el => {
    el.classList.toggle('active', el.dataset.color === color);
  });
}

function saveWallpaper(val) {
  lsSet('eh_wallpaper', val);
  _applyWallpaper(val);
  navigate('settings');
}

function applyTheme() {
  const t = lsGet('eh_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', t);
}

function saveTheme(t) {
  lsSet('eh_theme', t);
  applyTheme();
  navigate('settings');
}

function renderWidgets() {
  if (!currentUser) return '';
  const shown = lsGet('eh_widgets') ?? { stats:true, match:true, tasks:true, wellness:true };
  const players   = (DB.players()||[]).filter(p=>p.person_type!=='staff');
  const trainings = DB.trainings()||[];
  const tasks     = (DB.tasks()||[]).filter(t=>t.status!=='done');
  const sel       = DB.selection();
  let html = '<div class="desktop-widgets">';

  if (shown.tasks) {
    const pendents = tasks.filter(t => t.status !== 'done');
    html += `
    <div class="widget widget-tasks" onclick="navigate('tasks')">
      <div class="widget-tasks-title">Tasques Pendents <span style="background:var(--brand);color:#fff;border-radius:20px;padding:1px 7px;font-size:.6rem;margin-left:4px">${pendents.length}</span></div>
      ${pendents.length === 0
        ? `<div style="font-size:.72rem;color:rgba(255,255,255,.2);padding:4px 0">Cap tasca pendent</div>`
        : pendents.slice(0,4).map(t => {
          const statusDot = t.status==='in_progress' ? 'var(--brand)' : 'rgba(255,255,255,.25)';
          return `<div class="widget-task-row">
            <div class="widget-task-dot" style="background:${statusDot};box-shadow:${t.status==='in_progress'?'0 0 6px var(--brand)':'none'}"></div>
            <span>${t.title}</span>
          </div>`;
        }).join('')}
      ${pendents.length>4?`<div class="widget-task-more">+${pendents.length-4} més</div>`:''}
    </div>`;
  }

  if (shown.match && sel && sel.rival) {
    const matchDate = sel.match_date ? new Date(sel.match_date).toLocaleDateString('ca-ES',{day:'numeric',month:'short'}) : '—';
    html += `
    <div class="widget widget-match" onclick="navigate('selection')">
      <div class="widget-match-label">Proper Partit</div>
      <div class="widget-match-rival">${sel.rival}</div>
      <div class="widget-match-meta">
        <span>${matchDate}${sel.match_time?' · '+sel.match_time:''}</span>
        ${sel.venue?`<span>${sel.venue}</span>`:''}
      </div>
      ${sel.published?`<div class="widget-match-published">✓ Convocatòria publicada</div>`:''}
    </div>`;
  }

  const photoUrl = lsGet('eh_widget_photo') || null;
  if (shown.photo) {
    html += `
    <div class="widget widget-photo" ${photoUrl?`style="background-image:url('${photoUrl}')"`:''}>
      ${!photoUrl ? `<div class="widget-photo-empty">
        <label style="cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px">
          <input type="file" accept="image/*" style="display:none" onchange="saveWidgetPhoto(this)">
          <span style="font-size:1.5rem;opacity:.3">🖼</span>
          <span style="font-size:.62rem;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.25)">Afegir foto</span>
        </label>
      </div>` : `
      <div class="widget-photo-overlay"></div>
      <label class="widget-photo-change" title="Canviar foto">
        <input type="file" accept="image/*" style="display:none" onchange="saveWidgetPhoto(this)">
        ✎
      </label>`}
    </div>`;
  }

  html += '</div>';

  // Columna dreta: calendari, temps, notes, missatgeria
  const shown2 = lsGet('eh_widgets') ?? { tasks:true, match:true, photo:true, calendar:true, weather:true, notes:true, inbox:true };
  html += '<div class="desktop-widgets-right">';
  if (shown2.weather  ?? true) html += renderWeatherWidget();
  if (shown2.calendar ?? true) html += renderCalendarWidget();
  if (shown2.inbox    ?? true) html += renderMsgWidget();
  if (shown2.notes    ?? true) html += renderNotesWidget();
  html += '</div>';

  return html;
}

function renderDesktopApps() {
  const items = buildNavItems().filter(i => !i.section && i.page !== 'desktop');
  const PAGE_LABELS = {
    settings:'Config.', squad:'Plantilla', tactical:'Pissarra', training:'Entrenaments',
    veo:'VEO', tasks:'Tasques', wellness:'Wellness', selection:'Convocatòria',
    player_training:'Entrenaments', player_veo:'Vídeos', player_selection:'Convocatòria',
    player_wellness:'Wellness', scouting:'Scouting', communication:'Comunicació',
    accreditations:'Acreditac.', office:'Oficina', members:'Socis',
    teams:'Equips', admin_dashboard:'Admin', admin_users:'Usuaris',
    admin_roles:'Rols', admin_perms:'Permisos', messaging:'Missatgeria', email:'Correu',
  };
  return `
  <div class="desktop-apps">
    ${items.map(item => `
      <div class="desktop-app-icon-wrap" onclick="navigate('${item.page}')">
        <div class="desktop-app-icon">${item.icon}</div>
        <div class="desktop-app-label">${PAGE_LABELS[item.page] || item.label}</div>
      </div>
    `).join('')}
  </div>`;
}

// ── WEATHER ────────────────────────────────────────────────

const WX_DESC = {
  0:'Sol', 1:'Quasi clar', 2:'Parcialment ennuvolat', 3:'Cobert',
  45:'Boira', 48:'Boira gelada',
  51:'Plugim feble', 53:'Plugim', 55:'Plugim fort',
  61:'Pluja feble', 63:'Pluja', 65:'Pluja forta',
  71:'Neu feble', 73:'Neu', 75:'Neu forta',
  80:'Ruixats', 81:'Ruixats moderats', 82:'Ruixats forts',
  95:'Tempesta', 96:'Tempesta amb pedra', 99:'Tempesta forta',
};
const WX_ICON = {
  0:'☀️', 1:'🌤', 2:'⛅', 3:'☁️', 45:'🌫', 48:'🌫',
  51:'🌦', 53:'🌦', 55:'🌧', 61:'🌧', 63:'🌧', 65:'🌧',
  71:'🌨', 73:'🌨', 75:'❄️', 80:'🌦', 81:'🌧', 82:'⛈',
  95:'⛈', 96:'⛈', 99:'⛈',
};

async function fetchWeather() {
  const cache = lsGet('eh_weather_cache');
  if (cache?.ts && (Date.now() - cache.ts) < 30 * 60 * 1000) {
    updateWeatherWidget(cache); return;
  }
  try {
    const r = await fetch('https://api.open-meteo.com/v1/forecast?latitude=41.3874&longitude=2.1686&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode&timezone=Europe%2FMadrid&forecast_days=1');
    const d = await r.json();
    const cw = d.current_weather;
    const dd = d.daily;
    const w = { ts:Date.now(), temp:Math.round(cw.temperature), code:cw.weathercode, wind:Math.round(cw.windspeed), max:Math.round(dd.temperature_2m_max[0]), min:Math.round(dd.temperature_2m_min[0]), rain:dd.precipitation_probability_max[0]||0 };
    lsSet('eh_weather_cache', w);
    updateWeatherWidget(w);
  } catch(e) {
    const el = document.getElementById('widget-weather');
    if (el) el.querySelector('.wx-loading').textContent = 'No disponible';
  }
}

function updateWeatherWidget(w) {
  const el = document.getElementById('widget-weather');
  if (!el) return;
  el.innerHTML = `
    <div class="wx-top">
      <div>
        <div class="wx-city">BARCELONA</div>
        <div class="wx-desc">${WX_DESC[w.code]||'—'}</div>
      </div>
      <div class="wx-icon">${WX_ICON[w.code]||'🌡'}</div>
    </div>
    <div class="wx-temp">${w.temp}°<span class="wx-unit">C</span></div>
    <div class="wx-details">
      <span>↓${w.min}° · ↑${w.max}°</span>
      <span>💨 ${w.wind} km/h</span>
      ${w.rain > 0 ? `<span>🌧 ${w.rain}%</span>` : ''}
    </div>`;
}

// ── QUICK NOTES ────────────────────────────────────────────

function saveQuickNotes(text) { lsSet('eh_quick_notes', text); }

// ── WIDGETS RENDER ─────────────────────────────────────────

function renderCalendarWidget() {
  const now  = new Date();
  const y    = now.getFullYear(), m = now.getMonth(), today = now.getDate();
  const MONTHS = ['Gener','Febrer','Març','Abril','Maig','Juny','Juliol','Agost','Setembre','Octubre','Novembre','Desembre'];
  const DAYS   = ['Dl','Dm','Dc','Dj','Dv','Ds','Dg'];
  const first  = new Date(y, m, 1).getDay();
  const offset = first === 0 ? 6 : first - 1;
  const total  = new Date(y, m + 1, 0).getDate();
  const sel    = DB.selection ? DB.selection() : null;
  const mDate  = sel?.match_date ? new Date(sel.match_date + 'T12:00:00') : null;
  const isMatch = d => mDate && mDate.getFullYear()===y && mDate.getMonth()===m && mDate.getDate()===d;
  let cells = Array(offset).fill(null);
  for (let d = 1; d <= total; d++) cells.push(d);

  return `
  <div class="widget widget-calendar">
    <div class="cal-header">
      <span class="cal-month-name">${MONTHS[m]}</span>
      <span class="cal-year-num">${y}</span>
    </div>
    <div class="cal-grid">
      ${DAYS.map(d=>`<div class="cal-dn">${d}</div>`).join('')}
      ${cells.map(d => !d
        ? `<div class="cal-cell"></div>`
        : `<div class="cal-cell ${d===today?'cal-today':''} ${isMatch(d)?'cal-match':''}">
            ${d}${isMatch(d)?`<div class="cal-dot"></div>`:''}
          </div>`
      ).join('')}
    </div>
  </div>`;
}

function renderWeatherWidget() {
  return `
  <div class="widget widget-weather" id="widget-weather">
    <div class="wx-loading">Carregant temps…</div>
  </div>`;
}

function renderNotesWidget() {
  const notes = lsGet('eh_quick_notes') || '';
  return `
  <div class="widget widget-notes">
    <div class="widget-tasks-title">Notes ràpides</div>
    <textarea class="notes-area" id="notes-widget-area" placeholder="Escriu una nota…"
      oninput="saveQuickNotes(this.value)">${notes}</textarea>
  </div>`;
}

function renderMsgWidget() {
  const me     = currentUser.id;
  const unread = getMessages().filter(m => m.to === me && !m.read);
  const users  = DB.users();
  return `
  <div class="widget widget-inboxmsg" onclick="navigate('messaging')" style="cursor:pointer">
    <div class="widget-tasks-title">
      Missatgeria
      ${unread.length > 0 ? `<span style="background:var(--brand);color:#fff;border-radius:20px;padding:1px 8px;font-size:.58rem;margin-left:4px;box-shadow:0 0 8px var(--brand-glow)">${unread.length}</span>` : ''}
    </div>
    ${unread.length === 0
      ? `<div style="font-size:.72rem;color:rgba(255,255,255,.2);padding:2px 0">Cap missatge nou</div>`
      : unread.slice(0,3).map(msg => {
          const sender = users.find(u => u.id === msg.from);
          return `<div class="widget-task-row">
            <div class="avatar sm" style="flex-shrink:0;font-size:.52rem;width:20px;height:20px">${sender?.avatar||'?'}</div>
            <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1">${msg.text.length > 28 ? msg.text.slice(0,28)+'…' : msg.text}</span>
          </div>`;
        }).join('')}
    ${unread.length > 3 ? `<div class="widget-task-more">+${unread.length-3} missatges més</div>` : ''}
  </div>`;
}

function saveWidgetPhoto(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => { lsSet('eh_widget_photo', e.target.result); navigate('desktop'); };
  reader.readAsDataURL(file);
}

function toggleWidget(key) {
  const w = lsGet('eh_widgets') ?? { tasks:true, match:true, photo:true };
  w[key] = !w[key];
  lsSet('eh_widgets', w);
  navigate('settings');
}

// ── MESSAGING ──────────────────────────────────────────────

function getMessages() { return lsGet('eh_messages') || []; }

function sendMessage(toId, text) {
  if (!text?.trim()) return;
  const msgs = getMessages();
  msgs.push({ id:uid(), from:currentUser.id, to:toId, text:text.trim(), date:new Date().toISOString(), read:false });
  lsSet('eh_messages', msgs);
}

function markConvRead(otherId) {
  const msgs = getMessages();
  msgs.forEach(m => { if (m.to === currentUser.id && m.from === otherId) m.read = true; });
  lsSet('eh_messages', msgs);
}

function getConversations() {
  const msgs = getMessages();
  const me = currentUser.id;
  const users = DB.users();
  const convs = {};
  msgs.forEach(m => {
    const other = m.from === me ? m.to : m.from;
    if (!convs[other]) convs[other] = [];
    convs[other].push(m);
  });
  return Object.entries(convs).map(([uid, ms]) => {
    const u = users.find(u => u.id === uid);
    if (!u) return null;
    const sorted = [...ms].sort((a,b) => new Date(a.date)-new Date(b.date));
    return { user:u, msgs:sorted, last:sorted[sorted.length-1], unread:sorted.filter(m=>m.to===me&&!m.read).length };
  }).filter(Boolean).sort((a,b) => new Date(b.last.date)-new Date(a.last.date));
}

function unreadCount() {
  if (!currentUser) return 0;
  return getMessages().filter(m => m.to===currentUser.id && !m.read).length;
}

function saveWallpaperCustom(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const dataUrl = e.target.result;
    lsSet('eh_wallpaper', dataUrl);
    _applyWallpaper(dataUrl);
    navigate('settings');
  };
  reader.readAsDataURL(file);
}

function startClock() {
  function tick() {
    const now = new Date();
    const timeEl = document.getElementById('desktop-clock-time');
    const dateEl = document.getElementById('desktop-clock-date');
    if (!timeEl) return;
    timeEl.textContent = now.toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' });
    dateEl.textContent = now.toLocaleDateString('ca-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  }
  tick();
  setInterval(tick, 10000);
}

// ── LOGIN ──────────────────────────────────────────────────

function renderLogin() {
  return `
  <div class="login-page">
    <div class="login-center">
      <div class="login-brand-block">
        <img src="assets/escut.svg" alt="CE Europa">
        <div class="login-tagline">EUROPA<br>HUB</div>
        <div class="login-sub">Plataforma digital interna · CE Europa</div>
      </div>
      <div class="login-glass-card">
        <div class="login-form-title">Accés</div>
        <div class="login-form-sub">Introdueix les teves credencials</div>
        <form class="login-form" id="login-form">
          <div class="form-group">
            <label class="form-label">Usuari</label>
            <input class="form-input" type="text" id="login-user" placeholder="nom_usuari" autocomplete="username">
          </div>
          <div class="form-group">
            <label class="form-label">Contrasenya</label>
            <input class="form-input" type="password" id="login-pass" placeholder="••••••••" autocomplete="current-password">
          </div>
          <div id="login-error">Usuari o contrasenya incorrectes</div>
          <button type="submit" class="login-btn">Entrar →</button>
        </form>
      </div>
    </div>
  </div>
  <div id="toast-container"></div>
  `;
}

function renderLoading() {
  return `
  <div class="loading-screen">
    <div class="loading-bg"></div>
    <img src="assets/escut.svg" class="loading-logo" alt="CE Europa">
    <div class="loading-spinner"></div>
    <div class="loading-text">Carregant dades…</div>
  </div>`;
}

// ── PROFILE MODAL ──────────────────────────────────────────

function openProfileModal() {
  if (document.getElementById('profile-modal')) return;
  const u = currentUser;
  const photo = lsGet('eh_profile_photo');
  document.body.insertAdjacentHTML('beforeend', `
  <div class="modal-overlay" id="profile-modal" onclick="if(event.target===this)closeModal('profile-modal')">
    <div class="modal" style="width:min(400px,90vw);padding:0;overflow:hidden">
      <div style="height:90px;background:linear-gradient(135deg,var(--brand-dark) 0%,var(--brand) 100%);position:relative;flex-shrink:0"></div>
      <div style="padding:0 28px 28px">
        <div style="position:relative;margin-top:-44px;margin-bottom:16px;display:flex;align-items:flex-end;gap:14px">
          <div style="position:relative;cursor:pointer" onclick="document.getElementById('ph-input').click()" title="Canviar foto">
            ${photo
              ? `<img id="ph-preview" src="${photo}" style="width:80px;height:80px;border-radius:50%;object-fit:cover;border:3px solid var(--bg);box-shadow:0 4px 16px rgba(0,0,0,.4);">`
              : `<div id="ph-preview" class="avatar" style="width:80px;height:80px;font-size:1.6rem;border:3px solid var(--bg);box-shadow:0 4px 16px rgba(0,0,0,.4);">${u.avatar}</div>`
            }
            <div style="position:absolute;bottom:2px;right:2px;width:22px;height:22px;border-radius:50%;background:var(--brand);display:flex;align-items:center;justify-content:center;border:2px solid var(--bg)">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </div>
          </div>
          <div>
            <div style="font-weight:700;font-size:1rem;color:var(--text)">${u.name}</div>
            <div style="font-size:.72rem;color:var(--text3);margin-top:2px">${DEFAULT_ROLES[u.role]?.label||u.role}</div>
          </div>
        </div>
        <input type="file" id="ph-input" accept="image/*" style="display:none" onchange="handleProfilePhoto(event)">
        <div style="background:var(--bg2);border-radius:10px;padding:14px 16px;border:1px solid var(--border);margin-bottom:16px">
          <div style="font-size:.65rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--text3);margin-bottom:10px">Informació del compte</div>
          <div style="display:flex;flex-direction:column;gap:8px;font-size:.8rem">
            <div style="display:flex;justify-content:space-between"><span style="color:var(--text3)">Usuari</span><span style="color:var(--text);font-weight:500">${u.username||u.id}</span></div>
            <div style="display:flex;justify-content:space-between"><span style="color:var(--text3)">Rol</span><span style="color:var(--text);font-weight:500">${DEFAULT_ROLES[u.role]?.label||u.role}</span></div>
          </div>
        </div>
        ${photo ? `<button class="btn btn-ghost btn-sm" onclick="removeProfilePhoto()" style="width:100%;justify-content:center;margin-bottom:10px">Eliminar foto de perfil</button>` : ''}
        <button class="btn btn-ghost btn-sm" onclick="closeModal('profile-modal')" style="width:100%;justify-content:center">Tancar</button>
      </div>
    </div>
  </div>`);
}

function handleProfilePhoto(e) {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { toast('La foto no pot superar 5 MB', 'error'); return; }
  const reader = new FileReader();
  reader.onload = ev => {
    const dataURL = ev.target.result;
    lsSet('eh_profile_photo', dataURL);
    const prev = document.getElementById('ph-preview');
    if (prev) {
      prev.outerHTML = `<img id="ph-preview" src="${dataURL}" style="width:80px;height:80px;border-radius:50%;object-fit:cover;border:3px solid var(--bg);box-shadow:0 4px 16px rgba(0,0,0,.4);">`;
    }
    // Actualitza el dock sense re-renderitzar tot
    document.querySelector('.taskbar-user')?.querySelector('.avatar')?.remove();
    const imgEl = document.querySelector('.taskbar-user img');
    if (!imgEl) {
      const taskbarAvatar = document.querySelector('.taskbar-user');
      if (taskbarAvatar) taskbarAvatar.insertAdjacentHTML('afterbegin', `<img src="${dataURL}" style="width:24px;height:24px;border-radius:50%;object-fit:cover;flex-shrink:0;">`);
    } else { imgEl.src = dataURL; }
    toast('Foto de perfil actualitzada', 'success');
  };
  reader.readAsDataURL(file);
}

function removeProfilePhoto() {
  lsSet('eh_profile_photo', null);
  closeModal('profile-modal');
  // Actualitza el dock
  const img = document.querySelector('.taskbar-user img');
  if (img) {
    const u = currentUser;
    img.outerHTML = `<div class="avatar">${u.avatar}</div>`;
  }
  toast('Foto eliminada', 'success');
}

function bindLogin() {
  document.getElementById('login-form').addEventListener('submit', async e => {
    e.preventDefault();
    const u = document.getElementById('login-user').value.trim();
    const p = document.getElementById('login-pass').value;
    const btn = document.querySelector('.login-btn');
    if (!login(u, p)) {
      document.getElementById('login-error').style.display = 'block';
      return;
    }
    document.getElementById('app').innerHTML = renderLoading();
    await initTeam();
    navigate(currentUser?.role === 'administrator' ? 'admin_dashboard' : 'desktop');
  });
}

// ── TASKBAR ────────────────────────────────────────────────

function renderTaskbar() {
  const navItems = buildNavItems().filter(i => !i.section);
  const u = currentUser;
  const now = new Date();
  const timeStr = now.toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' });
  return `
  <div class="taskbar">
    <div class="taskbar-logo">
      <img src="assets/escut.svg" alt="CE Europa">
      <span class="taskbar-logo-text">Europa Hub</span>
    </div>
    <div class="taskbar-sep"></div>
    <div class="taskbar-dock">
      ${navItems.map(item => {
        const badge = item.page==='messaging' ? unreadCount() : 0;
        return `<div class="dock-item ${currentPage===item.page?'active':''}" data-page="${item.page}">
          ${item.icon}
          ${badge>0?`<div class="dock-badge">${badge}</div>`:''}
          <div class="dock-tooltip">${item.label}</div>
        </div>`;
      }).join('')}
    </div>
    <div class="taskbar-sep"></div>
    <div class="taskbar-right">
      <div class="taskbar-user" onclick="openProfileModal()" title="Perfil i configuració">
        ${(()=>{ const ph=lsGet('eh_profile_photo'); return ph?`<img src="${ph}" style="width:24px;height:24px;border-radius:50%;object-fit:cover;flex-shrink:0;">`:`<div class="avatar">${u.avatar}</div>`; })()}
        <span class="taskbar-user-name">${u.name.split(' ')[0]}</span>
      </div>
      <span class="taskbar-time" id="taskbar-clock">${timeStr}</span>
      <button id="pwa-install-btn" class="taskbar-logout" title="Instal·lar app" style="display:none">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 16l-4-4h3V4h2v8h3l-4 4z"/><path d="M20 18H4v2h16v-2z"/></svg>
      </button>
      <button class="taskbar-logout" onclick="logout()" title="Tancar sessió">${ico('logout')}</button>
    </div>
  </div>
  `;
}

function buildNavItems() {
  const items = [];
  items.push({ page:'settings', label:'Configuració', icon:ico('settings') });
  if (can('squad')||can('tactical')||can('training')||can('veo')||can('tasks')||can('wellness')||can('selection')) {
    items.push({ section:'Àrea Esportiva 1' });
    if (can('squad'))     items.push({ page:'squad',     label:'Plantilla',        icon:ico('users') });
    if (can('tactical'))  items.push({ page:'tactical',  label:'Pissarra Tàctica', icon:ico('tactical') });
    if (can('training'))  items.push({ page:'training',  label:'Entrenaments',     icon:ico('training') });
    if (can('veo'))       items.push({ page:'veo',       label:'Anàlisi VEO',      icon:ico('video') });
    if (can('tasks'))     items.push({ page:'tasks',     label:'Tasques Staff',    icon:ico('tasks') });
    if (can('wellness'))  items.push({ page:'wellness',  label:'Wellness',         icon:ico('wellness') });
    if (can('selection')) items.push({ page:'selection', label:'Convocatòria',     icon:ico('selection') });
  }
  if (can('sporting2')) {
    items.push({ section:'Àrea Esportiva 2' });
    items.push({ page:'player_training',  label:'Entrenaments', icon:ico('training') });
    items.push({ page:'player_veo',       label:'Vídeos',       icon:ico('video') });
    items.push({ page:'player_selection', label:'Convocatòria', icon:ico('selection') });
    items.push({ page:'player_wellness',  label:'Wellness',     icon:ico('wellness') });
  }
  if (can('scouting'))       { items.push({ section:'Scouting' }); items.push({ page:'scouting', label:'Scouting', icon:ico('scouting') }); }
  if (can('communication'))  {
    items.push({ section:'Comunicació' });
    items.push({ page:'communication',   label:'Comunicació',  icon:ico('comm') });
    items.push({ page:'accreditations',  label:'Acreditacions', icon:ico('badge') });
  }
  items.push({ page:'messaging', label:'Missatgeria', icon:ico('msg') });
  items.push({ page:'email',     label:'Correu',      icon:ico('email') });
  if (can('office'))         { items.push({ section:'Oficina' }); items.push({ page:'office', label:'Oficina', icon:ico('office') }); }
  if (can('members'))        { items.push({ section:'Socis' }); items.push({ page:'members', label:'Àrea de Soci', icon:ico('member') }); }
  if (can('staff_view')) {
    items.push({ section:'Partits' });
    items.push({ page:'player_selection', label:'Convocatòria', icon:ico('selection') });
  }
  if (can('admin')) {
    items.push({ section:'Administració' });
    items.push({ page:'admin_users', label:'Usuaris',  icon:ico('users') });
    items.push({ page:'admin_roles', label:'Rols',     icon:ico('shield') });
    items.push({ page:'admin_perms', label:'Permisos', icon:ico('admin') });
  }
  return items;
}

function renderWindowBar() {
  const titles = {
    home:'Inici', settings:'Configuració', admin_dashboard:'Tauler Admin', squad:'Plantilla', tactical:'Pissarra Tàctica', training:'Entrenaments',
    veo:'Anàlisi VEO', tasks:'Tasques Staff', wellness:'Wellness', selection:'Convocatòria',
    player_training:'Entrenaments', player_veo:'Anàlisi VEO', player_selection:'Convocatòria', player_wellness:'Wellness',
    scouting:'Scouting', communication:'Comunicació', office:'Oficina', members:'Àrea de Soci',
    teams:'Equips',
    admin_users:'Usuaris', admin_roles:'Rols', admin_perms:'Permisos',
  };
  const sections = {
    squad:'Àrea Esportiva', tactical:'Àrea Esportiva', training:'Àrea Esportiva',
    veo:'Àrea Esportiva', tasks:'Àrea Esportiva', wellness:'Àrea Esportiva', selection:'Àrea Esportiva',
    player_training:'Àrea Esportiva', player_veo:'Àrea Esportiva', player_selection:'Àrea Esportiva', player_wellness:'Àrea Esportiva',
    admin_users:'Administració', admin_roles:'Administració', admin_perms:'Administració',
    teams:'Gestió', scouting:'Scouting', communication:'Comunicació', office:'Oficina', members:'Socis',
  };
  const title   = titles[currentPage]  || currentPage;
  const section = sections[currentPage] || 'Europa Hub';
  return `
  <div class="window-bar">
    <button class="window-close-btn" onclick="closeWindow()" title="Tancar">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
    <div class="window-bar-breadcrumb">
      <span>${section}</span>
      <span class="window-bar-sep">›</span>
      <span class="wbb-current">${title}</span>
    </div>
    <div class="window-bar-title">Europa Hub · CE Europa</div>
    <div class="window-bar-right">
      <span>${new Date().toLocaleDateString('ca-ES',{day:'numeric',month:'short',year:'numeric'})}</span>
    </div>
  </div>
  `;
}

function renderPage() {
  switch (currentPage) {
    case 'home':             return renderHome();
    case 'squad':            return renderSquad();
    case 'tactical':         return renderTactical();
    case 'training':         return renderTraining();
    case 'veo':              return renderVEO();
    case 'tasks':            return renderTasks();
    case 'wellness':         return renderWellness();
    case 'selection':        return renderSelection();
    case 'player_training':  return renderPlayerTraining();
    case 'player_veo':       return renderPlayerVEO();
    case 'player_selection': return renderPlayerSelection();
    case 'player_wellness':  return renderPlayerWellness();
    case 'teams':            return renderTeams();
    case 'scouting':         return renderScouting();
    case 'communication':    return renderComm();
    case 'office':           return renderOffice();
    case 'members':          return renderMembers();
    case 'admin_users':      return renderAdminUsers();
    case 'admin_roles':      return renderAdminRoles();
    case 'admin_perms':      return renderAdminPerms();
    case 'settings':          return renderSettings();
    case 'messaging':         return renderMessaging();
    case 'email':             return renderEmail();
    case 'admin_dashboard':   return renderAdminDashboard();
    case 'accreditations':    return renderAccreditations();
    default: return `<div class="empty-state"><h3>Pàgina no trobada</h3></div>`;
  }
}

function bindNav() {
  document.querySelectorAll('.dock-item[data-page]').forEach(el => {
    el.addEventListener('click', () => navigate(el.dataset.page));
  });
}

let bindPageEvents = function() {};

document.addEventListener('DOMContentLoaded', async () => {
  const root = document.getElementById('app');

  /* Pantalla de càrrega */
  const showLoader = () => { root.innerHTML = `
    <div style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:var(--brand);gap:20px">
      <img src="assets/escut.svg" style="width:80px;filter:brightness(0) invert(1);opacity:.9" alt="CE Europa">
      <div style="font-family:var(--font-display);font-size:2rem;letter-spacing:.1em;color:#fff;text-transform:uppercase">Europa Hub</div>
      <div style="width:36px;height:36px;border:3px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .8s linear infinite"></div>
      <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
    </div>`; };

  /* ── Detecció d'invitació per URL hash ── */
  const inviteToken = window.location.hash.match(/^#invite-(.+)/)?.[1];
  if (inviteToken) {
    showLoader();
    await initDB();
    const inv = await DB.getInvitationByToken(inviteToken);
    root.innerHTML = renderInviteAccept(inv, inviteToken);
    bindInviteAccept(inviteToken);
    return;
  }

  /* ── Flux normal ── */
  showLoader();
  await initDB();
  const sessionOk = restoreSession();
  if (sessionOk) {
    await initTeam();
    if (currentUser?.role === 'administrator') currentPage = 'admin_dashboard';
  }
  renderApp();
});
