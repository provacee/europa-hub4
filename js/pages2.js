/* ============================================================
   EUROPA HUB v2 — Pages: Training · VEO · Tasks · Wellness · Selection
   ============================================================ */

// ── TRAINING ───────────────────────────────────────────────

function renderTraining() {
  const trainings = DB.trainings();
  return `
  <div class="page-header">
    <div class="page-header-left">
      <div class="page-title">Entrenaments</div>
      <div class="page-subtitle">${trainings.length} sessions creades</div>
    </div>
    <div class="page-actions">
      <button class="btn btn-primary" onclick="openTrainingModal()">${ico('plus')} Nova Sessió</button>
    </div>
  </div>
  <div style="display:flex;flex-direction:column;gap:14px">
    ${trainings.length===0
      ? `<div class="empty-state"><h3>Cap sessió creada</h3></div>`
      : trainings.map(t=>renderTrainingCard(t, true)).join('')}
  </div>
  <div id="training-modal-container"></div>
  `;
}

function renderTrainingCard(t, canEdit=false) {
  const teamColors = { all:'badge-blue', A:'badge-red', B:'badge-green', C:'badge-yellow' };
  const teamLabels = { all:'Tot l\'equip', A:'Equip A', B:'Equip B', C:'Equip C' };
  return `
  <div class="card">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
      <div style="flex:1">
        <div style="font-weight:600;font-size:.9375rem">${t.title}</div>
        <div style="font-size:.72rem;color:var(--text3)">${formatDate(t.date)}</div>
      </div>
      ${canEdit ? `
      <button class="btn btn-ghost btn-sm" onclick="openTrainingModal('${t.id}')">${ico('edit')} Editar</button>
      <button class="btn btn-danger btn-sm" onclick="deleteTraining('${t.id}')">${ico('trash')}</button>
      ` : ''}
    </div>
    <div style="display:flex;flex-direction:column;gap:6px">
      ${t.tasks.map((task,i) => `
      <div style="display:flex;align-items:center;gap:10px;padding:9px 12px;background:var(--bg3);border-radius:6px;border:1px solid var(--border)">
        <div style="width:22px;height:22px;background:var(--brand-dim);color:var(--brand);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.65rem;font-weight:700;flex-shrink:0">${i+1}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:.8125rem;font-weight:500">${task.name}</div>
          ${task.notes ? `<div style="font-size:.7rem;color:var(--text3)">${task.notes}</div>` : ''}
        </div>
        <span class="badge ${teamColors[task.team||'all']}">${teamLabels[task.team||'all']}</span>
        <div style="font-size:.75rem;color:var(--text2);flex-shrink:0;font-weight:500">${task.duration} min</div>
      </div>
      `).join('')}
    </div>
    <div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border);display:flex;align-items:center;gap:8px;font-size:.75rem;color:var(--text3)">
      Durada total: <strong style="color:var(--text)">${t.tasks.reduce((s,tk)=>s+tk.duration,0)} min</strong>
    </div>
  </div>
  `;
}

function openTrainingModal(id=null) {
  const trainings = DB.trainings();
  const t = id ? trainings.find(tr=>tr.id===id) : null;
  const tasks = t ? t.tasks : [{ name:'', duration:15, notes:'', team:'all' }];

  document.getElementById('training-modal-container').innerHTML = `
  <div class="modal-overlay" id="training-modal">
    <div class="modal modal-lg">
      <div class="modal-header">
        <div class="modal-title">${t ? 'Editar Sessió' : 'Nova Sessió'}</div>
        <button class="btn-icon" onclick="closeModal('training-modal')">${ico('close')}</button>
      </div>
      <div class="modal-body">
        <div class="form-row">
          <div class="form-group"><label class="form-label">Títol</label><input class="form-input" id="tr-title" value="${t?.title||''}"></div>
          <div class="form-group"><label class="form-label">Data</label><input class="form-input" type="date" id="tr-date" value="${t?.date||new Date().toISOString().split('T')[0]}"></div>
        </div>
        <div>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
            <span style="font-size:.7rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--text2)">Tasques</span>
            <button class="btn btn-ghost btn-sm" type="button" onclick="addTrainingTask()">${ico('plus')} Afegir</button>
          </div>
          <div id="training-tasks">
            ${tasks.map((task,i)=>renderTrainingTaskRow(task,i)).join('')}
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="closeModal('training-modal')">Cancel·lar</button>
        <button class="btn btn-primary" onclick="saveTraining('${id||''}')">Desar</button>
      </div>
    </div>
  </div>`;
}

function renderTrainingTaskRow(task, i) {
  const teams = ['all','A','B','C'];
  const teamLabels = { all:"Tot l'equip", A:'Equip A', B:'Equip B', C:'Equip C' };
  return `
  <div class="training-task-row" data-idx="${i}" style="display:grid;grid-template-columns:1fr 70px 1fr 110px auto;gap:6px;margin-bottom:6px;align-items:center">
    <input class="form-input" placeholder="Nom tasca" value="${task.name||''}" data-field="name">
    <input class="form-input" type="number" placeholder="min" value="${task.duration||15}" data-field="duration" style="text-align:center">
    <input class="form-input" placeholder="Notes" value="${task.notes||''}" data-field="notes">
    <select class="form-select" data-field="team">
      ${teams.map(tm=>`<option value="${tm}" ${(task.team||'all')===tm?'selected':''}>${teamLabels[tm]}</option>`).join('')}
    </select>
    <button class="btn-icon btn-sm" onclick="removeTrainingTask(${i})" style="color:var(--brand)">${ico('trash')}</button>
  </div>`;
}

function addTrainingTask() {
  const container = document.getElementById('training-tasks');
  const rows = container.querySelectorAll('.training-task-row');
  const div = document.createElement('div');
  div.innerHTML = renderTrainingTaskRow({name:'',duration:15,notes:'',team:'all'}, rows.length);
  container.appendChild(div.firstElementChild);
}

