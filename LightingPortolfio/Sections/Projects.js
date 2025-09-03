export function init(root) {
  console.log("Projects tab loaded");

  const list = root.querySelector("#projects-list");
  if (!list) return;

  const data = [
    { title: "Observability for LLM Services", link: "#", desc: "Custom metrics, alerts, dashboards on AWS." },
    { title: "Vision Robustness Workshop", link: "#", desc: "Adversarial training experiments with PyTorch." }
  ];

  list.innerHTML = data.map(p => `
    <article class="card">
      <h3><a href="${p.link}">${p.title}</a></h3>
      <p>${p.desc}</p>
    </article>
  `).join("");
}
