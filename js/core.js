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
  administrator:     { home:true,  squad:true,  tactical:true,  training:true,  veo:true,  tasks:true,  wellness:true,  selection:true,  sporting2:true,  scouting:true,  communication:true,  office:true,  members:true,  admin:true,  teams:true,  staff_view:false },
  sporting_director: { home:true,  squad:true,  tactical:true,  training:true,  veo:true,  tasks:true,  wellness:true,  selection:true,  sporting2:true,  scouting:true,  communication:false, office:false, members:false, admin:false, teams:true,  staff_view:false },
  coach:             { home:true,  squad:true,  tactical:true,  training:true,  veo:true,  tasks:true,  wellness:true,  selection:true,  sporting2:false, scouting:false,  communication:false, office:false, members:false, admin:false, teams:true,  staff_view:false },
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
    currentTeamId = 'default';
    currentTeam   = (_cache.teams || [])[0] || { id:'default', name:'CE Europa — Primer Equip' };
    loadEntityDataFromLocalStorage();
    return;
  }

  let myTeams = DB.myTeams();

  /* Si l'usuari no té cap equip assignat, l'afegim a l'equip per defecte */
  if (!myTeams || myTeams.length === 0) {
    await DB.addTeamMember('default', currentUser.id);
    /* Recarregar membres */
    const { data: members } = await DB.sb().from('team_members').select('*');
    _cache.teamMembers = members || [];
    myTeams = DB.myTeams();
  }

  /* Seleccionar l'últim equip usat, o el primer disponible — sense selector */
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
  const perms = DB.permissions();
  return !!(perms[currentUser.role] || {})[perm];
}

// ── Router ─────────────────────────────────────────────────

let currentPage = 'home';

function navigate(page) {
  currentPage = page;
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
  users:`<circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/><path d="M16 3.13a4 4 0 010 7.75M21 21v-2a4 4 0 00-3-3.87"/>`,
  shield:`<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`,
  tactical:`<rect x="2" y="3" width="20" height="18" rx="2"/><circle cx="8" cy="8" r="1.5" fill="currentColor"/><circle cx="16" cy="8" r="1.5" fill="currentColor"/><circle cx="12" cy="14" r="1.5" fill="currentColor"/><path d="M8 8l4 6M16 8l-4 6"/>`,
  training:`<circle cx="12" cy="12" r="9"/><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/>`,
  video:`<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>`,
  tasks:`<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>`,
  wellness:`<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>`,
  selection:`<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>`,
  scouting:`<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>`,
  comm:`<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>`,
  office:`<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>`,
  member:`<rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>`,
  admin:`<circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/>`,
  plus:`<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>`,
  edit:`<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>`,
  trash:`<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>`,
  logout:`<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>`,
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
        <button class="btn btn-ghost btn-sm" onclick="navigate('teams')" style="font-size:.78rem">
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
        <div style="color:var(--text3);font-size:.8125rem;margin-bottom:24px">
          Hola, <strong>${inv.player_name} ${inv.player_surname}</strong>. Defineix les teves credencials d'accés.
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

// ── RENDER APP ─────────────────────────────────────────────

function renderApp() {
  const root = document.getElementById('app');
  if (!currentUser) {
    root.innerHTML = renderLogin();
    bindLogin();
    return;
  }
  root.innerHTML = `
    <div class="app-layout">
      ${renderSidebar()}
      <div class="main-content">
        ${renderTopHeader()}
        <div class="page-body" id="page-body">
          ${renderPage()}
        </div>
      </div>
    </div>
    <div id="toast-container"></div>
  `;
  bindNav();
  bindPageEvents();
}

// ── LOGIN ──────────────────────────────────────────────────

function renderLogin() {
  return `
  <div class="login-page">
    <div class="login-left">
      <div class="login-visual">
        <div class="login-logo-big"><img src="assets/escut.svg" alt="CE Europa"></div>
        <div class="login-tagline">EUROPA<br>HUB</div>
        <div class="login-stripe"></div>
        <div class="login-sub">Plataforma digital interna<br>Club Esportiu Europa</div>
      </div>
    </div>
    <div class="login-right">
      <div class="login-form-box">
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
          <div id="login-error" style="color:var(--brand);font-size:.78rem;display:none">Usuari o contrasenya incorrectes</div>
          <button type="submit" class="login-btn">Entrar →</button>
        </form>
        <div class="login-users-hint">
          <strong>🔑 Usuaris de prova</strong>
          <ul>
            <li>admin / admin123 — Administrador</li>
            <li>director / director123 — Director Esportiu</li>
            <li>coach / coach123 — Entrenador</li>
            <li>player / player123 — Jugador</li>
            <li>comm / comm123 — Comunicació</li>
            <li>office / office123 — Oficina</li>
            <li>member / member123 — Soci</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <div id="toast-container"></div>
  `;
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
    /* Mostrar indicador mentre es carreguen les dades de Supabase */
    btn.textContent = 'Carregant…';
    btn.disabled = true;
    await initTeam();
    navigate('home');
  });
}