function removeTrainingTask(idx) {
  const rows = document.querySelectorAll('.training-task-row');
  if (rows.length <= 1) return;
  rows[idx]?.remove();
}

function saveTraining(id) {
  const title = document.getElementById('tr-title').value.trim();
  const date  = document.getElementById('tr-date').value;
  if (!title) { toast('Títol obligatori','error'); return; }
  const rows = document.querySelectorAll('.training-task-row');
  const tasks = Array.from(rows).map(row => ({
    name:     row.querySelector('[data-field="name"]').value.trim(),
    duration: parseInt(row.querySelector('[data-field="duration"]').value)||0,
    notes:    row.querySelector('[data-field="notes"]').value.trim(),
    team:     row.querySelector('[data-field="team"]').value,
  })).filter(t=>t.name);
  const data = { title, date, tasks };
  const trainings = DB.trainings();
  if (id) { const i=trainings.findIndex(t=>t.id===id); if(i!==-1) trainings[i]={...trainings[i],...data}; }
  else trainings.unshift({ id:uid(),...data });
  DB.saveTrainings(trainings);
  closeModal('training-modal');
  toast('Sessió desada','success');
  navigate('training');
}

function deleteTraining(id) {
  if (!confirm('Eliminar sessió?')) return;
  DB.saveTrainings(DB.trainings().filter(t=>t.id!==id));
  toast('Sessió eliminada','success');
  navigate('training');
}

function renderPlayerTraining() {
  const trainings = DB.trainings();
  return `
  <div class="page-header">
    <div class="page-header-left"><div class="page-title">Entrenaments</div><div class="page-subtitle">Sessions assignades</div></div>
  </div>
  <div style="display:flex;flex-direction:column;gap:14px">
    ${trainings.map(t=>renderTrainingCard(t, false)).join('')}
  </div>`;
}

// ── VEO ────────────────────────────────────────────────────

function renderVEO() {
  const videos = DB.videos();
  const cats = ['all','attack','defence','transition','set_pieces'];
  const catLabels = { all:'Tots', attack:'Atac', defence:'Defensa', transition:'Transició', set_pieces:'Pilota aturada' };
  return `
  <div class="page-header">
    <div class="page-header-left"><div class="page-title">Anàlisi VEO</div><div class="page-subtitle">Biblioteca de vídeos tàctics</div></div>
    <div class="page-actions"><button class="btn btn-primary" onclick="openVideoModal()">${ico('plus')} Afegir Vídeo</button></div>
  </div>
  <div class="chips" id="veo-filter" style="margin-bottom:18px">
    ${cats.map(c=>`<div class="chip ${c==='all'?'active':''}" data-cat="${c}">${catLabels[c]}</div>`).join('')}
  </div>
  <div class="grid grid-auto" id="veo-grid">
    ${videos.map(v=>renderVideoCard(v, true)).join('')}
  </div>
  <div id="video-modal-container"></div>`;
}

// Emmagatzema Object URLs de fitxers locals (memòria de sessió)
if (!window._veoFiles) window._veoFiles = {};

function renderVideoCard(v, canEdit=false) {
  const catColors = { attack:'var(--brand)', defence:'var(--brand)', transition:'var(--brand)', set_pieces:'var(--brand)' };
  const catLabels = { attack:'Atac', defence:'Defensa', transition:'Transició', set_pieces:'Pilota aturada' };
  const localUrl  = window._veoFiles[v.id];
  const hasUrl    = localUrl || v.url;

  const thumb = localUrl
    ? `<video src="${localUrl}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;" preload="metadata" muted></video>
       <div style="position:absolute;inset:0;background:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center">
         <div class="play-btn">${ico('play')}</div>
       </div>`
    : `<div style="position:absolute;inset:0;background:linear-gradient(135deg,var(--brand-dim),var(--bg3));display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px">
         ${v.isLocal && !localUrl
           ? `<div style="font-size:.65rem;color:var(--text3);text-align:center;padding:0 12px">Fitxer local<br>no disponible</div>
              <label class="btn btn-ghost btn-sm" style="cursor:pointer;font-size:.65rem">
                Re-carregar<input type="file" accept="video/*" style="display:none" onchange="reloadLocalVideo('${v.id}',this)">
              </label>`
           : `<div class="play-btn">${ico('play')}</div>`
         }
       </div>`;

  return `
  <div class="video-card" data-cat="${v.category}" ${hasUrl ? `onclick="playVideo('${v.id}')" style="cursor:pointer"` : ''}>
    <div class="video-thumb">${thumb}</div>
    <div class="video-info">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px">
        <div class="video-title">${v.title}</div>
        ${canEdit ? `<button class="btn-icon btn-sm" onclick="event.stopPropagation();deleteVideo('${v.id}')" style="color:var(--brand)">${ico('trash')}</button>` : ''}
      </div>
      <div class="video-meta">${v.description||''}</div>
      <div style="margin-top:7px;display:flex;align-items:center;justify-content:space-between">
        <div style="display:flex;align-items:center;gap:5px">
          <span class="badge badge-blue">${catLabels[v.category]||v.category}</span>
          ${v.isLocal ? `<span class="badge" style="background:rgba(10,132,255,.1);color:var(--brand);font-size:.58rem">LOCAL</span>` : ''}
        </div>
        <span style="font-size:.68rem;color:var(--text3)">${formatDate(v.date)}</span>
      </div>
    </div>
  </div>`;
}

