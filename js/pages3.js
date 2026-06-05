/* ============================================================
   EUROPA HUB v2 — Pages: Settings · Scouting · Comm · Office · Members · Admin
   ============================================================ */

// ── SETTINGS ───────────────────────────────────────────────

function renderSettings() {
  const currentAccent   = lsGet('eh_accent')    || '#2563eb';
  const currentWall     = lsGet('eh_wallpaper')  || null;
  const currentTheme    = lsGet('eh_theme')      || 'dark';
  const currentWidgets  = lsGet('eh_widgets')    ?? { stats:true, match:true, tasks:true, wellness:true };

  const ACCENTS = [
    { name:'Blau Europa (predeterminat)', color:'#2563eb' },
    { name:'Vermell',  color:'#dc2626' },
    { name:'Verd',     color:'#16a34a' },
    { name:'Violeta',  color:'#9333ea' },
    { name:'Taronja',  color:'#ea580c' },
    { name:'Cian',     color:'#0891b2' },
    { name:'Rosa',     color:'#db2777' },
  ];

  const WALLS = [
    { name:'Grada (predeterminat)', val:null,            preview:'assets/grada.jpg' },
    { name:'Camp',                  val:'camp',          preview:'assets/camp.jpg' },
    { name:'Fosc Nocturn',         val:'gradient-dark',  preview:null, gradient:'linear-gradient(135deg,#060d1c 0%,#0a1628 100%)' },
    { name:'Blau Profund',         val:'gradient-blue',  preview:null, gradient:'linear-gradient(135deg,#03071e 0%,#023e8a 100%)' },
    { name:'Verd Bosc',            val:'gradient-green', preview:null, gradient:'linear-gradient(135deg,#081c15 0%,#1b4332 100%)' },
    { name:'Nit Violeta',          val:'gradient-purple',preview:null, gradient:'linear-gradient(135deg,#10002b 0%,#3c096c 100%)' },
  ];

  const getWallStyle = (w) => w.preview
    ? `background:url('${w.preview}') center/cover`
    : `background:${w.gradient}`;

  return `
  <div class="page-header">
    <div class="page-header-left">
      <div class="page-title">Configuració</div>
      <div class="page-subtitle">Personalitza l'aparença del sistema</div>
    </div>
  </div>

  <div style="display:flex;flex-direction:column;gap:32px;max-width:760px">

    <div class="settings-section">
      <div class="settings-section-title">Color d'accent</div>
      <div class="settings-section-desc">S'aplica a botons, indicadors actius i elements destacats.</div>
      <div class="settings-accents">
        ${ACCENTS.map(a => `
          <div class="settings-accent-item ${currentAccent===a.color?'active':''}"
               data-color="${a.color}"
               onclick="saveAccent('${a.color}')" title="${a.name}">
            <div class="settings-accent-dot" style="background:${a.color}"></div>
            ${currentAccent===a.color ? `<div class="settings-accent-check">✓</div>` : ''}
          </div>`).join('')}
        <label class="settings-accent-custom" title="Color personalitzat">
          <input type="color" id="custom-accent-input" value="${currentAccent}"
                 oninput="saveAccent(this.value)">
          <span class="settings-accent-dot" style="background: conic-gradient(red,yellow,lime,cyan,blue,magenta,red)"></span>
          <span style="font-size:.65rem;color:var(--text3);margin-top:2px">Personalitzat</span>
        </label>
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-section-title">Fons de pantalla</div>
      <div class="settings-section-desc">El fons que es veu darrere les finestres.</div>
      <div class="settings-walls">
        ${WALLS.map(w => `
          <div class="settings-wall-item ${(!w.val&&!currentWall)||(currentWall===w.val)?'active':''}"
               onclick="saveWallpaper(${w.val?`'${w.val}'`:'null'})"
               style="${getWallStyle(w)}">
            <div class="settings-wall-overlay"></div>
            <div class="settings-wall-name">${w.name}</div>
            ${((!w.val&&!currentWall)||(currentWall===w.val)) ? `<div class="settings-wall-check">✓</div>` : ''}
          </div>`).join('')}
        ${currentWall && !GRADIENT_WALLS[currentWall] && currentWall !== null && currentWall.startsWith('data:') ? `
          <div class="settings-wall-item active" style="background:url('${currentWall}') center/cover">
            <div class="settings-wall-overlay"></div>
            <div class="settings-wall-name">Foto personalitzada</div>
            <div class="settings-wall-check">✓</div>
          </div>` : ''}
        <label class="settings-wall-upload" title="Afegir foto de la galeria">
          <input type="file" accept="image/*" style="display:none" onchange="saveWallpaperCustom(this)">
          <div class="settings-wall-upload-icon">+</div>
          <div class="settings-wall-upload-label">Galeria</div>
        </label>
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-section-title">Tema</div>
      <div class="settings-section-desc">Aparença general de les finestres i contingut.</div>
      <div class="settings-themes">
        <div class="settings-theme-option ${currentTheme==='dark'?'active':''}" onclick="saveTheme('dark')">
          <div class="settings-theme-preview settings-theme-dark">
            <div class="stp-bar"></div><div class="stp-card"></div><div class="stp-card stp-card-sm"></div>
          </div>
          <div class="settings-theme-label">Fosc${currentTheme==='dark'?' ✓':''}</div>
        </div>
        <div class="settings-theme-option ${currentTheme==='light'?'active':''}" onclick="saveTheme('light')">
          <div class="settings-theme-preview settings-theme-light-prev">
            <div class="stp-bar"></div><div class="stp-card"></div><div class="stp-card stp-card-sm"></div>
          </div>
          <div class="settings-theme-label">Clar${currentTheme==='light'?' ✓':''}</div>
        </div>
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-section-title">Widgets del Desktop</div>
      <div class="settings-section-desc">Elements visibles al desktop quan no hi ha cap finestra oberta.</div>
      <div style="display:flex;flex-direction:column;gap:10px;margin-top:4px">
        ${[
          { key:'tasks', label:'Tasques Pendents',  desc:'Llista de tasques sense completar' },
          { key:'match', label:'Proper Partit',     desc:'Informació de la propera convocatòria' },
          { key:'photo', label:'Foto personalitzada',desc:'Una imatge de la galeria del dispositiu' },
        ].map(w => `
        <div class="settings-widget-toggle">
          <div>
            <div style="font-size:.8rem;font-weight:600;color:var(--text)">${w.label}</div>
            <div style="font-size:.72rem;color:var(--text3);margin-top:2px">${w.desc}</div>
          </div>
          <div class="toggle ${currentWidgets[w.key]?'on':''}" onclick="toggleWidget('${w.key}')"></div>
        </div>`).join('')}
      </div>
    </div>

  </div>`;
}

// ── MESSAGING ──────────────────────────────────────────────

let _activeConv = null;

