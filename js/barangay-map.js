let map;
let markers = {};

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: window.BARANGAY_CENTER,
    zoom: 16
  });

  // live read mapping + nodes
  db.ref("/config/node_barangay").on("value", mapSnap => {
    const nodeMap = mapSnap.val() || {};
    db.ref("/nodes").on("value", nodesSnap => {
      const nodes = nodesSnap.val() || {};
      renderBarangayNodes(nodeMap, nodes);
    });
  });
}

function renderBarangayNodes(nodeMap, nodes) {
  Object.keys(nodes).forEach(nodeKey => {
    if (nodeMap[nodeKey] !== window.BARANGAY_KEY) return;

    const n = nodes[nodeKey];
    const lat = Number(n.lat);
    const lon = Number(n.lon);
    const lvl = n.lvl || "NORMAL";
    if (!lat || !lon) return;

    const icon = circleIcon(levelColor(lvl));

    if (markers[nodeKey]) {
      markers[nodeKey].setPosition({ lat, lng: lon });
      markers[nodeKey].setIcon(icon);
      markers[nodeKey].setTitle(`${nodeKey} - ${lvl}`);
    } else {
      markers[nodeKey] = new google.maps.Marker({
        map,
        position: { lat, lng: lon },
        icon,
        title: `${nodeKey} - ${lvl}`
      });
    }
  });
}

function levelColor(lvl) {
  if (lvl === "CONFIRMED_FIRE") return "red";
  if (lvl === "POSSIBLE_FIRE") return "orange";
  if (lvl === "WARNING") return "yellow";
  return "green";
}

function circleIcon(color) {
  return {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 8,
    fillColor: color,
    fillOpacity: 1,
    strokeWeight: 1
  };
}
