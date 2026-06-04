/* ============================================================
   EUROPA HUB v2 — Pages: Home · Squad · Tactical Board
   ============================================================ */

// ── HOME ───────────────────────────────────────────────────

function renderHome() {
  const u = currentUser;
  const firstName = u.name.split(' ')[0].toUpperCase();
  return `
  <div style="
    margin:-24px;
    min-height:calc(100vh - var(--header-h));
    background:var(--brand) url('assets/camp.jpg') center/cover no-repeat;
    display:flex;align-items:center;justify-content:center;
    position:relative;overflow:hidden;
  ">
    <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(2,46,145,.9) 0%,rgba(2,46,145,.45) 40%,rgba(0,0,0,.3) 100%)"></div>
    <div style="position:relative;z-index:1;text-align:center;color:#fff;padding:32px;user-select:none">
      <div style="font-size:.75rem;letter-spacing:.22em;text-transform:uppercase;opacity:.7;margin-bottom:14px">
        ${DEFAULT_ROLES[u.role]?.label || u.role} &nbsp;·&nbsp; ${currentTeam?.name || 'CE Europa'}
      </div>
      <div style="font-family:var(--font-display);font-size:clamp(2.6rem,8vw,5.5rem);letter-spacing:.07em;text-transform:uppercase;line-height:.9;text-shadow:0 4px 32px rgba(0,0,0,.5)">
        Benvingut/da,<br>${firstName}
      </div>
      <div style="width:56px;height:3px;background:rgba(255,255,255,.4);margin:22px auto;border-radius:2px"></div>
      <div style="font-size:.8rem;opacity:.6;letter-spacing:.06em">
        ${new Date().toLocaleDateString('ca-ES',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
      </div>
    </div>
  </div>`;
}

// ── SQUAD ──────────────────────────────────────────────────

function renderSquad() {
  const allPeople = DB.players();
  const players   = allPeople.filter(p => p.person_type !== 'staff');
  const staffList = allPeople.filter(p => p.person_type === 'staff');
  const readOnly  = currentUser.role === 'sporting_director';
  const canEdit   = !readOnly;

  return `
  <div class="page-header">
    <div class="page-header-left">
      <div class="page-title">Plantilla</div>
      <div class="page-subtitle">${players.length} jugador${players.length!==1?'s':''} · ${staffList.length} staff</div>
    </div>
    <div class="page-actions">
      <input class="form-input" type="search" id="squad-search" placeholder="Cercar..." style="width:180px">
      ${canEdit ? `<button class="btn btn-primary" onclick="openPlayerModal()">${ico('plus')} Nou</button>` : ''}
    </div>
  </div>
  <div class="chips" id="pos-filter" style="margin-bottom:16px">
    <div class="chip active" data-pos="">Tots</div>
    <div class="chip" data-pos="Porter">Porters</div>
    <div class="chip" data-pos="Defensa">Defenses</div>
    <div class="chip" data-pos="Lateral">Laterals</div>
    <div class="chip" data-pos="Migcampista">Migcampistes</div>
    <div class="chip" data-pos="Extrem">Extrems</div>
    <div class="chip" data-pos="Davanter">Davanters</div>
  </div>
  <div id="squad-grid" class="grid grid-3" style="gap:10px">
    ${players.map(p => renderPlayerCard(p, !canEdit)).join('')}
  </div>

  ${staffList.length > 0 ? `
  <div style="margin-top:28px">
    <div style="font-size:.68rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--text3);margin-bottom:12px;display:flex;align-items:center;gap:8px">
      Staff tècnic <span class="badge badge-gray">${staffList.length}</span>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px">
      ${staffList.map(p => renderStaffCard(p, !canEdit)).join('')}
    </div>
  </div>` : ''}

  <div id="player-modal-container"></div>`;
}

function _photoEl(p, size=44) {
  const initials = ((p.name||'?')[0] + (p.surname||'?')[0]).toUpperCase();
  if (p.photo_url) {
    return `<div class="player-photo" style="padding:0;overflow:hidden;border-radius:8px;width:${size}px;height:${size}px;flex-shrink:0">
      <img src="${p.photo_url}" style="width:100%;height:100%;object-fit:cover" onerror="this.parentElement.innerHTML='${initials}'">
    </div>`;
  }
  return `<div class="player-photo" style="width:${size}px;height:${size}px;flex-shrink:0">${initials}</div>`;
}