function renderMessaging() {
  const convs   = getConversations();
  const users   = DB.users().filter(u => u.id !== currentUser.id);
  const active  = _activeConv ? convs.find(c => c.user.id === _activeConv) : null;

  if (_activeConv) markConvRead(_activeConv);

  const msgHtml = active ? active.msgs.map(m => {
    const mine = m.from === currentUser.id;
    const d = new Date(m.date).toLocaleTimeString('ca-ES',{hour:'2-digit',minute:'2-digit'});
    return `<div class="msg-bubble-wrap ${mine?'wrap-mine':'wrap-theirs'}">
      ${mine ? `<button class="msg-delete-btn" onclick="deleteMessage('${m.id}')" title="Esborrar">${ico('trash')}</button>` : ''}
      <div class="msg-bubble ${mine?'msg-mine':'msg-theirs'}">
        <div class="msg-text">${m.text}</div>
        <div class="msg-time">${d}</div>
      </div>
      ${!mine ? `<button class="msg-delete-btn" onclick="deleteMessage('${m.id}')" title="Esborrar">${ico('trash')}</button>` : ''}
    </div>`;
  }).join('') : '';

  return `
  <div class="page-header">
    <div class="page-header-left">
      <div class="page-title">Missatgeria</div>
      <div class="page-subtitle">Comunicació interna de l'equip</div>
    </div>
    <div class="page-actions">
      <button class="btn btn-primary" onclick="openNewMsgModal()">${ico('plus')} Nou Missatge</button>
    </div>
  </div>
  <div class="msg-layout">
    <div class="msg-sidebar">
      ${users.map(u => {
        const conv = convs.find(c => c.user.id === u.id);
        return `<div class="msg-conv-item ${_activeConv===u.id?'active':''}" onclick="_activeConv='${u.id}';navigate('messaging')">
          <div class="avatar">${u.avatar}</div>
          <div class="msg-conv-info">
            <div class="msg-conv-name">${u.name.split(' ')[0]}</div>
            <div class="msg-conv-last">${conv?.last?.text?.slice(0,30)||DEFAULT_ROLES[u.role]?.label||''}${conv?.last?.text?.length>30?'…':''}</div>
          </div>
          ${conv?.unread ? `<div class="msg-unread-badge">${conv.unread}</div>` : ''}
        </div>`;
      }).join('')}
    </div>
    <div class="msg-main">
      ${active ? `
        <div class="msg-header">
          <div class="avatar">${active.user.avatar}</div>
          <div>
            <div class="msg-header-name">${active.user.name}</div>
            <div class="msg-header-role">${DEFAULT_ROLES[active.user.role]?.label||active.user.role}</div>
          </div>
        </div>
        <div class="msg-thread" id="msg-thread">${msgHtml}</div>
        <div class="msg-compose">
          <input class="form-input" id="msg-input" placeholder="Escriu un missatge…" onkeydown="if(event.key==='Enter')submitMsg('${active.user.id}')">
          <button class="btn btn-primary" onclick="submitMsg('${active.user.id}')">${ico('publish')}</button>
        </div>` : `
        <div class="msg-empty-state">
          ${ico('msg')}
          <div>Selecciona una conversa per começar</div>
        </div>`}
    </div>
  </div>
  <div id="msg-modal"></div>`;
}

function submitMsg(toId) {
  const input = document.getElementById('msg-input');
  if (!input || !input.value.trim()) return;
  sendMessage(toId, input.value);
  navigate('messaging');
}

function openNewMsgModal() {
  const users = DB.users().filter(u => u.id !== currentUser.id);
  document.getElementById('msg-modal').innerHTML = `
  <div class="modal-overlay" id="new-msg-modal">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">Nou Missatge</div>
        <button class="btn-icon" onclick="closeModal('new-msg-modal')">${ico('close')}</button>
      </div>
      <div class="modal-body">
        <div class="form-group"><label class="form-label">Destinatari</label>
          <select class="form-select" id="nm-to">
            ${users.map(u=>`<option value="${u.id}">${u.name} — ${DEFAULT_ROLES[u.role]?.label||u.role}</option>`).join('')}
          </select>
        </div>
        <div class="form-group"><label class="form-label">Missatge</label>
          <textarea class="form-textarea" id="nm-text" placeholder="Escriu aquí…"></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="closeModal('new-msg-modal')">Cancel·lar</button>
        <button class="btn btn-primary" onclick="sendNewMsg()">${ico('publish')} Enviar</button>
      </div>
    </div>
  </div>`;
}

function sendNewMsg() {
  const to   = document.getElementById('nm-to').value;
  const text = document.getElementById('nm-text').value;
  if (!text.trim()) return;
  sendMessage(to, text);
  closeModal('new-msg-modal');
  _activeConv = to;
  navigate('messaging');
}

// ── EMAIL ──────────────────────────────────────────────────

function renderEmail() {
  const cfg  = lsGet('eh_email') || { provider:'gmail', url:'', address:'' };
  const players = DB.players();

  const PROVIDERS = [
    { id:'gmail',   label:'Gmail',   url:'https://mail.google.com',      logo:'G' },
    { id:'outlook', label:'Outlook', url:'https://outlook.live.com/mail', logo:'O' },
    { id:'custom',  label:'WebMail', url:cfg.url||'',                    logo:'@' },
  ];
  const active = PROVIDERS.find(p=>p.id===cfg.provider) || PROVIDERS[0];
  const openUrl = cfg.provider==='custom' ? (cfg.url||'') : active.url;

  return `
  <div class="page-header">
    <div class="page-header-left">
      <div class="page-title">Correu</div>
      <div class="page-subtitle">Accés ràpid al correu i contacte amb jugadors</div>
    </div>
    <div class="page-actions">
      ${openUrl ? `<a href="${openUrl}" target="_blank" class="btn btn-primary">${ico('email')} Obrir correu</a>` : ''}
    </div>
  </div>

  <div style="display:flex;flex-direction:column;gap:28px;max-width:800px">

    <div>
      <div style="font-size:.68rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--text3);margin-bottom:12px">Proveïdor</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        ${PROVIDERS.map(p=>`
        <div class="email-provider-card ${cfg.provider===p.id?'active':''}" onclick="saveEmailProvider('${p.id}')">
          <div class="email-provider-logo">${p.logo}</div>
          <div class="email-provider-name">${p.label}</div>
        </div>`).join('')}
      </div>
      ${cfg.provider==='custom' ? `
      <div class="form-group" style="margin-top:12px;max-width:380px">
        <label class="form-label">URL del WebMail</label>
        <input class="form-input" id="email-custom-url" placeholder="https://webmail.exemple.com" value="${cfg.url||''}">
        <button class="btn btn-secondary btn-sm" style="margin-top:6px" onclick="saveEmailCustomUrl()">Guardar URL</button>
      </div>` : ''}
    </div>

    <div>
      <div style="font-size:.68rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--text3);margin-bottom:12px">Contactes ràpids — Jugadors</div>
      <div style="display:flex;flex-direction:column;gap:1px">
        ${players.filter(p=>p.email).map(p=>`
        <div class="email-contact-row">
          <div class="avatar sm">${((p.name||'?')[0]+(p.surname||'?')[0]).toUpperCase()}</div>
          <div style="flex:1;min-width:0">
            <div style="font-size:.8125rem;font-weight:600">${p.name} ${p.surname}</div>
            <div style="font-size:.71rem;color:var(--text3)">${p.email}</div>
          </div>
          <a href="mailto:${p.email}" class="btn btn-ghost btn-sm">${ico('email')} Escriure</a>
        </div>`).join('')}
        ${players.filter(p=>!p.email).length > 0 ? `
        <div style="font-size:.72rem;color:var(--text3);padding:10px 0;text-align:center">${players.filter(p=>!p.email).length} jugadors sense email registrat</div>` : ''}
      </div>
    </div>

  </div>`;
}

function saveEmailProvider(id) {
  const cfg = lsGet('eh_email') || {};
  cfg.provider = id;
  lsSet('eh_email', cfg);
  navigate('email');
}
function saveEmailCustomUrl() {
  const cfg = lsGet('eh_email') || {};
  cfg.url = document.getElementById('email-custom-url')?.value || '';
  lsSet('eh_email', cfg);
  navigate('email');
}

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

let _commTab = 'posts';

