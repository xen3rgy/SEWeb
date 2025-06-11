let lieferanten = [];
let produkte = [];

async function ladeDaten() {
  const lRes = await fetch('/api/lieferanten');
  lieferanten = await lRes.json();
  const pRes = await fetch('/api/produkte');
  produkte = await pRes.json();
}

// --- Produktverwaltung ---
async function initProdukte() {
  await ladeDaten();
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
  await fetch('/api/produkte/' + id, { method: 'DELETE' });
  initProdukte();
}

async function neuesProdukt() {
  const name = document.getElementById('neu-name').value;
  const preis = parseFloat(document.getElementById('neu-preis').value);
  const lieferant = document.getElementById('produkt-lieferant').value;
  if (!name || isNaN(preis)) return alert('Bitte gültige Eingaben machen.');
  await fetch('/api/produkte', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, preis, lieferant })
  });
  initProdukte();
}

// --- Lieferantenverwaltung ---
async function initLieferanten() {
  await ladeDaten();
  const select = document.getElementById('lieferant-auswahl');
  select.innerHTML = '';
  lieferanten.forEach(l => {
    let opt = document.createElement('option');
    opt.value = l.id;
    opt.textContent = l.name;
    select.appendChild(opt);
  });

  select.addEventListener('change', updateLieferantInfo);
  select.dispatchEvent(new Event('change'));
}

function updateLieferantInfo() {
  const id = document.getElementById('lieferant-auswahl').value;
  const lieferant = lieferanten.find(l => l.id == id);
  if (!lieferant) return;
  const zugeordnet = produkte.filter(p => p.lieferant === lieferant.name);
  document.getElementById('lieferant-id').value = lieferant.id;
  document.getElementById('lieferant-status').value = lieferant.aktiv ? 'Aktiv' : 'Inaktiv';
  document.getElementById('lieferant-produkte').value = zugeordnet.length;
  document.getElementById('lieferant-bestand').value = zugeordnet.reduce((sum, p) => sum + p.bestand, 0);
  document.getElementById('lieferant-umsatz').value = zugeordnet.reduce((sum,p) => sum + (p.preis * p.verkauf), 0).toFixed(2) + ' €';
}

async function toggleLieferantStatus() {
  const id = document.getElementById('lieferant-auswahl').value;
  await fetch('/api/lieferanten/' + id + '/toggle', { method: 'PUT' });
  initLieferanten();
}

async function neuerLieferant() {
  const name = document.getElementById('neu-lieferant-name').value;
  const pw = document.getElementById('neu-lieferant-pw').value;
  if (!name || !pw) return alert('Bitte gültige Eingaben machen.');
  await fetch('/api/lieferanten', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });
  initLieferanten();
}

// --- Inventur dynamisch ---
async function ladeInventurTabelle() {
  const res = await fetch('/api/inventur');
  const daten = await res.json();
  const tbody = document.getElementById('inventur-tbody');
  tbody.innerHTML = '';
  daten.forEach(p => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${p.name}</td><td>${p.bestand}</td>`;
    tbody.appendChild(row);
  });
}
