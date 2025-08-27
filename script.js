let threats = JSON.parse(localStorage.getItem('threats')) || [];

document.getElementById("threatForm").onsubmit = function (e) {
  e.preventDefault();
  const id = parseInt(document.getElementById("id").value);
  const source = document.getElementById("source").value;
  const type = document.getElementById("type").value;
  const severity = parseInt(document.getElementById("severity").value);
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const timestamp = `${date}_${time}`;

  if (threats.some(t => t.id === id)) {
    alert("Duplicate ID not allowed.");
    return;
  }

  const threat = { id, source, type, severity, timestamp };
  threats.push(threat);
  localStorage.setItem('threats', JSON.stringify(threats));
  alert("Threat reported successfully!");
  document.getElementById("threatForm").reset();
  updateSummary();

  if (severity >= 8) {
    document.getElementById("output").innerHTML = `<div class="alert">⚠️ High Severity Threat Reported!</div>`;
  }
};

function formatThreat(t) {
  const color = t.severity >= 8 ? 'red' : t.severity >= 5 ? 'orange' : 'green';
  return `<div style="color:${color}">ID: ${t.id}, Type: ${t.type}, Severity: ${t.severity}, Source: ${t.source}, Time: ${t.timestamp}</div>`;
}

function showAll() {
  if (threats.length === 0) {
    output("No threats reported.");
    return;
  }
  output(threats.map(t => formatThreat(t)).join("<hr>"));
}

function searchByID() {
  const id = parseInt(document.getElementById("searchID").value);
  const threat = threats.find(t => t.id === id);
  if (threat) {
    output("Found:<br>" + formatThreat(threat));
  } else {
    output("ID not found!");
  }
}

function showMaxSeverity() {
  if (threats.length === 0) {
    output("No threats.");
    return;
  }
  const max = Math.max(...threats.map(t => t.severity));
  const severe = threats.filter(t => t.severity === max);
  output(`Highest Severity = ${max}<br>` + severe.map(t => formatThreat(t)).join("<hr>"));
}

function clearAll() {
  threats = [];
  localStorage.removeItem('threats');
  output("All threats cleared!");
  updateSummary();
}

function updateSummary() {
  document.getElementById("totalCount").innerText = `Total Threats: ${threats.length}`;
  const max = threats.length ? Math.max(...threats.map(t => t.severity)) : "N/A";
  document.getElementById("maxSeverity").innerText = `Highest Severity: ${max}`;
}

function output(content) {
  document.getElementById("output").innerHTML = content;
}

updateSummary();
