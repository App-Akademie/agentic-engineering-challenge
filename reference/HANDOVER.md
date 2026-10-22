# Handover — Beispiel eines Zwischenstands nach Sitzung 1

**Lehrmuster:** Diese Notiz beschreibt eine gedachte Unterbrechung nach der Einzel-Archivierung. Sie ist nicht der aktuelle Zustand des fertigen `reference/`-Ordners und behauptet keinen realen vergangenen Sitzungswechsel. Bei der eigenen Arbeit durch eine tatsächlich geschriebene Zwischenstandnotiz ersetzen.

## Verbindlicher Stand

- Constitution und Spec sind festgelegt; bei Konflikten zuerst dort nachlesen.
- Archivierung ist ein Statuswechsel am selben Task, keine zweite Map.
- Wiederholung ist identisch erfolgreich; `archivedAt` bleibt unverändert.
- Der Report soll aktuelle completed-Tasks zählen, keine historischen Abschlüsse.
- Ein archivierter Task darf nicht über den Complete-Endpunkt reaktiviert werden.
- Ein Tag bedeutet 24 Stunden; die Bulk-Altersgrenze ist inklusive.

## Angenommener Arbeitsstand für dieses Muster

- Einzel-Archivierung, Liste und Complete-Schutz sind implementiert.
- A1–A6 sind für diesen gedachten Stand geschrieben. Hier ist absichtlich **keine erfundene Testausgabe** eingetragen; im echten Handover Befehl und tatsächliches Ergebnis verlinken.
- Relevante Dateien: `src/taskStore.js`, `src/app.js`, dazu die Featuretests.

## Offen

- Bulk-Archivierung implementieren und B1–B6 prüfen.
- Reportbedingung im Bestand prüfen und A7 ergänzen.
- Vollständigen Diff unabhängig prüfen lassen, einschließlich unveränderter Bestandsfunktionen.
- Eigene Testausgaben, Kriterienmatrix und Abschlussreflexion sichern.

## Bekannte Grenzen und nächste Aktion

In-Memory-Daten gehen beim Neustart verloren. Es gibt keine Anmeldung. Die Baseline allein deckt den dritten Zustand nicht ab.

Nächster Auftrag: Lies Constitution, Spec und Store. Erstelle einen kurzen Plan ausschließlich für die offene Bulk-Arbeit. Verwende eine injizierte Uhr und keine Wartezeiten in Tests.