function playVideo(id) {
  const v = DB.videos().find(x => x.id === id);
  if (!v) return;
  const url = window._veoFiles[id] || v.url;
  if (!url) return;

  // Elimina modal anterior si existeix
  document.getElementById('veo-player-modal')?.remove();

  const isLocal = !!window._veoFiles[id];
  document.body.insertAdjacentHTML('beforeend', `
  <div class="modal-overlay" id="veo-player-modal" onclick="if(event.target===this){document.getElementById('veo-player-modal').remove()}">
    <div class="modal modal-lg" style="padding:0;background:#000;max-width:860px;border-radius:16px;overflow:hidden">
      <div style="position:relative">
        ${isLocal
          ? `<video src="${url}" controls autoplay style="width:100%;max-height:500px;display:block;background:#000"></video>`
          : `<div style="position:relative;padding-bottom:56.25%;height:0">
               <iframe src="${embedUrl(url)}" style="position:absolute;inset:0;width:100%;height:100%;border:none" allowfullscreen></iframe>
             </div>`
        }
        <button onclick="document.getElementById('veo-player-modal').remove()" style="position:absolute;top:10px;right:10px;background:rgba(0,0,0,.6);border:none;color:#fff;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:1.1rem;display:flex;align-items:center;justify-content:center">×</button>
      </div>
      <div style="padding:16px 20px;background:var(--bg)">
        <div style="font-weight:700;font-size:.9rem;color:var(--text)">${v.title}</div>
        ${v.description ? `<div style="font-size:.75rem;color:var(--text3);margin-top:4px">${v.description}</div>` : ''}
      </div>
    </div>
  </div>`);
}

function embedUrl(url) {
  if (!url) return '';
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (ytMatch) return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  return url;
}

function openVideoModal() {
  document.getElementById('video-modal-container').innerHTML = `
  <div class="modal-overlay" id="video-modal" onclick="if(event.target===this)closeModal('video-modal')">
    <div class="modal" style="max-width:480px">
      <div class="modal-header">
        <div class="modal-title">Afegir Vídeo</div>
        <button class="btn-icon" onclick="closeModal('video-modal')">${ico('close')}</button>
      </div>
      <div class="modal-body" style="display:flex;flex-direction:column;gap:4px">

        <!-- Tabs font -->
        <div style="display:flex;gap:0;border-bottom:1px solid var(--border);margin-bottom:14px">
          <button id="vtab-local" onclick="switchVTab('local')" style="flex:1;padding:8px;font-size:.78rem;font-weight:600;border:none;background:none;cursor:pointer;color:var(--brand);border-bottom:2px solid var(--brand);transition:all .18s">
            ${ico('plus')} Des de l'ordinador
          </button>
          <button id="vtab-url" onclick="switchVTab('url')" style="flex:1;padding:8px;font-size:.78rem;font-weight:600;border:none;background:none;cursor:pointer;color:var(--text3);border-bottom:2px solid transparent;transition:all .18s">
            ${ico('arrow')} Per URL
          </button>
        </div>

        <!-- Font: fitxer local -->
        <div id="vsrc-local">
          <div style="border:2px dashed var(--border2);border-radius:12px;padding:24px;text-align:center;cursor:pointer;transition:border-color .18s" id="vdrop-zone" onclick="document.getElementById('v-file').click()" ondragover="event.preventDefault();this.style.borderColor='var(--brand)'" ondragleave="this.style.borderColor=''" ondrop="handleVDrop(event)">
            <div id="vdrop-icon" style="font-size:2rem;margin-bottom:8px">🎬</div>
            <div id="vdrop-text" style="font-size:.8rem;font-weight:600;color:var(--text2)">Arrossega un vídeo aquí</div>
            <div style="font-size:.7rem;color:var(--text3);margin-top:4px">o clica per seleccionar</div>
            <div style="font-size:.65rem;color:var(--text3);margin-top:6px">MP4, MOV, AVI, MKV — màx. recomanat 500 MB</div>
            <input type="file" id="v-file" accept="video/*" style="display:none" onchange="handleVFile(this)">
          </div>
          <div id="v-file-preview" style="display:none;margin-top:12px"></div>
        </div>

        <!-- Font: URL -->
        <div id="vsrc-url" style="display:none">
          <div class="form-group"><label class="form-label">URL del vídeo (YouTube, Vimeo, directe…)</label><input class="form-input" id="v-url" placeholder="https://youtube.com/watch?v=..."></div>
        </div>

        <div class="form-group"><label class="form-label">Títol</label><input class="form-input" id="v-title"></div>
        <div class="form-group"><label class="form-label">Categoria</label>
          <select class="form-select" id="v-cat">
            <option value="attack">Atac</option>
            <option value="defence">Defensa</option>
            <option value="transition">Transició</option>
            <option value="set_pieces">Pilota Aturada</option>
          </select>
        </div>
        <div class="form-group"><label class="form-label">Descripció (opcional)</label><textarea class="form-textarea" id="v-desc" style="min-height:54px"></textarea></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="closeModal('video-modal')">Cancel·lar</button>
        <button class="btn btn-primary" onclick="saveVideo()">Afegir</button>
      </div>
    </div>
  </div>`;
}

function switchVTab(tab) {
  const isLocal = tab === 'local';
  document.getElementById('vsrc-local').style.display = isLocal ? '' : 'none';
  document.getElementById('vsrc-url').style.display   = isLocal ? 'none' : '';
  document.getElementById('vtab-local').style.color        = isLocal ? 'var(--brand)' : 'var(--text3)';
  document.getElementById('vtab-local').style.borderBottomColor = isLocal ? 'var(--brand)' : 'transparent';
  document.getElementById('vtab-url').style.color          = isLocal ? 'var(--text3)' : 'var(--brand)';
  document.getElementById('vtab-url').style.borderBottomColor   = isLocal ? 'transparent' : 'var(--brand)';
}

