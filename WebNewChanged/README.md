# Unsre Speis Verwaltung

Diese kleine Demo beantwortet das Feedback der ersten Iteration und
vereinheitlicht das Erscheinungsbild aller Seiten.

### Änderungen

- **Startseite entfernt:** `index.html` leitet nun direkt auf die
  Bestandsabfrage weiter.
- **Bestandsabfrage erweitert:** Der Lagerbestand kann nun nach
  Lieferant gefiltert werden.
- **Einheitliches Layout:** Alle Bereiche nutzen eine Seitenleiste und
  "Card"-Sektionen für Formulare und Tabellen. Farben und Abstände
  folgen der CI-Vorgabe der Login-Seite.
- **Dokumentenverwaltung:** Admins können Dateien für Lieferanten
  hochladen. Lieferanten laden diese in ihrem Postfach herunter.
- **Chat-Funktion:** Nachrichten vom Admin an Lieferanten werden im
  Postfach angezeigt.
- **Neues Postfach:** Die Seite `postfach.html` bündelt Dokumente und
  Nachrichten pro Lieferant.
