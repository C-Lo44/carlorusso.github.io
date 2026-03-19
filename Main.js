const sections = Array.from(document.querySelectorAll(".portfolio-section"));
const navLinks = Array.from(document.querySelectorAll("[data-section-link]"));
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const header = document.querySelector(".site-header");

function setActiveNav(sectionId) {
  navLinks.forEach((link) => {
    const isActive = link.dataset.sectionLink === sectionId;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

async function hydrateSection(section) {
  const fragmentPath = section.dataset.fragment;
  const modulePath = section.dataset.module;
  const mount = section.querySelector("[data-section-content]");
  if (!fragmentPath || !mount) return;

  const response = await fetch(fragmentPath, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load ${fragmentPath} (${response.status})`);
  }

  mount.innerHTML = await response.text();

  if (modulePath) {
    try {
      const mod = await import(modulePath);
      if (typeof mod.init === "function") {
        mod.init(mount);
      }
    } catch (error) {
      console.error("Module load error:", error);
    }
  }
}

function scrollToSection(sectionId, updateHash = true) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  const headerHeight = header?.offsetHeight ?? 0;
  const sectionTop = window.scrollY + section.getBoundingClientRect().top;
  const targetTop = Math.max(0, sectionTop - headerHeight - 12);

  window.scrollTo({
    top: targetTop,
    behavior: prefersReducedMotion.matches ? "auto" : "smooth"
  });

  setActiveNav(sectionId);

  if (updateHash) {
    history.replaceState(null, "", `#${sectionId}`);
  }
}

function setupNav() {
  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const sectionId = link.dataset.sectionLink;
      if (!sectionId) return;
      event.preventDefault();
      scrollToSection(sectionId, true);
    });
  });
}

function setupObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visible.length > 0) {
        const sectionId = visible[0].target.id;
        setActiveNav(sectionId);
        history.replaceState(null, "", `#${sectionId}`);
      }
    },
    {
      rootMargin: "-25% 0px -45% 0px",
      threshold: [0.2, 0.35, 0.55]
    }
  );

  sections.forEach((section) => observer.observe(section));
}

async function init() {
  await Promise.all(sections.map(hydrateSection));
  setupNav();
  setupObserver();

  const hash = (window.location.hash || "").slice(1);
  const initialSection = sections.find((section) => section.id === hash)?.id || sections[0]?.id;
  if (initialSection) {
    setActiveNav(initialSection);
    if (hash) {
      requestAnimationFrame(() => scrollToSection(initialSection, false));
    }
  }
}

init().catch((error) => {
  console.error("Portfolio initialization error:", error);
});
