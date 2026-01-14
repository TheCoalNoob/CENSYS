let map;
let markers = {};

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 10.2975, lng: 123.8960 }, // Barangay center
    zoom: 17
  });

  const dbRef = firebase.database().ref("nodes");

  dbRef.on("value", snapshot => {
    const nodes = snapshot.val();
    for (let id in nodes) {
      updateMarker(id, nodes[id]);
    }
  });
}

function updateMarker(id, data) {
  if (!data.lat || !data.lon) return;

  let color = "green";
  if (data.lvl === "WARNING") color = "yellow";
  if (data.lvl === "POSSIBLE_FIRE") color = "orange";
  if (data.lvl === "CONFIRMED_FIRE") color = "red";

  const icon = {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 8,
    fillColor: color,
    fillOpacity: 1,
    strokeWeight: 1
  };

  if (markers[id]) {
    markers[id].setPosition({ lat: data.lat, lng: data.lon });
    markers[id].setIcon(icon);
  } else {
    markers[id] = new google.maps.Marker({
      position: { lat: data.lat, lng: data.lon },
      map: map,
      icon: icon,
      title: "Node " + id
    });
  }
}