function renderComm() {
  const posts    = lsGet('eh_comm_posts')    || [];
  const notes    = lsGet('eh_comm_notes')    || [];
  const contacts = lsGet('eh_comm_contacts') || [];
  const tab = _commTab;

  const PLATFORMS = ['Instagram','Twitter/X','Facebook','YouTube','TikTok','Web'];
  const STATUS_COLORS = { planificat:'badge-blue', publicat:'badge-green', borrador:'badge-gray', cancel·lat:'badge-red' };

  return `
  <div class="page-header">
    <div class="page-header-left">
      <div class="page-title">Comunicació</div>
      <div class="page-subtitle">Gestió de continguts, premsa i xarxes socials</div>
    </div>
    <div class="page-actions">
      ${tab==='posts'    ? `<button class="btn btn-primary" onclick="openCommPostModal()">${ico('plus')} Nova Publicació</button>` : ''}
      ${tab==='notes'    ? `<button class="btn btn-primary" onclick="openCommNoteModal()">${ico('plus')} Nou Comunicat</button>` : ''}
      ${tab==='contacts' ? `<button class="btn btn-primary" onclick="openCommContactModal()">${ico('plus')} Nou Contacte</button>` : ''}
    </div>
  </div>

  <div class="tabs">
    <button class="tab-btn ${tab==='posts'?'active':''}" onclick="_commTab='posts';navigate('communication')">${ico('publish')} Publicacions</button>
    <button class="tab-btn ${tab==='notes'?'active':''}" onclick="_commTab='notes';navigate('communication')">${ico('edit')} Comunicats</button>
    <button class="tab-btn ${tab==='contacts'?'active':''}" onclick="_commTab='contacts';navigate('communication')">${ico('users')} Contactes Premsa</button>
  </div>

  ${tab === 'posts' ? `
  <div style="display:flex;flex-direction:column;gap:10px">
    ${posts.length === 0 ? `<div class="empty-state">${ico('publish')}<h3>Cap publicació planificada</h3><p>Crea la primera publicació per al calendari de continguts</p></div>` : ''}
    ${posts.map((p,i) => `
    <div class="card comm-post-card">
      <div style="display:flex;align-items:flex-start;gap:14px">
        <div class="comm-platform-badge comm-plat-${(p.platform||'').toLowerCase().replace('/','').replace(' ','')}">
          ${(p.platform||'')[0]||'?'}
        </div>
        <div style="flex:1;min-width:0">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
            <span style="font-weight:700;font-size:.875rem">${p.platform}</span>
            <span class="badge ${STATUS_COLORS[p.status]||'badge-gray'}">${p.status}</span>
            ${p.date ? `<span style="font-size:.7rem;color:var(--text3)">${formatDate(p.date)}</span>` : ''}
          </div>
          <div style="font-size:.8125rem;color:var(--text2);white-space:pre-wrap;line-height:1.5">${p.text}</div>
          ${p.hashtags ? `<div style="margin-top:6px;font-size:.72rem;color:var(--brand)">${p.hashtags}</div>` : ''}
        </div>
        <div style="display:flex;gap:4px;flex-shrink:0">
          <button class="btn-icon btn-sm" onclick="openCommPostModal(${i})">${ico('edit')}</button>
          <button class="btn-icon btn-sm" onclick="deleteCommPost(${i})" style="color:var(--red)">${ico('trash')}</button>
        </div>
      </div>
    </div>`).join('')}
  </div>` : ''}

  ${tab === 'notes' ? `
  <div style="display:flex;flex-direction:column;gap:10px">
    ${notes.length === 0 ? `<div class="empty-state">${ico('edit')}<h3>Cap comunicat creat</h3><p>Redacta el primer comunicat de premsa</p></div>` : ''}
    ${notes.map((n,i) => `
    <div class="card">
      <div style="display:flex;align-items:flex-start;gap:14px">
        <div style="flex:1;min-width:0">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
            <span style="font-weight:700;font-size:.9rem">${n.title}</span>
            ${n.date ? `<span style="font-size:.7rem;color:var(--text3)">${formatDate(n.date)}</span>` : ''}
          </div>
          <div style="font-size:.8rem;color:var(--text2);line-height:1.6;max-height:80px;overflow:hidden">${n.body}</div>
        </div>
        <div style="display:flex;gap:4px;flex-shrink:0">
          <button class="btn-icon btn-sm" onclick="openCommNoteModal(${i})">${ico('edit')}</button>
          <button class="btn-icon btn-sm" onclick="deleteCommNote(${i})" style="color:var(--red)">${ico('trash')}</button>
        </div>
      </div>
    </div>`).join('')}
  </div>` : ''}

  ${tab === 'contacts' ? `
  <div class="card" style="padding:0;overflow:hidden">
    ${contacts.length === 0 ? `<div style="padding:40px;text-align:center;color:var(--text3)">${ico('users')}<div style="margin-top:12px">Cap contacte de premsa</div></div>` : ''}
    ${contacts.map((c,i) => `
    <div style="display:flex;align-items:center;gap:12px;padding:12px 18px;border-bottom:1px solid var(--border)">
      <div class="avatar">${(c.name||'?')[0].toUpperCase()}</div>
      <div style="flex:1;min-width:0">
        <div style="font-weight:600;font-size:.8125rem">${c.name}</div>
        <div style="font-size:.71rem;color:var(--text3)">${c.media}${c.role?' · '+c.role:''}</div>
      </div>
      ${c.email ? `<a href="mailto:${c.email}" class="btn btn-ghost btn-sm">${ico('email')}</a>` : ''}
      ${c.phone ? `<a href="tel:${c.phone}" class="btn btn-ghost btn-sm">${ico('comm')}</a>` : ''}
      <div style="display:flex;gap:4px">
        <button class="btn-icon btn-sm" onclick="openCommContactModal(${i})">${ico('edit')}</button>
        <button class="btn-icon btn-sm" onclick="deleteCommContact(${i})" style="color:var(--red)">${ico('trash')}</button>
      </div>
    </div>`).join('')}
  </div>` : ''}

  <div id="comm-modal-container"></div>`;
}

/* ── Comm: Post modal ── */
function openCommPostModal(idx=null) {
  const posts = lsGet('eh_comm_posts') || [];
  const p = idx !== null ? posts[idx] : null;
  const PLATFORMS = ['Instagram','Twitter/X','Facebook','YouTube','TikTok','Web'];
  const STATUSES  = ['planificat','borrador','publicat','cancel·lat'];
  document.getElementById('comm-modal-container').innerHTML = `
  <div class="modal-overlay" id="comm-post-modal">
    <div class="modal modal-lg">
      <div class="modal-header">
        <div class="modal-title">${p?'Editar':'Nova'} Publicació</div>
        <button class="btn-icon" onclick="closeModal('comm-post-modal')">${ico('close')}</button>
      </div>
      <div class="modal-body">
        <div class="form-row">
          <div class="form-group"><label class="form-label">Plataforma</label>
            <select class="form-select" id="cp-platform">
              ${PLATFORMS.map(pl=>`<option ${p?.platform===pl?'selected':''}>${pl}</option>`).join('')}
            </select></div>
          <div class="form-group"><label class="form-label">Estat</label>
            <select class="form-select" id="cp-status">
              ${STATUSES.map(s=>`<option ${p?.status===s?'selected':''}>${s}</option>`).join('')}
            </select></div>
        </div>
        <div class="form-group"><label class="form-label">Data de publicació</label>
          <input class="form-input" type="date" id="cp-date" value="${p?.date||''}"></div>
        <div class="form-group"><label class="form-label">Contingut</label>
          <textarea class="form-textarea" id="cp-text" style="min-height:120px" placeholder="Text de la publicació…">${p?.text||''}</textarea></div>
        <div class="form-group"><label class="form-label">Hashtags / Mencions</label>
          <input class="form-input" id="cp-hashtags" placeholder="#ceeuropa #futbol" value="${p?.hashtags||''}"></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="closeModal('comm-post-modal')">Cancel·lar</button>
        <button class="btn btn-primary" onclick="saveCommPost(${idx??'null'})">${ico('check')} Guardar</button>
      </div>
    </div>
  </div>`;
}

function saveCommPost(idx) {
  const posts = lsGet('eh_comm_posts') || [];
  const post = {
    platform: document.getElementById('cp-platform').value,
    status:   document.getElementById('cp-status').value,
    date:     document.getElementById('cp-date').value,
    text:     document.getElementById('cp-text').value.trim(),
    hashtags: document.getElementById('cp-hashtags').value.trim(),
  };
  if (!post.text) return toast('El contingut és obligatori', 'error');
  if (idx !== null && idx !== 'null') posts[idx] = post; else posts.push(post);
  lsSet('eh_comm_posts', posts);
  closeModal('comm-post-modal');
  toast('Publicació guardada', 'success');
  navigate('communication');
}
function deleteCommPost(i) { const p=lsGet('eh_comm_posts')||[]; p.splice(i,1); lsSet('eh_comm_posts',p); navigate('communication'); }

