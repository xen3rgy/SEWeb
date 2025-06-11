const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'Unsre_Speis_Website_FUNKTIONAL')));

function loadData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (e) {
    return { lieferanten: [], produkte: [] };
  }
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get('/api/lieferanten', (req, res) => {
  const data = loadData();
  res.json(data.lieferanten);
});

app.post('/api/lieferanten', (req, res) => {
  const data = loadData();
  const neu = { id: Date.now(), name: req.body.name, aktiv: true };
  data.lieferanten.push(neu);
  saveData(data);
  res.json(neu);
});

app.put('/api/lieferanten/:id/toggle', (req, res) => {
  const data = loadData();
  const lieferant = data.lieferanten.find(l => l.id == req.params.id);
  if (!lieferant) return res.sendStatus(404);
  lieferant.aktiv = !lieferant.aktiv;
  saveData(data);
  res.json(lieferant);
});

app.get('/api/produkte', (req, res) => {
  const data = loadData();
  res.json(data.produkte);
});

app.post('/api/produkte', (req, res) => {
  const data = loadData();
  const neu = {
    id: Date.now(),
    name: req.body.name,
    preis: parseFloat(req.body.preis) || 0,
    bestand: 0,
    verkauf: 0,
    letzterVerkauf: '-',
    lieferant: req.body.lieferant
  };
  data.produkte.push(neu);
  saveData(data);
  res.json(neu);
});

app.delete('/api/produkte/:id', (req, res) => {
  const data = loadData();
  const idx = data.produkte.findIndex(p => p.id == req.params.id);
  if (idx === -1) return res.sendStatus(404);
  data.produkte.splice(idx, 1);
  saveData(data);
  res.sendStatus(204);
});

app.get('/api/inventur', (req, res) => {
  const data = loadData();
  res.json(data.produkte.map(p => ({ name: p.name, bestand: p.bestand })));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