function renderPlayerCard(p, readOnly=false) {
  return `
  <div class="player-card" data-pos="${p.position}">
    <div class="shirt-num">${p.number||'—'}</div>
    ${_photoEl(p)}
    <div class="player-info">
      <div class="player-name">${p.name} ${p.surname}</div>
      <div class="player-meta">${p.dob ? calcAge(p.dob)+' anys · ' : ''}${p.foot==='E'?'Peu esq.':'Peu dret'}</div>
      <div class="player-badges">
        ${positionBadge(p.position)}
        ${p.doc_url ? `<a href="${p.doc_url}" target="_blank" class="badge badge-blue" style="text-decoration:none" title="Fitxa federativa">📄 Fitxa</a>` : ''}
      </div>
    </div>
    ${!readOnly ? `
    <div style="display:flex;flex-direction:column;gap:3px;margin-left:auto">
      <button class="btn-icon btn-sm" onclick="openPlayerModal('${p.id}')">${ico('edit')}</button>
      <button class="btn-icon btn-sm" onclick="deletePlayer('${p.id}')" style="color:var(--brand)">${ico('trash')}</button>
    </div>` : ''}
  </div>`;
}

function renderStaffCard(p, readOnly=false) {
  return `
  <div class="player-card" style="border-left:3px solid var(--purple)">
    ${_photoEl(p, 40)}
    <div class="player-info">
      <div class="player-name">${p.name} ${p.surname}</div>
      <div class="player-meta">${p.position || 'Staff tècnic'}</div>
      <div class="player-badges">
        <span class="badge badge-purple">Staff</span>
        ${p.doc_url ? `<a href="${p.doc_url}" target="_blank" class="badge badge-blue" style="text-decoration:none">📄 Doc</a>` : ''}
      </div>
    </div>
    <div style="margin-left:auto;text-align:right;font-size:.72rem;color:var(--text3)">
      ${p.phone ? `<div>${p.phone}</div>` : ''}
      ${p.email ? `<div>${p.email}</div>` : ''}
    </div>
    ${!readOnly ? `
    <div style="display:flex;flex-direction:column;gap:3px;margin-left:8px">
      <button class="btn-icon btn-sm" onclick="openPlayerModal('${p.id}')">${ico('edit')}</button>
      <button class="btn-icon btn-sm" onclick="deletePlayer('${p.id}')" style="color:var(--brand)">${ico('trash')}</button>
    </div>` : ''}
  </div>`;
}

/* Previsualització de foto al modal */
function previewPhoto(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const el = document.getElementById('photo-preview-img');
    if (el) el.innerHTML = `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover;border-radius:8px">`;
  };
  reader.readAsDataURL(file);
}

