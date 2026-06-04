/* ============================================================
   EUROPA HUB v2 — Database Layer
   Supabase (compartit) + localStorage (fallback).
   Multi-equip: cada entitat porta team_id.
   ============================================================ */

const USE_SUPABASE = typeof SUPABASE_URL !== 'undefined' && SUPABASE_URL !== 'YOUR_SUPABASE_URL';
const USE_EMAIL    = typeof RESEND_API_KEY !== 'undefined' && RESEND_API_KEY !== 'YOUR_RESEND_API_KEY';

let _sb = null;

/* ── Cache global ─────────────────────────────────────────── */
const _cache = {
  users: [], players: [], trainings: [], videos: [], tasks: [],
  wellness: {}, selection: null, scouting: [], plays: [], permissions: {},
  teams: [], teamMembers: [], invitations: [],
};
const _knownIds = {};

/* currentTeamId és definit a core.js com a variable global */

// ── Init ────────────────────────────────────────────────────

async function initDB() {
  if (USE_SUPABASE) {
    _sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    /* Carreguem usuaris i equips primer (per al login + selecció d'equip) */
    const [{ data: users }, { data: teams }, { data: members }] = await Promise.all([
      _sb.from('app_users').select('*'),
      _sb.from('teams').select('*'),
      _sb.from('team_members').select('*'),
    ]);
    _cache.users       = users   || [];
    _cache.teams       = teams   || [];
    _cache.teamMembers = members || [];

    /* Seed usuaris si la BD és buida */
    if (_cache.users.length === 0) {
      await _sb.from('app_users').insert(DEFAULT_USERS);
      _cache.users = DEFAULT_USERS;
    }
    /* Seed equip per defecte */
    if (_cache.teams.length === 0) {
      const defTeam = { id:'default', name:'CE Europa — Primer Equip', description:'', season:'2025-26', color:'#022E91', created_by:'system' };
      await _sb.from('teams').insert([defTeam]);
      _cache.teams = [defTeam];
      const memberRows = DEFAULT_USERS.map(u => ({ team_id:'default', user_id:u.id }));
      await _sb.from('team_members').insert(memberRows);
      _cache.teamMembers = memberRows;
    }
  } else {
    /* localStorage */
    _cache.users       = lsGet('eh_users')   || DEFAULT_USERS;
    _cache.teams       = lsGet('eh_teams')   || [{ id:'default', name:'CE Europa — Primer Equip', season:'2025-26', color:'#022E91' }];
    _cache.teamMembers = lsGet('eh_members') || DEFAULT_USERS.map(u => ({ team_id:'default', user_id:u.id }));
    _cache.invitations = lsGet('eh_invitations') || [];
    _cache.permissions = DEFAULT_PERMISSIONS;
    if (!lsGet('eh_initialized')) seedLocalStorage();
    loadEntityDataFromLocalStorage();
  }
}

/* Carrega les dades d'entitat per a l'equip actual (cridat des de core.js) */
async function loadTeamData(teamId) {
  if (!USE_SUPABASE) {
    /* localStorage: tot ja carregat */
    _cache.permissions = DEFAULT_PERMISSIONS;
    return;
  }
  const [
    { data: players }, { data: trainings }, { data: videos },
    { data: tasks },   { data: wellness }, { data: selections },
    { data: scouting },{ data: plays },   { data: perms },
    { data: invitations },
  ] = await Promise.all([
    _sb.from('players').select('*').eq('team_id', teamId).order('number'),
    _sb.from('trainings').select('*').eq('team_id', teamId).order('date', { ascending:false }),
    _sb.from('videos').select('*').eq('team_id', teamId).order('date', { ascending:false }),
    _sb.from('tasks').select('*').eq('team_id', teamId),
    _sb.from('wellness').select('*').eq('team_id', teamId),
    _sb.from('selections').select('*').eq('team_id', teamId),
    _sb.from('scouting').select('*').eq('team_id', teamId),
    _sb.from('tactical_plays').select('*').eq('team_id', teamId),
    _sb.from('permissions').select('*'),
    _sb.from('invitations').select('*').eq('team_id', teamId),
  ]);

  _cache.players     = players     || [];
  _cache.trainings   = trainings   || [];
  _cache.videos      = videos      || [];
  _cache.tasks       = tasks       || [];
  _cache.wellness    = wellnessArrayToMap(wellness || []);
  _cache.scouting    = scouting    || [];
  _cache.plays       = plays       || [];
  _cache.permissions = permsArrayToMap(perms || []);
  _cache.invitations = invitations || [];

  const rawSel = (selections || [])[0];
  _cache.selection = rawSel ? normalizeSelection(rawSel) : defaultSelection();

  /* Tracking IDs */
  for (const [tbl, arr] of [
    ['app_users', _cache.users], ['players', _cache.players],
    ['trainings', _cache.trainings], ['videos', _cache.videos],
    ['tasks', _cache.tasks], ['scouting', _cache.scouting],
    ['tactical_plays', _cache.plays], ['invitations', _cache.invitations],
  ]) _knownIds[tbl] = (arr || []).map(r => r.id);

  await seedTeamIfEmpty(teamId);
}

