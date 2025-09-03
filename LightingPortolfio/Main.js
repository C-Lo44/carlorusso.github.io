// Main.js
const tabs = Array.from(document.querySelectorAll('.tabs .tab'));
const mount = document.getElementById('mount');

async function loadTab(tabEl, pushHash = true) {
  // aria state
  tabs.forEach(t => {
    const selected = t === tabEl;
    t.setAttribute('aria-selected', String(selected));
    t.tabIndex = selected ? 0 : -1;
  });
  mount.setAttribute('aria-labelledby', tabEl.id);

  // fetch HTML fragment
  const fragmentPath = tabEl.dataset.fragment;      // e.g. "Sections/About.html"
  const html = await fetch(fragmentPath, { cache: 'no-cache' }).then(r => {
    if (!r.ok) throw new Error(`Failed to load ${fragmentPath} (${r.status})`);
    return r.text();
  });
  mount.innerHTML = html;

  // import JS module (optional per tab)
  const modulePath = tabEl.dataset.module;          // e.g. "./Sections/About.js"
  if (modulePath) {
    const mod = await import(modulePath);
    if (typeof mod.init === 'function') mod.init(mount);
  }

  // update hash for deep link
  if (pushHash) {
    const simple = tabEl.id.replace('tab-', '');
    history.replaceState(null, '', `#${simple}`);
  }

  mount.focus();
}

function showById(id) {
  const t = tabs.find(x => x.id === id);
  if (t) loadTab(t, false);
}

tabs.forEach((tab, idx) => {
  tab.addEventListener('click', () => loadTab(tab, true));
  tab.addEventListener('keydown', (e) => {
    const last = tabs.length - 1;
    if (e.key === 'ArrowRight') { e.preventDefault(); tabs[(idx + 1) % tabs.length].click(); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); tabs[(idx - 1 + tabs.length) % tabs.length].click(); }
    if (e.key === 'Home')       { e.preventDefault(); tabs[0].click(); }
    if (e.key === 'End')        { e.preventDefault(); tabs[last].click(); }
  });
});

// initial load (hash-aware)
(function init() {
  const hash = (location.hash || '').replace('#',''); // e.g. "projects"
  const startId = hash ? `tab-${hash}` : 'tab-about';
  showById(startId);
  if (!hash) {
    const first = document.getElementById('tab-about');
    if (first) loadTab(first, true);
  }
})();