function openPlayerModal(id=null) {
  const players = DB.players();
  const p = id ? players.find(pl => pl.id === id) : null;
  const isNew = !p;
  const pType = p?.person_type || 'player';

  document.getElementById('player-modal-container').innerHTML = `
  <div class="modal-overlay" id="player-modal">
    <div class="modal modal-lg">
      <div class="modal-header">
        <div class="modal-title">${p ? 'Editar fitxa' : 'Nova fitxa'}</div>
        <button class="btn-icon" onclick="closeModal('player-modal')">${ico('close')}</button>
      </div>
      <div class="modal-body">

        ${isNew ? `
        <div class="form-group">
          <label class="form-label">Tipus de perfil</label>
          <div style="display:flex;gap:20px">
            <label style="display:flex;align-items:center;gap:7px;cursor:pointer;font-size:.8125rem;padding:8px 14px;border:1px solid var(--border);border-radius:6px;transition:border-color .15s" id="lbl-player">
              <input type="radio" name="p-type" value="player" checked onchange="document.getElementById('lbl-player').style.borderColor='var(--brand)';document.getElementById('lbl-staff').style.borderColor='var(--border)'">
              👟 <strong>Jugador/a</strong>
            </label>
            <label style="display:flex;align-items:center;gap:7px;cursor:pointer;font-size:.8125rem;padding:8px 14px;border:1px solid var(--border);border-radius:6px;transition:border-color .15s" id="lbl-staff">
              <input type="radio" name="p-type" value="staff" onchange="document.getElementById('lbl-staff').style.borderColor='var(--purple)';document.getElementById('lbl-player').style.borderColor='var(--border)'">
              🦺 <strong>Staff tècnic</strong>
            </label>
          </div>
        </div>
        ` : `<input type="hidden" id="p-type-hidden" value="${pType}">`}

        <div class="form-group">
          <label class="form-label">Foto</label>
          <div style="display:flex;align-items:center;gap:14px">
            <div id="photo-preview-img" style="width:72px;height:72px;border-radius:10px;background:var(--bg3);border:2px dashed var(--border2);overflow:hidden;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.6rem">
              ${p?.photo_url ? `<img src="${p.photo_url}" style="width:100%;height:100%;object-fit:cover">` : '📷'}
            </div>
            <div>
              <input type="file" id="p-photo" accept="image/jpeg,image/png,image/webp" style="display:none" onchange="previewPhoto(this)">
              <button type="button" class="btn btn-ghost btn-sm" onclick="document.getElementById('p-photo').click()">
                ${ico('edit')} ${p?.photo_url ? 'Canviar foto' : 'Afegir foto'}
              </button>
              <div style="font-size:.68rem;color:var(--text3);margin-top:5px">JPG, PNG o WebP · Màx. 2 MB</div>
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group"><label class="form-label">Nom *</label><input class="form-input" id="p-name" value="${p?.name||''}"></div>
          <div class="form-group"><label class="form-label">Cognom *</label><input class="form-input" id="p-surname" value="${p?.surname||''}"></div>
        </div>
        <div class="form-row-3">
          <div class="form-group"><label class="form-label">Data naix.</label><input class="form-input" type="date" id="p-dob" value="${p?.dob||''}"></div>
          <div class="form-group"><label class="form-label">Posició / Rol</label>
            <input class="form-input" id="p-pos" placeholder="Posició o rol" value="${p?.position||''}" list="p-pos-datalist">
            <datalist id="p-pos-datalist">
              ${['Porter','Defensa Central','Lateral Dret','Lateral Esquerre','Migcampista','Extrem Dret','Extrem Esquerre','Davanter',
                 'Segon entrenador/a','Preparador/a físic','Analista','Fisioterapeuta','Delegat/da','Metge/essa'].map(o=>`<option>${o}</option>`).join('')}
            </datalist>
          </div>
          <div class="form-group"><label class="form-label">Dorsal</label><input class="form-input" type="number" id="p-number" value="${p?.number||''}"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Telèfon</label><input class="form-input" id="p-phone" value="${p?.phone||''}"></div>
          <div class="form-group"><label class="form-label">Email</label><input class="form-input" type="email" id="p-email" value="${p?.email||''}"></div>
        </div>
        <div class="form-group">
          <label class="form-label">Peu dominant</label>
          <div style="display:flex;gap:12px">
            <label style="display:flex;align-items:center;gap:5px;cursor:pointer;font-size:.8125rem"><input type="radio" name="p-foot" value="D" ${(!p||p.foot==='D')?'checked':''}>Dret</label>
            <label style="display:flex;align-items:center;gap:5px;cursor:pointer;font-size:.8125rem"><input type="radio" name="p-foot" value="E" ${p?.foot==='E'?'checked':''}>Esquerre</label>
          </div>
        </div>
        <div class="form-group"><label class="form-label">Notes</label><textarea class="form-textarea" id="p-notes" style="min-height:60px">${p?.notes||''}</textarea></div>

        <div class="form-group">
          <label class="form-label">Fitxa federativa (PDF)</label>
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            ${p?.doc_url ? `<a href="${p.doc_url}" target="_blank" class="btn btn-ghost btn-sm">${ico('arrow')} Veure fitxa actual</a>` : ''}
            <input type="file" id="p-doc" accept=".pdf" style="display:none" onchange="document.getElementById('p-doc-name').textContent=this.files[0]?.name||''">
            <button type="button" class="btn btn-ghost btn-sm" onclick="document.getElementById('p-doc').click()">
              ${ico('plus')} ${p?.doc_url ? 'Canviar PDF' : 'Pujar fitxa federativa'}
            </button>
            <span id="p-doc-name" style="font-size:.72rem;color:var(--text3)"></span>
          </div>
        </div>

        ${isNew ? `
        <hr class="divider">
        <div style="background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:14px">
          <div style="font-size:.7rem;font-weight:600;letter-spacing:.09em;text-transform:uppercase;color:var(--text3);margin-bottom:8px">📧 Invitació d'accés</div>
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:.8125rem">
            <input type="checkbox" id="p-send-invite"> Enviar invitació per activar el compte
          </label>
          <div style="font-size:.7rem;color:var(--text3);margin-top:4px">Requereix email. Obrirà el client de correu amb el missatge preparat.</div>
        </div>` : ''}
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="closeModal('player-modal')">Cancel·lar</button>
        <button class="btn btn-primary" onclick="savePlayer('${id||''}')">Desar</button>
      </div>
    </div>
  </div>`;
}