async function seedTeamIfEmpty(teamId) {
  const seeds = [
    { check: _cache.players.length   === 0, table:'players',       data:DEFAULT_PLAYERS,        key:'players' },
    { check: _cache.trainings.length === 0, table:'trainings',     data:DEFAULT_TRAININGS,      key:'trainings' },
    { check: _cache.videos.length    === 0, table:'videos',        data:DEFAULT_VIDEOS,         key:'videos' },
    { check: _cache.tasks.length     === 0, table:'tasks',         data:DEFAULT_TASKS,          key:'tasks' },
    { check: _cache.scouting.length  === 0, table:'scouting',      data:DEFAULT_SCOUTING,       key:'scouting' },
    { check: _cache.plays.length     === 0, table:'tactical_plays',data:DEFAULT_TACTICAL_PLAYS, key:'plays' },
  ];
  for (const s of seeds) {
    if (s.check) {
      const withTeam = s.data.map(r => ({ ...r, team_id:teamId }));
      const { error } = await _sb.from(s.table).insert(withTeam);
      if (!error) { _cache[s.key] = s.data; _knownIds[s.table] = s.data.map(r => r.id); }
    }
  }
  if (Object.keys(_cache.permissions).length === 0) {
    const rows = Object.entries(DEFAULT_PERMISSIONS).map(([role,perms]) => ({ role, perms }));
    await _sb.from('permissions').insert(rows);
    _cache.permissions = DEFAULT_PERMISSIONS;
  }
  if (Object.keys(_cache.wellness).length === 0) {
    const rows = [];
    for (const [pid, entries] of Object.entries(DEFAULT_WELLNESS))
      for (const e of entries) rows.push({ id:uid(), player_id:pid, team_id:teamId, ...e });
    if (rows.length) await _sb.from('wellness').insert(rows);
    _cache.wellness = DEFAULT_WELLNESS;
  }
  if (!_cache.selection?.id) {
    const sel = defaultSelection();
    await _sb.from('selections').upsert({ ...selectionToRow(sel), team_id:teamId });
    _cache.selection = sel;
  }
}

// ── Helpers de format ────────────────────────────────────────

function wellnessArrayToMap(arr) {
  const map = {};
  for (const w of arr) {
    if (!map[w.player_id]) map[w.player_id] = [];
    map[w.player_id].push(w);
  }
  for (const pid of Object.keys(map)) map[pid].sort((a,b) => b.date.localeCompare(a.date));
  return map;
}

function permsArrayToMap(arr) {
  const map = {};
  for (const p of arr) map[p.role] = p.perms;
  return map;
}

function normalizeSelection(raw) {
  return {
    id: raw.id || 'sel', rival:raw.rival||'', match_date:raw.match_date||'',
    match_time:raw.match_time||'', venue:raw.venue||'', meeting_point:raw.meeting_point||'',
    meeting_time:raw.meeting_time||'', team:raw.team||'', observations:raw.observations||'',
    published:!!raw.published,
    selected:raw.selected_players||[], notSelected:raw.not_selected_players||[],
  };
}

function defaultSelection() {
  return {
    id:'sel', rival:'', match_date:'', match_time:'', venue:'',
    meeting_point:'', meeting_time:'', team:'', observations:'', published:false,
    selected: DEFAULT_SQUAD_SELECTION.selected,
    notSelected: DEFAULT_SQUAD_SELECTION.notSelected,
  };
}