function handleVDrop(e) {
  e.preventDefault();
  document.getElementById('vdrop-zone').style.borderColor = '';
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('video/')) processVFile(file);
  else toast('Cal un fitxer de vídeo vàlid','error');
}

function handleVFile(input) {
  const file = input.files[0];
  if (file) processVFile(file);
}

function processVFile(file) {
  const sizeGB = file.size / 1024 / 1024 / 1024;
  if (sizeGB > 2) { toast('Fitxer massa gran (màx. 2 GB)','error'); return; }

  const url = URL.createObjectURL(file);
  window._veoFiles['__pending__'] = url;
  window._veoFiles['__pendingFile__'] = file;

  const sizeMB = (file.size / 1024 / 1024).toFixed(1);
  const drop = document.getElementById('vdrop-zone');
  drop.innerHTML = `
    <video src="${url}" style="width:100%;max-height:140px;border-radius:8px;object-fit:cover" preload="metadata" muted></video>
    <div style="margin-top:8px;font-size:.78rem;font-weight:600;color:var(--text)">${file.name}</div>
    <div style="font-size:.7rem;color:var(--text3)">${sizeMB} MB</div>`;

  if (!document.getElementById('v-title').value)
    document.getElementById('v-title').value = file.name.replace(/\.[^.]+$/, '');
}

function reloadLocalVideo(id, input) {
  const file = input.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  window._veoFiles[id] = url;
  navigate('veo');
  toast('Vídeo re-carregat','success');
}

function saveVideo() {
  const title = document.getElementById('v-title')?.value.trim();
  if (!title) { toast('Títol obligatori','error'); return; }

  const isLocalTab = document.getElementById('vsrc-local')?.style.display !== 'none';
  const pendingUrl = window._veoFiles['__pending__'];
  const hasUrl     = document.getElementById('v-url')?.value.trim();

  if (isLocalTab && !pendingUrl) { toast('Selecciona un fitxer de vídeo','error'); return; }
  if (!isLocalTab && !hasUrl)    { toast('Introdueix una URL','error'); return; }

  const id = uid();
  const videos = DB.videos();

  if (isLocalTab) {
    window._veoFiles[id] = pendingUrl;
    delete window._veoFiles['__pending__'];
    delete window._veoFiles['__pendingFile__'];
    videos.unshift({ id, title, category: document.getElementById('v-cat').value, description: document.getElementById('v-desc').value.trim(), url:'', isLocal:true, date: new Date().toISOString().split('T')[0] });
  } else {
    videos.unshift({ id, title, category: document.getElementById('v-cat').value, description: document.getElementById('v-desc').value.trim(), url: hasUrl, isLocal:false, date: new Date().toISOString().split('T')[0] });
  }

  DB.saveVideos(videos);
  closeModal('video-modal');
  toast('Vídeo afegit','success');
  navigate('veo');
}

function deleteVideo(id) {
  if (!confirm('Eliminar vídeo?')) return;
  if (window._veoFiles[id]) { URL.revokeObjectURL(window._veoFiles[id]); delete window._veoFiles[id]; }
  DB.saveVideos(DB.videos().filter(v=>v.id!==id));
  toast('Vídeo eliminat','success');
  navigate('veo');
}

function renderPlayerVEO() {
  const videos = DB.videos();
  return `
  <div class="page-header"><div class="page-header-left"><div class="page-title">Anàlisi VEO</div><div class="page-subtitle">Vídeos tàctics de l'equip</div></div></div>
  <div class="grid grid-auto">${videos.map(v=>renderVideoCard(v, false)).join('')}</div>`;
}

// ── TASKS ──────────────────────────────────────────────────

function renderTasks() {
  const tasks = DB.tasks();
  const users = DB.users();
  const groups = { todo:'Pendent', in_progress:'En curs', done:'Fet' };
  const dotColors = { todo:'var(--text3)', in_progress:'var(--yellow)', done:'var(--green)' };

  return `
  <div class="page-header">
    <div class="page-header-left"><div class="page-title">Tasques Staff</div><div class="page-subtitle">${tasks.filter(t=>t.status!=='done').length} pendents</div></div>
    <div class="page-actions"><button class="btn btn-primary" onclick="openTaskModal()">${ico('plus')} Nova Tasca</button></div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;align-items:start">
    ${Object.entries(groups).map(([status,label]) => {
      const st = tasks.filter(t=>t.status===status);
      return `
      <div>
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:10px">
          <div style="width:7px;height:7px;border-radius:50%;background:${dotColors[status]}"></div>
          <span style="font-size:.7rem;font-weight:600;text-transform:uppercase;letter-spacing:.09em;color:var(--text3)">${label}</span>
          <span class="badge badge-gray">${st.length}</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:7px">
          ${st.map(t=>renderTaskCard(t,users)).join('')}
          ${st.length===0 ? `<div style="padding:18px;text-align:center;color:var(--text3);font-size:.78rem;background:var(--bg2);border-radius:6px;border:1px dashed var(--border)">Cap tasca</div>` : ''}
        </div>
      </div>`;
    }).join('')}
  </div>
  <div id="task-modal-container"></div>`;
}

function renderTaskCard(t, users) {
  const a = users.find(u=>u.id===t.assignedTo);
  return `
  <div class="card card-sm" style="cursor:pointer" onclick="openTaskModal('${t.id}')">
    <div style="font-size:.8125rem;font-weight:500;margin-bottom:5px">${t.title}</div>
    <div style="font-size:.72rem;color:var(--text3);margin-bottom:8px">${t.description}</div>
    <div style="display:flex;align-items:center;gap:6px">
      ${a ? `<div class="avatar sm">${a.avatar}</div><span style="font-size:.72rem;color:var(--text3)">${a.name.split(' ')[0]}</span>` : ''}
      <span style="margin-left:auto;font-size:.7rem;color:var(--text3)">${t.dueDate ? formatDate(t.dueDate) : ''}</span>
    </div>
  </div>`;
}

