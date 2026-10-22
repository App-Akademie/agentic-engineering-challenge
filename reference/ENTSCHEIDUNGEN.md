# Beispiel-Entscheidungsprotokoll

Dies ist eine didaktische Begründung der fertigen Referenz, **kein zeitgleich entstandenes Sitzungsprotokoll**. Lernende schreiben ihr eigenes Protokoll während der Arbeit und sichern tatsächliche Zwischenstände.

## Etappe 1 — Verbindlichkeit des Vertrags

**Wahl:** Zustandsübergänge, Fehlercodes, Idempotenz und Zeitgrenzen sind verbindlich. Interne Funktionsnamen sind es nicht. Der Report zählt aktuelle completed-Tasks.

**Grund:** Diese Verhaltensentscheidungen sind objektiv prüfbar und wirken auf bestehenden Code. Idempotenz nimmt dem Agenten die Entscheidung „Retry als Konflikt“ ab. Die Reportdefinition nimmt ihm die Entscheidung „alle nicht offenen Tasks zählen“ ab.

**Alternative:** Historische Abschlüsse auch nach Archivierung zählen. Das wäre fachlich möglich, gehört aber in einen anderen ausdrücklich formulierten Vertrag. Die Referenz behandelt keinen historischen Wochenbericht.

## Etappe 2 — Leichtestes ausreichendes Werkzeug

**Wahl:** Direkte lokale Definition `run_project_tests` mit festem Zielbereich. Echte Ausführung über `tools/run-tests.js`.

**Grund:** Der Agent benötigt nur Zugriff auf lokale Dateien und einen Testlauf. MCP würde hier kein zusätzliches Integrationsproblem lösen. Einen Skill nur für dieses eine Routenpaar einzuführen bringt wenig belegten Wiederverwendungsnutzen.

**Alternative:** Ein Skill wird sinnvoll, wenn ein wiederkehrender Ablauf samt Prüfregeln mehrfach gebraucht wird. MCP kann sinnvoll werden, wenn ein externer Testdienst über einen standardisierten Zugriff erreichbar sein soll. Mehrere Projekte sind keine zwingende Voraussetzung dafür.

## Etappe 3 — Kontext und Implementierungsstruktur

**Wahl:** Eine Map bleibt die Quelle des Zustands. Der Store entscheidet Übergänge; die Routen übersetzen HTTP. Die nächste Sitzung startet mit einer kurzen Handover-Notiz, Constitution, Spec und den benötigten Dateien.

**Grund:** Ein zweiter Archivspeicher würde hier unnötig zwei Datenzugriffspfade erzeugen. Ein kurzer aktueller Stand hält verbindliche Entscheidungen und Risiken sichtbar, ohne verworfene Pläne als aktuelle Anweisung zu übernehmen.

**Abwägung:** Verdichtung kann wichtige Informationen verlieren. Deshalb gehören offene Fragen und bekannte Grenzen ausdrücklich hinein. Der Nutzen wird in diesem Paket nicht als gemessener Effekt behauptet.

## Etappe 4 — Prüfung und Abnahme

**Wahl:** Kriterienweise prüfen, Bestand mitlesen, zusätzliche Grenzfälle suchen und jede Änderung erklären. Eine kontrollierte Demo zeigt, dass der Reporttest den alten Filter tatsächlich erkennt.

**Grund:** Die Baseline konnte den Zustand archived nicht kennen. Neue Endpunkte können grün getestet sein, während ein alter Endpunkt reaktiviert oder falsch zählt.

**Grenze:** Das Paket enthält keine tatsächlich getrennt gelaufene zweite Agentenprüfung. Die Demo ist bewusst eingebaut. Die eigene unabhängige Prüfsitzung muss bei der Bearbeitung stattfinden und dokumentiert werden.

## Abschlussreflexion

Der explizite Zustandsautomat und die injizierte Uhr lohnen sich hier, weil Zustandsübergänge und Zeitgrenzen den Vertrag tragen. Eine Datenbank, Authentifizierung oder ein Scheduler wären zusätzliche Vorhaben. Grüne Tests und der lokale API-Lauf decken die vereinbarten Fälle ab, ohne Mehrprozessbetrieb, Produktionslast oder Datenhaltbarkeit nachzuweisen.