function selectionToRow(sel) {
  return {
    id: currentTeamId && currentTeamId !== 'default' ? `sel_${currentTeamId}` : 'active',
    team_id: currentTeamId || 'default',
    rival:sel.rival||'', match_date:sel.match_date||'', match_time:sel.match_time||'',
    venue:sel.venue||'', meeting_point:sel.meeting_point||'', meeting_time:sel.meeting_time||'',
    team:sel.team||'', observations:sel.observations||'', published:!!sel.published,
    selected_players:sel.selected||[], not_selected_players:sel.notSelected||[],
    updated_at:new Date().toISOString(),
  };
}

// ── localStorage ─────────────────────────────────────────────

function lsGet(key) { try { const v=localStorage.getItem(key); return v?JSON.parse(v):null; } catch { return null; } }
function lsSet(key,val) { try { localStorage.setItem(key,JSON.stringify(val)); } catch {} }

function loadEntityDataFromLocalStorage() {
  _cache.players     = lsGet('eh_players')        || DEFAULT_PLAYERS;
  _cache.trainings   = lsGet('eh_trainings')      || DEFAULT_TRAININGS;
  _cache.videos      = lsGet('eh_videos')         || DEFAULT_VIDEOS;
  _cache.tasks       = lsGet('eh_tasks')          || DEFAULT_TASKS;
  _cache.wellness    = lsGet('eh_wellness')        || DEFAULT_WELLNESS;
  _cache.scouting    = lsGet('eh_scouting')       || DEFAULT_SCOUTING;
  _cache.plays       = lsGet('eh_tactical_plays') || DEFAULT_TACTICAL_PLAYS;
  _cache.permissions = DEFAULT_PERMISSIONS;
  const raw = lsGet('eh_selection') || {};
  _cache.selection = { ...defaultSelection(), ...raw,
    selected:raw.selected||DEFAULT_SQUAD_SELECTION.selected,
    notSelected:raw.notSelected||DEFAULT_SQUAD_SELECTION.notSelected,
  };
}

function seedLocalStorage() {
  lsSet('eh_users',           DEFAULT_USERS);
  lsSet('eh_permissions',     DEFAULT_PERMISSIONS);
  lsSet('eh_players',         DEFAULT_PLAYERS);
  lsSet('eh_trainings',       DEFAULT_TRAININGS);
  lsSet('eh_videos',          DEFAULT_VIDEOS);
  lsSet('eh_tasks',           DEFAULT_TASKS);
  lsSet('eh_wellness',        DEFAULT_WELLNESS);
  lsSet('eh_selection',       DEFAULT_SQUAD_SELECTION);
  lsSet('eh_scouting',        DEFAULT_SCOUTING);
  lsSet('eh_tactical_plays',  DEFAULT_TACTICAL_PLAYS);
  lsSet('eh_initialized',     true);
}

// ── DB API (síncron; llegeix del cache) ──────────────────────

