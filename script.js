
// --- Daten (wird im RAM gespeichert) ---
const lieferanten = [
    { id: 1, name: "Fam. Lassnig", aktiv: true },
    { id: 2, name: "Bauernhof Knafl", aktiv: true },
    { id: 3, name: "Bio Hof Steiner", aktiv: false }
];

let produkte = [
    { id: 101, name: "Speckware", preis: 3.1, bestand: 15, verkauf: 42, letzterVerkauf: "2025-06-09 09:07", lieferant: "Fam. Lassnig" },
    { id: 102, name: "Streichwurst", preis: 2.6, bestand: 8, verkauf: 21, letzterVerkauf: "2025-06-10 12:05", lieferant: "Fam. Lassnig" },
    { id: 103, name: "Zirbenansatz", preis: 4.5, bestand: 5, verkauf: 3, letzterVerkauf: "2025-06-08 14:22", lieferant: "Bauernhof Knafl" }
];

// --- Produktverwaltung ---
function initProdukte() {
    const lieferantenSelect = document.getElementById("produkt-lieferant");
    const produktSelect = document.getElementById("produkt-auswahl");
    lieferanten.forEach(l => {
        let opt = document.createElement("option");
        opt.value = l.name;
        opt.textContent = l.name;
        lieferantenSelect.appendChild(opt);
    });

    lieferantenSelect.addEventListener("change", () => {
        const selected = lieferantenSelect.value;
        produktSelect.innerHTML = "";
        produkte.filter(p => p.lieferant === selected).forEach(p => {
            let opt = document.createElement("option");
            opt.value = p.id;
            opt.textContent = p.name;
            produktSelect.appendChild(opt);
        });
        updateProduktInfo();
    });

    produktSelect.addEventListener("change", updateProduktInfo);
    lieferantenSelect.dispatchEvent(new Event("change"));
}

function updateProduktInfo() {
    const produktID = document.getElementById("produkt-auswahl").value;
    const produkt = produkte.find(p => p.id == produktID);
    if (!produkt) return;
    document.getElementById("preis").value = produkt.preis.toFixed(2) + " €";
    document.getElementById("bestand").value = produkt.bestand + " Stk";
    document.getElementById("verkauft").value = produkt.verkauf;
    document.getElementById("umsatz").value = (produkt.verkauf * produkt.preis).toFixed(2) + " €";
    document.getElementById("verkauf-seit").value = Math.floor(produkt.verkauf / 2);
    document.getElementById("letzter-verkauf").value = produkt.letzterVerkauf;
}

function loescheProdukt() {
    const id = document.getElementById("produkt-auswahl").value;
    produkte = produkte.filter(p => p.id != id);
    initProdukte();
}

function neuesProdukt() {
    const id = Date.now();
    const name = document.getElementById("neu-name").value;
    const preis = parseFloat(document.getElementById("neu-preis").value);
    const lieferant = document.getElementById("produkt-lieferant").value;
    if (!name || isNaN(preis)) return alert("Bitte gültige Eingaben machen.");
    produkte.push({ id, name, preis, bestand: 0, verkauf: 0, letzterVerkauf: "-", lieferant });
    initProdukte();
}

// --- Lieferantenverwaltung ---
function initLieferanten() {
    const select = document.getElementById("lieferant-auswahl");
    lieferanten.forEach(l => {
        let opt = document.createElement("option");
        opt.value = l.name;
        opt.textContent = l.name;
        select.appendChild(opt);
    });

    select.addEventListener("change", updateLieferantInfo);
    select.dispatchEvent(new Event("change"));
}

function updateLieferantInfo() {
    const name = document.getElementById("lieferant-auswahl").value;
    const lieferant = lieferanten.find(l => l.name === name);
    if (!lieferant) return;
    const zugeordnet = produkte.filter(p => p.lieferant === name);
    document.getElementById("lieferant-id").value = lieferant.id;
    document.getElementById("lieferant-status").value = lieferant.aktiv ? "Aktiv" : "Inaktiv";
    document.getElementById("lieferant-produkte").value = zugeordnet.length;
    document.getElementById("lieferant-bestand").value = zugeordnet.reduce((sum, p) => sum + p.bestand, 0);
    document.getElementById("lieferant-umsatz").value = zugeordnet.reduce((sum, p) => sum + (p.preis * p.verkauf), 0).toFixed(2) + " €";
}

function toggleLieferantStatus() {
    const name = document.getElementById("lieferant-auswahl").value;
    const lieferant = lieferanten.find(l => l.name === name);
    if (lieferant) {
        lieferant.aktiv = !lieferant.aktiv;
        updateLieferantInfo();
    }
}

function neuerLieferant() {
    const id = Date.now();
    const name = document.getElementById("neu-lieferant-name").value;
    const pw = document.getElementById("neu-lieferant-pw").value;
    if (!name || !pw) return alert("Bitte gültige Eingaben machen.");
    lieferanten.push({ id, name, aktiv: true });
    location.reload();
}

// --- Inventur dynamisch ---
function ladeInventurTabelle() {
    const tbody = document.getElementById("inventur-tbody");
    tbody.innerHTML = "";
    produkte.forEach(p => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${p.name}</td><td>${p.bestand}</td>`;
        tbody.appendChild(row);
    });
}
