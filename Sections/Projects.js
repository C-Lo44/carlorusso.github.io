export function init(root){
  console.log("Projects tab loaded");

  // Make the page a bit wider on the projects view
  root.closest('.container')?.classList.add('projects-wide');

  const PROJECTS = [
    {
      title: "Latent Space Autoencoder (MNIST)",
      subtitle: "Visualizing digit embeddings in latent space",
      start: "2024-11", end: "2024-11",
      summary: "Built an autoencoder to compress MNIST digits into a low-dimensional latent space. Visualized latent embeddings, reconstructed images, and explored interpolation between points in latent space to understand what the model learns.",
      tags: ["Autoencoder","Latent Space","PyTorch","Computer Vision"],
      links: [
        { label: "Notebook", url: "https://github.com/C-Lo44/ComputerVisionAndGenAI/blob/main/LatentSpace_Autoencoder_MNIST.ipynb" }
      ]
    },

    // --- RESEARCH CARD (kept exactly as you had it) ---
    {
      title: "Sim-to-Real Robotics Research (NDA)",
      subtitle: "Cloth manipulation on a 6-DoF arm – details under NDA",
      start: "2025-09", end: "2026-12",
      summary:
      "Ongoing industry-aligned sim-to-real robotics research. Methods, datasets, and results are under NDA. High-level focus areas include domain randomization, reinforcement learning (DQN/DDPG/TD3), and transfer evaluation for cloth manipulation on a 6-DoF arm.",
      tags: ["Reinforcement Learning","Robotics","Sim-to-Real","NDA"],
      links: [{ label: "", url: "#" }, { label: "", url: "#" }]
    },
    // --------------------------------------------------

    {
      title: "Contrastive Learning Optimization (CIFAR-10)",
      subtitle: "Custom contrastive loss and representation learning",
      start: "2025-03", end: "2025-04",
      summary: "Implemented a CNN encoder on CIFAR-10 and trained it with contrastive learning. Experimented with a custom contrastive loss function, tuned temperature and batch settings, and evaluated representations via linear probing and latent space visualizations.",
      tags: ["Contrastive Learning","PyTorch","Computer Vision"],
      links: [
        { label: "Notebook", url: "YOUR_CIFAR_CONTRASTIVE_NOTEBOOK_LINK" },
        { label: "", url: "YOUR_CUSTOM_CONTRASTIVE_LOSS_NOTEBOOK_LINK" }
      ]
    },
    {
      title: "Variational Autoencoder (Fashion-MNIST)",
      subtitle: "Generative modeling of clothing images",
      start: "2024-10", end: "2024-10",
      summary: "Trained a VAE on Fashion-MNIST to learn a smooth latent space for clothing images. Monitored reconstruction loss and KL divergence, sampled from the latent space to generate new outfits, and compared different latent dimensions.",
      tags: ["VAE","Generative Models","PyTorch","Fashion-MNIST"],
      links: [
        { label: "Notebook", url: "https://github.com/C-Lo44/ComputerVisionAndGenAI/blob/main/VariationalAutoencoderFashion-MNIST.ipynb" }
      ]
    },
    {
      title: "PixelCNN Image Generation",
      subtitle: "Autoregressive modeling of images pixel-by-pixel",
      start: "2024-09", end: "2024-09",
      summary: "Built a PixelCNN-style autoregressive model that predicts each pixel conditioned on previous ones. Trained on small grayscale images and generated samples one pixel at a time to explore the strengths and limits of autoregressive generative models.",
      tags: ["PixelCNN","Autoregressive Models","PyTorch"],
      links: [
        { label: "Notebook", url: "https://github.com/C-Lo44/ComputerVisionAndGenAI/blob/main/PixelCNN.ipynb" }
      ]
    },
    {
      title: "CLIP & BLIP Vision-Language Lab",
      subtitle: "Zero-shot recognition and image captioning",
      start: "2025-06", end: "2025-06",
      summary: "Experimented with CLIP and BLIP to connect images and text. Ran zero-shot classification with CLIP prompts, generated captions with BLIP, and inspected how multimodal embeddings cluster semantically similar images and descriptions.",
      tags: ["CLIP","BLIP","Vision-Language","Multimodal AI"],
      links: [
        { label: "Notebook", url: "https://github.com/C-Lo44/ComputerVisionAndGenAI/blob/main/CLIPAndBLIP.ipynb" }
      ]
    },
    {
      title: "Conditional GAN (cGAN) for Image Generation",
      subtitle: "Class-conditioned generation on digit data",
      start: "2025-05", end: "2025-05",
      summary: "Implemented a conditional GAN that generates images conditioned on class labels (e.g., digits). Trained generator and discriminator jointly, monitored training stability, and visualized grids of generated images per class.",
      tags: ["GAN","cGAN","Generative Models","PyTorch"],
      links: [
        { label: "Notebook", url: "https://github.com/C-Lo44/ComputerVisionAndGenAI/blob/main/Conditional%20Generative%20Adversarial%20Network%20(cGAN).ipynb" }
      ]
    },
    {
      title: "IMDB Transformer Fine-Tuning",
      subtitle: "Sentiment classification with a pre-trained transformer",
      start: "2025-02", end: "2025-02",
      summary: "Fine-tuned a transformer-based language model on the IMDB movie review dataset. Tokenized text, handled padding and attention masks, tracked training/validation curves, and evaluated sentiment accuracy and confusion matrix on the test set.",
      tags: ["NLP","Transformers","Fine-Tuning","IMDB"],
      links: [
        { label: "Notebook", url: "YOUR_IMDB_TRANSFORMER_NOTEBOOK_LINK" }
      ]
    }
  ];

  const $  = (sel) => root.querySelector(sel);
  const elSearch = $("#pr-search");
  const elStart  = $("#pr-year-start");
  const elEnd    = $("#pr-year-end");
  const elSort   = $("#pr-sort");
  const list     = $("#projects-list");
  const cnt      = $("#projects-count");
  if (!elSearch || !elStart || !elEnd || !elSort || !list || !cnt) return;

  /* ---------- Add visible labels + placeholders (only once) ---------- */
  if (!root.querySelector('#label-pr-search')) {
    elSearch.insertAdjacentHTML(
      'beforebegin',
      `<label id="label-pr-search" class="input-label" for="pr-search" style="margin-right:8px;">Search</label>`
    );
  }
  if (!root.querySelector('#label-pr-year-start')) {
    elStart.insertAdjacentHTML(
      'beforebegin',
      `<label id="label-pr-year-start" class="input-label" for="pr-year-start" style="margin:0 8px 0 14px;">From</label>`
    );
  }
  if (!root.querySelector('#label-pr-year-end')) {
    elEnd.insertAdjacentHTML(
      'beforebegin',
      `<label id="label-pr-year-end" class="input-label" for="pr-year-end" style="margin:0 8px 0 14px;">To</label>`
    );
  }

  elSearch.setAttribute('placeholder', 'Search projects…');
  elSearch.setAttribute('aria-label', 'Search projects');
  elStart.setAttribute('placeholder', 'YYYY');
  elStart.setAttribute('aria-label', 'From year');
  elEnd.setAttribute('placeholder', 'YYYY');
  elEnd.setAttribute('aria-label', 'To year');

  /* --------------------- helpers & normalizer --------------------- */
  const toParts = (s)=>{ if(!s) return null; const [y,m="01"]=s.split("-"); return {y:+y,m:+m}; };
  const nrm = (p)=>{
    const start=toParts(p.start), end=p.end?toParts(p.end):null;
    const endParts = end || (()=>{ const d=new Date(); return {y:d.getFullYear(), m:d.getMonth()+1}; })();
    const months = (endParts.y*12+(endParts.m-1)) - (start.y*12+(start.m-1)) + 1;
    return {...p, _start:start, _end:end, _months:months};
  };

  function render(){
    const q = (elSearch.value||"").toLowerCase();
    const sortDesc = elSort.checked;
    const yStart = parseInt(elStart.value || "1980", 10);
    const yEnd   = parseInt(elEnd.value   || "2100", 10);

    const data = PROJECTS.map(nrm)
      .filter(d => d._start.y >= yStart && ((d._end?d._end.y:new Date().getFullYear()) <= yEnd))
      .filter(d => !q || [d.title,d.subtitle,d.summary,(d.tags||[]).join(" ")].join(" ").toLowerCase().includes(q))
      .sort((a,b) => sortDesc
        ? (b._end?.y ?? 9999) - (a._end?.y ?? 9999) || b._months - a._months
        : (a._start.y - b._start.y) || a._months - b._months);

    // Dates removed from the card markup (per your preference)
    list.innerHTML = data.map(d => `
      <li class="project-card" tabindex="0" aria-label="${d.title}">
        <div class="project-title">${d.title}</div>
        <div class="project-sub">${d.subtitle ?? ""}</div>

        ${d.summary ? `<div class="project-summary">${d.summary}</div>` : ""}

        ${Array.isArray(d.tags)&&d.tags.length ? `
          <div class="project-tags">
            ${d.tags.map(t=>`<span class="project-tag">${t}</span>`).join("")}
          </div>` : ""}

        ${(d.links||[]).length ? `
          <div style="margin-top:6px;">
            ${d.links.map(l=>`<a href="${l.url}" target="_blank" rel="noopener" style="margin-right:.6rem; text-decoration:none; border-bottom:1px dashed #7c5cff; color:#e7eef8;">${l.label}</a>`).join("")}
          </div>` : ""}
      </li>
    `).join("");

    cnt.textContent = `${data.length} ${data.length===1?"project":"projects"} shown`;
  }

  ["input","change"].forEach(ev=>{
    elSearch.addEventListener(ev, render);
    elStart.addEventListener(ev, render);
    elEnd.addEventListener(ev, render);
    elSort.addEventListener(ev, render);
  });

  const years = PROJECTS.flatMap(p=>[toParts(p.start)?.y, toParts(p.end||"")?.y]).filter(Boolean);
  const minY = Math.min(...years), maxY = Math.max(new Date().getFullYear(), ...years);
  elStart.value = minY; elEnd.value = maxY; elSort.checked = true;

  render();
}
