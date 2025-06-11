const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

const DATA_FILE = path.join(__dirname, 'data.json');

function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ lieferanten: [], produkte: [] }, null, 2));
  }
  const raw = fs.readFileSync(DATA_FILE);
  return JSON.parse(raw);
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Lieferanten API
app.get('/api/lieferanten', (req, res) => {
  const data = loadData();
  res.json(data.lieferanten);
});

app.post('/api/lieferanten', (req, res) => {
  const data = loadData();
  const { name, password } = req.body;
  if (!name || !password) return res.status(400).json({ error: 'Name und Passwort erforderlich' });
  const newLieferant = { id: Date.now(), name, aktiv: true };
  data.lieferanten.push(newLieferant);
  saveData(data);
  res.json(newLieferant);
});

app.patch('/api/lieferanten/:id', (req, res) => {
  const data = loadData();
  const lieferant = data.lieferanten.find(l => l.id == req.params.id);
  if (!lieferant) return res.status(404).json({ error: 'Lieferant nicht gefunden' });
  lieferant.aktiv = !lieferant.aktiv;
  saveData(data);
  res.json(lieferant);
});

// Produkte API
app.get('/api/produkte', (req, res) => {
  const data = loadData();
  res.json(data.produkte);
});

app.post('/api/produkte', (req, res) => {
  const data = loadData();
  const { name, preis, lieferant } = req.body;
  if (!name || typeof preis !== 'number' || !lieferant) return res.status(400).json({ error: 'Ungültige Daten' });
  const newProdukt = { id: Date.now(), name, preis, bestand: 0, verkauf: 0, letzterVerkauf: '-', lieferant };
  data.produkte.push(newProdukt);
  saveData(data);
  res.json(newProdukt);
});

app.delete('/api/produkte/:id', (req, res) => {
  const data = loadData();
  const index = data.produkte.findIndex(p => p.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Produkt nicht gefunden' });
  data.produkte.splice(index, 1);
  saveData(data);
  res.json({ ok: true });
});

app.get('/api/inventur', (req, res) => {
  const data = loadData();
  const inventory = data.produkte.map(p => ({ name: p.name, bestand: p.bestand }));
  res.json(inventory);
});

app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