function openTaskModal(id=null) {
  const users = DB.users();
  const tasks = DB.tasks();
  const t = id ? tasks.find(tk=>tk.id===id) : null;
  document.getElementById('task-modal-container').innerHTML = `
  <div class="modal-overlay" id="task-modal">
    <div class="modal">
      <div class="modal-header"><div class="modal-title">${t?'Editar Tasca':'Nova Tasca'}</div><button class="btn-icon" onclick="closeModal('task-modal')">${ico('close')}</button></div>
      <div class="modal-body">
        <div class="form-group"><label class="form-label">Títol</label><input class="form-input" id="tk-title" value="${t?.title||''}"></div>
        <div class="form-group"><label class="form-label">Descripció</label><textarea class="form-textarea" id="tk-desc">${t?.description||''}</textarea></div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Assignat a</label>
            <select class="form-select" id="tk-user">${users.map(u=>`<option value="${u.id}" ${t?.assignedTo===u.id?'selected':''}>${u.name}</option>`).join('')}</select>
          </div>
          <div class="form-group"><label class="form-label">Data límit</label><input class="form-input" type="date" id="tk-due" value="${t?.dueDate||''}"></div>
        </div>
        <div class="form-group"><label class="form-label">Estat</label>
          <select class="form-select" id="tk-status">
            <option value="todo" ${(!t||t.status==='todo')?'selected':''}>Pendent</option>
            <option value="in_progress" ${t?.status==='in_progress'?'selected':''}>En curs</option>
            <option value="done" ${t?.status==='done'?'selected':''}>Fet</option>
          </select>
        </div>
      </div>
      <div class="modal-footer">
        ${t ? `<button class="btn btn-danger btn-sm" onclick="deleteTask('${t.id}')">${ico('trash')} Eliminar</button>` : ''}
        <button class="btn btn-ghost" onclick="closeModal('task-modal')">Cancel·lar</button>
        <button class="btn btn-primary" onclick="saveTask('${id||''}')">Desar</button>
      </div>
    </div>
  </div>`;
}

function saveTask(id) {
  const title = document.getElementById('tk-title').value.trim();
  if (!title) { toast('Títol obligatori','error'); return; }
  const data = { title, description:document.getElementById('tk-desc').value.trim(), assignedTo:document.getElementById('tk-user').value, dueDate:document.getElementById('tk-due').value, status:document.getElementById('tk-status').value, comments:[] };
  const tasks = DB.tasks();
  if (id) { const i=tasks.findIndex(t=>t.id===id); if(i!==-1) tasks[i]={...tasks[i],...data}; }
  else tasks.push({ id:uid(),...data });
  DB.saveTasks(tasks);
  closeModal('task-modal');
  toast('Tasca desada','success');
  navigate('tasks');
}

function deleteTask(id) {
  if (!confirm('Eliminar tasca?')) return;
  DB.saveTasks(DB.tasks().filter(t=>t.id!==id));
  closeModal('task-modal');
  toast('Tasca eliminada','success');
  navigate('tasks');
}

// ── WELLNESS ───────────────────────────────────────────────

function renderWellness() {
  const players = DB.players();
  const wellness = DB.wellness();
  const today = new Date().toISOString().split('T')[0];
  return `
  <div class="page-header">
    <div class="page-header-left"><div class="page-title">Wellness</div><div class="page-subtitle">Estat físic dels jugadors · ${formatDate(today)}</div></div>
  </div>
  <div class="card">
    <div style="display:grid;grid-template-columns:1fr 58px 58px 58px 64px 56px;gap:0;align-items:center;padding-bottom:10px;margin-bottom:4px;border-bottom:1px solid var(--border)">
      ${['Jugador','Son','Fatiga','Dolor','Condició','Fisio'].map((h,i)=>`<div style="font-size:.65rem;font-weight:600;letter-spacing:.09em;text-transform:uppercase;color:var(--text3);${i>0?'text-align:center':''}">${h}</div>`).join('')}
    </div>
    ${players.map(p => {
      const w = wellness[p.id]?.[0];
      return `
      <div style="display:grid;grid-template-columns:1fr 58px 58px 58px 64px 56px;gap:0;align-items:center;padding:8px 0;border-bottom:1px solid var(--border)">
        <div style="display:flex;align-items:center;gap:8px">
          <div class="avatar sm">${(p.name[0]+p.surname[0]).toUpperCase()}</div>
          <div><div style="font-size:.8125rem;font-weight:500">${p.name} ${p.surname}</div><div style="font-size:.68rem;color:var(--text3)">${p.position}</div></div>
        </div>
        ${w ? `
          <div class="score-circle ${scoreColor(w.sleep,9)}" style="justify-self:center">${w.sleep}h</div>
          <div class="score-circle ${scoreColor(10-w.fatigue,10)}" style="justify-self:center">${w.fatigue}</div>
          <div class="score-circle ${scoreColor(10-w.soreness,10)}" style="justify-self:center">${w.soreness}</div>
          <div class="score-circle ${scoreColor(w.condition,10)}" style="justify-self:center">${w.condition}</div>
          <div style="text-align:center">${w.physio ? `<span class="badge badge-red">Sí</span>` : `<span class="badge badge-green">No</span>`}</div>
        ` : `<div style="grid-column:2/-1;font-size:.72rem;color:var(--text3);text-align:center">Sense dades avui</div>`}
      </div>`;
    }).join('')}
  </div>`;
}

