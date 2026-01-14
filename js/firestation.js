const cardsEl = document.getElementById("cards");
const alarmEl = document.getElementById("alarm");

// Define your 3 “sites”
const barangays = [
  { key: "Kalunasan", label: "Barangay Kalunasan", page: "/barangay/kalunasan.html" },
  { key: "SanNicolas", label: "Barangay San Nicolas Central", page: "/barangay/san-nicolas.html" },
  { key: "FireStation", label: "San Nicolas Fire Substation", page: "/firestation/index.html" } // optional placeholder
];

// Render cards (folders)
function renderCards(state) {
  cardsEl.innerHTML = "";
  barangays
    .filter(b => b.key !== "FireStation")
    .forEach(b => {
      const s = state[b.key] || { level: "NORMAL" };

      const div = document.createElement("div");
      div.className = "folder " + s.level; // CSS colors
      div.innerHTML = `
        <h3>${b.label}</h3>
        <p>Status: <b>${s.level}</b></p>
        <p>${s.detail || ""}</p>
      `;
      div.onclick = () => window.location.href = b.page;
      cardsEl.appendChild(div);
    });
}

let alarmArmed = false;
// Browsers block autoplay audio until user interacts; this arms alarm after first click.
document.body.addEventListener("click", () => alarmArmed = true, { once: true });

// Load mapping and node data
Promise.all([
  db.ref("/config/node_barangay").get(),
  db.ref("/nodes").get()
]).then(([mapSnap, nodesSnap]) => {
  const nodeMap = mapSnap.val() || {};
  const nodes = nodesSnap.val() || {};

  // live listeners
  db.ref("/config/node_barangay").on("value", s => {
    const nm = s.val() || {};
    db.ref("/nodes").on("value", n => updateUI(nm, n.val() || {}));
  });

}).catch(console.error);

function updateUI(nodeMap, nodes) {
  const state = {
    Kalunasan: { level: "NORMAL" },
    SanNicolas: { level: "NORMAL" }
  };

  let shouldAlarm = false;

  Object.keys(nodes).forEach(nodeKey => {
    const bKey = nodeMap[nodeKey]; // "Kalunasan" or "SanNicolas"
    if (!bKey) return;

    const lvl = (nodes[nodeKey].lvl || nodes[nodeKey].raw?.lvl || "NORMAL");

    // Upgrade barangay level if worse
    state[bKey].level = worstLevel(state[bKey].level, lvl);

    if (lvl === "CONFIRMED_FIRE") shouldAlarm = true;
  });

  renderCards(state);

  if (shouldAlarm && alarmArmed) {
    alarmEl.play().catch(()=>{});
  }
}

function worstLevel(a, b) {
  const rank = { NORMAL:0, WARNING:1, POSSIBLE_FIRE:2, CONFIRMED_FIRE:3 };
  return (rank[b] > rank[a]) ? b : a;
}