const DB = {
  users:       () => _cache.users,
  permissions: () => _cache.permissions,
  players:     () => _cache.players,
  trainings:   () => _cache.trainings,
  videos:      () => _cache.videos,
  tasks:       () => _cache.tasks,
  wellness:    () => _cache.wellness,
  selection:   () => _cache.selection,
  scouting:    () => _cache.scouting,
  plays:       () => _cache.plays,
  teams:       () => _cache.teams,
  myTeams:     () => {
    if (!currentUser) return [];
    if (currentUser.role === 'administrator') return _cache.teams;
    const myIds = _cache.teamMembers.filter(m => m.user_id === currentUser.id).map(m => m.team_id);
    return _cache.teams.filter(t => myIds.includes(t.id));
  },
  teamMembers:     () => _cache.teamMembers,
  invitations: () => _cache.invitations,

  saveUsers:    (v) => { _cache.users       = v; _persist('app_users',     v, false); },
  savePerms:    (v) => { _cache.permissions = v; _persistPerms(v); },
  savePlayers:  (v) => { _cache.players     = v; _persist('players',       v); },
  saveTrainings:(v) => { _cache.trainings   = v; _persist('trainings',     v); },
  saveVideos:   (v) => { _cache.videos      = v; _persist('videos',        v); },
  saveTasks:    (v) => { _cache.tasks       = v; _persist('tasks',         v); },
  saveWellness: (v) => { _cache.wellness    = v; _persistWellness(v); },
  saveSelection:(v) => { _cache.selection   = v; _persistSelection(v); },
  saveScouting: (v) => { _cache.scouting    = v; _persist('scouting',      v); },
  savePlays:    (v) => { _cache.plays       = v; _persist('tactical_plays', v); },

  /* Teams */
  createTeam: async (name, description='', season='') => {
    const team = { id:uid(), name, description, season, color:'#022E91', created_by:currentUser?.id||'' };
    if (USE_SUPABASE) {
      await _sb.from('teams').insert([team]);
      await _sb.from('team_members').insert([{ team_id:team.id, user_id:currentUser.id }]);
    } else {
      lsSet('eh_teams', [..._cache.teams, team]);
    }
    _cache.teams.push(team);
    _cache.teamMembers.push({ team_id:team.id, user_id:currentUser.id });
    return team;
  },

  addTeamMember: async (teamId, userId) => {
    const row = { team_id:teamId, user_id:userId };
    if (USE_SUPABASE) await _sb.from('team_members').upsert([row], { onConflict:'team_id,user_id' });
    else lsSet('eh_members', [..._cache.teamMembers.filter(m => !(m.team_id===teamId&&m.user_id===userId)), row]);
    if (!_cache.teamMembers.some(m => m.team_id===teamId&&m.user_id===userId))
      _cache.teamMembers.push(row);
  },

  removeTeamMember: async (teamId, userId) => {
    if (USE_SUPABASE) await _sb.from('team_members').delete().eq('team_id',teamId).eq('user_id',userId);
    _cache.teamMembers = _cache.teamMembers.filter(m => !(m.team_id===teamId&&m.user_id===userId));
    lsSet('eh_members', _cache.teamMembers);
  },

  /* Invitacions */
  createInvitation: async ({ teamId, playerId, playerName, playerSurname, email, role='player' }) => {
    const token = _genToken();
    const inv = {
      id: uid(), team_id:teamId, player_id:playerId||'',
      player_name:playerName, player_surname:playerSurname,
      email, role, token, status:'pending', created_by:currentUser?.id||'',
      created_at:new Date().toISOString(),
      expires_at:new Date(Date.now()+7*24*3600*1000).toISOString(),
    };
    if (USE_SUPABASE) {
      const { data, error } = await _sb.from('invitations').insert([inv]).select();
      if (!error && data?.[0]) inv.token = data[0].token; /* usa el token generat per Supabase */
    } else {
      _cache.invitations.push(inv);
      lsSet('eh_invitations', _cache.invitations);
    }
    return inv;
  },

  getInvitationByToken: async (token) => {
    if (USE_SUPABASE) {
      const { data } = await _sb.from('invitations').select('*').eq('token',token).single();
      return data;
    }
    return _cache.invitations.find(i => i.token === token) || null;
  },

  acceptInvitation: async (token, { username, password }) => {
    const inv = await DB.getInvitationByToken(token);
    if (!inv) throw new Error('Invitació no trobada');
    if (inv.status !== 'pending') throw new Error('Invitació ja usada o expirada');
    if (new Date(inv.expires_at) < new Date()) throw new Error('Invitació expirada');

    const newUser = {
      id:uid(), name:`${inv.player_name} ${inv.player_surname}`,
      username, password, role:inv.role, avatar:`${inv.player_name[0]}${inv.player_surname[0]}`.toUpperCase(),
      player_id:inv.player_id||null,
    };
    if (USE_SUPABASE) {
      await _sb.from('app_users').insert([newUser]);
      await _sb.from('team_members').upsert([{ team_id:inv.team_id, user_id:newUser.id }], { onConflict:'team_id,user_id' });
      await _sb.from('invitations').update({ status:'accepted' }).eq('token',token);
    } else {
      _cache.users.push(newUser);
      lsSet('eh_users', _cache.users);
      _cache.teamMembers.push({ team_id:inv.team_id, user_id:newUser.id });
      lsSet('eh_members', _cache.teamMembers);
      const idx = _cache.invitations.findIndex(i => i.token === token);
      if (idx !== -1) _cache.invitations[idx].status = 'accepted';
      lsSet('eh_invitations', _cache.invitations);
    }
    _cache.users.push(newUser);
    return newUser;
  },

  /* Accés al client Supabase (per a consultes puntuals des de core.js) */
  sb: () => _sb,

  /* Refresca dades de l'equip actual */
  refresh: async () => {
    if (USE_SUPABASE && currentTeamId) await loadTeamData(currentTeamId);
    else if (!USE_SUPABASE) loadEntityDataFromLocalStorage();
  },
};

