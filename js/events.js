/* ============================================================
   EUROPA HUB v2 — Event Bindings & Post-render interactions
   ============================================================ */

bindPageEvents = function() {
  const p = currentPage;

  // Squad search & position filter
  if (p === 'squad') {
    const searchEl = document.getElementById('squad-search');
    const posFilter = document.getElementById('pos-filter');
    function filterSquad() {
      const q = searchEl?.value.toLowerCase() || '';
      const activePos = posFilter?.querySelector('.chip.active')?.dataset.pos || '';
      document.querySelectorAll('#squad-grid .player-card').forEach(card => {
        const name = card.textContent.toLowerCase();
        const pos  = card.dataset.pos || '';
        card.style.display = ((!q || name.includes(q)) && (!activePos || pos.includes(activePos))) ? '' : 'none';
      });
    }
    searchEl?.addEventListener('input', filterSquad);
    posFilter?.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        posFilter.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
        chip.classList.add('active');
        filterSquad();
      });
    });
  }

  // Tactical board: init pitch & canvas
  if (p === 'tactical') {
    renderPitchPlayers();
    setTimeout(() => {
      setupCanvas();
      redrawCanvas();
    }, 50);

    // Pitch mode buttons
    document.querySelectorAll('.tool-btn').forEach(btn => {
      // Formation chips
      if (['433','442','352','4231'].some(f => btn.textContent.trim().replace(/-/g,'')===f)) {
        btn.addEventListener('click', () => {
          const f = btn.textContent.trim().replace(/-/g,'');
          setFormation(f);
          setTimeout(()=>{ setupCanvas(); redrawCanvas(); }, 30);
        });
      }
    });
  }

  // VEO filter
  if (p === 'veo' || p === 'player_veo') {
    document.getElementById('veo-filter')?.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('#veo-filter .chip').forEach(c=>c.classList.remove('active'));
        chip.classList.add('active');
        const cat = chip.dataset.cat;
        document.querySelectorAll('#veo-grid .video-card').forEach(card => {
          card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
        });
      });
    });
  }

  // Scouting filter
  if (p === 'scouting') {
    document.getElementById('scout-filter')?.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('#scout-filter .chip').forEach(c=>c.classList.remove('active'));
        chip.classList.add('active');
        const tag = chip.dataset.tag;
        document.querySelectorAll('#scout-tbody tr').forEach(row => {
          row.style.display = (tag === 'all' || row.dataset.tag === tag) ? '' : 'none';
        });
      });
    });
  }
};
