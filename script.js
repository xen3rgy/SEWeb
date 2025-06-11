// API Helper functions
async function getJSON(url) {
  const res = await fetch(url);
  return res.json();
}
async function postJSON(url, data) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}
async function patchJSON(url) {
  const res = await fetch(url, { method: 'PATCH' });
  return res.json();
}
async function deleteReq(url) {
  const res = await fetch(url, { method: 'DELETE' });
  return res.json();
}

let lieferanten = [];
let produkte = [];

// --- Produktverwaltung ---
async function initProdukte() {
  lieferanten = await getJSON('/api/lieferanten');
  produkte = await getJSON('/api/produkte');
  const lieferantenSelect = document.getElementById('produkt-lieferant');
  const produktSelect = document.getElementById('produkt-auswahl');
  lieferantenSelect.innerHTML = '';
  lieferanten.forEach(l => {
    let opt = document.createElement('option');
    opt.value = l.name;
    opt.textContent = l.name;
    lieferantenSelect.appendChild(opt);
  });
  lieferantenSelect.addEventListener('change', () => {
    const selected = lieferantenSelect.value;
    produktSelect.innerHTML = '';
    produkte.filter(p => p.lieferant === selected).forEach(p => {
      let opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = p.name;
      produktSelect.appendChild(opt);
    });
    updateProduktInfo();
  });
  produktSelect.addEventListener('change', updateProduktInfo);
  lieferantenSelect.dispatchEvent(new Event('change'));
}

function updateProduktInfo() {
  const produktID = document.getElementById('produkt-auswahl').value;
  const produkt = produkte.find(p => p.id == produktID);
  if (!produkt) return;
  document.getElementById('preis').value = produkt.preis.toFixed(2) + ' €';
  document.getElementById('bestand').value = produkt.bestand + ' Stk';
  document.getElementById('verkauft').value = produkt.verkauf;
  document.getElementById('umsatz').value = (produkt.verkauf * produkt.preis).toFixed(2) + ' €';
  document.getElementById('verkauf-seit').value = Math.floor(produkt.verkauf / 2);
  document.getElementById('letzter-verkauf').value = produkt.letzterVerkauf;
}

async function loescheProdukt() {
  const id = document.getElementById('produkt-auswahl').value;
  await deleteReq('/api/produkte/' + id);
  await initProdukte();
}

async function neuesProdukt() {
  const name = document.getElementById('neu-name').value;
  const preis = parseFloat(document.getElementById('neu-preis').value);
  const lieferant = document.getElementById('produkt-lieferant').value;
  if (!name || isNaN(preis)) return alert('Bitte gültige Eingaben machen.');
  await postJSON('/api/produkte', { name, preis, lieferant });
  await initProdukte();
}

// --- Lieferantenverwaltung ---
async function initLieferanten() {
  lieferanten = await getJSON('/api/lieferanten');
  produkte = await getJSON('/api/produkte');
  const select = document.getElementById('lieferant-auswahl');
  select.innerHTML = '';
  lieferanten.forEach(l => {
    let opt = document.createElement('option');
    opt.value = l.name;
    opt.textContent = l.name;
    select.appendChild(opt);
  });
  select.addEventListener('change', updateLieferantInfo);
  select.dispatchEvent(new Event('change'));
}

function updateLieferantInfo() {
  const name = document.getElementById('lieferant-auswahl').value;
  const lieferant = lieferanten.find(l => l.name === name);
  if (!lieferant) return;
  const zugeordnet = produkte.filter(p => p.lieferant === name);
  document.getElementById('lieferant-id').value = lieferant.id;
  document.getElementById('lieferant-status').value = lieferant.aktiv ? 'Aktiv' : 'Inaktiv';
  document.getElementById('lieferant-produkte').value = zugeordnet.length;
  document.getElementById('lieferant-bestand').value = zugeordnet.reduce((sum, p) => sum + p.bestand, 0);
  document.getElementById('lieferant-umsatz').value = zugeordnet.reduce((sum, p) => sum + (p.preis * p.verkauf), 0).toFixed(2) + ' €';
}

async function toggleLieferantStatus() {
  const name = document.getElementById('lieferant-auswahl').value;
  const lieferant = lieferanten.find(l => l.name === name);
  if (!lieferant) return;
  await patchJSON('/api/lieferanten/' + lieferant.id);
  await initLieferanten();
}

async function neuerLieferant() {
  const name = document.getElementById('neu-lieferant-name').value;
  const pw = document.getElementById('neu-lieferant-pw').value;
  if (!name || !pw) return alert('Bitte gültige Eingaben machen.');
  await postJSON('/api/lieferanten', { name, password: pw });
  await initLieferanten();
}

// --- Inventur dynamisch ---
async function ladeInventurTabelle() {
  const data = await getJSON('/api/inventur');
  const tbody = document.getElementById('inventur-tbody');
  tbody.innerHTML = '';
  data.forEach(p => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${p.name}</td><td>${p.bestand}</td>`;
    tbody.appendChild(row);
  });
}
