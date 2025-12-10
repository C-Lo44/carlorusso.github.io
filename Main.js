// Main.js
const tabs  = Array.from(document.querySelectorAll('.tabs .tab'));
const mount = document.getElementById('mount');

async function loadTab(tabEl, pushHash = true) {
  // --- ARIA state ---
  tabs.forEach(t => {
    const selected = t === tabEl;
    t.setAttribute('aria-selected', String(selected));
    t.tabIndex = selected ? 0 : -1;
  });
  mount.setAttribute('aria-labelledby', tabEl.id);

  // --- Fetch HTML fragment ---
  const fragmentPath = tabEl.dataset.fragment; // e.g. "Sections/About.html"
  const html = await fetch(fragmentPath, { cache: 'no-store' }).then(r => {
    if (!r.ok) throw new Error(`Failed to load ${fragmentPath} (${r.status})`);
    return r.text();
  });
  mount.innerHTML = html;

  // --- Import per-tab JS module (optional) ---
  const modulePath = tabEl.dataset.module; // e.g. "./Sections/About.js"
  if (modulePath) {
    try {
      const mod = await import(modulePath);
      if (typeof mod.init === 'function') mod.init(mount);
    } catch (e) {
      console.error('Module load error:', e);
    }
  }

  // --- Update hash (no scroll) ---
  if (pushHash) {
    const simple = tabEl.id.replace('tab-', '');
    history.replaceState(null, '', `#${simple}`);
  }

  // --- Keep focus (for a11y) WITHOUT scrolling the page ---
  mount.setAttribute('tabindex', '-1');                 // ensure focusable region
  mount.focus({ preventScroll: true });                 // <-- key line

  // --- Belt & suspenders: pin viewport at the top after render ---
  requestAnimationFrame(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    // Or, if you prefer aligning under the sticky header:
    // document.querySelector('.site-header')?.scrollIntoView({ block: 'start', behavior: 'auto' });
  });
}

function showById(id, pushHash = false) {
  const t = tabs.find(x => x.id === id);
  if (t) return loadTab(t, pushHash);
}

// --- Wire up tabs ---
tabs.forEach((tab, idx) => {
  tab.addEventListener('click', (e) => {
    e.preventDefault();                 // just in case
    loadTab(tab, true);
  });

  tab.addEventListener('keydown', (e) => {
    const last = tabs.length - 1;
    if (e.key === 'ArrowRight') { e.preventDefault(); tabs[(idx + 1) % tabs.length].click(); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); tabs[(idx - 1 + tabs.length) % tabs.length].click(); }
    if (e.key === 'Home')       { e.preventDefault(); tabs[0].click(); }
    if (e.key === 'End')        { e.preventDefault(); tabs[last].click(); }
  });
});

// --- Initial load (hash-aware) — load ONCE ---
(function init() {
  const hash = (location.hash || '').slice(1);          // e.g. "projects"
  const startId = hash ? `tab-${hash}` : 'tab-about';
  const startTab = tabs.find(t => t.id === startId) || document.getElementById('tab-about');
  if (startTab) loadTab(startTab, Boolean(hash));       // load once; push hash only if there was a hash
})();
