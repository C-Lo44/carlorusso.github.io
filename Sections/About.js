export function init(root) {
  const typingTarget = document.querySelector("[data-typing-roles]");
  if (!typingTarget || typingTarget.dataset.typingReady === "true") return;

  const roles = (typingTarget.dataset.typingRoles || "")
    .split("|")
    .map((role) => role.trim())
    .filter(Boolean);

  if (roles.length === 0) return;

  typingTarget.dataset.typingReady = "true";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    typingTarget.textContent = roles[0];
    return;
  }

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function tick() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      charIndex -= 1;
    } else {
      charIndex += 1;
    }

    typingTarget.textContent = currentRole.slice(0, charIndex);

    let delay = isDeleting ? 45 : 85;

    if (!isDeleting && charIndex === currentRole.length) {
      delay = 1450;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 280;
    }

    window.setTimeout(tick, delay);
  }

  tick();
}
