function formatDate(iso){
  try{const d=new Date(iso);if(isNaN(d))return'';return d.toLocaleString();}catch(e){return''}
}

function renderRepos(data){
  const list = document.getElementById('repos');
  const empty = document.getElementById('empty');
  list.innerHTML = '';
  if(!Array.isArray(data) || data.length === 0){
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';
  // Sort newest first when starred_at present
  data.sort((a,b)=>{
    const da = Date.parse(a.starred_at || a.starredAt) || 0;
    const db = Date.parse(b.starred_at || b.starredAt) || 0;
    return db - da;
  });
  data.forEach(ev => {
    const repo = ev.repo || ev;
    const name = repo.full_name || repo.name || 'unknown';
    const url = repo.html_url || repo.url || '#';
    const desc = repo.description || '';
    const owner = (repo.owner && repo.owner.login) || '';
    const starredAt = ev.starred_at || ev.starredAt || '';

    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = url;
    a.textContent = name;
    a.className = 'repo-name';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';

    const pDesc = document.createElement('div');
    pDesc.className = 'repo-desc';
    pDesc.textContent = desc;

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = [owner, starredAt ? '• ' + formatDate(starredAt) : ''].filter(Boolean).join(' ');

    li.appendChild(a);
    if(desc) li.appendChild(pDesc);
    li.appendChild(meta);
    list.appendChild(li);
  });
}

function init(){
  fetch('events.json', {cache: 'no-store'})
    .then(r => { if(!r.ok) throw new Error('Network error'); return r.json(); })
    .then(renderRepos)
    .catch(err => {
      console.error(err);
      const empty = document.getElementById('empty');
      empty.textContent = 'Failed to load starred repositories.';
      empty.style.display = 'block';
    });
}

document.addEventListener('DOMContentLoaded', init);
