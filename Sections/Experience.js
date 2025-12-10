export function init(root) {
  console.log("Experience tab loaded");

 const EXPERIENCES = [
  {
    role: "Machine Learning Engineer Intern",
    company: "Amazon",
    location: "Seattle, WA",
    start: "2025-04",
    end: "2025-07",
    summary:
      "Developed custom CloudWatch metrics, log filters, and dashboards to monitor KPIs (API latency, request throughput, LLM throttling, agent utilization, engagement). Built real-time observability for ML models/APIs across multi-region AWS; designed proactive alarms to catch errors, throttling, and latency spikes for faster incident mitigation and better API test/validation.",
    tags: ["AWS", "CloudWatch", "Python", "CDK", "LLM", "Monitoring", "Dashboards", "Alarms"]
  },
  {
    role: "Software Engineer Intern",
    company: "Williams International",
    location: "Pontiac, MI",
    start: "2023-06",
    end: "2024-07",
    summary:
      "Developed and executed testing protocols for engine flight code against high-level requirements. Built automated verification software to ensure accuracy within tolerances and supported coverage testing/tooling to improve reliability and test efficiency.",
    tags: ["Software Testing", "Automation", "Verification", "Coverage", "Aerospace"]
  },
  {
    role: "Inventory Coordinator (Part-time)",
    company: "Williams International",
    location: "Pontiac, MI",
    start: "2023-01",
    end: "2023-06",
    summary:
      "Assisted with inventory management including monitoring levels, vendor hardware returns, receiving/issuing inventory, and hardware kitting. Tracked and facilitated repair of rotatable inventory with production cells and suppliers. Supported MRP requirements by analyzing demand, reviewing service documents, and handling change management activities. Collaborated with Purchasing, Engineering, Production, and Suppliers.",
    tags: ["Inventory Management", "Supply Chain", "MRP", "Cross-Functional Collaboration", "Microsoft Suite"]
  },
  {
    role: "Aircraft Armament Systems Specialist (Drill Status Guardsman)",
    company: "Selfridge Air National Guard Base",
    location: "Harrison Twp, MI",
    start: "2020-10",
    end: null, // Present
    summary:
      "Manage and maintain aircraft weapons systems; perform precise loading, inspection, and maintenance. Diagnose mechanical/electrical faults and collaborate with cross-functional maintenance teams to meet mission timelines under strict safety/compliance standards.",
    tags: ["Military", "Maintenance", "Diagnostics", "Weapons Systems", "Safety"]
  }
];



  const $ = (sel) => root.querySelector(sel);

  const elSearch = $("#tl-search");
  const elStart  = $("#tl-year-start");
  const elEnd    = $("#tl-year-end");
  const elSort   = $("#tl-sort");
  const list     = $("#timeline");
  const cnt      = $("#tl-count");

  if (!elSearch || !elStart || !elEnd || !elSort || !list || !cnt) return;

  function toDateParts(s){ if(!s) return null; const [y,m="01"] = s.split("-"); return { y:+y, m:+m }; }
  function fmtYM(parts){ if(!parts) return "Present"; const m = String(parts.m).padStart(2,"0"); return `${parts.y}-${m}`; }
  function monthDiff(a, b){
  const diff = (b.y*12 + (b.m-1)) - (a.y*12 + (a.m-1));
  return Math.max(0, diff + 1); // +1 counts the start month
  }
  function humanDuration(months){
    if(months <= 0) return "<1 mo";
    const y = Math.floor(months/12), m = months%12;
    return [y ? `${y} yr${y>1?"s":""}` : "", m ? `${m} mo${m>1?"s":""}` : ""].filter(Boolean).join(" ");
  }
  function normalize(item){
    const start = toDateParts(item.start);
    const end = item.end && item.end.toLowerCase?.() !== "present" ? toDateParts(item.end) : null;
    const endParts = end || (() => { const d = new Date(); return { y:d.getFullYear(), m:d.getMonth()+1 }; })();
    const months = monthDiff(start, endParts);
    return { ...item, _start:start, _end:end, _months:months };
  }

  function render(){
    const search = (elSearch.value || "").toLowerCase();
    const sortDesc = elSort.checked;
    const yStart = parseInt(elStart.value || "1980", 10);
    const yEnd = parseInt(elEnd.value || "2100", 10);

    const data = EXPERIENCES.map(normalize)
      .filter(d => d._start.y >= yStart && ((d._end ? d._end.y : new Date().getFullYear()) <= yEnd))
      .filter(d => !search || [d.role,d.company,d.location,d.summary,(d.tags||[]).join(" ")].join(" ").toLowerCase().includes(search))
      .sort((a,b) => sortDesc
        ? (b._end?.y ?? 9999) - (a._end?.y ?? 9999) || b._months - a._months
        : (a._start.y - b._start.y) || a._months - b._months);

    list.innerHTML = data.map(d => `
      <li tabindex="0" style="margin-bottom:1rem; padding:.75rem; border:2px solid #7c5cff; border-radius:.75rem;">
        <div style="display:flex; justify-content:space-between; flex-wrap:wrap;">
          <div>
            <div style="font-weight:600">${d.role}</div>
            <div style="opacity:.8">${d.company}${d.location ? " — " + d.location : ""}</div>
          </div>
          <div style="font-variant-numeric:tabular-nums">
            <strong>${fmtYM(d._start)}</strong> → <strong>${d._end ? fmtYM(d._end) : "Present"}</strong>
            <div style="opacity:.8">${humanDuration(d._months)}</div>
          </div>
        </div>
        ${d.summary ? `<p style="margin:.5rem 0 0">${d.summary}</p>`: ""}
        ${Array.isArray(d.tags) && d.tags.length ? `<div style="margin-top:.35rem">${d.tags.map(t=>`<span style="border:1px solid #1f2430; border-radius:999px; padding:.2rem .5rem; font-size:.8rem; margin-right:.35rem;">${t}</span>`).join("")}</div>`: ""}
      </li>
    `).join("");

    cnt.textContent = `${data.length} ${data.length===1?"role":"roles"} shown`;
  }

  ["input","change"].forEach(ev => {
    elSearch.addEventListener(ev, render);
    elStart.addEventListener(ev, render);
    elEnd.addEventListener(ev, render);
    elSort.addEventListener(ev, render);
  });

  const years = EXPERIENCES.flatMap(e=>[toDateParts(e.start)?.y, toDateParts(e.end||"")?.y]).filter(Boolean);
  const minY = Math.min(...years), maxY = Math.max(new Date().getFullYear(), ...years);
  elStart.value = minY; elEnd.value = maxY; elSort.checked = true;
  render();
}