/* ── Comm: Note modal ── */
function openCommNoteModal(idx=null) {
  const notes = lsGet('eh_comm_notes') || [];
  const n = idx !== null ? notes[idx] : null;
  document.getElementById('comm-modal-container').innerHTML = `
  <div class="modal-overlay" id="comm-note-modal">
    <div class="modal modal-lg">
      <div class="modal-header">
        <div class="modal-title">${n?'Editar':'Nou'} Comunicat</div>
        <button class="btn-icon" onclick="closeModal('comm-note-modal')">${ico('close')}</button>
      </div>
      <div class="modal-body">
        <div class="form-group"><label class="form-label">Títol</label>
          <input class="form-input" id="cn-title" placeholder="Títol del comunicat" value="${n?.title||''}"></div>
        <div class="form-group"><label class="form-label">Data</label>
          <input class="form-input" type="date" id="cn-date" value="${n?.date||''}"></div>
        <div class="form-group"><label class="form-label">Contingut</label>
          <textarea class="form-textarea" id="cn-body" style="min-height:200px" placeholder="Cos del comunicat…">${n?.body||''}</textarea></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="closeModal('comm-note-modal')">Cancel·lar</button>
        <button class="btn btn-primary" onclick="saveCommNote(${idx??'null'})">${ico('check')} Guardar</button>
      </div>
    </div>
  </div>`;
}
function saveCommNote(idx) {
  const notes = lsGet('eh_comm_notes') || [];
  const note = { title: document.getElementById('cn-title').value.trim(), date: document.getElementById('cn-date').value, body: document.getElementById('cn-body').value.trim() };
  if (!note.title || !note.body) return toast('Títol i contingut obligatoris', 'error');
  if (idx !== null && idx !== 'null') notes[idx] = note; else notes.push(note);
  lsSet('eh_comm_notes', notes); closeModal('comm-note-modal'); toast('Comunicat guardat', 'success'); navigate('communication');
}
function deleteCommNote(i) { const n=lsGet('eh_comm_notes')||[]; n.splice(i,1); lsSet('eh_comm_notes',n); navigate('communication'); }

/* ── Comm: Contact modal ── */
function openCommContactModal(idx=null) {
  const contacts = lsGet('eh_comm_contacts') || [];
  const c = idx !== null ? contacts[idx] : null;
  const ROLES = ['Periodista','Fotògraf','Càmera','Redactor/a','Cap de redacció','Director/a','Freelance'];
  document.getElementById('comm-modal-container').innerHTML = `
  <div class="modal-overlay" id="comm-contact-modal">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">${c?'Editar':'Nou'} Contacte</div>
        <button class="btn-icon" onclick="closeModal('comm-contact-modal')">${ico('close')}</button>
      </div>
      <div class="modal-body">
        <div class="form-row">
          <div class="form-group"><label class="form-label">Nom *</label><input class="form-input" id="cc-name" value="${c?.name||''}"></div>
          <div class="form-group"><label class="form-label">Mitjà *</label><input class="form-input" id="cc-media" value="${c?.media||''}"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Funció</label>
            <select class="form-select" id="cc-role">
              <option value="">Sense especificar</option>
              ${ROLES.map(r=>`<option ${c?.role===r?'selected':''}>${r}</option>`).join('')}
            </select></div>
          <div class="form-group"><label class="form-label">Email</label><input class="form-input" type="email" id="cc-email" value="${c?.email||''}"></div>
        </div>
        <div class="form-group"><label class="form-label">Telèfon</label><input class="form-input" id="cc-phone" value="${c?.phone||''}"></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="closeModal('comm-contact-modal')">Cancel·lar</button>
        <button class="btn btn-primary" onclick="saveCommContact(${idx??'null'})">${ico('check')} Guardar</button>
      </div>
    </div>
  </div>`;
}
function saveCommContact(idx) {
  const contacts = lsGet('eh_comm_contacts') || [];
  const c = { name: document.getElementById('cc-name').value.trim(), media: document.getElementById('cc-media').value.trim(), role: document.getElementById('cc-role').value, email: document.getElementById('cc-email').value.trim(), phone: document.getElementById('cc-phone').value.trim() };
  if (!c.name || !c.media) return toast('Nom i mitjà obligatoris', 'error');
  if (idx !== null && idx !== 'null') contacts[idx] = c; else contacts.push(c);
  lsSet('eh_comm_contacts', contacts); closeModal('comm-contact-modal'); toast('Contacte guardat', 'success'); navigate('communication');
}
function deleteCommContact(i) { const c=lsGet('eh_comm_contacts')||[]; c.splice(i,1); lsSet('eh_comm_contacts',c); navigate('communication'); }

// ── ACCREDITATIONS ─────────────────────────────────────────

