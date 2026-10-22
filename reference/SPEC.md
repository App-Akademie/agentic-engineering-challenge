# Spec: Archivierung erledigter Tasks

Status: verbindlicher Referenzvertrag. Produktentscheidungen zuerst in diesem Dokument ändern, danach Plan, Code und Nachweise anpassen. Die Referenz wählt Archivierung als Statuswechsel am bestehenden Task.

## Bestand und Daten

`POST /tasks`, `GET /tasks`, `GET /tasks/:id`, `POST /tasks/:id/complete` und `GET /report/summary` bleiben verfügbar. Bestehende Antworten erhalten lediglich das additive Feld `archivedAt`, zunächst `null`. Der Report ist in dieser ausführbaren Variante eine **aktuelle Zustandszählung**, kein historischer Wochenbericht.

Ein Task enthält `id`, `title`, `status`, `createdAt`, `completedAt`, `archivedAt`. IDs, Titel, Erstell- und Abschlusszeit bleiben beim Archivieren erhalten. Es gibt keine Löschung, kein Verschieben in einen zweiten Store und keine Reaktivierung. Alle erfolgreichen Featureantworten verwenden HTTP 200.

## Einzel-Archivierung

| ID | Fall | Verbindliches Ergebnis |
|---|---|---|
| A1 | `POST /tasks/:id/archive` auf completed | derselbe Task wird archived, `archivedAt = now`, Antwort enthält gesamten Task |
| A2 | derselbe Aufruf auf archived | identische Taskantwort, insbesondere unverändertes `archivedAt` |
| A3 | Aufruf auf open | 409, `not_completed`, keinerlei Mutation |
| A4 | unbekannte ID | 404, `not_found` |
| A5 | `POST /tasks/:id/complete` auf archived | 409, `invalid_transition`, keinerlei Mutation |
| A6 | Liste ohne Filter / mit `status=archived` | archivierte Tasks fehlen ohne Filter und erscheinen mit explizitem Filter; Einzelabruf bleibt möglich |
| A7 | Report nach Archivierung | zählt ausschließlich den aktuellen Status completed; open und archived zählen nicht |

Ein zweites Complete auf completed bleibt unverändert erfolgreich. Ein unbekannter Statusfilter liefert weiter 400, `invalid_status`. Alle Fehler verwenden `{ error: { code, message } }`. Die Codes sind verbindlich; der englische Erklärungstext darf anders formuliert sein.

## Bulk-Archivierung

`POST /tasks/archive-completed` erwartet einen JSON-Body mit `olderThanDays`.

| ID | Fall | Verbindliches Ergebnis |
|---|---|---|
| B1 | gültige Altersangabe n | archiviert genau completed-Tasks mit `completedAt <= now - n × 86.400.000 ms`; Grenze ist inklusive |
| B2 | Wiederholung ohne neue passende Tasks | `{ archivedCount: 0 }`, zuvor archivierte Tasks einschließlich Zeitstempel bleiben unverändert |
| B3 | kein Treffer / leerer Store | `{ archivedCount: 0 }` |
| B4 | fehlender, nichtnumerischer, nichtganzzahliger, nichtpositiver oder zu großer Wert | 400, `invalid_threshold`; kein Task verändert sich |
| B5 | maximal unterstützter Wert | ganzzahliger Wert bis einschließlich `floor(Number.MAX_SAFE_INTEGER / 86.400.000)` ist gültig |
| B6 | Zeitzonen und Sommerzeit | ein Tag bedeutet exakt 24 verstrichene Stunden; keine Kalendertage oder lokale Mitternachtsgrenzen |

Gültige Eingaben sind JavaScript-safe Integer im benannten Bereich; Zeichenketten wie `"7"`, boolesche Werte und `null` werden nicht umgewandelt. Der Bulk-Aufruf ermittelt `now` genau einmal und verwendet denselben Archivierungszeitpunkt für alle Treffer. Neuere completed-Tasks, open-Tasks und bereits archivierte Tasks bleiben unverändert. Die Antwort zählt nur die in diesem Aufruf neu archivierten Tasks.

## Ergänzende Integritätskriterien

- C1: Rückgabewerte erlauben keine Mutation des gespeicherten Zustands.
- C2: Direkte Bulk-Aufrufe auf dem Repository lehnen ungültige Werte ebenfalls vor Änderungen ab.
- C3: Tests und App-Instanzen teilen keinen globalen Task-Store.

## Stille Entscheidungen, die diese Spec verhindert

1. A2 verhindert die plausible Wahl „zweiter Archivierungsversuch = Konflikt“ oder ein neues `archivedAt` bei jedem Retry.
2. A7 verhindert die plausible Beibehaltung von `status !== 'open'` im bestehenden Report.
3. B1/B6 verhindern einen exklusiven Vergleich oder eine lokale Kalendertagsinterpretation.
4. A5 verhindert, dass nur die neuen Endpunkte geprüft werden und ein alter Endpunkt den neuen Zustand wieder aufhebt.

## Bewusste Grenzen

Ein lokaler Prozess und In-Memory-Speicher. Kein Benutzer-/Rechtemodell, keine Persistenz, keine Produktionslast, keine asynchronen Transaktionen, kein Scheduler. Die Referenz ergänzt die HTTP-API um eine Browser-Oberfläche unter `/`. Archivierung entfernt abgeschlossene Tasks bewusst aus der aktuellen Reportzählung; das ist keine Behauptung über historische Auswertungen oder vermiedene Doppelzählungen.

## Browser-Oberfläche

Die Referenz liefert unter `/` eine Oberfläche ohne zusätzlichen Build-Schritt oder neue Abhängigkeiten aus. Sie nutzt ausschließlich die vorhandenen API-Endpunkte und verändert Task-Daten nicht direkt. Nutzende können Tasks anlegen, offene Tasks abschließen und abgeschlossene Tasks archivieren. Filter zeigen aktive Tasks (open/completed) oder einen einzelnen Status einschließlich archived. Archivierte Tasks bleiben lesbar und erhalten keine weiteren Zustandsaktionen. Leere Listen, laufende Anfragen und Fehler sind sichtbar; Task-Titel werden als Text ausgegeben. Der Starter bleibt unverändert. Alle API-Verträge gelten weiterhin; unbekannte Routen liefern weiterhin den JSON-Fehler `not_found`.

Eine einfache Checkliste ergänzt acht Arbeitsschritte mit Prompts für mindestens zwei echte Bearbeitungssitzungen, eine frische Prüfung und die Abnahme. Die Inhalte folgen Aufgabenstellung und Promptvorlagen; gearbeitet wird in `starter/`. Persönliche Häkchen bleiben nach dem Neuladen im selben Browser erhalten, soweit dessen lokaler Speicher verfügbar ist. Ohne Speicher bleibt die Checkliste bis zum Neuladen benutzbar. Prompts lassen sich kopieren oder bei gesperrter Zwischenablage manuell markieren. Task-Anfragen sperren keine Checklistenelemente. Häkchen sind keine Nachweise für tatsächlich ausgeführte Arbeit.
