# Unsre Speis Verwaltung

Dies ist eine einfache Beispielanwendung zur Verwaltung eines Selbstbedienungsladens. Sie beinhaltet eine kleine Website (HTML/CSS/JS) sowie ein Node.js Backend zur Speicherung der Daten.

## Starten der Anwendung

1. Abhängigkeiten installieren:
   ```bash
   npm install
   ```
2. Server starten:
   ```bash
   node server.js
   ```
3. Die Webseite steht anschließend unter `http://localhost:3000` zur Verfügung.

## Funktionen

- **Lieferanten verwalten** – Anlegen neuer Lieferanten und Aktivieren/Deaktivieren bestehender.
- **Produkte verwalten** – Produkte anlegen oder löschen und Bestände einsehen.
- **Inventur anzeigen** – Übersicht aller Produkte und ihrer Lagerbestände.

Alle Daten werden lokal in der Datei `data.json` gespeichert.
