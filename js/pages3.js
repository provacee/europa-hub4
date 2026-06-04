/* ============================================================
   EUROPA HUB v2 — Pages: Scouting · Comm · Office · Members · Admin
   ============================================================ */

// ── SCOUTING ───────────────────────────────────────────────

function renderScouting() {
  const players = DB.scouting();
  const tags = ['all','observed','interesting','priority','signed'];
  const tagLabels = { all:'Tots', observed:'Observat', interesting:'Interessant', priority:'Prioritari', signed:'Fitxat' };
  return `
  <div class="page-header">
    <div class="page-header-left"><div class="page-title">Scouting</div><div class="page-subtitle">${players.length} jugadors en seguiment</div></div>
    <div class="page-actions"><button class="btn btn-primary" onclick="openScoutingModal()">${ico('plus')} Nou Jugador</button></div>
  </div>
  <div class="chips" id="scout-filter" style="margin-bottom:18px">
    ${tags.map(t=>`<div class="chip ${t==='all'?'active':''}" data-tag="${t}">${tagLabels[t]}</div>`).join('')}
  </div>
  <div class="card">
    <div class="table-wrap">
      <table>
        <thead><tr><th>Nom</th><th>Club</th><th>Edat</th><th>Posició</th><th>Estat</th><th></th></tr></thead>
        <tbody id="scout-tbody">
          ${players.map(p=>`
          <tr data-tag="${p.tag}">
            <td style="color:var(--text);font-weight:500">${p.name}</td>
            <td>${p.club}</td><td>${p.age}</td>
            <td>${positionBadge(p.position)}</td>
            <td>${tagBadge(p.tag)}</td>
            <td><div style="display:flex;gap:4px">
              <button class="btn-icon btn-sm" onclick="openScoutingModal('${p.id}')">${ico('edit')}</button>
              <button class="btn-icon btn-sm" onclick="deleteScouting('${p.id}')" style="color:var(--brand)">${ico('trash')}</button>
            </div></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>
  <div id="scouting-modal-container"></div>`;
}

function openScoutingModal(id=null) {
  const players = DB.scouting();
  const p = id ? players.find(pl=>pl.id===id) : null;
  document.getElementById('scouting-modal-container').innerHTML = `
  <div class="modal-overlay" id="scouting-modal">
    <div class="modal">
      <div class="modal-header"><div class="modal-title">${p?'Editar Jugador':'Nou Jugador'}</div><button class="btn-icon" onclick="closeModal('scouting-modal')">${ico('close')}</button></div>
      <div class="modal-body">
        <div class="form-row">
          <div class="form-group"><label class="form-label">Nom</label><input class="form-input" id="sc-name" value="${p?.name||''}"></div>
          <div class="form-group"><label class="form-label">Club</label><input class="form-input" id="sc-club" value="${p?.club||''}"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Edat</label><input class="form-input" type="number" id="sc-age" value="${p?.age||''}"></div>
          <div class="form-group"><label class="form-label">Posició</label>
            <select class="form-select" id="sc-pos">${['Porter','Defensa Central','Lateral Dret','Lateral Esquerre','Migcampista','Extrem','Davanter'].map(pos=>`<option ${p?.position===pos?'selected':''}>${pos}</option>`).join('')}</select>
          </div>
        </div>
        <div class="form-group"><label class="form-label">Estat</label>
          <select class="form-select" id="sc-tag">
            <option value="observed" ${p?.tag==='observed'?'selected':''}>Observat</option>
            <option value="interesting" ${p?.tag==='interesting'?'selected':''}>Interessant</option>
            <option value="priority" ${p?.tag==='priority'?'selected':''}>Prioritari</option>
            <option value="signed" ${p?.tag==='signed'?'selected':''}>Fitxat</option>
          </select>
        </div>
        <div class="form-group"><label class="form-label">Notes</label><textarea class="form-textarea" id="sc-notes">${p?.notes||''}</textarea></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="closeModal('scouting-modal')">Cancel·lar</button>
        <button class="btn btn-primary" onclick="saveScouting('${id||''}')">Desar</button>
      </div>
    </div>
  </div>`;
}

function saveScouting(id) {
  const name = document.getElementById('sc-name').value.trim();
  if (!name) { toast('Nom obligatori','error'); return; }
  const data = { name, club:document.getElementById('sc-club').value.trim(), age:parseInt(document.getElementById('sc-age').value)||0, position:document.getElementById('sc-pos').value, tag:document.getElementById('sc-tag').value, notes:document.getElementById('sc-notes').value.trim() };
  const players = DB.scouting();
  if (id) { const i=players.findIndex(p=>p.id===id); if(i!==-1) players[i]={...players[i],...data}; }
  else players.push({ id:uid(),...data });
  DB.saveScouting(players);
  closeModal('scouting-modal');
  toast('Jugador desat','success');
  navigate('scouting');
}

function deleteScouting(id) {
  if (!confirm('Eliminar del scouting?')) return;
  DB.saveScouting(DB.scouting().filter(p=>p.id!==id));
  toast('Eliminat','success');
  navigate('scouting');
}

// ── COMMUNICATION ──────────────────────────────────────────

function renderComm() {
  const modules = [
    { icon:'shield', label:'Acreditació',     desc:"Sistema d'acreditació de premsa" },
    { icon:'comm',   label:'Notes de Premsa', desc:'Redacció i distribució de comunicats' },
    { icon:'video',  label:'Fotografia',      desc:'Arxiu fotogràfic del club' },
    { icon:'play',   label:'Vídeo',           desc:'Producció audiovisual' },
    { icon:'publish',label:'Xarxes Socials',  desc:'Gestió de canals socials' },
    { icon:'tasks',  label:'Arxiu Multimèdia',desc:'Biblioteca de recursos' },
  ];
  return `
  <div class="page-header"><div class="page-header-left"><div class="page-title">Comunicació</div><div class="page-subtitle">Mòduls de comunicació</div></div></div>
  <div style="padding:10px 12px;background:var(--yellow-dim);border:1px solid rgba(245,158,11,.3);border-radius:6px;margin-bottom:18px;font-size:.78rem;color:var(--yellow)">⚡ Versió 1 — Funcionalitat disponible pròximament.</div>
  <div class="grid grid-3">
    ${modules.map(m=>`
    <div class="card" style="opacity:.65;cursor:not-allowed">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:7px">
        <div style="width:30px;height:30px;background:var(--bg3);border-radius:6px;display:flex;align-items:center;justify-content:center;color:var(--text2)">${ico(m.icon)}</div>
        <div style="font-weight:600;font-size:.8125rem">${m.label}</div>
        <span class="badge badge-gray" style="margin-left:auto">Aviat</span>
      </div>
      <div style="font-size:.72rem;color:var(--text3)">${m.desc}</div>
    </div>`).join('')}
  </div>`;
}

// ── OFFICE ─────────────────────────────────────────────────

function renderOffice() {
  const modules = [
    { icon:'users',  label:'Patrocinadors',  desc:'Gestió de patrocinadors i acords' },
    { icon:'tasks',  label:'Documentació',   desc:'Arxiu documental del club' },
    { icon:'shield', label:'Recursos Humans',desc:'Gestió de personal i contractes' },
    { icon:'chart',  label:'Inventari',      desc:'Control de material esportiu' },
    { icon:'office', label:'Administració',  desc:'Facturació i comptabilitat' },
  ];
  return `
  <div class="page-header"><div class="page-header-left"><div class="page-title">Oficina</div><div class="page-subtitle">Mòduls administratius</div></div></div>
  <div style="padding:10px 12px;background:var(--yellow-dim);border:1px solid rgba(245,158,11,.3);border-radius:6px;margin-bottom:18px;font-size:.78rem;color:var(--yellow)">⚡ Versió 1 — Funcionalitat disponible pròximament.</div>
  <div class="grid grid-3">
    ${modules.map(m=>`
    <div class="card" style="opacity:.65;cursor:not-allowed">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:7px">
        <div style="width:30px;height:30px;background:var(--bg3);border-radius:6px;display:flex;align-items:center;justify-content:center;color:var(--text2)">${ico(m.icon)}</div>
        <div style="font-weight:600;font-size:.8125rem">${m.label}</div>
        <span class="badge badge-gray" style="margin-left:auto">Aviat</span>
      </div>
      <div style="font-size:.72rem;color:var(--text3)">${m.desc}</div>
    </div>`).join('')}
  </div>`;
}

// ── MEMBERS ────────────────────────────────────────────────

function renderMembers() {
  const u = currentUser;
  return `
  <div class="page-header"><div class="page-header-left"><div class="page-title">Àrea de Soci</div><div class="page-subtitle">Benvingut, ${u.name}</div></div></div>
  <div class="grid grid-2" style="margin-bottom:16px">
    <div class="card" style="background:linear-gradient(135deg,#1a0205,#0d0d0f);border-color:rgba(208,2,27,.3)">
      <div style="font-size:.65rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--text3);margin-bottom:18px">Carnet Digital · CE Europa</div>
      <div style="display:flex;align-items:center;gap:14px">
        <div class="avatar lg">${u.avatar}</div>
        <div>
          <div style="font-family:var(--font-display);font-size:1.1rem;font-weight:700;letter-spacing:.05em;text-transform:uppercase">${u.name}</div>
          <div style="font-size:.72rem;color:var(--text3);margin-top:1px">Soci #${Math.floor(Math.abs(u.id.charCodeAt(1)||0)*997+1000)}</div>
        </div>
        <div style="margin-left:auto;width:52px;height:52px;background:white;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:1.4rem">▩</div>
      </div>
      <div style="margin-top:14px;padding-top:12px;border-top:1px solid rgba(255,255,255,.08);font-size:.68rem;color:var(--text3)">Temporada 2025–2026</div>
    </div>
    <div class="card">
      <div style="font-size:.68rem;font-weight:600;letter-spacing:.09em;text-transform:uppercase;color:var(--text3);margin-bottom:12px">Propers Partits</div>
      ${[
        {date:'15 Jun',label:'CE Europa vs CF Badalona',home:true},
        {date:'22 Jun',label:'SD Collado vs CE Europa', home:false},
        {date:'29 Jun',label:'CE Europa vs UE Vic',     home:true},
      ].map(m=>`
      <div style="display:flex;align-items:center;gap:9px;padding:8px 0;border-bottom:1px solid var(--border)">
        <div style="width:38px;text-align:center;flex-shrink:0">
          <div style="font-size:.65rem;color:var(--text3)">Jun</div>
          <div style="font-family:var(--font-display);font-size:1.1rem;font-weight:700;line-height:1">${m.date.split(' ')[0]}</div>
        </div>
        <div style="flex:1;font-size:.8rem;font-weight:500">${m.label}</div>
        <span class="badge ${m.home?'badge-red':'badge-gray'}">${m.home?'Local':'Fora'}</span>
      </div>`).join('')}
    </div>
  </div>
  <div class="grid grid-2">
    <div class="card" style="text-align:center;padding:28px">
      <div style="font-size:2rem;margin-bottom:8px">🎟️</div>
      <div style="font-weight:600;margin-bottom:3px;font-size:.875rem">Entrades</div>
      <div style="font-size:.75rem;color:var(--text3);margin-bottom:14px">Compra entrades per als partits</div>
      <a href="https://entrades.ceeuropa.cat" target="_blank" class="btn btn-primary">Accedir →</a>
    </div>
    <div class="card" style="text-align:center;padding:28px">
      <div style="font-size:2rem;margin-bottom:8px">🛍️</div>
      <div style="font-weight:600;margin-bottom:3px;font-size:.875rem">Botiga</div>
      <div style="font-size:.75rem;color:var(--text3);margin-bottom:14px">Equipació i marxandatge oficial</div>
      <a href="https://botiga.ceeuropa.cat" target="_blank" class="btn btn-primary">Accedir →</a>
    </div>
  </div>`;
}

// ── TEAMS ──────────────────────────────────────────────────

function renderTeams() {
  const teams   = DB.myTeams();
  const members = DB.teamMembers();
  const users   = DB.users();
  const isAdmin = currentUser.role === 'administrator';

  return `
  <div class="page-header">
    <div class="page-header-left">
      <div class="page-title">Equips</div>
      <div class="page-subtitle">${teams.length} equip${teams.length!==1?'s':''} disponible${teams.length!==1?'s':''}</div>
    </div>
    <div class="page-actions">
      <button class="btn btn-primary" onclick="openCreateTeamModal()">${ico('plus')} Nou Equip</button>
    </div>
  </div>

  <div style="display:flex;flex-direction:column;gap:14px">
    ${teams.map(t => {
      const teamUsers = members.filter(m => m.team_id === t.id)
        .map(m => users.find(u => u.id === m.user_id)).filter(Boolean);
      const isActive = t.id === currentTeamId;
      return `
      <div class="card" style="border-color:${isActive ? 'var(--brand)' : 'var(--border)'}">
        <div style="display:flex;align-items:flex-start;gap:14px">
          <div style="width:48px;height:48px;border-radius:10px;background:${t.color||'#022E91'};display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <img src="assets/escut.svg" style="width:32px;filter:brightness(0) invert(1)" alt="">
          </div>
          <div style="flex:1">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:2px">
              <span style="font-weight:600;font-size:.9375rem">${t.name}</span>
              ${isActive ? `<span class="badge badge-blue">Equip actiu</span>` : ''}
            </div>
            ${t.season ? `<div style="font-size:.75rem;color:var(--text3)">Temporada ${t.season}</div>` : ''}
            <div style="margin-top:10px;display:flex;flex-wrap:wrap;gap:5px">
              ${teamUsers.slice(0,8).map(u => `
                <div style="display:flex;align-items:center;gap:5px;padding:3px 8px;background:var(--bg3);border-radius:20px;font-size:.72rem">
                  <div class="avatar sm">${u.avatar}</div> ${u.name.split(' ')[0]}
                </div>`).join('')}
              ${teamUsers.length > 8 ? `<span style="font-size:.72rem;color:var(--text3);padding:3px 8px">+${teamUsers.length-8} més</span>` : ''}
            </div>
          </div>
          <div style="display:flex;gap:6px;flex-shrink:0">
            ${!isActive ? `<button class="btn btn-ghost btn-sm" onclick="handleSwitchTeam('${t.id}')">Accedir →</button>` : ''}
            ${isAdmin ? `<button class="btn-icon" onclick="openTeamMembersModal('${t.id}')">${ico('users')}</button>` : ''}
          </div>
        </div>
      </div>`;
    }).join('')}
    ${teams.length === 0 ? `<div class="empty-state">${ico('users')}<h3>Cap equip creat</h3><p>Crea el primer equip per començar</p></div>` : ''}
  </div>
  <div id="team-modal-container"></div>`;
}

function openCreateTeamModal() {
  document.getElementById('team-modal-container').innerHTML = `
  <div class="modal-overlay" id="create-team-modal">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">Nou Equip</div>
        <button class="btn-icon" onclick="closeModal('create-team-modal')">${ico('close')}</button>
      </div>
      <div class="modal-body">
        <div class="form-group"><label class="form-label">Nom de l'equip *</label>
          <input class="form-input" id="team-name" placeholder="Ex: CE Europa — Sub-18"></div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Temporada</label>
            <input class="form-input" id="team-season" placeholder="2025-26"></div>
          <div class="form-group"><label class="form-label">Descripció</label>
            <input class="form-input" id="team-desc" placeholder="Opcional"></div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="closeModal('create-team-modal')">Cancel·lar</button>
        <button class="btn btn-primary" onclick="saveNewTeam()">${ico('check')} Crear Equip</button>
      </div>
    </div>
  </div>`;
}

async function saveNewTeam() {
  const name   = document.getElementById('team-name').value.trim();
  const season = document.getElementById('team-season').value.trim();
  const desc   = document.getElementById('team-desc').value.trim();
  if (!name) { toast('El nom és obligatori', 'error'); return; }
  const team = await DB.createTeam(name, desc, season);
  closeModal('create-team-modal');
  toast(`Equip "${name}" creat!`, 'success');
  navigate('teams');
}

function openTeamMembersModal(teamId) {
  const team    = DB.teams().find(t => t.id === teamId);
  const members = DB.teamMembers().filter(m => m.team_id === teamId);
  const users   = DB.users();
  const teamUsers = members.map(m => users.find(u => u.id === m.user_id)).filter(Boolean);
  const nonMembers = users.filter(u => !members.some(m => m.user_id === u.id));

  document.getElementById('team-modal-container').innerHTML = `
  <div class="modal-overlay" id="team-members-modal">
    <div class="modal modal-lg">
      <div class="modal-header">
        <div class="modal-title">Membres — ${team?.name||''}</div>
        <button class="btn-icon" onclick="closeModal('team-members-modal')">${ico('close')}</button>
      </div>
      <div class="modal-body">
        <div style="font-size:.7rem;font-weight:600;letter-spacing:.09em;text-transform:uppercase;color:var(--text3);margin-bottom:8px">Membres actuals</div>
        <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:16px">
          ${teamUsers.map(u => `
          <div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--border)">
            <div class="avatar">${u.avatar}</div>
            <div style="flex:1"><div style="font-size:.8125rem;font-weight:500">${u.name}</div><div style="font-size:.7rem;color:var(--text3)">${DEFAULT_ROLES[u.role]?.label||u.role}</div></div>
            <button class="btn btn-danger btn-sm" onclick="removeMember('${teamId}','${u.id}')">${ico('trash')}</button>
          </div>`).join('') || '<div style="color:var(--text3);font-size:.8rem">Cap membre</div>'}
        </div>
        ${nonMembers.length > 0 ? `
        <div style="font-size:.7rem;font-weight:600;letter-spacing:.09em;text-transform:uppercase;color:var(--text3);margin-bottom:8px">Afegir membre</div>
        <div style="display:flex;gap:8px">
          <select class="form-select" id="add-member-select" style="flex:1">
            ${nonMembers.map(u => `<option value="${u.id}">${u.name} (${DEFAULT_ROLES[u.role]?.label||u.role})</option>`).join('')}
          </select>
          <button class="btn btn-primary" onclick="addMember('${teamId}')">Afegir</button>
        </div>` : ''}
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="closeModal('team-members-modal')">Tancar</button>
      </div>
    </div>
  </div>`;
}

async function addMember(teamId) {
  const userId = document.getElementById('add-member-select').value;
  if (!userId) return;
  await DB.addTeamMember(teamId, userId);
  toast('Membre afegit', 'success');
  openTeamMembersModal(teamId);
}

async function removeMember(teamId, userId) {
  if (!confirm('Treure aquest membre de l\'equip?')) return;
  await DB.removeTeamMember(teamId, userId);
  toast('Membre eliminat', 'success');
  openTeamMembersModal(teamId);
}

async function handleSwitchTeam(teamId) {
  const team = DB.teams().find(t => t.id === teamId);
  if (!team) return;
  await switchTeam(team);
  toast(`Equip canviat a "${team.name}"`, 'success');
  navigate('home');
}

// ── ADMIN: USERS ───────────────────────────────────────────

function renderAdminUsers() {
  const users = DB.users();
  return `
  <div class="page-header">
    <div class="page-header-left"><div class="page-title">Usuaris</div><div class="page-subtitle">${users.length} usuaris al sistema</div></div>
    <div class="page-actions"><button class="btn btn-primary" onclick="openUserModal()">${ico('plus')} Nou Usuari</button></div>
  </div>
  <div class="card">
    <div class="table-wrap">
      <table>
        <thead><tr><th>Nom</th><th>Usuari</th><th>Rol</th><th>Contrasenya</th><th></th></tr></thead>
        <tbody>
          ${users.map(u=>`
          <tr>
            <td><div style="display:flex;align-items:center;gap:9px"><div class="avatar sm">${u.avatar}</div><span style="color:var(--text);font-weight:500">${u.name}</span></div></td>
            <td><code style="font-family:var(--font-mono);font-size:.78rem;color:var(--brand)">${u.username}</code></td>
            <td>${roleBadge(u.role)}</td>
            <td><code style="font-family:var(--font-mono);font-size:.72rem;color:var(--text3)">${u.password}</code></td>
            <td><div style="display:flex;gap:4px">
              <button class="btn-icon btn-sm" onclick="openUserModal('${u.id}')">${ico('edit')}</button>
              ${u.id!==currentUser.id ? `<button class="btn-icon btn-sm" onclick="deleteUser('${u.id}')" style="color:var(--brand)">${ico('trash')}</button>` : ''}
            </div></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>
  <div id="user-modal-container"></div>`;
}

function openUserModal(id=null) {
  const users = DB.users();
  const u = id ? users.find(us=>us.id===id) : null;
  document.getElementById('user-modal-container').innerHTML = `
  <div class="modal-overlay" id="user-modal">
    <div class="modal">
      <div class="modal-header"><div class="modal-title">${u?'Editar Usuari':'Nou Usuari'}</div><button class="btn-icon" onclick="closeModal('user-modal')">${ico('close')}</button></div>
      <div class="modal-body">
        <div class="form-group"><label class="form-label">Nom complet</label><input class="form-input" id="u-name" value="${u?.name||''}"></div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Nom d'usuari</label><input class="form-input" id="u-username" value="${u?.username||''}"></div>
          <div class="form-group"><label class="form-label">Contrasenya</label><input class="form-input" id="u-password" value="${u?.password||''}" placeholder="${u?'Deixa buit per mantenir':'Nova contrasenya'}"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Rol</label>
            <select class="form-select" id="u-role">${Object.entries(DEFAULT_ROLES).map(([key,val])=>`<option value="${key}" ${u?.role===key?'selected':''}>${val.label}</option>`).join('')}</select>
          </div>
          <div class="form-group"><label class="form-label">Inicials (avatar)</label><input class="form-input" id="u-avatar" value="${u?.avatar||''}" maxlength="2" placeholder="AB"></div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="closeModal('user-modal')">Cancel·lar</button>
        <button class="btn btn-primary" onclick="saveUser('${id||''}')">Desar</button>
      </div>
    </div>
  </div>`;
}

function saveUser(id) {
  const name = document.getElementById('u-name').value.trim();
  const username = document.getElementById('u-username').value.trim();
  if (!name||!username) { toast('Nom i usuari obligatoris','error'); return; }
  const users = DB.users();
  const pw = document.getElementById('u-password').value.trim();
  const data = { name, username, password:pw||(id?users.find(u=>u.id===id)?.password:'password123'), role:document.getElementById('u-role').value, avatar:document.getElementById('u-avatar').value.trim().toUpperCase()||name.slice(0,2).toUpperCase() };
  if (id) { const i=users.findIndex(u=>u.id===id); if(i!==-1) users[i]={...users[i],...data}; }
  else users.push({ id:uid(),...data });
  DB.saveUsers(users);
  closeModal('user-modal');
  toast('Usuari desat','success');
  navigate('admin_users');
}

function deleteUser(id) {
  if (!confirm('Eliminar usuari?')) return;
  DB.saveUsers(DB.users().filter(u=>u.id!==id));
  toast('Usuari eliminat','success');
  navigate('admin_users');
}

// ── ADMIN: ROLES ───────────────────────────────────────────

function renderAdminRoles() {
  const users = DB.users();
  return `
  <div class="page-header"><div class="page-header-left"><div class="page-title">Rols</div><div class="page-subtitle">Rols del sistema</div></div></div>
  <div class="grid grid-3">
    ${Object.entries(DEFAULT_ROLES).map(([key,role]) => {
      const ru = users.filter(u=>u.role===key);
      return `
      <div class="role-card">
        <div style="margin-bottom:10px"><span class="badge badge-${role.color}">${role.label}</span></div>
        <div style="font-size:.72rem;color:var(--text3);margin-bottom:10px">${ru.length} usuari${ru.length!==1?'s':''}</div>
        ${ru.map(u=>`<div style="display:flex;align-items:center;gap:7px;margin-bottom:5px;font-size:.78rem"><div class="avatar sm">${u.avatar}</div>${u.name}</div>`).join('')}
        ${ru.length===0?`<div style="font-size:.72rem;color:var(--text3)">Cap usuari assignat</div>`:''}
      </div>`;
    }).join('')}
  </div>`;
}

// ── ADMIN: PERMISSIONS ─────────────────────────────────────

function renderAdminPerms() {
  const perms = DB.permissions();
  const roles = Object.keys(DEFAULT_ROLES);
  const permKeys = [
    {key:'home',label:'Inici'},{key:'squad',label:'Plantilla'},{key:'tactical',label:'Pissarra'},
    {key:'training',label:'Entrenaments'},{key:'veo',label:'VEO'},{key:'tasks',label:'Tasques'},
    {key:'wellness',label:'Wellness'},{key:'selection',label:'Convocatòria'},
    {key:'sporting2',label:'Àrea Esp. 2'},{key:'scouting',label:'Scouting'},
    {key:'communication',label:'Comunicació'},{key:'office',label:'Oficina'},
    {key:'members',label:'Socis'},{key:'admin',label:'Administració'},
  ];
  return `
  <div class="page-header"><div class="page-header-left"><div class="page-title">Permisos</div><div class="page-subtitle">Activa o desactiva permisos per rol</div></div></div>
  <div style="overflow-x:auto">
    <table style="min-width:680px">
      <thead>
        <tr>
          <th style="min-width:130px">Mòdul</th>
          ${roles.map(r=>`<th style="text-align:center">${DEFAULT_ROLES[r].label}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${permKeys.map(({key,label})=>`
        <tr>
          <td style="color:var(--text);font-weight:500">${label}</td>
          ${roles.map(role => {
            const checked = !!(perms[role]?.[key]);
            return `<td style="text-align:center"><div class="toggle ${checked?'on':''}" onclick="togglePerm('${role}','${key}',this)"></div></td>`;
          }).join('')}
        </tr>`).join('')}
      </tbody>
    </table>
  </div>
  <div style="margin-top:16px;padding:10px 12px;background:var(--bg3);border-radius:6px;border:1px solid var(--border);font-size:.75rem;color:var(--text2);display:flex;align-items:center;gap:7px">
    ⚠️ Els canvis s'apliquen immediatament. L'usuari els veurà en el pròxim inici de sessió.
  </div>`;
}

function togglePerm(role, perm, el) {
  const perms = DB.permissions();
  if (!perms[role]) perms[role] = {};
  perms[role][perm] = !perms[role][perm];
  el.classList.toggle('on', perms[role][perm]);
  DB.savePerms(perms);
  toast(`"${perm}" ${perms[role][perm]?'activat':'desactivat'} per ${DEFAULT_ROLES[role].label}`,'success');
}