// ── SIDEBAR ────────────────────────────────────────────────

function renderSidebar() {
  const navItems = buildNavItems();
  const u = currentUser;
  return `
  <aside class="sidebar">
    <div class="sidebar-logo">
      <div class="logo-mark"><img src="assets/escut.svg" alt="CE Europa"></div>
      <div class="logo-text">
        <span class="logo-name">Europa Hub</span>
        <span class="logo-sub">CE Europa · Intern</span>
      </div>
    </div>
    <nav class="sidebar-nav">
      ${navItems.map(item => item.section
        ? `<div class="nav-section-label">${item.section}</div>`
        : `<div class="nav-item ${currentPage===item.page?'active':''}" data-page="${item.page}">${item.icon} ${item.label}</div>`
      ).join('')}
    </nav>
    <div class="sidebar-user">
      <div class="avatar">${u.avatar}</div>
      <div class="user-info">
        <div class="name">${u.name.split(' ')[0]}</div>
        <div class="role">${DEFAULT_ROLES[u.role]?.label || u.role}</div>
      </div>
      <button class="btn-logout-sidebar" onclick="logout()">${ico('logout')} Sortir</button>
    </div>
  </aside>
  `;
}

function buildNavItems() {
  const items = [];
  items.push({ page:'home', label:'Inici', icon:ico('home') });
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
  if (can('communication'))  { items.push({ section:'Comunicació' }); items.push({ page:'communication', label:'Comunicació', icon:ico('comm') }); }
  if (can('office'))         { items.push({ section:'Oficina' }); items.push({ page:'office', label:'Oficina', icon:ico('office') }); }
  if (can('members'))        { items.push({ section:'Socis' }); items.push({ page:'members', label:'Àrea de Soci', icon:ico('member') }); }
  if (can('staff_view')) {
    items.push({ section:'Partits' });
    items.push({ page:'player_selection', label:'Convocatòria', icon:ico('selection') });
  }
  if (can('teams')) {
    items.push({ section:'Gestió' });
    items.push({ page:'teams', label:'Equips', icon:ico('users') });
  }
  if (can('admin')) {
    items.push({ section:'Administració' });
    items.push({ page:'admin_users', label:'Usuaris',  icon:ico('users') });
    items.push({ page:'admin_roles', label:'Rols',     icon:ico('shield') });
    items.push({ page:'admin_perms', label:'Permisos', icon:ico('admin') });
  }
  return items;
}

function renderTopHeader() {
  const titles = {
    home:'Inici', squad:'Plantilla', tactical:'Pissarra Tàctica', training:'Entrenaments',
    veo:'Anàlisi VEO', tasks:'Tasques Staff', wellness:'Wellness', selection:'Convocatòria',
    player_training:'Entrenaments', player_veo:'Anàlisi VEO', player_selection:'Convocatòria', player_wellness:'Wellness',
    scouting:'Scouting', communication:'Comunicació', office:'Oficina', members:'Àrea de Soci',
    teams:'Equips',
    admin_users:'Usuaris', admin_roles:'Rols', admin_perms:'Permisos',
  };
  const sections = {
    squad:'Àrea Esp. 1', tactical:'Àrea Esp. 1', training:'Àrea Esp. 1',
    veo:'Àrea Esp. 1', tasks:'Àrea Esp. 1', wellness:'Àrea Esp. 1', selection:'Àrea Esp. 1',
    player_training:'Àrea Esp. 2', player_veo:'Àrea Esp. 2', player_selection:'Àrea Esp. 2', player_wellness:'Àrea Esp. 2',
    admin_users:'Administració', admin_roles:'Administració', admin_perms:'Administració',
  };
  const title   = titles[currentPage]   || currentPage;
  const section = sections[currentPage] || null;
  return `
  <header class="top-header">
    <div class="breadcrumb">
      ${section ? `<span>${section}</span><span class="breadcrumb-sep">/</span>` : ''}
      <span class="current">${title}</span>
    </div>
    <div class="header-actions">
      <span style="font-size:.72rem;color:var(--text3)">${new Date().toLocaleDateString('ca-ES',{weekday:'short',day:'numeric',month:'short',year:'numeric'})}</span>
    </div>
  </header>
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
    default: return `<div class="empty-state"><h3>Pàgina no trobada</h3></div>`;
  }
}

function bindNav() {
  document.querySelectorAll('.nav-item[data-page]').forEach(el => {
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
  if (sessionOk) await initTeam();
  renderApp();
});