function renderAccreditations() {
  const saved = lsGet('eh_acreditats') || { local:'EUROPA', visitant:'RIVAL', jornada:'J1', data:'', hora:'', list:[] };
  const list = saved.list || [];

  const TIPUS = {
    organitzacio: { label:'ORGANITZACIÓ', color:'#f59e0b' },
    premsa:       { label:'PREMSA',       color:'#3b82f6' },
    fotograf:     { label:'FOTÒGRAF',     color:'#10b981' },
  };

  return `
  <div class="page-header">
    <div class="page-header-left">
      <div class="page-title">Acreditacions</div>
      <div class="page-subtitle">Sistema d'acreditació de premsa — CE Europa</div>
    </div>
    <div class="page-actions">
      <button class="btn btn-primary" onclick="openAcreditacioModal()">${ico('plus')} Afegir acreditat</button>
      <button class="btn btn-secondary" onclick="generarPDFAcreditacions()">${ico('publish')} Generar PDF</button>
    </div>
  </div>

  <div class="card" style="margin-bottom:18px">
    <div style="font-size:.68rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--text3);margin-bottom:14px">Dades del Partit</div>
    <div class="form-row-3" style="grid-template-columns:repeat(5,1fr)">
      <div class="form-group"><label class="form-label">Local</label>
        <input class="form-input" id="ac-local" value="${saved.local}" oninput="saveAcredDades()"></div>
      <div class="form-group"><label class="form-label">Visitant</label>
        <input class="form-input" id="ac-visitant" value="${saved.visitant}" oninput="saveAcredDades()"></div>
      <div class="form-group"><label class="form-label">Jornada</label>
        <input class="form-input" id="ac-jornada" value="${saved.jornada}" oninput="saveAcredDades()"></div>
      <div class="form-group"><label class="form-label">Data</label>
        <input class="form-input" type="date" id="ac-data" value="${saved.data}" oninput="saveAcredDades()"></div>
      <div class="form-group"><label class="form-label">Hora</label>
        <input class="form-input" type="time" id="ac-hora" value="${saved.hora}" oninput="saveAcredDades()"></div>
    </div>
    <div style="margin-top:14px">
      <label class="form-label" style="margin-bottom:6px;display:block">Importar des d'Excel/CSV</label>
      <input type="file" id="ac-file-input" accept=".xlsx,.xls,.csv,.txt" style="font-size:.78rem;color:var(--text2)" onchange="importarAcreditats(this.files[0])">
    </div>
  </div>

  <div class="card" style="padding:0;overflow:hidden">
    <div style="padding:14px 18px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">
      <div style="font-weight:700">Acreditats <span class="badge badge-blue" style="margin-left:6px">${list.length}</span></div>
      <div style="display:flex;gap:8px">
        ${Object.entries(TIPUS).map(([k,v]) => `<span style="font-size:.68rem;font-weight:700;color:${v.color}">● ${v.label}: ${list.filter(a=>a.tipus===k).length}</span>`).join('<span style="color:var(--border2)">|</span>')}
      </div>
    </div>
    ${list.length === 0
      ? `<div style="padding:40px;text-align:center;color:var(--text3);font-size:.8rem">Cap acreditat. Afegeix-ne o importa'n des d'Excel.</div>`
      : `<div style="max-height:400px;overflow-y:auto">
        <table>
          <thead><tr><th>#</th><th>Nom</th><th>Mitjà</th><th>Tipus</th><th></th></tr></thead>
          <tbody>
            ${list.map((a,i)=>`
            <tr>
              <td style="color:var(--text3);font-size:.72rem">${i+1}</td>
              <td><input class="form-input" style="padding:5px 8px;font-size:.8rem" value="${a.nom}" oninput="updateAcreditat(${i},'nom',this.value)"></td>
              <td><input class="form-input" style="padding:5px 8px;font-size:.8rem" value="${a.mitja}" oninput="updateAcreditat(${i},'mitja',this.value)"></td>
              <td>
                <select class="form-select" style="padding:5px 8px;font-size:.75rem" onchange="updateAcreditat(${i},'tipus',this.value)">
                  ${Object.entries(TIPUS).map(([k,v])=>`<option value="${k}" ${a.tipus===k?'selected':''}>${v.label}</option>`).join('')}
                </select>
              </td>
              <td><button class="btn-icon btn-sm" onclick="eliminarAcreditat(${i})" style="color:var(--red)">${ico('trash')}</button></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>`}
  </div>

  <div id="ac-modal-container"></div>
  <div id="pdf-root" style="position:fixed;left:-99999px;top:0;pointer-events:none"></div>`;
}

function saveAcredDades() {
  const saved = lsGet('eh_acreditats') || { list:[] };
  saved.local    = document.getElementById('ac-local')?.value || saved.local;
  saved.visitant = document.getElementById('ac-visitant')?.value || saved.visitant;
  saved.jornada  = document.getElementById('ac-jornada')?.value || saved.jornada;
  saved.data     = document.getElementById('ac-data')?.value || saved.data;
  saved.hora     = document.getElementById('ac-hora')?.value || saved.hora;
  lsSet('eh_acreditats', saved);
}

function updateAcreditat(i, camp, valor) {
  const saved = lsGet('eh_acreditats') || { list:[] };
  if (saved.list[i]) { saved.list[i][camp] = valor; lsSet('eh_acreditats', saved); }
}

function eliminarAcreditat(i) {
  const saved = lsGet('eh_acreditats') || { list:[] };
  saved.list.splice(i, 1);
  lsSet('eh_acreditats', saved);
  navigate('accreditations');
}

function openAcreditacioModal() {
  const TIPUS = { organitzacio:'ORGANITZACIÓ', premsa:'PREMSA', fotograf:'FOTÒGRAF' };
  document.getElementById('ac-modal-container').innerHTML = `
  <div class="modal-overlay" id="ac-add-modal">
    <div class="modal">
      <div class="modal-header"><div class="modal-title">Nou Acreditat</div>
        <button class="btn-icon" onclick="closeModal('ac-add-modal')">${ico('close')}</button></div>
      <div class="modal-body">
        <div class="form-row">
          <div class="form-group"><label class="form-label">Nom *</label><input class="form-input" id="na-nom" placeholder="Nom Cognoms"></div>
          <div class="form-group"><label class="form-label">Mitjà *</label><input class="form-input" id="na-mitja" placeholder="CE Europa, La Vanguardia…"></div>
        </div>
        <div class="form-group"><label class="form-label">Tipus</label>
          <select class="form-select" id="na-tipus">
            ${Object.entries(TIPUS).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}
          </select></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="closeModal('ac-add-modal')">Cancel·lar</button>
        <button class="btn btn-primary" onclick="afegirAcreditat()">${ico('check')} Afegir</button>
      </div>
    </div>
  </div>`;
}

function afegirAcreditat() {
  const nom   = document.getElementById('na-nom').value.trim();
  const mitja = document.getElementById('na-mitja').value.trim();
  const tipus = document.getElementById('na-tipus').value;
  if (!nom || !mitja) return toast('Nom i mitjà obligatoris', 'error');
  const saved = lsGet('eh_acreditats') || { local:'EUROPA', visitant:'RIVAL', jornada:'J1', data:'', hora:'', list:[] };
  saved.list.push({ nom: nom.split(/\s+/).slice(0,2).join(' '), mitja, tipus });
  lsSet('eh_acreditats', saved);
  closeModal('ac-add-modal');
  navigate('accreditations');
}

function importarAcreditats(file) {
  if (!file) return;
  const ext = file.name.split('.').pop().toLowerCase();
  const reader = new FileReader();
  reader.onload = e => {
    let files = [];
    if (['xlsx','xls'].includes(ext)) {
      if (!window.XLSX) return toast('Carregant XLSX...', 'info');
      const wb = XLSX.read(e.target.result, { type:'array' });
      files = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header:1, defval:'' });
    } else {
      const text = e.target.result;
      const sep = ['\t',';',','].map(s=>({s,n:text.split('\n')[0].split(s).length})).sort((a,b)=>b.n-a.n)[0].s;
      files = text.split(/\r?\n/).map(l=>l.split(sep));
    }
    const saved = lsGet('eh_acreditats') || { local:'EUROPA', visitant:'RIVAL', jornada:'J1', data:'', hora:'', list:[] };
    const headers = files[0].map(h=>String(h).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').trim());
    const hasH = headers.some(h=>['nom','nombre','name','mitja','media'].includes(h));
    const ni = hasH ? headers.findIndex(h=>['nom','nombre','name'].includes(h)) || 0 : 0;
    const mi = hasH ? headers.findIndex(h=>['mitja','media','medio','empresa'].includes(h)) || 1 : 1;
    const rows = hasH ? files.slice(1) : files;
    let count = 0;
    rows.forEach(row => {
      const nom = String(row[ni]||'').trim().split(/\s+/).slice(0,2).join(' ');
      const mitja = String(row[mi]||'').trim();
      if (!nom || !mitja) return;
      const tipus = row.some(c=>/fot[oó]/i.test(String(c))) ? 'fotograf' : 'premsa';
      saved.list.push({ nom, mitja, tipus });
      count++;
    });
    lsSet('eh_acreditats', saved);
    toast(`${count} acreditats importats`, 'success');
    navigate('accreditations');
  };
  ['xlsx','xls'].includes(ext) ? reader.readAsArrayBuffer(file) : reader.readAsText(file);
}

async function generarPDFAcreditacions() {
  const saved = lsGet('eh_acreditats') || { local:'EUROPA', visitant:'RIVAL', jornada:'J1', data:'', hora:'', list:[] };
  saveAcredDades();
  const list = saved.list;
  if (!list.length) return toast('No hi ha acreditats per exportar', 'error');
  if (!window.jspdf || !window.html2canvas) return toast('Carregant llibreries PDF...', 'info');

  const local    = (document.getElementById('ac-local')?.value || saved.local).toUpperCase();
  const visitant = (document.getElementById('ac-visitant')?.value || saved.visitant).toUpperCase();
  const jornada  = (document.getElementById('ac-jornada')?.value || saved.jornada).toUpperCase();
  const data     = document.getElementById('ac-data')?.value || saved.data;
  const hora     = document.getElementById('ac-hora')?.value || saved.hora;
  const dataFmt  = data ? new Date(data+'T12:00:00').toLocaleDateString('ca-ES') : '';

  const TIPUS_BG = {
    organitzacio: 'assets/AcreditacionesORGANIZACION.png',
    premsa:       'assets/AcreditacionesPRENSA.png',
    fotograf:     'assets/AcreditacionesFOTOGRAFO.png',
  };

  const root = document.getElementById('pdf-root');
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ orientation:'portrait', unit:'px', format:[794,1123] });
  const btn = document.querySelector('[onclick="generarPDFAcreditacions()"]');
  if (btn) { btn.disabled = true; btn.textContent = 'Generant...'; }

  function ticketHTML(a, pos) {
    if (!a) return '';
    return `<div class="ac-ticket ac-ticket-${pos}">
      <div class="ac-match"><div class="ac-team">${local}</div><div class="ac-vs-gap"></div><div class="ac-team">${visitant}</div></div>
      <div class="ac-info">
        <div class="ac-row"><span class="ac-season">Temporada 25/26</span><span class="ac-matchday">${jornada}</span><span class="ac-gate">GO2</span></div>
        <div class="ac-stadium">Can Drag&oacute;</div>
        <div class="ac-row ac-date-row"><span class="ac-date">${dataFmt}</span><span class="ac-time">${hora}</span></div>
      </div>
      <div class="ac-namebox"><div class="ac-name">${a.nom.toUpperCase()}</div></div>
      <div class="ac-mediabox"><div class="ac-media">${a.mitja.toUpperCase()}</div></div>
    </div>`;
  }

  try {
    await document.fonts.ready;
    const total = Math.ceil(list.length / 2);
    for (let p = 0; p < total; p++) {
      const top = list[p*2], bottom = list[p*2+1];
      root.innerHTML = `
      <div class="ac-page">
        <div class="ac-bg-half ac-bg-top"><img class="ac-pdf-bg" src="${TIPUS_BG[top?.tipus||'organitzacio']}" alt=""></div>
        <div class="ac-bg-half ac-bg-bottom"><img class="ac-pdf-bg" src="${TIPUS_BG[(bottom||top)?.tipus||'organitzacio']}" alt=""></div>
        ${ticketHTML(top,'top')}${ticketHTML(bottom,'bottom')}
      </div>`;
      await Promise.all([...root.querySelectorAll('img')].map(img => img.complete ? Promise.resolve() : new Promise(r=>{img.onload=r;img.onerror=r;})));
      await new Promise(r => requestAnimationFrame(r));
      const canvas = await html2canvas(root.querySelector('.ac-page'), { scale:2, backgroundColor:null, useCORS:true });
      const img = canvas.toDataURL('image/png');
      if (p > 0) pdf.addPage();
      pdf.addImage(img, 'PNG', 0, 0, 794, 1123, undefined, 'NONE');
      canvas.width = 0; canvas.height = 0;
    }
    pdf.save('acreditacions_ce_europa.pdf');
    toast('PDF generat correctament', 'success');
  } finally {
    root.innerHTML = '';
    if (btn) { btn.disabled = false; btn.textContent = 'Generar PDF'; }
  }
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
          <div style="display:flex;gap:6px;flex-shrink:0;align-items:center">
            ${!isActive ? `<button class="btn btn-ghost btn-sm" onclick="handleSwitchTeam('${t.id}')">Accedir →</button>` : ''}
            ${isAdmin ? `<button class="btn-icon" title="Membres" onclick="openTeamMembersModal('${t.id}')">${ico('users')}</button>` : ''}
            <button class="btn-icon" title="Editar" onclick="openEditTeamModal('${t.id}')">${ico('edit')}</button>
            ${!isActive ? `<button class="btn-icon" title="Suprimir" onclick="deleteTeam('${t.id}')" style="color:var(--red)">${ico('trash')}</button>` : ''}
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
  // Oferir immediatament convidar un entrenador
  openInviteToTeamModal(team.id, 'coach', 'Convidar Entrenador/a');
}

function openEditTeamModal(teamId) {
  const team = DB.teams().find(t => t.id === teamId);
  if (!team) return;
  document.getElementById('team-modal-container').innerHTML = `
  <div class="modal-overlay" id="edit-team-modal">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">Editar Equip</div>
        <button class="btn-icon" onclick="closeModal('edit-team-modal')">${ico('close')}</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Nom de l'equip *</label>
          <input class="form-input" id="edit-team-name" value="${team.name}">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Temporada</label>
            <input class="form-input" id="edit-team-season" value="${team.season||''}" placeholder="2025-26">
          </div>
          <div class="form-group">
            <label class="form-label">Descripció</label>
            <input class="form-input" id="edit-team-desc" value="${team.description||''}" placeholder="Opcional">
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="closeModal('edit-team-modal')">Cancel·lar</button>
        <button class="btn btn-primary" onclick="saveEditTeam('${teamId}')">${ico('check')} Desar canvis</button>
      </div>
    </div>
  </div>`;
}

async function saveEditTeam(teamId) {
  const name   = document.getElementById('edit-team-name').value.trim();
  const season = document.getElementById('edit-team-season').value.trim();
  const desc   = document.getElementById('edit-team-desc').value.trim();
  if (!name) { toast('El nom és obligatori', 'error'); return; }

  const teams = _cache.teams;
  const idx   = teams.findIndex(t => t.id === teamId);
  if (idx !== -1) {
    teams[idx] = { ...teams[idx], name, season, description: desc };
    if (USE_SUPABASE) {
      await DB.sb().from('teams').update({ name, season, description: desc }).eq('id', teamId);
    } else {
      lsSet('eh_teams', teams);
    }
    if (currentTeam?.id === teamId) currentTeam = teams[idx];
  }
  closeModal('edit-team-modal');
  toast('Equip actualitzat', 'success');
  navigate('squad');
}

async function deleteTeam(teamId) {
  const team = DB.teams().find(t => t.id === teamId);
  if (!team) return;
  if (!confirm(`Suprimir l'equip "${team.name}"?\n\nAixò eliminarà l'equip i tots els seus membres. Les dades (jugadors, entrenaments, etc.) quedaran a la base de dades però sense equip assignat.`)) return;

  if (USE_SUPABASE) {
    await DB.sb().from('team_members').delete().eq('team_id', teamId);
    await DB.sb().from('teams').delete().eq('id', teamId);
  }
  _cache.teams       = _cache.teams.filter(t => t.id !== teamId);
  _cache.teamMembers = _cache.teamMembers.filter(m => m.team_id !== teamId);
  lsSet('eh_teams',   _cache.teams);
  lsSet('eh_members', _cache.teamMembers);

  toast(`Equip "${team.name}" eliminat`, 'success');
  navigate('squad');
}

function openTeamMembersModal(teamId) {
  const team      = DB.teams().find(t => t.id === teamId);
  const members   = DB.teamMembers().filter(m => m.team_id === teamId);
  const users     = DB.users();
  const teamUsers = members.map(m => users.find(u => u.id === m.user_id)).filter(Boolean);

  // Invitacions pendents per a aquest equip
  const pending = (DB.invitations ? DB.invitations() : [])
    .filter(i => i.team_id === teamId && i.status === 'pending');

  const canInviteCoach = ['administrator','sporting_director'].includes(currentUser.role);

  document.getElementById('team-modal-container').innerHTML = `
  <div class="modal-overlay" id="team-members-modal">
    <div class="modal modal-lg">
      <div class="modal-header">
        <div class="modal-title">Membres — ${team?.name||''}</div>
        <button class="btn-icon" onclick="closeModal('team-members-modal')">${ico('close')}</button>
      </div>
      <div class="modal-body">

        <!-- Membres actuals -->
        <div style="font-size:.67rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--text3);margin-bottom:10px">Membres actuals</div>
        <div style="display:flex;flex-direction:column;gap:4px;margin-bottom:20px">
          ${teamUsers.length ? teamUsers.map(u => `
          <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--bg2);border:1px solid var(--border);border-radius:10px">
            <div class="avatar">${u.avatar}</div>
            <div style="flex:1">
              <div style="font-size:.8125rem;font-weight:600">${u.name}</div>
              <div style="font-size:.7rem;color:var(--text3)">${DEFAULT_ROLES[u.role]?.label||u.role}</div>
            </div>
            <button class="btn btn-danger btn-sm" onclick="removeMember('${teamId}','${u.id}')">${ico('trash')}</button>
          </div>`).join('') : `<div style="color:var(--text3);font-size:.82rem;padding:8px 0">Cap membre actiu encara.</div>`}
        </div>

        <!-- Invitacions pendents -->
        ${pending.length ? `
        <div style="font-size:.67rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--text3);margin-bottom:10px">Invitacions pendents</div>
        <div style="display:flex;flex-direction:column;gap:4px;margin-bottom:20px">
          ${pending.map(i => `
          <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--amber-dim);border:1px solid rgba(255,159,10,.2);border-radius:10px">
            <div class="avatar" style="background:var(--amber)">${i.player_name[0]}${i.player_surname[0]}</div>
            <div style="flex:1">
              <div style="font-size:.8125rem;font-weight:600">${i.player_name} ${i.player_surname}</div>
              <div style="font-size:.7rem;color:var(--text3)">${i.email} · ${DEFAULT_ROLES[i.role]?.label||i.role} · Pendent</div>
            </div>
            <button class="btn btn-ghost btn-sm" onclick="copyInviteLink('${i.token}')">Copiar enllaç</button>
          </div>`).join('')}
        </div>` : ''}

        <!-- Afegir entrenador -->
        ${canInviteCoach ? `
        <div style="font-size:.67rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--text3);margin-bottom:10px">Afegir entrenador/a</div>

        <!-- Opció A: usuari existent -->
        ${(() => {
          const coaches = DB.users().filter(u =>
            ['coach','sporting_director','administrator'].includes(u.role) &&
            !members.some(m => m.user_id === u.id)
          );
          return coaches.length ? `
          <div style="display:flex;gap:8px;margin-bottom:8px">
            <select class="form-select" id="add-coach-select" style="flex:1">
              ${coaches.map(u => `<option value="${u.id}">${u.name} — ${DEFAULT_ROLES[u.role]?.label||u.role}</option>`).join('')}
            </select>
            <button class="btn btn-primary" onclick="addExistingCoach('${teamId}')">${ico('plus')} Afegir</button>
          </div>
          <div style="text-align:center;font-size:.72rem;color:var(--text3);margin-bottom:8px">— o bé —</div>` : '';
        })()}

        <!-- Opció B: invitar per email -->
        <button class="btn btn-ghost" style="width:100%" onclick="closeModal('team-members-modal');openInviteToTeamModal('${teamId}','coach','Convidar Entrenador/a')">${ico('mail')} Convidar per email (nou al club)</button>
        ` : ''}

      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="closeModal('team-members-modal')">Tancar</button>
      </div>
    </div>
  </div>`;
}

async function addExistingCoach(teamId) {
  const userId = document.getElementById('add-coach-select')?.value;
  if (!userId) return;
  await DB.addTeamMember(teamId, userId);
  toast('Entrenador/a afegit a l\'equip', 'success');
  openTeamMembersModal(teamId);
}

function copyInviteLink(token) {
  const url = `${SITE_URL}/#invite-${token}`;
  navigator.clipboard.writeText(url).then(() => toast('Enllaç copiat!', 'success'));
}