async function savePlayer(id) {
  const existingP = id ? DB.players().find(p => p.id === id) : null;

  /* Determinar el tipus */
  const personType = document.querySelector('input[name="p-type"]:checked')?.value
    || document.getElementById('p-type-hidden')?.value
    || existingP?.person_type || 'player';

  const data = {
    name:        document.getElementById('p-name').value.trim(),
    surname:     document.getElementById('p-surname').value.trim(),
    dob:         document.getElementById('p-dob').value,
    position:    document.getElementById('p-pos').value.trim(),
    number:      parseInt(document.getElementById('p-number').value)||0,
    phone:       document.getElementById('p-phone').value.trim(),
    email:       document.getElementById('p-email').value.trim(),
    foot:        document.querySelector('input[name="p-foot"]:checked')?.value||'D',
    notes:       document.getElementById('p-notes').value.trim(),
    person_type: personType,
    photo_url:   existingP?.photo_url || '',
    doc_url:     existingP?.doc_url   || '',
  };
  if (!data.name||!data.surname) { toast('Nom i cognom obligatoris','error'); return; }

  const playerId = id || uid();

  /* Upload foto */
  const photoFile = document.getElementById('p-photo')?.files[0];
  if (photoFile) {
    if (photoFile.size > 2*1024*1024) { toast('La foto supera els 2 MB','error'); return; }
    try { data.photo_url = await uploadPlayerPhoto(playerId, photoFile); }
    catch(e) { toast('Error en pujar la foto','error'); console.error(e); }
  }

  /* Upload PDF */
  const docFile = document.getElementById('p-doc')?.files[0];
  if (docFile) {
    if (docFile.size > 10*1024*1024) { toast('El PDF supera els 10 MB','error'); return; }
    try { data.doc_url = await uploadPlayerDoc(playerId, docFile); }
    catch(e) { toast('Error en pujar el PDF','error'); console.error(e); }
  }
  if (id) { const i=players.findIndex(p=>p.id===id); if(i!==-1) players[i]={...players[i],...data}; }
  else     players.push({ id:playerId, ...data });
  DB.savePlayers(players);

  /* Afegir jugadors nous a "No convocat" (no el staff) */
  if (!id && personType === 'player') {
    const sel = DB.selection();
    const inSelected    = (sel.selected    || []).includes(playerId);
    const inNotSelected = (sel.notSelected || []).includes(playerId);
    if (!inSelected && !inNotSelected) {
      sel.notSelected = [...(sel.notSelected || []), playerId];
      DB.saveSelection(sel);
    }
  }

  /* Invitació (només en creació) */
  const sendInvite = !id && document.getElementById('p-send-invite')?.checked;
  if (sendInvite) {
    if (!data.email) { toast('Cal un email per enviar la invitació','error'); closeModal('player-modal'); navigate('squad'); return; }
    closeModal('player-modal');
    await _sendPlayerInvitation(playerId, { ...data, role: personType });
    return;
  }

  closeModal('player-modal');
  toast(`${personType === 'staff' ? 'Staff' : 'Jugador/a'} desat/da correctament`, 'success');
  navigate('squad');
}

