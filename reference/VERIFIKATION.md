# Verifikation der Referenz

## Reproduzieren

```sh
npm ci
npm run test:starter
npm run test:reference
npm run tool:check -- reference
npm run demo:regression
```

Die tatsächlichen Ausgaben aus der Erstellung liegen unter `evidence/`. In einer eigenen Abgabe eigene Ergebnisse mit Laufumgebung sichern. Diese Matrix beschreibt den Prüfumfang; sie behauptet keine unabhängig stattgefundene zweite Agentenprüfung.

## Kriterium → Nachweis

Die Tests tragen die Kriterienkennungen im Namen. Sie prüfen HTTP-Antworten und, wo nötig, den erneut gelesenen Zustand.

| Spec | Testdatei | Wesentliche Aussage |
|---|---|---|
| Bestand | `test-support/baseline.js`, in beiden Varianten ausgeführt | Anlegen, Lesen, Abschließen, Wiederholung, Fehlerformat, Filter und Report ohne Archivierung |
| A1 | `reference/test/archive.test.js` | Identität und Fachwerte bleiben erhalten; neuer Status und Zeitpunkt stimmen |
| A2 | dieselbe Datei | kompletter Task bei erneutem Archivieren unverändert, trotz weitergestellter Uhr |
| A3/A4 | dieselbe Datei | offener Task unverändert abgelehnt; unbekannte ID liefert 404 |
| A5 | dieselbe Datei | bestehender Complete-Endpunkt kann archived nicht zurücksetzen |
| A6 | dieselbe Datei | normale Liste und expliziter Archivfilter; Einzelabruf in A1 |
| A7 | dieselbe Datei | gemischter Store zählt nur completed |
| B1 | dieselbe Datei | alter Task und exakte Grenze treffen; 1 ms zu neuer, offener und archivierter Task bleiben unverändert |
| B2/B3 | dieselbe Datei | Wiederholung zählt 0 und erhält Zeitstempel; leerer Store zählt 0 |
| B4/B5 | dieselbe Datei | ungültige Eingaben ändern nichts; maximale erlaubte Schwelle gültig |
| B6 | dieselbe Datei | 24-Stunden-Grenze auch über eine Zeitumstellung |
| C1/C2/C3 | dieselbe Datei | Kopien schützen Zustand, direkte Bulk-Validierung, getrennte Stores |
| Fehlerdemo | `demos/report-regression.test.js` | alter Reportfilter scheitert an einem konkreten Gegenbeispiel |

## Gegenbeispiele, die die Baseline nicht kannte

1. Einen abgeschlossenen Task archivieren und erneut abschließen: ohne A5 kann er wieder completed werden.
2. Archivierten Task im Report zählen: die alte Negation von open ist nach Erweiterung nicht mehr gleichbedeutend mit completed.
3. Genau an der Altersgrenze oder 1 ms daneben archivieren: ohne feste Uhr bleibt ein Vergleich leicht unpräzise.

Die Referenztests decken diese Fälle ab. Das ist ein didaktischer Prüfentwurf; es wird kein tatsächlicher Entdeckungsverlauf erfunden.

## Diff lesen

`evidence/starter-to-reference.diff` vergleicht die ausführbaren Quellen. Neue Featuretests und Dokumente zusätzlich selbst lesen. Der Abgabe-Diff der Lernenden soll alle eigenen Änderungen gegenüber ihrem echten Ausgangsstand enthalten.

Prüfe besonders den bestehenden Complete-Endpunkt, die Liste und den Report. Eine unveränderte Funktion erscheint nicht zwingend im Diff; lies daher auch die relevanten Bestandsdateien.

## Aussagegrenzen

Keine Persistenz-, Authentifizierungs-, Last- oder Mehrprozessgarantie. Die direkte Testtool-Definition wurde lokal ausgeführt; sie wird nicht automatisch von einem Host entdeckt. Ein unabhängiger Prüfer und ein wirklicher Sitzungswechsel müssen im Lernendendurchlauf zusätzlich nachgewiesen werden.