function renderPlayerWellness() {
  const pid = currentUser.player_id;
  if (!pid) {
    return `
    <div class="page-header"><div class="page-header-left"><div class="page-title">Wellness</div></div></div>
    <div class="empty-state">
      ${ico('wellness')}
      <h3>Compte no vinculat a un jugador</h3>
      <p>Contacta amb l'administrador per vincular el teu compte a un registre de jugador.</p>
    </div>`;
  }
  const wellness   = DB.wellness();
  const entries    = wellness[pid] || [];
  const today      = new Date().toISOString().split('T')[0];
  const todayEntry = entries.find(e => e.date === today);

  /* Pre-carregar els valors als scores globals (reset sempre) */
  _wellnessScores.fatigue   = todayEntry?.fatigue   ?? 5;
  _wellnessScores.soreness  = todayEntry?.soreness  ?? 5;
  _wellnessScores.condition = todayEntry?.condition ?? 7;

  return `
  <div class="page-header">
    <div class="page-header-left"><div class="page-title">Wellness</div><div class="page-subtitle">Qüestionari diari · ${formatDate(today)}</div></div>
  </div>
  ${todayEntry ? `<div style="padding:10px 14px;background:var(--green-dim);border:1px solid rgba(22,163,74,.3);border-radius:6px;margin-bottom:16px;font-size:.8125rem;color:var(--green);display:flex;align-items:center;gap:7px">${ico('check')} Qüestionari d'avui completat! Pots actualitzar-lo.</div>` : ''}
  <div class="card" style="max-width:480px">
    <div style="font-family:var(--font-display);font-size:1.2rem;letter-spacing:.06em;text-transform:uppercase;color:var(--brand);margin-bottom:18px">Qüestionari Diari</div>
    <div style="display:flex;flex-direction:column;gap:16px">
      <div class="form-group">
        <label class="form-label">Hores de son</label>
        <input class="form-input" type="number" id="w-sleep" min="0" max="12" step="0.5" value="${todayEntry?.sleep ?? 7}" style="max-width:120px">
      </div>
      ${[
        {key:'fatigue',  label:'Fatiga',        hint:'1 = cap fatiga · 10 = molt cansat'},
        {key:'soreness', label:'Dolor muscular', hint:'1 = cap dolor · 10 = molt dolor'},
        {key:'condition',label:'Condició física',hint:'1 = molt malament · 10 = excel·lent'},
      ].map(item => `
      <div class="form-group">
        <label class="form-label">${item.label}</label>
        <div class="score-dots" id="dots-${item.key}">
          ${Array.from({length:10}, (_, i) => `
            <div class="score-dot ${(todayEntry?.[item.key] ?? _wellnessScores[item.key]) === i+1 ? 'active' : ''}"
                 data-val="${i+1}" onclick="setScore('${item.key}',${i+1})">${i+1}</div>
          `).join('')}
        </div>
        <div class="form-hint">${item.hint}</div>
      </div>`).join('')}
      <div class="form-group">
        <label class="form-label">Necessites fisioteràpia?</label>
        <div style="display:flex;gap:12px">
          <label style="display:flex;align-items:center;gap:5px;cursor:pointer;font-size:.8125rem">
            <input type="radio" name="w-physio" value="yes" ${todayEntry?.physio ? 'checked' : ''}> Sí
          </label>
          <label style="display:flex;align-items:center;gap:5px;cursor:pointer;font-size:.8125rem">
            <input type="radio" name="w-physio" value="no"  ${!todayEntry || !todayEntry.physio ? 'checked' : ''}> No
          </label>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Comentaris (opcional)</label>
        <textarea class="form-textarea" id="w-comments">${todayEntry?.comments || ''}</textarea>
      </div>
    </div>
    <button class="btn btn-primary" style="margin-top:18px;width:100%" onclick="saveWellness()">
      ${ico('check')} ${todayEntry ? 'Actualitzar Qüestionari' : 'Enviar Qüestionari'}
    </button>
  </div>

  ${entries.length > 1 ? `
  <div style="max-width:480px;margin-top:20px">
    <div style="font-size:.7rem;font-weight:600;letter-spacing:.09em;text-transform:uppercase;color:var(--text3);margin-bottom:10px">Historial recent</div>
    <div class="card card-sm">
      ${entries.slice(1, 6).map(e => `
      <div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--border)">
        <span style="font-size:.75rem;color:var(--text3);min-width:90px">${formatDate(e.date)}</span>
        <span class="score-circle ${scoreColor(e.sleep, 9)}">${e.sleep}h</span>
        <span class="score-circle ${scoreColor(10-e.fatigue,10)}">${e.fatigue}</span>
        <span class="score-circle ${scoreColor(10-e.soreness,10)}">${e.soreness}</span>
        <span class="score-circle ${scoreColor(e.condition,10)}">${e.condition}</span>
        ${e.physio ? `<span class="badge badge-red" style="font-size:.62rem">Fisio</span>` : ''}
      </div>`).join('')}
    </div>
  </div>` : ''}`;
}

const _wellnessScores = {};
function setScore(key, val) {
  _wellnessScores[key] = val;
  document.querySelectorAll(`#dots-${key} .score-dot`).forEach(d => d.classList.toggle('active', parseInt(d.dataset.val)===val));
}

function saveWellness() {
  const pid = currentUser.player_id;
  if (!pid) { toast('Compte no vinculat a un jugador', 'error'); return; }

  const today   = new Date().toISOString().split('T')[0];
  const wellness = DB.wellness();
  if (!wellness[pid]) wellness[pid] = [];

  const existing = wellness[pid].find(e => e.date === today);
  const entry = {
    id:        existing?.id || uid(),
    date:      today,
    sleep:     parseFloat(document.getElementById('w-sleep').value) || 7,
    fatigue:   _wellnessScores.fatigue   ?? 5,
    soreness:  _wellnessScores.soreness  ?? 5,
    condition: _wellnessScores.condition ?? 7,
    physio:    document.querySelector('input[name="w-physio"]:checked')?.value === 'yes',
    comments:  document.getElementById('w-comments').value.trim(),
  };

  wellness[pid] = [entry, ...wellness[pid].filter(e => e.date !== today)];
  DB.saveWellness(wellness);
  toast('Qüestionari enviat!', 'success');
  navigate('player_wellness');
}