async function _sendPlayerInvitation(playerId, playerData) {
  try {
    const inv = await DB.createInvitation({
      teamId:        currentTeamId || 'default',
      playerId:      playerId,
      playerName:    playerData.name,
      playerSurname: playerData.surname,
      email:         playerData.email,
      role:          'player',
    });

    const inviteUrl = `${SITE_URL}/#invite-${inv.token}`;
    const emailSent = await sendInvitationEmail(inv);

    /* Mostrar modal amb l'enllaç */
    const body = document.querySelector('.page-body') || document.getElementById('app');
    const div  = document.createElement('div');
    div.innerHTML = `
    <div class="modal-overlay" id="invite-result-modal">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">Invitació generada</div>
          <button class="btn-icon" onclick="closeModal('invite-result-modal');navigate('squad')">${ico('close')}</button>
        </div>
        <div class="modal-body">
          ${emailSent === 'resend'
            ? `<div style="padding:10px 14px;background:var(--green-dim);border:1px solid rgba(22,163,74,.3);border-radius:6px;font-size:.8125rem;color:var(--green)">${ico('check')} Email enviat automàticament a <strong>${playerData.email}</strong></div>`
            : `<div style="padding:10px 14px;background:var(--green-dim);border:1px solid rgba(22,163,74,.3);border-radius:6px;font-size:.8125rem;color:var(--green)">${ico('check')} S'ha obert el teu client de correu amb el missatge preparat per a <strong>${playerData.email}</strong>. Prem Enviar per completar la invitació.</div>`}
          <div class="form-group" style="margin-top:12px">
            <label class="form-label">Enllaç d'activació (vàlid 7 dies)</label>
            <div style="display:flex;gap:6px">
              <input class="form-input" id="invite-url-copy" value="${inviteUrl}" readonly style="font-size:.72rem;font-family:var(--font-mono)">
              <button class="btn btn-secondary btn-sm" onclick="navigator.clipboard.writeText('${inviteUrl}').then(()=>toast('Copiat!','success'))">Copiar</button>
            </div>
          </div>
          <div style="font-size:.75rem;color:var(--text3)">El jugador farà clic a l'enllaç i definirà el seu nom d'usuari i contrasenya.</div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" onclick="closeModal('invite-result-modal');navigate('squad')">Continuar</button>
        </div>
      </div>
    </div>`;
    document.body.appendChild(div.firstElementChild);
    toast('Jugador desat i invitació generada','success');
  } catch(e) {
    toast('Error en generar la invitació: '+e.message, 'error');
    navigate('squad');
  }
}

function deletePlayer(id) {
  if (!confirm('Eliminar jugador?')) return;
  DB.savePlayers(DB.players().filter(p=>p.id!==id));
  toast('Jugador eliminat','success');
  navigate('squad');
}

// ── TACTICAL BOARD v2 ──────────────────────────────────────
// State
let _pitchMode = 'solo';          // 'solo' | 'vs'
let _formation = '433';
let _drawMode  = 'move';          // 'move' | 'arrow' | 'line' | 'erase'
let _drawings  = [];              // [{type,x1,y1,x2,y2,color}]
let _pitchPositions = null;       // current player positions

function renderTactical() {
  const plays = DB.plays();
  return `
  <div class="page-header">
    <div class="page-header-left">
      <div class="page-title">Pissarra Tàctica</div>
      <div class="page-subtitle">Disseny interactiu de formacions i jugades</div>
    </div>
    <div class="page-actions">
      <button class="btn btn-primary" onclick="openSavePlayModal()">Desar jugada</button>
      <button class="btn btn-ghost" onclick="clearPitch()">Netejar</button>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 260px;gap:16px;align-items:start">
    <!-- Pitch column -->
    <div>
      <!-- Mode & Formation controls -->
      <div class="tactical-toolbar" style="margin-bottom:10px">
        <span style="font-size:.68rem;font-weight:600;letter-spacing:.09em;text-transform:uppercase;color:var(--text3)">Mode:</span>
        <div class="tool-btn ${_pitchMode==='solo'?'active':''}" onclick="setPitchMode('solo')">11 jugadors</div>
        <div class="tool-btn ${_pitchMode==='vs'?'active':''}" onclick="setPitchMode('vs')">11 vs 11</div>
        <div class="tool-sep"></div>
        <span style="font-size:.68rem;font-weight:600;letter-spacing:.09em;text-transform:uppercase;color:var(--text3)">Formació:</span>
        ${['433','442','352','4231'].map(f=>`<div class="tool-btn ${_formation===f?'active':''}" onclick="setFormation('${f}')">${f.split('').join('-')}</div>`).join('')}
      </div>

      <!-- Draw toolbar -->
      <div class="tactical-toolbar">
        <span style="font-size:.68rem;font-weight:600;letter-spacing:.09em;text-transform:uppercase;color:var(--text3)">Eines:</span>
        <div class="tool-btn ${_drawMode==='move'?'active':''}" onclick="setDrawMode('move')">${ico('move')} Moure</div>
        <div class="tool-btn ${_drawMode==='arrow'?'active':''}" onclick="setDrawMode('arrow')">${ico('arrow')} Fletxa</div>
        <div class="tool-btn ${_drawMode==='line'?'active':''}" onclick="setDrawMode('line')">${ico('line')} Línia</div>
        <div class="tool-btn ${_drawMode==='erase'?'active':''}" onclick="setDrawMode('erase')">${ico('eraser')} Esborrar</div>
        <div class="tool-sep"></div>
        <div class="tool-btn" onclick="undoLastDrawing()">${ico('undo')} Desfer</div>
      </div>

      <!-- Pitch -->
      <div class="pitch-container" id="pitch">
        ${renderPitchSVG()}
        <canvas id="draw-canvas"></canvas>
        <div id="pitch-players"></div>
      </div>
    </div>

    <!-- Sidebar -->
    <div style="display:flex;flex-direction:column;gap:12px">
      <div class="card">
        <div style="font-size:.68rem;font-weight:600;letter-spacing:.09em;text-transform:uppercase;color:var(--text3);margin-bottom:12px">Jugades desades</div>
        ${plays.length === 0
          ? `<div style="color:var(--text3);font-size:.78rem">Cap jugada desada</div>`
          : plays.map(pl => `
            <div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--border)">
              <div style="flex:1;min-width:0">
                <div style="font-size:.8rem;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${pl.name}</div>
                <div style="font-size:.68rem;color:var(--text3)">${pl.category} · ${pl.mode==='vs'?'11v11':'11 jugadors'}</div>
              </div>
              <button class="btn-icon btn-sm" onclick="loadPlay('${pl.id}')" title="Carregar">${ico('tactical')}</button>
              <button class="btn-icon btn-sm" onclick="deletePlay('${pl.id}')" style="color:var(--brand)">${ico('trash')}</button>
            </div>
          `).join('')
        }
      </div>

      <div class="card">
        <div style="font-size:.68rem;font-weight:600;letter-spacing:.09em;text-transform:uppercase;color:var(--text3);margin-bottom:10px">Llegenda</div>
        <div style="display:flex;flex-direction:column;gap:7px;font-size:.78rem">
          <div style="display:flex;align-items:center;gap:8px"><div style="width:22px;height:22px;border-radius:50%;background:#1a56db;border:2px solid rgba(255,255,255,.5)"></div>Equip propi</div>
          <div style="display:flex;align-items:center;gap:8px"><div style="width:22px;height:22px;border-radius:50%;background:#d97706;border:2px solid rgba(255,255,255,.5)"></div>Porter propi</div>
          ${_pitchMode==='vs' ? `
          <div style="display:flex;align-items:center;gap:8px"><div style="width:22px;height:22px;border-radius:50%;background:#D0021B;border:2px solid rgba(255,255,255,.5)"></div>Equip rival</div>
          <div style="display:flex;align-items:center;gap:8px"><div style="width:22px;height:22px;border-radius:50%;background:#7c3aed;border:2px solid rgba(255,255,255,.5)"></div>Porter rival</div>
          ` : ''}
        </div>
      </div>
    </div>
  </div>
  <div id="tactical-modal-container"></div>
  `;
}

function renderPitchSVG() {
  return `
  <svg class="pitch-markings" viewBox="0 0 350 540" xmlns="http://www.w3.org/2000/svg">
    ${Array.from({length:11},(_,i)=>`<rect x="0" y="${i*50}" width="350" height="50" fill="${i%2===0?'#1e5c36':'#1a5230'}"/>`).join('')}
    <rect x="18" y="18" width="314" height="504" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="2"/>
    <line x1="18" y1="270" x2="332" y2="270" stroke="rgba(255,255,255,.5)" stroke-width="1.5"/>
    <circle cx="175" cy="270" r="52" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="1.5"/>
    <circle cx="175" cy="270" r="2.5" fill="rgba(255,255,255,.7)"/>
    <rect x="79" y="18" width="192" height="72" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="1.5"/>
    <rect x="79" y="450" width="192" height="72" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="1.5"/>
    <rect x="124" y="18" width="102" height="28" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1"/>
    <rect x="124" y="494" width="102" height="28" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1"/>
    <circle cx="175" cy="70" r="2" fill="rgba(255,255,255,.6)"/>
    <circle cx="175" cy="470" r="2" fill="rgba(255,255,255,.6)"/>
    <path d="M79 70 A52 52 0 0 0 271 70" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1.5"/>
    <path d="M79 470 A52 52 0 0 1 271 470" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1.5"/>
    <rect x="158" y="14" width="34" height="10" fill="rgba(255,255,255,.15)" rx="2"/>
    <rect x="158" y="516" width="34" height="10" fill="rgba(255,255,255,.15)" rx="2"/>
  </svg>
  `;
}

const FORMATIONS = {
  '433':  [
    {l:'GK',c:'team-gk',x:50,y:90},
    {l:'RB',c:'team-a',x:82,y:74},{l:'CB',c:'team-a',x:63,y:74},{l:'CB',c:'team-a',x:37,y:74},{l:'LB',c:'team-a',x:18,y:74},
    {l:'CM',c:'team-a',x:72,y:54},{l:'CM',c:'team-a',x:50,y:50},{l:'CM',c:'team-a',x:28,y:54},
    {l:'RW',c:'team-a',x:82,y:30},{l:'ST',c:'team-a',x:50,y:23},{l:'LW',c:'team-a',x:18,y:30},
  ],
  '442':  [
    {l:'GK',c:'team-gk',x:50,y:90},
    {l:'RB',c:'team-a',x:82,y:74},{l:'CB',c:'team-a',x:62,y:74},{l:'CB',c:'team-a',x:38,y:74},{l:'LB',c:'team-a',x:18,y:74},
    {l:'RM',c:'team-a',x:82,y:50},{l:'CM',c:'team-a',x:62,y:50},{l:'CM',c:'team-a',x:38,y:50},{l:'LM',c:'team-a',x:18,y:50},
    {l:'ST',c:'team-a',x:62,y:23},{l:'ST',c:'team-a',x:38,y:23},
  ],
  '352':  [
    {l:'GK',c:'team-gk',x:50,y:90},
    {l:'CB',c:'team-a',x:72,y:74},{l:'CB',c:'team-a',x:50,y:74},{l:'CB',c:'team-a',x:28,y:74},
    {l:'WB',c:'team-a',x:90,y:56},{l:'CM',c:'team-a',x:70,y:52},{l:'CM',c:'team-a',x:50,y:48},{l:'CM',c:'team-a',x:30,y:52},{l:'WB',c:'team-a',x:10,y:56},
    {l:'ST',c:'team-a',x:62,y:23},{l:'ST',c:'team-a',x:38,y:23},
  ],
  '4231': [
    {l:'GK',c:'team-gk',x:50,y:90},
    {l:'RB',c:'team-a',x:82,y:74},{l:'CB',c:'team-a',x:62,y:74},{l:'CB',c:'team-a',x:38,y:74},{l:'LB',c:'team-a',x:18,y:74},
    {l:'DM',c:'team-a',x:62,y:58},{l:'DM',c:'team-a',x:38,y:58},
    {l:'AM',c:'team-a',x:78,y:38},{l:'AM',c:'team-a',x:50,y:36},{l:'AM',c:'team-a',x:22,y:38},
    {l:'ST',c:'team-a',x:50,y:20},
  ],
};

// Mirror formation for rival (flip Y)
function mirrorFormation(positions) {
  return positions.map(pos => ({
    ...pos,
    l: pos.l,
    c: pos.c === 'team-gk' ? 'team-gk-b' : 'team-b',
    y: 100 - pos.y,
  }));
}

function setPitchMode(mode) {
  _pitchMode = mode;
  _drawings = [];
  _pitchPositions = null;
  navigate('tactical');
}

function setFormation(f) {
  _formation = f;
  _pitchPositions = null;
  renderPitchPlayers();
}

function setDrawMode(mode) {
  _drawMode = mode;
  // re-render toolbar only
  document.querySelectorAll('.tool-btn').forEach(btn => {
    const txt = btn.textContent.trim();
    const modeMap = { 'Moure':'move','Fletxa':'arrow','Línia':'line','Esborrar':'erase' };
    for (const [label, m] of Object.entries(modeMap)) {
      if (txt.includes(label)) btn.classList.toggle('active', m === mode);
    }
  });
  const canvas = document.getElementById('draw-canvas');
  if (canvas) canvas.classList.toggle('drawing-mode', mode !== 'move');
}

function renderPitchPlayers() {
  const container = document.getElementById('pitch-players');
  if (!container) return;
  const ownPositions = FORMATIONS[_formation] || FORMATIONS['433'];
  const allPositions = _pitchMode === 'vs'
    ? [...ownPositions, ...mirrorFormation(ownPositions)]
    : ownPositions;

  if (!_pitchPositions) {
    _pitchPositions = allPositions.map(p => ({ ...p }));
  }

  container.innerHTML = _pitchPositions.map((pos, i) => `
    <div class="draggable-player ${pos.c}" id="dp-${i}"
      style="left:${pos.x}%;top:${pos.y}%" data-idx="${i}">${pos.l}</div>
  `).join('');
  setupDragging();
}

function setupDragging() {
  const pitch = document.getElementById('pitch');
  if (!pitch) return;
  document.querySelectorAll('.draggable-player').forEach(el => {
    let dragging = false, sx, sy, ox, oy;
    el.addEventListener('mousedown', e => {
      if (_drawMode !== 'move') return;
      dragging = true; sx = e.clientX; sy = e.clientY;
      ox = parseFloat(el.style.left); oy = parseFloat(el.style.top);
      e.preventDefault(); e.stopPropagation();
    });
    document.addEventListener('mousemove', e => {
      if (!dragging) return;
      const rect = pitch.getBoundingClientRect();
      const dx = ((e.clientX-sx)/rect.width)*100;
      const dy = ((e.clientY-sy)/rect.height)*100;
      const newX = Math.min(100,Math.max(0,ox+dx));
      const newY = Math.min(100,Math.max(0,oy+dy));
      el.style.left = newX+'%'; el.style.top = newY+'%';
      const idx = parseInt(el.dataset.idx);
      if (_pitchPositions?.[idx]) { _pitchPositions[idx].x = newX; _pitchPositions[idx].y = newY; }
    });
    document.addEventListener('mouseup', () => { dragging = false; });
  });
}

// Canvas drawing
let _isDrawing = false;
let _drawStart = null;

function setupCanvas() {
  const pitch = document.getElementById('pitch');
  const canvas = document.getElementById('draw-canvas');
  if (!canvas || !pitch) return;

  const rect = pitch.getBoundingClientRect();
  canvas.width  = pitch.offsetWidth;
  canvas.height = pitch.offsetHeight;
  redrawCanvas();

  canvas.addEventListener('mousedown', e => {
    if (_drawMode === 'move') return;
    _isDrawing = true;
    const r = canvas.getBoundingClientRect();
    _drawStart = { x: e.clientX - r.left, y: e.clientY - r.top };
  });

  canvas.addEventListener('mousemove', e => {
    if (!_isDrawing || _drawMode === 'move' || _drawMode === 'erase') return;
    const r = canvas.getBoundingClientRect();
    const curr = { x: e.clientX - r.left, y: e.clientY - r.top };
    redrawCanvas();
    drawShape(canvas.getContext('2d'), _drawMode, _drawStart.x, _drawStart.y, curr.x, curr.y, true);
  });

  canvas.addEventListener('mouseup', e => {
    if (!_isDrawing) return;
    _isDrawing = false;
    const r = canvas.getBoundingClientRect();
    const end = { x: e.clientX - r.left, y: e.clientY - r.top };
    if (_drawMode === 'erase') { eraseNear(end.x, end.y); return; }
    const dist = Math.hypot(end.x - _drawStart.x, end.y - _drawStart.y);
    if (dist < 6) return;
    _drawings.push({ type: _drawMode, x1: _drawStart.x, y1: _drawStart.y, x2: end.x, y2: end.y });
    redrawCanvas();
  });
}

function redrawCanvas() {
  const canvas = document.getElementById('draw-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  _drawings.forEach(d => drawShape(ctx, d.type, d.x1, d.y1, d.x2, d.y2, false));
}

function drawShape(ctx, type, x1, y1, x2, y2, preview=false) {
  ctx.save();
  ctx.strokeStyle = preview ? 'rgba(255,255,100,.8)' : 'rgba(255,220,50,.9)';
  ctx.fillStyle   = preview ? 'rgba(255,255,100,.8)' : 'rgba(255,220,50,.9)';
  ctx.lineWidth   = 2.5;
  ctx.setLineDash(type==='line' ? [6,4] : []);
  ctx.shadowColor = 'rgba(0,0,0,.4)';
  ctx.shadowBlur  = 4;

  if (type === 'arrow') {
    drawArrow(ctx, x1, y1, x2, y2);
  } else if (type === 'line') {
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
  }
  ctx.restore();
}

function drawArrow(ctx, x1, y1, x2, y2) {
  const angle = Math.atan2(y2-y1, x2-x1);
  const headLen = 14;
  ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - headLen*Math.cos(angle-Math.PI/7), y2 - headLen*Math.sin(angle-Math.PI/7));
  ctx.lineTo(x2 - headLen*Math.cos(angle+Math.PI/7), y2 - headLen*Math.sin(angle+Math.PI/7));
  ctx.closePath(); ctx.fill();
}

function eraseNear(x, y) {
  _drawings = _drawings.filter(d => {
    const midX = (d.x1+d.x2)/2, midY = (d.y1+d.y2)/2;
    return Math.hypot(x-midX, y-midY) > 24;
  });
  redrawCanvas();
}

function undoLastDrawing() {
  _drawings.pop();
  redrawCanvas();
}

function clearPitch() {
  _drawings = [];
  _pitchPositions = null;
  redrawCanvas();
  renderPitchPlayers();
}

// Save/load plays
function openSavePlayModal() {
  document.getElementById('tactical-modal-container').innerHTML = `
  <div class="modal-overlay" id="tactical-save-modal">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">Desar Jugada</div>
        <button class="btn-icon" onclick="closeModal('tactical-save-modal')">${ico('close')}</button>
      </div>
      <div class="modal-body">
        <div class="form-group"><label class="form-label">Nom</label><input class="form-input" id="play-name" placeholder="Ex: Córner Ofensiu 2"></div>
        <div class="form-group"><label class="form-label">Categoria</label>
          <select class="form-select" id="play-cat">${['Formation','Corners','Free kicks','Pressing','Build-up'].map(c=>`<option>${c}</option>`).join('')}</select>
        </div>
        <div class="form-group"><label class="form-label">Descripció</label><textarea class="form-textarea" id="play-desc" style="min-height:60px"></textarea></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="closeModal('tactical-save-modal')">Cancel·lar</button>
        <button class="btn btn-primary" onclick="confirmSavePlay()">Desar</button>
      </div>
    </div>
  </div>`;
}

function confirmSavePlay() {
  const name = document.getElementById('play-name').value.trim();
  if (!name) { toast('Introdueix un nom','error'); return; }
  const plays = DB.plays();
  plays.push({
    id: uid(), name,
    category:    document.getElementById('play-cat').value,
    description: document.getElementById('play-desc').value,
    mode:        _pitchMode,
    formation:   _formation,
    positions:   JSON.parse(JSON.stringify(_pitchPositions || [])),
    drawings:    JSON.parse(JSON.stringify(_drawings)),
  });
  DB.savePlays(plays);
  closeModal('tactical-save-modal');
  toast('Jugada desada!','success');
  navigate('tactical');
}

function loadPlay(id) {
  const play = DB.plays().find(p=>p.id===id);
  if (!play) return;
  _pitchMode     = play.mode || 'solo';
  _formation     = play.formation || '433';
  _pitchPositions= play.positions ? JSON.parse(JSON.stringify(play.positions)) : null;
  _drawings      = play.drawings  ? JSON.parse(JSON.stringify(play.drawings))  : [];
  navigate('tactical');
  setTimeout(() => {
    if (_pitchPositions) {
      const container = document.getElementById('pitch-players');
      if (container) {
        container.innerHTML = _pitchPositions.map((pos,i) => `
          <div class="draggable-player ${pos.c}" id="dp-${i}" style="left:${pos.x}%;top:${pos.y}%" data-idx="${i}">${pos.l}</div>
        `).join('');
        setupDragging();
      }
    }
    redrawCanvas();
    toast(`Jugada "${play.name}" carregada`,'success');
  }, 80);
}

function deletePlay(id) {
  if (!confirm('Eliminar jugada?')) return;
  DB.savePlays(DB.plays().filter(p=>p.id!==id));
  toast('Jugada eliminada','success');
  navigate('tactical');
}