// ── Persist helpers ──────────────────────────────────────────

async function _persist(table, newData, addTeamId=true) {
  if (!USE_SUPABASE) {
    const lsKey = { players:'eh_players', trainings:'eh_trainings', videos:'eh_videos',
      tasks:'eh_tasks', scouting:'eh_scouting', tactical_plays:'eh_tactical_plays',
      app_users:'eh_users' }[table];
    if (lsKey) lsSet(lsKey, newData);
    return;
  }
  try {
    const teamId = currentTeamId || 'default';
    const data = addTeamId ? newData.map(r => ({ team_id:teamId, ...r })) : newData;
    const newIds = new Set(data.map(r => r.id));
    const toDelete = (_knownIds[table]||[]).filter(id => !newIds.has(id));
    if (toDelete.length) await _sb.from(table).delete().in('id',toDelete).eq('team_id',teamId);
    if (data.length)     await _sb.from(table).upsert(data);
    _knownIds[table] = [...newIds];
  } catch(e) { console.error('[DB] persist error', table, e); }
}

async function _persistPerms(permsMap) {
  if (!USE_SUPABASE) { lsSet('eh_permissions', permsMap); return; }
  try {
    const rows = Object.entries(permsMap).map(([role,perms]) => ({ role, perms }));
    await _sb.from('permissions').upsert(rows);
  } catch(e) { console.error('[DB] persistPerms error', e); }
}

async function _persistWellness(wellnessMap) {
  if (!USE_SUPABASE) { lsSet('eh_wellness', wellnessMap); return; }
  try {
    const teamId = currentTeamId || 'default';
    const rows = [];
    for (const [pid, entries] of Object.entries(wellnessMap))
      for (const e of entries)
        rows.push({ id:e.id||uid(), player_id:pid, team_id:teamId, date:e.date,
          sleep:e.sleep, fatigue:e.fatigue, soreness:e.soreness,
          condition:e.condition, physio:e.physio, comments:e.comments||'' });
    if (rows.length) await _sb.from('wellness').upsert(rows, { onConflict:'player_id,date' });
  } catch(e) { console.error('[DB] persistWellness error', e); }
}

async function _persistSelection(sel) {
  if (!USE_SUPABASE) { lsSet('eh_selection', sel); return; }
  try { await _sb.from('selections').upsert(selectionToRow(sel)); }
  catch(e) { console.error('[DB] persistSelection error', e); }
}

/* Envia invitació per email via Resend (si configurat) */
async function sendInvitationEmail(inv) {
  if (!USE_EMAIL) return false;
  const inviteUrl = `${SITE_URL}/#invite-${inv.token}`;
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization':`Bearer ${RESEND_API_KEY}`, 'Content-Type':'application/json' },
      body: JSON.stringify({
        from: 'Europa Hub <noreply@ceeuropa.cat>',
        to:   [inv.email],
        subject: `Invitació a Europa Hub — ${inv.player_name} ${inv.player_surname}`,
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
            <img src="${SITE_URL}/assets/escut.svg" style="width:60px;margin-bottom:16px" alt="CE Europa">
            <h2 style="color:#022E91;margin:0 0 8px">Benvingut/da a Europa Hub</h2>
            <p>Hola <strong>${inv.player_name} ${inv.player_surname}</strong>,</p>
            <p>Has estat convidat/da a unir-te a Europa Hub, la plataforma digital interna del Club Esportiu Europa.</p>
            <p>Fes clic al botó per activar el teu compte:</p>
            <a href="${inviteUrl}" style="display:inline-block;background:#022E91;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;margin:16px 0">Activar el meu compte →</a>
            <p style="color:#666;font-size:.85rem">O copia aquest enllaç: ${inviteUrl}</p>
            <p style="color:#666;font-size:.85rem">L'enllaç és vàlid durant 7 dies.</p>
            <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
            <p style="color:#999;font-size:.75rem">Club Esportiu Europa · Europa Hub</p>
          </div>`,
      }),
    });
    return res.ok;
  } catch(e) { console.error('[Email] Resend error', e); return false; }
}

/* Helpers interns */
function _genToken() {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2,'0')).join('');
}
