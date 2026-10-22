# Projekt-Constitution

## Architektonische Grundentscheidung

- Nur `taskStore.js` besitzt und verändert die Task-Daten. HTTP-Routen übersetzen Eingaben und Ergebnisse; sie greifen nicht auf die interne Map zu.
- Jede App erhält ihren eigenen Store. Die Zeitquelle wird dem Store injiziert, damit zeitabhängige Regeln ohne Warten prüfbar sind.
- Der Store gibt Kopien zurück. Aufrufende können damit keinen Zustand an den Regeln vorbei verändern.

## Durchgängige Konvention

- JSON-Fehler haben die Form `{ "error": { "code": "…", "message": "…" } }`.
- IDs sind unveränderlich; Zeitpunkte sind UTC-ISO-Zeichenketten. Die API verwendet englische Feldnamen und Fehlercodes.
- Normale Übergänge verlaufen `open → completed → archived`. Wiederholung einer bereits erfolgreichen Aktion darf als identitätsgleicher No-op ausdrücklich vereinbart werden.
- Tests erhalten einen frischen Store. Zeitabhängige Featuretests verwenden eine kontrollierte Uhr.

## Harte Grenze

- Kein Überspringen oder Zurücksetzen der Zustände. Insbesondere darf der bestehende Complete-Endpunkt keinen archivierten Task reaktivieren.
- Keine Zustandsänderung bei ungültigem Auftrag. Validierung muss vor Mutation erfolgen; für Bulk gilt dieselbe Regel auch bei direktem Store-Aufruf.
- Keine externe Übertragung von Task-Daten, kein neuer Dienst und keine neue produktive Infrastruktur für diese Übung.

Diese Regeln gelten für den finalen Beispielstand. Die Constitution wird vor der Featurearbeit aus dem Starter und dem gewünschten Zielzustand abgeleitet; sie behauptet nicht, dass der Starter bereits alle zukünftigen Zustände implementiert.