// Funció eliminada: addMember per select → substituïda per invitació

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

// ── INVITAR A UN EQUIP ─────────────────────────────────────

function openInviteToTeamModal(teamId, role, title) {
  const team = DB.teams().find(t => t.id === teamId);
  const roleLabel = DEFAULT_ROLES[role]?.label || role;
  let container = document.getElementById('team-modal-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'team-modal-container';
    document.body.appendChild(container);
  }
  container.innerHTML = `
  <div class="modal-overlay" id="invite-team-modal">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">${title || 'Convidar'}</div>
        <button class="btn-icon" onclick="closeModal('invite-team-modal')">${ico('close')}</button>
      </div>
      <div class="modal-body">
        <p style="font-size:.82rem;color:var(--text2)">
          Envia una invitació per correu electrònic a un/a <strong>${roleLabel}</strong> per a l'equip <strong>${team?.name||''}</strong>.
          Podrà crear el seu compte i accedir directament a l'equip.
        </p>
        <div id="ite-error" style="display:none;padding:8px 12px;background:var(--red-dim);border-radius:8px;color:var(--red);font-size:.78rem"></div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Nom *</label>
            <input class="form-input" id="ite-name" placeholder="Jordi">
          </div>
          <div class="form-group">
            <label class="form-label">Cognom *</label>
            <input class="form-input" id="ite-surname" placeholder="Vilà">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Email *</label>
          <input class="form-input" id="ite-email" type="email" placeholder="entrenador@email.com">
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="closeModal('invite-team-modal');navigate('teams')">Ara no</button>
        <button class="btn btn-primary" id="ite-send-btn" onclick="saveTeamInvite('${teamId}','${role}')">${ico('mail')} Enviar invitació</button>
      </div>
    </div>
  </div>`;
}