// ── SQUAD SELECTION ────────────────────────────────────────

function renderMatchDetailsCard(sel, isCoach) {
  const hasDetails = sel.rival || sel.match_date;
  return `
  <div class="card" style="margin-bottom:18px;border-left:4px solid var(--brand)">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:${hasDetails?'14px':'0'}">
      <div>
        <div style="font-family:var(--font-display);font-size:1.15rem;letter-spacing:.06em;text-transform:uppercase;color:var(--brand)">
          ${sel.rival || (isCoach ? 'Rival pendent' : 'Pròxim Partit')}
        </div>
        ${sel.match_date ? `<div style="font-size:.78rem;color:var(--text3);margin-top:2px">${formatDate(sel.match_date)}${sel.match_time ? ' · ' + sel.match_time + ' h' : ''}</div>` : ''}
      </div>
      ${isCoach ? `<button class="btn btn-ghost btn-sm" onclick="openMatchDetailsModal()">${ico('edit')} Editar detalls</button>` : ''}
    </div>
    ${hasDetails ? `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:.8125rem">
      ${sel.venue         ? `<div><span style="color:var(--text3)">📍 Camp</span><br><strong>${sel.venue}</strong></div>` : ''}
      ${sel.meeting_point ? `<div><span style="color:var(--text3)">🤝 Punt de trobada</span><br><strong>${sel.meeting_point}</strong></div>` : ''}
      ${sel.meeting_time  ? `<div><span style="color:var(--text3)">⏰ Hora convocatòria</span><br><strong>${sel.meeting_time} h</strong></div>` : ''}
      ${sel.team          ? `<div><span style="color:var(--text3)">👥 Equip</span><br><strong>${sel.team}</strong></div>` : ''}
    </div>
    ${sel.observations ? `<div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border);font-size:.8125rem;color:var(--text2)">📝 ${sel.observations}</div>` : ''}
    ` : isCoach ? `<div style="font-size:.78rem;color:var(--text3)">Afegeix els detalls del partit per als jugadors.</div>` : ''}
  </div>`;
}

function renderSelection() {
  const sel     = DB.selection();
  const players = DB.players();
  const isCoach = ['coach','administrator','sporting_director'].includes(currentUser.role);

  const selectedIds    = sel.selected    || [];
  const notSelectedIds = sel.notSelected || [];
  /* Jugadors nous que no estan en cap llista → van a "No convocat" */
  const uncategorized = players.filter(p => !selectedIds.includes(p.id) && !notSelectedIds.includes(p.id));
  if (uncategorized.length > 0) {
    const updatedSel = { ...sel, notSelected: [...notSelectedIds, ...uncategorized.map(p => p.id)] };
    DB.saveSelection(updatedSel);
    sel.notSelected = updatedSel.notSelected;
  }
  const selected    = players.filter(p => selectedIds.includes(p.id));
  const notSelected = players.filter(p => (sel.notSelected || []).includes(p.id));

  return `
  <div class="page-header">
    <div class="page-header-left">
      <div class="page-title">Convocatòria</div>
      <div class="page-subtitle">
        ${sel.published
          ? `<span class="badge badge-green">${ico('check')} Publicada — jugadors la veuen</span>`
          : `<span class="badge badge-gray">Esborrany — no visible pels jugadors</span>`}
      </div>
    </div>
    <div class="page-actions">
      ${isCoach ? (sel.published
        ? `<button class="btn btn-ghost" onclick="togglePublish()">Despublicar</button>`
        : `<button class="btn btn-primary" onclick="togglePublish()">${ico('publish')} Publicar</button>`)
      : ''}
    </div>
  </div>

  ${renderMatchDetailsCard(sel, isCoach)}

  ${isCoach ? `<div style="padding:9px 12px;background:var(--bg3);border-radius:6px;border:1px solid var(--border);font-size:.78rem;color:var(--text2);margin-bottom:14px">
    Fes clic a un jugador per moure'l d'una columna a l'altra.
  </div>` : ''}

  <div class="selection-grid">
    <div class="selection-column">
      <div class="selection-col-header selected">${ico('check')} Convocat (${selected.length})</div>
      ${selected.map(p => `
      <div class="selection-player" ${isCoach ? `onclick="togglePlayerSelection('${p.id}',true)"` : ''} style="${!isCoach ? 'cursor:default' : ''}">
        <div class="shirt-num">${p.number}</div>
        <div style="flex:1">
          <div style="font-weight:500">${p.name} ${p.surname}</div>
          <div style="font-size:.7rem;color:var(--text3)">${p.position}</div>
        </div>
        ${isCoach ? `<span style="color:var(--text3);font-size:.75rem">→</span>` : ''}
      </div>`).join('')}
    </div>
    <div class="selection-column">
      <div class="selection-col-header not-selected">${ico('close')} No convocat (${notSelected.length})</div>
      ${notSelected.map(p => `
      <div class="selection-player" ${isCoach ? `onclick="togglePlayerSelection('${p.id}',false)"` : ''} style="opacity:.55;${!isCoach ? 'cursor:default' : ''}">
        <div class="shirt-num" style="background:var(--border2)">${p.number}</div>
        <div style="flex:1">
          <div style="font-weight:500">${p.name} ${p.surname}</div>
          <div style="font-size:.7rem;color:var(--text3)">${p.position}</div>
        </div>
        ${isCoach ? `<span style="color:var(--text3);font-size:.75rem">←</span>` : ''}
      </div>`).join('')}
    </div>
  </div>
  <div id="match-details-modal-container"></div>`;
}

