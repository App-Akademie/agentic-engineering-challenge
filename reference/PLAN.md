# Bestätigter Referenzplan — didaktisches Muster

Dieser Plan beschreibt den Weg vom mitgelieferten Starter zur Referenz. Er ist ein Lehrartefakt und kein aufgezeichnetes Planungsereignis.

1. Bestandsverhalten ausführen und unverändert als gemeinsamen Vertrag erhalten. Die bestehende Zustandszählung als von der Erweiterung betroffen markieren.
2. Constitution und Spec verbindlich festhalten, einschließlich Idempotenz, Reportbedeutung, Complete-Schutz und inklusiver Zeitgrenze.
3. Den direkten Testaufruf einrichten und ausführen. Keine externe Anbindung hinzufügen.
4. Im Store das additive Feld `archivedAt` und `archiveTask()` ergänzen. Daten bleiben in derselben Map, IDs und Abschlusszeiten bleiben erhalten. Wiederholung gibt denselben Zustand zurück.
5. Einzelroute ergänzen; bestehende Liste, Statusvalidierung und Complete-Route gegen die neuen Regeln prüfen. Tests A1–A6 ausführen.
6. Den tatsächlichen Zwischenstand in einer Handover-Notiz sichern und in einer frischen Sitzung fortsetzen.
7. Bulk-Regel mit einmal ermitteltem `now` ergänzen. Schwelle vor Mutationen validieren. Inklusive Grenze, Wiederholung und Fehler mit kontrollierter Zeit testen.
8. Report explizit auf completed eingrenzen. Im separaten Prüfschritt vollständigen Diff, unveränderte Funktionen und jeden Spec-Punkt kontrollieren. Nach weiteren Lücken suchen.
9. Suite, lokalen Werkzeugaufruf und API-Ablauf ausführen. Eigene Nachweise speichern und Grenzen der Abnahme dokumentieren.

Der Plan gibt Reihenfolge und prüfbare Zwischenziele vor. Die absichtlich fehlerhafte Alternative aus dem Walkthrough wird nicht implementiert. Der Reportfehler lässt sich separat mit der temporären Demo reproduzieren.