async function saveTeamInvite(teamId, role) {
  const name    = document.getElementById('ite-name').value.trim();
  const surname = document.getElementById('ite-surname').value.trim();
  const email   = document.getElementById('ite-email').value.trim();
  const errEl   = document.getElementById('ite-error');
  const showErr = (m) => { errEl.textContent = m; errEl.style.display = 'block'; };

  if (!name)    return showErr('El nom és obligatori');
  if (!surname) return showErr('El cognom és obligatori');
  if (!email)   return showErr('L\'email és obligatori');

  const btn = document.getElementById('ite-send-btn');
  btn.disabled = true; btn.textContent = 'Enviant…';

  try {
    const inv = await DB.createInvitation({
      teamId, role,
      playerName: name,
      playerSurname: surname,
      email,
    });
    await sendInvitationEmail(inv);
    closeModal('invite-team-modal');

    // Mostrar resultat amb l'enllaç
    const inviteUrl = `${SITE_URL}/#invite-${inv.token}`;
    const roleLabel = DEFAULT_ROLES[role]?.label || role;
    const div = document.createElement('div');
    div.innerHTML = `
    <div class="modal-overlay" id="invite-result-modal">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">Invitació enviada</div>
          <button class="btn-icon" onclick="closeModal('invite-result-modal');navigate('teams')">${ico('close')}</button>
        </div>
        <div class="modal-body">
          <div style="padding:12px 14px;background:var(--emerald-dim);border:1px solid rgba(48,209,88,.3);border-radius:10px;font-size:.8125rem;color:var(--emerald);margin-bottom:12px">
            ${ico('check')} Invitació generada per a <strong>${name} ${surname}</strong> com a ${roleLabel}.
          </div>
          <div class="form-group">
            <label class="form-label">Enllaç d'activació (vàlid 7 dies)</label>
            <div style="display:flex;gap:6px">
              <input class="form-input" value="${inviteUrl}" readonly style="font-size:.7rem;font-family:var(--font-mono)">
              <button class="btn btn-secondary btn-sm" onclick="navigator.clipboard.writeText('${inviteUrl}').then(()=>toast('Copiat!','success'))">Copiar</button>
            </div>
          </div>
          <p style="font-size:.75rem;color:var(--text3)">Si no arriba el correu, comparteix l'enllaç directament amb la persona convidada.</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" onclick="closeModal('invite-result-modal');navigate('teams')">Entesos</button>
        </div>
      </div>
    </div>`;
    document.body.appendChild(div);
  } catch(e) {
    showErr('Error: ' + e.message);
    btn.disabled = false; btn.innerHTML = ico('mail') + ' Enviar invitació';
  }
}

// ── ADMIN: USERS ───────────────────────────────────────────

function renderAdminUsers() {
  const users = DB.users();
  return `
  <div class="page-header">
    <div class="page-header-left">
      <div class="page-title">Usuaris</div>
      <div class="page-subtitle">${users.length} usuaris al sistema</div>
    </div>
    <div class="page-actions">
      <input class="form-input" type="search" id="user-search"
        placeholder="Cercar per nom, usuari o rol…" style="width:220px"
        oninput="filterAdminUsers(this.value)">
      <button class="btn btn-primary" onclick="openUserModal()">${ico('plus')} Nou Usuari</button>
    </div>
  </div>
  <div class="card">
    <div class="table-wrap">
      <table>
        <thead><tr><th>Nom</th><th>Usuari</th><th>Rol</th><th>Contrasenya</th><th></th></tr></thead>
        <tbody id="users-tbody">
          ${users.map(u => _userRow(u)).join('')}
        </tbody>
      </table>
    </div>
    <div id="users-empty" style="display:none;padding:24px;text-align:center;color:var(--text3);font-size:.8125rem">
      Cap usuari coincideix amb la cerca.
    </div>
  </div>
  <div id="user-modal-container"></div>`;
}

function _userRow(u) {
  return `
  <tr data-search="${(u.name + ' ' + u.username + ' ' + (DEFAULT_ROLES[u.role]?.label||u.role)).toLowerCase()}">
    <td><div style="display:flex;align-items:center;gap:9px">
      <div class="avatar sm">${u.avatar}</div>
      <span style="color:var(--text);font-weight:500">${u.name}</span>
    </div></td>
    <td><code style="font-family:var(--font-mono);font-size:.78rem;color:var(--brand)">${u.username}</code></td>
    <td>${roleBadge(u.role)}</td>
    <td><code style="font-family:var(--font-mono);font-size:.72rem;color:var(--text3)">${u.password}</code></td>
    <td><div style="display:flex;gap:4px">
      <button class="btn-icon btn-sm" title="Editar" onclick="openUserModal('${u.id}')">${ico('edit')}</button>
      <button class="btn-icon btn-sm" title="Permisos individuals" onclick="openUserPermsModal('${u.id}')">${ico('shield')}</button>
      ${u.id !== currentUser.id ? `<button class="btn-icon btn-sm" onclick="deleteUser('${u.id}')" style="color:var(--brand)">${ico('trash')}</button>` : ''}
    </div></td>
  </tr>`;
}