function openMatchDetailsModal() {
  const sel = DB.selection();
  document.getElementById('match-details-modal-container').innerHTML = `
  <div class="modal-overlay" id="match-details-modal">
    <div class="modal modal-lg">
      <div class="modal-header">
        <div class="modal-title">Detalls del Partit</div>
        <button class="btn-icon" onclick="closeModal('match-details-modal')">${ico('close')}</button>
      </div>
      <div class="modal-body">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Rival</label>
            <input class="form-input" id="sd-rival" placeholder="Nom del club rival" value="${sel.rival || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">Equip</label>
            <input class="form-input" id="sd-team" placeholder="Ex: Primer Equip" value="${sel.team || ''}">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Data del partit</label>
            <input class="form-input" type="date" id="sd-date" value="${sel.match_date || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">Hora del partit</label>
            <input class="form-input" type="time" id="sd-time" value="${sel.match_time || ''}">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Instal·lació / Camp</label>
          <input class="form-input" id="sd-venue" placeholder="Nom i adreça del camp" value="${sel.venue || ''}">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Punt de trobada</label>
            <input class="form-input" id="sd-meeting-point" placeholder="Ex: Vestuaris del camp" value="${sel.meeting_point || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">Hora de convocatòria</label>
            <input class="form-input" type="time" id="sd-meeting-time" value="${sel.meeting_time || ''}">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Observacions</label>
          <textarea class="form-textarea" id="sd-observations" placeholder="Instruccions addicionals per als jugadors...">${sel.observations || ''}</textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="closeModal('match-details-modal')">Cancel·lar</button>
        <button class="btn btn-primary" onclick="saveMatchDetails()">${ico('check')} Desar detalls</button>
      </div>
    </div>
  </div>`;
}

function saveMatchDetails() {
  const sel = DB.selection();
  sel.rival         = document.getElementById('sd-rival').value.trim();
  sel.team          = document.getElementById('sd-team').value.trim();
  sel.match_date    = document.getElementById('sd-date').value;
  sel.match_time    = document.getElementById('sd-time').value;
  sel.venue         = document.getElementById('sd-venue').value.trim();
  sel.meeting_point = document.getElementById('sd-meeting-point').value.trim();
  sel.meeting_time  = document.getElementById('sd-meeting-time').value;
  sel.observations  = document.getElementById('sd-observations').value.trim();
  DB.saveSelection(sel);
  closeModal('match-details-modal');
  toast('Detalls del partit desats', 'success');
  navigate('selection');
}

function togglePlayerSelection(pid, isCurrentlySelected) {
  const sel = DB.selection();
  if (isCurrentlySelected) {
    sel.selected    = (sel.selected    || []).filter(id => id !== pid);
    sel.notSelected = [...(sel.notSelected || []), pid];
  } else {
    sel.notSelected = (sel.notSelected || []).filter(id => id !== pid);
    sel.selected    = [...(sel.selected    || []), pid];
  }
  DB.saveSelection(sel);
  navigate('selection');
}

function togglePublish() {
  const sel = DB.selection();
  sel.published = !sel.published;
  DB.saveSelection(sel);
  toast(sel.published ? 'Convocatòria publicada! Els jugadors ja la poden veure.' : 'Convocatòria despublicada', sel.published ? 'success' : 'info');
  navigate('selection');
}

function renderPlayerSelection() {
  const sel = DB.selection();
  if (!sel.published) {
    return `
    <div class="page-header"><div class="page-header-left"><div class="page-title">Convocatòria</div></div></div>
    <div class="empty-state">
      ${ico('selection')}
      <h3>Convocatòria no publicada</h3>
      <p>L'entrenador/a encara no ha publicat la convocatòria del proper partit.</p>
    </div>`;
  }
  const players  = DB.players();
  const selected = players.filter(p => (sel.selected || []).includes(p.id));
  const myPid    = currentUser.player_id;

  const isCalled = myPid && (sel.selected || []).includes(myPid);

  return `
  <div class="page-header">
    <div class="page-header-left">
      <div class="page-title">Convocatòria</div>
      <div class="page-subtitle"><span class="badge badge-green">${ico('check')} Publicada</span></div>
    </div>
  </div>

  ${myPid ? `
  <div style="padding:12px 16px;border-radius:8px;margin-bottom:18px;border:1px solid;
    background:${isCalled ? 'var(--green-dim)' : 'var(--bg3)'};
    border-color:${isCalled ? 'rgba(22,163,74,.3)' : 'var(--border)'};
    color:${isCalled ? 'var(--green)' : 'var(--text3)'};
    font-weight:600;font-size:.875rem;display:flex;align-items:center;gap:8px">
    ${isCalled ? `${ico('check')} Estàs convocat/da per a aquest partit` : `${ico('close')} No estàs convocat/da per a aquest partit`}
  </div>` : ''}

  ${renderMatchDetailsCard(sel, false)}

  <div class="card" style="max-width:460px">
    <div style="margin-bottom:12px;font-size:.8125rem;font-weight:600;color:var(--text2)">
      Jugadors convocats (${selected.length})
    </div>
    ${selected.map(p => `
    <div style="display:flex;align-items:center;gap:9px;padding:9px 0;border-bottom:1px solid var(--border)">
      <div class="shirt-num" style="${myPid === p.id ? 'background:var(--green)' : ''}">${p.number}</div>
      <div>
        <div style="font-weight:${myPid === p.id ? '700' : '500'};font-size:.8125rem">${p.name} ${p.surname}${myPid === p.id ? ' (tu)' : ''}</div>
        <div style="font-size:.7rem;color:var(--text3)">${p.position}</div>
      </div>
    </div>`).join('')}
  </div>`;
}