function filterAdminUsers(query) {
  const q     = query.toLowerCase().trim();
  const rows  = document.querySelectorAll('#users-tbody tr');
  let visible = 0;
  rows.forEach(row => {
    const match = !q || row.dataset.search.includes(q);
    row.style.display = match ? '' : 'none';
    if (match) visible++;
  });
  const emptyEl = document.getElementById('users-empty');
  if (emptyEl) emptyEl.style.display = visible === 0 ? 'block' : 'none';
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

// ── ADMIN DASHBOARD ─────────────────────────────────────────

function renderAdminDashboard() {
  const users = DB.users();
  const perms = DB.permissions();
  const PERM_KEYS = [
    {key:'squad',label:'Plantilla'},{key:'tactical',label:'Pissarra'},{key:'training',label:'Entrenaments'},
    {key:'wellness',label:'Wellness'},{key:'selection',label:'Convocatòria'},{key:'scouting',label:'Scouting'},
    {key:'communication',label:'Comunicació'},{key:'office',label:'Oficina'},{key:'admin',label:'Admin'},
  ];
  return `
  <div class="page-header" style="margin-bottom:20px">
    <div class="page-header-left">
      <div class="page-title">Tauler Admin</div>
      <div class="page-subtitle">Gestió d'usuaris i permisos en un sol lloc</div>
    </div>
    <div class="page-actions">
      <button class="btn btn-primary" onclick="openUserModal()">${ico('plus')} Nou Usuari</button>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:start">

    <div class="card" style="padding:0;overflow:hidden">
      <div style="padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">
        <div style="font-size:.68rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--text3)">Perfils — ${users.length} usuaris</div>
        <button class="btn btn-ghost btn-sm" onclick="navigate('admin_users')">Veure tot →</button>
      </div>
      <div style="max-height:340px;overflow-y:auto">
        ${users.map(u => `
        <div style="display:flex;align-items:center;gap:10px;padding:10px 20px;border-bottom:1px solid var(--border)">
          <div class="avatar sm">${u.avatar}</div>
          <div style="flex:1;min-width:0">
            <div style="font-size:.8rem;font-weight:600;color:var(--text)">${u.name}</div>
            <div style="font-size:.68rem;color:var(--text3)">${DEFAULT_ROLES[u.role]?.label||u.role}</div>
          </div>
          <div style="display:flex;gap:4px">
            <button class="btn-icon" style="padding:5px" title="Editar" onclick="openUserModal('${u.id}')">${ico('edit')}</button>
            <button class="btn-icon" style="padding:5px" title="Permisos" onclick="openUserPermsModal('${u.id}')">${ico('shield')}</button>
          </div>
        </div>`).join('')}
      </div>
      <div id="user-modal-container"></div>
    </div>

    <div class="card" style="padding:0;overflow:hidden">
      <div style="padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">
        <div style="font-size:.68rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--text3)">Permisos per Rol</div>
        <button class="btn btn-ghost btn-sm" onclick="navigate('admin_perms')">Veure tot →</button>
      </div>
      <div style="overflow-x:auto;max-height:340px">
        <table style="min-width:100%;font-size:.72rem">
          <thead><tr>
            <th style="padding:8px 14px;position:sticky;top:0;background:var(--bg2)">Mòdul</th>
            ${Object.keys(DEFAULT_ROLES).map(r=>`<th style="text-align:center;padding:8px 6px;position:sticky;top:0;background:var(--bg2);font-size:.6rem">${DEFAULT_ROLES[r].label.split(' ')[0]}</th>`).join('')}
          </tr></thead>
          <tbody>
            ${PERM_KEYS.map(({key,label})=>`
            <tr>
              <td style="padding:7px 14px;color:var(--text2);font-weight:500">${label}</td>
              ${Object.keys(DEFAULT_ROLES).map(role=>{
                const checked = !!(perms[role]?.[key]);
                return `<td style="text-align:center;padding:7px 4px"><div style="width:8px;height:8px;border-radius:50%;margin:0 auto;background:${checked?'var(--brand)':'var(--border2)'};${checked?'box-shadow:0 0 4px var(--brand-glow)':''}"></div></td>`;
              }).join('')}
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>

  </div>`;
}

// ── PER-USER PERMISSIONS ─────────────────────────────────────

function openUserPermsModal(userId) {
  const user      = DB.users().find(u => u.id === userId);
  if (!user) return;
  const effective = getUserEffectivePerms(userId);
  const overrides = (lsGet('eh_user_perms') || {})[userId] || {};
  const rolePerms = DB.permissions()[user.role] || {};

  const PERM_KEYS = [
    {key:'home',label:'Inici'},{key:'squad',label:'Plantilla'},{key:'tactical',label:'Pissarra'},
    {key:'training',label:'Entrenaments'},{key:'veo',label:'VEO'},{key:'tasks',label:'Tasques'},
    {key:'wellness',label:'Wellness'},{key:'selection',label:'Convocatòria'},
    {key:'sporting2',label:'Àrea Esp. 2'},{key:'scouting',label:'Scouting'},
    {key:'communication',label:'Comunicació'},{key:'office',label:'Oficina'},
    {key:'members',label:'Socis'},{key:'admin',label:'Administració'},{key:'teams',label:'Equips'},
  ];

  const container = document.getElementById('user-modal-container') || document.body;
  container.insertAdjacentHTML('beforeend', `
  <div class="modal-overlay" id="user-perms-modal">
    <div class="modal modal-lg">
      <div class="modal-header">
        <div style="display:flex;align-items:center;gap:10px;flex:1">
          <div class="avatar">${user.avatar}</div>
          <div>
            <div class="modal-title" style="font-size:1.2rem">${user.name}</div>
            <div style="font-size:.72rem;color:var(--text3)">${DEFAULT_ROLES[user.role]?.label||user.role} — permisos individuals</div>
          </div>
        </div>
        <button class="btn-icon" onclick="closeModal('user-perms-modal')">${ico('close')}</button>
      </div>
      <div class="modal-body">
        <div style="font-size:.72rem;color:var(--text3);margin-bottom:14px;padding:10px 12px;background:var(--bg2);border-radius:8px;border:1px solid var(--border)">
          Els permisos en <strong>blau</strong> provenen del rol. Els que modifiques aquí s'apliquen <strong>individualment</strong> i sobreescriuen el rol.
          <button class="btn btn-ghost btn-sm" style="margin-left:auto;display:block;margin-top:6px" onclick="resetUserPerms('${userId}')">Restablir al rol per defecte</button>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
          ${PERM_KEYS.map(({key,label}) => {
            const fromRole    = !!rolePerms[key];
            const isOverriden = overrides.hasOwnProperty(key);
            const current     = isOverriden ? overrides[key] : fromRole;
            return `
            <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;border-radius:8px;background:var(--bg2);border:1px solid ${isOverriden?'var(--brand)':'var(--border)'}">
              <div>
                <div style="font-size:.8rem;font-weight:600">${label}</div>
                <div style="font-size:.65rem;color:var(--text3)">${isOverriden?'Sobreescrit':'Del rol'}</div>
              </div>
              <div class="toggle ${current?'on':''}" onclick="toggleUserPerm('${userId}','${key}',this)"></div>
            </div>`;
          }).join('')}
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="closeModal('user-perms-modal')">Tancar</button>
      </div>
    </div>
  </div>`);
}

function toggleUserPerm(userId, perm, el) {
  const newVal = !el.classList.contains('on');
  el.classList.toggle('on', newVal);
  saveUserPerm(userId, perm, newVal);
  const row = el.closest('[style*="border:1px"]');
  if (row) {
    row.style.border = `1px solid var(--brand)`;
    row.querySelector('[style*="font-size:.65rem"]').textContent = 'Sobreescrit';
  }
  toast(`Permís "${perm}" ${newVal?'activat':'desactivat'} per a ${DB.users().find(u=>u.id===userId)?.name}`, 'success');
}

function resetUserPerms(userId) {
  const all = lsGet('eh_user_perms') || {};
  delete all[userId];
  lsSet('eh_user_perms', all);
  closeModal('user-perms-modal');
  toast('Permisos restablerts al rol per defecte', 'success');
}

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
